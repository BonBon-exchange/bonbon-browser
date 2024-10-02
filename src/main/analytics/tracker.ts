/* eslint-disable no-else-return */
/* eslint-disable global-require */
/* eslint-disable class-methods-use-this */
// src/tracker/Tracker.ts
import os from 'os';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import {
  collection,
  doc,
  setDoc,
  Timestamp,
  writeBatch,
  getDoc, // Added import
} from 'firebase/firestore';
import { UserData } from 'types/analytics';
import { database } from './firebase';

class Tracker {
  private appVersion: string;

  private osInfo: string;

  private data: Partial<UserData> = {};

  private userId: string;

  private consent: boolean;

  private eventQueue: Array<{
    eventType: string;
    eventData?: Record<string, any>;
    timestamp: string;
  }> = [];

  // eslint-disable-next-line no-undef
  private batchInterval: NodeJS.Timeout | undefined;

  private batchSize: number = 100; // Adjust as needed

  private maxBatchInterval: number = 30000; // 30 seconds

  constructor() {
    // Initialize current app version and OS info
    this.appVersion = this.getAppVersion();
    this.osInfo = this.getOS();

    // Initialize or load user data
    this.userId = this.loadOrCreateUserId();
    this.consent = this.hasConsent();

    if (this.consent) {
      // Initialize tracking features
      this.initializeTracking();
    } else {
      console.log('User has not consented to tracking.');
    }

    // Start performance monitoring if consented
    if (this.consent) {
      this.startPerformanceMonitoring();
    }
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

  private validateUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  private loadOrCreateUserId(): string {
    // Define the path to the userId file within the userData directory
    const userDataPath = app.getPath('userData');
    const userIdFilePath = path.join(userDataPath, 'tracker_userId.txt');

    try {
      // Check if the userId file exists
      if (fs.existsSync(userIdFilePath)) {
        // Read the userId from the file
        const userId = fs.readFileSync(userIdFilePath, 'utf-8').trim();

        // Validate the userId (simple UUID format check)
        if (userId && this.validateUUID(userId)) {
          return userId;
        } else {
          console.warn('Invalid userId found. Generating a new one.');
        }
      }
    } catch (error) {
      console.error('Error reading userId file:', error);
    }

    // If userId doesn't exist or is invalid, generate a new one
    const newUserId = uuidv4();

    try {
      // Ensure the userData directory exists
      if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true });
      }

