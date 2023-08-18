import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "src/app/services/auth.service";
import Constants from "../../../../constants/constants";
import { UserService } from "src/app/services/user.service";
import Utils from "../../../../utils/utils";
import ValidationUtils from "src/app/utils/validationUtils";

@Component({
  selector: "app-response-reset-password",
  templateUrl: "./response-reset-password.component.html",
  styleUrls: ["./response-reset-password.component.scss"]
})
export class ResponseResetPasswordComponent implements OnInit {
  token?: string;
  forgotPasswordForm: FormGroup = new FormGroup({
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
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.route && this.route.snapshot && this.route.snapshot.params && this.route.snapshot.params["token"]) {
      this.token = this.route.snapshot.params["token"];
    }

    this.forgotPasswordForm.addValidators([ValidationUtils.passwordsMatch(this.password, this.passwordConfirm)]);
  }

  get password() { return this.forgotPasswordForm.get("password") };
  get passwordConfirm() { return this.forgotPasswordForm.get("passwordConfirm") };

  submit() {
    if (this.password && this.password.value && this.token) {
      const password = this.password.value;
      const token = this.token;
      
      this.userService.validatePasswordToken(this.token).subscribe({
        next: (result: any) => {
          if (result && result[Constants.RESULT] && result[Constants.RESULT] === Constants.SUCCESS) {
            this.userService.getNewPassword(token, password).subscribe({
              next: (result: any) => {
                if (result && result[Constants.RESULT] && result[Constants.RESULT] === Constants.SUCCESS) {
                  this.toastr.success("Your password was successfully changed.", "Reset Password Success");
                  this.password?.reset();
                  this.passwordConfirm?.reset();
                  this.authService.showSignupSignin(Constants.SIGNIN);
                } else {
                  this.toastr.error("Something went wrong resetting your password, please try again. Reset password links are valid for one hour.", "Reset Password Failure");
                }
              },
              error: (result: any) => {
                this.toastr.error("Something went wrong resetting your password, please try again. Reset password links are valid for one hour.", "Reset Password Failure");
              }
            });        
          }
        },
        error: (err: any) => {
          this.toastr.error("Something went wrong resetting your password, please try again. Reset password links are valid for one hour.", "Reset Password Failure");
        }
      });
    }
  }

  disableButtons() {
    let disabled = true;
    const passwordInvalid = Utils.isInvalid(this.password);
    const formInvalid = Utils.isInvalid(this.forgotPasswordForm);

    disabled = (passwordInvalid || formInvalid);

    return disabled;
  }
}
