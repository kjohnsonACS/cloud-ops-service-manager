/**
 * MOCK DATA ONLY — DELETE THIS FILE WHEN CONNECTING TO AWS.
 * All identifiers, instance names, users, schedules, and activity are fictional.
 * These permissions are illustrative UI data, NOT security authorization.
 */
import { ActivityEvent, Ec2Instance } from '../models/instance.model';

export const MOCK_INSTANCES: Ec2Instance[] = [
  {
    key: '111122223333/us-east-1/i-0a1bcde1234567890',
    instanceId: 'i-0a1bcde1234567890', name: 'research-dev-api',
    accountName: 'Research · Dev', accountId: '111122223333', region: 'us-east-1',
    environment: 'Development', owner: 'Platform Engineering', state: 'running',
    health: 'healthy', schedule: {description: 'Weekdays · 08:00–18:00', timezone: 'America/New_York', nextAction: 'Stop · 18:00 ET'},
    permittedActions: ['start', 'stop', 'reboot'], protectedReason: null, lastChanged: '2026-10-15T12:35:00-04:00',
  },
  {
    key: '111122223333/us-east-1/i-0b2bcde1234567891',
    instanceId: 'i-0b2bcde1234567891', name: 'research-staging',
    accountName: 'Research · Stage', accountId: '111122223333', region: 'us-east-1',
    environment: 'Staging', owner: 'Application Services', state: 'stopped',
    health: 'offline', schedule: null, permittedActions: ['start', 'stop', 'reboot'],
    protectedReason: null, lastChanged: '2026-10-14T19:15:00-04:00',
  },
  {
    key: '444455556666/us-west-2/i-0c3bcde1234567892',
    instanceId: 'i-0c3bcde1234567892', name: 'analytics-worker-01',
    accountName: 'Data · Dev', accountId: '444455556666', region: 'us-west-2',
    environment: 'Development', owner: 'Analytics Team', state: 'pending',
    health: 'checking', schedule: {description: 'Weekdays · 09:00–17:00', timezone: 'America/Los_Angeles', nextAction: 'Stop · 17:00 PT'},
    permittedActions: ['start', 'stop'], protectedReason: null, lastChanged: '2026-10-15T12:39:00-04:00',
  },
  {
    key: '777788889999/us-east-1/i-0d4bcde1234567893',
    instanceId: 'i-0d4bcde1234567893', name: 'prod-reporting-db',
    accountName: 'Research · Prod', accountId: '777788889999', region: 'us-east-1',
    environment: 'Production', owner: 'Data Platform', state: 'running',
    health: 'healthy', schedule: null, permittedActions: [],
    protectedReason: 'Production instance. Change approval is required.', lastChanged: '2026-10-10T08:42:00-04:00',
  },
  {
    key: '111122223333/us-east-1/i-0e5bcde1234567894',
    instanceId: 'i-0e5bcde1234567894', name: 'qa-integration-runner',
    accountName: 'Research · Stage', accountId: '111122223333', region: 'us-east-1',
    environment: 'Staging', owner: 'Quality Engineering', state: 'running',
    health: 'healthy', schedule: {description: 'Weekdays · 07:00–20:00', timezone: 'America/New_York', nextAction: 'Stop · 20:00 ET'},
    permittedActions: ['start', 'stop', 'reboot'], protectedReason: null, lastChanged: '2026-10-15T07:02:00-04:00',
  },
  {
    key: '444455556666/us-west-2/i-0f6bcde1234567895',
    instanceId: 'i-0f6bcde1234567895', name: 'etl-batch-processor',
    accountName: 'Data · Dev', accountId: '444455556666', region: 'us-west-2',
    environment: 'Development', owner: 'Analytics Team', state: 'stopped',
    health: 'offline', schedule: {description: 'Weekdays · 06:00–16:00', timezone: 'America/Los_Angeles', nextAction: 'Start · 06:00 PT'},
    permittedActions: ['start', 'stop', 'reboot'], protectedReason: null, lastChanged: '2026-10-14T16:08:00-07:00',
  },
  {
    key: '111122223333/us-east-1/i-0a7bcde1234567896',
    instanceId: 'i-0a7bcde1234567896', name: 'design-system-preview',
    accountName: 'Research · Dev', accountId: '111122223333', region: 'us-east-1',
    environment: 'Development', owner: 'Frontend Guild', state: 'running',
    health: 'healthy', schedule: null, permittedActions: ['start', 'stop', 'reboot'],
    protectedReason: null, lastChanged: '2026-10-15T09:05:00-04:00',
  },
  {
    key: '444455556666/us-west-2/i-0b8bcde1234567897',
    instanceId: 'i-0b8bcde1234567897', name: 'metrics-exporter',
    accountName: 'Data · Dev', accountId: '444455556666', region: 'us-west-2',
    environment: 'Development', owner: 'Observability Team', state: 'running',
    health: 'healthy', schedule: {description: 'Daily · 07:00–23:00', timezone: 'America/Los_Angeles', nextAction: 'Stop · 23:00 PT'},
    permittedActions: ['start', 'stop', 'reboot'], protectedReason: null, lastChanged: '2026-10-15T07:01:00-07:00',
  },
  {
    key: '111122223333/us-east-1/i-0c9bcde1234567898',
    instanceId: 'i-0c9bcde1234567898', name: 'legacy-import-job',
    accountName: 'Research · Dev', accountId: '111122223333', region: 'us-east-1',
    environment: 'Development', owner: 'Migration Team', state: 'stopped',
    health: 'offline', schedule: null, permittedActions: ['start', 'stop'],
    protectedReason: null, lastChanged: '2026-10-11T17:20:00-04:00',
  },
  {
    key: '777788889999/us-east-1/i-0dabcd12345678999',
    instanceId: 'i-0dabcd12345678999', name: 'prod-search-indexer',
    accountName: 'Research · Prod', accountId: '777788889999', region: 'us-east-1',
    environment: 'Production', owner: 'Search Platform', state: 'running',
    health: 'healthy', schedule: null, permittedActions: [],
    protectedReason: 'Read-only access to this production instance.', lastChanged: '2026-10-12T11:11:00-04:00',
  },
  {
    key: '444455556666/us-west-2/i-0eabcd123456789a1',
    instanceId: 'i-0eabcd123456789a1', name: 'feature-store-cache',
    accountName: 'Data · Dev', accountId: '444455556666', region: 'us-west-2',
    environment: 'Development', owner: 'ML Platform', state: 'running',
    health: 'healthy', schedule: null, permittedActions: ['start', 'stop', 'reboot'],
    protectedReason: null, lastChanged: '2026-10-15T10:17:00-04:00',
  },
  {
    key: '111122223333/us-east-1/i-0fabcd123456789a2',
    instanceId: 'i-0fabcd123456789a2', name: 'sandbox-playground',
    accountName: 'Research · Dev', accountId: '111122223333', region: 'us-east-1',
    environment: 'Development', owner: 'Developer Experience', state: 'stopped',
    health: 'offline', schedule: null, permittedActions: ['start', 'stop', 'reboot'],
    protectedReason: null, lastChanged: '2026-10-13T18:00:00-04:00',
  },
];

export const MOCK_ACTIVITY: ActivityEvent[] = [
  {id: 'mock-101', instanceKey: MOCK_INSTANCES[4].key, instanceName: 'qa-integration-runner', accountName: 'Research · Stage', actor: 'Schedule', action: 'start', occurredAt: '2026-10-15T07:02:00-04:00', result: 'Completed'},
  {id: 'mock-102', instanceKey: MOCK_INSTANCES[6].key, instanceName: 'design-system-preview', accountName: 'Research · Dev', actor: 'Alex Morgan', action: 'start', occurredAt: '2026-10-15T09:05:00-04:00', result: 'Completed'},
  {id: 'mock-103', instanceKey: MOCK_INSTANCES[1].key, instanceName: 'research-staging', accountName: 'Research · Stage', actor: 'Taylor Kim', action: 'stop', occurredAt: '2026-10-14T19:15:00-04:00', result: 'Completed'},
  {id: 'mock-104', instanceKey: MOCK_INSTANCES[0].key, instanceName: 'research-dev-api', accountName: 'Research · Dev', actor: 'Schedule', action: 'reboot', occurredAt: '2026-10-14T10:15:00-04:00', result: 'Completed'},
];
