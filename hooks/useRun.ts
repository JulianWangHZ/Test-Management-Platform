import { useMemo } from 'react';
import { getMockRun } from '@/src/data/mockData';
import type { RunType } from '@/types/run';

export function useRun(runId: number): RunType | undefined {
  return useMemo(() => getMockRun(runId), [runId]);
}
