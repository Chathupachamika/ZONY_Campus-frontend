import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../guardAuth/auth.service';
import { ProfileViewService } from '../../../service/profile-view.service';

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
  phoneNumber: string = '';
  enteredOTP: string = '';
  generatedOTP: string = '';

  constructor(private profileViewService: ProfileViewService, private router: Router,private authService: AuthService) {}

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
          alert('Login successful!');
          this.profileViewService.logUser(foundUser); 
          if (this.rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify(this.user));
          } else {
            localStorage.removeItem('rememberedUser');
          }
          this.router.navigate(['/home']); 
        } else {
          alert('Invalid email or password.');
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        alert('Login failed. Please try again.');
      }
    });
  }

  openForgotPassword() {
    const phone = prompt("Please enter your phone number:");
    if (phone) {
      if (this.isPhoneNumberValid(phone)) {
        this.generatedOTP = this.generateOTP();
        alert(`OTP sent to your phone number: ${phone}`);
        this.verifyOTP();
      } else {
        alert("Invalid phone number. Please try again.");
      }
    }
  }

  isPhoneNumberValid(phone: string): boolean {
    return /^\d{10}$/.test(phone);
  }

  generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  verifyOTP() {
    const otp = prompt("Enter the OTP:");
    if (otp === this.generatedOTP) {
      alert("OTP verification successful! You can now reset your password.");
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  }
}
