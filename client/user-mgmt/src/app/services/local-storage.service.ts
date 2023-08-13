import { Injectable } from "@angular/core";
import Utils from "../utils/utils";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  getFromLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  saveToLocalStorage(key: string, value: any) {
    if (Utils.isNotNullOrUndefined(value) && typeof value === "object") {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  }

  clearFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
}