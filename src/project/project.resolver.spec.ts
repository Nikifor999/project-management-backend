import { Test, TestingModule } from '@nestjs/testing';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';


/* to run this specific file copy&paste 
   npx vitest src/project/project.resolver.spec.ts --ui --coverage
*/

describe('ProjectResolver', () => {
  let resolver: ProjectResolver;
  let service: ProjectService;

  const mockProjectService = {
    getProject: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectResolver,
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
      ],
    }).compile();

    resolver = module.get<ProjectResolver>(ProjectResolver);
    service = module.get<ProjectService>(ProjectService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getProject', () => {
    const projectId = 'project-123';
    const user = { userId: 'user-456' };
    it('should call service.getProject with correct arguments', async () => {
      // ARRANGE
      const mockResult = { id: projectId, name: 'Test Project' };
      mockProjectService.getProject.mockResolvedValue(mockResult);

      // ACT
      const result = await resolver.getProject(user, projectId);

      // ASSERT
      expect(result).toEqual(mockResult);

      expect(service.getProject).toHaveBeenCalledWith(projectId, user.userId);
    });

    it("should throw an error if the user isn't found", async () => {
      const error = new Error('Not Found');
      mockProjectService.getProject.mockRejectedValue(error);

      // Act & Assert
      await expect(resolver.getProject(user, projectId)).rejects.toThrow('Not Found');

      expect(service.getProject).toHaveBeenCalledWith(projectId, user.userId);
    })
  });
});
