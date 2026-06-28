'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, Tab } from '@heroui/react';
import CaseDetail from './CaseDetail';
import Comments from '@/components/Comments';
import History from '@/components/History';
import { useCase } from '@/hooks/useCases';
import { useRun } from '@/hooks/useRun';
import type { RunDetailMessages } from '@/types/run';
import type { PriorityMessages } from '@/types/priority';
import type { TestTypeMessages } from '@/types/testType';
import type { CommentMessages } from '@/types/comment';

type Props = {
  projectId: string;
  runId: string;
  locale: string;
  caseId: string;
  messages: RunDetailMessages;
  testTypeMessages: TestTypeMessages;
  priorityMessages: PriorityMessages;
  commentMessages: CommentMessages;
};

export default function TestCaseDetailPane({
  projectId,
  runId,
  locale,
  caseId,
  messages,
  testTypeMessages,
  priorityMessages,
  commentMessages,
}: Props) {
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('caseDetail');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'comments') {
      setSelectedTab('comments');
    } else if (tab === 'history') {
      setSelectedTab('history');
    } else {
      setSelectedTab('caseDetail');
    }
  }, [searchParams]);

  const testCase = useCase(Number(caseId)) ?? null;
  const run = useRun(Number(runId));
  const runCaseId = run?.RunCases?.find((rc) => rc.caseId === Number(caseId))?.id;

  if (!testCase) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-col p-3">
      <Tabs
        aria-label="Options"
        size="sm"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(String(key))}
      >
        <Tab key="caseDetail" title={messages.caseDetail}>
          <CaseDetail
            projectId={projectId}
            testCase={testCase}
            locale={locale}
            messages={messages}
            testTypeMessages={testTypeMessages}
            priorityMessages={priorityMessages}
          />
        </Tab>
        <Tab key="comments" title={messages.comments}>
          <Comments
            commentableType="RunCase"
            commentableId={runCaseId}
            messages={commentMessages}
          />
        </Tab>
        <Tab key="history" title={messages.history}>
          <History />
        </Tab>
      </Tabs>
    </div>
  );
}
