import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: "app-message-dialog",
  templateUrl: "./message-dialog.component.html",
  styleUrls: ["./message-dialog.component.scss"]
})
export class MessageDialogComponent implements OnInit {
  title: string = "";
  message: string = "";

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