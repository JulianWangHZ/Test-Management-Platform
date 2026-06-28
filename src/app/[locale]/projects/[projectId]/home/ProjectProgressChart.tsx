'use client';
import dynamic from 'next/dynamic';
import { ProgressSeriesType } from '@/types/run';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const COLORS = ['#1aa3c0', '#6ea56c', '#f15f47', '#d4860a', '#805aab'];

type Props = {
  series: ProgressSeriesType[];
  categories: Array<string | string[]>;
};

export function ProjectProgressChart({ series, categories }: Props) {
  const options = {
    chart: {
      type: 'bar' as const,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      selection: { enabled: false },
      background: 'transparent',
      animations: { enabled: true, speed: 400 },
      fontFamily: 'inherit',
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: '#1e293b', fontSize: '11px', fontFamily: 'inherit', fontWeight: 500 },
        trim: false,
        hideOverlappingLabels: false,
        rotate: 0,
        rotateAlways: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: { style: { colors: '#6b7280', fontSize: '11px', fontFamily: 'inherit' } },
      min: 0,
      crosshairs: { show: false },
    },
    colors: COLORS,
    legend: {
      position: 'bottom' as const,
      horizontalAlign: 'left' as const,
      fontSize: '11px',
      fontFamily: 'inherit',
      fontWeight: 500,
      labels: { colors: '#1e293b' },
      markers: { size: 9 },
      itemMargin: { horizontal: 8 },
      offsetY: 4,
    },
    plotOptions: { bar: { horizontal: false, borderRadius: 3, columnWidth: '45%' } },
    dataLabels: {
      enabled: true,
      style: { fontSize: '11px', fontFamily: 'inherit', fontWeight: '700', colors: ['#fff'] },
      dropShadow: { enabled: false },
      formatter: (val: number) => (val > 0 ? `${val}` : ''),
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    tooltip: {
      shared: true,
      intersect: false,
      followCursor: true,
      custom: ({ series: s, dataPointIndex, w }: {
        series: number[][];
        seriesIndex: number;
        dataPointIndex: number;
        w: { globals: { seriesNames: string[]; labels: (string | string[])[] } };
      }) => {
        const names = w.globals.seriesNames;
        const rawLabel = w.globals.labels[dataPointIndex];
        const runName = Array.isArray(rawLabel) ? rawLabel.join(' ') : String(rawLabel);
        const total = s.reduce((sum, row) => sum + (row[dataPointIndex] ?? 0), 0);
        const rows = s.map((row, i) => {
          const count = row[dataPointIndex] ?? 0;
          if (count === 0) return '';
          return `<div style="display:flex;justify-content:space-between;align-items:center;gap:14px;padding:2px 0">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="width:6px;height:6px;border-radius:50%;background:${COLORS[i]};flex-shrink:0;display:inline-block"></span>
              <span style="color:#d4d4d4;font-size:11px;white-space:nowrap">${names[i]}</span>
            </div>
            <span style="color:#f5f5f5;font-weight:600;font-size:11px">${count}</span>
          </div>`;
        }).join('');
        return `<div style="background:#1e1e1e;border-radius:7px;padding:9px 12px;min-width:155px;box-shadow:0 4px 14px rgba(0,0,0,0.4);border:1px solid #2a2a2a;font-family:inherit">
          <div style="font-weight:600;color:#f5f5f5;font-size:12px;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #2a2a2a;white-space:nowrap">${runName}</div>
          ${rows}
          <div style="margin-top:5px;padding-top:5px;border-top:1px solid #2a2a2a;display:flex;justify-content:space-between;align-items:center">
            <span style="color:#a3a3a3;font-size:10px;font-weight:500">Total</span>
            <span style="color:#f5f5f5;font-weight:700;font-size:11px">${total}</span>
          </div>
        </div>`;
      },
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
      padding: { top: 8, left: 4, right: 8, bottom: 0 },
    },
    responsive: [{
      breakpoint: 640,
      options: {
        plotOptions: { bar: { columnWidth: '60%' } },
        legend: { fontSize: '10px', itemMargin: { horizontal: 6 } },
      },
    }],
    theme: { mode: 'light' as const },
  };

  return <Chart options={options} series={series} type="bar" height={320} width="100%" />;
}
