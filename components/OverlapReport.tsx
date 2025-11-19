import React, { useMemo } from 'react';
import { Schedule, DayType } from '../types';

interface OverlapReportProps {
  schedule: Schedule;
}

const OverlapReport: React.FC<OverlapReportProps> = ({ schedule }) => {
  const coincidences = useMemo(() => {
    const dateOverlaps: { [date: string]: string[] } = {};

    for (const user in schedule) {
      for (const date in schedule[user]) {
        if (schedule[user][date] === DayType.Vacation) {
          if (!dateOverlaps[date]) {
            dateOverlaps[date] = [];
          }
          dateOverlaps[date].push(user);
        }
      }
    }

    return Object.entries(dateOverlaps)
      .filter(([, users]) => users.length > 1)
      .map(([date, users]) => ({ date, users }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [schedule]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    // Create a UTC date to avoid timezone shifts during formatting
    const date = new Date(Date.UTC(year, month - 1, day));
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Coincidencias de Vacaciones</h3>
      {coincidences.length > 0 ? (
        <div className="overflow-x-auto max-h-60">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleados</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coincidences.map(({ date, users }) => (
                <tr key={date}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatDate(date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{users.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">No hay coincidencias en los días de vacaciones.</p>
      )}
    </div>
  );
};

export default OverlapReport;