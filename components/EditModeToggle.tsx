'use client';

import { useState } from 'react';

interface EditModeToggleProps {
  onToggle: (editMode: boolean) => void;
  onSave: () => void;
}

export function EditModeToggle({ onToggle, onSave }: EditModeToggleProps) {
  const [editMode, setEditMode] = useState(false);

  const handleToggle = () => {
    const newMode = !editMode;
    setEditMode(newMode);
    onToggle(newMode);
  };

  return (
    <div className="fixed top-4 right-20 z-50 flex gap-2">
      {editMode && (
        <button
          onClick={onSave}
          className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          保存
        </button>
      )}
      <button
        onClick={handleToggle}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          editMode
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        {editMode ? '編集中' : '編集モード'}
      </button>
    </div>
  );
}
