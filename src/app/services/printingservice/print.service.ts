import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private _httpClinet:HttpClient ) { 
  }

  generateReportWithNoBody(RoutingUrl:string , rptHeaderTitle:string) {
    const url = environment.apiUrl+RoutingUrl;

    // Fetch the report as a blob
    this._httpClinet
      .get(url, { responseType: 'blob' })
      .subscribe(
        (response: Blob) => {
          // Create a URL for the blob
          const fileURL = URL.createObjectURL(response);

          // Open the PDF in a new window/tab
          this.openInNewWindow(fileURL , rptHeaderTitle);
        },
        (error) => {
          console.error('Error generating report:', error);
        }
      );

      
  }

  generateReportWithBody(RoutingUrl:string , value:any, rptHeaderTitle:string) {
    const url = environment.apiUrl+RoutingUrl;

    // Fetch the report as a blob
    this._httpClinet
      .post(url,value, { responseType: 'blob' } )
      .subscribe(
        (response: Blob) => {
          // Create a URL for the blob
          const fileURL = URL.createObjectURL(response);

          // Open the PDF in a new window/tab
          this.openInNewWindow(fileURL,rptHeaderTitle);
        },
        (error) => {
          console.error('Error generating report:', error);
        }
      );

      
  }

 

  openInNewWindow(fileURL: string ,  rptHeaderTitle:string) {
    // Open a new window and set the src to the PDF URL
    const newWindow = window.open('', '_blank', 'width=800,height=800,resizable,scrollbars=yes');
    
    if (newWindow) {
      newWindow.document.title = rptHeaderTitle; // Set the title of the window
      newWindow.document.body.innerHTML =` 
      <embed src="${fileURL}" type="application/pdf" width="100%" height="100%" />`
;
    } else {
      alert('Popup blocker is preventing the new window from opening.');
    }
  }


  // openInNewWindow(fileURL: string) {
  //   // You could try adding the PDF viewer parameters (if the browser supports it)
  //   const urlWithParams = `${fileURL}#view=FitH`; // Fit to width (100% zoom on first page)
  
  //   const newWindow = window.open(urlWithParams, '_blank', 'width=800,height=600,resizable,scrollbars=yes');
  
  //   if (newWindow) {
  //     newWindow.document.title = 'Generated Report'; // Set the title of the window
  //   } else {
  //     alert('Popup blocker is preventing the new window from opening.');
  //   }
  // }
}
