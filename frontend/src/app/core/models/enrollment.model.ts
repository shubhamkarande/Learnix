export interface Enrollment {
    id: string;
    courseId: string;
    courseTitle: string;
    courseThumbnailUrl?: string;
    instructorName: string;
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
    completed: boolean;
    enrolledAt: string;
    completedAt?: string;
    lastAccessedAt?: string;
    certificateUrl?: string;
    certificateId?: string;
    nextLessonId?: string;
    nextLessonTitle?: string;
}

export interface ProgressUpdate {
    watchedSeconds: number;
    progressPercentage: number;
    completed: boolean;
}
