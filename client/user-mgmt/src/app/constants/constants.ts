export default class Constants {
  public static ROUTER_URLS = {
    EMPTY: "/",
    HOME: "home",
    USER_PROFILE: "user_profile"
  };

  public static SIGNIN = "Signin";
  public static SIGNUP = "Signup";
  public static USER_MANAGER = "User Manager";

  public static INVALID = "INVALID";

  public static BASE_URL = "http://localhost:4002";

  public static HTTP_METHODS = {
    GET: "get",
    POST: "post",
    DELETE: "delete",
    PUT: "put"
  };

  public static API_ENDPOINTS = {
    SIGNUP: "user/signup",
    SIGNIN: "user/signin"
  };

  // Response flags
  public static RESULT = "result";
  public static SUCCESS = "success";
  public static FAILURE = "failure";
  public static ERROR = "error";
}