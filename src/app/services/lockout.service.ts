import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { App } from '@capacitor/app';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LockoutService {
  private locked = false;
  private manuallyLocked = false;

  constructor(private navController: NavController, private router: Router) { 
    this.initializeLockState();
  }

  async initializeLockState() {
    const locked = await this.isLocked();
    this.locked = locked;
  }

  public async setLockoutPeriod(startTime: number, endTime: number): Promise<void> {
    await Storage.set({
      key: 'startTime',
      value: startTime.toString(),
    });
    await Storage.set({
      key: 'endTime',
      value: endTime.toString(),
    });
  }

  public async isTimeLockedOut(): Promise<boolean> {
    const storageStartTime = await Storage.get({ key: 'startTime' });
    const storageEndTime = await Storage.get({ key: 'endTime' });
    const startTime = parseInt(storageStartTime?.value || '0', 10);
    const endTime = parseInt(storageEndTime?.value || '0', 10);
    const now = new Date().getTime();
    return now >= startTime && now <= endTime;
  }

  public async lockScreen(): Promise<void> {
    await Storage.set({
      key: 'locked',
      value: 'true'
    });
    this.locked = true;
    this.manuallyLocked = true;
  }

  async isLocked(): Promise<boolean> {
    if (this.manuallyLocked) { // Check the flag
      return true;
    }

    const locked = await Storage.get({ key: 'locked' });
    return !!locked && locked.value === 'true';
  }

  async unlockScreen(): Promise<void> {
    await Storage.remove({ key: 'locked' });
    this.locked = false;
  }
}