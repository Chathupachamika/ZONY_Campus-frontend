import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../guardAuth/auth.service';
import { HomeComponent } from "../../user/dashboard/home.component";
import { FooterComponent } from "../../user/footer/footer.component";
import { HeaderComponent } from "../../user/header/header.component";
import { SidebarComponent } from "../../user/sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, HomeComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  adminName: string = '';
  adminImage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.title === 'Admin') {
      this.adminName = currentUser.fullName;
     this.adminImage=currentUser.imageData;
      }
  }
}