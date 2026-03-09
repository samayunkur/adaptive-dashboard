import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { Activity, Milestone, Counter, Todo, ChartData, LayoutData } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

// データ型定義
interface CountersData {
  [key: string]: Counter;
}

interface ActivityData {
  activities: Activity[];
}

interface MilestoneData {
  milestones: Milestone[];
}

interface TodoData {
  todos: Todo[];
}

// LowDBインスタンス作成
const createDB = async <T>(filename: string, defaultValue: T): Promise<Low<T>> => {
  const filePath = path.join(DATA_DIR, filename);
  const adapter = new JSONFile<T>(filePath);
  const db = new Low<T>(adapter, defaultValue);
  await db.read();
  return db;
};

// 各DBインスタンス
let countersDB: Low<CountersData> | null = null;
let activityDB: Low<ActivityData> | null = null;
let milestonesDB: Low<MilestoneData> | null = null;
let todosDB: Low<TodoData> | null = null;
let layoutDB: Low<LayoutData> | null = null;

// 初期化フラグ
let initialized = false;

// 初期化関数
export const initDatabases = async () => {
  if (initialized) return;
  
  countersDB = await createDB<CountersData>('counters.json', {});
  activityDB = await createDB<ActivityData>('activity.json', { activities: [] });
  milestonesDB = await createDB<MilestoneData>('milestones.json', { milestones: [] });
  todosDB = await createDB<TodoData>('todos.json', { todos: [] });
  layoutDB = await createDB<LayoutData>('layout.json', {
    version: '1.0',
    grid: { columns: 12, rowHeight: 100, gap: 16 },
    widgets: [],
  });
  
  initialized = true;
};

// 初期化確認ヘルパー
export const ensureInitialized = async () => {
  if (!initialized) {
    await initDatabases();
  }
};

// データベースゲッター
export const getCountersDB = (): Low<CountersData> => {
  if (!countersDB) throw new Error('Database not initialized');
  return countersDB;
};

export const getActivityDB = (): Low<ActivityData> => {
  if (!activityDB) throw new Error('Database not initialized');
  return activityDB;
};

export const getMilestonesDB = (): Low<MilestoneData> => {
  if (!milestonesDB) throw new Error('Database not initialized');
  return milestonesDB;
};

export const getTodosDB = (): Low<TodoData> => {
  if (!todosDB) throw new Error('Database not initialized');
  return todosDB;
};

export const getLayoutDB = (): Low<LayoutData> => {
  if (!layoutDB) throw new Error('Database not initialized');
  return layoutDB;
};

// チャートデータ読み込み（動的）
export const loadChart = async (filename: string): Promise<ChartData | null> => {
  try {
    const db = await createDB<ChartData>(`charts/${filename}`, {
      type: 'line',
      title: '',
      data: [],
    });
    return db.data;
  } catch {
    return null;
  }
};

// チャートデータ保存（動的）
export const saveChart = async (filename: string, data: ChartData): Promise<void> => {
  const db = await createDB<ChartData>(`charts/${filename}`, data);
  db.data = data;
  await db.write();
};
