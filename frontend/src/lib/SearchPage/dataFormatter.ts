export const formatDate = (dateString : string) => {
  const [month, day, year] = dateString.split("-");
  const date = new Date(`${month}-${day}-${year}`);
  return new Intl.DateTimeFormat('en-CA').format(date); // 'en-CA' gives 'YYYY-MM-DD' format
};