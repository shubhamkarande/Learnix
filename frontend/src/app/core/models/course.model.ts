export interface Course {
    id: string;
    title: string;
    description?: string;
    shortDescription?: string;
    price: number;
    thumbnailUrl?: string;
    category?: string;
    level?: string;
    language?: string;
    published: boolean;
    approved: boolean;
    totalLessons: number;
    totalDurationMinutes: number;
    averageRating: number;
    totalRatings: number;
    totalEnrollments: number;
    createdAt: string;
    updatedAt: string;
    instructor: Instructor;
    modules?: Module[];
    lessons?: Lesson[];
    enrolled?: boolean;
    progressPercentage?: number;
}

export interface Instructor {
    id: string;
    name: string;
    avatarUrl?: string;
    headline?: string;
    bio?: string;
}

export interface Module {
    id: string;
    title: string;
    description?: string;
    orderIndex: number;
    lessons: Lesson[];
}

export interface Lesson {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string;
    durationSeconds: number;
    orderIndex: number;
    previewable: boolean;
    completed?: boolean;
    watchedSeconds?: number;
}

export interface CourseRequest {
    title: string;
    description?: string;
    shortDescription?: string;
    price: number;
    thumbnailUrl?: string;
    category?: string;
    level?: string;
    language?: string;
    published?: boolean;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}
