import { Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';

import { SignupSigninComponent } from "../components/signup-signin/signup-signin.component";

@Injectable({
  providedIn: "root"
})
export default class AuthService {
  constructor(public dialog: MatDialog) {}

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
