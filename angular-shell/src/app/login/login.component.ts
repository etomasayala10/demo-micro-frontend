import { Component, inject, NgZone, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SharedStateService } from '../shared/shared-state.service'

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-login',
  template: `
    <div class="flex min-h-screen font-['Plus_Jakarta_Sans',system-ui,sans-serif]">
      <!-- LEFT PANEL -->
      <div class="hidden md:flex flex-1 bg-[#0a0f1e] p-12 flex-col justify-between relative overflow-hidden">
        <div class="flex items-center gap-3 text-white font-bold text-lg">
          <div class="text-3xl text-violet-600 leading-none">⬡</div>
          <span>MFE Platform</span>
        </div>
        <div class="z-[1]">
          <h1 class="text-[2.75rem] font-extrabold text-white leading-tight mb-4">Bienvenido de vuelta</h1>
          <p class="text-slate-400 text-[1.05rem] leading-relaxed max-w-[360px]">Accede al panel de control construido con Microfrontends: Angular + Vue.</p>
        </div>
        <div class="flex gap-2 flex-wrap z-[1]">
          <div class="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide bg-[#ff000015] text-red-400 border border-[#f8717140]">Angular 19</div>
          <div class="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide bg-[#42b88315] text-green-400 border border-[#4ade8040]">Vue 3.5</div>
          <div class="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide bg-[#7c3aed15] text-violet-400 border border-[#a78bfa40]">Module Federation</div>
        </div>
        <!-- Decorative circles -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute w-[350px] h-[350px] rounded-full blur-[60px] opacity-25 bg-violet-600 -top-[100px] -right-[80px]"></div>
          <div class="absolute w-[250px] h-[250px] rounded-full blur-[60px] opacity-25 bg-blue-600 bottom-0 -left-[80px]"></div>
          <div class="absolute w-[200px] h-[200px] rounded-full blur-[60px] opacity-15 bg-[#42b883] bottom-[100px] right-[50px]"></div>
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="w-full md:w-[480px] bg-slate-50 flex items-center justify-center p-8">
        <div class="w-full max-w-[380px] bg-white rounded-[20px] p-10 shadow-[0_4px_40px_rgba(0,0,0,0.08)]">
          <h2 class="text-[1.6rem] font-extrabold text-[#0a0f1e] mb-1">Iniciar sesión</h2>
          <p class="text-slate-400 text-sm mb-6">Ingresa tus credenciales para continuar</p>

          <div class="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3.5 py-2.5 text-[13px] text-gray-700 mb-6">
            <span>🔑</span>
            <span>Demo: <strong>admin&#64;mfe.com</strong> / <strong>admin123</strong></span>
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1.5 mb-4">
            <label class="flex justify-between text-[13px] font-semibold text-gray-700">Correo electrónico</label>
            <div class="relative flex items-center">
              <svg class="absolute left-3 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <input
                type="email"
                [(ngModel)]="email"
                placeholder="admin&#64;mfe.com"
                (keydown.enter)="login()"
                class="w-full py-[11px] pr-10 pl-[38px] border-[1.5px] border-slate-200 rounded-[10px] text-sm text-[#0a0f1e] outline-none transition-all duration-150 font-[inherit] bg-slate-50 focus:border-violet-600 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)] focus:bg-white"
                [class.!border-red-500]="error"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-1.5 mb-4">
            <label class="flex justify-between text-[13px] font-semibold text-gray-700">
              Contraseña
              <a class="text-violet-600 no-underline font-medium text-xs" href="#">¿Olvidaste tu contraseña?</a>
            </label>
            <div class="relative flex items-center">
              <svg class="absolute left-3 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <input
                [type]="showPass ? 'text' : 'password'"
                [(ngModel)]="password"
                placeholder="••••••••"
                (keydown.enter)="login()"
                class="w-full py-[11px] pr-10 pl-[38px] border-[1.5px] border-slate-200 rounded-[10px] text-sm text-[#0a0f1e] outline-none transition-all duration-150 font-[inherit] bg-slate-50 focus:border-violet-600 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)] focus:bg-white"
                [class.!border-red-500]="error"
              />
              <button class="absolute right-3 bg-transparent border-none cursor-pointer text-sm" (click)="showPass = !showPass" type="button">
                {{ showPass ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Error message -->
          <div *ngIf="error" class="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-[13px] text-red-600 mb-4">
            <span>⚠️</span> {{ error }}
          </div>

          <!-- Submit button -->
          <button
            (click)="login()"
            [disabled]="loading"
            class="w-full py-[13px] bg-violet-600 text-white border-none rounded-xl text-[15px] font-bold cursor-pointer transition-all duration-150 mb-5 flex items-center justify-center min-h-[48px] font-[inherit] hover:bg-violet-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-default"
          >
            <span *ngIf="!loading">Ingresar al sistema</span>
            <span *ngIf="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          </button>

          <p class="text-center text-xs text-slate-400">
            Plataforma de demostración · <strong>Microfrontend Architecture</strong>
          </p>
        </div>
      </div>
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
      this.error = 'Por favor ingresa tu correo y contraseña.'
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
