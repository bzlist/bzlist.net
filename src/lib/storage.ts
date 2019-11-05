import {api} from "./utils";

export class Storage{
  prefix: string;
  onChange: (key: string, value: string) => void;

  constructor(prefix = ""){
    this.prefix = prefix;
    this.onChange = (key: string, value: string): void => {};
  }

  key(index: number): string | null{
    return localStorage.key(index);
  }

  get(key: string): string{
    const value = localStorage.getItem(this.prefix+key);
    return value ? value : "";
  }

  set(key: string, value: string): void{
    localStorage.setItem(this.prefix+key, value);
    this.onChange(key, value);
  }

  remove(key: string): void{
    localStorage.removeItem(this.prefix+key);
  }

  clear(): void{
    const data: string[] = [];
    for(let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if(key && key.startsWith(this.prefix)){
        data.push(key);
      }
    }

    for(let i = 0; i < data.length; i++){
      localStorage.removeItem(data[i]);
    }
  }

  json(): Object{
    const data: any = {};
    for(let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if(key && key.startsWith(this.prefix)){
        data[key.replace(this.prefix, "")] = localStorage.getItem(key);
      }
    }

    return data;
  }

  setJson(data: any): void{
    for(const key in data){
      if(data.hasOwnProperty(key)){
        this.set(key, data[key]);
      }
    }
  }
}

export const storage = new Storage();
export const cache = new Storage("cache_");
export const settings = new Storage("setting_");

settings.onChange = (key: string, value: string): void => {
  const callsign = storage.get("callsign");
  const token = storage.get("token");
  if(callsign !== "" && token !== ""){
    api("settings", {callsign, token, settings: settings.json()}, "PATCH");
  }
};
