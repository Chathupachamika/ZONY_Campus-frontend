import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BotService } from '../../../service/bot.service';
import { SidebarAdminComponent } from "../sidebar-admin/sidebar-admin.component";

@Component({
  selector: 'app-zonar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarAdminComponent],
  templateUrl: './zonar.component.html',
  styleUrl: './zonar.component.css'
})
export class ZonarComponent {
  chatsArray: { sender: string; message: string; time: string }[] = [];
  messageInput: string = '';
  isTyping: boolean = false;
  userDetails: any;

  constructor(private botService: BotService) {}

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