import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Program } from '../../../model/program.model';
import { ProgramService } from '../../../service/program.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-program',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FullCalendarModule, HeaderComponent, SidebarComponent, FooterComponent], // Add FullCalendarModule here
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css'] 
})
export class ProgramComponent implements OnInit {

  filteredPrograms: Program[] = [];
  filterName: string = '';
  filterFaculty: string = '';
  filterMonth: string = '';
  filterDate: string = '';
  filterTime: string = '';
  program: Program[] = [];

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

  constructor(private programService: ProgramService) {}

  ngOnInit(): void {
    this.programService.getDetails().subscribe((data: Program[]) => {
      this.program = data;
      this.filteredPrograms = this.program;
      this.populateCalendarEvents();
    });
    this.getPrograms();
  }

  getPrograms(): void {
    this.programService.getDetails().subscribe(
      (data: Program[]) => {
        this.program = data;
        this.filteredPrograms = this.program;
      },
      (error) => {
        console.error('Error fetching programs:', error);
      }
    );
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

  handleEventClick(clickInfo: any): void {
    const program: Program = clickInfo.event.extendedProps.program;
    alert(`Program: ${program.programName}\nVenue: ${program.programVenue}\nDate & Time: ${new Date(program.programDateTime).toLocaleString()}`);
  }
}
