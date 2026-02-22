'use client';

import React, { useEffect, useState } from 'react';
import WidgetWrapper from '../WidgetWrapper';
import { WidgetProps } from '@/lib/types';

export default function CounterWidget({ id, config, size }: WidgetProps) {
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await fetch(`/api/data?type=counter&path=${config.dataPath}&key=${config.key}`);
        const data = await response.json();
        setValue(data.value || 0);
      } catch (error) {
        console.error('Failed to load counter:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounter();
  }, [config.dataPath, config.key]);

  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    red: 'text-red-600 dark:text-red-400',
  };

  const colorClass = colorClasses[config.color || 'blue'] || colorClasses.blue;

  if (loading) {
    return (
      <WidgetWrapper title={config.title}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper title={config.title}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className={`text-6xl font-bold ${colorClass}`}>
          {value.toLocaleString()}
        </div>
        {config.unit && (
          <div className="mt-2 text-2xl text-gray-600 dark:text-gray-400">
            {config.unit}
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
}
