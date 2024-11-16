import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../model/course.model';
import { CourseService } from '../../../service/course.service';
import { FooterComponent } from "../../user/footer/footer.component";
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { SidebarAdminComponent } from "../sidebar-admin/sidebar-admin.component";

@Component({
  selector: 'app-course-admin',
  standalone: true,
  imports: [CommonModule, HeaderAdminComponent, SidebarAdminComponent, FooterComponent, FormsModule],
  templateUrl: './course-admin.component.html',
  styleUrls: ['./course-admin.component.css']
})
export class CourseAdminComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  showMiniWindow: boolean = false;
  filterName: string = '';
  selectedCourse: Course = {
    courseId: 0,
    courseName: '',
    description: '',
    subjects: '',
    courseFee: 0,
    courseImageName: '',
    courseImageType: '',
    courseImageData: null,
  };
  isEditMode = false;
  imageFile: File | null = null;
  imagePreview: string | null = null;
  filterSubject: string = '';
  filterFee: number | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
    this.courseService.getAllCourses().subscribe({
      next: (data: Course[]) => {
        this.courses = data.map(course => ({
          ...course,
          isEditing: false,
          image: `data:${course.courseImageType};base64,${course.courseImageData}`
        }));
        this.filteredCourses = [...this.courses]; // Initialize filtered courses with all courses
      },
      error: (err) => {
        console.error("Failed to load courses", err);
      }
    });
  }

  saveCourse(): void {
    const fileToUpload = this.imageFile || undefined; 
    if (this.isEditMode) {
      this.courseService.updateCourse(this.selectedCourse, fileToUpload).subscribe(() => {
        this.loadCourses();
        this.clearForm();
      });
    } else {
      this.courseService.addCourse(this.selectedCourse, fileToUpload!).subscribe(() => {
        this.loadCourses();
        this.clearForm();
      });
    }
  }
  
  editCourse(course: Course): void {
    this.selectedCourse = { ...course };
    this.isEditMode = true;
  }
  onFileSelect(event: any): void {
    const selectedFiles = event.target.files;
    this.imageFile = selectedFiles && selectedFiles[0] ? selectedFiles[0] : null;
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; 
      };
      reader.readAsDataURL(this.imageFile);
    } else {
      this.imagePreview = null; 
    }
  }

  clearForm(): void {
    this.selectedCourse = {
      courseId: 0,
      courseName: '',
      description: '',
      subjects: '',
      courseFee: 0,
      courseImageName: '',
      courseImageType: '',
      courseImageData: null,
    };
    this.isEditMode = false;
    this.imageFile = null;
  }
  
  deleteCourse(id: number): void {
    this.courseService.deleteCourseById(id).subscribe(() => {
      this.loadCourses();
    });
  }
  loadCourses(): void {
    this.courseService.getAllCourses().subscribe((data: Course[]) => {
      this.courses = data.map(course => ({
        ...course,
        imagePreview: course.courseImageData ? `data:${course.courseImageType};base64,${course.courseImageData}` : null
      }));
    });
  }

  showAllCourses(): void {
    this.showMiniWindow = true;
    this.resetFilters(); 
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course => {
      return (
        (!this.filterName || course.courseName.toLowerCase().includes(this.filterName.toLowerCase())) &&
        (!this.filterSubject || (course.subjects && course.subjects.toLowerCase().includes(this.filterSubject.toLowerCase()))) &&
        (!this.filterFee || (course.courseFee && course.courseFee <= this.filterFee))
      );
    });
  }

  private resetFilters(): void {
    this.filterName = '';
    this.filterSubject = '';
    this.filterFee = null;
    this.filteredCourses = [...this.courses]; 
  }

  onPurchase(course: Course): void {
    const paymentDetails = {
      price: course.courseFee,
      currency: 'USD',
      method: 'paypal',
      intent: 'sale',
      description: `Payment for course: ${course.courseName}`
    };

    this.courseService.createPayment(paymentDetails).subscribe({
      next: (response) => {
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl; 
        }
      },
      error: (err) => {
        console.error("Payment failed", err);
      }
    });
}

  saveChanges(course: Course): void {
    const updatedCourse: Course = { ...course };
    this.courseService.updateCourse(updatedCourse).subscribe({
      next: () => {
        course.isEditing = false;
        console.log("Course updated successfully");
      },
      error: (err) => {
        console.error("Failed to update course", err);
      }
    });
  }
}
