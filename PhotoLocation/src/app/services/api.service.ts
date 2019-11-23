import { Injectable } from '@angular/core';

import { HTTP } from '@ionic-native/http/ngx';

import { Config } from '../classes/config';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  private headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8", 
    'Accept': 'application/json, text/plain',
    "cache-control": "no-cache", 
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Accept, Authorization, X-Request-With, Access-Control-Request-Method, Access-Control-Request-Headers",
    "Access-Control-Allow-Credentials" : "true",
    "Access-Control-Allow-Methods" : "GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT",  
  };

  constructor(private http: HTTP) {

  }

  public login(username: string, password: string) {
    return this.http.post(`${Config.apiUrl}/user/auth/login`, { username, password }, this.headers);
  }

  public register(username: string, password: string, fbtoken: string) {
    return this.http.post(`${Config.apiUrl}/user/auth/register`, { username, password, fbtoken }, this.headers);
  }
}
