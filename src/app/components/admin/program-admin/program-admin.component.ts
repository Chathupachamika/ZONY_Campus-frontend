import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Program } from '../../../model/program.model';
import { ProgramService } from '../../../service/program.service';
import { FooterComponent } from "../../user/footer/footer.component";
import { ProgramComponent } from "../../user/program/program.component";
import { SidebarComponent } from "../../user/sidebar/sidebar.component";
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { SidebarAdminComponent } from "../sidebar-admin/sidebar-admin.component";

@Component({
  selector: 'app-program-admin',
  standalone: true,
  imports: [FooterComponent, SidebarComponent, FullCalendarModule, HeaderAdminComponent, ProgramComponent, CommonModule, FormsModule, RouterModule, SidebarAdminComponent],
  templateUrl: './program-admin.component.html',
  styleUrls: ['./program-admin.component.css']
})
export class ProgramAdminComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  filteredPrograms: Program[] = [];
  filterName: string = '';
  filterFaculty: string = '';
  program: Program[] = [];
  filterMonth: string = '';
  filterDate: string = '';
  filterTime: string = '';
  programs: Program[] = [];
  selectedProgram: Program | null = null;
  isEditMode = false;
  imagePreview: string | null = null;
  imageFile: File | null = null;

  constructor(private programService: ProgramService) {}

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

  ngOnInit(): void {
    this.loadPrograms();
    this.programService.getDetails().subscribe((data: Program[]) => {
      this.program = data;
      this.filteredPrograms = this.program;
      this.populateCalendarEvents();
    });
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

  loadPrograms(): void {
    this.programService.getDetails().subscribe((data) => {
      this.programs = data;
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(this.imageFile);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  saveProgram(): void {
    if (!this.selectedProgram) return;

    const formData = new FormData();
    formData.append(
      'program',
      new Blob([JSON.stringify(this.selectedProgram)], { type: 'application/json' })
    );
    if (this.imageFile) {
      formData.append('imageFile', this.imageFile);
    }

    if (this.isEditMode) {
      this.programService
        .updateProgram(this.selectedProgram, this.imageFile)
        .subscribe(() => {
          alert('Program updated successfully.');
          this.clearForm();
          this.loadPrograms();
        });
    } else {
      this.programService.addProgram(this.selectedProgram, this.imageFile, formData).subscribe(() => {
        alert('Program added successfully.');
        this.clearForm();
        this.loadPrograms();
      });
    }
  }

  addProgram(): void {
    this.selectedProgram = {
      programId: 0,
      programName: '',
      programMission: '',
      programDetails: '',
      programVenue: '',
      programDateTime: '',
      programImageName: '', 
      programImageType: '', 
      programImageData: '', 
    } as Program;
    this.isEditMode = false;
    this.imagePreview = null;
    this.imageFile = null;
  }

  editProgram(program: Program): void {
    this.selectedProgram = { ...program };
    this.imagePreview = program.programImageData
      ? 'data:image/jpeg;base64,' + program.programImageData
      : null;
    this.isEditMode = true;
  }

  deleteProgram(programId: number): void {
    this.programService.deleteProgram(programId).subscribe(() => {
      alert('Program deleted successfully.');
      this.loadPrograms();
    });
  }

  clearForm(): void {
    this.selectedProgram = null;
    this.isEditMode = false;
    this.imagePreview = null;
    this.imageFile = null;
  }
}
