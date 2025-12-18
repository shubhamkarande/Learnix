import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    router.navigate(['/auth/login']);
    return false;
};

export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    // Redirect to appropriate dashboard based on role
    const user = authService.user();
    if (user?.role === 'ADMIN') {
        router.navigate(['/admin']);
    } else if (user?.role === 'INSTRUCTOR') {
        router.navigate(['/instructor']);
    } else {
        router.navigate(['/dashboard']);
    }
    return false;
};

export const instructorGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isInstructor() || authService.isAdmin()) {
        return true;
    }

    router.navigate(['/']);
    return false;
};

export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAdmin()) {
        return true;
    }

    router.navigate(['/']);
    return false;
};
