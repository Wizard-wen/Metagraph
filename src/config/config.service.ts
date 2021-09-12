/**
 * @author songxiwen
 * @date  2021/9/11 12:08
 */

// eslint-disable-next-line import/prefer-default-export
export class ConfigService {
  private static apiLocalBaseURL = 'http://localhost:7250/'

  private static apiTestBaseURL = 'http://edu.songxiwen.com.cn/api'

  static apiBaseURL = ConfigService.apiTestBaseURL

  private static websocketLocalBaseURL = 'ws://localhost:8089/websocket'

  private static websocketTestBaseURL = 'ws://edu.songxiwen.com.cn/websocket'

  static websocketBaseURL = ConfigService.websocketTestBaseURL
}
