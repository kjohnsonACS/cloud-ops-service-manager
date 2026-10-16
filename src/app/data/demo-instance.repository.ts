/**
 * DEMO ONLY — DELETE this class and demo.instances.ts when wiring the AWS API.
 * Simulates a network request and a state transition in browser memory.
 * This is NOT authentication, IAM authorization, or EC2 command execution.
 */
import { Injectable } from '@angular/core';
import { DashboardData, Ec2Instance, InstanceAction } from '../models/instance.model';
import { InstanceRepository } from '../services/instance.repository';
import { DEMO_ACTIVITY, DEMO_INSTANCES } from './demo.instances';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

@Injectable()
export class DemoInstanceRepository extends InstanceRepository {
  private readonly instances: Ec2Instance[] = structuredClone(DEMO_INSTANCES);
  private readonly activity = structuredClone(DEMO_ACTIVITY);

  override async getDashboardData(): Promise<DashboardData> {
    await delay(160);
    return structuredClone({ instances: this.instances, activityEvents: this.activity });
  }

  override async performAction(instanceKey: string, action: InstanceAction): Promise<void> {
    const index = this.instances.findIndex((item) => item.key === instanceKey);
    if (index < 0) throw new Error('Demo instance not found.');
    const instance = this.instances[index];

    // DEMO GUARD ONLY: production API must authorize independently on EVERY action.
    if (!instance.permittedActions.includes(action) || instance.protectedReason) {
      throw new Error('This mock user is not permitted to perform that operation.');
    }
    if (action === 'start' && instance.state !== 'stopped') throw new Error('Instance is not stopped.');
    if ((action === 'stop' || action === 'reboot') && instance.state !== 'running') {
      throw new Error('Instance must be running for this operation.');
    }

    await delay(1150);
    this.instances[index] = {
      ...instance,
      state: action === 'stop' ? 'stopped' : 'running',
      health: action === 'stop' ? 'offline' : 'healthy',
      lastChanged: new Date().toISOString(),
    };
    this.activity.unshift({
      id: `demo-${Date.now()}`,
      instanceKey,
      instanceName: instance.name,
      accountName: instance.accountName,
      actor: 'Demo user',
      action,
      occurredAt: new Date().toISOString(),
      result: 'Completed',
    });
  }
}
