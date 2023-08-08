import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Form, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Constants from "../constants/constants";

@Component({
  selector: "app-signup-signin",
  templateUrl: "./signup-signin.component.html",
  styleUrls: ["./signup-signin.component.scss"]
})
export class SignupSigninComponent implements OnInit {
  mode: string = "";
  title: string = "";
  signupSigninButtonText: string = "";
  switchSignupSigninMessage: string = "";
  switchActionMessage: string = "";

  signupSigninForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    passwordConfirm: new FormControl("")
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.setDynamicText();
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
      if (this.data.mode === Constants.SIGNUP) {
        this.data.mode = Constants.SIGNIN;
      } else if (this.data.mode === Constants.SIGNIN) {
        this.data.mode = Constants.SIGNUP;
      }
    }

    this.setDynamicText();
  }

  signupSignin() {
    console.log("signup/signin");
  }

  forgotPassword() {
    console.log("forgot password");
  }
}