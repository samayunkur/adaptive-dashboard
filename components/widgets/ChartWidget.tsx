'use client';

import React, { useEffect, useState } from 'react';
import WidgetWrapper from '../WidgetWrapper';
import { WidgetProps, ChartData } from '@/lib/types';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ChartWidget({ id, config, size }: WidgetProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await fetch(`/api/data?type=chart&path=${config.dataPath}`);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Failed to load chart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, [config.dataPath]);

  if (loading) {
    return (
      <WidgetWrapper title={config.title}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </WidgetWrapper>
    );
  }

  if (!chartData) {
    return (
      <WidgetWrapper title={config.title}>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          チャートデータがありません
        </p>
      </WidgetWrapper>
    );
  }

  const chartType = config.chartType || chartData.type;

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="date" 
                className="text-xs fill-gray-600 dark:fill-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: chartData.yLabel || '', angle: -90, position: 'insideLeft' }}
                className="text-xs fill-gray-600 dark:fill-gray-400"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="date" 
                className="text-xs fill-gray-600 dark:fill-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: chartData.yLabel || '', angle: -90, position: 'insideLeft' }}
                className="text-xs fill-gray-600 dark:fill-gray-400"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name || entry.date}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <p className="text-center text-gray-500">未対応のチャートタイプ</p>;
    }
  };

  return (
    <WidgetWrapper title={config.title || chartData.title}>
      <div className="h-full min-h-[200px]">
        {renderChart()}
      </div>
    </WidgetWrapper>
  );
}
