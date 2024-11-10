import { Routes } from '@angular/router';
import { AboutComponent } from './components/Home/about/about.component';
import { FacultyComponent } from './components/Home/faculty/faculty.component';
import { HomeComponent } from './components/Home/home/home.component';
import { ProgramComponent } from './components/Home/program/program.component';
import { LoginComponent } from './components/logIn&Reg/login/login.component';
import { RegisterComponent } from './components/logIn&Reg/register/register.component';
import { AuthGuard } from './guardAuth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 

  {path: 'program', component: ProgramComponent, canActivate:[AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'faculties', component: FacultyComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' } 

];
