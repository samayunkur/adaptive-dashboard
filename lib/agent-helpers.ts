/**
 * エージェント用ヘルパー関数
 * 
 * このファイルの関数はNode.js環境（サーバー側）でのみ使用可能。
 * エージェントがファイルシステムを直接操作するためのユーティリティ。
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Widget, Milestone, Todo, Activity } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

// ===== レイアウト操作 =====

export async function addWidget(widget: Widget): Promise<void> {
  const layoutPath = path.join(DATA_DIR, 'layout.json');
  const content = await fs.readFile(layoutPath, 'utf-8');
  const layout = JSON.parse(content);
  
  layout.widgets.push(widget);
  
  await fs.writeFile(layoutPath, JSON.stringify(layout, null, 2), 'utf-8');
}

export async function updateWidget(id: string, updates: Partial<Widget>): Promise<void> {
  const layoutPath = path.join(DATA_DIR, 'layout.json');
  const content = await fs.readFile(layoutPath, 'utf-8');
  const layout = JSON.parse(content);
  
  const widgetIndex = layout.widgets.findIndex((w: Widget) => w.id === id);
  if (widgetIndex === -1) {
    throw new Error(`Widget with id ${id} not found`);
  }
  
  layout.widgets[widgetIndex] = { ...layout.widgets[widgetIndex], ...updates };
  
  await fs.writeFile(layoutPath, JSON.stringify(layout, null, 2), 'utf-8');
}

export async function removeWidget(id: string): Promise<void> {
  const layoutPath = path.join(DATA_DIR, 'layout.json');
  const content = await fs.readFile(layoutPath, 'utf-8');
  const layout = JSON.parse(content);
  
  layout.widgets = layout.widgets.filter((w: Widget) => w.id !== id);
  
  await fs.writeFile(layoutPath, JSON.stringify(layout, null, 2), 'utf-8');
}

export async function resizeWidget(id: string, size: { w: number; h: number }): Promise<void> {
  await updateWidget(id, { size });
}

export async function moveWidget(id: string, position: { x: number; y: number }): Promise<void> {
  await updateWidget(id, { position });
}

// ===== 日記操作 =====

export async function appendToDiary(date: string, content: string): Promise<void> {
  const yearMonth = date.substring(0, 7); // "2026-02-21" → "2026-02"
  const diaryPath = path.join(DATA_DIR, 'diary', `${yearMonth}.md`);
  
  // ファイルが存在しない場合は作成
  let existingContent = '';
  try {
    existingContent = await fs.readFile(diaryPath, 'utf-8');
  } catch {
    existingContent = `# ${yearMonth}\n`;
  }
  
  const newEntry = `\n## ${date}\n${content}\n`;
  const updatedContent = existingContent + newEntry;
  
  await fs.writeFile(diaryPath, updatedContent, 'utf-8');
}

// ===== カウンター操作 =====

export async function updateCounter(key: string, value: number): Promise<void> {
  const counterPath = path.join(DATA_DIR, 'counters.json');
  const content = await fs.readFile(counterPath, 'utf-8');
  const counters = JSON.parse(content);
  
  counters[key] = {
    value,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  await fs.writeFile(counterPath, JSON.stringify(counters, null, 2), 'utf-8');
}

export async function incrementCounter(key: string, increment: number): Promise<void> {
  const counterPath = path.join(DATA_DIR, 'counters.json');
  const content = await fs.readFile(counterPath, 'utf-8');
  const counters = JSON.parse(content);
  
  const currentValue = counters[key]?.value || 0;
  counters[key] = {
    value: currentValue + increment,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  await fs.writeFile(counterPath, JSON.stringify(counters, null, 2), 'utf-8');
}

// ===== アクティビティ操作 =====

export async function addActivity(activity: Activity): Promise<void> {
  const activityPath = path.join(DATA_DIR, 'activity.json');
  const content = await fs.readFile(activityPath, 'utf-8');
  const data = JSON.parse(content);
  
  data.activities.push(activity);
  
  await fs.writeFile(activityPath, JSON.stringify(data, null, 2), 'utf-8');
}

// ===== マイルストーン操作 =====

export async function addMilestone(milestone: Milestone): Promise<void> {
  const milestonePath = path.join(DATA_DIR, 'milestones.json');
  const content = await fs.readFile(milestonePath, 'utf-8');
  const data = JSON.parse(content);
  
  data.milestones.push(milestone);
  
  await fs.writeFile(milestonePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function updateMilestone(id: string, updates: Partial<Milestone>): Promise<void> {
  const milestonePath = path.join(DATA_DIR, 'milestones.json');
  const content = await fs.readFile(milestonePath, 'utf-8');
  const data = JSON.parse(content);
  
  const index = data.milestones.findIndex((m: Milestone) => m.id === id);
  if (index === -1) {
    throw new Error(`Milestone with id ${id} not found`);
  }
  
  data.milestones[index] = { ...data.milestones[index], ...updates };
  
  await fs.writeFile(milestonePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ===== TODO操作 =====

export async function addTodo(text: string): Promise<void> {
  const todoPath = path.join(DATA_DIR, 'todos.json');
  const content = await fs.readFile(todoPath, 'utf-8');
  const data = JSON.parse(content);
  
  const newTodo: Todo = {
    id: `t${Date.now()}`,
    text,
    done: false,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  data.todos.push(newTodo);
  
  await fs.writeFile(todoPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function toggleTodo(id: string): Promise<void> {
  const todoPath = path.join(DATA_DIR, 'todos.json');
  const content = await fs.readFile(todoPath, 'utf-8');
  const data = JSON.parse(content);
  
  const todo = data.todos.find((t: Todo) => t.id === id);
  if (!todo) {
    throw new Error(`Todo with id ${id} not found`);
  }
  
  todo.done = !todo.done;
  
  await fs.writeFile(todoPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function removeTodo(id: string): Promise<void> {
  const todoPath = path.join(DATA_DIR, 'todos.json');
  const content = await fs.readFile(todoPath, 'utf-8');
  const data = JSON.parse(content);
  
  data.todos = data.todos.filter((t: Todo) => t.id !== id);
  
  await fs.writeFile(todoPath, JSON.stringify(data, null, 2), 'utf-8');
}

// ===== チャートデータ操作 =====

export async function addChartData(filename: string, dataPoint: { date: string; value: number }): Promise<void> {
  const chartPath = path.join(DATA_DIR, 'charts', filename);
  const content = await fs.readFile(chartPath, 'utf-8');
  const chartData = JSON.parse(content);
  
  chartData.data.push(dataPoint);
  
  await fs.writeFile(chartPath, JSON.stringify(chartData, null, 2), 'utf-8');
}
