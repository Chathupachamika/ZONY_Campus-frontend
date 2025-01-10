import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AuthService } from '../../../guardAuth/auth.service';
import { Faculty } from '../../../model/faculty.model';
import { Program } from '../../../model/program.model';
import { FacultyService } from '../../../service/faculty.service';
import { ProfileViewService } from '../../../service/profile-view.service';
import { ProgramService } from '../../../service/program.service';
import { FooterComponent } from "../../user/footer/footer.component";
import { SidebarComponent } from "../../user/sidebar/sidebar.component";
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { SidebarAdminComponent } from "../sidebar-admin/sidebar-admin.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderAdminComponent,
    SidebarComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    FullCalendarModule,
    SidebarAdminComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChildren('number') numbers!: QueryList<ElementRef>;
  program: Program[] = [];
  filteredPrograms: Program[] = [];
  filterName: string = '';
  filterFaculty: string = '';
  filterMonth: string = '';
  filterDate: string = '';
  filterTime: string = '';
  faculties: Faculty[] = [];
  displayedFaculties: Faculty[] = [];
  userDetails: any;
  showAll: boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    selectable: true,
    editable: false,
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(
    private programService: ProgramService,
    private facultyService: FacultyService,
    private profileViewService: ProfileViewService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.animateNumbers();
  }

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
      this.displayedFaculties = this.faculties.slice(0, 5);
    });
    this.programService.getDetails().subscribe((data: Program[]) => {
      this.program = data
        .filter(program => new Date(program.programDateTime) > new Date())
        .slice(0, 5);
      this.filteredPrograms = this.program;
      this.populateCalendarEvents();
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  applyFilters(): void {
    this.filteredPrograms = this.program.filter(program => {
      const programDate = new Date(program.programDateTime);
      const programMonth = `${programDate.getFullYear()}-${(programDate.getMonth() + 1).toString().padStart(2, '0')}`;
      const programTime = programDate.toTimeString().substring(0, 5);

      return (
        (this.filterName ? program.programName.toLowerCase().includes(this.filterName.toLowerCase()) : true) &&
        (this.filterMonth ? programMonth === this.filterMonth : true) &&
        (this.filterDate ? programDate.toISOString().split('T')[0] === this.filterDate : true) &&
        (this.filterTime ? programTime === this.filterTime : true)
      );
    });
    this.populateCalendarEvents();
  }

  animateNumbers() {
    this.numbers.forEach((numberElement) => {
      const targetText = numberElement.nativeElement.innerText;
      const targetNumber = parseInt(targetText.replace(/\D/g, ''), 10);
      const duration = 3200;

      let current = 0;
      const increment = targetNumber / (duration / 30); // Calculate increment based on frames

      const interval = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          current = targetNumber;
          clearInterval(interval);
        }
        numberElement.nativeElement.innerText = `${Math.floor(current)}` + targetText.replace(/\d+/g, ''); // Append non-numeric text
      }, 30); // Update every 30ms for smooth animation
    });
  }

  populateCalendarEvents(): void {
    const events = this.filteredPrograms.map(program => {
      const date = new Date(program.programDateTime);
      return {
        title: program.programName,
        start: date,
        extendedProps: {
          program: program
        }
      };
    });
    this.calendarOptions.events = events;
  }

  showAllFaculties(): void {
    this.showAll = true;
    this.displayedFaculties = this.faculties;
  }

  handleEventClick(clickInfo: any): void {
    const program: Program = clickInfo.event.extendedProps.program;
    alert(`Program: ${program.programName}\nVenue: ${program.programVenue}\nDate & Time: ${new Date(program.programDateTime).toLocaleString()}`);
  }
}
