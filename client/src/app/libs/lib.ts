import { carBrand, carModel } from './carBrand';
import { createCar } from '../api/api';

export const calculateVelocity = (distance: number): number => {
  if (distance < 325) return 150;
  if (distance < 600) return 120;
  if (distance < 900) return 50;
  if (distance > 900) return 20;
  return 0;
};

export type Distance = number; // notUsed

export function getRandomColor() {
  const color = `${Math.random().toString(16)}000000`.slice(2, 8);
  return `#${color}`;
}

export const randomCarGenerator = async () => {
  const promises = [];
  let i: number = 0;
  while (i < 10) {
    const carName: string = `${carBrand[Math.floor(Math.random() * carBrand.length)]} ${carModel[Math.floor(Math.random() * carModel.length)]}`;
    promises.push(createCar({ name: carName, color: getRandomColor() }));
    i += 1;
  }
  await Promise.all(promises);
};
