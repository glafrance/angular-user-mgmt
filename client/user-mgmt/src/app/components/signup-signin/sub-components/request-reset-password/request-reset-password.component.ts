import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from "ngx-toastr";

import Constants from "../../../../constants/constants";
import { UserService } from "src/app/services/user.service";
import Utils from "../../../../utils/utils";

@Component({
  selector: "app-request-reset-password",
  templateUrl: "./request-reset-password.component.html",
  styleUrls: ["./request-reset-password.component.scss"]
})
export class RequestResetPasswordComponent {
  resetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl("", [
      Validators.required, 
      Validators.email
    ])
  });

  constructor(
    private dialogRef: MatDialogRef<RequestResetPasswordComponent>,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  get email() { return this.resetPasswordForm.get("email") };

  requestPasswordReset() {
    if (this.email && Utils.isNotNullOrUndefinedOrEmpty(this.email?.value)) {
      this.userService.requestResetPassword(this.email.value).subscribe({
        next: (result: any) => {
          this.dialogRef.close();

          if (result && result[Constants.RESULT] && result[Constants.RESULT] === Constants.SUCCESS) {
            this.toastr.success("If the email you submitted is in our system, an email with a link to reset password was sent. Check your Inbox, and if it is not there, check your spam or junk folders.", "Password Reset Email Sent");
          } else {
            this.toastr.error("Something went wrong with your password reset, please try again.", "Password Reset Failure");
          }
        },
        error: (result: any) => {
          this.dialogRef.close();
          this.toastr.error("Something went wrong with your password reset, please try again.", "Password Reset Failure");
        }
      });    
    }
  }

  disableButtons() {
    let disabled = true;
    const emailInvalid = Utils.isInvalid(this.email);
    const formInvalid = Utils.isInvalid(this.resetPasswordForm);

    disabled = (emailInvalid || formInvalid);

    return disabled;
  }
}
