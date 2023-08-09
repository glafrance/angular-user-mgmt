import { Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';

import Constants from "../constants/constants";
import { HttpService } from "./http.service";
import { SignupSigninComponent } from "../components/signup-signin/signup-signin.component";
import Utils from "../utils/utils";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export default class AuthService {
  constructor(
    public dialog: MatDialog,
    private httpService: HttpService
  ) {}

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
  ////////////////////////// END SIGNUP/SIGNIN SECTION ///////////////////////////

  showSignupSignin(mode: string): void {
    const dialogRef = this.dialog.open(SignupSigninComponent, {
      data: { mode },
      autoFocus: false
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
