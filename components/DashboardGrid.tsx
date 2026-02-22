'use client';

import React from 'react';
import GridLayout from 'react-grid-layout';
import { Widget } from '@/lib/types';
import 'react-grid-layout/css/styles.css';

// ウィジェットコンポーネントを動的にインポート
import DiaryWidget from './widgets/DiaryWidget';
import CounterWidget from './widgets/CounterWidget';
import HeatmapWidget from './widgets/HeatmapWidget';

interface DashboardGridProps {
  widgets: Widget[];
  columns: number;
  rowHeight: number;
  gap: number;
}

const widgetComponents: Record<string, React.ComponentType<any>> = {
  diary: DiaryWidget,
  counter: CounterWidget,
  heatmap: HeatmapWidget,
  // 他のウィジェットは後で追加
};

export default function DashboardGrid({ widgets, columns, rowHeight, gap }: DashboardGridProps) {
  const layout = widgets.map(w => ({
    i: w.id,
    x: w.position.x,
    y: w.position.y,
    w: w.size.w,
    h: w.size.h,
    static: true, // 編集不可（Phase 3で変更可能にする）
  }));

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={columns}
      rowHeight={rowHeight}
      width={1200}
      margin={[gap, gap]}
      isDraggable={false}
      isResizable={false}
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
          <div key={widget.id}>
            <WidgetComponent
              id={widget.id}
              config={widget.config}
              size={widget.size}
            />
          </div>
        );
      })}
    </GridLayout>
  );
}
