import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Program } from '../model/program.model';

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  private apiUrl = 'http://localhost:9090/program';

  constructor(private http: HttpClient) { }

  getDetails(): Observable<Program[]> {
    return this.http.get<Program[]>(`${this.apiUrl}/get-allPrograms`).pipe(
      tap((programs) => console.log('Fetched programs:', programs)),
      catchError(this.handleError)
    );
  }

  addProgram(selectedProgram: Program, imageFile: File | null, formData: FormData): Observable<{ message: string; program: Program }> {
    return this.http.post<{ message: string; program: Program }>(
      `${this.apiUrl}/add-Program`,
      formData
    ).pipe(
      tap((response) => console.log('Program added:', response)),
      catchError(this.handleError)
    );
  }

  searchProgramById(programId: number): Observable<Program> {
    const searchUrl = `${this.apiUrl}/searchProgram-by-id/${programId}`;
    return this.http.get<Program>(searchUrl).pipe(
      tap((program) => console.log('Program fetched by ID:', program)),
      catchError(this.handleError)
    );
  }

  updateProgram(
    program: Program,
    imageFile: File | null
  ): Observable<{ message: string; programDetails: Program }> {
    const formData = new FormData();
    formData.append('Program', new Blob([JSON.stringify(program)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    return this.http.put<{ message: string; programDetails: Program }>(
      `${this.apiUrl}/update-Program`,
      formData
    ).pipe(
      tap((response) => console.log('Program updated successfully:', response)),
      catchError(this.handleError)
    );
  }


  deleteProgram(programId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/deleteProgram-by-id/${programId}`
    ).pipe(
      tap((response) => console.log('Program deleted:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP Error:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error.status === 500) {
      errorMessage = 'Server error occurred. Please try again later.';
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
