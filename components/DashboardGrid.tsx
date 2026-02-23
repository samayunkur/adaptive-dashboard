'use client';

import React from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { Widget } from '@/lib/types';
import 'react-grid-layout/css/styles.css';

// ウィジェットコンポーネントを動的にインポート
import DiaryWidget from './widgets/DiaryWidget';
import CounterWidget from './widgets/CounterWidget';
import HeatmapWidget from './widgets/HeatmapWidget';
import MilestoneWidget from './widgets/MilestoneWidget';
import TodoWidget from './widgets/TodoWidget';
import ChartWidget from './widgets/ChartWidget';
import MarkdownWidget from './widgets/MarkdownWidget';

interface DashboardGridProps {
  widgets: Widget[];
  columns: number;
  rowHeight: number;
  gap: number;
  editMode?: boolean;
  onLayoutChange?: (widgets: Widget[]) => void;
}

const widgetComponents: Record<string, React.ComponentType<any>> = {
  diary: DiaryWidget,
  counter: CounterWidget,
  heatmap: HeatmapWidget,
  milestone: MilestoneWidget,
  todo: TodoWidget,
  chart: ChartWidget,
  markdown: MarkdownWidget,
};

export default function DashboardGrid({ 
  widgets, 
  columns, 
  rowHeight, 
  gap, 
  editMode = false,
  onLayoutChange 
}: DashboardGridProps) {
  const [containerWidth, setContainerWidth] = React.useState(1200);

  React.useEffect(() => {
    const updateWidth = () => {
      const maxWidth = Math.min(window.innerWidth - 64, 1400);
      setContainerWidth(maxWidth);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const layout: Layout[] = widgets.map(w => ({
    i: w.id,
    x: w.position.x,
    y: w.position.y,
    w: w.size.w,
    h: w.size.h,
    static: !editMode,
  }));

  const handleLayoutChange = (newLayout: Layout[]) => {
    if (!editMode || !onLayoutChange) return;

    const updatedWidgets = widgets.map(widget => {
      const layoutItem = newLayout.find(l => l.i === widget.id);
      if (!layoutItem) return widget;

      return {
        ...widget,
        position: { x: layoutItem.x, y: layoutItem.y },
        size: { w: layoutItem.w, h: layoutItem.h },
      };
    });

    onLayoutChange(updatedWidgets);
  };

  return (
    <div className="relative">
      <GridLayout
        className="layout"
        layout={layout}
        cols={columns}
        rowHeight={rowHeight}
        width={containerWidth}
        margin={[gap, gap]}
        isDraggable={editMode}
        isResizable={editMode}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
      >
        {widgets.map(widget => {
          const WidgetComponent = widgetComponents[widget.type];
          if (!WidgetComponent) {
            return (
              <div key={widget.id} className="bg-red-100 p-4 rounded">
                Unknown widget type: {widget.type}
              </div>
            );
          }

          return (
            <div key={widget.id} className="relative">
              {editMode && (
                <div className="drag-handle absolute top-0 left-0 right-0 h-8 cursor-move bg-blue-500/20 hover:bg-blue-500/30 rounded-t-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>
              )}
              <div className={editMode ? 'pt-8' : ''}>
                <WidgetComponent
                  id={widget.id}
                  config={widget.config}
                  size={widget.size}
                />
              </div>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}
