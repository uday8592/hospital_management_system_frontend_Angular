import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PATIENT_API_URL } from './api-config';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${PATIENT_API_URL}/patients`);
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${PATIENT_API_URL}/patients/${id}`);
  }

  create(payload: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${PATIENT_API_URL}/patients`, payload);
  }

  update(id: number, payload: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${PATIENT_API_URL}/patients/${id}`, payload);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${PATIENT_API_URL}/patients/${id}`, { responseType: 'text' });
  }
}
