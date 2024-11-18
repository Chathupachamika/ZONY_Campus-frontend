import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BotService } from '../../../service/bot.service';

@Component({
  selector: 'app-bot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './bot.component.html',
  styleUrl: './bot.component.css'
})
export class BotComponent {
  userInput: string = '';
  chatHistory: { role: string, content: string }[] = [];

  constructor(private botService: BotService) {}

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const userMessage = { role: 'user', content: this.userInput };
    this.chatHistory.push(userMessage);

    this.botService.getBotResponse(this.userInput).subscribe(response => {
      const botMessage = { role: 'assistant', content: response };
      this.chatHistory.push(botMessage);
    });

    this.userInput = '';
  }
}