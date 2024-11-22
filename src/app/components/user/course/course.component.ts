import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import { Course } from '../../../model/course.model';
import { CourseService } from '../../../service/course.service';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit{
  @ViewChild('fileInput') fileInput!: ElementRef;
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  showMiniWindow: boolean = false;
  filterName: string = '';
  selectedCourse: Course = this.initializeCourse();
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
        this.filteredCourses = [...this.courses]; 
      },
      error: (err) => {
        console.error("Failed to load courses", err);
      }
    });
  }

  initializeCourse(): Course {
    return {
      courseId: 0,
      courseName: '',
      description: '',
      subjects: '',
      courseFee: 0,
      fulDetails: '',
      courseImageName: '',
      courseImageType: '',
      courseImageData: null,
    };
  }
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  saveCourse(): void {
    const fileToUpload = this.imageFile || undefined; 
    if (this.isEditMode) {
      this.courseService.updateCourse(this.selectedCourse, fileToUpload).subscribe(() => {
        this.loadCourses();
        alert('Course updated Successfully...');
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
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const selectedFile = input.files[0];
      this.imageFile = selectedFile; 
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string; 
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  clearForm(): void {
    this.selectedCourse = {
      courseId: 0,
      courseName: '',
      description: '',
      subjects: '',
      courseFee: 0,
      fulDetails:'',
      courseImageName: '',
      courseImageType: '',
      courseImageData: null,
    };
    this.isEditMode = false;
    this.imageFile = null;
  }
  
  deleteCourse(id: number): void {
    this.courseService.deleteCourseById(id).subscribe(() => {
      alert('Delete Successfully...');
      this.loadCourses();
    });
  }
  loadCourses(): void {
    this.courseService.getAllCourses().subscribe((data: Course[]) => {
      this.courses = data.map(course => ({
        ...course,
        imagePreview: course.courseImageData ? `data:${course.courseImageType};base64,${course.courseImageData}` : null
      }));
      this.filteredCourses = [...this.courses]; 
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
        alert('Course updated Successfully...');
      },
      error: (err) => {
        console.error("Failed to update course", err);
      }
    });
  }

  async downloadCoursePDF(course: Course): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(18);
    doc.text('Course Details', pageWidth / 2, 20, { align: 'center' });
    let currentY = 40; 
    const lineHeight = 10;
    if (course.courseImageData) {
      try {
        const imgBase64 = `data:${course.courseImageType};base64,${course.courseImageData}`;
        const imgWidth = 50;
        const imgHeight = 50;
        const imgX = (pageWidth - imgWidth) / 2;
        doc.addImage(imgBase64, 'JPEG', imgX, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 10; 
      } catch (error) {
        console.error('Error loading image:', error);
        doc.setFontSize(12);
        doc.text('Image not available', pageWidth / 2, currentY, { align: 'center' });
        currentY += lineHeight;
      }
    }
    doc.setFontSize(12);
    doc.text(`Course Name: ${course.courseName}`, 20, currentY);
    currentY += lineHeight;
    
    doc.text(`Subject: ${course.subjects}`, 20, currentY);
    currentY += lineHeight;
    
    doc.text(`Course Fee: ${course.courseFee}`, 20, currentY);
    currentY += lineHeight;
    const splitDescription = doc.splitTextToSize(`Description: ${course.description}`, pageWidth - 40);
    doc.text(splitDescription, 20, currentY);
    currentY += lineHeight * splitDescription.length;
    if (course.fulDetails) {
      currentY += lineHeight; 
      const splitDetails = doc.splitTextToSize(`${course.fulDetails}`, pageWidth - 40);
      doc.text(splitDetails, 20, currentY);
      currentY += lineHeight * splitDetails.length;
    }
    doc.setFontSize(10);
    const today = new Date().toLocaleDateString();
    doc.text(`Generated on: ${today}`, 20, doc.internal.pageSize.height - 20);
    doc.save(`${course.courseName.replace(/\s+/g, '_')}_details.pdf`);
  }
}


