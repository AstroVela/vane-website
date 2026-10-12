import {createContext, useContext, useEffect, useState, type PropsWithChildren} from 'react'
import {PlaybackController} from './playback'
const PlaybackContext = createContext<PlaybackController | null>(null)
export function MediaPlaybackProvider({children}: PropsWithChildren) {
  const [controller] = useState(() => new PlaybackController())
  useEffect(() => () => controller.pauseAll(), [controller])
  return <PlaybackContext.Provider value={controller}>{children}</PlaybackContext.Provider>
}
export function useMediaPlayback() {
  const controller = useContext(PlaybackContext)
  if (!controller) throw new Error('MediaPlaybackProvider is required')
  return controller
}
