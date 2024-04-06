import { TimePicker12Demo } from "./time-picker-12hour-demo";

export function TimePicker12HourWrapper({date,setDate}:any) {


  return <TimePicker12Demo setDate={setDate} date={date} />;
}
