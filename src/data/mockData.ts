import { ProjectType } from '@/types/project';
import { RunType } from '@/types/run';
import { CaseType } from '@/types/case';
import { FolderType } from '@/types/folder';

const NOW = '2026-03-20T14:30:00Z';

const makeCases = (folderId: number, items: Array<Pick<CaseType, 'id' | 'title' | 'type' | 'priority'>>): CaseType[] =>
  items.map((c) => ({
    ...c,
    state: 0,
    automationStatus: 0,
    description: '',
    template: 0,
    preConditions: '',
    expectedResults: '',
    folderId,
    RunCases: [],
    Tags: [],
  }));

const folders1: FolderType[] = [
  {
    id: 1, name: 'Authentication', detail: '', projectId: 1,
    parentFolderId: null, createdAt: NOW, updatedAt: NOW,
    Cases: makeCases(1, [
      { id: 1, title: 'Login with valid credentials', type: 3, priority: 1 },
      { id: 2, title: 'Password reset flow', type: 3, priority: 2 },
    ]),
  },
  {
    id: 2, name: 'Checkout', detail: '', projectId: 1,
    parentFolderId: null, createdAt: NOW, updatedAt: NOW,
    Cases: makeCases(2, [
      { id: 3, title: 'Add item to cart', type: 1, priority: 1 },
      { id: 4, title: 'Complete purchase', type: 1, priority: 0 },
      { id: 5, title: 'Payment validation', type: 0, priority: 0 },
    ]),
  },
];

const folders2: FolderType[] = [
  {
    id: 3, name: 'User API', detail: '', projectId: 2,
    parentFolderId: null, createdAt: NOW, updatedAt: NOW,
    Cases: makeCases(3, [
      { id: 6, title: 'GET /users returns 200', type: 12, priority: 1 },
      { id: 7, title: 'POST /users creates user', type: 12, priority: 1 },
    ]),
  },
];

const makeRunCase = (id: number, runId: number, caseId: number, status: number) => ({
  id, runId, caseId, status, editState: 'notChanged' as const,
  createdAt: NOW, updatedAt: NOW, assigneeUserId: null,
});

export const MOCK_PROJECTS: ProjectType[] = [
  {
    id: 1,
    name: 'Web App Regression',
    detail: 'Full regression suite covering all critical user flows.',
    isPublic: true,
    userId: 1,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: NOW,
    Folders: folders1,
    Runs: [
      {
        id: 1, name: 'Sprint 14 Smoke', description: 'Quick smoke test for Sprint 14', configurations: 0,
        state: 1, projectId: 1, createdAt: '2026-03-15T09:00:00Z', updatedAt: NOW,
        RunCases: [makeRunCase(1, 1, 1, 1), makeRunCase(2, 1, 2, 2), makeRunCase(3, 1, 3, 0)],
      },
      {
        id: 2, name: 'Full Regression v2.1', description: 'Complete regression for v2.1 release', configurations: 0,
        state: 0, projectId: 1, createdAt: '2026-03-10T10:00:00Z', updatedAt: '2026-03-15T11:00:00Z',
        RunCases: [makeRunCase(4, 2, 1, 1), makeRunCase(5, 2, 3, 1), makeRunCase(6, 2, 4, 3), makeRunCase(7, 2, 5, 4)],
      },
      {
        id: 4, name: 'Hotfix v2.1.1', description: 'Critical hotfix validation', configurations: 0,
        state: 2, projectId: 1, createdAt: '2026-03-18T08:00:00Z', updatedAt: '2026-03-18T17:00:00Z',
        RunCases: [makeRunCase(10, 4, 1, 1), makeRunCase(11, 4, 2, 1), makeRunCase(12, 4, 3, 1), makeRunCase(13, 4, 4, 2), makeRunCase(14, 4, 5, 1)],
      },
      {
        id: 5, name: 'Sprint 15 Regression', description: 'Sprint 15 full regression', configurations: 0,
        state: 1, projectId: 1, createdAt: '2026-03-20T09:00:00Z', updatedAt: NOW,
        RunCases: [makeRunCase(15, 5, 1, 1), makeRunCase(16, 5, 2, 3), makeRunCase(17, 5, 3, 2), makeRunCase(18, 5, 4, 0), makeRunCase(19, 5, 5, 1)],
      },
      {
        id: 6, name: 'Release Candidate v3', description: 'Pre-release final check', configurations: 0,
        state: 0, projectId: 1, createdAt: '2026-03-22T10:00:00Z', updatedAt: '2026-03-22T10:00:00Z',
        RunCases: [makeRunCase(20, 6, 1, 0), makeRunCase(21, 6, 2, 0), makeRunCase(22, 6, 3, 0), makeRunCase(23, 6, 4, 0), makeRunCase(24, 6, 5, 0)],
      },
    ],
  },
  {
    id: 2,
    name: 'Mobile API Testing',
    detail: 'API integration tests for iOS and Android clients.',
    isPublic: false,
    userId: 1,
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2026-03-18T11:00:00Z',
    Folders: folders2,
    Runs: [
      {
        id: 3, name: 'API Smoke Test', description: '', configurations: 0,
        state: 2, projectId: 2, createdAt: '2026-03-01T08:00:00Z', updatedAt: '2026-03-10T09:00:00Z',
        RunCases: [makeRunCase(8, 3, 6, 1), makeRunCase(9, 3, 7, 1)],
      },
    ],
  },
  {
    id: 3,
    name: 'Performance Testing',
    detail: 'Load, stress and soak testing scenarios for production readiness.',
    isPublic: true,
    userId: 1,
    createdAt: '2025-02-15T08:00:00Z',
    updatedAt: '2026-03-22T16:00:00Z',
    Folders: [],
    Runs: [],
  },
];

export function getMockProject(projectId: number): ProjectType | undefined {
  return MOCK_PROJECTS.find((p) => p.id === projectId);
}

export function getMockRuns(projectId: number): RunType[] {
  return getMockProject(projectId)?.Runs ?? [];
}

export function getMockRun(runId: number): RunType | undefined {
  for (const project of MOCK_PROJECTS) {
    const run = project.Runs?.find((r) => r.id === runId);
    if (run) return run;
  }
  return undefined;
}

export function getMockCases(projectId: number): CaseType[] {
  const project = getMockProject(projectId);
  return (project?.Folders ?? []).flatMap((f) => f.Cases ?? []);
}

export function getMockCase(caseId: number): CaseType | undefined {
  for (const project of MOCK_PROJECTS) {
    for (const folder of project.Folders ?? []) {
      const found = folder.Cases?.find((c) => c.id === caseId);
      if (found) return found;
    }
  }
  return undefined;
}
