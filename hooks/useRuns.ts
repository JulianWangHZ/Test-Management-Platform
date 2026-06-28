import { useMemo } from 'react';
import { getMockRuns } from '@/src/data/mockData';
import type { RunType } from '@/types/run';

export function useRuns(projectId: number): RunType[] {
  return useMemo(() => getMockRuns(projectId), [projectId]);
}
