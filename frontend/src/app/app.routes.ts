import { Routes } from '@angular/router';
import { authGuard, guestGuard, instructorGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Public routes
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'courses',
        loadComponent: () => import('./pages/courses/course-list/course-list.component').then(m => m.CourseListComponent)
    },
    {
        path: 'courses/:id',
        loadComponent: () => import('./pages/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
    },

    // Auth routes (guest only)
    {
        path: 'auth',
        canActivate: [guestGuard],
        children: [
            {
                path: 'login',
                loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },

    // Student dashboard
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/dashboard/student/student-dashboard.component').then(m => m.StudentDashboardComponent)
    },

    // Instructor routes
    {
        path: 'instructor',
        canActivate: [instructorGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/dashboard/instructor/instructor-dashboard.component').then(m => m.InstructorDashboardComponent)
            },
            {
                path: 'courses/new',
                loadComponent: () => import('./pages/dashboard/instructor/course-editor/course-editor.component').then(m => m.CourseEditorComponent)
            },
            {
                path: 'courses/:id/edit',
                loadComponent: () => import('./pages/dashboard/instructor/course-editor/course-editor.component').then(m => m.CourseEditorComponent)
            }
        ]
    },

    // Learning player
    {
        path: 'learn/:courseId/lesson/:lessonId',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/learn/lesson-player/lesson-player.component').then(m => m.LessonPlayerComponent)
    },

    // Payment routes
    {
        path: 'payment',
        children: [
            {
                path: 'success',
                loadComponent: () => import('./pages/payment/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent)
            },
            {
                path: 'cancel',
                loadComponent: () => import('./pages/payment/payment-cancel/payment-cancel.component').then(m => m.PaymentCancelComponent)
            }
        ]
    },

    // Admin routes
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/dashboard/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
    },

    // Fallback
    {
        path: '**',
        redirectTo: ''
    }
];
