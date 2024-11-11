import { Component } from '@angular/core';
import { FooterComponent } from "../../user/footer/footer.component";
import { ProgramComponent } from "../../user/program/program.component";
import { SidebarComponent } from "../../user/sidebar/sidebar.component";
import { HeaderAdminComponent } from "../header-admin/header-admin.component";

@Component({
  selector: 'app-program-admin',
  standalone: true,
  imports: [FooterComponent, SidebarComponent, HeaderAdminComponent, ProgramComponent],
  templateUrl: './program-admin.component.html',
  styleUrl: './program-admin.component.css'
})
export class ProgramAdminComponent {

}
