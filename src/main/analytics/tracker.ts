/* eslint-disable global-require */
/* eslint-disable class-methods-use-this */
// src/tracker/Tracker.ts
import os from 'os';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { collection, doc, setDoc } from 'firebase/firestore';
import { UserData } from 'types/analytics';
import { getStore } from '../store';
import { database } from './firebase';

const store = getStore();

class Tracker {
  private appVersion: string;

  private osInfo: string;

  private isOnline: boolean;

  private data: Partial<UserData> = {};

  constructor() {
    this.appVersion = this.getAppVersion();
    this.osInfo = this.getOS();
    this.isOnline = true;

    // Load or initialize local data from electron-store under "tracker" key
    this.data = this.loadLocalData();

    // Update session data
    this.updateSessionData()
      .then(() => {
        // Save local data after updating
        this.saveLocalData();

        // Send data to Firestore
        this.sendDataToFirestore().catch((error) => {
          console.error('Error sending data to Firestore:', error);
        });
      })
      .catch(console.log);
  }

  private getAppVersion(): string {
    try {
      const packageJson = require('../../../package.json');
      return packageJson.version || 'unknown';
    } catch (error) {
      console.error('Error reading package.json:', error);
      return 'unknown';
    }
  }

  private getOS(): string {
    const platform = os.platform();
    const release = os.release();
    return `${platform} ${release}`;
  }

  private async getUserIP(): Promise<string> {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'unknown';
    }
  }

  private loadLocalData(): Partial<UserData> {
    // Load data from electron-store under the "tracker" key, or initialize if missing
    const trackerData = store.get('tracker', {
      userId: uuidv4(),
      appVersion: this.appVersion,
      userIp: 'unknown',
      os: this.osInfo,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      numberOfSessions: 0,
      isOnline: this.isOnline,
    });

    return trackerData as Partial<UserData>;
  }

  private saveLocalData(): void {
    // Save data to electron-store under the "tracker" key
    store.set('tracker', {
      userId: this.data.userId,
      appVersion: this.data.appVersion,
      userIp: this.data.userIp,
      os: this.data.os,
      firstSeen: this.data.firstSeen,
      lastSeen: this.data.lastSeen,
      numberOfSessions: this.data.numberOfSessions,
      isOnline: this.data.isOnline,
    });
  }

  private async updateSessionData(): Promise<void> {
    const currentTime = new Date().toISOString();

    if (!this.data.firstSeen) {
      this.data.firstSeen = currentTime;
      this.data.numberOfSessions = 1;
    } else {
      this.data.numberOfSessions = (this.data.numberOfSessions || 0) + 1;
    }

    this.data.lastSeen = currentTime;

    // Fetch user IP if not already fetched
    if (!this.data.userIp || this.data.userIp === 'unknown') {
      this.data.userIp = await this.getUserIP();
    }

    // Generate userId if not present
    if (!this.data.userId) {
      this.data.userId = uuidv4();
    }
  }

  private async sendDataToFirestore(): Promise<void> {
    const userId = this.data.userId as string;

    const userRef = doc(collection(database, 'users'), userId);

    const userData: UserData = {
      userId,
      appVersion: this.appVersion,
      userIp: this.data.userIp || 'unknown',
      os: this.osInfo,
      firstSeen: this.data.firstSeen || new Date().toISOString(),
      lastSeen: this.data.lastSeen || new Date().toISOString(),
      numberOfSessions: this.data.numberOfSessions || 1,
      isOnline: this.isOnline,
    };

    try {
      await setDoc(userRef, userData, { merge: true });
      console.log('User data successfully stored/updated.');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }
}

export default Tracker;