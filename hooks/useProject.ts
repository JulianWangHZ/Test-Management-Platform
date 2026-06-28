import { useMemo } from 'react';
import { getMockProject } from '@/src/data/mockData';
import type { ProjectType } from '@/types/project';

// When the backend arrives, replace the body with: const { data } = useSWR(`/api/projects/${projectId}`)
export function useProject(projectId: number): ProjectType | undefined {
  return useMemo(() => getMockProject(projectId), [projectId]);
}
