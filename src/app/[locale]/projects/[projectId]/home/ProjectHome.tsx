'use client';
import { useMemo } from 'react';
import { aggregateTestPriority, aggregateProgress } from './aggregate';
import { useProject } from '@/hooks/useProject';
import { rateColor } from '@/utils/rateColor';
import { ProjectPassRateChart } from './ProjectPassRateChart';
import { ProjectProgressChart } from './ProjectProgressChart';
import type { TestRunCaseStatusMessages, RunStatusMessages } from '@/types/status';
import type { TestTypeMessages } from '@/types/testType';
import type { PriorityMessages } from '@/types/priority';
import type { ProjectHomeMessages } from '@/types/project';
import type { CasePriorityCountType } from '@/types/chart';
import { testRunStatus } from '@/config/selection';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  projectId: string;
  messages: ProjectHomeMessages;
  testRunCaseStatusMessages: TestRunCaseStatusMessages;
  testTypeMessages: TestTypeMessages;
  priorityMessages: PriorityMessages;
  runStatusMessages: RunStatusMessages;
};

const ACCENT_COLORS = ['#030712', '#16a34a', '#dc2626', '#d97706', '#2563eb', '#7c3aed'];

function StatCard({
  label,
  value,
  unit = '',
  accentColor,
  description,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accentColor: string;
  description?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:-translate-y-0.5 transition-transform">
      <div className="h-1" style={{ backgroundColor: accentColor }} />
      <div className="px-4 py-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">
          {value}{unit}
        </p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  );
}

function MiniProgressBar({ passed, failed, skipped, total }: { passed: number; failed: number; skipped: number; total: number }) {
  if (total === 0) return <div className="h-1.5 bg-gray-100 rounded-full w-full" />;
  const pPct = Math.round((passed / total) * 100);
  const fPct = Math.round((failed / total) * 100);
  const sPct = Math.round((skipped / total) * 100);
  return (
    <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-gray-100">
      <div style={{ width: `${pPct}%`, backgroundColor: '#16a34a' }} />
      <div style={{ width: `${fPct}%`, backgroundColor: '#dc2626' }} />
      <div style={{ width: `${sPct}%`, backgroundColor: '#9ca3af' }} />
    </div>
  );
}

