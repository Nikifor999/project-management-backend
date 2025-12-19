import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NoteVisibility } from './note.visibility';
import { HydratedDocument } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {

    @Prop({ required: true })
    projectId: string;

    @Prop({ required: true })
    ownerId: string;

    @Prop({ required: true })
    title: string;

    @Prop()
    content?: string;

    @Prop({
        type: [{
            id: String,
            name: String,
            url: String,
            mime: String,
            size: Number
        }]
    })
    attachments: Array<{
        id: string;
        name: string;
        url: string;
        mime: string;
        size: number
    }>;

    @Prop({ type: [String], default: [] })
    labels: string[];

    @Prop({ default: false })
    pinned: boolean;

    @Prop({ default: 0 })
    position: number;

    @Prop({
        type: String,
        enum: NoteVisibility,
        default: NoteVisibility.PRIVATE,
    })
    visibility: NoteVisibility;

    @Prop({ default: false })
    isArchived: boolean;

    @Prop()
    trashedAt?: Date;

    @Prop()
    reminderAt?: Date;

    @Prop({ default: false })
    reminderSent: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
