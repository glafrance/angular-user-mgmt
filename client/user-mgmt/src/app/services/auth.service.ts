import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";

import Constants from "../constants/constants";
import { HttpService } from "./http.service";
import { LocalStorageService } from "./local-storage.service";
import { SignupSigninComponent } from "../components/signup-signin/signup-signin.component";
import Utils from "../utils/utils";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    public dialog: MatDialog,
    private httpService: HttpService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    console.log("auth.service constructor");
  }

  ///////////////////////// START SIGNUP/SIGNIN SECTION //////////////////////////
  signUp(config: any): Observable<any> {
    let result = new Observable();

    if (
      Utils.isNotNullOrUndefined(config) && 
      Utils.isNotNullOrUndefined(config.email) &&
      Utils.isNotNullOrUndefined(config.password)
    ) {
      const apiConfig = {
        url: Constants.API_ENDPOINTS.SIGNUP,
        method: Constants.HTTP_METHODS.POST,
        data: {
          email: config.email,
          password: config.password
        }
      };

      result = this.httpService.doHttp(apiConfig);
    } else {
      console.log("Unable to signup user, missing email, password, or both")
    }

    return result;
  }

  signIn(config: any): Observable<any> {
    let result = new Observable();

    if (
      Utils.isNotNullOrUndefined(config) && 
      Utils.isNotNullOrUndefined(config.email) &&
      Utils.isNotNullOrUndefined(config.password)
    ) {
      const apiConfig = {
        url: Constants.API_ENDPOINTS.SIGNIN,
        method: Constants.HTTP_METHODS.POST,
        data: {
          email: config.email,
          password: config.password
        }
      };

      result = this.httpService.doHttp(apiConfig);
    } else {
      console.log("Unable to signin user, missing email, password, or both")
    }

    return result;
  }

  _signedInObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  _isSignedIn: boolean = false;

  getSignedInObservable(): BehaviorSubject<boolean> {
    return this._signedInObservable;
  }

  setSignedIn(signedIn: boolean) {
    this._isSignedIn = signedIn;

    if (signedIn) {
      this.localStorageService.saveToLocalStorage(Constants.SIGNED_IN_LOCAL_STORAGE_KEY, signedIn);
    } else {
      this.localStorageService.clearFromLocalStorage(Constants.SIGNED_IN_LOCAL_STORAGE_KEY);
    }

    this._signedInObservable.next(signedIn);
  }

  getSignedIn(): boolean {
    return this._isSignedIn;
  }

  signOut() {
    this.setSignedIn(false);
    this.router.navigateByUrl(Constants.ROUTER_URLS.HOME);
  }
  ////////////////////////// END SIGNUP/SIGNIN SECTION ///////////////////////////

  showSignupSignin(mode: string): void {
    this.dialog.open(SignupSigninComponent, {
      data: { mode },
      autoFocus: false
    });
  }
}
