'use client';

import React, { useEffect, useState } from 'react';
import WidgetWrapper from '../WidgetWrapper';
import { WidgetProps, Milestone } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function MilestoneWidget({ id, config, size }: WidgetProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await fetch(`/api/data?type=milestones&path=${config.dataPath}`);
        const data = await response.json();
        setMilestones(data.milestones || []);
      } catch (error) {
        console.error('Failed to load milestones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
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

  const filteredMilestones = config.filter
    ? milestones.filter(m => {
        if (config.filter === 'all') return true;
        return m.status === config.filter;
      })
    : milestones;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'not-started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'in-progress':
        return '進行中';
      case 'not-started':
        return '未着手';
      default:
        return status;
    }
  };

  return (
    <WidgetWrapper title={config.title}>
      <div className="space-y-4">
        {filteredMilestones.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            マイルストーンがありません
          </p>
        ) : (
          filteredMilestones.map(milestone => (
            <div
              key={milestone.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white flex-1">
                  {milestone.title}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(milestone.status)}`}>
                  {getStatusLabel(milestone.status)}
                </span>
              </div>
              
              {milestone.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {milestone.description}
                </p>
              )}
              
              {milestone.progress !== undefined && milestone.status === 'in-progress' && (
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>進捗</span>
                    <span>{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {milestone.dueDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  期限: {formatDate(milestone.dueDate)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </WidgetWrapper>
  );
}
