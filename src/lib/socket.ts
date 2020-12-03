import * as io from "socket.io-client";
import {API_ROOT} from "./utils";

export const socket: {
  _socket: SocketIOClient.Socket | undefined;
  emit: (event: string, data?: any) => void;
  on: <T>(event: string, callback: (data: T) => void) => void;
  off: (event: string) => void;
} = {
  _socket: undefined,

  emit(event: string, data: any = null): void{
    if(!this._socket){
      this._socket = io.connect(API_ROOT);
    }

    this._socket.emit(event, data);
  },

  on<T>(event: string, callback: (data: T) => void): void{
    if(!this._socket){
      this._socket = io.connect(API_ROOT);
    }

    this._socket.on(event, (data: T) => {
      callback(data);
    });
  },

  off(event: string): void{
    if(!this._socket){
      return;
    }

    this._socket.off(event);
  }
};
