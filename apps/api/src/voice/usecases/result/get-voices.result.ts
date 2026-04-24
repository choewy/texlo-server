import { Voice } from '../../domain';

export interface GetVoicesResult {
  total: number;
  rows: Voice[];
}
