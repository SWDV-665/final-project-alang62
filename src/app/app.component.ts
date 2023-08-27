import { Component, OnInit } from '@angular/core';
import { LockoutService } from './services/lockout.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { ToastController } from '@ionic/angular';
import { AppModule } from './app.module';
declare var navigator: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'My Ionic Lock Screen';
  pin: string = '';
  isDeviceLocked = false;
  storedPin = '';

  constructor(private lockoutService: LockoutService, private navController: NavController, private toastController: ToastController, private appModule: AppModule) {}
  
  ngOnInit(): void {
    this.initializeApp();
    document.addEventListener('deviceready', () => {
      navigator.splashscreen.hide()
    });
  }

  async initializeApp() {
  const storedPin = await Storage.get({ key: 'pin' });

  if (!storedPin.value) {
    // User has not set a PIN yet, prompt to set a PIN
    const userEnteredPin = prompt('Please set your PIN:');
    if (userEnteredPin) {
      await Storage.set({ key: 'pin', value: userEnteredPin });
      this.storedPin = userEnteredPin; // Set the storedPin property
    }
  } else {
    this.storedPin = storedPin.value; // Set the storedPin property if it already exists
  }
}



  onPinInput(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value;
    console.log('onPinInput called. Value:', value);
    this.pin = value;

  }

  lockScreen() {
    console.log('Lock Screen Button Clicked');
    this.isDeviceLocked = true;
    this.lockoutService.lockScreen();
  }
  
  async isLocked() {
    console.log('Check if Locked Button Clicked');
    const isLocked = await this.lockoutService.isLocked();
    console.log('isLocked:', isLocked);
  }

  addNumber(number: number) {
    if (this.pin.length < 4) {
      this.pin += number.toString();
    }
  }
  
  clearNumber() {
    this.pin = '';
  }
  
  removeNumber() {
    this.pin = this.pin.slice(0, -1);
  }

  public async unlock(): Promise<void> {
  
    if (this.pin === this.storedPin) {
      console.log('Correct PIN entered.');
      await Storage.remove({ key: 'pin' });
      await this.lockoutService.unlockScreen();
      this.navController.navigateRoot('/');
      this.presentSuccessToast();
      this.isDeviceLocked = false;
      console.log('this.pin =', this.pin); ///For developer purposes, to see if PIN matches input field
      console.log('storedPin =', this.storedPin) ///For developer purposes, to see if PIN matches storedPIN from initialization
    }else {
      console.log('Incorrect PIN entered.');
      this.presentErrorToast();
      console.log('this.pin =', this.pin); ///For developer purposes, to see if PIN matches input field
      console.log('storedPin =', this.storedPin) ///For developer purposes, to see if PIN matches storedPIN from initialization)
    }
  }
  
  async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Success',
      duration: 3000, // Display for 3 seconds
      color: 'success', // Use success color
      position: 'bottom' // Position at the bottom
    });
    toast.present();
  }
  
  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Entered PIN is incorrect, please try again!',
      duration: 3000, 
      color: 'danger',
      position: 'bottom' 
    });
    toast.present();
  }
  

}