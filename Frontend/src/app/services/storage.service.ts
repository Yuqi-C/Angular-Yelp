import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  get(){
    if(!("list" in localStorage)) return null;
    const list = localStorage.getItem("list");
    if(list == null) return null;
    return JSON.parse(list);
  }

  set(info:any) {
    const list = localStorage.getItem("list");
    if(list == null){
      const arr = []
      arr.push(info);
      localStorage.setItem("list", JSON.stringify(arr));
    }else{
      const arr = JSON.parse(list);
      arr.push(info);
      localStorage.setItem("list", JSON.stringify(arr));
    }
  }

  remove(key:any){
    const list = localStorage.getItem("list");
    if(list == null) return;
    const arr = JSON.parse(list);
    arr.splice(key, 1);
    localStorage.setItem("list", JSON.stringify(arr));
  }

}
