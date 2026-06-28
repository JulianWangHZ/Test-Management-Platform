import { ProjectType } from '@/types/project';
import { priorities, testRunCaseStatus } from '@/config/selection';
import { TestRunCaseStatusMessages } from '@/types/status';
import { CasePriorityCountType } from '@/types/chart';

function aggregateTestPriority(project: ProjectType) {
  const priorityCounts: number[] = priorities.map(() => 0);
  project.Folders.forEach((folder) => {
    folder.Cases.forEach((testcase) => {
      priorityCounts[testcase.priority]++;
    });
  });

  const result: CasePriorityCountType[] = [];
  for (let priority = 0; priority < priorities.length; priority++) {
    result.push({ priority, count: priorityCounts[priority] });
  }
  return result;
}

function formatRunLabel(name: string): string | string[] {
  const WRAP_AT = 15;
  const MAX_LINE = 14;

  if (name.length <= WRAP_AT) return name;

  const mid = Math.ceil(name.length / 2);
  let splitAt = name.lastIndexOf(' ', mid);
  if (splitAt <= 0) splitAt = mid;

  const line1 = name.slice(0, splitAt).trim();
  let line2 = name.slice(splitAt).trim();
  if (line2.length > MAX_LINE) line2 = line2.slice(0, MAX_LINE - 1) + '…';

  return [line1, line2];
}

function aggregateProgress(project: ProjectType, testRunCaseStatusMessages: TestRunCaseStatusMessages) {
  type ChartSeries = { name: string; data: number[] };
  const series: ChartSeries[] = testRunCaseStatus.map((status) => ({
    name: testRunCaseStatusMessages[status.uid],
    data: [],
  }));
  const categories: Array<string | string[]> = [];

  project.Runs.forEach((run) => {
    categories.push(formatRunLabel(run.name));
    series.forEach((s) => s.data.push(0));

    (run.RunCases ?? []).forEach((rc) => {
      const idx = categories.length - 1;
      if (series[rc.status]) series[rc.status].data[idx]++;
    });
  });

  return { series, categories };
}

export { aggregateTestPriority, aggregateProgress };
