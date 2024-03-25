export const SERVER_URL = 'http://localhost:3100';

export interface ICar {
  id: number;
  name: string;
  color: string;
}

export interface GarageData {
  items: ICar[];
  count: string | null;
}
