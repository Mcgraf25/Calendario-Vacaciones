import React from 'react';
import { DayType, HolidayType } from '../types';
import { DAY_TYPE_STYLES } from '../constants';

interface MarkingToolbarProps {
  currentTool: DayType | HolidayType;
  onToolChange: (tool: DayType | HolidayType) => void;
}

const MarkingToolbar: React.FC<MarkingToolbarProps> = ({ currentTool, onToolChange }) => {
  const tools: (DayType | HolidayType)[] = [
    DayType.Vacation,
    DayType.Personal,
    HolidayType.National,
    HolidayType.Regional,
    HolidayType.Local,
    HolidayType.Convenio,
  ];

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="text-md font-semibold text-gray-700 mb-3">Herramienta de Marcado:</h3>
      <div className="flex flex-wrap gap-2">
        {tools.map(tool => {
          const style = DAY_TYPE_STYLES[tool];
          const isActive = currentTool === tool;
          const activeClasses = 'ring-2 ring-offset-1 ring-indigo-500';
          const buttonClasses = `px-3 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none transition-all ${style.bg} ${style.text} ${isActive ? activeClasses : ''} hover:opacity-90`;

          return (
            <button
              key={tool}
              onClick={() => onToolChange(tool)}
              className={buttonClasses}
            >
              {style.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MarkingToolbar;
