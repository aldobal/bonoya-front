import { Routes } from '@angular/router';
import { AuthGuard } from './core/infrastructure/guards/auth.guard';
import { EmisorGuard } from './core/infrastructure/guards/emisor.guard';
import { InversorGuard } from './core/infrastructure/guards/inversor.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./iam/views/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./iam/views/pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/views/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'emisor',
    canActivate: [AuthGuard, EmisorGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./emisor/views/pages/emisor-dashboard/emisor-dashboard.component').then(m => m.EmisorDashboardComponent)
      },
      {
        path: 'bonos',
        loadComponent: () => import('./emisor/views/pages/mis-bonos/mis-bonos.component').then(m => m.MisBonosComponent)
      },
      {
        path: 'bonos/nuevo',
        loadComponent: () => import('./emisor/views/pages/crear-bono/crear-bono.component').then(m => m.CrearBonoComponent)
      },
      {
        path: 'bonos/:id/editar',
        loadComponent: () => import('./emisor/views/pages/editar-bono/editar-bono.component').then(m => m.EditarBonoComponent)
      },
      {
        path: 'bonos/:id/detalle',
        loadComponent: () => import('./emisor/views/pages/detalle-bono/detalle-bono-emisor.component').then(m => m.DetalleBonoEmisorComponent)
      },
      {
        path: 'bonos/:id/flujo',
        loadComponent: () => import('./emisor/views/pages/flujo-caja-bono/flujo-caja-bono.component').then(m => m.FlujoCajaBonoComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'inversor',
    canActivate: [AuthGuard, InversorGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./inversor/views/pages/inversor-dashboard/inversor-dashboard.component').then(m => m.InversorDashboardComponent)
      },
      {
        path: 'catalogo',
        loadComponent: () => import('./inversor/views/pages/catalogo-bonos/catalogo-bonos.component').then(m => m.CatalogoBonosComponent)
      },
      {
        path: 'detalle-bono/:id',
        loadComponent: () => import('./inversor/views/pages/detalle-bono/detalle-bono.component').then(m => m.DetalleBonoComponent)
      },
      {
        path: 'mis-calculos',
        loadComponent: () => import('./inversor/views/pages/mis-calculos/mis-calculos.component').then(m => m.MisCalculosComponent)
      },
      {
        path: 'calcular-flujo/:id',
        loadComponent: () => import('./inversor/views/pages/calcular-flujo/calcular-flujo.component').then(m => m.CalcularFlujoComponent)
      },
      {
        path: 'historial',
        loadComponent: () => import('./inversor/views/pages/historial-analisis/historial-analisis.component').then(m => m.HistorialAnalisisComponent)
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
    redirectTo: '/login'
  }
];
