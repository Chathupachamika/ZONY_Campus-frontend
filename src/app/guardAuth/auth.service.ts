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
  private apiUrl = 'http://localhost:8080/register';
  private currentUserSubject: BehaviorSubject<UserDetails | null>;
  public currentUser: Observable<UserDetails | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private profileViewService: ProfileViewService
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<UserDetails | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserDetails | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<UserDetails> {
    return this.http.get<UserDetails[]>(`${this.apiUrl}/get-all`, { params: { username, password } }).pipe(
      map(users => {
        const foundUser = users.find((user: UserDetails) => user.username === username && user.password === password);

        if (foundUser) {
          this.profileViewService.logUser(foundUser);
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          this.currentUserSubject.next(foundUser);

          if (foundUser.title === 'Admin') {
            this.router.navigate(['/admin/dashboard']);
            this.router.navigate(['admin/program_main']);
          } else {
            this.router.navigate(['/home']);
          }

          return foundUser;
        } else {
          throw new Error('Invalid username or password');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.profileViewService.logOut();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  loadUserDetails() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.profileViewService.logUser(user);
      this.currentUserSubject.next(user);
    } else {
      this.currentUserSubject.next(null);
    }
  }
}