import { Component } from "@angular/core";

import AuthService from "src/app/services/auth.service";
import Constants from "../../constants/constants";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
  constructor(private authService: AuthService){}

  onSignupSignin() {
    this.authService.showSignupSignin(Constants.SIGNUP);    
  }
}