export enum DayType {
  Vacation = 'VACATION',
  Personal = 'PERSONAL',
}

export enum HolidayType {
  National = 'NATIONAL_HOLIDAY',
  Regional = 'REGIONAL_HOLIDAY',
  Local = 'LOCAL_HOLIDAY',
  Convenio = 'CONVENIO_HOLIDAY',
}

export type Holiday = {
  name: string;
  type: HolidayType;
};

export type UserSchedule = {
  [date: string]: DayType.Vacation | DayType.Personal;
};

export type Schedule = {
  [userName: string]: UserSchedule;
};
