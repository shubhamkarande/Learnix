import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'courses',
    loadComponent: () => import('./pages/courses/course-list/course-list.component').then(m => m.CourseListComponent)
  },
  {
    path: 'course/:id',
    loadComponent: () => import('./pages/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'learn/:id',
    loadComponent: () => import('./pages/learn/learn.component').then(m => m.LearnComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'quiz/:courseId/:chapterId',
    loadComponent: () => import('./pages/quiz/quiz.component').then(m => m.QuizComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];