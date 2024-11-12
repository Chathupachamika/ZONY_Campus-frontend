import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../guardAuth/auth.service';
import { Faculty } from '../../../model/faculty.model';
import { FacultyService } from '../../../service/faculty.service';
import { ProfileViewService } from '../../../service/profile-view.service';
import { ProgramService } from '../../../service/program.service';
import { Program } from '../../../model/program.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  userDetails: any;
  program: Program[] = [];
  faculties: Faculty[] = [];
  constructor(
    private facultyService: FacultyService,
    private programService: ProgramService,
    private profileViewService: ProfileViewService,
    private authService: AuthService,
    private router: Router
  ) {}

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
    }
    this.facultyService.getFaculties().subscribe((data) => {
      this.faculties = data;
    });
    this.programService.getDetails().subscribe((data: Program[]) => {
      this.program = data;
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
