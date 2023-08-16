import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

import Constants from "../constants/constants";
import { HttpService } from "./http.service";
import { LocalStorageService } from "./local-storage.service";
import Utils from "../utils/utils";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private httpService: HttpService,
    private localStorageService: LocalStorageService,
    private toastr: ToastrService
  ) {}

  _userProfileObservable: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  getUserProfileObservable(): BehaviorSubject<any> {
    return this._userProfileObservable;
  }

  getUserProfile() {
    const userId = this.localStorageService.getFromLocalStorage(Constants.USER_ID_LOCAL_STORAGE_KEY);

    if (Utils.isNotNullOrUndefined(userId)) {
      const config = {
        url: `${Constants.API_ENDPOINTS.PROFILE}/${userId}`,
        method: Constants.HTTP_METHODS.GET
      };
  
      this.httpService.doHttp(config).subscribe({
        next: (result) => {
          if (result) {
            this._userProfileObservable.next(result);
          } else {
            console.log("UserService - error getting user profile, no result");
          }
        },
        error: (err) => {
          console.log("UserService - error getting user profile", err);
        }
      });
    }
  }

  setUserProfile(userData: any) {
    let resultObservable: any = new Observable();

    const userId = this.localStorageService.getFromLocalStorage(Constants.USER_ID_LOCAL_STORAGE_KEY);

    if (Utils.isNotNullOrUndefined(userId)) {
      const config = {
        url: `${Constants.API_ENDPOINTS.PROFILE}/${userId}`,
        method: Constants.HTTP_METHODS.POST,
        data: {
          data: userData
        }
      };
  
      resultObservable = this.httpService.doHttp(config);

      if (resultObservable) {
        resultObservable.subscribe({
          next: (result: any) => {
            if (
              result && 
              result[Constants.RESULT] && 
              result[Constants.RESULT] === Constants.SUCCESS &&
              result[Constants.DATA]
            ) {
              this.toastr.success("Your profile changes were successfully submitted.", "Profile Changes Submitted");
              this._userProfileObservable.next(result[Constants.DATA]);
            }        
          },
          error: (err: any) => {
            this.toastr.error("Something went wrong submitting your profile changes, please try again.", "Error Submitting Profile");
          }
        });
      }  
    }

    return resultObservable;
  }

  _userProfileImageObservable: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  getUserProfileImageObservable(): BehaviorSubject<any> {
    return this._userProfileImageObservable;
  }

  getUserProfileImage() {
    const userId = this.localStorageService.getFromLocalStorage(Constants.USER_ID_LOCAL_STORAGE_KEY);

    if (Utils.isNotNullOrUndefined(userId)) {
      const config = {
        url: `${Constants.API_ENDPOINTS.PROFILE_IMAGE}/${userId}`,
        method: Constants.HTTP_METHODS.GET
      };
  
      this.httpService.doHttp(config).subscribe({
        next: (result) => {
          if (result) {
            this._userProfileImageObservable.next(result);
          } else {
            console.log("UserService - error getting user profile image, no result");
          }
        },
        error: (err) => {
          console.log("UserService - error getting user profile image", err);
        }
      });
    }
  }

  uploadUserProfileImage(profileImage: File) {
    let resultObservable: any = new Observable();

    if (profileImage) {
      const userId = this.localStorageService.getFromLocalStorage(Constants.USER_ID_LOCAL_STORAGE_KEY);

      if (Utils.isNotNullOrUndefined(userId)) { 
        const formData = new FormData(); 
        formData.append("file", profileImage, profileImage.name);
  
        const config = {
          url: `${Constants.API_ENDPOINTS.PROFILE_IMAGE}/${userId}`,
          method: Constants.HTTP_METHODS.POST,
          data: formData
        };
    
        resultObservable = this.httpService.doHttp(config);
      }
    }

    return resultObservable;
  }
}
