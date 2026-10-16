import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Ec2Instance, InstanceAction, PortalView } from './models/instance.model';
import { InstanceStore } from './services/instance.store';

type Theme = 'light' | 'dark';
type DisplayFilter = 'all' | 'running' | 'stopped' | 'transitioning';
type SortOrder = 'name' | 'state' | 'account';
interface ActionRequest { readonly instanceKey: string; readonly action: InstanceAction }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly store = inject(InstanceStore);
  readonly theme = signal<Theme>(this.initialTheme());
  readonly view = signal<PortalView>('overview');
  readonly filter = signal<DisplayFilter>('all');
  readonly search = signal('');
  readonly account = signal('all');
  readonly sort = signal<SortOrder>('name');
  readonly announcement = signal('');
  readonly detailsKey = signal<string | null>(null);
  readonly actionRequest = signal<ActionRequest | null>(null);

  readonly detailsDialog = viewChild.required<ElementRef<HTMLDialogElement>>('detailsDialog');
  readonly confirmDialog = viewChild.required<ElementRef<HTMLDialogElement>>('confirmDialog');
  private detailsTrigger: HTMLElement | null = null;
  private actionTrigger: HTMLElement | null = null;

  readonly accounts = computed(() => [...new Set(this.store.instances().map(i => i.accountName))].sort());
  readonly selectedInstance = computed(() => this.store.instances().find(i => i.key === this.detailsKey()) ?? null);
  readonly requestedInstance = computed(() => this.store.instances().find(i => i.key === this.actionRequest()?.instanceKey) ?? null);
  readonly filteredInstances = computed(() => {
    const query = this.search().trim().toLowerCase();
    const filter = this.filter();
    const account = this.account();
    return this.store.instances()
      .filter(i => account === 'all' || i.accountName === account)
      .filter(i => filter === 'all' || (filter === 'transitioning'
        ? i.state === 'pending' || i.state === 'stopping'
        : i.state === filter))
      .filter(i => !query || [i.name, i.instanceId, i.accountName, i.region, i.owner]
        .some(value => value.toLowerCase().includes(query)))
      .sort((a, b) => {
        if (this.sort() === 'state') return a.state.localeCompare(b.state) || a.name.localeCompare(b.name);
        if (this.sort() === 'account') return a.accountName.localeCompare(b.accountName) || a.name.localeCompare(b.name);
        return a.name.localeCompare(b.name);
      });
  });

  constructor() {
    effect(() => {
      const theme = this.theme();
      document.documentElement.dataset['theme'] = theme;
      localStorage.setItem('ec2-demo-theme', theme);
    });
    void this.store.load();
  }

  private initialTheme(): Theme {
    const saved = localStorage.getItem('ec2-demo-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggleTheme(): void { this.theme.update(t => t === 'light' ? 'dark' : 'light'); }

  setView(view: PortalView): void {
    this.view.set(view);
    // The main landmark is focusable so screen reader and keyboard users
    // can orient themselves after a view transition.
    requestAnimationFrame(() => document.getElementById('main-content')?.focus());
  }

  updateSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); }
  updateAccount(event: Event): void { this.account.set((event.target as HTMLSelectElement).value); }
  updateSort(event: Event): void { this.sort.set((event.target as HTMLSelectElement).value as SortOrder); }
  setFilter(filter: DisplayFilter): void { this.filter.set(filter); }
  resetFilters(): void { this.search.set(''); this.account.set('all'); this.filter.set('all'); this.sort.set('name'); }

  statusLabel(state: Ec2Instance['state']): string {
    return { running: 'Running', stopped: 'Stopped', pending: 'Starting', stopping: 'Stopping', terminated: 'Terminated', 'shutting-down': 'Shutting Down' }[state];
  }

  actionLabel(action: InstanceAction): string {
    return { start: 'Start', stop: 'Stop', reboot: 'Reboot', terminate: 'Terminate' }[action];
  }

  primaryAction(instance: Ec2Instance): InstanceAction | null {
    if (instance.state === 'stopped' && instance.permittedActions.includes('start')) return 'start';
    if (instance.state === 'running' && instance.permittedActions.includes('stop')) return 'stop';
    return null;
  }

  canPerform(instance: Ec2Instance, action: InstanceAction): boolean {
    if (this.store.busyKey() !== null || instance.protectedReason || !instance.permittedActions.includes(action)) return false;
    return action === 'start' ? instance.state === 'stopped' : instance.state === 'running';
  }

  openDetails(instance: Ec2Instance): void {
    this.detailsTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.detailsKey.set(instance.key);
    this.detailsDialog().nativeElement.showModal();
  }

  closeDetails(): void { this.detailsDialog().nativeElement.close(); }
  onDetailsClosed(): void {
    this.detailsKey.set(null);
    this.restoreFocus(this.detailsTrigger);
    this.detailsTrigger = null;
  }

  openAction(instance: Ec2Instance, action: InstanceAction): void {
    if (!this.canPerform(instance, action)) return;
    // A native confirmation dialog is placed above the details dialog when
    // launched from it; closing returns focus to the originating action.
    this.actionTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.actionRequest.set({ instanceKey: instance.key, action });
    this.confirmDialog().nativeElement.showModal();
  }

  closeConfirm(): void { this.confirmDialog().nativeElement.close(); }
  onConfirmClosed(): void {
    this.actionRequest.set(null);
    this.restoreFocus(this.actionTrigger);
    this.actionTrigger = null;
  }

  private restoreFocus(target: HTMLElement | null): void {
    if (target?.isConnected) target.focus();
    else document.getElementById('main-content')?.focus();
  }

  async confirmAction(): Promise<void> {
    const request = this.actionRequest();
    const instance = this.requestedInstance();
    if (!request || !instance || !this.canPerform(instance, request.action)) return;
    this.closeConfirm();
    this.announcement.set(`${this.actionLabel(request.action)} requested for ${instance.name}. Demo operation in progress.`);
    const success = await this.store.performAction(instance, request.action);
    this.announcement.set(success
      ? `${this.actionLabel(request.action)} completed for ${instance.name} in demo mode. No AWS resources were changed.`
      : `Demo operation failed for ${instance.name}. ${this.store.error() ?? ''}`);
  }

  async refresh(): Promise<void> {
    await this.store.load();
    this.announcement.set(this.store.error() ? 'Unable to refresh demo instances.' : 'Demo instance list refreshed.');
  }
}