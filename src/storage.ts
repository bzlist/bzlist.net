export class Storage{
  prefix: string;

  constructor(prefix = ""){
    this.prefix = prefix;
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
}

export const cache = new Storage("cache_");
export const settings = new Storage("setting_");