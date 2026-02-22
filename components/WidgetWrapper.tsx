import React from 'react';

interface WidgetWrapperProps {
  title?: string;
  children: React.ReactNode;
}

export default function WidgetWrapper({ title, children }: WidgetWrapperProps) {
  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="flex-1 p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
}
