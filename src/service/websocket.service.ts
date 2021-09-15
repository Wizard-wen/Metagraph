/**
 * @author songxiwen
 * @date  2021/9/13 11:45
 */

// eslint-disable-next-line import/prefer-default-export
export class WebsocketService {
  ws!: WebSocket;

  lockReconnect = false;

  reconnectTimer?: number;

  timeout = 3000;

  heartCheckBrowserTimer?: number;

  heartCheckServerTimer?: number;

  isDestroy?: boolean;

  events: {
    event: string;
    handler: (message: any) => void
  }[] = [{
    event: 'check',
    handler(message: any): void {
      console.log(message);
    }
  }];

  constructor(private readonly url: string, events: {
    event: string;
    handler: (message: any) => void
  }[]) {
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

  createWebSocket(): void {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onclose = () => {
        console.log('链接关闭');
        if (!this.isDestroy) {
          this.reconnect();
        }
      };
      this.ws.onerror = () => {
        console.log('发生异常了');
        this.reconnect();
      };
      this.ws.onopen = () => {
        // 心跳检测重置
        this.heartCheck();
      };
      this.ws.onmessage = (event: MessageEvent) => {
        // 拿到任何消息都说明当前连接是正常的
        console.log('接收到消息', event);
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
      console.log('catch');
      this.reconnect();
    }
  }

  reconnect(): void {
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

  heartCheck(): void {
    console.log('start');
    this.heartCheckBrowserTimer && clearTimeout(this.heartCheckBrowserTimer);
    this.heartCheckServerTimer && clearTimeout(this.heartCheckServerTimer);
    // 心跳检测客户端定时器
    this.heartCheckBrowserTimer = window.setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      console.log('长时间没有消息发送，发送心跳检测。');
      this.send({
        event: 'check',
        data: 'Are you ok?'
      });
      // 心跳检测服务端定时器
      this.heartCheckServerTimer = window.setTimeout(() => {
        console.log('链接出现了异常！');
        this.ws.close();
        this.createWebSocket();
      }, this.timeout);
    }, this.timeout);
  }
}
