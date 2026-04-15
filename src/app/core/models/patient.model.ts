export interface Patient {
  id?: number;
  patientName: string;
  problem: string;
  specialization: string;
  mobileNumber: string;
  address: string;
  email: string;
  password?: string;
  gender: string;
  issueDescription: string;
  status: string;
}
