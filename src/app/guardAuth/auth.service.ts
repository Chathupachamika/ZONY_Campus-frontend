import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileViewService, UserDetails } from '../service/profile-view.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/register';  // Replace with your API URL
  private currentUserSubject: BehaviorSubject<UserDetails | null>;
  public currentUser: Observable<UserDetails | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private profileViewService: ProfileViewService  // Inject ProfileViewService
  ) {
    // Load the current user from localStorage if available
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<UserDetails | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Getter for current user value
  public get currentUserValue(): UserDetails | null {
    return this.currentUserSubject.value;
  }

  // Login method to authenticate the user
  login(username: string, password: string): Observable<UserDetails> {
    return this.http.get<UserDetails[]>(`${this.apiUrl}/get-all`, { params: { username, password } }).pipe(
      map(users => {
        const foundUser = users.find((user: UserDetails) => user.username === username && user.password === password);

        if (foundUser) {
          // If user is found, log user into ProfileViewService
          this.profileViewService.logUser(foundUser);

          // Store user in localStorage and update the currentUserSubject
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          this.currentUserSubject.next(foundUser);
          return foundUser;
        } else {
          throw new Error('Invalid username or password');
        }
      })
    );
  }

  // Logout method to clear user session
  logout(): void {
    // Remove user data from localStorage and reset the user subject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    // Clear user data from ProfileViewService
    this.profileViewService.logOut();

    // Navigate to login page
    this.router.navigate(['/login']);
  }

  // Check if the user is logged in (there is a currentUser)
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  // Load the user details from localStorage
  loadUserDetails() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.profileViewService.logUser(user);  // Store user details in the service
      this.currentUserSubject.next(user);  // Update currentUserSubject
    } else {
      this.currentUserSubject.next(null);
    }
  }
}
