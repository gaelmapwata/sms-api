import { format } from 'date-fns';

export const getTodayDate = () => format(new Date(), 'yyyy-MM-dd');

export const getYesterdayDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);

  return format(today, 'yyyy-MM-dd');
};

export const firstDayOfWeekDate = () => {
  const today = new Date();
  const firstDay = today.setDate(today.getDate() - today.getDay());
  return format(firstDay, 'yyyy-MM-dd');
};

export const lastDayOfWeekDate = () => {
  const today = new Date();
  const lastDay = today.setDate(today.getDate() - today.getDay() + 6);
  return format(lastDay, 'yyyy-MM-dd');
};

const excelDateToJSDate = (excelDate: number): Date => {
  // La date de base pour Excel est le 1er janvier 1900
  const excelBaseDate = new Date(1900, 0, 1);
  return new Date(excelBaseDate.getTime() + (excelDate - 2) * 24 * 60 * 60 * 1000);
};

export const formatExcelDate = (excelDateString: string): string => {
  const excelDate = Number(excelDateString);
  const jsDate = excelDateToJSDate(excelDate);
  return format(jsDate, 'yyyy-MM-dd');
};
