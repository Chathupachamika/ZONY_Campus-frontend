import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from '../model/register.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:8080/register'; 
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  addUser(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-user`, formData);
  }
  

  getAll(): Observable<Register[]> {
    return this.http.get<Register[]>(`${this.apiUrl}/get-all`);
  }

  getFaculties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/faculty/get-allFaculty`);
  }

  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/add-user`, formData);
  }

  loginUserPassword(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, formData);
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    const requestBody = { email }; 
    return this.http.post(`${this.baseUrl}/forgot-password/post`, requestBody);
  }
}
