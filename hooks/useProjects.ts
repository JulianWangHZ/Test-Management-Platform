import { useMemo } from 'react';
import { MOCK_PROJECTS } from '@/src/data/mockData';
import { ProjectType } from '@/types/project';

export function useProjects(): ProjectType[] {
  return useMemo(() => MOCK_PROJECTS, []);
}
