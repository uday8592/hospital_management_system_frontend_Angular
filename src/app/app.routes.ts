import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { DashboardHomeComponent } from './features/pages/dashboard.component';
import { AdminDashboardComponent } from './features/pages/admin/admin-dashboard.component';
import { DoctorDashboardComponent } from './features/pages/doctor/doctor-dashboard.component';
import { PatientDashboardComponent } from './features/pages/patient/patient-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardHomeComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] } },
  { path: 'doctor', component: DoctorDashboardComponent, canActivate: [authGuard, roleGuard], data: { roles: ['DOCTOR'] } },
  { path: 'patient', component: PatientDashboardComponent, canActivate: [authGuard, roleGuard], data: { roles: ['PATIENT'] } },
  { path: '**', redirectTo: 'login' }
];
