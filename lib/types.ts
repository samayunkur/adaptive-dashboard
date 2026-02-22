// 型定義

export interface WidgetConfig {
  title?: string;
  dataPath?: string;
  displayMode?: string;
  limit?: number;
  colorScheme?: 'green' | 'blue' | 'purple';
  activityType?: string;
  filter?: string;
  key?: string;
  unit?: string;
  color?: string;
  chartType?: 'line' | 'bar' | 'pie';
  filePath?: string;
  imagesPath?: string;
  layout?: 'grid' | 'carousel';
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

export interface Widget {
  id: string;
  type: 'diary' | 'heatmap' | 'milestone' | 'counter' | 'chart' | 'markdown' | 'todo' | 'gallery' | 'timeline';
  position: { x: number; y: number };
  size: { w: number; h: number };
  config: WidgetConfig;
}

export interface LayoutData {
  version: string;
  grid: {
    columns: number;
    rowHeight: number;
    gap: number;
  };
  widgets: Widget[];
}

export interface DiaryEntry {
  date: string;
  content: string;
}

export interface Activity {
  date: string;
  count: number;
  type: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress?: number;
  dueDate?: string;
  createdAt: string;
}

export interface Counter {
  value: number;
  updatedAt: string;
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: Array<{ date?: string; value: number; [key: string]: any }>;
  yLabel?: string;
  xLabel?: string;
}

export interface WidgetProps {
  id: string;
  config: WidgetConfig;
  size: { w: number; h: number };
}
