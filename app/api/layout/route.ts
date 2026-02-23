import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { LayoutData } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function POST(request: NextRequest) {
  try {
    const layout: LayoutData = await request.json();
    const layoutPath = path.join(DATA_DIR, 'layout.json');
    
    await fs.writeFile(layoutPath, JSON.stringify(layout, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save layout:', error);
    return NextResponse.json({ error: 'Failed to save layout' }, { status: 500 });
  }
}
