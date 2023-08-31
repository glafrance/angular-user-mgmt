/* This component is currently not used, as we are now using ngx-toastr to 
    display messages to user, but leaving this component in the app as it could 
    come in handy for situations where ngx-toastr does not do what we want. 

    This is an Angular Material dialog:
        https://material.angular.io/components/dialog/overview 
*/

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: "app-message-dialog",
  templateUrl: "./message-dialog.component.html",
  styleUrls: ["./message-dialog.component.scss"]
})
export class MessageDialogComponent implements OnInit {
  /* This is a generic component, so you provide a title and message, 
      and user just clicks OK to close popup. They can also click 
      anywhere in the app outside the popup to close it. 
  */
  title: string = "";
  message: string = "";

  /* dialogRef is used to programmatically close the popup.
     data here is the data that is injected into this popup
     when you use it.
  
     See this method in auth.service.ts for how to launch this popup and pass it data
     (this example displays the signup/signin popup, which is similar to MessageDialogComponent):
         showSignupSignin(mode: string): void {
           this.dialog.open(SignupSigninComponent, {
             data: { mode },
             autoFocus: false
           }); 
         } 
  */
  constructor(
    private dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      if (this.data.title && this.data.message) {
        this.title = this.data.title;
        this.message = this.data.message;
      } else {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }
}