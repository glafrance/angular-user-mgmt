import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "src/app/services/auth.service";
import Constants from "../../constants/constants";
import Utils from "../../utils/utils";
import ValidationUtils from "src/app/utils/validationUtils";

@Component({
  selector: "app-signup-signin",
  templateUrl: "./signup-signin.component.html",
  styleUrls: ["./signup-signin.component.scss"]
})
export class SignupSigninComponent implements OnInit {
  title: string = "";
  signupSigninButtonText: string = "";
  switchSignupSigninMessage: string = "";
  switchActionMessage: string = "";

  signupSigninForm: FormGroup = new FormGroup({
    email: new FormControl("", [
      Validators.required, 
      Validators.email
    ]),
    password: new FormControl("", [
      Validators.required, 
      Validators.minLength(8),
      Validators.maxLength(15),
      Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}/)
    ]),
    passwordConfirm: new FormControl("")
  });

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SignupSigninComponent>,
    private router: Router,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setDynamicText();

    this.signupSigninForm.addValidators([ValidationUtils.passwordsMatch(this.password, this.passwordConfirm)]);
  }

  get email() { return this.signupSigninForm.get("email") };
  get password() { return this.signupSigninForm.get("password") };
  get passwordConfirm() { return this.signupSigninForm.get("passwordConfirm") };

  setDynamicText() {
    if (this.data && this.data.mode) {
      if (this.data.mode === Constants.SIGNUP) {
        this.title = `${this.data.mode} with`;
        this.signupSigninButtonText = Constants.SIGNUP;
        this.switchSignupSigninMessage = "Already signed up?";
        this.switchActionMessage = "Click here to signin.";
      } else if (this.data.mode === Constants.SIGNIN) {
        this.title = `${this.data.mode} to`;
        this.signupSigninButtonText = Constants.SIGNIN;
        this.switchSignupSigninMessage = "Need to signup?";
        this.switchActionMessage = "Click here.";
      }  
    }
  }

  switchMode() {
    if (this.data && this.data.mode) {
      this.signupSigninForm.patchValue({
        passwordConfirm: ""
      });

      if (this.password && this.passwordConfirm) {
        this.password.reset();
        this.passwordConfirm.reset();
      }

      if (this.data.mode === Constants.SIGNUP) {
        this.data.mode = Constants.SIGNIN;
      } else if (this.data.mode === Constants.SIGNIN) {
        this.data.mode = Constants.SIGNUP;
      }
    }

    this.setDynamicText();
  }

  signupSignin() {
    const config = {
      email: this.email?.value,
      password: this.password?.value
    };

    if (this.data.mode === Constants.SIGNUP) {
      this.authService.signUp(config).subscribe({
        next: (result: any) => {
          if (result && result[Constants.RESULT] && result[Constants.RESULT] === Constants.SUCCESS) {
            this.toastr.success("Your signup with User Manager was successful.", "Signup Success");
            this.password?.reset();
            this.passwordConfirm?.reset();
            this.switchMode();
          } else {
            let message = "Something went wrong with your signup, please try again.";

            if (result && result[Constants.ERROR] && result[Constants.ERROR][Constants.ERROR]) {
              message = result[Constants.ERROR][Constants.ERROR];
            }

            this.toastr.error("Something went wrong with your signup, please try again.", "Signup Failure");
          }
        },
        error: (result: any) => {
          let message = "Something went wrong with your signup, please try again.";

          if (result && result[Constants.ERROR] && result[Constants.ERROR][Constants.ERROR]) {
            message = result[Constants.ERROR][Constants.ERROR];
          }

          this.toastr.error("Something went wrong with your signup, please try again.", "Signup Failure");
        }
      });  
    } else if (this.data.mode === Constants.SIGNIN) {
      this.authService.signIn(config).subscribe({
        next: (result: any) => {
          if (
            result && 
            result[Constants.RESULT] && 
            result[Constants.RESULT] === Constants.SUCCESS &&
            Utils.isNotNullOrUndefined(result[Constants.USER_ID])
          ) {
            this.authService.setSignedIn(true, result[Constants.USER_ID]);
            this.toastr.success("You have successfully signed in to User Manager.", "Signin Success");
            this.signupSigninForm?.reset();
            this.dialogRef.close();
            this.router.navigateByUrl(Constants.ROUTER_URLS.USER_PROFILE);
          } else {
            this.email?.reset();
            this.password?.reset();
            this.passwordConfirm?.reset();

            let message = "Something went wrong when signing in, please try again.";

            if (result && result[Constants.ERROR] && result[Constants.ERROR][Constants.ERROR]) {
              message = result[Constants.ERROR][Constants.ERROR];
            }

            this.toastr.error(message, "Signin Failure");
          }
        },
        error: (result: any) => {
          this.email?.reset();
          this.password?.reset();
          this.passwordConfirm?.reset();

          let message = "Something went wrong when signing in, please try again.";

          if (result && result[Constants.ERROR] && result[Constants.ERROR][Constants.ERROR]) {
            message = result[Constants.ERROR][Constants.ERROR];
          }

          this.toastr.error(message, "Signin Failure");
      }
      });  
    }
  }

  forgotPassword() {
    console.log("forgot password");
  }

  disableButtons() {
    let disabled = true;
    const emailInvalid = Utils.isInvalid(this.email);
    const passwordInvalid = Utils.isInvalid(this.password);
    const formInvalid = Utils.isInvalid(this.signupSigninForm);

    if (this.data.mode === Constants.SIGNUP) {
      disabled = (emailInvalid || passwordInvalid || formInvalid);
    } else if (this.data.mode === Constants.SIGNIN) {
      disabled = (emailInvalid || passwordInvalid);
    }

    return disabled;
  }
}
