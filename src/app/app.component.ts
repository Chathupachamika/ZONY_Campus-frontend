import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScheduleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'health';
}
