export const calculateVelocity = (distance: number): number => {
  if (distance < 325) return 150;
  if (distance < 600) return 120;
  if (distance < 900) return 50;
  if (distance > 900) return 20;
  return 0;
};

export type Distance = number; // notUsed
