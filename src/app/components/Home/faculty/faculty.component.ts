import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../guardAuth/auth.service';
import { Faculty } from '../../../model/faculty.model';
import { Lecturer } from '../../../model/lecturers.model';
import { FacultyService } from '../../../service/faculty.service';
import { ProfileViewService } from '../../../service/profile-view.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-faculty',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent implements OnInit {
  faculties: Faculty[] = []; // Store all faculties
  filteredFaculties: Faculty[] = []; // Store filtered faculties
  facultyLecturers: { [key: string]: Lecturer[] } = {}; // Store lecturers by faculty name
  userDetails: any;
  selectedIndex = 0;
  facultiesCount = 0;
  filterName: string = ''; // Filter by faculty name
  filterFaculty: string = ''; // Filter by specialization or faculty
  filterDate: string = ''; // Filter by date (if applicable)
  @ViewChild('facultyTrack') facultyTrack!: ElementRef;

  constructor(
    private facultyService: FacultyService,
    private profileViewService: ProfileViewService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Fetch faculties
    this.facultyService.getFaculties().subscribe((data) => {
      this.faculties = data; // Store the faculties
      this.filteredFaculties = [...this.faculties]; // Initially, all faculties are displayed
      this.facultiesCount = this.faculties.length;
      this.selectedIndex = Math.floor(this.facultiesCount / 2); // Set the initial selected index to the middle
      this.scrollToMiddleCard();

      // Fetch lecturers for each faculty and store them in the facultyLecturers object
      this.faculties.forEach((faculty) => {
        this.facultyService.searchLecturersByFaculty(faculty.name).subscribe((lecturers) => {
          this.facultyLecturers[faculty.name] = lecturers; // Store lecturers by faculty name
          console.log('Lecturers for faculty:', faculty.name, this.facultyLecturers);
        });
      });
    });

    // Get user details if logged in
    this.userDetails = this.profileViewService.getUserDetails();
    if (!this.userDetails) {
      this.profileViewService.getDetails().subscribe(data => {
        this.profileViewService.logUser(data);
        this.userDetails = data;
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToMiddleCard();
    }, 0);
  }

  // Select a faculty card by index
  selectCard(index: number): void {
    this.selectedIndex = index;
    this.scrollToMiddleCard();
  }

  // Move to the next faculty card
  nextCard(): void {
    this.selectedIndex = (this.selectedIndex + 1) % this.facultiesCount;
    this.scrollToMiddleCard();
  }

  // Move to the previous faculty card
  prevCard(): void {
    this.selectedIndex = (this.selectedIndex - 1 + this.facultiesCount) % this.facultiesCount;
    this.scrollToMiddleCard();
  }

  // Scroll to the middle faculty card
  scrollToMiddleCard(): void {
    if (!this.facultyTrack?.nativeElement) return;

    const track = this.facultyTrack.nativeElement as HTMLElement;
    const selectedCard = track.children[this.selectedIndex] as HTMLElement;
    const middlePosition = track.offsetWidth / 2 - selectedCard.offsetWidth / 2;
    const scrollOffset = selectedCard.offsetLeft - middlePosition;

    track.scrollTo({
      left: scrollOffset,
      behavior: 'smooth'
    });
  }

  
}
