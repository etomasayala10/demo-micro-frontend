import { Component, inject, NgZone, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SharedStateService } from '../shared/shared-state.service'

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-login',
  template: `
    <div class="flex flex-col min-h-screen bg-[#0a0f1e] font-['Plus_Jakarta_Sans',system-ui,sans-serif] relative overflow-hidden">
      <!-- Background decorations -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 bg-violet-600 -top-[150px] -right-[100px]"></div>
        <div class="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-15 bg-blue-600 -bottom-[100px] -left-[100px]"></div>
        <div class="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 bg-emerald-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <!-- Main content -->
      <div class="flex-1 flex items-center justify-center p-6 relative z-10">
        <div class="w-full max-w-[420px]">
          <!-- Logo -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 mb-4">
              <svg class="w-7 h-7 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
            </div>
            <h1 class="text-2xl font-extrabold text-white mb-1">MFE Platform</h1>
            <p class="text-slate-400 text-sm">Arquitectura Microfrontend &middot; Angular + Vue</p>
          </div>

          <!-- Card -->
          <div class="bg-white rounded-2xl p-8 shadow-[0_8px_60px_rgba(0,0,0,0.3)]">
            <h2 class="text-xl font-bold text-[#0a0f1e] mb-1">Iniciar sesion</h2>
            <p class="text-slate-400 text-sm mb-6">Ingresa tus credenciales para continuar</p>

            <div class="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-lg px-3.5 py-2.5 text-[13px] text-violet-700 mb-6">
              <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3"/></svg>
              <span>Demo: <strong>admin&#64;mfe.com</strong> / <strong>admin123</strong></span>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1.5 mb-4">
              <label class="text-[13px] font-semibold text-gray-700">Correo electronico</label>
              <div class="relative flex items-center">
                <svg class="absolute left-3 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <input
                  type="email"
                  [(ngModel)]="email"
                  placeholder="admin&#64;mfe.com"
                  (keydown.enter)="login()"
                  class="w-full py-3 pr-4 pl-10 border-[1.5px] border-slate-200 rounded-xl text-sm text-[#0a0f1e] outline-none transition-all duration-150 font-[inherit] bg-slate-50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)] focus:bg-white"
                  [class.!border-red-500]="error"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-1.5 mb-5">
              <label class="text-[13px] font-semibold text-gray-700">Contrasena</label>
              <div class="relative flex items-center">
                <svg class="absolute left-3 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <input
                  [type]="showPass ? 'text' : 'password'"
                  [(ngModel)]="password"
                  placeholder="••••••••"
                  (keydown.enter)="login()"
                  class="w-full py-3 pr-10 pl-10 border-[1.5px] border-slate-200 rounded-xl text-sm text-[#0a0f1e] outline-none transition-all duration-150 font-[inherit] bg-slate-50 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)] focus:bg-white"
                  [class.!border-red-500]="error"
                />
                <button class="absolute right-3 bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 transition-colors" (click)="showPass = !showPass" type="button">
                  <svg *ngIf="!showPass" class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg *ngIf="showPass" class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <!-- Error message -->
            <div *ngIf="error" class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-[13px] text-red-600 mb-4">
              <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {{ error }}
            </div>

            <!-- Submit button -->
            <button
              (click)="login()"
              [disabled]="loading"
              class="w-full py-3.5 bg-violet-600 text-white border-none rounded-xl text-[15px] font-bold cursor-pointer transition-all duration-200 flex items-center justify-center min-h-[50px] font-[inherit] hover:bg-violet-700 hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-default"
            >
              <span *ngIf="!loading">Ingresar al sistema</span>
              <span *ngIf="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            </button>
          </div>

          <!-- Tech badges -->
          <div class="flex justify-center gap-2 mt-6">
            <span class="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-red-500/10 text-red-400 border border-red-500/20">Angular 19</span>
            <span class="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Vue 3.5</span>
            <span class="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-violet-500/10 text-violet-400 border border-violet-500/20">Module Federation</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="relative z-10 border-t border-white/10 py-5 px-6">
        <div class="max-w-[420px] mx-auto flex flex-col items-center gap-3">
          <p class="text-slate-500 text-xs text-center leading-relaxed">
            Desarrollado por <strong class="text-slate-300">Edson Tomas</strong> &middot;
            Programacion, Arquitectura de Software, Agentes de IA, Automatizaciones y Apps Moviles
          </p>
          <a href="https://www.linkedin.com/in/etomas-ti" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a66c2]/15 border border-[#0a66c2]/25 text-[#60a5fa] text-xs font-semibold no-underline hover:bg-[#0a66c2]/25 transition-all duration-200">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Contactame en LinkedIn
          </a>
        </div>
      </footer>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  email = ''
  password = ''
  error = ''
  loading = false
  showPass = false

  private router = inject(Router)
  private ngZone = inject(NgZone)
  private sharedState = inject(SharedStateService)

  login() {
    this.error = ''
    if (!this.email || !this.password) {
      this.error = 'Por favor ingresa tu correo y contrasena.'
      return
    }
    this.loading = true
    setTimeout(() => {
      this.ngZone.run(() => {
        if (this.email === 'admin@mfe.com' && this.password === 'admin123') {
          const user = { name: 'Edson Tomas', role: 'Developer', email: this.email }
          localStorage.setItem('mfe_auth', 'true')
          localStorage.setItem('mfe_user', JSON.stringify(user))
          this.sharedState.setState({ user })
          this.router.navigate(['/dashboard'])
        } else {
          this.error = 'Credenciales incorrectas. Intenta con admin@mfe.com / admin123'
        }
        this.loading = false
      })
    }, 900)
  }
}
