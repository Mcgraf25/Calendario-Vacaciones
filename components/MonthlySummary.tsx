
import React, { useState } from 'react';
import { Schedule, DayType, HolidayType } from '../types';
import { MONTH_NAMES, DAY_TYPE_STYLES, DAY_NAMES } from '../constants';

interface MonthlySummaryProps {
  users: string[];
  schedule: Schedule;
  holidays: { [date: string]: HolidayType };
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ users, schedule, holidays }) => {
  // 0: Diciembre 2025, 1-12: Enero-Diciembre 2026
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 12 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 12 ? 0 : prev + 1));
  };

  const year = currentMonthIndex === 0 ? 2025 : 2026;
  const month = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1; // month is 0-indexed

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayInfo = (user: string, day: number) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateString = date.toISOString().split('T')[0];
    
    const dayOfWeek = date.getUTCDay(); // 0 = Sun, 6 = Sat
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;

    const holidayType = holidays[dateString];
    if (holidayType) {
      return { style: DAY_TYPE_STYLES[holidayType], label: '' };
    }
    
    const userDayType = schedule[user]?.[dateString];
    if (userDayType) {
        let label = '';
        if (userDayType === DayType.Vacation) label = 'V';
        if (userDayType === DayType.Personal) label = 'AP';
        return { style: DAY_TYPE_STYLES[userDayType], label };
    }

    if (isWeekend) {
        return { style: DAY_TYPE_STYLES.WEEKEND, label: '' };
    }

    return { style: DAY_TYPE_STYLES.DEFAULT, label: '' };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrevMonth} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">&lt; Anterior</button>
        <h2 className="text-2xl font-bold text-gray-800 text-center">{MONTH_NAMES[month]} {year}</h2>
        <button onClick={handleNextMonth} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Siguiente &gt;</button>
      </div>
      <div className="w-full">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-100 z-10 px-2 py-2 text-left font-semibold text-gray-600 border-b border-r border-gray-300 w-32">Empleado</th>
              {monthDays.map(day => {
                const date = new Date(Date.UTC(year, month, day));
                const dayOfWeek = date.getUTCDay(); // 0 = Sun, 6 = Sat
                const dayName = DAY_NAMES[dayOfWeek === 0 ? 6 : dayOfWeek - 1].charAt(0);
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                return (
                  <th key={day} className={`text-center font-normal border-b border-gray-300 ${isWeekend ? 'bg-gray-400 text-white' : 'bg-gray-50'}`}>
                    <div className="text-xs text-gray-500">{dayName}</div>
                    <div className={`mt-1 text-sm ${isWeekend ? 'text-white' : 'text-gray-800'}`}>{day}</div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="sticky left-0 bg-white hover:bg-gray-50 z-10 px-2 py-1 whitespace-nowrap font-medium text-gray-800 border-r border-gray-300">{user}</td>
                {monthDays.map(day => {
                  const { style, label } = getDayInfo(user, day);
                  return (
                    <td key={`${user}-${day}`} className={`border-l border-gray-200 ${style.bg} ${style.text}`} title={style.label}>
                      <div className="w-full h-8 flex items-center justify-center">
                        <span className="font-bold text-xs">{label}</span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlySummary;
