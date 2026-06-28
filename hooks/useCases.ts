import { useMemo } from 'react';
import { getMockCases, getMockCase } from '@/src/data/mockData';
import type { CaseType } from '@/types/case';

export function useCases(projectId: number): CaseType[] {
  return useMemo(() => getMockCases(projectId), [projectId]);
}

export function useCase(caseId: number): CaseType | undefined {
  return useMemo(() => getMockCase(caseId), [caseId]);
}
