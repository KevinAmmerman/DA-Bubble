import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ChannelChatComponent } from './main/channels/channel-chat/channel-chat.component';
import { NewMessageComponent } from './main/new-message/new-message.component';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import { AuthenticationService } from './services/authentication.service';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChooseAvatarComponent } from './auth/choose-avatar/choose-avatar.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ChatComponent } from './main/chat/chat.component';
import { StartAnimationComponent } from './auth/start-animation/start-animation.component';

let docId: any;

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectAuthorizedToMain = () => redirectLoggedInTo([`main`]);

const routes: Routes = [
  { path:'', pathMatch: 'full', component: StartAnimationComponent },
  { path: 'main', component: MainComponent,
    children: [
      { path: 'channel/:channelId', component: ChannelChatComponent },
      { path: 'message', component: NewMessageComponent },
      { path: 'chat', component: ChatComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forget-password', component: ForgetPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'choose-avatar', component: ChooseAvatarComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private authService: AuthenticationService) {
    const user = this.authService.getCurrentUser();
    if (user) {
      docId = user.uid; // used Firebase Authentication ID as user-ID
    }
  }
}


