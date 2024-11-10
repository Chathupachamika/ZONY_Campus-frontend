import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lecturer } from '../model/lecturers.model';


interface Faculty {
  faculty_id: number;
  name: string;
  description: string;
  specializations: string;
  icon: string;
  facImageData: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private baseUrl = 'http://localhost:8080/faculty/get-allFaculty'; 
  private lecturesUrl = 'http://localhost:8080/lecturer/get-allLecturer';
  private searchByFaculty = 'http://localhost:8080/lecturer/searchLecturer-by-faculty';

  constructor(private http: HttpClient) { }

  getFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.baseUrl);
  }
  getLecturers(): Observable<Lecturer[]> {
    return this.http.get<Lecturer[]>(this.lecturesUrl);
  }
  searchLecturersByFaculty(faculty: string): Observable<Lecturer[]> {
    return this.http.get<Lecturer[]>(`${this.searchByFaculty}/${faculty}`);
  }
}
