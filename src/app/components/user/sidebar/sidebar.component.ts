import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../guardAuth/auth.service'; 
import { ProfileViewService } from '../../../service/profile-view.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  userDetails: any;
  isEditMode = false;
  isPasswordPromptVisible = false;
  password: string = '';
  passwordError: boolean = false;
  isMiniWindowVisible = false;
  isExpanded = false;

  constructor(
    private profileViewService: ProfileViewService,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    if (this.authService.isLoggedIn()) {
      this.userDetails = this.profileViewService.getUserDetails();
      if (!this.userDetails) {
        this.profileViewService.getDetails().subscribe(data => {
          if (data) {
            this.profileViewService.logUser(data);
            this.userDetails = data;
          } else {
            console.log('No user details found.');
          }
        });
      }
    }
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  showPasswordPrompt(): void {
    this.isPasswordPromptVisible = true;
  }

  closePasswordPrompt(): void {
    this.isPasswordPromptVisible = false;
    this.password = '';
    this.passwordError = false;
  }

  verifyPassword(): void {
    this.profileViewService.verifyPassword(this.password)
      .pipe(catchError(error => {
        console.error('Error verifying password:', error);
        this.passwordError = true;
        return of(false);
      }))
      .subscribe(isCorrect => {
        if (isCorrect) {
          this.closePasswordPrompt();
          this.openEditForm();
        } else {
          this.passwordError = true;
        }
      });
  }

  openEditForm(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const selectedFile = input.files[0];
      this.updateAccount(selectedFile);
    }
  }

  updateAccount(imageFile: File | null = null): void {
    if (!this.userDetails) {
      console.error('No user details to update.');
      return;
    }

    this.profileViewService.updateUser(this.userDetails, imageFile)
      .pipe(
        catchError(error => {
          console.error('Error updating user:', error);
          alert(`There was an error updating your account. Status: ${error.status} ${error.statusText}`);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response && response.message === 'User updated successfully') {
          console.log('User successfully updated:', response);
          alert('User details updated successfully!');
          this.isEditMode = false;
        } else {
          console.warn('Update was not successful or no response message.');
        }
      });
  }

  deleteAccount(): void {
    if (!this.userDetails) return;

    const userId = this.userDetails.reg_id;
    if (confirm('Are you sure you want to delete your account?')) {
      this.profileViewService.deleteUser(userId)
        .pipe(catchError(error => {
          console.error('Error deleting account:', error);
          alert('Failed to delete the account.');
          return of(null);
        }))
        .subscribe(response => {
          if (response?.message === 'Success') {
            alert('Account deleted successfully!');
            this.router.navigate(['/login']);
          }
        });
    }
  }

  toggleMiniWindow(): void {
    this.isMiniWindowVisible = !this.isMiniWindowVisible;
  }

  logOut(): void {
    this.profileViewService.logOut();
    this.router.navigate(['/login']);
    alert('You have logged out successfully!');
  }

  showUserDetails(): void {
    this.isMiniWindowVisible = true;
  }

  closeMiniWindow(): void {
    this.isMiniWindowVisible = false;
  }
}
