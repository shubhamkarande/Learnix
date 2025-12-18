import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, AdminStats, User, PageResponse } from '../../../core/services/admin.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Manage users, courses, and platform settings</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div class="text-3xl font-bold text-primary-600">{{ stats()?.totalUsers || 0 }}</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Total Users</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div class="text-3xl font-bold text-green-600">{{ stats()?.totalCourses || 0 }}</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Total Courses</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div class="text-3xl font-bold text-accent-600">{{ stats()?.totalEnrollments || 0 }}</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Enrollments</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div class="text-3xl font-bold text-orange-600">{{ stats()?.completedEnrollments || 0 }}</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Completions</div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button (click)="activeTab.set('users')" 
            [class]="activeTab() === 'users' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'"
            class="pb-3 px-1 border-b-2 font-medium transition-colors">
            Users
          </button>
          <button (click)="activeTab.set('courses')"
            [class]="activeTab() === 'courses' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'"
            class="pb-3 px-1 border-b-2 font-medium transition-colors">
            Courses
          </button>
        </div>

        <!-- Users Table -->
        @if (activeTab() === 'users') {
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (user of users()?.content || []; track user.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-semibold text-sm">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </div>
                        <span class="font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600 dark:text-gray-400">{{ user.email }}</td>
                    <td class="px-6 py-4">
                      <select [value]="user.role" (change)="updateRole(user.id, $event)"
                        class="px-2 py-1 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-0">
                        <option value="STUDENT">Student</option>
                        <option value="INSTRUCTOR">Instructor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button (click)="deleteUser(user.id)" class="text-red-600 hover:text-red-700 text-sm font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- Courses Table -->
        @if (activeTab() === 'courses') {
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Course</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Instructor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (course of courses()?.content || []; track course.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td class="px-6 py-4">
                      <span class="font-medium text-gray-900 dark:text-white">{{ course.title }}</span>
                    </td>
                    <td class="px-6 py-4 text-gray-600 dark:text-gray-400">{{ course.instructor?.name || 'N/A' }}</td>
                    <td class="px-6 py-4">
                      <span [class]="course.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                        class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ course.published ? 'Published' : 'Draft' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right space-x-2">
                      <button (click)="togglePublish(course.id, !course.published)" 
                        class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        {{ course.published ? 'Unpublish' : 'Publish' }}
                      </button>
                      <button (click)="deleteCourse(course.id)" class="text-red-600 hover:text-red-700 text-sm font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
    private adminService = inject(AdminService);

    stats = signal<AdminStats | null>(null);
    users = signal<PageResponse<User> | null>(null);
    courses = signal<PageResponse<any> | null>(null);
    activeTab = signal<'users' | 'courses'>('users');

    ngOnInit(): void {
        this.loadStats();
        this.loadUsers();
        this.loadCourses();
    }

    private loadStats(): void {
        this.adminService.getStats().subscribe({
            next: (stats) => this.stats.set(stats),
            error: (err) => console.error('Error loading stats', err)
        });
    }

    private loadUsers(): void {
        this.adminService.getUsers().subscribe({
            next: (users) => this.users.set(users),
            error: (err) => console.error('Error loading users', err)
        });
    }

    private loadCourses(): void {
        this.adminService.getCourses().subscribe({
            next: (courses) => this.courses.set(courses),
            error: (err) => console.error('Error loading courses', err)
        });
    }

    updateRole(userId: string, event: Event): void {
        const role = (event.target as HTMLSelectElement).value;
        this.adminService.updateUserRole(userId, role).subscribe({
            next: () => this.loadUsers(),
            error: (err) => console.error('Error updating role', err)
        });
    }

    deleteUser(userId: string): void {
        if (confirm('Are you sure you want to delete this user?')) {
            this.adminService.deleteUser(userId).subscribe({
                next: () => this.loadUsers(),
                error: (err) => console.error('Error deleting user', err)
            });
        }
    }

    togglePublish(courseId: string, publish: boolean): void {
        this.adminService.approveCourse(courseId, publish).subscribe({
            next: () => this.loadCourses(),
            error: (err) => console.error('Error updating course', err)
        });
    }

    deleteCourse(courseId: string): void {
        if (confirm('Are you sure you want to delete this course?')) {
            this.adminService.deleteCourse(courseId).subscribe({
                next: () => this.loadCourses(),
                error: (err) => console.error('Error deleting course', err)
            });
        }
    }
}
