import { Test, TestingModule } from '@nestjs/testing';
import { NoteService } from './note.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getModelToken } from '@nestjs/mongoose';
import { Note, NoteSchema } from './note.schema';
import { ProjectService } from 'src/project/project.service';
import { NoteVisibility } from './note.visibility';


/* to run this specific file copy&paste 
   npx vitest src/note/note.service.spec.ts --ui --coverage
*/

describe('NoteService', () => {
  let service: NoteService;

  // 1. Мок для экземпляра (то, что возвращает new Model())
  const mockNoteInstance = {
    save: vi.fn(),
    set: vi.fn(),
  };

  // 2. Мок запросов (chainable methods)
  const mockQuery = {
    exec: vi.fn(),
    sort: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  };

  // 3.Используем обычную функцию 'function()', а не '() =>'
  // Это позволит вызывать 'new mockRepository()' без ошибок
  const mockRepository = vi.fn(function (dto) {
    return mockNoteInstance;
  }) as any;

  // 4. Добавляем статические методы к этой функции-моку
  mockRepository.find = vi.fn(() => mockQuery);
  mockRepository.findByIdAndDelete = vi.fn(() => mockQuery);
  mockRepository.findOneOrFail = vi.fn();
  mockRepository.findById = vi.fn(() => mockQuery);
  mockRepository.create = vi.fn();

  const mockProjectService = {
    assertOwnership: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoteService,
        {
          provide: getModelToken(Note.name),
          useValue: mockRepository,
        },
        {
          provide: ProjectService,
          useValue: mockProjectService,
        }
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("findByProject", () => {
    const projectId = "projectId";
    it("should return notes for project", async () => {
      const mockNotes = [
        { title: "note1", projectId: projectId },
        { title: "note2", projectId: projectId },
      ];
      mockQuery.exec.mockResolvedValue(mockNotes);

      const result = await service.findByProject(projectId);

      expect(result).toEqual(mockNotes);
      expect(mockRepository.find).toHaveBeenCalledWith({
        "projectId": projectId
      });
    })
  })

  describe("removeNote", () => {
    const noteId = 'note-123';
    const userId = 'user-456';
    it("should remove note", async () => {

      const assertSpy = vi.spyOn(service, 'assertUserNoteOwnership')
        .mockResolvedValue({ id: noteId, title: 'Test Note' } as any);

      mockQuery.exec.mockResolvedValue({ deleted: true });

      // ACT
      const result = await service.removeNote(noteId, userId);

      // ASSERT
      expect(result).toBe(true);
      expect(assertSpy).toHaveBeenCalledWith(noteId, userId);
      expect(mockRepository.findByIdAndDelete).toHaveBeenCalledWith(noteId);
    });

    it("should NOT delete note if user is not owner", async () => {
      // ARRANGE
      const error = new Error('Forbidden access');

      vi.spyOn(service, 'assertUserNoteOwnership').mockRejectedValue(error);

      // ACT & ASSERT
      await expect(service.removeNote(noteId, userId)).rejects.toThrow('Forbidden access');

      expect(mockRepository.findByIdAndDelete).not.toHaveBeenCalled();
    });

  });


  describe('create', () => {
    const userId = 'user-1';
    const input = { title: 'New Note', content: 'Content', projectId: 'project-1' };

    it('should check ownership, create a note instance, and save it', async () => {
      // ARRANGE
      mockProjectService.assertOwnership.mockResolvedValue(true);

      const savedNote = { ...input, ownerId: userId, id: 'note-123' };
      mockNoteInstance.save.mockResolvedValue(savedNote);

      // ACT
      const result = await service.create(userId, input);

      // ASSERT
      expect(result).toEqual(savedNote);

      expect(mockProjectService.assertOwnership).toHaveBeenCalledWith(input.projectId, userId);

      expect(mockRepository).toHaveBeenCalledWith({
        ...input,
        ownerId: userId
      });

      expect(mockNoteInstance.save).toHaveBeenCalled();
    });

    it('should throw error if project ownership fails and NOT create note', async () => {
      // ARRANGE
      const error = new Error('Access Denied');
      mockProjectService.assertOwnership.mockRejectedValue(error);

      // ACT & ASSERT
      await expect(service.create(userId, input)).rejects.toThrow('Access Denied');

      expect(mockRepository).not.toHaveBeenCalled();
      expect(mockNoteInstance.save).not.toHaveBeenCalled();
    });
  });

  describe("updateNote", () => {
    const userId = "user-123";
    const noteId = "note-456";
    const existingNote = { title: "Old Note", content: "Old Content", ownerId: userId, labels: ["old", "updated"] };
    it("should update note ", async () => {
      //arrange 
      const input = { title: "New Title", content: "New Content", visibility: NoteVisibility.PRIVATE };
      const updatedNote = {
        ...existingNote,
        ...input
      };
      const foundNoteMock = {
        ...existingNote,
        set: vi.fn(),
        save: vi.fn(),
      };
      mockQuery.exec.mockResolvedValue(foundNoteMock);
      foundNoteMock.save.mockResolvedValue(updatedNote);

      //act
      const result = await service.update(userId, noteId, input);

      expect(result.content).toEqual(input.content);
      expect(result.title).toEqual(input.title);
      expect(foundNoteMock.set).toHaveBeenCalledWith(input);
      expect(foundNoteMock.save).toHaveBeenCalled();
      expect(mockRepository.findById).toHaveBeenCalledWith(noteId);
    })

    it("should throw NotFoundException if note not found", async () => {
      mockQuery.exec.mockResolvedValue(null); 

      await expect(service.update(userId, noteId, {}))
        .rejects.toThrow("Note's not found");
    });

    it("should throw UnauthorizedException if user is not the owner", async () => {
      const alienNote = { ...existingNote, ownerId: "other-user" };
      mockQuery.exec.mockResolvedValue(alienNote);

      await expect(service.update(userId, noteId, {}))
        .rejects.toThrow("Not your note");
    });

  })
});
