import { DayType, HolidayType, Holiday } from './types';

export const YEAR = 2026;

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const DEFAULT_HOLIDAYS_2026: { [date: string]: HolidayType } = {
  '2026-01-01': HolidayType.National, // Año Nuevo
  '2026-01-06': HolidayType.National, // Epifanía del Señor
  '2026-04-17': HolidayType.National, // Viernes Santo
  '2026-05-01': HolidayType.National, // Fiesta del Trabajo
  '2026-08-15': HolidayType.National, // Asunción de la Virgen
  '2026-11-01': HolidayType.National, // Todos los Santos (Sábado)
  '2026-12-06': HolidayType.National, // Día de la Constitución (Sábado)
  '2026-12-08': HolidayType.National, // Inmaculada Concepción
  '2026-12-25': HolidayType.National, // Natividad del Señor
};

export const HOLIDAYS_2026: { [date: string]: Holiday } = {};

export const DAY_TYPE_STYLES: { [key: string]: { bg: string; text: string; label: string, border?: string } } = {
  [DayType.Vacation]: { bg: 'bg-yellow-400', text: 'text-gray-800', label: 'Vacaciones' },
  [DayType.Personal]: { bg: 'bg-purple-500', text: 'text-white', label: 'Asuntos Propios' },
  [HolidayType.National]: { bg: 'bg-red-500', text: 'text-white', label: 'Festivo Nacional' },
  [HolidayType.Regional]: { bg: 'bg-green-600', text: 'text-white', label: 'Festivo Autonómico' },
  [HolidayType.Local]: { bg: 'bg-blue-500', text: 'text-white', label: "Festivo Local" },
  [HolidayType.Convenio]: { bg: 'bg-orange-500', text: 'text-white', label: 'Festivo por Convenio' },
  WEEKEND: { bg: 'bg-gray-400', text: 'text-white', label: 'Fin de Semana' },
  DEFAULT: { bg: 'bg-white', text: 'text-gray-800', label: 'Día laborable'},
};