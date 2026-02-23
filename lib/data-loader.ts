import { promises as fs } from 'fs';
import path from 'path';
import { LayoutData, Activity, Milestone, Counter, Todo, ChartData } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function loadLayout(): Promise<LayoutData> {
  try {
    const layoutPath = path.join(DATA_DIR, 'layout.json');
    const content = await fs.readFile(layoutPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load layout.json:', error);
    // デフォルトレイアウトを返す
    return {
      version: '1.0',
      grid: { columns: 12, rowHeight: 100, gap: 16 },
      widgets: [],
    };
  }
}

export async function loadDiary(yearMonth: string): Promise<string> {
  try {
    const diaryPath = path.join(DATA_DIR, 'diary', `${yearMonth}.md`);
    return await fs.readFile(diaryPath, 'utf-8');
  } catch (error) {
    return `# ${yearMonth}\n\n日記がまだありません。`;
  }
}

export async function loadActivities(): Promise<Activity[]> {
  try {
    const activityPath = path.join(DATA_DIR, 'activity.json');
    const content = await fs.readFile(activityPath, 'utf-8');
    const data = JSON.parse(content);
    return data.activities || [];
  } catch (error) {
    return [];
  }
}

export async function loadMilestones(): Promise<Milestone[]> {
  try {
    const milestonePath = path.join(DATA_DIR, 'milestones.json');
    const content = await fs.readFile(milestonePath, 'utf-8');
    const data = JSON.parse(content);
    return data.milestones || [];
  } catch (error) {
    return [];
  }
}

export async function loadCounters(): Promise<Record<string, Counter>> {
  try {
    const counterPath = path.join(DATA_DIR, 'counters.json');
    const content = await fs.readFile(counterPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

export async function loadTodos(): Promise<Todo[]> {
  try {
    const todoPath = path.join(DATA_DIR, 'todos.json');
    const content = await fs.readFile(todoPath, 'utf-8');
    const data = JSON.parse(content);
    return data.todos || [];
  } catch (error) {
    return [];
  }
}

export async function loadChart(filename: string): Promise<ChartData | null> {
  try {
    const chartPath = path.join(DATA_DIR, 'charts', filename);
    const content = await fs.readFile(chartPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

export async function loadMarkdown(filePath: string): Promise<string> {
  try {
    const fullPath = path.join(DATA_DIR, filePath);
    return await fs.readFile(fullPath, 'utf-8');
  } catch (error) {
    return 'ファイルが見つかりません。';
  }
}
