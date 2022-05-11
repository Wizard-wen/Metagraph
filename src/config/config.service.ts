/**
 * @author songxiwen
 * @date  2021/9/11 22:08
 */

export class ConfigService {
  private static apiLocalBaseURL = 'http://localhost:7250/';

  private static apiLocalDockerURL = 'http://localhost:7251/';

  private static apiTestBaseURL = 'https://www.metagraph.design/api';

  static apiBaseURL = ConfigService.apiTestBaseURL;

  private static websocketLocalBaseURL = 'ws://localhost:8089';

  private static websocketDockerBaseURL = 'ws://localhost:8088';

  private static websocketTestBaseURL = 'wss://www.metagraph.design/websocket';

  static websocketBaseURL = ConfigService.websocketTestBaseURL;
}
