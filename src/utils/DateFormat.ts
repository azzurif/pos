export const DateFormat = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hourCycle: 'h23',
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}
