import DashboardGrid from '@/components/DashboardGrid';
import { loadLayout } from '@/lib/data-loader';

export default async function Home() {
  const layout = await loadLayout();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Adaptive Dashboard
        </h1>
        <DashboardGrid
          widgets={layout.widgets}
          columns={layout.grid.columns}
          rowHeight={layout.grid.rowHeight}
          gap={layout.grid.gap}
        />
      </div>
    </main>
  );
}
