import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Faculty } from '../model/faculty.model';
import { Lecturer } from '../model/lecturers.model';
@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private baseUrl = 'http://localhost:9090/faculty';
  private lecturesUrl = 'http://localhost:9090/lecturer/get-allLecturer';
  private searchByFacultyUrl = 'http://localhost:9090/lecturer/searchLecturer-by-faculty';
  private lecturerUrl = 'http://localhost:9090/lecturer';

  constructor(private http: HttpClient) { }

  getFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(`${this.baseUrl}/get-allFaculty`);
  }

  addFaculty(faculty: Faculty, imageFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('faculty', new Blob([JSON.stringify(faculty)], { type: 'application/json' }));
    formData.append('imageFile', imageFile);

    return this.http.post(`${this.baseUrl}/add-faculty`, formData);
  }

  updateFaculty(faculty: Faculty, imageFile?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('faculty', new Blob([JSON.stringify(faculty)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    return this.http.put(`${this.baseUrl}/update-faculty`, formData);
  }

  deleteFacultyById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteFaculty-by-id/${id}`);
  }

  getFacultyById(id: number): Observable<Faculty> {
    return this.http.get<Faculty>(`${this.baseUrl}/searchFaculty-by-id/${id}`);
  }

  getLecturers(): Observable<Lecturer[]> {
    return this.http.get<Lecturer[]>(this.lecturesUrl);
  }

  searchLecturersByFaculty(faculty: string): Observable<Lecturer[]> {
    return this.http.get<Lecturer[]>(`${this.searchByFacultyUrl}/${faculty}`);
  }

  searchLecturersByName(lecturerName: string): Observable<Lecturer[]> {
    const url = `${this.lecturerUrl}/searchLecturer-by-name/${lecturerName}`;
    return this.http.get<Lecturer[]>(url);
  }
  addLecturer(lecturer: Lecturer, imageFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('lecturer', new Blob([JSON.stringify(lecturer)], { type: 'application/json' }));
    formData.append('imageFile', imageFile);

    return this.http.post(`${this.lecturerUrl}/add-lecturer`, formData);
  }

  updateLecturer(lecturer: Lecturer, imageFile?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('lecturer', new Blob([JSON.stringify(lecturer)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    return this.http.put(`${this.lecturerUrl}/update-lecturer`, formData);
  }
  updateLectureImage(lecturer: Lecturer, imageFile?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('lecturer', new Blob([JSON.stringify(lecturer)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
  
    return this.http.put(`${this.lecturerUrl}/update-lecturer`, formData);
  }
  

  getLecturerById(id: number): Observable<Lecturer> {
    return this.http.get<Lecturer>(`${this.lecturerUrl}/searchLecturer-by-id/${id}`);
  }

  deleteLecturerById(id: number): Observable<any> {
    return this.http.delete(`${this.lecturerUrl}/deleteLecturer-by-id/${id}`);
  }

}