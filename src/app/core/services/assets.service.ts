import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FontAwesomeLibrary } from '../models/font-awesome-library';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private http: HttpClient) { }

  getFontAwesomeIcons(): Observable<FontAwesomeLibrary> {
    return this.http.get<FontAwesomeLibrary>('assets/icon/font-awesome.json');
  }
}
