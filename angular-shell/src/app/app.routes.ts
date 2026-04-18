import { Routes } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { ShellComponent } from './shell/shell.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { AnalyticsComponent } from './analytics/analytics.component'
import { VueWrapperComponent } from './vue-wrapper/vue-wrapper.component'
import { authGuard } from './auth.guard'

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'products', component: VueWrapperComponent, data: { remote: 'vue', page: 'Products' } },
      { path: 'settings', component: VueWrapperComponent, data: { remote: 'vue', page: 'Settings' } },
    ],
  },
  { path: '**', redirectTo: 'login' },
]
