import { Component } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { GalleryService } from '../services/gallery.service';
import { Picture } from '../classes/picture';
import { User } from '../classes/user';
import { UserService } from '../services/user.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  private gallery: Picture[];

  constructor(
    private cameraProvider: Camera,
    public galleryService: GalleryService,
    private userService: UserService,
    private alertController: AlertController,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.checkUserInfo();
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
    this.gallery = this.galleryService.getPictures();
  }

  private picture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.cameraProvider.DestinationType.DATA_URL,
      encodingType: this.cameraProvider.EncodingType.JPEG,
      mediaType: this.cameraProvider.MediaType.PICTURE
    };

    this.cameraProvider.getPicture(options)
      .then(newPic => {
        this.galleryService.addPicture(newPic)
        this.gallery = this.galleryService.getPictures()
      }, err => {
        throw err;
      });
  }

}
