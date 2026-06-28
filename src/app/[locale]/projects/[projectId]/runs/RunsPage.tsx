'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, FlaskConical, ChevronRight, Clock, CheckCircle, XCircle, Circle, X } from 'lucide-react';
import { Button, Modal, ModalContent, Input, Textarea } from '@heroui/react';
import { useRuns } from '@/hooks/useRuns';
import { rateColor } from '@/utils/rateColor';
import type { RunType, RunsMessages } from '@/types/run';
import type { RunStatusMessages } from '@/types/status';
import type { LocaleCodeType } from '@/types/locale';
import { testRunStatus } from '@/config/selection';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type Props = {
  projectId: string;
  locale: LocaleCodeType;
  messages: RunsMessages;
  runStatusMessages: RunStatusMessages;
};

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  new:         { bg: 'bg-gray-100',  text: 'text-gray-600',  dot: 'bg-gray-400' },
  inProgress:  { bg: 'bg-blue-50',   text: 'text-blue-700',  dot: 'bg-blue-500' },
  underReview: { bg: 'bg-amber-50',  text: 'text-amber-700', dot: 'bg-amber-500' },
  rejected:    { bg: 'bg-red-50',    text: 'text-red-700',   dot: 'bg-red-500' },
  done:        { bg: 'bg-green-50',  text: 'text-green-700', dot: 'bg-green-500' },
  closed:      { bg: 'bg-gray-100',  text: 'text-gray-400',  dot: 'bg-gray-300' },
};

function StackedBar({ passed, failed, total }: { passed: number; failed: number; total: number }) {
  if (total === 0) return <div className="h-2 bg-gray-100 rounded-full w-full" />;
  const untested = total - passed - failed;
  return (
    <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100">
      <div className="transition-all duration-500" style={{ width: `${(passed / total) * 100}%`, backgroundColor: '#16a34a' }} />
      <div className="transition-all duration-500" style={{ width: `${(failed / total) * 100}%`, backgroundColor: '#ef4444' }} />
      <div className="transition-all duration-500" style={{ width: `${(untested / total) * 100}%`, backgroundColor: '#e5e7eb' }} />
    </div>
  );
}

