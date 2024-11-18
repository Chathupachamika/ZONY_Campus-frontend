import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BotService {

  private apiURL = 'http://localhost:9090/bot/chat'; 

  constructor(private http: HttpClient) {}

  getBotResponse(prompt: string): Observable<string> {
    return this.http.get<string>(`${this.apiURL}?prompt=${encodeURIComponent(prompt)}`);
  }
}
