import { useStore } from "@/store";
import { connect, Socket } from 'socket.io-client';
import { store, key, MutationEnum } from '../store';

enum SocketEventEnum {
  Add = 'Add'
}

export class WebsocketService {
  private wssAddress = 'ws://localhost:8089';

  private socket: Socket;

  private static instance: WebsocketService;

  constructor() {
    //连接websocket后端服务器
    this.socket = connect(this.wssAddress);
    this.init();
  }

  static getInstance() {
    return WebsocketService.instance ?? new WebsocketService();
  }

  emit(event: SocketEventEnum, payload: any) {
    this.socket.emit(event, payload);
  }

  init() {
    const store = useStore();
    this.socket.on(SocketEventEnum.Add, (res: any) => {
      store.commit(MutationEnum.HANDLE_WEBSOCKET_ADD, res);
    });
    this.socket.on(SocketEventEnum.Add, (res: any) => {
      store.commit(MutationEnum.HANDLE_WEBSOCKET_ADD, res);
    });
  }
}
