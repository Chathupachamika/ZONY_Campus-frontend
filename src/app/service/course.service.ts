import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiEndpoint = 'http://localhost:9090/course';
  private baseUrl = 'http://localhost:9090/payment'; 

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiEndpoint}/get-all`);
  }

  addCourse(course: Course, imageFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('user', new Blob([JSON.stringify(course)], { type: 'application/json' }));
    formData.append('imageFile', imageFile);

    return this.http.post(`${this.apiEndpoint}/add-user`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiEndpoint}/searchCourse-by-id/${id}`);
  }

  deleteCourseById(id: number): Observable<any> {
    return this.http.delete(`${this.apiEndpoint}/deleteCourse-by-id/${id}`);
  }

  updateCourse(course: Course, imageFile?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('course', new Blob([JSON.stringify(course)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    return this.http.put(`${this.apiEndpoint}/update-course`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  createPayment(paymentDetails: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pay`, paymentDetails);
  }
}
