import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { CreateProjectInput } from './dto/create-project.input';
import { User } from 'src/user/user.entity';
import { UpdateProjectInput } from './dto/update-project.input';
import { NoteService } from 'src/note/note.service';

@Injectable()
export class ProjectService {

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,

        @Inject(forwardRef(() => NoteService))
        private readonly noteService: NoteService,
    ) { }

    async getUserProjects(userId: string): Promise<Project[]> {
        return this.projectRepository.find({
            where: { user: { id: userId } },
            order: { createdDate: 'DESC' },
        })
    }

    async createProject(userId: string, input: CreateProjectInput): Promise<Project> {

        const newProject = this.projectRepository.create({
            ...input,
            user: { id: userId } as User,
        });

        return await this.projectRepository.save(newProject);
    }

    async updateProject(userId: string, projectId: string,
        input: UpdateProjectInput): Promise<Project> {

        const project = await this.assertOwnership(projectId, userId);
        if (input.name !== undefined) project.name = input.name;
        if (input.description !== undefined) project.description = input.description;
        return this.projectRepository.save(project);
    }

    async assertOwnership(projectId: string, userId: string): Promise<Project> {
        const project = await this.projectRepository.findOneOrFail({
            where: { id: projectId },
            relations: ['user']
        });

        if (!project.user) {
            throw new ForbiddenException('Project has no owner');
        }

        if (project.user.id !== userId) {
            throw new ForbiddenException('You are not the owner of this project');
        }
        return project;
    }

    async removeProject(projectId: string, userId: string) {
        const project = await this.assertOwnership(projectId, userId);

        try {
            await this.noteService.removeAllByProjectId(project.id);
        } catch (err) {
            console.error(`Failed to cleanup notes for project ${projectId}`, err);
        }

        await this.projectRepository.remove(project);

        return true;
    }

    async archiveProject(projectId: string): Promise<Project> {
        const project = await this.projectRepository.findOneByOrFail({ id: projectId });
        project.isArchive = true;
        return this.projectRepository.save(project);
    }

    async unarchiveProject(projectId: string): Promise<Project> {
        const project = await this.projectRepository.findOneByOrFail({ id: projectId });
        project.isArchive = false;
        return this.projectRepository.save(project);
    }

    async countNotes(projectId: string): Promise<number> {
        return this.noteService.countByProject(projectId);
    }

    async getNotes(projectId: string) {
        return this.noteService.findByProject(projectId);
    }
}



