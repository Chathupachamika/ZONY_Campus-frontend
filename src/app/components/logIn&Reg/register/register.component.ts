import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { FacultyService } from '../../../service/faculty.service';
import { ProfileViewService, UserDetails } from '../../../service/profile-view.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule,MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: UserDetails = {
    reg_id: 0,
    program: '',
    title: '',
    referral: '',
    fullName: '',
    dob: '',
    country: '',
    passport: '',
    shortName: '',
    mobile: '',
    email: '',
    address: '',
    username: '',
    password: '',
    imageData: ''
  };
  
  confirmPassword: string = '';
  profileImageSrc: string | null = null;
  selectedImageFile: File | null = null;
  showAlert = false;
  imageWarning = '';

  faculties: any[] = [];
  constructor(private profileViewService: ProfileViewService, private router: Router, private facultyService: FacultyService,) {}

  ngOnInit(): void {
    this.loadFaculties();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      this.selectedImageFile = file;
      this.imageWarning = '';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageSrc = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.imageWarning = 'Only JPEG or JPG images are allowed.';
    }
  }
  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe(
      (response: any[]) => {  
        this.faculties = response;
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading faculties:', error.message);
      }
    );
  }

  onSubmit(): void {
    this.showAlert = false;

    // Check if password and confirm password match
    if (this.user.password !== this.confirmPassword) {
      this.showAlert = true;
      return;
    }

    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(this.user)], { type: 'application/json' }));
    if (this.selectedImageFile) {
      formData.append('imageFile', this.selectedImageFile);
    }

    this.profileViewService.registerUser(formData).subscribe({
      next: response => {
        console.log('Registration successful:', response.message);
        this.router.navigate(['/login']); // Redirect to login page on success
      },
      error: error => {
        console.error('Registration failed:', error.message);
      }
    });
  }

  backToLogin(): void {
    this.router.navigate(['/login']); // Navigates to the login page
  }
}