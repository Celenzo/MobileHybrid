import { Component } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { GoogleMap, GoogleMaps, Marker } from '@ionic-native/google-maps/ngx';
import { GalleryService } from '../services/gallery.service';
import { Picture } from '../classes/picture';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  map: GoogleMap
  private gallery: Picture[];

  constructor(
    private alertController: AlertController,
    private userService: UserService,
    private navController: NavController,
    private platform: Platform,
    private galleryService: GalleryService,
    private geolocation: Geolocation
  ) {

    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then(res => {
        const mapOptions = {
          camera: {
            target: {
              lat: res.coords.latitude,
              lng: res.coords.longitude
            },
            zoom: 18
          }
        };
        this.map = GoogleMaps.create('map_content', mapOptions);
        this.loadMarkers();
      });
    });
  }

  ionViewWillEnter() {
    this.checkUserInfo();
    this.gallery = this.galleryService.getPictures();

    if (this.map) {
      this.loadMarkers();
    }
  }

  private loadMarkers() {
    this.gallery.forEach(pic => {
      let marker: Marker = this.map.addMarkerSync({
        title: 'Picture',
        icon: 'blue',
        animation: 'DROP',
        position: {
          lat: pic.location.latitude,
          lng: pic.location.longitude
        }
      })
      marker.showInfoWindow();
    });
  }

  private async checkUserInfo() {
    if (!this.userService.get()) {
      const alert = await this.alertController.create({
        header: 'Not connected',
        message: 'Please login to the app',
        buttons: [
          { text: 'ok', role: 'cancel', handler: () => {} }
        ]
      });
      await alert.present();
      this.navController.pop();
      this.navController.navigateBack('/tabs/tab1');
      return ;
    }
  }
}
