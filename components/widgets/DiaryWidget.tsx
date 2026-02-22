'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import WidgetWrapper from '../WidgetWrapper';
import { WidgetProps } from '@/lib/types';

export default function DiaryWidget({ id, config, size }: WidgetProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const response = await fetch(`/api/data?type=diary&path=${config.dataPath}`);
        const data = await response.json();
        setContent(data.content || '');
      } catch (error) {
        console.error('Failed to load diary:', error);
        setContent('日記の読み込みに失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
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

  return (
    <WidgetWrapper title={config.title}>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </WidgetWrapper>
  );
}
