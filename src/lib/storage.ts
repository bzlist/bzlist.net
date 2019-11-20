import {api} from "./utils";

export class Storage{
  prefix: string;
  onChange: (key: string, value: string, data?: any) => void;

  constructor(prefix = ""){
    this.prefix = prefix;
    this.onChange = (key: string, value: string, data?: any): void => {};
  }

  key(index: number): string | null{
    return localStorage.key(index);
  }

  get(key: string): string{
    const value = localStorage.getItem(this.prefix+key);
    return value ? value : "";
  }

  getJson(key: string, defaultValue: Object = {}): any{
    const value = localStorage.getItem(this.prefix+key);
    try{
      return value ? JSON.parse(value) : defaultValue;
    }catch(err){
      console.error("error getting json from storage.", err);
      return defaultValue;
    }
  }

  set(key: string, value: string, sync: boolean = false): void{
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

  setData(data: any): void{
    for(const key in data){
      if(data.hasOwnProperty(key)){
        this.set(key, data[key], false);
      }
    }
  }
}

export const storage = new Storage();
export const cache = new Storage("cache_");
export const settings = new Storage("setting_");

settings.onChange = (key: string, value: string, sync: boolean): void => {
  if(value === "false"){
    settings.remove(key);
  }

  if(storage.get("syncSettings") !== "true" || !sync){
    return;
  }

  const callsign = storage.get("callsign");
  const token = storage.get("token");
  if(callsign !== "" && token !== ""){
    api("users/settings", {callsign, token, settings: settings.json()}, "PATCH");
  }
};
