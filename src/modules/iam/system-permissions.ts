export class SystemPermissions {
    //Users
    static readonly Users = {
        Create: 'user:action:create',
        Read: 'user:action:read',
        Update: 'user:action:update',
        Delete: 'user:action:delete',
        Manage: 'user:action:manage', // Admin override
    };

    // Organizations
    static readonly Organizations = {
        Create: 'organization:action:create',
        Read: 'organization:action:read',
        Update: 'organization:action:update',
        Delete: 'organization:action:delete',
    };

    // Races
    static readonly Races = {
        Create: 'race:action:create',
        Read: 'race:action:read',
        Update: 'race:action:update',
        Delete: 'race:action:delete',
        Publish: 'race:action:publish',
    };

    // Race Timing
    static readonly Timing = {
        Record: 'timing:action:record',
        Verify: 'timing:action:verify',
        Read: 'timing:action:read',
        Delete: 'timing:action:delete',
    };

    // Tracks
    static readonly Tracks = {
        Create: 'track:action:create',
        Read: 'track:action:read',
        Update: 'track:action:update',
        Delete: 'track:action:delete',
    };

    // Categories
    static readonly Categories = {
        Create: 'category:action:create',
        Read: 'category:action:read',
        Update: 'category:action:update',
        Delete: 'category:action:delete',
    };

    // Bicycles
    static readonly Bicycles = {
        Create: 'bicycle:action:create',
        Read: 'bicycle:action:read',
        Update: 'bicycle:action:update',
        Delete: 'bicycle:action:delete',
    };

    // Participants
    static readonly Participants = {
        Create: 'participant:action:create',
        Read: 'participant:action:read',
        Update: 'participant:action:update',
        Delete: 'participant:action:delete',
    };

    // Payments
    static readonly Payments = {
        Create: 'payment:action:create',
        Read: 'payment:action:read',
        Update: 'payment:action:update',
        Delete: 'payment:action:delete',
    };

    // Checkpoints
    static readonly Checkpoints = {
        Create: 'checkpoint:action:create',
        Read: 'checkpoint:action:read',
        Update: 'checkpoint:action:update',
        Delete: 'checkpoint:action:delete',
    };

    // Organization Members
    static readonly OrganizationMembers = {
        Create: 'org_member:action:create',
        Read: 'org_member:action:read',
        Update: 'org_member:action:update',
        Delete: 'org_member:action:delete',
    };

    // System
    static readonly System = {
        Manage: 'system:action:manage', // Super Admin
    };

    /**
     * Helper to get all permissions as a flat array of strings.
     * Useful for seeding.
     */
    static getAll(): string[] {
        const permissions: string[] = [];

        // Iterate over static properties
        for (const key of Object.keys(SystemPermissions)) {
            const group = (SystemPermissions as any)[key];
            if (typeof group === 'object' && group !== null) {
                for (const actionKey of Object.keys(group)) {
                    const value = group[actionKey];
                    if (typeof value === 'string') {
                        permissions.push(value);
                    }
                }
            }
        }
        return permissions;
    }
}
