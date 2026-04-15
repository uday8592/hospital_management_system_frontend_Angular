import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="container" style="padding: 28px 0;">
      <h1 class="page-title">Welcome to HMS Dashboard</h1>
      <p class="page-subtitle">Logged in as {{ role() }}. Open the dashboard section that matches your role.</p>

      <div class="grid grid-3">
        <a class="card" routerLink="/admin" *ngIf="role() === 'ADMIN'">
          <h3>Admin Dashboard</h3>
          <p>Manage doctors, patients, and all appointments.</p>
        </a>
        <a class="card" routerLink="/doctor" *ngIf="role() === 'DOCTOR'">
          <h3>Doctor Dashboard</h3>
          <p>Check appointments, update status, and view same-specialization patients.</p>
        </a>
        <a class="card" routerLink="/patient" *ngIf="role() === 'PATIENT'">
          <h3>Patient Dashboard</h3>
          <p>Create profile and book auto-assigned appointments.</p>
        </a>
      </div>
    </section>
  `
})
export class DashboardHomeComponent {
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'Guest');
  constructor(private auth: AuthService) {}
}
