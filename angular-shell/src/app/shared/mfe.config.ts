export interface MfeRemote {
  url: string
  moduleSuffix: string
}

export const MFE_REMOTES: Record<string, MfeRemote> = {
  vue: {
    url: 'http://localhost:3000/assets/remoteEntry.js',
    moduleSuffix: 'Mount',
  },
}
