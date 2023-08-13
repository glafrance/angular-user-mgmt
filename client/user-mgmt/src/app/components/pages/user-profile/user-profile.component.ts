import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import Utils from "src/app/utils/utils";
import ValidationUtils from "src/app/utils/validationUtils";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"]
})
export class UserProfileComponent implements OnInit {
  title: string = "Profile Page";
  subTitle: string = "Manage your information and settings on this page";
  formDataChanged: boolean = false;
  bioBlurb: any = {
    touched: false,
    errors: {
      minlength: false,
      maxLength: false
    }
  };

  originalData: any = {
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    homePhone: "",
    mobilePhone: "",
    workPhone: "",
    bioBlurb: ""
  };

  userProfileForm: FormGroup = new FormGroup({
    email: new FormControl("", [
      Validators.email
    ]),
    password: new FormControl("", [
      Validators.minLength(8),
      Validators.maxLength(15),
      Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}/)
    ]),
    passwordConfirm: new FormControl(""),
    firstName: new FormControl("", [Validators.maxLength(30)]),
    lastName: new FormControl("", [Validators.maxLength(30)]),
    address: new FormControl("", [Validators.maxLength(50)]),
    address2: new FormControl("", [Validators.maxLength(30)]),
    city: new FormControl("", [Validators.maxLength(30)]),
    state: new FormControl("", [Validators.maxLength(2)]),
    postalCode: new FormControl("", [Validators.maxLength(10)]),
    homePhone: new FormControl("", [Validators.maxLength(10)]),
    mobilePhone: new FormControl("", [Validators.maxLength(10)]),
    workPhone: new FormControl("", [Validators.maxLength(10)])
  });

  ngOnInit(): void {
    this.userProfileForm.addValidators([ValidationUtils.passwordsMatch(this.password, this.passwordConfirm)]);
  }

  get email() { return this.userProfileForm.get("email") };
  get password() { return this.userProfileForm.get("password") };
  get passwordConfirm() { return this.userProfileForm.get("passwordConfirm") };
  get firstName() { return this.userProfileForm.get("firstName") };
  get lastName() { return this.userProfileForm.get("lastName") };
  get address() { return this.userProfileForm.get("address") };
  get address2() { return this.userProfileForm.get("address2") };
  get city() { return this.userProfileForm.get("city") };
  get state() { return this.userProfileForm.get("state") };
  get postalCode() { return this.userProfileForm.get("postalCode") };
  get homePhone() { return this.userProfileForm.get("homePhone") };
  get mobilePhone() { return this.userProfileForm.get("mobilePhone") };
  get workPhone() { return this.userProfileForm.get("workPhone") };

  dataChanged(evt: any, field: string) {
    const value = evt.target.value;    
    const originalValue = this.originalData[field];

    this.formDataChanged = (value !== originalValue);

    if (field === "bioBlurb" && Utils.isNotNullOrUndefined(value)) {
      this.bioBlurb.errors.minlength = value.length < 50;
      this.bioBlurb.errors.maxlength = value.length > 1000;
    }
  }

  disableButton() {
    let disabled = true;

    disabled = (
      !this.formDataChanged || 
      this.userProfileForm.invalid ||
      this.bioBlurb.errors.minlength ||
      this.bioBlurb.errors.maxlength
    );

    return disabled;
  }

  submitUserProfile() {

  }

  onBioBlurbBlur() {
    this.bioBlurb.touched = true;
  }
}