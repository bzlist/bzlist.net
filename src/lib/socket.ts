import * as io from "socket.io-client";

export const socket = {
  _socket: io.connect("https://api.bzlist.net"),

  emit(event: string, data: any = null): void{
    this._socket.emit(event, data);
  },

  on<T>(event: string, callback: (data: T) => void): void{
    this._socket.on(event, (data: T) => {
      callback(data);
    });
  },

  off(event: string): void{
    this._socket.off(event);
  }
};
