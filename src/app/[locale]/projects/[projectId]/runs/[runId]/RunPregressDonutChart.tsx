import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { testRunCaseStatus } from '@/config/selection';
import { RunStatusCountType } from '@/types/run';
import { TestRunCaseStatusMessages } from '@/types/status';
import { ChartDataType } from '@/types/chart';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
  statusCounts: RunStatusCountType[];
  testRunCaseStatusMessages: TestRunCaseStatusMessages;
  theme: string | undefined;
};

export default function RunProgressDounut({ statusCounts, testRunCaseStatusMessages }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>({
    series: [],
    options: { labels: [], colors: [] },
  });

  useEffect(() => {
    if (!statusCounts) return;

    const series = testRunCaseStatus.map((entry, index) => {
      const found = statusCounts.find((itr) => itr.status === index);
      return found ? found.count : 0;
    });
    const labels = testRunCaseStatus.map((entry) => testRunCaseStatusMessages[entry.uid]);
    const colors = testRunCaseStatus.map((entry) => entry.chartColor);

    setChartData({
      series,
      options: {
        labels,
        colors,
        legend: {
          position: 'right' as const,
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: 500,
          labels: { colors: '#374151' },
          markers: { size: 10 },
        },
        tooltip: {
          enabled: true,
          fillSeriesColor: false,
          custom: ({ series, seriesIndex, w }: {
            series: number[];
            seriesIndex: number;
            w: { globals: { labels: string[]; colors: string[] } };
          }) => {
            const count = series[seriesIndex];
            const label = w.globals.labels[seriesIndex];
            const color = w.globals.colors[seriesIndex];
            return `<div style="background:#1e1e1e;border-radius:7px;padding:7px 11px;box-shadow:0 4px 14px rgba(0,0,0,0.4);border:1px solid #2a2a2a;font-family:inherit;white-space:nowrap">
              <div style="display:flex;align-items:center;gap:7px">
                <span style="width:6px;height:6px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block"></span>
                <span style="color:#d4d4d4;font-size:11px">${label}</span>
                <span style="color:#f5f5f5;font-weight:700;font-size:11px;margin-left:8px">${count}</span>
              </div>
            </div>`;
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: '600',
            colors: ['#fff'],
          },
          dropShadow: { enabled: false },
          formatter: (val: number) => (val > 0 ? `${Math.round(val)}%` : ''),
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: '62%',
              labels: { show: false },
            },
          },
        },
        stroke: { width: 2, colors: ['#f5f6f8'] },
        chart: { events: {} },
      },
    });
  }, [statusCounts, testRunCaseStatusMessages]);

  return <Chart options={chartData.options} series={chartData.series} type="donut" width="100%" height="100%" />;
}
