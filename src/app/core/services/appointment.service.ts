import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APPOINTMENT_API_URL } from './api-config';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${APPOINTMENT_API_URL}/appointments`);
  }

  getByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${APPOINTMENT_API_URL}/appointments/patient/${patientId}`);
  }

  create(payload: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${APPOINTMENT_API_URL}/appointments`, payload);
  }

  update(id: number, payload: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${APPOINTMENT_API_URL}/appointments/${id}`, payload);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${APPOINTMENT_API_URL}/appointments/${id}`, { responseType: 'text' });
  }
}
