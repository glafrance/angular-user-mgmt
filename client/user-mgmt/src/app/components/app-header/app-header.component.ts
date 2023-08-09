import { Component } from "@angular/core";

import AuthService from "src/app/services/auth.service";
import Constants from "../../constants/constants";

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"]
})
export class AppHeader {
  constructor(private authService: AuthService) {}
  
  onSignupSignin() {
    this.authService.showSignupSignin(Constants.SIGNUP);
  }
}