import { Routes } from '@angular/router';
import { AboutAdminComponent } from './components/admin/about-admin/about-admin.component';
import { CourseAdminComponent } from './components/admin/course-admin/course-admin.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { FacultyAdminComponent } from './components/admin/faculty-admin/faculty-admin.component';
import { HeaderAdminComponent } from './components/admin/header-admin/header-admin.component';
import { ProgramAdminComponent } from './components/admin/program-admin/program-admin.component';
import { SidebarAdminComponent } from './components/admin/sidebar-admin/sidebar-admin.component';
import { LoginComponent } from './components/logIn&Reg/login/login.component';
import { RegisterComponent } from './components/logIn&Reg/register/register.component';
import { AboutComponent } from './components/user/about/about.component';
import { BotComponent } from './components/user/bot/bot.component';
import { FacultyComponent } from './components/user/faculty/faculty.component';
import { HomeComponent } from './components/user/home/home.component';
import { ProgramComponent } from './components/user/program/program.component';
import { AuthGuard } from './guardAuth/auth.guard';

export const routes: Routes = [
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { isAdminRoute: true } },
  {path:'admin/program-admin', component: ProgramAdminComponent, canActivate: [AuthGuard], data: { isAdminRoute: true}},
  {path:'admin/faculty-admin', component: FacultyAdminComponent, canActivate: [AuthGuard], data: { isAdminRoute: true}},
  {path: 'admin/sidebar-admin', component: SidebarAdminComponent, canActivate: [AuthGuard], data: { isAdminRoute: true } },
  {path:'admin/header-admin', component: HeaderAdminComponent, canActivate: [AuthGuard], data: { isAdminRoute: true}},
  {path:'admin/course-admin', component: CourseAdminComponent, canActivate: [AuthGuard], data: { isAdminRoute: true}},
  {path:'admin/about-admin', component: AboutAdminComponent, canActivate: [AuthGuard], data: { isAdminRoute: true}},

  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 

  {path: 'program', component: ProgramComponent, canActivate:[AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'zonar', component: BotComponent, canActivate: [AuthGuard] },
  { path: 'faculties', component: FacultyComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }


];
