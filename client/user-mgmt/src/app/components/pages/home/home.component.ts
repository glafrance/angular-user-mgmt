import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "src/app/services/auth.service";
import Constants from "../../../constants/constants";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  signedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.authService.getSignedInObservable().subscribe({
      next: (result: boolean) => {
        this.signedIn = result;
      },
      error: (err: any) => {
        console.log("HomeComponent - error getting updated signed in state");
      }
    });
  }

  onSignupSignin() {
    this.authService.showSignupSignin(Constants.SIGNIN);    
  }

  onVisitProfile() {
    this.router.navigateByUrl(Constants.ROUTER_URLS.USER_PROFILE);
  }
}