export function ProjectHome({ projectId, messages, testRunCaseStatusMessages, testTypeMessages, priorityMessages, runStatusMessages }: Props) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  const project = useProject(Number(projectId));

  const stats = useMemo(() => {
    if (!project) return { total: 0, passed: 0, failed: 0, skipped: 0, runs: 0, passRate: 0 };
    const allRunCases = (project.Runs ?? []).flatMap((r) => r.RunCases ?? []);
    const passed = allRunCases.filter((rc) => rc.status === 1).length;
    const failed = allRunCases.filter((rc) => rc.status === 2).length;
    const skipped = allRunCases.filter((rc) => rc.status === 4).length;
    const total = allRunCases.length;
    const caseNum = (project.Folders ?? []).flatMap((f) => f.Cases ?? []).length;
    return { total: caseNum, passed, failed, skipped, runs: project.Runs?.length ?? 0, passRate: total > 0 ? Math.round((passed / total) * 100) : 0 };
  }, [project]);

  const priorityCounts = useMemo(() => project ? aggregateTestPriority(project) : [], [project]);

  const { progressSeries, progressCategories } = useMemo(() => {
    if (!project) return { progressSeries: [], progressCategories: [] };
    const { series, categories } = aggregateProgress(project, testRunCaseStatusMessages);
    return { progressSeries: series, progressCategories: categories };
  }, [project, testRunCaseStatusMessages]);

  const failingCases = useMemo(() => {
    if (!project) return [];
    const allRunCases = (project.Runs ?? []).flatMap((r) => r.RunCases ?? []);
    const allCases = (project.Folders ?? []).flatMap((f) => f.Cases ?? []);
    const failMap: Record<number, { title: string; count: number }> = {};
    allCases.forEach((c) => { failMap[c.id] = { title: c.title, count: 0 }; });
    allRunCases.filter((rc) => rc.status === 2).forEach((rc) => {
      if (failMap[rc.caseId]) failMap[rc.caseId].count++;
    });
    return Object.values(failMap).filter((c) => c.count > 0).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [project]);

  if (!project) return null;

  const priorityLabels = [priorityMessages.critical, priorityMessages.high, priorityMessages.medium, priorityMessages.low];
  const priorityColors = ['#b91c1c', '#ea580c', '#ca8a04', '#16a34a'];
  const totalCases = stats.total || 1;

  return (
    <div className="px-6 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {project.detail && <p className="text-sm text-gray-500 mt-1">{project.detail}</p>}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center min-w-36">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 font-medium">{messages.passRate}</p>
          <ProjectPassRateChart passRate={stats.passRate} />
          <p className="text-xs font-medium mt-1" style={{ color: rateColor(stats.passRate) }}>
            {stats.passRate >= 80 ? messages.healthy : stats.passRate >= 50 ? messages.atRisk : messages.criticalHealth}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard label={messages.testCases} value={stats.total} accentColor={ACCENT_COLORS[0]} description={messages.totalCases} />
        <StatCard label={messages.passed} value={stats.passed} accentColor={ACCENT_COLORS[1]} description={messages.acrossAllRuns} />
        <StatCard label={messages.failed} value={stats.failed} accentColor={ACCENT_COLORS[2]} description={messages.acrossAllRuns} />
        <StatCard label={messages.skipped} value={stats.skipped} accentColor={ACCENT_COLORS[3]} description={messages.acrossAllRuns} />
        <StatCard label={messages.testRuns} value={stats.runs} accentColor={ACCENT_COLORS[4]} description={messages.executions} />
        <StatCard
          label={messages.passRate}
          value={stats.passRate}
          unit="%"
          accentColor={rateColor(stats.passRate)}
          description={stats.passRate >= 80 ? messages.healthy : stats.passRate >= 50 ? messages.atRisk : messages.needsAttention}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Run Progress */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
          <p className="text-sm font-semibold text-gray-800 mb-0.5">{messages.runProgress}</p>
          <p className="text-xs text-gray-500 mb-3">{messages.statusDistribution}</p>
          <ProjectProgressChart series={progressSeries} categories={progressCategories} />
        </div>

        {/* Coverage by Priority */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-800 mb-0.5">{messages.coverageByPriority}</p>
          <p className="text-xs text-gray-500 mb-4">{messages.caseDistribution}</p>
          <div className="space-y-4 mt-2">
            {priorityCounts.slice(0, 4).map((pc, i) => {
              const pct = Math.round(((pc.count || 0) / totalCases) * 100);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColors[i] }} />
                      <span className="text-xs font-medium text-gray-700">{priorityLabels[i]}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{pc.count || 0} {messages.cases} · {pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: priorityColors[i] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
        {/* Recent Test Runs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">{messages.recentTestRuns}</p>
              <p className="text-xs text-gray-500">{messages.latestExecutions}</p>
            </div>
            <Link href={`/${locale}/projects/${projectId}/runs`} className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors">
              {messages.viewAll}
            </Link>
          </div>
          <div className="space-y-4">
            {(project.Runs ?? []).map((run) => {
              const total = run.RunCases?.length ?? 0;
              const passed = run.RunCases?.filter((rc) => rc.status === 1).length ?? 0;
              const failed = run.RunCases?.filter((rc) => rc.status === 2).length ?? 0;
              const skipped = run.RunCases?.filter((rc) => rc.status === 4).length ?? 0;
              const rate = total > 0 ? Math.round((passed / total) * 100) : 0;
              const statusUid = testRunStatus[run.state]?.uid ?? 'new';
              return (
                <Link key={run.id} href={`/${locale}/projects/${projectId}/runs/${run.id}`} className="block">
                  <div className="py-3.5 pl-4 pr-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800 truncate">{run.name}</span>
                      <span className="text-xs font-semibold ml-2 flex-shrink-0" style={{ color: rateColor(rate) }}>
                        {rate}%
                      </span>
                    </div>
                    <MiniProgressBar passed={passed} failed={failed} skipped={skipped} total={total} />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{passed}/{total} {messages.passedCount}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{runStatusMessages[statusUid as keyof RunStatusMessages] ?? statusUid}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
            {(project.Runs?.length ?? 0) === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">{messages.noRunsYet}</p>
            )}
          </div>
        </div>

        {/* Most Failing Cases */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-800">{messages.mostFailingCases}</p>
            <p className="text-xs text-gray-500">{messages.topFailingDesc}</p>
          </div>
          {failingCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">{messages.noFailures}</p>
              <p className="text-xs text-gray-500 mt-1">{messages.allPassing}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {failingCases.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-xs font-bold text-gray-500 w-4 flex-shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate font-medium">{c.title}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="text-xs font-semibold text-red-600">{c.count} {c.count > 1 ? messages.fails : messages.fail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
