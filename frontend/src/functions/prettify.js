const datePrettify = (days, months, years) => {
  let str = "";
  str += days < 10 ? `0${days}` : days;
  str += "-";
  str += months < 10 ? `0${months}` : months;
  str += "-";
  str += years;
  return str;
};
const timePrettify = (hours, minutes) => {
  let str = "";
  str += hours < 10 ? `0${hours}` : hours;
  str += ":";
  str += minutes < 10 ? `0${minutes}` : minutes;
  return str;
};

export { datePrettify, timePrettify };
