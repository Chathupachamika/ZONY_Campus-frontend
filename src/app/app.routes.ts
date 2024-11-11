import { Routes } from '@angular/router';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProgramAdminComponent } from './components/admin/program-admin/program-admin.component';
import { LoginComponent } from './components/logIn&Reg/login/login.component';
import { RegisterComponent } from './components/logIn&Reg/register/register.component';
import { AboutComponent } from './components/user/about/about.component';
import { HomeComponent } from './components/user/dashboard/home.component';
import { FacultyComponent } from './components/user/faculty/faculty.component';
import { ProgramComponent } from './components/user/program/program.component';
import { AuthGuard } from './guardAuth/auth.guard';

export const routes: Routes = [
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { isAdminRoute: true } },
  {path:'admin/program-main', component: ProgramAdminComponent, canActivate: [AuthGuard], data: { isAdminRoute: true}},
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 

  {path: 'program', component: ProgramComponent, canActivate:[AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'faculties', component: FacultyComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' } 

];
