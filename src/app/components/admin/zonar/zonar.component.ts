import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BotService } from '../../../service/bot.service';
import { SidebarAdminComponent } from "../sidebar-admin/sidebar-admin.component";
import { AuthService } from '../../../guardAuth/auth.service';
import { ProfileViewService } from '../../../service/profile-view.service';

@Component({
  selector: 'app-zonar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarAdminComponent],
  templateUrl: './zonar.component.html',
  styleUrl: './zonar.component.css'
})
export class ZonarComponent implements OnInit{
  chatsArray: { sender: string; message: string; time: string }[] = [];
  messageInput: string = '';
  isTyping: boolean = false;
  userDetails: any;

  constructor(private botService: BotService,private profileViewService: ProfileViewService,
      private authService: AuthService,
      private router: Router) { }
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
  send(): void {
    const message = this.messageInput.trim();
    if (!message) return;

    const time = this.getTime();
    this.chatsArray.push({ sender: 'Me', message, time });
    this.messageInput = '';
    this.addTypingIndicator();

    this.botService.getAIResponse(message).subscribe({
      next: (response: any) => {
        this.removeTypingIndicator();

        let aiMessage = 'Sorry, I encountered an error. Please try again.';
        try {
          const parsedResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;
          aiMessage = parsedResponse ? parsedResponse.trim() : response.responseMessage || aiMessage;
        } catch (error) {
          console.error('Error parsing AI response:', error);
        }

        this.chatsArray.push({ sender: 'ChatterAI', message: aiMessage, time: this.getTime() });
      },
      error: () => {
        this.removeTypingIndicator();
        this.chatsArray.push({
          sender: 'ChatterAI',
          message: 'Sorry, I encountered an error. Please try again.',
          time: this.getTime(),
        });
      },
    });

  }


  addTypingIndicator(): void {
    this.isTyping = true;
  }

  removeTypingIndicator(): void {
    this.isTyping = false;
  }

  getTime(): string {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  }
}