import { useTranslations } from 'next-intl';
import RunsPage from './RunsPage';
import type { LocaleCodeType } from '@/types/locale';
import type { RunsMessages } from '@/types/run';
import type { RunStatusMessages } from '@/types/status';

export default function Page({ params }: { params: { projectId: string; locale: LocaleCodeType } }) {
  const t = useTranslations('Runs');
  const messages: RunsMessages = {
    testRunsTitle: t('test_runs_title'),
    run: t('run'),
    runs: t('runs'),
    passed: t('passed'),
    failed: t('failed'),
    overallRate: t('overall_rate'),
    rate: t('rate'),
    noTestRunsYet: t('no_test_runs_yet'),
    createFirstRun: t('create_first_run'),
    noCasesYet: t('no_cases_yet'),
    editRun: t('edit_run'),
    newTestRun: t('new_test_run'),
    updateRunDetails: t('update_run_details'),
    setUpNewExecution: t('set_up_new_execution'),
    runName: t('run_name'),
    pleaseEnter: t('please_enter'),
    description: t('description'),
    optional: t('optional'),
    runDescription: t('run_description'),
    cancel: t('cancel'),
    updateRun: t('update_run'),
    createRun: t('create_run'),
    newRun: t('new_run'),
  };

  const rs = useTranslations('RunStatus');
  const runStatusMessages: RunStatusMessages = {
    new: rs('new'),
    inProgress: rs('inProgress'),
    underReview: rs('underReview'),
    rejected: rs('rejected'),
    done: rs('done'),
    closed: rs('closed'),
  };

  return (
    <RunsPage
      projectId={params.projectId}
      locale={params.locale}
      messages={messages}
      runStatusMessages={runStatusMessages}
    />
  );
}
