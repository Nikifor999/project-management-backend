import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './note.schema';
import { Model } from 'mongoose';

@Injectable()
export class NoteService {
    
    countByProject(projectId: string): number | PromiseLike<number> {
       return 0;
    }

    constructor(@InjectModel(Note.name) private noteModel: Model<Note>) { }

    async create(data: Partial<Note>): Promise<Note> {
        const note = new this.noteModel(data);
        return note.save();
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
    await this.noteModel.deleteMany({ projectId: projectId });
  }

}
