import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './note.schema';
import { Model } from 'mongoose';
import { CreateNoteInput } from './dto/create-note.input';
import { ProjectService } from 'src/project/project.service';
import { CreateNoteAttachmentInput } from './dto/create-attachment.input';

@Injectable()
export class NoteService {

    constructor(@InjectModel(Note.name) private noteModel: Model<Note>,
        @Inject(forwardRef(() => ProjectService))
        private projectService: ProjectService) { }

    async create(userId: string, input: CreateNoteInput): Promise<Note> {
        await this.projectService.assertOwnership(input.projectId, userId);
        const newNote = new this.noteModel({ ...input, ownerId: userId });
        return newNote.save();
    }

    async removeNote(noteId: string, userId: string) {

        const note = await this.assertUserNoteOwnership(noteId, userId);

        await this.noteModel.findByIdAndDelete(noteId).exec();
        return true;
    }

    async addAttachmentToNote(userId: string, input: CreateNoteAttachmentInput): Promise<Note> {
        const note = await this.assertUserNoteOwnership(input.noteId, userId);

        const attachmentToAdd = {
            id: crypto.randomUUID(),
            name: input.name,
            url: input.url,
            mime: input.mime,
            size: input.size
        };

        note.attachments.push(attachmentToAdd);
        return note.save()
    }

    async removeAttachmentFromNote(userId: string, noteId: string, attachmentId: string): Promise<Note> {
        const note = await this.assertUserNoteOwnership(noteId, userId);

        const attachmentIndex = note.attachments.findIndex(att => att.id === attachmentId);

        if (attachmentIndex === -1) {
            return note;
        }
        note.attachments.splice(attachmentIndex, 1);

        return note.save();
    }

    async assertUserNoteOwnership(noteId: string, userId: string) {
        const note = await this.noteModel.findById(noteId).exec();

        if (!note) throw new NotFoundException("The note isn't found");

        if (note.ownerId !== userId) {
            throw new ForbiddenException("You are not the owner of this Note");
        }
        return note;
    }

    async searchNotes(userId: string, query: string): Promise<Note[]> {
        return this.noteModel.find({
            ownerId: userId,
            $text: { $search: query },
           // score: { $meta: "textScore" }
        })
            .sort({ score: { $meta: 'textScore' } })
            .limit(10)
            .exec();
    }

    async findByProject(projectId: string): Promise<Note[]> {
        return this.noteModel.find({ projectId }).exec();
    }

    async findByOwner(ownerId: string): Promise<Note[]> {
        return this.noteModel.find({ ownerId }).exec();
    }

    async update(id: string, data: Partial<Note>): Promise<Note | null> {
        return this.noteModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<Note | null> {
        return this.noteModel.findByIdAndDelete(id).exec();
    }

    async removeAllByProjectId(projectId: string): Promise<void> {
        await this.noteModel.deleteMany({ projectId: projectId }).exec();
    }

    async countByProject(projectId: string): Promise<number> {
        return this.noteModel.countDocuments({ projectId: projectId }).exec();
    }

}
function uuidv4() {
    throw new Error('Function not implemented.');
}

