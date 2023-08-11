import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AppComponent } from './app.component';
import { AppHeader } from "./components/app-header/app-header.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { MessageDialogComponent } from "./components/common/message-dialog/message-dialog.component";
import { SignupSigninComponent } from "./components/signup-signin/signup-signin.component";
import { UserManagerText } from "./components/shared/user-manager-text/user-manager-text.component";
import { UserProfileComponent } from "./components/pages/user-profile/user-profile.component";

@NgModule({
  declarations: [
    AppComponent,
    AppHeader,
    HomeComponent,
    MessageDialogComponent,
    SignupSigninComponent,
    UserManagerText,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
