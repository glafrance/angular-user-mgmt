import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { Router, UrlTree } from "@angular/router";

import { AuthService } from "../services/auth.service";
import Constants from "../constants/constants";

export const signedInGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const isSignedIn = inject(AuthService).getSignedIn();

  // 👇 Redirects to another route
  if (!isSignedIn) {
    return inject(Router).createUrlTree([Constants.ROUTER_URLS.EMPTY, Constants.ROUTER_URLS.HOME]);
  }

  return true;
};