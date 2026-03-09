import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// POST: 日記追記
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, content } = body;

    if (!date || !content) {
      return NextResponse.json({ error: 'Date and content required' }, { status: 400 });
    }

    // YYYY-MM形式に変換
    const yearMonth = date.substring(0, 7); // 2026-02-23 → 2026-02
    const diaryPath = path.join(DATA_DIR, 'diary', `${yearMonth}.md`);

    // 日記ファイル読み込み
    let existingContent = '';
    try {
      existingContent = await fs.readFile(diaryPath, 'utf-8');
    } catch {
      // ファイルがない場合は新規作成
      existingContent = `# ${yearMonth}\n\n`;
    }

    // 日記エントリ追加
    const newEntry = `\n## ${date}\n${content}\n`;
    const updatedContent = existingContent + newEntry;

    // 保存
    await fs.writeFile(diaryPath, updatedContent, 'utf-8');

    return NextResponse.json({ success: true, path: diaryPath });
  } catch (error) {
    console.error('Diary API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: 日記取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearMonth = searchParams.get('month'); // 2026-02

    if (!yearMonth) {
      return NextResponse.json({ error: 'Month parameter required' }, { status: 400 });
    }

    const diaryPath = path.join(DATA_DIR, 'diary', `${yearMonth}.md`);

    try {
      const content = await fs.readFile(diaryPath, 'utf-8');
      return NextResponse.json({ content });
    } catch {
      return NextResponse.json({ content: `# ${yearMonth}\n\n日記がまだありません。` });
    }
  } catch (error) {
    console.error('Diary API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
