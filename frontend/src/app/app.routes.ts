import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'signup',
        loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
    },
    {
        path: '',
        loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'expenses',
                loadComponent: () => import('./features/expenses/expenses.component').then(m => m.ExpensesComponent)
            },
            {
                path: 'expenses/new',
                loadComponent: () => import('./features/expenses/create-expense/create-expense.component').then(m => m.CreateExpenseComponent)
            },
            {
                path: 'payments',
                loadComponent: () => import('./features/payments/payments.component').then(m => m.PaymentsComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
