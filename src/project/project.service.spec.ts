import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { NoteService } from 'src/note/note.service';
import { User } from 'src/user/user.entity';
import { Q } from 'node_modules/vitest/dist/chunks/reporters.d.Rsi0PyxX';

/* to run this specific file copy&paste 
   npx vitest src/project/project.service.spec.ts --ui --coverage
*/

describe('ProjectService', () => {
  let service: ProjectService;

  const mockQueryBuilder = {
    where: vi.fn().mockReturnThis(),      // Returns itself to allow .andWhere()
    andWhere: vi.fn().mockReturnThis(),   // Returns itself to allow .orderBy()
    orderBy: vi.fn().mockReturnThis(),    // Returns itself to allow .getMany()
    getMany: vi.fn(),                     // The end of the chain (returns data)
  };


  const mockRepository = {
    find: vi.fn(),
    save: vi.fn(),
    findOneOrFail: vi.fn(),
    create: vi.fn(),
    createQueryBuilder: vi.fn(() => mockQueryBuilder),
  };

  const mockNoteService = {};

  const projectId = 'project-123';
  const userId = 'user-456';
  const mockProject = {
    id: projectId,
    name: "test",
    description: "test",
    user: { id: userId }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
        {
          provide: NoteService,
          useValue: mockNoteService,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserProjects', () => {
    it("should find all user's projects", async () => {
      mockRepository.find.mockResolvedValue(['project1', 'project2']);
      const userId = "userId";

      const result = await service.getUserProjects(userId);

      expect(result).toEqual(['project1', 'project2']);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        order: { createdDate: 'DESC' },
      });
    });
  });

  describe('getProject', () => {
    it("should return the project when it exists and belongs to the user", async () => {
      //arrange  
      mockRepository.findOneOrFail.mockResolvedValue(mockProject);

      //act
      const result = await service.getProject(projectId, userId);

      //assert
      expect(result).toEqual(mockProject);
      expect(result.id).toEqual(mockProject.id);
      expect(result.name).toEqual(mockProject.name);

      expect(mockRepository.findOneOrFail).toBeCalledWith({
        where: { id: projectId, user: { id: userId } }
      });
    });

    it("should throw an error if project is not found or access is denied", async () => {
      // Arrange
      const error = new Error('Not Found');
      mockRepository.findOneOrFail.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getProject(projectId, userId)).rejects.toThrow('Not Found');

      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: projectId, user: { id: userId } }
      });
    })
  })

  it("Should create a project", async () => {
    //arrange
    const input = { name: "test", description: "test" };

    const createdEntity = { ...input, user: { id: userId }, id: undefined };
    mockRepository.create.mockReturnValue(createdEntity);
    mockRepository.save.mockResolvedValue(mockProject);

    //act
    const result = await service.createProject(userId, input);

    //assert
    expect(result).toEqual(mockProject);
    expect(result.id).toEqual(mockProject.id);
    expect(result.name).toEqual(mockProject.name);

    expect(mockRepository.create).toBeCalledWith({
      ...input,
      user: { id: userId } as User,
    });
    expect(mockRepository.save).toHaveBeenCalledWith(createdEntity);
  })

  describe('searchProjects', () => {
    const userId = "user-456"

    it("should return empty array with bad request", async () => {
      const queryOne = '';
      const queryTwo = '   ';

      const result1 = await service.searchProjects(userId, queryOne);
      const result2 = await service.searchProjects(userId, queryTwo);

      expect(result1).toEqual([]);
      expect(result2).toEqual([]);

      expect(mockRepository.createQueryBuilder).not.toHaveBeenCalled();
    });

    it("should return search results", async () => {
      //assign
      const query = "   Hello    World   ";
      const mockProjects = [{ id: "projectId", name: "HelloWorld" }];
      const expectedFormattedQuery = "Hello:* & World:*";

      mockQueryBuilder.getMany.mockResolvedValue(mockProjects);

      //act
      const result = await service.searchProjects(userId, query);

      //assert 
      expect(result).toEqual(mockProjects);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('p');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'p.user.id = :userId',
        { userId }
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'p.search_vector @@ plainto_tsquery(:lang, :query)',
        {
          lang: 'english',
          query: expectedFormattedQuery // <--validating "hello:* & world:*"
        }
      );

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        expect.stringContaining('ts_rank'),
        'DESC'
      );
    })
  });

})


