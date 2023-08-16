export default class Constants {
  public static ROUTER_URLS = {
    EMPTY: "/",
    HOME: "home",
    USER_PROFILE: "user-profile"
  };

  public static SIGNIN = "Signin";
  public static SIGNUP = "Signup";
  public static USER_MANAGER = "User Manager";
  public static USER_ID = "userId";
  public static DATA = "data";
  public static BIO_BLURB = "bioBlurb";

  public static INVALID = "INVALID";

  public static BASE_URL = "http://localhost:4002";

  public static HTTP_METHODS = {
    GET: "get",
    POST: "post",
    DELETE: "delete",
    PUT: "put"
  };

  public static API_ENDPOINTS = {
    PROFILE: "user/profile",
    PROFILE_IMAGE: "user/profile_image",
    SIGNUP: "user/signup",
    SIGNIN: "user/signin"
  };

  // Response flags
  public static RESULT = "result";
  public static SUCCESS = "success";
  public static FAILURE = "failure";
  public static ERROR = "error";

  // Local storage keys
  public static SIGNED_IN_LOCAL_STORAGE_KEY = "signed_in";
  public static USER_ID_LOCAL_STORAGE_KEY = "userId";
}