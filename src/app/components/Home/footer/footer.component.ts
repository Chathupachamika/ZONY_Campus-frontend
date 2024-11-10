import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../guardAuth/auth.service';
import { Router } from '@angular/router';
import { ProfileViewService } from '../../../service/profile-view.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  userDetails: any;

  constructor(
    private profileViewService: ProfileViewService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load user details from localStorage or backend if needed
    this.authService.loadUserDetails();

    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      // Redirect to login page if not logged in
      this.router.navigate(['/login']);
    } else {
      // If logged in, get the user details
      this.userDetails = this.profileViewService.getUserDetails();

      // If user details are not found, fetch them from the service
      if (!this.userDetails) {
        this.profileViewService.getDetails().subscribe(data => {
          if (data) {
            // Save the fetched user details
            this.profileViewService.logUser(data);
            this.userDetails = data;
          } else {
            console.log('No user details found.');
          }
        });
      }
    }
  }

  // Logout function
  onLogout(): void {
    // Call the logout method from AuthService
    this.authService.logout();
    // Navigate to login page after logout
    this.router.navigate(['/login']);
  }
}
