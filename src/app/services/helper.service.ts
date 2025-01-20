import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
currency:string='EGP';
  constructor() { }
  convertCSharpDateFormatToJsFormat(date: any) {
    if(date != null)
    {
    const timeString = date.substring(11, 19);

    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);


    return new Date(1970, 0, 1, hours, minutes, seconds);
    }
    return null;

  }

  convert(timeString:string)
  {
          
    if(timeString != '')
    {
      const [hours, minutes, seconds] = timeString.split(':').map(num => parseInt(num, 10));

      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(seconds);
      date.setMilliseconds(0);  

      return date;
    }
    else return null;
  }
  tocSharp(appointmentDate:any)
  {
    const hours = appointmentDate.getHours().toString().padStart(2, '0');
    const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
    const seconds = appointmentDate.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    return timeString;
  }
}
