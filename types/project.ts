import { FolderType } from './folder';
import { RunType } from './run';

export type ProjectType = {
  id: number;
  name: string;
  detail: string;
  isPublic: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  Folders: FolderType[]; // additional property
  Runs: RunType[]; // additional property
};

export type ProjectDialogMessages = {
  project: string;
  projectName: string;
  projectDetail: string;
  public: string;
  private: string;
  ifYouMakePublic: string;
  close: string;
  create: string;
  update: string;
  pleaseEnter: string;
};

export type ProjectsMessages = {
  projectList: string;
  newProject: string;
  id: string;
  publicity: string;
  public: string;
  private: string;
  name: string;
  detail: string;
  lastUpdate: string;
  noProjectsFound: string;
  title: string;
  project: string;
  projectsLabel: string;
  projectName: string;
  projectNamePlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  publicHint: string;
  cancel: string;
  create: string;
  noProjectsYet: string;
  createFirstProject: string;
  passRate: string;
  noRunsYet: string;
  run: string;
  runs: string;
};

export type ProjectMessages = {
  toggleSidebar: string;
  home: string;
  testCases: string;
  testRuns: string;
  members: string;
  settings: string;
};

export type ProjectHomeMessages = {
  passRate: string;
  healthy: string;
  atRisk: string;
  criticalHealth: string;
  testCases: string;
  totalCases: string;
  passed: string;
  failed: string;
  skipped: string;
  acrossAllRuns: string;
  testRuns: string;
  executions: string;
  needsAttention: string;
  runProgress: string;
  statusDistribution: string;
  coverageByPriority: string;
  caseDistribution: string;
  cases: string;
  recentTestRuns: string;
  latestExecutions: string;
  viewAll: string;
  noRunsYet: string;
  passedCount: string;
  mostFailingCases: string;
  topFailingDesc: string;
  noFailures: string;
  allPassing: string;
  fail: string;
  fails: string;
};
