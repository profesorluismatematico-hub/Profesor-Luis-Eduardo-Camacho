
export type Gender = 'Masculino' | 'Femenino' | 'Otro';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: string; // Cédula
  age: number;
  gender: Gender;
  email: string;
  attendanceRate: number; // Percentage 0-100
  placeOfBirth: string;
  grade: number; // Scale 0-10 or 0-100
}

export interface ClassStats {
  averageGrade: number;
  averageAttendance: number;
  totalStudents: number;
  genderDistribution: { name: string; value: number }[];
}
