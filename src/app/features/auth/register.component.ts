import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="auth-shell">
      <div class="card auth-card">
        <div class="auth-side">
          <h1>Profile creation is handled by admin</h1>
          <p>Doctors and patients cannot self-register in this HMS setup. The admin creates your profile and sets your login password.</p>
        </div>
        <div class="auth-form">
          <h2>Contact admin</h2>
          <div class="alert error" style="display:block;">
            Registration is disabled. Please contact admin to create your doctor or patient profile and share your login credentials.
          </div>
          <p class="page-subtitle" style="margin-top: 14px;">
            Once the admin creates your account, use the same email and password on the login page.
          </p>
          <div class="form-actions" style="margin-top: 20px;">
            <a routerLink="/login" class="btn btn-primary">Back to login</a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class RegisterComponent {}
