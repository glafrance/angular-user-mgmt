import { Component, Input } from "@angular/core";

@Component({
  selector: "app-user-manager-text",
  templateUrl: "./user-manager-text.component.html",
  styleUrls: ["./user-manager-text.component.scss"]
})
export class UserManagerText {
  @Input() textFontSize: string = "20px";
}