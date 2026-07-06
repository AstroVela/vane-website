import type {Plugin} from '@docusaurus/types'

type ConfigureWebpackReturn = ReturnType<NonNullable<Plugin['configureWebpack']>>

export default function devServerWebSocketPath(): Plugin {
  const webSocketPath = process.env.VANE_DEV_WEBSOCKET_PATH

  return {
    name: 'vane-dev-server-websocket-path',
    configureWebpack() {
      if (!webSocketPath) return undefined

      return {
        devServer: {
          client: {
            webSocketURL: {
              pathname: webSocketPath,
            },
          },
          webSocketServer: {
            options: {
              path: webSocketPath,
            },
          },
        },
      } as unknown as ConfigureWebpackReturn
    },
  }
}
