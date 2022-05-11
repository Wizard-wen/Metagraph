/**
 * @author songxiwen
 * @date  2021/9/13 21:45
 * 补充并发测试模拟大量用户创建webSocket情况下的性能
 */

export class WebsocketService {
  private ws!: WebSocket;

  private lockReconnect = false;

  private timeout = 3000;

  // 计时器
  private reconnectTimer?: number;

  private heartCheckBrowserTimer?: number;

  private heartCheckServerTimer?: number;

  private isDestroy?: boolean;

  // 注册的事件
  private events: {
    event: string;
    handler: (message: any) => void
  }[] = [{
    event: 'check',
    handler(message: any): void {
      // console.log(message);
    }
  }];

  constructor(
    private readonly url: string,
    events: {
      event: string;
      handler: (message: any) => void
    }[]
  ) {
    this.createWebSocket();
    this.events = this.events.concat(events);
  }

  send(params: {
    event: string;
    data: { [key: string]: any } | string
  }): void {
    if (this.events?.find((item) => item.event === params.event)) {
      this.ws.send(JSON.stringify(params));
    } else {
      throw new Error();
    }
  }

  close(): void {
    this.ws.close();
    this.isDestroy = true;
    window.clearTimeout(this.reconnectTimer);
    window.clearTimeout(this.heartCheckBrowserTimer);
    window.clearTimeout(this.heartCheckBrowserTimer);
  }

  private createWebSocket(): void {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onclose = () => {
        if (!this.isDestroy) {
          this.reconnect();
        }
      };
      this.ws.onerror = () => {
        this.reconnect();
      };
      this.ws.onopen = () => {
        // 心跳检测重置
        this.heartCheck();
      };
      this.ws.onmessage = (event: MessageEvent) => {
        // 拿到任何消息都说明当前连接是正常的
        if (event.data) {
          const result = JSON.parse(event.data);
          const eventModel = this.events.find((item) => item.event === result.event);
          if (eventModel) {
            eventModel.handler(result);
          }
        }
        this.heartCheck();
      };
    } catch (e) {
      this.reconnect();
    }
  }

  private reconnect(): void {
    if (this.lockReconnect) {
      return;
    }
    this.lockReconnect = true;
    // 没连接上会一直重连，设置延迟避免请求过多
    this.reconnectTimer && window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = window.setTimeout(() => {
      this.createWebSocket();
      this.lockReconnect = false;
    }, 4000);
  }

  private heartCheck(): void {
    this.heartCheckBrowserTimer && clearTimeout(this.heartCheckBrowserTimer);
    this.heartCheckServerTimer && clearTimeout(this.heartCheckServerTimer);
    // 心跳检测客户端定时器
    this.heartCheckBrowserTimer = window.setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      this.send({
        event: 'check',
        data: 'Are you ok?'
      });
      // 心跳检测服务端定时器
      this.heartCheckServerTimer = window.setTimeout(() => {
        // 链接出现了异常
        this.ws.close();
        this.createWebSocket();
      }, this.timeout);
    }, this.timeout);
  }
}
