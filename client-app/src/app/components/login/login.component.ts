import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private validateService: ValidateService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };
    if (!this.validateService.validateLogin(user)) {
      this.flashMessage.show("Please fill all fields", { cssClass: "alert alert-danger" });
      return;
    }
    this.authService.authenticateUser(user).subscribe((data: any) => {
      if (data.status == "success") {
        this.authService.storeUserData(data);
        this.router.navigate(['dashboard']);
      } else {
        this.flashMessage.show(data.message);
      }
    })
  }
}
