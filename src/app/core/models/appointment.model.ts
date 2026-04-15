export interface Appointment {
  id?: number;
  patientId: number;
  doctorId?: number;
  patientName?: string;
  doctorName?: string;
  specialization?: string;
  patientProblem?: string;
  mobileNumber?: string;
  address?: string;
  emailId?: string;
  gender?: string;
  issueDescription?: string;
  doctorComments?: string;
  status: string;
}
