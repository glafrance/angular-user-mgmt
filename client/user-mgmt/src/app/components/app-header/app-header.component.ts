import { Component, OnInit } from "@angular/core";

import { AuthService } from "src/app/services/auth.service";
import Constants from "../../constants/constants";

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"]
})
export class AppHeader implements OnInit {
  signedIn: boolean = false;

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.authService.getSignedInObservable().subscribe({
      next: (result: boolean) => {
        this.signedIn = result;
      },
      error: (err: any) => {
        console.log("AppHeader - error getting updated signed in state");
      }
    });
  }

  onSignupSignin() {
    this.authService.showSignupSignin(Constants.SIGNIN);
  }

  onSignout() {
    this.authService.signOut();
  }
}