'use client';

import React, { useEffect, useState } from 'react';
import WidgetWrapper from '../WidgetWrapper';
import { WidgetProps, Activity } from '@/lib/types';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export default function HeatmapWidget({ id, config, size }: WidgetProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/data?type=activity&path=${config.dataPath}`);
        const data = await response.json();
        setActivities(data.activities || []);
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
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

  // 過去90日分の日付を生成
  const endDate = new Date();
  const startDate = subDays(endDate, 89);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // アクティビティデータをマップに変換
  const activityMap = new Map<string, number>();
  activities.forEach(a => {
    const existing = activityMap.get(a.date) || 0;
    activityMap.set(a.date, existing + a.count);
  });

  // 最大値を求める（色の濃さ計算用）
  const maxCount = Math.max(...Array.from(activityMap.values()), 1);

  const getColorIntensity = (count: number): string => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    const intensity = Math.min(Math.ceil((count / maxCount) * 4), 4);
    const colorScheme = config.colorScheme || 'green';
    
    const colors: Record<string, string[]> = {
      green: [
        'bg-green-100 dark:bg-green-900',
        'bg-green-200 dark:bg-green-800',
        'bg-green-300 dark:bg-green-700',
        'bg-green-400 dark:bg-green-600',
        'bg-green-500 dark:bg-green-500',
      ],
      blue: [
        'bg-blue-100 dark:bg-blue-900',
        'bg-blue-200 dark:bg-blue-800',
        'bg-blue-300 dark:bg-blue-700',
        'bg-blue-400 dark:bg-blue-600',
        'bg-blue-500 dark:bg-blue-500',
      ],
      purple: [
        'bg-purple-100 dark:bg-purple-900',
        'bg-purple-200 dark:bg-purple-800',
        'bg-purple-300 dark:bg-purple-700',
        'bg-purple-400 dark:bg-purple-600',
        'bg-purple-500 dark:bg-purple-500',
      ],
    };

    return colors[colorScheme]?.[intensity] || colors.green[intensity];
  };

  return (
    <WidgetWrapper title={config.title}>
      <div className="grid grid-cols-13 gap-1">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const count = activityMap.get(dateStr) || 0;
          return (
            <div
              key={dateStr}
              className={`w-3 h-3 rounded-sm ${getColorIntensity(count)}`}
              title={`${dateStr}: ${count}`}
            />
          );
        })}
      </div>
    </WidgetWrapper>
  );
}
