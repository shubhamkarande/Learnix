import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, CourseProgress, Review } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();
  
  private progressSubject = new BehaviorSubject<{ [courseId: string]: CourseProgress }>({});
  public progress$ = this.progressSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a full-stack developer.',
        thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Web Development',
        level: 'Beginner',
        duration: '42 hours',
        rating: 4.8,
        totalRatings: 15420,
        price: 89.99,
        videoUrl: 'https://player.vimeo.com/video/76979871',
        enrolledStudents: 45230,
        tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
        instructor: {
          id: '1',
          name: 'Sarah Johnson',
          bio: 'Senior Full-Stack Developer with 8+ years of experience',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
          rating: 4.9,
          totalStudents: 125000,
          expertise: ['Web Development', 'JavaScript', 'React']
        },
        chapters: [
          {
            id: '1-1',
            title: 'Introduction to Web Development',
            description: 'Learn the basics of web development and set up your development environment',
            duration: '45 min',
            videoUrl: 'https://player.vimeo.com/video/76979871',
            completed: true,
            quiz: {
              id: '1-1-quiz',
              title: 'Web Development Basics',
              passingScore: 70,
              questions: [
                {
                  id: 'q1',
                  question: 'What does HTML stand for?',
                  options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
                  correctAnswer: 0,
                  explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.'
                }
              ]
            }
          },
          {
            id: '1-2',
            title: 'HTML Fundamentals',
            description: 'Master HTML elements, attributes, and semantic markup',
            duration: '90 min',
            videoUrl: 'https://player.vimeo.com/video/76979871',
            completed: false
          }
        ]
      },
      {
        id: '2',
        title: 'Data Science with Python',
        description: 'Master data analysis, visualization, and machine learning with Python, Pandas, NumPy, and Scikit-learn.',
        thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Data Science',
        level: 'Intermediate',
        duration: '38 hours',
        rating: 4.7,
        totalRatings: 8920,
        price: 79.99,
        videoUrl: 'https://player.vimeo.com/video/76979871',
        enrolledStudents: 23450,
        tags: ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20'),
        instructor: {
          id: '2',
          name: 'Dr. Michael Chen',
          bio: 'Data Scientist and ML Engineer with PhD in Computer Science',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
          rating: 4.8,
          totalStudents: 78000,
          expertise: ['Data Science', 'Machine Learning', 'Python']
        },
        chapters: [
          {
            id: '2-1',
            title: 'Python for Data Science',
            description: 'Introduction to Python libraries for data analysis',
            duration: '60 min',
            videoUrl: 'https://player.vimeo.com/video/76979871',
            completed: false
          }
        ]
      },
      {
        id: '3',
        title: 'UI/UX Design Masterclass',
        description: 'Learn user interface and user experience design principles, tools, and best practices for modern applications.',
        thumbnail: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Design',
        level: 'Beginner',
        duration: '25 hours',
        rating: 4.9,
        totalRatings: 12350,
        price: 69.99,
        videoUrl: 'https://player.vimeo.com/video/76979871',
        enrolledStudents: 34120,
        tags: ['UI Design', 'UX Design', 'Figma', 'Design Systems'],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-18'),
        instructor: {
          id: '3',
          name: 'Emma Rodriguez',
          bio: 'Senior UX Designer at tech startups and Fortune 500 companies',
          avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150',
          rating: 4.9,
          totalStudents: 89000,
          expertise: ['UI Design', 'UX Research', 'Design Systems']
        },
        chapters: [
          {
            id: '3-1',
            title: 'Design Fundamentals',
            description: 'Core principles of good design',
            duration: '40 min',
            videoUrl: 'https://player.vimeo.com/video/76979871',
            completed: false
          }
        ]
      }
    ];

    this.coursesSubject.next(mockCourses);

    // Mock progress data
    const mockProgress = {
      '1': {
        courseId: '1',
        completedChapters: ['1-1'],
        currentChapter: '1-2',
        progressPercentage: 25,
        quizScores: { '1-1': 85 },
        lastAccessed: new Date()
      }
    };

    this.progressSubject.next(mockProgress);
  }

  getCourses(): Observable<Course[]> {
    return this.courses$;
  }

  getCourse(id: string): Observable<Course | undefined> {
    return new Observable(observer => {
      const course = this.coursesSubject.value.find(c => c.id === id);
      observer.next(course);
      observer.complete();
    });
  }

  searchCourses(query: string, category?: string, level?: string): Observable<Course[]> {
    return new Observable(observer => {
      let filteredCourses = this.coursesSubject.value;

      if (query) {
        filteredCourses = filteredCourses.filter(course =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.description.toLowerCase().includes(query.toLowerCase()) ||
          course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
      }

      if (category) {
        filteredCourses = filteredCourses.filter(course => course.category === category);
      }

      if (level) {
        filteredCourses = filteredCourses.filter(course => course.level === level);
      }

      observer.next(filteredCourses);
      observer.complete();
    });
  }

  enrollInCourse(courseId: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        // Mock enrollment logic
        const currentProgress = this.progressSubject.value;
        if (!currentProgress[courseId]) {
          currentProgress[courseId] = {
            courseId,
            completedChapters: [],
            currentChapter: '',
            progressPercentage: 0,
            quizScores: {},
            lastAccessed: new Date()
          };
          this.progressSubject.next(currentProgress);
        }
        
        observer.next({ success: true, message: 'Successfully enrolled in course!' });
        observer.complete();
      }, 1000);
    });
  }

  getProgress(courseId: string): CourseProgress | null {
    return this.progressSubject.value[courseId] || null;
  }

  updateProgress(courseId: string, chapterId: string): void {
    const currentProgress = this.progressSubject.value;
    if (currentProgress[courseId]) {
      if (!currentProgress[courseId].completedChapters.includes(chapterId)) {
        currentProgress[courseId].completedChapters.push(chapterId);
      }
      currentProgress[courseId].lastAccessed = new Date();
      this.progressSubject.next(currentProgress);
    }
  }

  getReviews(courseId: string): Observable<Review[]> {
    return new Observable(observer => {
      const mockReviews: Review[] = [
        {
          id: '1',
          userId: '1',
          userName: 'Alex Thompson',
          userAvatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150',
          rating: 5,
          comment: 'Excellent course! The instructor explains complex concepts in a very clear and understandable way.',
          createdAt: new Date('2024-01-10')
        },
        {
          id: '2',
          userId: '2',
          userName: 'Jessica Lee',
          userAvatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150',
          rating: 4,
          comment: 'Great content and practical examples. Would definitely recommend to anyone starting their learning journey.',
          createdAt: new Date('2024-01-12')
        }
      ];
      
      observer.next(mockReviews);
      observer.complete();
    });
  }
}