export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: Date;
  enrolledCourses: string[];
  completedCourses: string[];
  totalLearningHours: number;
  certificates: Certificate[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  issuedDate: Date;
  certificateUrl: string;
}

export interface AuthUser {
  email: string;
  password: string;
  name?: string;
}