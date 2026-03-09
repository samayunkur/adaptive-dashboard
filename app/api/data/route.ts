import { NextRequest, NextResponse } from 'next/server';
import { ensureInitialized, getCountersDB, getActivityDB, getMilestonesDB, getTodosDB, getLayoutDB } from '@/lib/db';
import { Activity, Milestone, Todo, Counter } from '@/lib/types';

// 初期化
ensureInitialized();

// POST: データ更新
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, action, data } = body;

    switch (type) {
      case 'counter':
        return handleCounter(action, data);
      case 'activity':
        return handleActivity(action, data);
      case 'milestone':
        return handleMilestone(action, data);
      case 'todo':
        return handleTodo(action, data);
      case 'layout':
        return handleLayout(action, data);
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// カウンター操作
async function handleCounter(action: string, data: any) {
  const db = getCountersDB();

  switch (action) {
    case 'update':
      db.data[data.key] = {
        value: data.value,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      await db.write();
      return NextResponse.json({ success: true });

    case 'increment':
      if (!db.data[data.key]) {
        db.data[data.key] = { value: 0, updatedAt: new Date().toISOString().split('T')[0] };
      }
      db.data[data.key].value += data.increment || 1;
      db.data[data.key].updatedAt = new Date().toISOString().split('T')[0];
      await db.write();
      return NextResponse.json({ success: true, value: db.data[data.key].value });

    case 'get':
      return NextResponse.json(db.data);

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

// アクティビティ操作
async function handleActivity(action: string, data: Activity) {
  const db = getActivityDB();

  switch (action) {
    case 'add':
      db.data.activities.push({
        ...data,
        date: data.date || new Date().toISOString().split('T')[0],
      });
      await db.write();
      return NextResponse.json({ success: true });

    case 'get':
      const filtered = data.type
        ? db.data.activities.filter((a) => a.type === data.type)
        : db.data.activities;
      return NextResponse.json(filtered);

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

// マイルストーン操作
async function handleMilestone(action: string, data: Milestone | any) {
  const db = getMilestonesDB();

  switch (action) {
    case 'add':
      const newMilestone: Milestone = {
        id: `m${Date.now()}`,
        title: data.title,
        description: data.description,
        status: 'not-started',
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0],
        ...data,
      };
      db.data.milestones.push(newMilestone);
      await db.write();
      return NextResponse.json({ success: true, milestone: newMilestone });

    case 'update':
      const idx = db.data.milestones.findIndex((m) => m.id === data.id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
      }
      db.data.milestones[idx] = { ...db.data.milestones[idx], ...data };
      await db.write();
      return NextResponse.json({ success: true });

    case 'delete':
      db.data.milestones = db.data.milestones.filter((m) => m.id !== data.id);
      await db.write();
      return NextResponse.json({ success: true });

    case 'get':
      return NextResponse.json(db.data.milestones);

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

// TODO操作
async function handleTodo(action: string, data: Todo | any) {
  const db = getTodosDB();

  switch (action) {
    case 'add':
      const newTodo: Todo = {
        id: `t${Date.now()}`,
        text: data.text,
        done: false,
        createdAt: new Date().toISOString().split('T')[0],
      };
      db.data.todos.push(newTodo);
      await db.write();
      return NextResponse.json({ success: true, todo: newTodo });

    case 'toggle':
      const todo = db.data.todos.find((t) => t.id === data.id);
      if (!todo) {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
      }
      todo.done = !todo.done;
      await db.write();
      return NextResponse.json({ success: true, todo });

    case 'delete':
      db.data.todos = db.data.todos.filter((t) => t.id !== data.id);
      await db.write();
      return NextResponse.json({ success: true });

    case 'get':
      return NextResponse.json(db.data.todos);

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

// レイアウト操作
async function handleLayout(action: string, data: any) {
  const db = getLayoutDB();

  switch (action) {
    case 'update':
      db.data = { ...db.data, ...data };
      await db.write();
      return NextResponse.json({ success: true });

    case 'addWidget':
      db.data.widgets.push(data);
      await db.write();
      return NextResponse.json({ success: true });

    case 'removeWidget':
      db.data.widgets = db.data.widgets.filter((w) => w.id !== data.id);
      await db.write();
      return NextResponse.json({ success: true });

    case 'get':
      return NextResponse.json(db.data);

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

// GET: 全データ取得
export async function GET() {
  await ensureInitialized();
  
  return NextResponse.json({
    counters: getCountersDB().data,
    activities: getActivityDB().data.activities,
    milestones: getMilestonesDB().data.milestones,
    todos: getTodosDB().data.todos,
    layout: getLayoutDB().data,
  });
}
