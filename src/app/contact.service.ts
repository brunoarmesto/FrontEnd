import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ContactService {

  complementRoute: string = "api/v1/contact";

  constructor(private http: HttpClient) { }
  GetAll(): Observable<any> {
    return this.http.get<any>(`${environment.endPoint + this.complementRoute}`);
  }

  GetById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.endPoint+ this.complementRoute}/${id}`);
  }
  Save(id: number, json: any): Observable<any> {

    if (id)
      return this.http.put<any>(`${environment.endPoint+ this.complementRoute}/${id}`, json);
 

    return this.http.post<any>(environment.endPoint + this.complementRoute, json);
  }

  Delete(id: number, json: any): Observable<any> {
        return this.http.delete<any>(`${environment.endPoint+ this.complementRoute}/${id}`);
  }
}
