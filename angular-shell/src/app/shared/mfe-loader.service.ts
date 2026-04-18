import { Injectable } from '@angular/core'
import { MFE_REMOTES } from './mfe.config'

@Injectable({ providedIn: 'root' })
export class MfeLoaderService {
  private containers = new Map<string, any>()

  /**
   * Load a remote module dynamically.
   * @param remote  Key in MFE_REMOTES (e.g. 'vue')
   * @param page    Page identifier (e.g. 'Products') — combined with moduleSuffix
   */
  async load(remote: string, page: string): Promise<any> {
    const config = MFE_REMOTES[remote]
    if (!config) throw new Error(`Remote "${remote}" not found in MFE_REMOTES`)

    // Load & cache the remote container
    if (!this.containers.has(remote)) {
      const dynamicImport = new Function('url', 'return import(url)')
      const container = await dynamicImport(config.url)
      await container.init({})
      this.containers.set(remote, container)
    }

    const container = this.containers.get(remote)
    const moduleName = `./${page}${config.moduleSuffix}`
    const factory = await container.get(moduleName)
    const module = factory()
    return module.default || module
  }

  /** Invalidate a remote cache (e.g. on retry) */
  invalidate(remote: string) {
    this.containers.delete(remote)
  }
}
