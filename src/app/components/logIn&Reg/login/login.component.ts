import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { ProfileViewService } from '../../../service/profile-view.service';
import { RegisterService } from '../../../service/register.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any = {
    email: '',
    password: ''
  };
  rememberMe: boolean = false;

  constructor(
    private profileViewService: ProfileViewService,
    private router: Router,
    private registerService: RegisterService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      this.user = JSON.parse(rememberedUser);
      this.rememberMe = true;
    }
  }

  login(event?: Event) {
    if (event) event.preventDefault();

    this.profileViewService.getDetails().subscribe({
      next: (users) => {
        const foundUser = users.find(u => u.email === this.user.email && u.password === this.user.password);

        if (foundUser) {
          this.profileViewService.logUser(foundUser);
          if (this.rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify(this.user));
          } else {
            localStorage.removeItem('rememberedUser');
          }

          const redirectPath = foundUser.title === 'Admin' ? '/admin/dashboard' : '/home';
          this.router.navigate([redirectPath]).then(() => {
            this.snackBar.open(`Welcome${foundUser.title === 'Admin' ? ' to the Admin Dashboard!' : '!'}`, '', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: [foundUser.title === 'Admin' ? 'admin-welcome-snackbar' : 'success-snackbar']
            });
          });
        } else {
          this.snackBar.open('Invalid email or password.', '', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.snackBar.open('Login failed. Please try again.', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openForgotPassword() {
    if (!this.isEmailValid(this.user.email)) {
      this.snackBar.open('Please enter a valid email address.', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.registerService.sendPasswordResetEmail(this.user.email).subscribe({
      next: (response) => {
        this.snackBar.open('Password reset email sent!', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error sending password reset email:', error);
        alert('Open Email and get password...');
        this.snackBar.open('Password sent to Email...', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  isEmailValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}