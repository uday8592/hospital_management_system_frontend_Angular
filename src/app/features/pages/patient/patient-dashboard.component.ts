import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Patient } from '../../../core/models/patient.model';
import { Appointment } from '../../../core/models/appointment.model';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatCardComponent],
  templateUrl: './patient-dashboard.component.html'
})
export class PatientDashboardComponent {
  patientId?: number;
  appointments: Appointment[] = [];
  message = '';

  readonly patientForm = this.fb.group({
    patientName: ['', Validators.required],
    problem: ['', Validators.required],
    specialization: ['', Validators.required],
    mobileNumber: ['', Validators.required],
    address: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gender: ['Male', Validators.required],
    issueDescription: ['', Validators.required],
    status: ['ACTIVE', Validators.required]
  });

  readonly appointmentForm = this.fb.group({
    patientId: [1, [Validators.required, Validators.min(1)]],
    status: ['PENDING', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) {}

  createPatientProfile(): void {
    if (this.patientForm.invalid) return;
    this.patientService.create(this.patientForm.getRawValue() as Patient).subscribe(patient => {
      this.patientId = patient.id;
      this.message = `Patient profile created with ID ${patient.id}.`;
      this.appointmentForm.patchValue({ patientId: patient.id ?? 1 });
      this.loadAppointments();
    });
  }

  bookAppointment(): void {
    if (this.appointmentForm.invalid) return;
    const payload: Appointment = {
      patientId: Number(this.appointmentForm.value.patientId),
      status: this.appointmentForm.value.status ?? 'PENDING'
    };
    this.appointmentService.create(payload).subscribe(appointment => {
      this.message = `Appointment created and auto-assigned to ${appointment.doctorName}.`;
      this.patientId = payload.patientId;
      this.loadAppointments();
    });
  }

  loadAppointments(): void {
    const id = this.patientId ?? Number(this.appointmentForm.value.patientId);
    if (!id) return;
    this.patientId = id;
    this.appointmentService.getByPatient(id).subscribe(data => this.appointments = data);
  }

  completedCount(): number {
    return this.appointments.filter(item => item.status === 'COMPLETED').length;
  }
}
