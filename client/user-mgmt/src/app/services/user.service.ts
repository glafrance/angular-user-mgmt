import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";

import Constants from "../constants/constants";
import { HttpService } from "./http.service";
import { LocalStorageService } from "./local-storage.service";
import Utils from "../utils/utils";

@Injectable({
  providedIn: "root"
})
export class UserService {
  _userProfileObservable: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private httpService: HttpService,
    private localStorageService: LocalStorageService
  ) {}

  getUserProfileObservable(): BehaviorSubject<any> {
    return this._userProfileObservable;
  }

  setUserProfile(userData: any) {
    let result: any = new Observable();

    const userId = this.localStorageService.getFromLocalStorage(Constants.USER_ID_LOCAL_STORAGE_KEY);

    if (Utils.isNotNullOrUndefined(userId)) {
      const config = {
        url: `${Constants.API_ENDPOINTS.PROFILE}/${userId}`,
        method: Constants.HTTP_METHODS.POST,
        data: {
          data: userData
        }
      };
  
      result = this.httpService.doHttp(config);
  
      if (
        result && 
        result[Constants.RESULT] && 
        result[Constants.RESULT] === Constants.SUCCESS &&
        result[Constants.DATA]
      ) {
        this._userProfileObservable.next(result[Constants.DATA]);
      }  
    }

    return result;
  }
}
