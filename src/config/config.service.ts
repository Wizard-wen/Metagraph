/**
 * @author songxiwen
 * @date  2021/9/11 12:08
 */

// eslint-disable-next-line import/prefer-default-export
export class ConfigService {
  private static apiLocalBaseURL = 'http://localhost:7250/'

  private static apiTestBaseURL = 'https://edu.songxiwen.com.cn/api'

  static apiBaseURL = ConfigService.apiLocalBaseURL

  private static websocketLocalBaseURL = 'ws://localhost:8089/websocket'

  private static websocketTestBaseURL = 'wss://edu.songxiwen.com.cn/websocket'

  static websocketBaseURL = ConfigService.websocketLocalBaseURL
}