export default function RunsPage({ projectId, locale, messages, runStatusMessages }: Props) {
  const initialRuns = useRuns(Number(projectId));
  const [runs, setRuns] = useState<RunType[]>(initialRuns);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRun, setEditingRun] = useState<RunType | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const openCreate = () => {
    setEditingRun(null);
    setName('');
    setDescription('');
    setIsOpen(true);
  };

  const onSave = () => {
    if (!name.trim()) return;
    if (editingRun) {
      setRuns(runs.map((r) =>
        r.id === editingRun.id ? { ...r, name: name.trim(), description: description.trim() } : r,
      ));
    } else {
      const next: RunType = {
        id: Date.now(),
        name: name.trim(),
        description: description.trim(),
        state: 0,
        configurations: 0,
        projectId: Number(projectId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        RunCases: [],
      };
      setRuns([...runs, next]);
    }
    setIsOpen(false);
  };

  const totalCases = runs.reduce((s, r) => s + (r.RunCases?.length ?? 0), 0);
  const totalPassed = runs.reduce((s, r) => s + (r.RunCases?.filter((rc) => rc.status === 1).length ?? 0), 0);
  const totalFailed = runs.reduce((s, r) => s + (r.RunCases?.filter((rc) => rc.status === 2).length ?? 0), 0);
  const overallRate = totalCases > 0 ? Math.round((totalPassed / totalCases) * 100) : 0;

  return (
    <div className="px-6 py-6 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{messages.testRunsTitle}</h1>
          <p className="text-sm text-gray-600 mt-1">{runs.length} {runs.length === 1 ? messages.run : messages.runs}</p>
        </div>
        <Button startContent={<Plus size={16} />} size="sm" color="primary" onPress={openCreate}>
          {messages.newRun}
        </Button>
      </div>

      {runs.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-50 hidden sm:flex items-center justify-center flex-shrink-0">
              <CheckCircle size={15} className="text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-green-600">{messages.passed}</p>
              <p className="text-base sm:text-lg font-bold text-gray-900">{totalPassed}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-50 hidden sm:flex items-center justify-center flex-shrink-0">
              <XCircle size={15} className="text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-red-500">{messages.failed}</p>
              <p className="text-base sm:text-lg font-bold text-gray-900">{totalFailed}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hidden sm:flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${rateColor(overallRate)}15` }}
            >
              <Circle size={15} style={{ color: rateColor(overallRate) }} fill={rateColor(overallRate)} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide truncate" style={{ color: rateColor(overallRate) }}>
                <span className="sm:hidden">{messages.rate}</span>
                <span className="hidden sm:inline">{messages.overallRate}</span>
              </p>
              <p className="text-base sm:text-lg font-bold" style={{ color: rateColor(overallRate) }}>{overallRate}%</p>
            </div>
          </div>
        </div>
      )}

      {runs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
            <FlaskConical size={22} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium text-sm">{messages.noTestRunsYet}</p>
          <p className="text-gray-400 text-xs mt-1">{messages.createFirstRun}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {runs.map((run) => {
            const uid = testRunStatus[run.state]?.uid ?? 'new';
            const style = STATUS_STYLE[uid] ?? STATUS_STYLE.new;
            const total = run.RunCases?.length ?? 0;
            const passed = run.RunCases?.filter((rc) => rc.status === 1).length ?? 0;
            const failed = run.RunCases?.filter((rc) => rc.status === 2).length ?? 0;
            const untested = total - passed - failed;
            const rate = total > 0 ? Math.round((passed / total) * 100) : 0;

            return (
              <Link key={run.id} href={`/${locale}/projects/${projectId}/runs/${run.id}`} className="block">
                <div className="group bg-white border border-gray-300 rounded-2xl p-5 hover:border-gray-400 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-sm">{run.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                          <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                          {runStatusMessages[uid as keyof RunStatusMessages]}
                        </span>
                      </div>
                      {run.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{run.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      {total > 0 && (
                        <span className="text-xl font-bold tabular-nums" style={{ color: rateColor(rate) }}>
                          {rate}%
                        </span>
                      )}
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </div>

                  {total > 0 && (
                    <>
                      <StackedBar passed={passed} failed={failed} total={total} />
                      <div className="flex items-center justify-between mt-2.5 gap-2">
                        <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                            {passed}<span className="hidden sm:inline"> passed</span>
                          </span>
                          {failed > 0 && (
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                              {failed}<span className="hidden sm:inline"> failed</span>
                            </span>
                          )}
                          {untested > 0 && (
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
                              {untested}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                          <Clock size={10} />
                          {dayjs(run.updatedAt).fromNow()}
                        </span>
                      </div>
                    </>
                  )}

                  {total === 0 && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">{messages.noCasesYet}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={11} />
                        {dayjs(run.updatedAt).fromNow()}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="center"
        hideCloseButton
        classNames={{
          base: 'rounded-2xl shadow-xl max-w-md mx-3 sm:mx-auto',
          backdrop: 'bg-black/50 backdrop-blur-sm',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <div className="flex flex-col">
              <div className="flex items-start justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <FlaskConical size={19} className="text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-snug">
                      {editingRun ? messages.editRun : messages.newTestRun}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {editingRun ? messages.updateRunDetails : messages.setUpNewExecution}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="px-6 py-5 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    {messages.runName} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={messages.pleaseEnter}
                    size="sm"
                    variant="bordered"
                    value={name}
                    onValueChange={setName}
                    classNames={{
                      inputWrapper: 'border-gray-200 hover:border-gray-300 focus-within:!border-gray-500 bg-gray-50 hover:bg-white focus-within:!bg-white transition-colors',
                      input: 'text-gray-900 placeholder:text-gray-400',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    {messages.description}{' '}
                    <span className="text-gray-400 font-normal ml-1">{messages.optional}</span>
                  </label>
                  <Textarea
                    placeholder={messages.runDescription}
                    size="sm"
                    variant="bordered"
                    value={description}
                    onValueChange={setDescription}
                    minRows={3}
                    classNames={{
                      inputWrapper: 'border-gray-200 hover:border-gray-300 focus-within:!border-gray-500 bg-gray-50 hover:bg-white focus-within:!bg-white transition-colors',
                      input: 'text-gray-900 placeholder:text-gray-400',
                    }}
                  />
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={onClose}
                  className="text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium h-8 px-4"
                >
                  {messages.cancel}
                </Button>
                <Button
                  size="sm"
                  onPress={onSave}
                  isDisabled={!name.trim()}
                  className="rounded-lg font-semibold h-8 px-5 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40"
                >
                  {editingRun ? messages.updateRun : messages.createRun}
                </Button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
