'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Lock, Globe, Play, ChevronRight } from 'lucide-react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Switch } from '@heroui/react';
import { useProjects } from '@/hooks/useProjects';
import { rateColor } from '@/utils/rateColor';
import type { ProjectType } from '@/types/project';
import type { ProjectsMessages } from '@/types/project';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type Props = {
  locale: string;
  messages: ProjectsMessages;
};

export default function ProjectsPage({ locale, messages }: Props) {
  const initialProjects = useProjects();
  const [projects, setProjects] = useState<ProjectType[]>(initialProjects);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const openCreate = () => {
    setName('');
    setDetail('');
    setIsPublic(true);
    setIsOpen(true);
  };

  const onCreate = () => {
    if (!name.trim()) return;
    const next: ProjectType = {
      id: Date.now(),
      name: name.trim(),
      detail: detail.trim(),
      isPublic,
      userId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      Folders: [],
      Runs: [],
    };
    setProjects([...projects, next]);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/favicon/icon.svg" width={22} height={22} alt="" />
          <span className="font-semibold text-sm text-gray-900 tracking-wide">Agentic QA</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{messages.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {projects.length} {projects.length !== 1 ? messages.projectsLabel : messages.project}
            </p>
          </div>
          <Button
            startContent={<Plus size={16} />}
            size="sm"
            color="primary"
            onPress={openCreate}
          >
            {messages.newProject}
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Play size={22} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium text-sm">{messages.noProjectsYet}</p>
            <p className="text-gray-400 text-xs mt-1">{messages.createFirstProject}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} messages={messages} />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="center"
        classNames={{ base: 'mx-4 sm:mx-auto' }}
      >
        <ModalContent>
          <ModalHeader className="text-base font-semibold">{messages.newProject}</ModalHeader>
          <ModalBody className="gap-4 px-5 pb-2">
            <Input
              label={messages.projectName}
              placeholder={messages.projectNamePlaceholder}
              size="sm"
              variant="bordered"
              value={name}
              onValueChange={setName}
              isRequired
            />
            <Textarea
              label={messages.description}
              placeholder={messages.descriptionPlaceholder}
              size="sm"
              variant="bordered"
              value={detail}
              onValueChange={setDetail}
              minRows={2}
            />
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-gray-700">{messages.public}</p>
                <p className="text-xs text-gray-400">{messages.publicHint}</p>
              </div>
              <Switch isSelected={isPublic} onValueChange={setIsPublic} size="sm" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="bordered" onPress={() => setIsOpen(false)}>{messages.cancel}</Button>
            <Button size="sm" color="primary" onPress={onCreate} isDisabled={!name.trim()}>{messages.create}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}


function ProjectCard({ project, locale, messages }: { project: ProjectType; locale: string; messages: ProjectsMessages }) {
  const runCount = project.Runs?.length ?? 0;
  const allRunCases = (project.Runs ?? []).flatMap((r) => r.RunCases ?? []);
  const total = allRunCases.length;
  const passed = allRunCases.filter((rc) => rc.status === 1).length;
  const failed = allRunCases.filter((rc) => rc.status === 2).length;
  const rate = total > 0 ? Math.round((passed / total) * 100) : -1;

  return (
    <Link href={`/${locale}/projects/${project.id}/home`}>
      <div className="group bg-white border border-gray-300 rounded-2xl p-5 hover:border-gray-400 hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
        {/* Card top */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {project.isPublic ? (
                <Globe size={11} className="text-green-500 flex-shrink-0" />
              ) : (
                <Lock size={11} className="text-gray-400 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-500">{project.isPublic ? messages.public : messages.private}</span>
            </div>
            <h2 className="font-semibold text-gray-900 text-base leading-snug line-clamp-1 group-hover:text-black">
              {project.name}
            </h2>
          </div>
          <ChevronRight size={15} className="text-gray-400 group-hover:text-gray-600 flex-shrink-0 mt-1 ml-2 transition-colors" />
        </div>

        {project.detail && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">{project.detail}</p>
        )}

        {/* Pass rate bar */}
        {rate >= 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{messages.passRate}</span>
              <span className="text-xs font-semibold" style={{ color: rateColor(rate) }}>{rate}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="h-full transition-all duration-500" style={{ width: `${(passed / total) * 100}%`, backgroundColor: '#16a34a' }} />
              <div className="h-full transition-all duration-500" style={{ width: `${(failed / total) * 100}%`, backgroundColor: '#ef4444' }} />
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            {runCount > 0 ? (
              <>
                <Play size={11} className="text-gray-400" fill="currentColor" />
                <span className="text-xs text-gray-600">{runCount} {runCount !== 1 ? messages.runs : messages.run}</span>
              </>
            ) : (
              <span className="text-xs text-gray-400">{messages.noRunsYet}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{dayjs(project.updatedAt).fromNow()}</span>
        </div>
      </div>
    </Link>
  );
}
