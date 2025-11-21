import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { PronunciationOption } from '../types';

interface ChartDisplayProps {
  options: PronunciationOption[];
  totalVotes: number;
}

// Pop & Bright colors
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

const ChartDisplay: React.FC<ChartDisplayProps> = ({ options, totalVotes }) => {
  // Calculate percentages for tooltip or label
  const data = options.map(opt => ({
    ...opt,
    percentage: totalVotes > 0 ? Math.round((opt.count / totalVotes) * 100) : 0
  })).sort((a, b) => b.count - a.count); // Sort by popularity

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xl text-sm z-50">
          <p className="font-bold text-slate-800 text-lg mb-1">{dataPoint.label}</p>
          <div className="flex items-center gap-2">
             <span className="font-bold text-orange-500 text-xl">{`${dataPoint.percentage}%`}</span>
             <span className="text-slate-400">{`(${dataPoint.count} 票)`}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={100}
            tick={{ fill: '#475569', fontSize: 13, fontWeight: 700 }}
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{fill: 'rgba(0,0,0,0.03)', radius: 8}} 
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartDisplay;