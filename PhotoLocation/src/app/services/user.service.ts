import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User;

  constructor() {}

  public set(_user: User) {
    this.user = _user;
  }

  public get(): User {
    return this.user
  }
}
