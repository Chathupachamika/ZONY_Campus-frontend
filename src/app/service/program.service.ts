import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Program } from '../model/program.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private userResponse: { message: string, program: any } = { message: '', program: {} };
  private program: Program | null = null;
  private apiUrl = 'http://localhost:9090/program/get-allPrograms';
  private updateApiUrl = 'http://localhost:9090/program/update-Program'; 
  private deleteApiUrl = 'http://localhost:9090/program/deleteProgram-by-id'; 

  constructor(private http: HttpClient) {}


  getDetails(): Observable<Program[]> {
    return this.http.get<Program[]>(this.apiUrl)
      .pipe(catchError(this.handleError)); 
  }

 
  addProgram(formData: FormData): Observable<{ message: string, program: Program }> {
    return this.http.post<{ message: string, program: Program }>('http://localhost:9090/program/add-Program', formData)
      .pipe(
        tap(response => {
          console.log('Response:', this.userResponse);
          console.log('Program added:', response.message);
        }),
        catchError(this.handleError)  
      );
  }


  updateProgram(program: Program, imageFile: File | null): Observable<{ message: string; programDetails: Program }> {
    const formData = new FormData();
    formData.append('program', new Blob([JSON.stringify(program)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    return this.http.put<{ message: string; programDetails: Program }>(this.updateApiUrl, formData)
      .pipe(
        tap(response => {
          this.program = response.programDetails;
          console.log('Program updated successfully:', response.message);
        }),
        catchError(this.handleError) 
      );
  }


  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    let errorMessage = 'There was an issue processing your request.';
    if (error.status === 500) {
      errorMessage = 'Server error occurred. Please try again later.';
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your internet connection.';
    }
    return throwError(() => new Error(errorMessage));
  }

 
  deleteProgram(programId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.deleteApiUrl}/${programId}`)
      .pipe(
        tap(response => {
          console.log('Program deleted:', response.message);
          this.program = null;
        }),
        catchError(error => {
          console.error('Error deleting program:', error);
          return throwError(() => new Error('Error deleting program.'));
        })
      );
  }
}
