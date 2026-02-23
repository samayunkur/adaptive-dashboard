import { NextRequest, NextResponse } from 'next/server';
import { loadDiary, loadActivities, loadCounters, loadMilestones, loadTodos, loadChart, loadMarkdown, loadLayout } from '@/lib/data-loader';
import { getCurrentYearMonth } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const path = searchParams.get('path');

  try {
    switch (type) {
      case 'layout': {
        const layout = await loadLayout();
        return NextResponse.json(layout);
      }

      case 'diary': {
        // pathから年月を抽出、なければ現在の年月
        let yearMonth = getCurrentYearMonth();
        if (path) {
          const match = path.match(/(\d{4}-\d{2})/);
          if (match) {
            yearMonth = match[1];
          }
        }
        const content = await loadDiary(yearMonth);
        return NextResponse.json({ content });
      }

      case 'activity': {
        const activities = await loadActivities();
        return NextResponse.json({ activities });
      }

      case 'counter': {
        const key = searchParams.get('key');
        if (!key) {
          return NextResponse.json({ error: 'Counter key required' }, { status: 400 });
        }
        const counters = await loadCounters();
        const counter = counters[key];
        return NextResponse.json({ value: counter?.value || 0 });
      }

      case 'milestones': {
        const milestones = await loadMilestones();
        return NextResponse.json({ milestones });
      }

      case 'todos': {
        const todos = await loadTodos();
        return NextResponse.json({ todos });
      }

      case 'chart': {
        if (!path) {
          return NextResponse.json({ error: 'Chart path required' }, { status: 400 });
        }
        const filename = path.split('/').pop() || '';
        const chartData = await loadChart(filename);
        if (!chartData) {
          return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
        }
        return NextResponse.json(chartData);
      }

      case 'markdown': {
        if (!path) {
          return NextResponse.json({ error: 'Markdown path required' }, { status: 400 });
        }
        const content = await loadMarkdown(path);
        return NextResponse.json({ content });
      }

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
