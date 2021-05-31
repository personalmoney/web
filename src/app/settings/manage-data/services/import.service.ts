import { Injectable } from '@angular/core';

@Injectable()
export class ImportService {

  constructor() { }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headers: string[]) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');

      if (curruntRecord.length == headers.length) {
        let row = {};

        for (let j = 0; j < headers.length; j++) {
          const header = headers[j];
          row[header] = curruntRecord[j];
        }
        csvArr.push(row);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
}
