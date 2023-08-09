import { ValidationErrors, ValidatorFn } from "@angular/forms";

import Utils from "./utils";

export default class ValidationUtils {
  public static passwordsMatch(passwordControl: any, passwordConfirmControl: any): ValidatorFn {
    return () : ValidationErrors | null => {
      if (
        Utils.isNotNullOrUndefined(passwordControl) && 
        Utils.isNotNullOrUndefined(passwordConfirmControl)
      ) {
        const passwordValue = passwordControl.value;
        const passwordConfirmValue = passwordConfirmControl.value;
        const match = (passwordValue === passwordConfirmValue);
  
        return match ? null : { passwordsDoNotMatch: true };  
      }

      return null;
    }
  }
}