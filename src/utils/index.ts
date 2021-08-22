// 格式化日期
export const formatDate = (data: string | number) => {
  const date = new Date(data);
  const year = date.getFullYear();
  const m = `0${date.getMonth() + 1}`.slice(-2);
  const d = `0${date.getDate()}`.slice(-2);
  const h = `0${date.getHours()}`.slice(-2);
  const mi = `0${date.getMinutes()}`.slice(-2);
  const s = `0${date.getSeconds()}`.slice(-2);
  return `${year}-${m}-${d} ${h}:${mi}:${s}`;
}
