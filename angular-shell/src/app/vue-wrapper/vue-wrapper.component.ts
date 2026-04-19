import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject, NgZone, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { MfeLoaderService } from '../shared/mfe-loader.service'
import { SharedStateService } from '../shared/shared-state.service'

@Component({
  selector: 'app-vue-wrapper',
  imports: [CommonModule],
  template: `
    <div class="min-h-full">
      <div *ngIf="loading" class="flex flex-col items-center justify-center py-16 px-8 text-slate-500 gap-3">
        <div class="w-10 h-10 border-[3px] border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
        <p class="text-[15px] font-semibold text-gray-700 m-0">Cargando microfrontend Vue...</p>
        <small class="text-xs text-slate-400">Conectando con remote...</small>
      </div>
      <div *ngIf="error" class="flex flex-col items-center p-12 max-w-[480px] mx-auto my-8 bg-white rounded-2xl border border-red-200 text-center gap-3">
        <div class="text-[2.5rem]">&#x26A0;&#xFE0F;</div>
        <h3 class="text-lg text-[#0a0f1e] m-0">No se pudo cargar el MFE</h3>
        <p class="text-sm text-slate-500 m-0">{{ error }}</p>
        <button class="mt-2 px-6 py-2.5 bg-emerald-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-emerald-600 transition-colors" (click)="retry()">Reintentar</button>
      </div>
      <div #mountPoint></div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class VueWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('mountPoint', { static: true }) mountPoint!: ElementRef

  loading = true
  error = ''
  private vueApp: any = null

  private route = inject(ActivatedRoute)
  private ngZone = inject(NgZone)
  private loader = inject(MfeLoaderService)
  private sharedState = inject(SharedStateService)

  async ngOnInit() {
    await this.loadMfe()
  }

  async loadMfe() {
    this.loading = true
    this.error = ''

    const data = this.route.snapshot.data
    const remote: string = data['remote'] || 'vue'
    const page: string = data['page'] || ''

    if (!page) {
      this.error = 'No se especificó la página en la ruta (data.page)'
      this.loading = false
      return
    }

    try {
      const mount = await this.loader.load(remote, page)
      this.vueApp = mount(this.mountPoint.nativeElement, this.sharedState.toBridge())

      this.ngZone.run(() => { this.loading = false })
    } catch (err: any) {
      this.ngZone.run(() => {
        this.loading = false
        this.error = err.message || 'Error al cargar el microfrontend.'
      })
    }
  }

  retry() {
    const remote = this.route.snapshot.data['remote'] || 'vue'
    this.loader.invalidate(remote)
    if (this.vueApp) { this.vueApp.unmount(); this.vueApp = null }
    this.mountPoint.nativeElement.innerHTML = ''
    this.loadMfe()
  }

  ngOnDestroy() {
    if (this.vueApp) {
      try { this.vueApp.unmount() } catch {}
      this.vueApp = null
    }
    if (this.mountPoint?.nativeElement) {
      this.mountPoint.nativeElement.innerHTML = ''
    }
  }
}
