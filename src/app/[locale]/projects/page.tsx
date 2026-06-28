import { useTranslations } from 'next-intl';
import ProjectsPage from './ProjectsPage';
import type { LocaleCodeType } from '@/types/locale';
import type { ProjectsMessages } from '@/types/project';
import type { PageType } from '@/types/base';

export default function Page({ params }: PageType) {
  const t = useTranslations('Projects');
  const messages: ProjectsMessages = {
    projectList: t('project_list'),
    newProject: t('new_project'),
    id: t('id'),
    publicity: t('publicity'),
    public: t('public'),
    private: t('private'),
    name: t('name'),
    detail: t('detail'),
    lastUpdate: t('last_update'),
    noProjectsFound: t('no_projects_found'),
    title: t('title'),
    project: t('project'),
    projectsLabel: t('projects_label'),
    projectName: t('project_name'),
    projectNamePlaceholder: t('project_name_placeholder'),
    description: t('description'),
    descriptionPlaceholder: t('description_placeholder'),
    publicHint: t('public_hint'),
    cancel: t('cancel'),
    create: t('create'),
    noProjectsYet: t('no_projects_yet'),
    createFirstProject: t('create_first_project'),
    passRate: t('pass_rate'),
    noRunsYet: t('no_runs_yet'),
    run: t('run'),
    runs: t('runs'),
  };

  return <ProjectsPage locale={params.locale as LocaleCodeType} messages={messages} />;
}
