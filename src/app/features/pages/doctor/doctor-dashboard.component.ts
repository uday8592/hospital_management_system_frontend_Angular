import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment } from '../../../core/models/appointment.model';
import { Patient } from '../../../core/models/patient.model';
import { Doctor } from '../../../core/models/doctor.model';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatCardComponent],
  templateUrl: './doctor-dashboard.component.html'
})
export class DoctorDashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);

  doctorId: number | null = null;
  doctorProfile: Doctor | null = null;
  appointments: Appointment[] = [];
  patients: Patient[] = [];
  message = '';
  error = '';
  loading = false;

  readonly doctorLabel = computed(() => {
    if (!this.doctorProfile) return this.auth.currentUser()?.email ?? 'Doctor';
    return `${this.doctorProfile.firstName} ${this.doctorProfile.lastName}`.trim();
  });

  readonly updateForm = this.fb.group({
    appointmentId: [null as number | null, [Validators.required, Validators.min(1)]],
    status: ['COMPLETED', Validators.required],
    doctorComments: ['', Validators.required],
    issueDescription: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadOwnDoctorData();
  }

  loadOwnDoctorData(): void {
    const email = this.auth.currentUser()?.email;
    if (!email) {
      this.error = 'Doctor session not found. Please login again.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.doctorService.getByEmail(email).subscribe({
      next: doctor => {
        this.doctorProfile = doctor;
        this.doctorId = doctor.id ?? null;
        this.loadDoctorData();
      },
      error: () => {
        this.loading = false;
        this.error = 'Doctor profile is not available. Ask admin to create your profile first.';
      }
    });
  }

  loadDoctorData(): void {
    if (!this.doctorId) {
      this.loading = false;
      return;
    }

    this.doctorService.getAppointments(this.doctorId).subscribe({
      next: data => {
        this.appointments = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load appointments for this doctor.';
      }
    });

    this.doctorService.getPatients(this.doctorId).subscribe({
      next: data => this.patients = data,
      error: () => this.error = 'Unable to load assigned patients for this doctor.'
    });
  }

  updateAppointment(): void {
    if (this.updateForm.invalid || !this.doctorId) return;
    const appointmentId = Number(this.updateForm.value.appointmentId);
    this.doctorService.updateAppointment(this.doctorId, appointmentId, {
      patientId: 0,
      status: this.updateForm.value.status!,
      doctorComments: this.updateForm.value.doctorComments!,
      issueDescription: this.updateForm.value.issueDescription!
    }).subscribe({
      next: () => {
        this.message = 'Appointment updated. Status is reflected in all dashboards.';
        this.error = '';
        this.loadDoctorData();
      },
      error: () => {
        this.error = 'Unable to update appointment.';
        this.message = '';
      }
    });
  }

  completedCount(): number {
    return this.appointments.filter(item => item.status === 'COMPLETED').length;
  }
}
