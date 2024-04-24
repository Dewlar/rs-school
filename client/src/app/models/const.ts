export const USER_STORAGE_DATA_KEY: string = 'userData-dewlar';
export default USER_STORAGE_DATA_KEY;

function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}

export function getFormatedDate(timestamp: number) {
  const date = new Date(timestamp);
  return `${padZero(date.getDate())}.${padZero(date.getMonth() + 1)}.${date.getFullYear()}, ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
}
