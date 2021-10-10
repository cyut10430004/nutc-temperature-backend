import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(
    private http: HttpClient
  ) { }

  getRecordList() {
    const url = environment.apiUrl + '/record/list';
    return this.http.get<IRecordInfo[]>(url);
    // const recordInfo: IRecordInfo = {
    //   id:1,
    //   userId: 1,
    //   userName: '王大明',
    //   userAccount: '1710932013',
    //   deviceId: 1,
    //   deviceName: '體溫裝置01',
    //   temperature: '36.5',
    //   createdTime: '2021-10-01 08:00:00',
    // };
    // const res = [1,1,1,1,1,1].map(() => recordInfo);
    // return of(res);
  }

  getRecordInfo(id: number) {
    const recordInfo: IRecordInfo = {
      id:1,
      userId: 1,
      userName: '王大明',
      userAccount: '1710932013',
      deviceId: 1,
      deviceName: '體溫裝置01',
      temperature: '36.5',
      createdTime: '2021-10-01 08:00:00',
    };
    return of(recordInfo);
  }
  
}

export interface IRecordInfo {
  id: number;
  userId: number;
  userName: string;
  userAccount: string;
  deviceId: number;
  deviceName: string;
  temperature: string;
  createdTime: string;
}