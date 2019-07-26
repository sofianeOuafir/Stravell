import moment from "moment";

export const getDateFormat = (date) => {
  if(!date){
    return;
  }
  return moment(date).format("MMMM Do, YYYY");
}

export const getDateTimeFormat = (date) => {
  if(!date){
    return;
  }
  return moment(date).format('lll');;
}