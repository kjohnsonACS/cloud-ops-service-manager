import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivityEvent, Ec2Instance, InstanceAction } from '../models/instance.model';
import { InstanceRepository } from './instance.repository';

@Injectable({ providedIn: 'root' })
export class InstanceStore {
  private readonly repository = inject(InstanceRepository);
  readonly instances = signal<ReadonlyArray<Ec2Instance>>([]);
  readonly activity = signal<ReadonlyArray<ActivityEvent>>([]);
  readonly loading = signal(true);
  readonly busyKey = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly total = computed(() => this.instances().length);
  readonly running = computed(() => this.instances().filter((i) => i.state === 'running').length);
  readonly stopped = computed(() => this.instances().filter((i) => i.state === 'stopped').length);
  readonly transitioning = computed(() => this.instances().filter((i) => i.state === 'pending' || i.state === 'stopping').length);

  async load(showSpinner = true): Promise<void> {
    if (showSpinner) this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.repository.getDashboardData();
      this.instances.set(data.instances);
      this.activity.set(data.activityEvents);
    } catch (error: unknown) {
      this.error.set(error instanceof Error ? error.message : 'Unable to load dashboard.');
    } finally {
      this.loading.set(false);
    }
  }

  async performAction(instance: Ec2Instance, action: InstanceAction): Promise<boolean> {
    if (this.busyKey() !== null) return false;
    this.error.set(null);
    this.busyKey.set(instance.key);
    const before = this.instances();
    // Optimistic transitions are only UI feedback; the repository determines final state.
    this.instances.update((list) => list.map((item) => item.key !== instance.key ? item : ({
      ...item,
      state: action === 'start' ? 'pending' : action === 'stop' ? 'stopping' : item.state,
      health: action === 'reboot' ? 'checking' : item.health,
    })));
    try {
      await this.repository.performAction(instance.key, action);
      await this.load(false);
      return this.error() === null;
    } catch (error: unknown) {
      this.instances.set(before);
      this.error.set(error instanceof Error ? error.message : 'Unable to perform the action.');
      return false;
    } finally {
      this.busyKey.set(null);
    }
  }
}
