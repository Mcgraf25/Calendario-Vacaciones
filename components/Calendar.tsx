
import React from 'react';
import { Schedule, HolidayType, DayType } from '../types';
import { MONTH_NAMES, DAY_NAMES, DAY_TYPE_STYLES } from '../constants';

interface CalendarProps {
  year: number;
  schedule: Schedule;
  holidays: { [date: string]: HolidayType };
  currentUser: string | null;
  onDayClick: (date: Date) => void;
  markingTool: DayType | HolidayType;
}

const Calendar: React.FC<CalendarProps> = ({ year, schedule, holidays, currentUser, onDayClick, markingTool }) => {
  const getMonths = () => {
    // Diciembre 2025 (últimas 2 semanas)
    const december2025 = (() => {
      const year2025 = 2025;
      const month = 11; // Diciembre
      // Del 15 al 31
      const days = Array.from({ length: 17 }, (_, dayIndex) => {
        const day = dayIndex + 15;
        const date = new Date(year2025, month, day);
        return { day, date };
      });
      
      const firstDay = new Date(year2025, month, 15).getDay(); // Lunes es 1
      const startOffset = (firstDay === 0) ? 6 : firstDay - 1;
      const blanks = Array.from({ length: startOffset }, () => null);
      
      return { monthName: "Diciembre 2025", days: [...blanks, ...days] };
    })();

    // Meses de 2026
    const months2026 = Array.from({ length: 12 }, (_, i) => {
      const month = i;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

      const days = Array.from({ length: daysInMonth }, (_, dayIndex) => {
        const day = dayIndex + 1;
        const date = new Date(year, month, day);
        return { day, date };
      });

      const blanks = Array.from({ length: startOffset }, () => null);
      return { monthName: `${MONTH_NAMES[month]} ${year}`, days: [...blanks, ...days] };
    });

    return [december2025, ...months2026];
  };

  const months = getMonths();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
      {months.map(({ monthName, days }) => (
        <div key={monthName} className="p-3 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-center mb-3 text-gray-700">{monthName}</h3>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-1">
            {DAY_NAMES.map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((dayInfo, index) => {
              if (!dayInfo) return <div key={`blank-${monthName}-${index}`} />;

              const { day, date } = dayInfo;
              
              const y = date.getFullYear();
              const m = String(date.getMonth() + 1).padStart(2, '0');
              const d = String(date.getDate()).padStart(2, '0');
              const dateString = `${y}-${m}-${d}`;

              const dayOfWeek = date.getDay();
              const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
              
              const holidayType = holidays[dateString];
              const userDayType = currentUser ? schedule[currentUser]?.[dateString] : null;

              let styleKey: string = 'DEFAULT';
              if (holidayType) {
                styleKey = holidayType;
              } else if (userDayType) {
                styleKey = userDayType;
              } else if (isWeekend) {
                styleKey = 'WEEKEND';
              }
              
              const style = DAY_TYPE_STYLES[styleKey];
              
              const isHolidayTool = Object.values(HolidayType).includes(markingTool as HolidayType);
              let isClickable = false;
              if (isHolidayTool) {
                isClickable = true;
              } else {
                isClickable = !holidayType && !isWeekend;
              }

              return (
                <div
                  key={dateString}
                  className={`relative w-full aspect-square flex items-center justify-center rounded-md transition-colors duration-200 ease-in-out ${style.bg} ${style.text} ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}`}
                  onClick={() => isClickable && onDayClick(date)}
                >
                  <span className="font-normal text-xs">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Calendar;
