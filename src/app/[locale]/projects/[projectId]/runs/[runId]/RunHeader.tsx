'use client';
import { Button, Tooltip, Badge } from '@heroui/react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { ArrowLeft, Save, FileDown, FileCode, FileJson, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { useRouter } from '@/src/i18n/routing';
import type { RunType, RunMessages } from '@/types/run';

type Props = {
  testRun: RunType;
  projectId: string;
  locale: string;
  messages: RunMessages;
  isDirty: boolean;
  isUpdating: boolean;
  onSave: () => void;
};

export default function RunHeader({ testRun, projectId, locale, messages, isDirty, isUpdating, onSave }: Props) {
  const router = useRouter();

  return (
    <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <Tooltip content={messages.backToRuns}>
          <Button
            isIconOnly
            size="sm"
            className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
            onPress={() => router.push(`/projects/${projectId}/runs`, { locale })}
          >
            <ArrowLeft size={16} />
          </Button>
        </Tooltip>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{testRun.name}</h3>
          <p className="text-xs text-gray-500 leading-tight">{testRun.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              variant="bordered"
              size="sm"
              startContent={<FileDown size={14} />}
              endContent={<ChevronDown size={14} />}
              className="border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            >
              {messages.export}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="export">
            <DropdownItem key="xml" startContent={<FileCode size={14} />}>xml</DropdownItem>
            <DropdownItem key="json" startContent={<FileJson size={14} />}>json</DropdownItem>
            <DropdownItem key="csv" startContent={<FileSpreadsheet size={14} />}>csv</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
          startContent={
            <Badge isInvisible={!isDirty} color="danger" size="sm" content="" shape="circle">
              <Save size={14} />
            </Badge>
          }
          size="sm"
          color="primary"
          isLoading={isUpdating}
          onPress={onSave}
        >
          {isUpdating ? messages.updating : messages.update}
        </Button>
      </div>
    </div>
  );
}
