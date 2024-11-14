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
  imports: [CommonModule, HeaderAdminComponent, SidebarAdminComponent, FooterComponent,FormsModule],
  templateUrl: './course-admin.component.html',
  styleUrls: ['./course-admin.component.css']
})
export class CourseAdminComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  showMiniWindow: boolean = false;
  filterName: string = '';
  filterSubject: string = '';
  filterFee: number | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe((data: Course[]) => {
      this.courses = data.map(course => ({
        ...course,
        image: `data:${course.courseImageType};base64,${course.courseImageData}`
      }));
      this.filteredCourses = this.courses; // Initialize filtered courses with all courses
    });
  }

  showAllCourses(): void {
    this.showMiniWindow = true;
    this.resetFilters(); // Clear any previous filters
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
    this.filteredCourses = this.courses; // Reset filtered courses to all courses
  }
}