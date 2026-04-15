import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="nav" *ngIf="user() as currentUser">
      <div class="container nav-inner">
        <div class="brand-wrap">
          <a routerLink="/dashboard" class="brand">HMS Portal</a>
          <span class="brand-subtitle">Care management workspace</span>
        </div>

        <nav class="links">
          <a routerLink="/dashboard">Dashboard</a>
          <a *ngIf="currentUser.role === 'ADMIN'" routerLink="/admin">Workspace</a>
          <a *ngIf="currentUser.role === 'DOCTOR'" routerLink="/doctor">Workspace</a>
          <a *ngIf="currentUser.role === 'PATIENT'" routerLink="/patient">Workspace</a>
        </nav>

        <div class="actions">
          <span class="user-chip">{{ currentUser.email }} <span class="user-role">({{ currentUser.role }})</span></span>
          <button class="btn btn-secondary" (click)="logout()">Logout</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .nav { background: rgba(255,255,255,.94); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(10px); }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 18px; min-height: 76px; }
    .brand-wrap { display: flex; flex-direction: column; gap: 4px; }
    .brand { font-weight: 800; color: var(--primary-dark); font-size: 22px; letter-spacing: -.02em; }
    .brand-subtitle { color: var(--muted); font-size: 12px; font-weight: 600; }
    .links, .actions { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .links a { color: var(--muted); font-weight: 700; padding: 10px 14px; border-radius: 999px; }
    .links a:hover { background: #eff6ff; color: var(--primary); }
    .user-chip { background: linear-gradient(135deg, #eff6ff, #eef2ff); color: var(--primary-dark); padding: 10px 14px; border-radius: 999px; font-weight: 700; font-size: 13px; }
    .user-role { color: var(--primary); }
    @media (max-width: 900px) {
      .nav-inner { padding: 10px 0; align-items: flex-start; }
      .links { width: 100%; order: 3; }
      .actions { margin-left: auto; }
    }
  `]
})
export class NavbarComponent {
  readonly user = computed(() => this.auth.currentUser());

  constructor(private auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
