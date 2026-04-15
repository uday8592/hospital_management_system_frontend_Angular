import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-shell">
      <div class="card auth-card">
        <div class="auth-side">
          <h1>Hospital Management UI</h1>
          <p>Angular frontend for your microservices backend with separate dashboards for admin, doctor, and patient.</p>
        </div>
        <div class="auth-form">
          <h2>Login</h2>
          <p class="page-subtitle">Use the account created in auth-service.</p>
          <div class="alert error" *ngIf="error">{{ error }}</div>
          <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
            <label>
              Email
              <input type="email" formControlName="email" />
            </label>
            <label>
              Password
              <input type="password" formControlName="password" />
            </label>
            <button class="btn btn-primary" type="submit" [disabled]="form.invalid || loading">
              {{ loading ? 'Signing in...' : 'Login' }}
            </button>
          </form>
          <p style="margin-top: 18px; color: var(--muted);">
            New user? <a routerLink="/register" style="color: var(--primary); font-weight: 700;">Create account</a>
          </p>
        </div>
      </div>
    </section>
  `
})
export class LoginComponent {
  loading = false;
  error = '';
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.getRawValue() as { email: string; password: string; }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid credentials or backend is not running.';
      }
    });
  }
}
