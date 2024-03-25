import { ICar, GarageData, SERVER_URL } from './interface';

const garage = `${SERVER_URL}/garage`;
// const engine = `${SERVER_URL}/engine`;

export const getCar = async (id: number): Promise<ICar> => (await fetch(`${garage}/${id}`)).json();

export const getCars = async (page: number, limit = 7): Promise<GarageData> => {
  const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
  const items: ICar[] = await response.json();

  return {
    items: await Promise.all(items),
    count: response.headers.get('X-Total-Count'),
  };
};
