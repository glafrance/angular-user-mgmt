import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import Constants from "./constants/constants";
import { HomeComponent } from "./components/pages/home/home.component";
import { signedInGuard } from "./guards/signedIn.guard";
import { UserProfileComponent } from "./components/pages/user-profile/user-profile.component";

const routes: Routes = [
  { path: "", redirectTo: Constants.ROUTER_URLS.HOME, pathMatch: "full" },
  { path: Constants.ROUTER_URLS.HOME, component: HomeComponent },
  { 
    path: Constants.ROUTER_URLS.USER_PROFILE, 
    component: UserProfileComponent,
    canActivate: [signedInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
