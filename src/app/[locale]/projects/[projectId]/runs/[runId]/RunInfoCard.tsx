'use client';
import { Input, Textarea, Select, SelectItem, Button } from '@heroui/react';
import { RotateCw } from 'lucide-react';
import { testRunStatus } from '@/config/selection';
import RunProgressChart from './RunPregressDonutChart';
import type { RunType, RunMessages, RunStatusCountType } from '@/types/run';
import type { RunStatusMessages, TestRunCaseStatusMessages } from '@/types/status';

type Props = {
  testRun: RunType;
  messages: RunMessages;
  runStatusMessages: RunStatusMessages;
  testRunCaseStatusMessages: TestRunCaseStatusMessages;
  statusCounts: RunStatusCountType[];
  theme: string | undefined;
  onChange: (updated: RunType) => void;
};

export default function RunInfoCard({
  testRun,
  messages,
  runStatusMessages,
  testRunCaseStatusMessages,
  statusCounts,
  theme,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Progress chart */}
      <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-semibold text-gray-900">{messages.progress}</h4>
          <Button
            isIconOnly
            size="sm"
            className="rounded-full bg-transparent text-gray-400 hover:text-gray-600 h-6 w-6 min-w-0"
            onPress={() => {}}
          >
            <RotateCw size={13} />
          </Button>
        </div>
        <div className="h-44">
          <RunProgressChart
            statusCounts={statusCounts}
            testRunCaseStatusMessages={testRunCaseStatusMessages}
            theme={theme}
          />
        </div>
      </div>

      {/* Form fields */}
      <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm space-y-3">
        <Input
          size="sm"
          variant="bordered"
          label={messages.title}
          value={testRun.name}
          classNames={{ label: 'text-gray-700 font-medium', inputWrapper: 'border-gray-300 hover:border-gray-400' }}
          onChange={(e) => onChange({ ...testRun, name: e.target.value })}
        />
        <Textarea
          size="sm"
          variant="bordered"
          label={messages.description}
          value={testRun.description}
          classNames={{ label: 'text-gray-700 font-medium', inputWrapper: 'border-gray-300 hover:border-gray-400' }}
          onValueChange={(v) => onChange({ ...testRun, description: v })}
          minRows={2}
        />
        <Select
          size="sm"
          variant="bordered"
          label={messages.status}
          classNames={{ label: 'text-gray-700 font-medium', trigger: 'border-gray-300 hover:border-gray-400' }}
          selectedKeys={[testRunStatus[testRun.state]?.uid ?? 'new']}
          onSelectionChange={(sel) => {
            if (sel !== 'all' && sel.size > 0) {
              const uid = Array.from(sel)[0] as string;
              const idx = testRunStatus.findIndex((s) => s.uid === uid);
              onChange({ ...testRun, state: idx });
            }
          }}
        >
          {testRunStatus.map((s) => (
            <SelectItem key={s.uid}>{runStatusMessages[s.uid as keyof RunStatusMessages]}</SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
