import { useTranslations } from 'next-intl';
import { ProjectHome } from './ProjectHome';
import type { LocaleCodeType } from '@/types/locale';
import type { PriorityMessages } from '@/types/priority';
import type { TestTypeMessages } from '@/types/testType';
import type { TestRunCaseStatusMessages } from '@/types/status';
import type { ProjectHomeMessages } from '@/types/project';
import type { RunStatusMessages } from '@/types/status';

export default function Page({ params }: { params: { projectId: string; locale: LocaleCodeType } }) {
  const rcst = useTranslations('RunCaseStatus');
  const testRunCaseStatusMessages: TestRunCaseStatusMessages = {
    untested: rcst('untested'),
    passed: rcst('passed'),
    failed: rcst('failed'),
    retest: rcst('retest'),
    skipped: rcst('skipped'),
  };

  const tt = useTranslations('Type');
  const testTypeMessages: TestTypeMessages = {
    other: tt('other'),
    security: tt('security'),
    performance: tt('performance'),
    accessibility: tt('accessibility'),
    functional: tt('functional'),
    acceptance: tt('acceptance'),
    usability: tt('usability'),
    smokeSanity: tt('smoke_sanity'),
    compatibility: tt('compatibility'),
    destructive: tt('destructive'),
    regression: tt('regression'),
    automated: tt('automated'),
    manual: tt('manual'),
  };

  const pt = useTranslations('Priority');
  const priorityMessages: PriorityMessages = {
    critical: pt('critical'),
    high: pt('high'),
    medium: pt('medium'),
    low: pt('low'),
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

  const ph = useTranslations('ProjectHome');
  const messages: ProjectHomeMessages = {
    passRate: ph('pass_rate'),
    healthy: ph('healthy'),
    atRisk: ph('at_risk'),
    criticalHealth: ph('critical_health'),
    testCases: ph('test_cases'),
    totalCases: ph('total_cases'),
    passed: ph('passed'),
    failed: ph('failed'),
    skipped: ph('skipped'),
    acrossAllRuns: ph('across_all_runs'),
    testRuns: ph('test_runs'),
    executions: ph('executions'),
    needsAttention: ph('needs_attention'),
    runProgress: ph('run_progress'),
    statusDistribution: ph('status_distribution'),
    coverageByPriority: ph('coverage_by_priority'),
    caseDistribution: ph('case_distribution'),
    cases: ph('cases'),
    recentTestRuns: ph('recent_test_runs'),
    latestExecutions: ph('latest_executions'),
    viewAll: ph('view_all'),
    noRunsYet: ph('no_runs_yet'),
    passedCount: ph('passed_count'),
    mostFailingCases: ph('most_failing_cases'),
    topFailingDesc: ph('top_failing_desc'),
    noFailures: ph('no_failures'),
    allPassing: ph('all_passing'),
    fail: ph('fail'),
    fails: ph('fails'),
  };

  return (
    <ProjectHome
      projectId={params.projectId}
      messages={messages}
      testRunCaseStatusMessages={testRunCaseStatusMessages}
      testTypeMessages={testTypeMessages}
      priorityMessages={priorityMessages}
      runStatusMessages={runStatusMessages}
    />
  );
}
