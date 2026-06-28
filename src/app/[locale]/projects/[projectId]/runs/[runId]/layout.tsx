import { useTranslations } from 'next-intl';
import RunEditor from './RunEditor';
import { RunMessages } from '@/types/run';
import { RunStatusMessages, TestRunCaseStatusMessages } from '@/types/status';

export default function RunLayout({
  params: { projectId, runId, locale },
}: {
  children: React.ReactNode;
  params: { projectId: string; runId: string; locale: string };
}) {
  const t = useTranslations('Run');
  const messages: RunMessages = {
    backToRuns: t('back_to_runs'),
    updating: t('updating'),
    update: t('update'),
    updatedTestRun: t('updated_test_run'),
    export: t('export'),
    progress: t('progress'),
    refresh: t('refresh'),
    id: t('id'),
    title: t('title'),
    pleaseEnter: t('please_enter'),
    description: t('description'),
    priority: t('priority'),
    actions: t('actions'),
    status: t('status'),
    selectTestCase: t('select_test_case'),
    testCaseSelection: t('test_case_selection'),
    includeInRun: t('include_in_run'),
    excludeFromRun: t('exclude_from_run'),
    noCasesFound: t('no_cases_found'),
    areYouSureLeave: t('are_you_sure_leave'),
    type: t('type'),
    testDetail: t('test_detail'),
    steps: t('steps'),
    preconditions: t('preconditions'),
    expectedResult: t('expected_result'),
    detailsOfTheStep: t('details_of_the_step'),
    close: t('close'),
    filter: t('filter'),
    clearAll: t('clear_all'),
    apply: t('apply'),
    selectStatus: t('select_status'),
    pleaseSave: t('please_save'),
    caseTitleOrDescription: t('case_title_or_description'),
    selected: t('selected'),
    tags: t('tags'),
    selectTags: t('select_tags'),
    comments: t('comments'),
    assignee: t('assignee'),
    unassigned: t('unassigned'),
    assignTo: t('assign_to'),
    assignedToMe: t('assigned_to_me'),
    assignSelected: t('assign_selected'),
    filterByAssignee: t('filter_by_assignee'),
    selectAssignee: t('select_assignee'),
    searchAssignee: t('search_assignee'),
  };

  const rst = useTranslations('RunStatus');
  const runStatusMessages: RunStatusMessages = {
    new: rst('new'),
    inProgress: rst('inProgress'),
    underReview: rst('underReview'),
    rejected: rst('rejected'),
    done: rst('done'),
    closed: rst('closed'),
  };

  const rcst = useTranslations('RunCaseStatus');
  const testRunCaseStatusMessages: TestRunCaseStatusMessages = {
    untested: rcst('untested'),
    passed: rcst('passed'),
    failed: rcst('failed'),
    retest: rcst('retest'),
    skipped: rcst('skipped'),
  };

  return (
    <RunEditor
      projectId={projectId}
      runId={runId}
      messages={messages}
      runStatusMessages={runStatusMessages}
      testRunCaseStatusMessages={testRunCaseStatusMessages}
      locale={locale}
    />
  );
}
