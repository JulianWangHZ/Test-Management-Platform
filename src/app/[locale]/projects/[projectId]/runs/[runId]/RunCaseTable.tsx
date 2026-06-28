'use client';
import { Input } from '@heroui/react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { ChevronDown } from 'lucide-react';
import { testRunCaseStatus } from '@/config/selection';
import type { CaseType } from '@/types/case';
import type { RunMessages } from '@/types/run';
import type { TestRunCaseStatusMessages } from '@/types/status';

const STATUS_BADGE_COLOR: Record<number, string> = {
  0: 'bg-gray-100 text-gray-700 border border-gray-300',
  1: 'bg-green-50 text-green-700 border border-green-200',
  2: 'bg-red-50 text-red-700 border border-red-200',
  3: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  4: 'bg-gray-100 text-gray-600 border border-gray-300',
};

const PRIORITY_COLOR = ['#b91c1c', '#ea580c', '#ca8a04', '#16a34a'];
const PRIORITY_LABEL = ['Critical', 'High', 'Medium', 'Low'];

type Props = {
  cases: CaseType[];
  search: string;
  messages: RunMessages;
  testRunCaseStatusMessages: TestRunCaseStatusMessages;
  onSearchChange: (v: string) => void;
  onStatusChange: (caseId: number, status: number) => void;
};

export default function RunCaseTable({
  cases,
  search,
  messages,
  testRunCaseStatusMessages,
  onSearchChange,
  onStatusChange,
}: Props) {
  const filtered = cases.filter(
    (c) => !search || c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="border-t border-gray-200 my-6" />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Test Cases</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {filtered.length} case{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Input
          size="sm"
          variant="bordered"
          placeholder={messages.caseTitleOrDescription}
          value={search}
          onValueChange={onSearchChange}
          classNames={{
            inputWrapper: 'border-gray-300 hover:border-gray-400',
            input: 'text-gray-800 placeholder:text-gray-400',
          }}
          className="max-w-56"
        />
      </div>

      <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm mb-8">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">{messages.noCasesFound}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide w-8">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Title</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide w-28">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide w-44">{messages.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((tc, idx) => {
                const currentStatus = tc.RunCases?.[0]?.status ?? 0;
                const statusUid = testRunCaseStatus[currentStatus]?.uid ?? 'untested';
                const badgeColor = STATUS_BADGE_COLOR[currentStatus] ?? STATUS_BADGE_COLOR[0];

                return (
                  <tr key={tc.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3.5 text-gray-500 text-xs font-mono">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-gray-900 font-medium text-sm leading-snug">{tc.title}</span>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: PRIORITY_COLOR[tc.priority] ?? '#9ca3af' }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: PRIORITY_COLOR[tc.priority] ?? '#9ca3af' }}
                        />
                        {PRIORITY_LABEL[tc.priority] ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Dropdown placement="bottom-start">
                        <DropdownTrigger>
                          <button
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-all hover:opacity-90 hover:shadow-sm ${badgeColor}`}
                          >
                            {testRunCaseStatusMessages[statusUid as keyof TestRunCaseStatusMessages]}
                            <ChevronDown size={10} />
                          </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="status" selectionMode="single">
                          {testRunCaseStatus.map((s, i) => (
                            <DropdownItem
                              key={s.uid}
                              onPress={() => onStatusChange(tc.id, i)}
                              className={currentStatus === i ? 'font-semibold' : ''}
                            >
                              {testRunCaseStatusMessages[s.uid as keyof TestRunCaseStatusMessages]}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