      // Write the new userId to the file
      fs.writeFileSync(userIdFilePath, newUserId, 'utf-8');
      console.log(`New userId generated and saved: ${newUserId}`);
    } catch (error) {
      console.error('Error writing userId file:', error);
    }

    return newUserId;
  }

  private hasConsent(): boolean {
    // Implement consent retrieval logic
    // For demonstration, assuming consent is given
    // Replace with actual consent management
    return true;
  }

  private initializeTracking(): void {
    // Update system information each time Tracker is instantiated
    this.updateSystemInfo();

    // Load existing user data from Firestore
    this.loadUserDataFromFirestore()
      .then(() => {
        // Update session data
        return this.updateSessionData();
      })
      .then(() => {
        // Send initial user data to Firestore
        return this.sendUserDataToFirestore();
      })
      .catch(console.error);

    // Start batch processing
    this.startBatchProcessing();
  }

  private updateSystemInfo(): void {
    // Update appVersion and OS info
    this.data.appVersion = this.appVersion;
    this.data.os = this.osInfo;
  }

  private async loadUserDataFromFirestore(): Promise<void> {
    const userRef = doc(collection(database, 'users'), this.userId);
    try {
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as UserData;
        this.data.firstSeen = userData.firstSeen;
        this.data.numberOfSessions = userData.numberOfSessions || 1;
        // Load other necessary fields if needed
        console.log('User data loaded from Firestore.');
      } else {
        // If user document doesn't exist, initialize firstSeen
        this.data.firstSeen = new Date().toISOString();
        this.data.numberOfSessions = 1;
        console.log('No existing user data found. Initializing new user data.');
      }
    } catch (error) {
      console.error('Error loading user data from Firestore:', error);
      // In case of error, initialize firstSeen
      this.data.firstSeen = new Date().toISOString();
      this.data.numberOfSessions = 1;
    }
  }

  private async updateSessionData(): Promise<void> {
    const currentTime = new Date().toISOString();

    // Update lastSeen
    this.data.lastSeen = currentTime;

    // Increment number of sessions if already present
    if (this.data.numberOfSessions) {
      this.data.numberOfSessions += 1;
    } else {
      this.data.numberOfSessions = 1;
    }

    // Fetch the latest IP address
    this.data.userIp = await this.getUserIP();

    // Initialize or update other user data as needed
  }

  private async sendUserDataToFirestore(): Promise<void> {
    const userRef = doc(collection(database, 'users'), this.userId);

    const userData: UserData = {
      userId: this.userId,
      appVersion: this.data.appVersion || 'unknown',
      userIp: this.data.userIp || 'unknown',
      os: this.data.os || 'unknown',
      firstSeen: this.data.firstSeen || new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      numberOfSessions: this.data.numberOfSessions || 1,
      consent: this.consent,
    };

    try {
      await setDoc(userRef, userData, { merge: true });
      console.log('User data successfully stored/updated.');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  // Event Logging
  public logEvent(eventType: string, eventData?: Record<string, any>): void {
    if (!this.consent) return; // Respect user consent

    const event = {
      eventType,
      eventData,
      timestamp: new Date().toISOString(),
    };

    this.eventQueue.push(event);

    if (this.eventQueue.length >= this.batchSize) {
      this.processEventBatch();
    }
  }

  // Batch Processing
  private startBatchProcessing(): void {
    this.batchInterval = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.processEventBatch();
      }
    }, this.maxBatchInterval);
  }

  private async processEventBatch(): Promise<void> {
    const batchEvents = this.eventQueue.splice(0, this.batchSize);
    await this.sendEventsToFirestore(batchEvents);
  }

  private async sendEventsToFirestore(
    events: Array<{
      eventType: string;
      eventData?: Record<string, any>;
      timestamp: string;
    }>
  ): Promise<void> {
    const { userId } = this;
    const eventsRef = collection(database, 'users', userId, 'events');

    const firestoreBatch = writeBatch(database);

    events.forEach((event) => {
      const eventDoc = doc(eventsRef);
      firestoreBatch.set(eventDoc, {
        eventType: event.eventType,
        eventData: event.eventData || {},
        timestamp: Timestamp.fromDate(new Date(event.timestamp)),
      });
    });

    try {
      await firestoreBatch.commit();
      console.log(
        `Batch of ${events.length} events successfully sent to Firestore.`
      );
    } catch (error) {
      console.error('Error sending events to Firestore:', error);
      // Optionally, re-queue events or implement retry logic
      // For simplicity, re-queueing failed events
      this.eventQueue.unshift(...events);
    }
  }

  // Performance Monitoring
  private startPerformanceMonitoring(): void {
    setInterval(() => {
      const performanceData = this.collectPerformanceData();
      this.sendPerformanceDataToFirestore(performanceData).catch((error) => {
        console.error('Error sending performance data to Firestore:', error);
      });
    }, 60000); // Every 60 seconds
  }

  private collectPerformanceData(): Record<string, any> {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const uptime = process.uptime();

    return {
      memoryUsage,
      cpuUsage,
      uptime,
      timestamp: new Date().toISOString(),
    };
  }

  private async sendPerformanceDataToFirestore(
    performanceData: Record<string, any>
  ): Promise<void> {
    const { userId } = this;
    const performanceRef = collection(
      database,
      'users',
      userId,
      'performanceMetrics'
    );

    try {
      await setDoc(
        doc(performanceRef),
        {
          ...performanceData,
        },
        { merge: true }
      );
      console.log('Performance data successfully sent to Firestore.');
    } catch (error) {
      console.error('Error sending performance data to Firestore:', error);
    }
  }

  // Clean up resources when app is quitting
  public cleanup(): void {
    clearInterval(this.batchInterval);
  }
}

export default Tracker;
