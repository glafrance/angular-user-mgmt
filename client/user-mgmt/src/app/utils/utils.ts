import Constants from "../constants/constants";

export default class Utils {
  public static isNotNullOrUndefined(value: any) {
    let retVal = (
      value !== null &&
      value !== undefined
    );

    return retVal;
  }

  public static isNotNullOrUndefinedOrEmpty(value: any) {
    let retVal = (
      value !== null &&
      value !== undefined &&
      value !== ""
    );

    if (retVal && value["isArray"]) {
      retVal = value.length      
    }

    return retVal;
  }

  public static isNullOrUndefinedOrEmpty(value: any) {
    let retVal = (
      value === null ||
      value === undefined ||
      value === ""
    );

    if (!retVal && value["isArray"]) {
      retVal = !value.length      
    }

    return retVal;
  }

  public static isInvalid(item: any) {
    return (item && item.status === Constants.INVALID);  
  }
}