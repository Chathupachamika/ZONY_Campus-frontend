import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Program } from '../../../model/program.model';
import { ProgramService } from '../../../service/program.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-program',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './program.component.html',
  styleUrl: './program.component.css'
})
export class ProgramComponent implements OnInit {

  program: Program[] = [];
  constructor(private programService: ProgramService) {}
  ngOnInit(): void {
    this.getPrograms(); 
  }

  getPrograms(): void {
    this.programService.getDetails().subscribe(
      (data: Program[]) => {
        this.program = data; 
      },
      (error) => {
        console.error('Error fetching programs:', error); 
      }
    );
  }
}
