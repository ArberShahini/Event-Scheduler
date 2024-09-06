import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Events } from '../events';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  
  public addEvent(event: Event): Observable<Events> {
    return this.http.post<Events>(`${this.apiServerUrl}/events/add`, event);
  }

  public getAllEvents(): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.apiServerUrl}/events/all`);
  }

  public updateEvent(event: Events): Observable<Events> {
    return this.http.put<Events>(`${this.apiServerUrl}/events/update`, event);
  }

  public deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/events/delete/${id}`);
  }

  public getEventsBetween(startDate: Date, endDate: Date): Observable<Events[]> {
    let startString = 
    `${startDate.getFullYear()}-${(startDate.getMonth()+1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
    let endString = 
    `${endDate.getFullYear()}-${(endDate.getMonth()+1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
    return this.http.get<Events[]>(`${this.apiServerUrl}/events/search/${startString}to${endString}`);
  }
}
