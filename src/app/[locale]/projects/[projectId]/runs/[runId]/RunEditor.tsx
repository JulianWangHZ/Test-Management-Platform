'use client';
import { useState, useMemo } from 'react';
import { addToast } from '@heroui/react';
import { useTheme } from 'next-themes';
import { testRunCaseStatus } from '@/config/selection';
import { useRun } from '@/hooks/useRun';
import { useCases } from '@/hooks/useCases';
import { useFormGuard } from '@/utils/formGuard';
import RunHeader from './RunHeader';
import RunInfoCard from './RunInfoCard';
import RunCaseTable from './RunCaseTable';
import type { RunType, RunMessages } from '@/types/run';
import type { CaseType } from '@/types/case';
import type { RunStatusMessages, TestRunCaseStatusMessages } from '@/types/status';

type Props = {
  projectId: string;
  runId: string;
  messages: RunMessages;
  runStatusMessages: RunStatusMessages;
  testRunCaseStatusMessages: TestRunCaseStatusMessages;
  locale: string;
};

export default function RunEditor({
  projectId,
  runId,
  messages,
  runStatusMessages,
  testRunCaseStatusMessages,
  locale,
}: Props) {
  const { theme } = useTheme();
  const initialRun = useRun(Number(runId));
  const allCases = useCases(Number(projectId));

  const [testRun, setTestRun] = useState<RunType | null>(() => initialRun ?? null);
  const [testCases, setTestCases] = useState<CaseType[]>(() =>
    allCases.map((c) => ({
      ...c,
      RunCases: initialRun?.RunCases?.filter((rc) => rc.caseId === c.id) ?? [],
    })),
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [search, setSearch] = useState('');

  useFormGuard(isDirty, messages.areYouSureLeave, [
    `/projects/${projectId}/runs/${runId}/cases/\\d+`,
  ]);

  const statusCounts = useMemo(
    () =>
      testRunCaseStatus.map((_, index) => ({
        status: index,
        count: testRun?.RunCases?.filter((rc) => rc.status === index).length ?? 0,
      })),
    [testRun],
  );

  const onSave = async () => {
    setIsUpdating(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsDirty(false);
    setIsUpdating(false);
    addToast({ title: 'Saved', color: 'success', description: messages.updatedTestRun });
  };

  const handleRunChange = (updated: RunType) => {
    setTestRun(updated);
    setIsDirty(true);
  };

  const handleStatusChange = (caseId: number, newStatus: number) => {
    setIsDirty(true);
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === caseId
          ? {
              ...tc,
              RunCases: tc.RunCases?.length
                ? [{ ...tc.RunCases[0], status: newStatus }]
                : [{ id: Date.now(), runId: Number(runId), caseId, status: newStatus, editState: 'changed' as const, assigneeUserId: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
            }
          : tc,
      ),
    );
  };

  if (!testRun) return null;

  return (
    <>
      <RunHeader
        testRun={testRun}
        projectId={projectId}
        locale={locale}
        messages={messages}
        isDirty={isDirty}
        isUpdating={isUpdating}
        onSave={onSave}
      />
      <div className="px-6 py-6 max-w-5xl">
        <RunInfoCard
          testRun={testRun}
          messages={messages}
          runStatusMessages={runStatusMessages}
          testRunCaseStatusMessages={testRunCaseStatusMessages}
          statusCounts={statusCounts}
          theme={theme}
          onChange={handleRunChange}
        />
        <RunCaseTable
          cases={testCases}
          search={search}
          messages={messages}
          testRunCaseStatusMessages={testRunCaseStatusMessages}
          onSearchChange={setSearch}
          onStatusChange={handleStatusChange}
        />
      </div>
    </>
  );
}
