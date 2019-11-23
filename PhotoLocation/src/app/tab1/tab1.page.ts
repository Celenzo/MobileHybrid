import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AlertController, NavController, Platform } from '@ionic/angular';

import { APIService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { User } from '../classes/user';
import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private user: User = null;

  private token: string;

  private loginForm: FormGroup;
  private loginUsernameInput: FormControl;
  private loginPasswordInput: FormControl;

  private registerForm: FormGroup;
  private registerUsernameInput: FormControl;  
  private registerPasswordInput: FormControl;
  private registerValidatePwdInput: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private alertController: AlertController,
    private userService: UserService,
    private navController: NavController,
    private fcm: FCM,
    private platform: Platform,
    private localNotifications: LocalNotifications
  ) {

    this.fcm.getToken().then(_token => {
      this.token = _token;
    });

    this.fcm.onTokenRefresh().subscribe(_token => {
      this.token = _token;
    });

    this.fcm.onNotification().subscribe(data => {
      if (!data.wasTapped) {
        this.localNotifications.schedule({
          id: 1,
          text: data.body,
          title: data.title
        })
      }
    });

    this.user = this.userService.get();
    if (this.user) {
      this.navController.pop();
      this.navController.navigateForward('tabs/tab2');
      return;
    }

    this.loginUsernameInput = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]);
    this.loginPasswordInput = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]);
    this.loginForm = this.formBuilder.group({
      loginUsernameInput: this.loginUsernameInput,
      loginPasswordInput: this.loginPasswordInput
    });

    this.registerUsernameInput = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]);
    this.registerPasswordInput = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]);
    this.registerValidatePwdInput = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]);
    this.registerForm = this.formBuilder.group({
      registerUsernameInput: this.registerUsernameInput,
      registerPasswordInput: this.registerPasswordInput,
      registerValidatePwdInput: this.registerValidatePwdInput
    });
  }

  private login() {
    this.apiService.login(this.loginUsernameInput.value, this.loginPasswordInput.value).then((res: any) => {
      this.user = res;
      this.userService.set(res);
      this.navController.pop();
      this.navController.navigateForward('/tabs/tab2');
    }).catch(async (err) => {
      const message = () => {
        switch (err.status) {
          case 404: return 'This account does not exists, please try again'
          case 403: return 'Password incorrect'
          case 500: return 'Server error'
          default: return 'An unidentified error has occured'
        }
      };

      const alert = await this.alertController.create({
        header: 'Login error',
        message: message(),
        buttons: [
          { text: 'OK', role: 'Cancel', handler: () => {} }
        ]
      });
      await alert.present();
      throw err;
    });
  }

  private register() {
    this.apiService.register(this.registerUsernameInput.value, this.registerPasswordInput.value, this.token).then((res: any) => {
      this.user = res;
      this.userService.set(res);
      this.navController.pop();
      this.navController.navigateForward('/tabs/tab2');
    }).catch(async err => {
      const message = () => {
        switch (err.status) {
          case 403: return 'This username is already in use'
          case 500: return 'Server error'
          default: return 'An unidentified error has occured'
        }
      }

      const alert = await this.alertController.create({
        header: 'Registration error',
        message: message(),
        buttons: [
          { text: 'OK', role: 'Cancel', handler: () => {} }
        ]
      });
      await alert.present();
      throw err;
    });
  }

}
