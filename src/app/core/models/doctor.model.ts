export interface Doctor {
  id?: number;
  firstName: string;
  lastName: string;
  specialization: string;
  qualification: string;
  hospitalName: string;
  mobileNumber: string;
  consultingFee: number;
  gender: string;
  address: string;
  email: string;
  password?: string;
  status: string;
}
