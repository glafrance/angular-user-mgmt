import { Component } from "@angular/core";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"]
})
export class UserProfileComponent {
  title: string = "Profile Page";
  subTitle: string = "Manage your information and settings on this page";
}