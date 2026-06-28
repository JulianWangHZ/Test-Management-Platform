type RunType = {
  id: number;
  name: string;
  configurations: number;
  description: string;
  state: number;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  RunCases?: RunCaseType[];
};

type RunCaseType = {
  id: number;
  runId: number;
  caseId: number;
  status: number;
  editState: 'notChanged' | 'changed' | 'new' | 'deleted';
  createdAt: string;
  updatedAt: string;
  assigneeUserId: number | null;
};

type RunStatusCountType = {
  status: number;
  count: number;
};

type ProgressSeriesType = {
  name: string;
  data: number[];
};

type RunsMessages = {
  testRunsTitle: string;
  run: string;
  runs: string;
  passed: string;
  failed: string;
  overallRate: string;
  rate: string;
  noTestRunsYet: string;
  createFirstRun: string;
  noCasesYet: string;
  editRun: string;
  newTestRun: string;
  updateRunDetails: string;
  setUpNewExecution: string;
  runName: string;
  pleaseEnter: string;
  description: string;
  optional: string;
  runDescription: string;
  cancel: string;
  updateRun: string;
  createRun: string;
  newRun: string;
};

type RunMessages = {
  backToRuns: string;
  updating: string;
  update: string;
  updatedTestRun: string;
  export: string;
  progress: string;
  refresh: string;
  id: string;
  title: string;
  pleaseEnter: string;
  description: string;
  priority: string;
  status: string;
  actions: string;
  selectTestCase: string;
  testCaseSelection: string;
  includeInRun: string;
  excludeFromRun: string;
  noCasesFound: string;
  areYouSureLeave: string;
  type: string;
  testDetail: string;
  steps: string;
  preconditions: string;
  expectedResult: string;
  detailsOfTheStep: string;
  close: string;
  filter: string;
  clearAll: string;
  apply: string;
  selectStatus: string;
  pleaseSave: string;
  caseTitleOrDescription: string;
  selected: string;
  tags: string;
  selectTags: string;
  comments: string;
  assignee: string;
  unassigned: string;
  assignTo: string;
  assignedToMe: string;
  assignSelected: string;
  filterByAssignee: string;
  selectAssignee: string;
  searchAssignee: string;
};

type RunDetailMessages = {
  title: string;
  description: string;
  priority: string;
  type: string;
  tags: string;
  testDetail: string;
  steps: string;
  preconditions: string;
  expectedResult: string;
  detailsOfTheStep: string;
  caseDetail: string;
  comments: string;
  history: string;
};

export type {
  RunType,
  RunCaseType,
  RunStatusCountType,
  ProgressSeriesType,
  RunsMessages,
  RunMessages,
  RunDetailMessages,
};
