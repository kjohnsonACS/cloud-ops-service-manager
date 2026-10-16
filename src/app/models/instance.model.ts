export type Ec2State = 'pending' | 'running' | 'stopping' | 'stopped' | 'shutting-down' | 'terminated';
export type InstanceAction = 'start' | 'stop' | 'reboot' | 'terminate';
export type StateFilter = 'all' | Ec2State;
export type PortalView = 'overview' | 'instances' | 'activity';

export interface InstanceSchedule {
    readonly description: string;
    readonly timezone: string;
    readonly nextAction: string | null;
}

export interface Ec2Instance {
    // AccountId/region/instanceId; don't key by the instanceId alone
    readonly key: string;
    readonly instanceId: string;
    readonly name: string;
    readonly accountName: string;
    readonly accountId: string;
    readonly region: string;
    readonly environment: string;
    readonly owner: string;
    readonly state: Ec2State;
    readonly health: 'healthy' | 'checking' | 'offline' | 'unknown';
    readonly schedule: InstanceSchedule | null;
    readonly permittedActions: ReadonlyArray<InstanceAction>;
    readonly protectedReason: string| null;
    readonly lastChanged: string;
}

export interface ActivityEvent {
    readonly id: string;
    readonly instanceKey: string;
    readonly instanceName: string;
    readonly accountName: string;
    readonly actor: string;
    readonly action: InstanceAction;
    readonly occurredAt: string;
    readonly result: 'Completed' | 'Failed' | 'InProgress';
}

export interface DashboardData {
    readonly instances: ReadonlyArray<Ec2Instance>;
    readonly activityEvents: ReadonlyArray<ActivityEvent>;
}