# angular-user-mgmt
A simple Angular 15 application with UI, and backend infrastructure for typical user management operations:
- signup (registration) via email/password
- signin (login)
- forgot password (send user email with link to reset password)
- update profile page information (name, address, email, password, profile photo, etc)
- NodeJS, Express, MongoDB, Mongoose
- JWT delivered vis httpOnly, secure cookie
- https and mkcert ssl certificate

The goal of this repository is to provide an example of user management in a modern web application. 
### The code in this repository is example code, and is not production ready. Use it at your own risk. Enhance this code and perform all necessary tests to ensure it is secure and bug free if you use it in your projects.

## Frontend
The frontend is created using these technologies:
- [Angular 15.2](https://angular.io)
- [Angular Material](https://material.angular.io)
- [ngx-toastr](https://www.npmjs.com/package/ngx-toastr)
- [SASS (for styling, supercharged CSS)](https://sass-lang.com)
- [TypeScript](https://www.typescriptlang.org)

The application includes these architectural features:
- [Angular routing](https://angular.io/guide/routing-overview)
- Guard (for routes requiring login)
- [Angular routing](https://angular.io/guide/routing-overview)
- [Constants files](https://github.com/glafrance/angular-user-mgmt/blob/main/client/user-mgmt/src/app/constants/constants.ts)
- [Utility files](https://github.com/glafrance/angular-user-mgmt/tree/main/client/user-mgmt/src/app/utils)
- [Services (auth service, http service, local storage service, user service, etc.)](https://github.com/glafrance/angular-user-mgmt/tree/main/client/user-mgmt/src/app/services)
- [Components (common components, page components, page template components, sub-components, etc.)](https://github.com/glafrance/angular-user-mgmt/tree/main/client/user-mgmt/src/app/components)
