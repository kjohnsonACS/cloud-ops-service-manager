import type { DashboardData, InstanceAction } from '../models/instance.model';

export abstract class InstanceRepository {
    // Replace provider in app.config.ts in the future
    abstract getDashboardData(): Promise<DashboardData>;
    abstract performAction(instanceKey: string, action: InstanceAction): Promise<void>;
}
