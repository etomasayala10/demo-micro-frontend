import { Injectable } from '@angular/core'

export interface SharedState {
  user: { name: string; email: string; role: string } | null
  theme: string
  language: string
  [key: string]: any
}

type Listener = (state: SharedState) => void

@Injectable({ providedIn: 'root' })
export class SharedStateService {
  private state: SharedState = {
    user: null,
    theme: 'light',
    language: 'es',
  }

  private listeners = new Set<Listener>()

  /** Initialize state from localStorage (call once at app start) */
  init() {
    const raw = localStorage.getItem('mfe_user')
    if (raw) {
      try { this.state.user = JSON.parse(raw) } catch {}
    }
  }

  /** Get current state snapshot */
  getState(): SharedState {
    return { ...this.state }
  }

  /** Update partial state and notify listeners */
  setState(partial: Partial<SharedState>) {
    Object.assign(this.state, partial)
    this.notify()
  }

  /** Subscribe to state changes. Returns unsubscribe function. */
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private notify() {
    const snapshot = this.getState()
    this.listeners.forEach(fn => fn(snapshot))
  }

  /** Returns a plain object that Vue mount functions can use */
  toBridge() {
    return {
      getState: () => this.getState(),
      setState: (partial: Partial<SharedState>) => this.setState(partial),
      subscribe: (fn: Listener) => this.subscribe(fn),
    }
  }
}
