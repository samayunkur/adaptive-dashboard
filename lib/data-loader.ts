import { promises as fs } from 'fs';
import path from 'path';
import { LayoutData, Activity, Milestone, Counter, Todo, ChartData } from './types';
import {
  ensureInitialized,
  getCountersDB,
  getActivityDB,
  getMilestonesDB,
  getTodosDB,
  getLayoutDB,
  loadChart as loadChartFromDB,
} from './db';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function loadLayout(): Promise<LayoutData> {
  await ensureInitialized();
  return getLayoutDB().data;
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
  await ensureInitialized();
  return getActivityDB().data.activities || [];
}

export async function loadMilestones(): Promise<Milestone[]> {
  await ensureInitialized();
  return getMilestonesDB().data.milestones || [];
}

export async function loadCounters(): Promise<Record<string, Counter>> {
  await ensureInitialized();
  return getCountersDB().data || {};
}

export async function loadTodos(): Promise<Todo[]> {
  await ensureInitialized();
  return getTodosDB().data.todos || [];
}

export async function loadChart(filename: string): Promise<ChartData | null> {
  return loadChartFromDB(filename);
}

export async function loadMarkdown(filePath: string): Promise<string> {
  try {
    const fullPath = path.join(DATA_DIR, filePath);
    return await fs.readFile(fullPath, 'utf-8');
  } catch (error) {
    return 'ファイルが見つかりません。';
  }
}
