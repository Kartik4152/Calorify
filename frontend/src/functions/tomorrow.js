import moment from "moment";

const tomorrow = () => {
  let d = new moment().add(1, "d");
  let year = d.get("year");
  let month = d.get("month");
  let date = d.get("date");
  let dateString = `${year}-${month + 1}-${date}`;
  return dateString;
};

export default tomorrow;
