import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import styled from 'styled-components';

const data = [
  { name: 'Apr', value: 30000 },
  { name: 'May', value: 50000 },
  { name: 'Jun', value: 40000 },
  { name: 'Jul', value: 90000 },
  { name: 'Aug', value: 60000 },
  { name: 'Sep', value: 50000 },
  { name: 'Oct', value: 60000 },
];

const yAxisTicks = [0, 20000, 40000, 60000, 80000, 100000];
const xAxisTicks = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const DetailsCard: React.FC<{ x: number; y: number; label: string; value: number; visible: boolean }> = ({ x, y, label, value, visible }) => (
  <div
    style={{
      position: 'fixed',
      left: x,
      top: y - 110,
      background: '#181A20',
      color: '#D7FF4F',
      padding: '18px 24px',
      borderRadius: 12,
      border: '2px solid #D7FF4F',
      fontSize: 15,
      fontWeight: 600,
      boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
      opacity: visible ? 1 : 0,
      pointerEvents: 'none',
      zIndex: 3000,
      transform: 'translate(-50%, 0)',
      transition: 'opacity 0.18s',
      minWidth: 140,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      fontFamily: 'Inter, sans-serif',
    }}
  >
    <div style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginBottom: 4 }}>{label}</div>
    <div style={{ fontWeight: 800, fontSize: 22, color: '#D7FF4F', marginBottom: 2 }}>{`$${value.toLocaleString()}`}</div>
    <div style={{ color: '#A0A3AD', fontWeight: 400, fontSize: 12 }}>Monthly Value</div>
  </div>
);

const ChartCard = styled.div`
  background: #23252B;
  border: 1.5px solid #393B40;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 36px 36px 32px 36px;
  height: 400px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 18px;
  width: 100%;
`;

const ChartDropdownWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ChartDropdown = styled.select`
  background: #23252B;
  border: 1.5px solid #393B40;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 36px 10px 16px;
  outline: none;
  font-family: 'Inter', sans-serif;
  appearance: none;
  cursor: pointer;
  min-width: 220px;
  transition: border 0.18s;
  box-shadow: none;
  &:hover, &:focus {
    border-color: #D7FF3A;
  }
`;

// Custom XAxis tick renderer to show 'Now' under 'May', bold and centered, Figma font
const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const isNow = payload.value === 'May';
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={18} fill="#E6E6E6" fontSize={12.25} fontWeight={500} fontFamily="Inter, sans-serif" textAnchor="middle">
        {payload.value}
      </text>
      {isNow && (
        <text x={0} y={0} dy={36} fill="#A0A3AD" fontSize={11} fontWeight={400} fontFamily="Inter, sans-serif" textAnchor="middle" opacity={0.7} letterSpacing={0.5}>
          Now
        </text>
      )}
    </g>
  );
};

// Custom YAxis tick renderer: Figma font, left-aligned, $20K format, vertically centered
const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text x={x - 24} y={y + 8} fill="#E6E6E6" fontSize={12.25} fontWeight={500} fontFamily="Inter, sans-serif" textAnchor="end">
      {`$${payload.value / 1000}K`}
    </text>
  );
};

const DashboardChart: React.FC = () => {
  const [hover, setHover] = useState<{ x: number; y: number; label: string; value: number; index: number } | null>(null);
  const [selected, setSelected] = useState('Unsatisfied Demand %');

  return (
    <ChartCard>
      <ChartHeader>
        <ChartDropdownWrapper>
          <ChartDropdown value={selected} onChange={e => setSelected(e.target.value)}>
            <option>Unsatisfied Demand %</option>
            <option>Charging Growth</option>
            <option>Fleet Growth</option>
          </ChartDropdown>
          {/* Custom arrow icon (SVG) for dropdown */}
          <svg style={{position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7L9 11L13 7" stroke="#E6E6E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ChartDropdownWrapper>
      </ChartHeader>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 32, left: 40, bottom: 32 }}
            onMouseMove={state => {
              // Type guard for recharts MouseEvent
              const anyState = state as any;
              if (anyState && anyState.activePayload && anyState.activeCoordinate && anyState.activeLabel) {
                const chartElement = document.querySelector('.recharts-wrapper');
                const chartRect = chartElement?.getBoundingClientRect();
                if (chartRect) {
                  setHover({
                    x: anyState.activeCoordinate.x + chartRect.left,
                    y: anyState.activeCoordinate.y + chartRect.top,
                    label: typeof anyState.activeLabel === 'string' ? anyState.activeLabel : String(anyState.activeLabel ?? ''),
                    value: anyState.activePayload[0].value,
                    index: anyState.activeTooltipIndex,
                  });
                }
              } else {
                setHover(null);
              }
            }}
            onMouseLeave={() => setHover(null)}
          >
            {/* Figma-style grid lines */}
            <CartesianGrid stroke="#393B40" strokeOpacity={0.12} horizontal={true} vertical={true} />
            <XAxis 
              dataKey="name" 
              stroke="#E6E6E6" 
              fontSize={16} 
              tickLine={false} 
              axisLine={false}
              tick={<CustomXAxisTick />}
              ticks={xAxisTicks}
            />
            <YAxis 
              stroke="#E6E6E6" 
              fontSize={16} 
              tickLine={false} 
              axisLine={false} 
              tick={<CustomYAxisTick />}
              domain={[0, 100000]}
              ticks={yAxisTicks}
            />
            {/* Figma base line below the graph */}
            <ReferenceLine y={20000} stroke="#393B40" strokeWidth={2} />
            {/* Dashed vertical line at hovered point */}
            {hover && typeof hover.index === 'number' && (
              <ReferenceLine x={data[hover.index].name} stroke="#D7FF3A" strokeDasharray="6 6" strokeWidth={2} ifOverflow="extendDomain" />
            )}
            <Line 
              type="linear" 
              dataKey="value" 
              stroke="#D7FF3A" 
              strokeWidth={4} 
              dot={{ 
                r: 7, 
                fill: '#23252B', 
                stroke: '#D7FF3A', 
                strokeWidth: 4, 
                style: { filter: 'drop-shadow(0 0 8px #D7FF3A)' }
              }} 
              activeDot={{ 
                r: 11, 
                fill: '#23252B', 
                stroke: '#D7FF3A', 
                strokeWidth: 5, 
                style: { filter: 'drop-shadow(0 0 18px #D7FF3A)' }
              }} 
            />
          </LineChart>
        </ResponsiveContainer>
        {hover && (
          <DetailsCard x={hover.x} y={hover.y} label={hover.label} value={hover.value} visible={!!hover} />
        )}
      </div>
    </ChartCard>
  );
};

export default DashboardChart; 