import React from 'react';
import { DAY_TYPE_STYLES } from '../constants';
import { DayType, HolidayType } from '../types';

const Legend: React.FC = () => {
  const legendItems = [
    { label: DAY_TYPE_STYLES[DayType.Vacation].label, color: DAY_TYPE_STYLES[DayType.Vacation].bg },
    { label: DAY_TYPE_STYLES[DayType.Personal].label, color: DAY_TYPE_STYLES[DayType.Personal].bg },
    { label: DAY_TYPE_STYLES[HolidayType.National].label, color: DAY_TYPE_STYLES[HolidayType.National].bg },
    { label: DAY_TYPE_STYLES[HolidayType.Regional].label, color: DAY_TYPE_STYLES[HolidayType.Regional].bg },
    { label: DAY_TYPE_STYLES[HolidayType.Local].label, color: DAY_TYPE_STYLES[HolidayType.Local].bg },
    { label: DAY_TYPE_STYLES[HolidayType.Convenio].label, color: DAY_TYPE_STYLES[HolidayType.Convenio].bg },
    { label: DAY_TYPE_STYLES.WEEKEND.label, color: DAY_TYPE_STYLES.WEEKEND.bg },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Leyenda</h3>
      <div className="space-y-2">
        {legendItems.map(({ label, color }) => (
          <div key={label} className="flex items-center">
            <span className={`w-4 h-4 rounded-md mr-3 ${color} border border-gray-300`}></span>
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
