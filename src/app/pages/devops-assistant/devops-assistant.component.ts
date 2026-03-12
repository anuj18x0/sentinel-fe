import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ChatMessage } from '../../models/interfaces';

@Component({
  selector: 'app-devops-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devops-assistant.component.html',
  styleUrl: './devops-assistant.component.css',
})
export class DevopsAssistantComponent {
  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content:
        "👋 Hello! I'm your AI DevOps Assistant. I can help you understand your system health.\n\nTry asking me:\n• \"Which API had the highest latency today?\"\n• \"Show anomalies detected this week\"\n• \"Explain today's API failures\"\n• \"Give me a status overview\"",
      timestamp: new Date(),
    },
  ];
  inputText = '';
  isLoading = false;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  sendMessage() {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;

    this.messages.push({
      role: 'user',
      content: text,
      timestamp: new Date(),
    });

    this.inputText = '';
    this.isLoading = true;
    this.cdr.detectChanges();
    this.scrollToBottom();

    this.apiService.askAi(text).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'assistant',
          content: response.answer,
          timestamp: new Date(response.timestamp),
        });
        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (err) => {
        this.messages.push({
          role: 'assistant',
          content: '❌ Sorry, I encountered an error processing your request. Please ensure the backend server is running.',
          timestamp: new Date(),
        });
        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatArea = document.querySelector('.chat-messages');
      if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
    }, 50);
  }

  formatContent(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
}
