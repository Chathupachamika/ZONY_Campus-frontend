import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';


export interface UserDetails {
  reg_id: number;
  fullName: string;
  dob: string;
  country: string;
  email: string;
  mobile: string;
  username: string;
  shortName: string;
  address: string;
  password:string;
  passport: string;
  program: string;
  title: string;
  referral: string;
  imageData: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProfileViewService {
  private userResponse: { message: string, userDetails: any } = { message: '', userDetails: {} };
  private userDetails: UserDetails | null = null;
  private userDetailsByReg: UserDetails | null = null;
  private verifyPasswordUrl = `http://localhost:8080/register/verifyPasswordUrl`;
  private apiUrl = 'http://localhost:8080/register/get-all';
  private updateApiUrl = 'http://localhost:8080/register/update-user'; 
  private deleteApiUrl = 'http://localhost:8080/register/delete-by-id'; 

  constructor(private http: HttpClient) {}

  getDetails(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  logUser(foundUser: any): void {
    console.log('Logged in user details:', foundUser);
    this.userDetails = foundUser;
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
  }

  getUserDetails(): any {
    return this.userDetails;
  }
  getUserDetailsByreg():any{
    return this.userDetailsByReg;
  }

  registerUser(formData: FormData): Observable<{ message: string, userDetails: any }> {
    return this.http.post<{ message: string, userDetails: any }>('http://localhost:8080/register/add-user', formData)
      .pipe(tap(response => {
        console.log('Response:', this.userResponse);  // Log the entire response to verify its structure
        console.log('User was added:', this.userResponse.message);
  
        if (this.userResponse && this.userResponse.userDetails) {
          console.log('Logged in user details:', this.userResponse.userDetails); // Ensure userDetails is not undefined
          this.logUser(this.userResponse.userDetails);
          this.userDetailsByReg = this.userResponse.userDetails;
          localStorage.setItem('currentUser', JSON.stringify(this.userResponse.userDetails));
        } else {
          console.error('User details are missing in the response!');
        }
      }));
  }
  
  updateUser(user: UserDetails, imageFile: File | null): Observable<{ message: string; userDetails: UserDetails }> {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
    
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    return this.http.put<{ message: string; userDetails: UserDetails }>(this.updateApiUrl, formData)
      .pipe(
        tap(response => {
          this.userDetails = response.userDetails;
          console.log('User updated successfully:', response.message);
        }),
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse) {
    // Handle the error response properly
    console.error('Error updating user:', error);

    // Depending on the error, you could return more details here
    let errorMessage = 'There was an issue updating the user.';
    if (error.status === 500) {
      // Server-side error
      errorMessage = 'Server error occurred. Please try again later.';
    } else if (error.status === 0) {
      // Network error
      errorMessage = 'Network error. Please check your internet connection.';
    }

    // You can also log more details to a logging service if necessary
    return throwError(() => new Error(errorMessage));
  }
  
  

  // Method to delete user
  deleteUser(userId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.deleteApiUrl}/${userId}`).pipe(
      tap(response => {
        console.log('User deleted:', response.message);
        this.userDetails = null; // Clear user details after deletion
        this.userDetailsByReg = null;
      }),
      catchError(error => {
        console.error('Error deleting user:', error);
        throw error; // You can also show a user-friendly message here
      })
    );
  }

  verifyPassword(password: string): Observable<boolean> {
    return this.http.post<boolean>(this.verifyPasswordUrl, { password }).pipe(
      catchError(this.handleError)
    );
  }

  // Method for logging out (clears user data)
  logOut(): void {
    this.userDetails = null;
    this.userDetailsByReg = null;
    console.log('User logged out');
  }
}



