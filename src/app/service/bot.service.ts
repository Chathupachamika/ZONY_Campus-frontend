import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BotService {

  private apiURL = 'http://localhost:9090/api/chat/sendMessage';

  constructor(private http: HttpClient) { }

  getAIResponse(userMessage: string): Observable<{ responseMessage: string }> {
    return this.http.post<{ responseMessage: string }>(this.apiURL, { message: userMessage });
  }
}
