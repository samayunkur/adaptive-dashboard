'use client';

import { useEffect, useState } from 'react';
import DashboardGrid from '@/components/DashboardGrid';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EditModeToggle } from '@/components/EditModeToggle';
import { LayoutData } from '@/lib/types';

export default function Home() {
  const [layout, setLayout] = useState<LayoutData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLayout = async () => {
      const response = await fetch('/api/data?type=layout');
      const data = await response.json();
      setLayout(data);
    };

    fetchLayout();
  }, []);

  const handleSave = async () => {
    if (!layout) return;

    setSaving(true);
    try {
      const response = await fetch('/api/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layout),
      });

      if (response.ok) {
        alert('レイアウトを保存しました');
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (!layout) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <ThemeToggle />
      <EditModeToggle onToggle={setEditMode} onSave={handleSave} />
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
          Adaptive Dashboard
        </h1>
        <DashboardGrid
          widgets={layout.widgets}
          columns={layout.grid.columns}
          rowHeight={layout.grid.rowHeight}
          gap={layout.grid.gap}
          editMode={editMode}
          onLayoutChange={(newWidgets) => {
            setLayout({ ...layout, widgets: newWidgets });
          }}
        />
      </div>
    </main>
  );
}
