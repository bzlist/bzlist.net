import * as io from "socket.io-client";

class Socket{
  private socket: SocketIOClient.Socket;

  constructor(){
    this.socket = io.connect("https://api.bzlist.net");
  }

  emit(event: string): void{
    this.socket.emit(event);
  }

  on<T>(event: string, callback: (data: T) => void): void{
    this.socket.on(event, (data: T) => {
      callback(data);
    });
  }
}

export const socket = new Socket();