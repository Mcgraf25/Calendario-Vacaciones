
import React, { useMemo } from 'react';
import { Schedule, DayType } from '../types';
import { DAY_TYPE_STYLES } from '../constants';

interface SummaryTableProps {
  users: string[];
  schedule: Schedule;
}

const InfoIcon: React.FC = () => (
  <div className="relative inline-block ml-2 group">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div className="absolute bottom-full left-1/2 z-10 w-64 px-3 py-2 mb-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transform -translate-x-1/2">
      Las vacaciones hasta el 31/01/2026 y los asuntos propios hasta el 15/02/2026 no se contabilizan en este resumen de 2026.
      <div className="tooltip-arrow" data-popper-arrow></div>
    </div>
  </div>
);

const SummaryTable: React.FC<SummaryTableProps> = ({ users, schedule }) => {

  const totals = useMemo(() => {
    return users.map(user => {
      const userSchedule = schedule[user] || {};
      const vacationDays = Object.entries(userSchedule).filter(
        ([date, type]) => type === DayType.Vacation && date > '2026-01-31'
      ).length;
      const personalDays = Object.entries(userSchedule).filter(
        ([date, type]) => type === DayType.Personal && date > '2026-02-15'
      ).length;
      return {
        user,
        vacationDays,
        personalDays,
        total: vacationDays + personalDays,
      };
    });
  }, [users, schedule]);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span>Resumen Días Libres 2026</span>
        <InfoIcon />
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title={DAY_TYPE_STYLES.VACATION.label}>V</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title={DAY_TYPE_STYLES.PERSONAL.label}>AP</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {totals.map(({ user, vacationDays, personalDays, total }) => (
              <tr key={user}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{vacationDays}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{personalDays}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-700 text-center">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;
