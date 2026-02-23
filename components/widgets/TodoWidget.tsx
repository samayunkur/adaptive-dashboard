'use client';

import React, { useEffect, useState } from 'react';
import WidgetWrapper from '../WidgetWrapper';
import { WidgetProps, Todo } from '@/lib/types';

export default function TodoWidget({ id, config, size }: WidgetProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`/api/data?type=todos&path=${config.dataPath}`);
        const data = await response.json();
        setTodos(data.todos || []);
      } catch (error) {
        console.error('Failed to load todos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
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

  const filteredTodos = config.filter
    ? todos.filter(t => {
        if (config.filter === 'all') return true;
        if (config.filter === 'active') return !t.done;
        if (config.filter === 'completed') return t.done;
        return true;
      })
    : todos;

  const completedCount = todos.filter(t => t.done).length;
  const totalCount = todos.length;

  return (
    <WidgetWrapper title={config.title}>
      <div className="space-y-3">
        {totalCount > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {completedCount} / {totalCount} 完了
          </div>
        )}
        
        {filteredTodos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            TODOがありません
          </p>
        ) : (
          <div className="space-y-2">
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    readOnly
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      todo.done
                        ? 'line-through text-gray-500 dark:text-gray-500'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {todo.text}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(todo.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
}
