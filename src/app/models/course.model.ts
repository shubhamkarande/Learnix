export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  totalRatings: number;
  price: number;
  instructor: Instructor;
  chapters: Chapter[];
  videoUrl: string;
  enrolledStudents: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  rating: number;
  totalStudents: number;
  expertise: string[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface CourseProgress {
  courseId: string;
  completedChapters: string[];
  currentChapter: string;
  progressPercentage: number;
  quizScores: { [chapterId: string]: number };
  lastAccessed: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: Date;
}