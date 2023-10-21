import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
/*import { UserProfile } from '@angular/fire/auth';*/
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/models/user-profile';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersFirebaseService } from 'src/app/services/users-firebase.service';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  checked = false;
  user: UserProfile = new UserProfile;
  sighUpSuccess: boolean | null = null;

  constructor(private authService: AuthenticationService,
    private router: Router,
    private usersFbService: UsersFirebaseService,
    private auth: Auth,
    private notificationService: NotificationService,
  ) {
  }

  signUpForm: any = new FormGroup({
    "name": new FormControl('', [Validators.required, Validators.minLength(3)]),
    "email": new FormControl('', [Validators.email, Validators.required]),
    "password": new FormControl('', [Validators.required, Validators.minLength(6)]),
    "agreement": new FormControl(false, [Validators.requiredTrue])
  })

  get name() {
    return this.signUpForm.get('name');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }


  submit() {
    if (!this.signUpForm.valid || !this.signUpForm.get('agreement').value) {
      return;
    }
    const { name, email, password } = this.signUpForm.value;
    this.fillUserObject(name, email);

    this.authService.signUp(name, email, password, this.user)
      .subscribe(() => {
        this.sighUpSuccess = true;
        this.openSnackBar();
        setTimeout(() => {
          this.router.navigate([`/choose-avatar`]);
        }, 2000);
      })
  }

  fillUserObject(name: string, email: string) {
    this.user.email = email;
    this.user.name = name;
  }


  openSnackBar() {
    if (this.sighUpSuccess == true) {
      this.notificationService.showSuccess('Registrierung erfolgreich')
    } else {
      this.notificationService.showError('Registrierung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben')
    }
  }

}
