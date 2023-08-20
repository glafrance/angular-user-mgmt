import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {shareReplay } from 'rxjs/operators'

import Constants from "../constants/constants";
import Utils from "../utils/utils";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  doHttp(config: any) {
    let result = new Observable();

    if (
      Utils.isNotNullOrUndefined(config) &&
      Utils.isNotNullOrUndefined(config.url) &&
      Utils.isNotNullOrUndefined(config.method)
    ) {
      const url = `${Constants.BASE_URL}/${config.url}`;
      result = this.callApi(url, config.method, config["data"], config["options"]);
    }

    return result;
  }

  callApi(url: string, method: string, data: any = {}, options: any = {}): Observable<any> {
    let result = new Observable();

    switch (method) {
      case Constants.HTTP_METHODS.GET:
        result = this.httpClient.get(url, options).pipe(shareReplay());
        break;
      case Constants.HTTP_METHODS.POST:
        result = this.httpClient.post(url, data, options).pipe(shareReplay());
        break;
      case Constants.HTTP_METHODS.DELETE:
        result = this.httpClient.delete(url, options).pipe(shareReplay());
        break;
      case Constants.HTTP_METHODS.PUT:
        result = this.httpClient.put(url, data, options).pipe(shareReplay());
        break;
    }

    return result;
  }
}