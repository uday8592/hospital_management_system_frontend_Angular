# HMS Angular Frontend

This Angular UI is created for your Hospital Management System microservices backend.

## Included screens
- Login
- Register
- Admin dashboard
- Doctor dashboard
- Patient dashboard

## Backend mapping
- Auth: `http://localhost:8080/auth`
- Doctors: `http://localhost:8080/doctors`
- Patients: `http://localhost:8080/patients`
- Appointments: `http://localhost:8080/appointments`

## Important flow
- Patient creates profile
- Patient books appointment using only `patientId`
- Backend auto assigns doctor based on specialization
- Doctor loads appointments and same-specialization patients
- Doctor updates appointment to `COMPLETED`
- Admin and patient dashboards show same updated status

## Run steps
```bash
npm install
npm start
```

Then open:
```bash
http://localhost:4200
```

## Notes
- API base URL is set in `src/app/core/services/api-config.ts`
- Frontend expects your API Gateway on port `8080`
- Role-based routes are enabled for ADMIN, DOCTOR, and PATIENT
