import { carBrand, carModel } from './carBrand';
import { createCar } from '../api/api';
// import carBrand from './carBrand';

export const calculateVelocity = (distance: number): number => {
  if (distance < 400) return 4;
  if (distance < 600) return 2.5;
  if (distance < 900) return 1.5;
  if (distance > 900) return 1;
  return 0;
};

export function getRandomColor() {
  const color = `${Math.random().toString(16)}000000`.slice(2, 8);
  return `#${color}`;
}

function getRandomName(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const randomCarGenerator = async () => {
  const promises = [];
  let i: number = 0;
  while (i < 100) {
    const carName: string = `${getRandomName(carBrand)} ${getRandomName(carModel)}`;
    promises.push(createCar({ name: carName, color: getRandomColor() }));
    i += 1;
  }
  await Promise.all(promises);
};
