import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core'
import { Router, RouterOutlet, NavigationEnd } from '@angular/router'
import { CommonModule } from '@angular/common'
import { SharedStateService } from '../shared/shared-state.service'
import { filter } from 'rxjs/operators'

interface NavItem {
  path: string
  label: string
  icon: string
  badge?: string
  type: 'angular' | 'vue'
}

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet],
  host: { '(document:click)': 'onDocClick($event)' },
  template: `
    <div class="flex min-h-screen font-['Plus_Jakarta_Sans',system-ui,sans-serif] bg-slate-50">
      <!-- SIDEBAR -->
      <aside
        [class]="sidebarCollapsed
          ? 'w-[72px] min-h-screen bg-[#0a0f1e] flex flex-col flex-shrink-0 transition-[width] duration-200 ease-in-out sticky top-0 h-screen overflow-hidden'
          : 'w-64 min-h-screen bg-[#0a0f1e] flex flex-col flex-shrink-0 transition-[width] duration-200 ease-in-out sticky top-0 h-screen overflow-hidden'"
      >
        <!-- Brand -->
        <div [class]="sidebarCollapsed
          ? 'flex flex-col items-center gap-2 px-2 py-4 border-b border-white/[0.07]'
          : 'flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.07]'">
          <div class="text-2xl text-violet-600 shrink-0 w-9 h-9 flex items-center justify-center">⬡</div>
          <div class="flex-1 min-w-0" *ngIf="!sidebarCollapsed">
            <span class="block font-extrabold text-white text-[15px]">MFE Platform</span>
            <span class="text-[11px] text-slate-600">v1.0.0</span>
          </div>
          <button
            class="bg-white/[0.07] border-none text-slate-400 cursor-pointer rounded-md w-[26px] h-[26px] flex items-center justify-center text-xs shrink-0"
            (click)="sidebarCollapsed = !sidebarCollapsed"
          >
            {{ sidebarCollapsed ? '→' : '←' }}
          </button>
        </div>

        <!-- User -->
        <div class="flex items-center gap-2.5 px-4 py-3.5 border-b border-white/[0.07]" *ngIf="!sidebarCollapsed">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">{{ user?.name?.[0] || 'U' }}</div>
          <div>
            <span class="block text-[13px] font-semibold text-white">{{ user?.name }}</span>
            <span class="text-[11px] text-slate-500">{{ user?.role }}</span>
          </div>
        </div>
        <div class="flex justify-center px-4 py-3.5 border-b border-white/[0.07]" *ngIf="sidebarCollapsed">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">{{ user?.name?.[0] || 'U' }}</div>
        </div>

        <!-- Nav -->
        <nav class="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          <div class="text-[10px] font-bold tracking-widest uppercase text-slate-700 px-2 pt-2 pb-1 mt-1" *ngIf="!sidebarCollapsed">Angular</div>
          <a
            *ngFor="let item of angularItems"
            [class]="isActive(item.path)
              ? 'flex items-center gap-3 px-3 py-[0.65rem] rounded-[9px] cursor-pointer no-underline text-violet-400 text-sm font-medium transition-all duration-150 relative whitespace-nowrap bg-violet-600/20'
              : 'flex items-center gap-3 px-3 py-[0.65rem] rounded-[9px] cursor-pointer no-underline text-slate-500 text-sm font-medium transition-all duration-150 relative whitespace-nowrap hover:bg-white/[0.06] hover:text-slate-200'"
            (click)="navigate(item.path)"
          >
            <span class="text-base w-5 shrink-0 text-center">{{ item.icon }}</span>
            <span class="flex-1" *ngIf="!sidebarCollapsed">{{ item.label }}</span>
            <span class="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[10px]" *ngIf="item.badge && !sidebarCollapsed">{{ item.badge }}</span>
            <div class="w-1.5 h-1.5 rounded-full shrink-0 bg-red-400" *ngIf="!sidebarCollapsed"></div>
          </a>

          <div class="h-px bg-white/[0.07] my-3"></div>

          <div class="text-[10px] font-bold tracking-widest uppercase text-slate-700 px-2 pt-2 pb-1 mt-1" *ngIf="!sidebarCollapsed">Vue (MFE Remote)</div>
          <a
            *ngFor="let item of vueItems"
            [class]="isActive(item.path)
              ? 'flex items-center gap-3 px-3 py-[0.65rem] rounded-[9px] cursor-pointer no-underline text-violet-400 text-sm font-medium transition-all duration-150 relative whitespace-nowrap bg-violet-600/20'
              : 'flex items-center gap-3 px-3 py-[0.65rem] rounded-[9px] cursor-pointer no-underline text-slate-500 text-sm font-medium transition-all duration-150 relative whitespace-nowrap hover:bg-white/[0.06] hover:text-slate-200'"
            (click)="navigate(item.path)"
          >
            <span class="text-base w-5 shrink-0 text-center">{{ item.icon }}</span>
            <span class="flex-1" *ngIf="!sidebarCollapsed">{{ item.label }}</span>
            <span class="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[10px]" *ngIf="item.badge && !sidebarCollapsed">{{ item.badge }}</span>
            <div class="w-1.5 h-1.5 rounded-full shrink-0 bg-green-400" *ngIf="!sidebarCollapsed"></div>
          </a>
        </nav>

        <!-- Footer -->
        <div class="p-3 border-t border-white/[0.07]">
          <button
            class="flex items-center gap-3 px-3 py-[0.65rem] w-full border-none bg-transparent text-slate-500 cursor-pointer rounded-[9px] text-sm font-['inherit'] transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
            (click)="logout()"
          >
            <span>🚪</span>
            <span *ngIf="!sidebarCollapsed">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="flex-1 flex flex-col min-w-0">
        <!-- Topbar -->
        <header class="flex items-center justify-between px-7 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
          <div>
            <h2 class="text-[1.1rem] font-bold text-[#0a0f1e] mb-0.5">{{ currentPageTitle }}</h2>
            <div class="flex gap-1.5 text-xs text-slate-400">
              <span>MFE Platform</span>
              <span>›</span>
              <span class="text-violet-600 font-semibold">{{ currentPageTitle }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div
              [class]="isVuePage
                ? 'px-3 py-[5px] rounded-[20px] text-xs font-bold bg-green-50 text-green-600 border border-green-200'
                : 'px-3 py-[5px] rounded-[20px] text-xs font-bold bg-red-50 text-red-600 border border-red-200'"
            >
              {{ isVuePage ? '🟢 Vue MFE' : '🔴 Angular' }}
            </div>

            <!-- Notifications dropdown -->
            <div class="relative">
              <button class="bg-slate-50 border border-slate-100 rounded-lg w-9 h-9 flex items-center justify-center cursor-pointer text-sm hover:bg-slate-100 transition-colors"
                (click)="showNotifications = !showNotifications; showUserMenu = false">
                🔔
                <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
              </button>
              <div *ngIf="showNotifications" class="absolute right-0 top-11 w-80 bg-white rounded-xl border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-50">
                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span class="text-sm font-bold text-[#0a0f1e]">Notificaciones</span>
                  <span class="text-xs text-violet-600 cursor-pointer hover:underline">Marcar todo leído</span>
                </div>
                <div class="max-h-72 overflow-y-auto">
                  <div *ngFor="let notif of notifications"
                    class="flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                      [class]="notif.type === 'order' ? 'bg-blue-100' : notif.type === 'alert' ? 'bg-amber-100' : 'bg-green-100'">
                      {{ notif.icon }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[13px] text-[#0a0f1e] m-0 leading-snug">{{ notif.text }}</p>
                      <span class="text-[11px] text-slate-400">{{ notif.time }}</span>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-2.5 border-t border-slate-100 text-center">
                  <span class="text-xs text-violet-600 cursor-pointer hover:underline font-medium">Ver todas las notificaciones</span>
                </div>
              </div>
            </div>

            <!-- User dropdown -->
            <div class="relative">
              <button class="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-100 transition-colors"
                (click)="showUserMenu = !showUserMenu; showNotifications = false">
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center">{{ user?.name?.[0] || 'U' }}</div>
                <span class="text-sm font-medium text-[#0a0f1e] max-w-[120px] truncate">{{ user?.name || 'Usuario' }}</span>
                <svg class="w-3.5 h-3.5 text-slate-400 transition-transform" [class.rotate-180]="showUserMenu" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
              </button>
              <div *ngIf="showUserMenu" class="absolute right-0 top-11 w-56 bg-white rounded-xl border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-50 py-1">
                <div class="px-4 py-3 border-b border-slate-100">
                  <p class="text-sm font-semibold text-[#0a0f1e] m-0">{{ user?.name }}</p>
                  <p class="text-xs text-slate-400 m-0 mt-0.5">{{ user?.email }}</p>
                </div>
                <a class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors no-underline" (click)="navigate('/settings'); showUserMenu = false">
                  <span>👤</span> Mi Perfil
                </a>
                <a class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors no-underline" (click)="navigate('/settings'); showUserMenu = false">
                  <span>⚙️</span> Configuración
                </a>
                <a class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors no-underline" (click)="navigate('/analytics'); showUserMenu = false">
                  <span>📊</span> Reportes
                </a>
                <div class="h-px bg-slate-100 my-1"></div>
                <a class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors no-underline" (click)="logout()">
                  <span>🚪</span> Cerrar sesión
                </a>
              </div>
            </div>
          </div>
        </header>

        <!-- Router outlet -->
        <div class="flex-1 overflow-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class ShellComponent implements OnInit {
  sidebarCollapsed = false
  user: any = null
  currentRoute = ''
  showNotifications = false
  showUserMenu = false

  notifications = [
    { icon: '📦', text: 'Nuevo pedido #10046 recibido', time: 'Hace 5 min', type: 'order' },
    { icon: '⚠️', text: 'Stock bajo en "Laptop Pro X1"', time: 'Hace 20 min', type: 'alert' },
    { icon: '✅', text: 'Pedido #10043 completado', time: 'Hace 1 hora', type: 'success' },
  ]

  angularItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', badge: 'Nuevo', type: 'angular' },
    { path: '/analytics', label: 'Analytics', icon: '📈', type: 'angular' },
  ]

  vueItems: NavItem[] = [
    { path: '/products', label: 'Productos', icon: '🛍️', type: 'vue' },
    { path: '/settings', label: 'Configuración', icon: '⚙️', type: 'vue' },
  ]

  get currentPageTitle(): string {
    const allItems = [...this.angularItems, ...this.vueItems]
    return allItems.find(i => this.isActive(i.path))?.label || 'Dashboard'
  }

  get isVuePage(): boolean {
    return this.currentRoute.includes('/products') || this.currentRoute.includes('/settings')
  }

  private router = inject(Router)
  private sharedState = inject(SharedStateService)

  ngOnInit() {
    this.sharedState.init()
    this.user = this.sharedState.getState().user

    this.sharedState.subscribe(state => {
      this.user = state.user
    })

    this.currentRoute = this.router.url
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentRoute = e.urlAfterRedirects
    })
  }

  isActive(path: string): boolean {
    return this.currentRoute === path || this.currentRoute.startsWith(path)
  }

  navigate(path: string) {
    this.router.navigate([path])
  }

  onDocClick(event: Event) {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      this.showNotifications = false
      this.showUserMenu = false
    }
  }

  logout() {
    localStorage.removeItem('mfe_auth')
    localStorage.removeItem('mfe_user')
    this.router.navigate(['/login'])
  }
}
