import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../guardAuth/auth.service';
import { ProfileViewService, UserDetails } from '../../../service/profile-view.service';
import { FooterComponent } from "../../user/footer/footer.component";
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { SidebarAdminComponent } from "../sidebar-admin/sidebar-admin.component";

@Component({
  selector: 'app-about-admin',
  standalone: true,
  imports: [HeaderAdminComponent, SidebarAdminComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './about-admin.component.html',
  styleUrl: './about-admin.component.css'
})
export class AboutAdminComponent implements OnInit {
  userDetails: any;
  recentUsers: UserDetails[] = [];
  constructor(
    private profileViewService: ProfileViewService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.loadUserDetails();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
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
      this.profileViewService.getLastLoggedInUsers(3).subscribe(
        users => {
          this.recentUsers = users;
          console.log('Recent users:', this.recentUsers);
        },
        error => {
          console.error('Error fetching recent users:', error);
        }
      );
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  private getBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
      img.src = url;
    });
  }
}
