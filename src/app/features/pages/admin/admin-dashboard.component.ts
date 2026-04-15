import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { PatientService } from '../../../core/services/patient.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Doctor } from '../../../core/models/doctor.model';
import { Patient } from '../../../core/models/patient.model';
import { Appointment } from '../../../core/models/appointment.model';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatCardComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  appointments: Appointment[] = [];
  filteredDoctors: Doctor[] = [];
  selectedPatient: Patient | null = null;
  message = '';
  error = '';

  readonly doctorForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    specialization: ['', Validators.required],
    qualification: ['', Validators.required],
    hospitalName: ['City Hospital', Validators.required],
    mobileNumber: ['', Validators.required],
    consultingFee: [500, Validators.required],
    gender: ['Male', Validators.required],
    address: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    status: ['ACTIVE', Validators.required]
  });

  readonly patientForm = this.fb.group({
    patientName: ['', Validators.required],
    problem: ['', Validators.required],
    specialization: ['', Validators.required],
    mobileNumber: ['', Validators.required],
    address: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    gender: ['Male', Validators.required],
    issueDescription: ['', Validators.required],
    status: ['ACTIVE', Validators.required]
  });

  readonly appointmentForm = this.fb.group({
    patientId: [null as number | null, Validators.required],
    specialization: ['', Validators.required],
    doctorId: [null as number | null],
    issueDescription: ['', Validators.required],
    status: ['PENDING', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.doctorService.getAll().subscribe(data => {
      this.doctors = data;
      this.refreshDoctorMatches();
    });
    this.patientService.getAll().subscribe(data => {
      this.patients = data;
      this.syncSelectedPatient();
    });
    this.appointmentService.getAll().subscribe(data => this.appointments = data);
  }

  createDoctor(): void {
    if (this.doctorForm.invalid) return;
    this.clearAlerts();
    this.doctorService.create(this.doctorForm.getRawValue() as Doctor).subscribe({
      next: () => {
        this.message = 'Doctor created successfully. Login password saved for doctor access.';
        this.doctorForm.reset({ hospitalName: 'City Hospital', consultingFee: 500, gender: 'Male', password: '', status: 'ACTIVE' });
        this.loadAll();
      },
      error: () => this.error = 'Unable to create doctor. Please check backend and role access.'
    });
  }

  createPatient(): void {
    if (this.patientForm.invalid) return;
    this.clearAlerts();
    this.patientService.create(this.patientForm.getRawValue() as Patient).subscribe({
      next: () => {
        this.message = 'Patient created successfully. Login password saved for patient access.';
        this.patientForm.reset({ gender: 'Male', password: '', status: 'ACTIVE' });
        this.loadAll();
      },
      error: () => this.error = 'Unable to create patient. Please check backend and role access.'
    });
  }

  createAppointment(): void {
    if (this.appointmentForm.invalid) return;

    const patientId = this.appointmentForm.controls.patientId.value;
    const specialization = (this.appointmentForm.controls.specialization.value ?? '').trim();
    const issueDescription = (this.appointmentForm.controls.issueDescription.value ?? '').trim();
    const selectedDoctorId = this.appointmentForm.controls.doctorId.value;
    const selectedDoctor = this.filteredDoctors.find(item => item.id === Number(selectedDoctorId));

    if (!patientId || !specialization) {
      return;
    }

    const payload: Appointment = {
      patientId,
      specialization,
      issueDescription,
      status: this.appointmentForm.controls.status.value ?? 'PENDING'
    };

    if (selectedDoctor?.id) {
      payload.doctorId = selectedDoctor.id;
      payload.doctorName = `${selectedDoctor.firstName} ${selectedDoctor.lastName}`.trim();
    }

    this.clearAlerts();
    this.appointmentService.create(payload).subscribe({
      next: (appointment) => {
        const doctorLabel = appointment.doctorName ? ` Dr. ${appointment.doctorName}` : ' a matched doctor';
        this.message = `Appointment created successfully and linked to${doctorLabel}.`;
        this.appointmentForm.reset({ patientId: null, specialization: '', doctorId: null, issueDescription: '', status: 'PENDING' });
        this.selectedPatient = null;
        this.filteredDoctors = [];
        this.loadAll();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to create appointment. Check patient, specialization, JWT, and backend service.';
      }
    });
  }

  onPatientChange(): void {
    this.clearAlerts();
    const patientId = Number(this.appointmentForm.controls.patientId.value);
    this.selectedPatient = this.patients.find(item => item.id === patientId) ?? null;

    if (!this.selectedPatient) {
      this.filteredDoctors = [];
      this.appointmentForm.patchValue({ specialization: '', doctorId: null, issueDescription: '' });
      return;
    }

    this.appointmentForm.patchValue({
      specialization: this.selectedPatient.specialization,
      issueDescription: this.selectedPatient.issueDescription,
      doctorId: null
    });

    this.refreshDoctorMatches();
  }

  onSpecializationChange(): void {
    this.appointmentForm.patchValue({ doctorId: null });
    this.refreshDoctorMatches();
  }

  refreshDoctorMatches(): void {
    const specialization = (this.appointmentForm.controls.specialization.value ?? '').trim().toLowerCase();
    this.filteredDoctors = specialization
      ? this.doctors.filter(item => item.specialization?.trim().toLowerCase() === specialization && item.status?.toUpperCase() !== 'INACTIVE')
      : [];
  }

  deleteDoctor(id?: number): void {
    if (!id) return;
    this.doctorService.delete(id).subscribe(() => this.loadAll());
  }

  deletePatient(id?: number): void {
    if (!id) return;
    this.patientService.delete(id).subscribe(() => this.loadAll());
  }

  deleteAppointment(id?: number): void {
    if (!id) return;
    this.appointmentService.delete(id).subscribe(() => this.loadAll());
  }

  completedCount(): number {
    return this.appointments.filter(item => item.status?.toUpperCase() === 'COMPLETED').length;
  }

  pendingCount(): number {
    return this.appointments.filter(item => item.status?.toUpperCase() !== 'COMPLETED').length;
  }

  private syncSelectedPatient(): void {
    const patientId = Number(this.appointmentForm.controls.patientId.value);
    if (!patientId) {
      return;
    }
    this.selectedPatient = this.patients.find(item => item.id === patientId) ?? null;
  }

  private clearAlerts(): void {
    this.message = '';
    this.error = '';
  }
}
