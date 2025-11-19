

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Schedule, DayType, HolidayType } from './types';
import { YEAR, DEFAULT_HOLIDAYS_2026 } from './constants';
import Calendar from './components/Calendar';
import UserSelector from './components/UserSelector';
import SummaryTable from './components/SummaryTable';
import Legend from './components/Legend';
import UserManagement from './components/UserManagement';
import MarkingToolbar from './components/MarkingToolbar';
import OverlapReport from './components/OverlapReport';
import MonthlySummary from './components/MonthlySummary';
import DataManagement from './components/DataManagement';

const LOCAL_STORAGE_KEY = 'vacationPlanner2026Data';

// --- DATOS POR DEFECTO ---
const DEFAULT_USERS = [
  'Ana García',
  'Carlos Rodriguez',
  'Luisa Martinez',
  'David Fernández',
  'Sofía López',
];

const DEFAULT_SCHEDULE: Schedule = {
  'Ana García': {
    '2026-07-13': DayType.Vacation, '2026-07-14': DayType.Vacation, '2026-07-15': DayType.Vacation,
    '2026-07-16': DayType.Vacation, '2026-07-17': DayType.Vacation, '2026-07-20': DayType.Vacation,
    '2026-07-21': DayType.Vacation, '2026-07-22': DayType.Vacation, '2026-07-23': DayType.Vacation,
    '2026-07-24': DayType.Vacation,
  },
  'Carlos Rodriguez': {
    '2026-03-03': DayType.Personal, '2026-03-04': DayType.Personal, '2026-08-04': DayType.Vacation,
    '2026-08-05': DayType.Vacation, '2026-08-06': DayType.Vacation, '2026-08-07': DayType.Vacation,
    '2026-08-10': DayType.Vacation, '2026-08-11': DayType.Vacation, '2026-08-12': DayType.Vacation,
    '2026-08-13': DayType.Vacation, '2026-08-14': DayType.Vacation,
  },
  'Luisa Martinez': {
    '2026-12-22': DayType.Vacation, '2026-12-23': DayType.Vacation, '2026-12-24': DayType.Vacation,
    '2026-12-28': DayType.Vacation, '2026-12-29': DayType.Vacation, '2026-12-30': DayType.Vacation,
    '2026-12-31': DayType.Vacation,
  },
  'David Fernández': {
    '2026-06-01': DayType.Vacation, '2026-06-02': DayType.Vacation, '2026-06-03': DayType.Vacation,
    '2026-06-04': DayType.Vacation, '2026-06-05': DayType.Vacation, '2026-06-08': DayType.Vacation,
    '2026-06-09': DayType.Vacation, '2026-06-10': DayType.Vacation, '2026-06-11': DayType.Vacation,
    '2026-06-12': DayType.Vacation,
  },
  'Sofía López': {
    '2026-10-13': DayType.Personal, '2026-10-14': DayType.Personal,
  }
};
// --- FIN DATOS POR DEFECTO ---

// Definimos un tipo para la estructura de datos que guardamos/cargamos
type AppData = {
  users: string[];
  schedule: Schedule;
  holidays: { [date: string]: HolidayType };
};

