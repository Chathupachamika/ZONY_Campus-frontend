import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../guardAuth/auth.service';
import { ProfileViewService, UserDetails } from '../../../service/profile-view.service';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SidebarComponent,CommonModule,FormsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  userDetails: any;
  recentUsers: UserDetails[] = [];
  constructor(
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
      this.profileViewService.getLastLoggedInUsers(3).subscribe(
        users => {
          this.recentUsers = users;
          console.log('Recent users:', this.recentUsers);
        },
        error => {
          console.error('Error fetching recent users:', error);
        }
      );
    }
  }
  async downloadPDF(report: any) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const centerText = (text: string, y: number) => {
      const textWidth = doc.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    };
    doc.setFontSize(16);
    centerText(`ID: ${report.id}`, 20);            //============================================================= change id
    doc.setFontSize(14);
    centerText(`Title: ${report.title}`, 30);      //============================================================= change title
    doc.setFontSize(12);
    const descriptionLines = doc.splitTextToSize(`Description: ${report.description}`, pageWidth - 20);
    doc.text(descriptionLines, pageWidth / 2, 40, { align: 'center', maxWidth: pageWidth - 20 });
    const lastY = 40 + (descriptionLines.length * 5);
    centerText(`Price: $${report.price}`, lastY + 10);      //===================================================== change price
    try {
      const imgData = await this.getBase64Image(report.image);     //============================================== change image
      const imgWidth = 50;
      const imgHeight = 50;
      const imgX = (pageWidth - imgWidth) / 2;
      const imgY = lastY + 20;
      doc.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error loading image:', error);
      centerText('Image not available', lastY + 20);     
    }
    doc.save(`product-details-${report.id}.pdf`);           //===================================================== change pdf name
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  private getBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
      img.src = url;
    });
  }
}
