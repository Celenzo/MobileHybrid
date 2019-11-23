import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { Picture } from '../classes/picture';
import { UserService } from './user.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  private gallery: Picture[] = [];

  constructor(private nativeStorage: NativeStorage, private userService: UserService, private geolocation: Geolocation) {
    this.loadStoredPictures();
  }

  public loadStoredPictures() {
    const user = this.userService.get();
    if (user && user.id) {
      this.nativeStorage.getItem(`mbhyb:${user.id}:pictures`).then(_gallery => {
        this.gallery = JSON.parse(_gallery) || [];
      }); 
    }
  }

  public addPicture(_data) {
    this.geolocation.getCurrentPosition().then(res => {
      const picture = {
        data:'data:image/jpeg;base64,' + _data,
        location: {
          latitude: res.coords.latitude,
          longitude: res.coords.longitude
        }
      }

      const user = this.userService.get();
      this.gallery.unshift(picture);
      this.nativeStorage.setItem(`mbhyb:${user.id}:pictures`, JSON.stringify(this.gallery));
    });
  }

  public getPictures(): Picture[] {
    return this.gallery;
  }

  public deletePicture(_data) {
    this.gallery = this.gallery.filter(elem => elem.data != _data)
  }
}
