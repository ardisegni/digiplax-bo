import { PlaqueModel } from './Plaque.model';
export interface ScheduledPlaqueModel {
  id?: number;
  dateFrom: Date | null;
  formattedDateFrom?: string;
  timeFrom: string;
  dateTo: Date | null;
  formattedDateTo?: string;
  timeTo: string;
  plaque?: PlaqueModel;
  priority?: number;
}
