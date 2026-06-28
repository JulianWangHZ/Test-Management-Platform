'use client';
import dynamic from 'next/dynamic';
import { rateColor } from '@/utils/rateColor';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
  passRate: number;
};

export function ProjectPassRateChart({ passRate }: Props) {
  const color = rateColor(passRate);

  const options = {
    chart: { type: 'radialBar' as const, sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: '22px',
            fontWeight: '700',
            fontFamily: 'inherit',
            color,
            formatter: (v: number) => `${v}%`,
            offsetY: 8,
          },
        },
        hollow: { size: '62%' },
        track: { background: '#e5e7eb', margin: 4, strokeWidth: '100%' },
      },
    },
    fill: { colors: [color] },
    stroke: { lineCap: 'round' as const },
    tooltip: { enabled: false },
    labels: ['Pass Rate'],
  };

  return (
    <Chart options={options} series={[passRate]} type="radialBar" height={120} width={120} />
  );
}
