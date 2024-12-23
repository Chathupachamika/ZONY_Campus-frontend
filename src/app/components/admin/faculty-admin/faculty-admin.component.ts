import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Faculty } from '../../../model/faculty.model';
import { Lecturer } from '../../../model/lecturers.model';
import { FacultyService } from '../../../service/faculty.service';
import { ProfileViewService } from '../../../service/profile-view.service';
import { FooterComponent } from '../../user/footer/footer.component';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin.component';

@Component({
  selector: 'app-faculty-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderAdminComponent,
    SidebarAdminComponent,
    FooterComponent,
  ],
  templateUrl: './faculty-admin.component.html',
  styleUrls: ['./faculty-admin.component.css'],
})
export class FacultyAdminComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('facultyTrack') facultyTrack!: ElementRef;
  @ViewChild('fileInput2') fileInput2!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput3') fileInput3!: ElementRef<HTMLInputElement>;

  faculties: Faculty[] = [];
  filteredFaculties: Faculty[] = [];
  facultyLecturers: { [key: string]: Lecturer[] } = {};
  userDetails: any;
  searchTerm: string = '';
  selectedIndex = 0;
  displayedLecturers: Lecturer[] = [];
  facultiesCount = 0;
  lecturers: Lecturer[] = [];
  selectedFaculty: Faculty = this.initializeFaculty();
  selectedLecturer: Lecturer = new Lecturer('', '', '');
  selectedLecturerImage: Lecturer = new Lecturer('', '', '');
  isEditMode: boolean = false;
  isLecturerEditMode = false;
  allLecturers: Lecturer[] = [];
  imagePreview2: string | null = null;
  imagePreview3: string | null = null;
  imagePreview: string | null = null
  imageFile: File | null = null;
  imageFile2: File | null = null;
  imageFile3: File | null = null;
  filterName = '';
  filterFaculty = '';
  filterDate = '';

  constructor(
    private facultyService: FacultyService,
    private profileViewService: ProfileViewService
  ) { }

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe((data) => {
      this.faculties = data;
      this.filteredFaculties = [...this.faculties];
      this.facultiesCount = this.faculties.length;
      this.selectedIndex = Math.floor(this.facultiesCount / 2);
      this.scrollToMiddleCard();


      this.faculties.forEach((faculty) => {
        this.facultyService.searchLecturersByFaculty(faculty.name).subscribe((lecturers) => {
          this.facultyLecturers[faculty.name] = lecturers;
          console.log('Lecturers for faculty:', faculty.name, this.facultyLecturers);
        });
      });
    });
    this.loadFaculties();
    this.loadLecturers();
    this.userDetails = this.profileViewService.getUserDetails();

    if (!this.userDetails) {
      this.profileViewService.getDetails().subscribe((data) => {
        this.profileViewService.logUser(data);
        this.userDetails = data;
      });
    }
  }

  initializeFaculty(): Faculty {
    return {
      faculty_id: 0,
      name: '',
      description: '',
      specializations: '',
      icon: '',
      facImageData: '',
    };
  }
  onSearch() {
    if (this.searchTerm.trim()) {
      this.facultyService.searchLecturersByName(this.searchTerm).subscribe(
        (lecturers) => {
          this.lecturers = lecturers;
          let lecturerDetails = '';
          lecturers.forEach(lecturer => {
            lecturerDetails += `Name: ${lecturer.lecturerName}\nExperience: ${lecturer.lecturerExperience}\nDegrees: ${lecturer.lecturerDegrees}\n\n`;
          });
          alert(lecturerDetails);
        },
        (error) => {
          console.error('Error searching lecturers:', error);
        }
      );
    } else {
      this.lecturers = [];
    }
  }


  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe((data) => {
      this.faculties = data;
    });
  }


  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToMiddleCard();
    }, 0);
  }

  selectCard(index: number): void {
    this.selectedIndex = index;
    this.scrollToMiddleCard();
  }

  nextCard(): void {
    this.selectedIndex = (this.selectedIndex + 1) % this.facultiesCount;
    this.scrollToMiddleCard();
  }

  prevCard(): void {
    this.selectedIndex =
      (this.selectedIndex - 1 + this.facultiesCount) % this.facultiesCount;
    this.scrollToMiddleCard();
  }

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

  saveFaculty(): void {
    if (this.isEditMode) {
      this.facultyService
        .updateFaculty(this.selectedFaculty, this.imageFile || undefined)
        .subscribe(() => {
          alert('Faculty updated successfully.');
          this.clearForm();
          this.loadFaculties();
        });
    } else {
      this.facultyService.addFaculty(this.selectedFaculty, this.imageFile!).subscribe(() => {
        alert('Faculty added successfully.');
        this.clearForm();
        this.loadFaculties();
      });
    }
  }

  editFaculty(faculty: Faculty): void {
    this.selectedFaculty = { ...faculty };
    this.isEditMode = true;
  }

  deleteFaculty(id: number): void {
    this.facultyService.deleteFacultyById(id).subscribe(() => {
      alert('Faculty deleted successfully.');
      this.loadFaculties();
    });
  }

  showAllLecturers(): void {
    this.displayedLecturers = [...this.allLecturers];
  }
  loadLecturers(): void {
    this.facultyService.getLecturers().subscribe((data) => {
      this.allLecturers = data;
      this.displayedLecturers = this.allLecturers.slice(0, 5);
    });
  }

  clearForm(): void {
    this.selectedFaculty = this.initializeFaculty();
    this.isEditMode = false;
    this.imageFile = null;
    this.imagePreview = null;
  }

  saveLecturer(): void {
    const fileToUpload = this.imageFile2 || undefined;

    if (this.isLecturerEditMode) {
      this.facultyService.updateLecturer(this.selectedLecturer, fileToUpload).subscribe(
        () => {
          alert('Lecturer updated successfully');
          this.loadLecturers();
          this.clearForm2();
          this.isLecturerEditMode = false;
        },
        (error) => {
          console.error('Error updating lecturer:', error);
          alert('Error updating lecturer');
        }
      );
    } else {
      if (!fileToUpload) {
        alert('Please select an image');
        return;
      }
      this.facultyService.addLecturer(this.selectedLecturer, fileToUpload).subscribe(
        () => {
          alert('Lecturer added successfully');
          this.loadLecturers();
          this.clearForm2();
        },
        (error) => {
          console.error('Error adding lecturer:', error);
          alert('Error adding lecturer');
        }
      );
    }
  }
  editLecturer(lecturer: Lecturer): void {
    this.selectedLecturer = { ...lecturer };
    this.imagePreview2 = lecturer.lecturerImageData ?
      'data:image/jpeg;base64,' + lecturer.lecturerImageData : null;
    this.isLecturerEditMode = true;
    this.imageFile2 = null;
  }
  deleteLecturer(id: number): void {
    this.facultyService.deleteLecturerById(id).subscribe(() => this.loadLecturers());
  }
  clearForm2(): void {
    this.selectedLecturer = new Lecturer('', '', '');
    this.imageFile2 = null;
    this.imagePreview2 = null;
    this.isLecturerEditMode = false;
  }

  triggerFileInput3(): void {
    this.fileInput3.nativeElement.click();
  }

  onImageSelected3(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile3 = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview3 = e.target?.result as string;
      };
      reader.readAsDataURL(this.imageFile3);
    }
  }
  triggerFileInput2(): void {
    this.fileInput2.nativeElement.click();
  }

  onImageSelected2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile2 = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview2 = e.target?.result as string;
      };
      reader.readAsDataURL(this.imageFile2);
    }
  }

  savelecImage(): void {
    const fileToUpload = this.imageFile3 || undefined;

    if (this.isLecturerEditMode) {
      this.facultyService.updateLecturer(this.selectedLecturer, fileToUpload).subscribe(
        () => {
          alert('Lecturer updated successfully');
          this.loadLecturers();
          this.clearForm2();
          this.isLecturerEditMode = false;
        },
        (error) => {
          console.error('Error updating lecturer:', error);
          alert('Error updating lecturer');
        }
      );
    } else {
      if (!fileToUpload) {
        alert('Please select an image');
        return;
      }
      this.facultyService.addLecturer(this.selectedLecturer, fileToUpload).subscribe(
        () => {
          alert('Lecturer added successfully');
          this.loadLecturers();
          this.clearForm2();
        },
        (error) => {
          console.error('Error adding lecturer:', error);
          alert('Error adding lecturer');
        }
      );
    }
  }

  editLecturerImage(lecturer: Lecturer): void {
    this.selectedLecturerImage = { ...lecturer };
    this.imagePreview3 = lecturer.lecturerImageData ?
      'data:image/jpeg;base64,' + lecturer.lecturerImageData : null;
    this.isLecturerEditMode = true;
    this.imageFile3 = null;
  }


  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

}
