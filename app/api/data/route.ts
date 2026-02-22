import { NextRequest, NextResponse } from 'next/server';
import { loadDiary, loadActivities, loadCounters } from '@/lib/data-loader';
import { getCurrentYearMonth } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const path = searchParams.get('path');

  try {
    switch (type) {
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

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
