import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearAuthUser } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class TabManagerService implements OnDestroy {
  private readonly HEARTBEAT_KEY = 'tabHeartbeat';
  private readonly SESSION_ALIVE_KEY = 'sessionAlive';
  private readonly HEARTBEAT_INTERVAL = 1000;
  private readonly HEARTBEAT_TIMEOUT = 3000;
  private heartbeatInterval: any;
  private checkInterval: any;
  private tabId: string;
  private wasSessionAlive: boolean;

  constructor(private store: Store) {
    this.wasSessionAlive = sessionStorage.getItem(this.SESSION_ALIVE_KEY) === 'true';
    sessionStorage.setItem(this.SESSION_ALIVE_KEY, 'true');

    this.tabId = this.generateTabId();
    this.startHeartbeat();
    this.startHeartbeatCheck();
    this.setupStorageListener();
    this.setupBeforeUnload();
  }

  private generateTabId(): string {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startHeartbeat(): void {
    this.sendHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.HEARTBEAT_INTERVAL);
  }

  private sendHeartbeat(): void {
    const heartbeats = this.getHeartbeats();
    heartbeats[this.tabId] = Date.now();
    localStorage.setItem(this.HEARTBEAT_KEY, JSON.stringify(heartbeats));
  }

  private getHeartbeats(): Record<string, number> {
    const data = localStorage.getItem(this.HEARTBEAT_KEY);
    return data ? JSON.parse(data) : {};
  }

  private startHeartbeatCheck(): void {
    this.checkInterval = setInterval(() => {
      this.cleanupDeadTabs();
    }, this.HEARTBEAT_INTERVAL);
  }

  private cleanupDeadTabs(): void {
    const heartbeats = this.getHeartbeats();
    const now = Date.now();
    const cleanedHeartbeats: Record<string, number> = {};
    let hasActiveTabs = false;

    for (const [tabId, timestamp] of Object.entries(heartbeats)) {
      if (now - timestamp < this.HEARTBEAT_TIMEOUT) {
        cleanedHeartbeats[tabId] = timestamp;
        hasActiveTabs = true;
      }
    }

    if (!hasActiveTabs && Object.keys(heartbeats).length > 0) {
      localStorage.removeItem(this.HEARTBEAT_KEY);
      localStorage.removeItem('authUser');
      localStorage.setItem('allTabsClosed', Date.now().toString());
    } else {
      localStorage.setItem(this.HEARTBEAT_KEY, JSON.stringify(cleanedHeartbeats));
    }
  }

  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      if (!this.wasSessionAlive) {
        this.removeTabHeartbeat();
      } else {
        const heartbeats = this.getHeartbeats();
        delete heartbeats[this.tabId];
        localStorage.setItem(this.HEARTBEAT_KEY, JSON.stringify(heartbeats));
      }
    });
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'allTabsClosed' && event.newValue) {
        this.store.dispatch(clearAuthUser());
      }
    });
  }

  ngOnDestroy(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private removeTabHeartbeat(): void {
    const heartbeats = this.getHeartbeats();
    delete heartbeats[this.tabId];

    if (Object.keys(heartbeats).length === 0) {
      localStorage.removeItem(this.HEARTBEAT_KEY);
      localStorage.removeItem('authUser');
      localStorage.setItem('allTabsClosed', Date.now().toString());
    } else {
      localStorage.setItem(this.HEARTBEAT_KEY, JSON.stringify(heartbeats));
    }
  }

  public getActiveTabCount(): number {
    return Object.keys(this.getHeartbeats()).length;
  }
}