const App: React.FC = () => {
  // --- Estado de la aplicación ---
  const [users, setUsers] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [holidays, setHolidays] = useState<{ [date: string]: HolidayType }>(DEFAULT_HOLIDAYS_2026);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  // --- Estado de la UI y Herramientas ---
  const [markingTool, setMarkingTool] = useState<DayType | HolidayType>(DayType.Vacation);
  const [isManagingUsers, setIsManagingUsers] = useState(false);
  const [view, setView] = useState<'calendar' | 'summary'>('calendar');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // --- Carga de datos desde localStorage ---
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const data = JSON.parse(storedData);
        const loadedUsers = data.users || [];
        setUsers(loadedUsers);
        setSchedule(data.schedule || {});
        setHolidays(data.holidays || DEFAULT_HOLIDAYS_2026);
        setCurrentUser(loadedUsers[0] || null);
      } else {
        // Estado inicial para nuevos usuarios con datos de ejemplo
        setUsers(DEFAULT_USERS);
        setSchedule(DEFAULT_SCHEDULE);
        setCurrentUser(DEFAULT_USERS[0]);
      }
    } catch (error) {
      console.error("Error al cargar los datos desde localStorage:", error);
      // Fallback a un estado seguro si los datos están corruptos
      const initialUsers = ['Usuario de Ejemplo'];
      setUsers(initialUsers);
      setCurrentUser(initialUsers[0]);
    }
  }, []);

  // --- Aviso antes de cerrar la página con cambios sin guardar ---
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = ''; // Requerido para la mayoría de los navegadores
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);


  // --- Manejadores de eventos ---
  const handleDayClick = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    if (Object.values(HolidayType).includes(markingTool as HolidayType)) {
      const holidayTool = markingTool as HolidayType;
      
      setHolidays(prevHolidays => {
        const newHolidays = { ...prevHolidays };
        if (newHolidays[dateString] === holidayTool) {
          delete newHolidays[dateString];
        } else {
          newHolidays[dateString] = holidayTool;
        }
        return newHolidays;
      });

      setSchedule(prevSchedule => {
        const newSchedule = JSON.parse(JSON.stringify(prevSchedule));
        for (const user in newSchedule) {
          if (newSchedule[user][dateString]) {
            delete newSchedule[user][dateString];
          }
        }
        return newSchedule;
      });
      setHasUnsavedChanges(true);
      return;
    }

    if (Object.values(DayType).includes(markingTool as DayType)) {
      if (!currentUser) {
        alert('Por favor, seleccione un usuario para marcar días.');
        return;
      }
      if (holidays[dateString]) return;
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
      if (isWeekend) return;

      const dayTool = markingTool as DayType;
      setSchedule(prevSchedule => {
        const newSchedule = JSON.parse(JSON.stringify(prevSchedule));
        const userSchedule = newSchedule[currentUser] || {};
        
        if (userSchedule[dateString] === dayTool) {
          delete userSchedule[dateString];
        } else {
          userSchedule[dateString] = dayTool;
        }

        newSchedule[currentUser] = userSchedule;
        return newSchedule;
      });
      setHasUnsavedChanges(true);
    }
  }, [currentUser, markingTool, holidays]);
  
  const handleAddUser = (name: string) => {
    if (name && !users.includes(name)) {
      const newUsers = [...users, name];
      setUsers(newUsers);
      if (!currentUser) {
        setCurrentUser(name);
      }
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveUser = (nameToRemove: string) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      delete newSchedule[nameToRemove];
      return newSchedule;
    });

    const newUsers = users.filter(user => user !== nameToRemove);
    setUsers(newUsers);

    if (currentUser === nameToRemove) {
      setCurrentUser(newUsers.length > 0 ? newUsers[0] : null);
    }
    setHasUnsavedChanges(true);
  };

  const handleSaveProgress = () => {
    try {
      const stateToSave = { users, schedule, holidays };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error al guardar los datos en localStorage:", error);
      alert("No se pudo guardar el progreso. Revisa la consola para más detalles.");
    }
  };

  const handleSaveData = (): AppData => {
    // Antes de exportar, se recomienda guardar el progreso para consistencia.
    if(hasUnsavedChanges) {
        handleSaveProgress();
    }
    return { users, schedule, holidays };
  };

  const handleLoadData = (data: AppData) => {
    if (window.confirm('Esto reemplazará todos los datos actuales (incluyendo el progreso no guardado). ¿Estás seguro?')) {
      const loadedUsers = data.users || [];
      const loadedSchedule = data.schedule || {};
      const loadedHolidays = data.holidays || DEFAULT_HOLIDAYS_2026;

      setUsers(loadedUsers);
      setSchedule(loadedSchedule);
      setHolidays(loadedHolidays);
      setCurrentUser(loadedUsers[0] || null);
      
      // Guardamos inmediatamente en localStorage para que persista al recargar la página
      try {
        const stateToSave = { users: loadedUsers, schedule: loadedSchedule, holidays: loadedHolidays };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error("Error al guardar los datos cargados en localStorage:", error);
      }

      setHasUnsavedChanges(false);
      alert('Datos cargados y guardados correctamente.');
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 font-sans bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Planificador de Vacaciones {YEAR}</h1>
          <p className="text-lg text-gray-600 mt-2">Gestiona los días libres de tu equipo de forma sencilla e intuitiva.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex border-b border-gray-200 mb-4">
              <button 
                onClick={() => setView('calendar')}
                className={`-mb-px px-4 py-2 text-sm font-medium transition-colors duration-200 ${view === 'calendar' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
                aria-current={view === 'calendar'}
              >
                Vista Calendario
              </button>
              <button 
                onClick={() => setView('summary')}
                className={`-mb-px px-4 py-2 text-sm font-medium transition-colors duration-200 ${view === 'summary' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
                aria-current={view === 'summary'}
              >
                Resumen Mensual
              </button>
            </div>

            {view === 'calendar' ? (
              <>
                <MarkingToolbar
                  currentTool={markingTool}
                  onToolChange={setMarkingTool}
                />
                <Calendar
                  year={YEAR}
                  schedule={schedule}
                  holidays={holidays}
                  currentUser={currentUser}
                  onDayClick={handleDayClick}
                  markingTool={markingTool}
                />
              </>
            ) : (
              <MonthlySummary users={users} schedule={schedule} holidays={holidays} />
            )}
          </div>

          <aside className="lg:col-span-1 flex flex-col gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <UserSelector
                users={users}
                currentUser={currentUser}
                onUserChange={setCurrentUser}
              />
              <button 
                onClick={() => setIsManagingUsers(true)}
                className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
               >
                Gestionar Empleados
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <DataManagement 
                onSave={handleSaveData} 
                onLoad={handleLoadData}
                onSaveProgress={handleSaveProgress}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
               <SummaryTable users={users} schedule={schedule} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <OverlapReport schedule={schedule} />
            </div>
             <div className="bg-white p-6 rounded-xl shadow-lg">
               <Legend />
            </div>
          </aside>
        </main>
      </div>
       <UserManagement
        isOpen={isManagingUsers}
        onClose={() => setIsManagingUsers(false)}
        users={users}
        onAddUser={handleAddUser}
        onRemoveUser={handleRemoveUser}
      />
    </div>
  );
};

export default App;
