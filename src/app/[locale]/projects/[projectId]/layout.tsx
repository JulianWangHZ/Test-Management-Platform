import ProjectShell from '@/components/ProjectShell';

export default function ProjectLayout({
  children,
  params: { locale, projectId },
}: {
  children: React.ReactNode;
  params: { locale: string; projectId: string };
}) {
  return (
    <ProjectShell locale={locale} projectId={projectId}>
      {children}
    </ProjectShell>
  );
}
