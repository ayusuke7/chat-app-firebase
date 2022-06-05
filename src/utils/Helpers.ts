export const formatDateTime = (
  dateTime: string | undefined,
  time?: boolean
) => {
  if (!dateTime) return;

  let date = dateTime.substring(5, 10).split("-").reverse().join("/");

  if (time) {
    date += " às " + dateTime.substring(11, 19);
  }

  return date;
};
