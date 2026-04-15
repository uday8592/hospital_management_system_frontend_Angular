import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOCTOR_API_URL } from './api-config';
import { Doctor } from '../models/doctor.model';
import { Appointment } from '../models/appointment.model';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${DOCTOR_API_URL}/doctors`);
  }

  getBySpecialization(specialization: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${DOCTOR_API_URL}/doctors/specialization/${encodeURIComponent(specialization)}`);
  }

  getByEmail(email: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${DOCTOR_API_URL}/doctors/email/${encodeURIComponent(email)}`);
  }

  create(payload: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${DOCTOR_API_URL}/doctors`, payload);
  }

  update(id: number, payload: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${DOCTOR_API_URL}/doctors/${id}`, payload);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${DOCTOR_API_URL}/doctors/${id}`, { responseType: 'text' });
  }

  getAppointments(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${DOCTOR_API_URL}/doctors/${doctorId}/appointments`);
  }

  getPatients(doctorId: number): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${DOCTOR_API_URL}/doctors/${doctorId}/patients`);
  }

  updateAppointment(doctorId: number, appointmentId: number, payload: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${DOCTOR_API_URL}/doctors/${doctorId}/appointments/${appointmentId}`, payload);
  }
}
