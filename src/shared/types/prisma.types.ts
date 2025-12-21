import { Prisma } from '@prisma/client';

// =============================================================================
// 1. USER & PROFILE
// =============================================================================
export type TUserInclude = Prisma.UserInclude;

// 🟢 LISTA: Solo datos clave y a quién pertenece (Org)
export const TUserListInclude: Prisma.UserInclude = {
    memberships: {
        include: { organization: { select: { name: true, slug: true } } }
    },
    _count: {
        select: { managedRaces: true }
    }
};

// 🔵 DETALLE: Perfil completo, bicis y datos de auditoría
export const TUserDetailInclude: Prisma.UserInclude = {
    memberships: { include: { organization: true } },
    roles: { include: { role: true } }, // Include RBAC roles
    cyclistProfile: {
        include: {
            bicycles: true // Las bicis son pocas (1-5), es seguro traerlas
        }
    },
    // managedRaces: false, // ⚠️ Mejor paginarlas en otro endpoint
    _count: {
        select: { managedRaces: true, auditLogs: true, payments: true }
    }
};

// =============================================================================
// 2. BICYCLE
// =============================================================================
export type TBicycleInclude = Prisma.BicycleInclude;

// 🟢 LISTA: Datos básicos y dueño
export const TBicycleListInclude: Prisma.BicycleInclude = {
    cyclist: {
        include: {
            user: { select: { fullName: true, avatarUrl: true } } // Solo ver de quién es
        }
    }
};

// 🔵 DETALLE: Igual a la lista, pero con historial de carreras
export const TBicycleDetailInclude: Prisma.BicycleInclude = {
    cyclist: {
        include: { user: true }
    },
    _count: {
        select: { racesUsed: true } // "Esta bici ha corrido 10 carreras"
    }
};

// =============================================================================
// 3. ORGANIZATION
// =============================================================================
export type TOrganizationInclude = Prisma.OrganizationInclude;

// 🟢 LISTA: Solo conteos (Super rápido)
export const TOrganizationListInclude: Prisma.OrganizationInclude = {
    _count: {
        select: { members: true, races: true, tracks: true }
    }
};

// 🔵 DETALLE: Tracks (son pocos) y configuración. 
// ⚠️ NO traemos 'members' ni 'races' completas aquí para no explotar la memoria.
// 🔵 DETALLE: Tracks, members (via relation) y config.
export const TOrganizationDetailInclude: Prisma.OrganizationInclude = {
    tracks: true,
    members: {
        include: {
            user: { select: { id: true, fullName: true, email: true, avatarUrl: true } }
        }
    },
    _count: {
        select: { races: true }
    }
};

// =============================================================================
// 4. TRACK (Pistas)
// =============================================================================
export type TTrackInclude = Prisma.TrackInclude;

export const TTrackListInclude: Prisma.TrackInclude = {
    organization: { select: { name: true } },
    _count: { select: { races: true } }
};

export const TTrackDetailInclude: Prisma.TrackInclude = {
    organization: true,
    checkpoints: { orderBy: { order: 'asc' } }, // Include checkpoints ordered
    _count: { select: { races: true } }
};

// =============================================================================
// 5. CATEGORY
// =============================================================================
export type TCategoryInclude = Prisma.CategoryInclude;

export const TCategoryListInclude: Prisma.CategoryInclude = {
    _count: { select: { races: true } }
};

export const TCategoryDetailInclude: Prisma.CategoryInclude = {
    similarTo: true,   // Ver categorías hermanas
    similarFrom: true,
    _count: { select: { races: true } }
};

// =============================================================================
// 6. RACE (El más crítico)
// =============================================================================
export type TRaceInclude = Prisma.RaceInclude;

// 🟢 LISTA: Datos logísticos para mostrar en tarjetas (Card UI)
export const TRaceListInclude: Prisma.RaceInclude = {
    organization: { select: { name: true, slug: true, logoUrl: true } },
    track: { select: { name: true, distanceKm: true } }, // Info técnica rápida
    _count: {
        select: { participants: true, categories: true }
    }
};

// 🔵 DETALLE: Configuración completa para el Dashboard
export const TRaceDetailInclude: Prisma.RaceInclude = {
    organization: true,
    track: true,
    categories: true, // Las categorías son pocas (5-20), seguro traerlas
    creator: { select: { fullName: true, email: true } },

    // ⚠️ EXCLUIDOS DELIBERADAMENTE:
    // participants: false -> Se piden en endpoint /races/:id/participants
    // liveEvents: false   -> Se piden en endpoint /races/:id/live

    _count: {
        select: { participants: true, liveEvents: true, timings: true, payments: true }
    }
};

// =============================================================================
// 7. PARTICIPANT (Inscripción)
// =============================================================================
export type TRaceParticipantInclude = Prisma.RaceParticipantInclude;

export const TRaceParticipantListInclude: Prisma.RaceParticipantInclude = {
    profile: {
        include: { user: { select: { fullName: true, avatarUrl: true, email: true } } }
    },
    bicycle: { select: { brand: true, model: true } }, // Saber con qué corre
    race: { select: { name: true } } // Por si listamos historial del usuario
};

export const TRaceParticipantDetailInclude: Prisma.RaceParticipantInclude = {
    profile: { include: { user: true } },
    bicycle: true,
    race: true,
    _count: { select: { events: true } } // Cuántos checkpoints ha pasado
};

// =============================================================================
// 8. RACE EVENT (Live Tracking)
// =============================================================================
export type TRaceEventInclude = Prisma.RaceEventInclude;

// Generalmente esto se consulta por lotes grandes, mantenlo ligero
export const TRaceEventDefaultInclude: Prisma.RaceEventInclude = {
    participant: {
        select: {
            bibNumber: true,
            profile: { select: { user: { select: { fullName: true } } } }
        }
    }
};

// =============================================================================
// 9. ORGANIZATION MEMBER
// =============================================================================
export type TOrganizationMemberInclude = Prisma.OrganizationMemberInclude;

export const TOrganizationMemberListInclude: Prisma.OrganizationMemberInclude = {
    user: { select: { fullName: true, email: true, avatarUrl: true } },
    organization: { select: { name: true } }
};

// =============================================================================
// 10. CHECKPOINT
// =============================================================================
export type TCheckpointInclude = Prisma.CheckpointInclude;

export const TCheckpointListInclude: Prisma.CheckpointInclude = {
    track: { select: { name: true } }
};

// =============================================================================
// 11. RACE TIMING
// =============================================================================
export type TRaceTimingInclude = Prisma.RaceTimingInclude;

export const TRaceTimingListInclude: Prisma.RaceTimingInclude = {
    participant: {
        select: {
            bibNumber: true,
            profile: { select: { user: { select: { fullName: true } } } }
        }
    },
    checkpoint: { select: { name: true, order: true } },
    race: { select: { name: true } }
};

// =============================================================================
// 12. PAYMENT
// =============================================================================
export type TPaymentInclude = Prisma.PaymentInclude;

export const TPaymentListInclude: Prisma.PaymentInclude = {
    user: { select: { fullName: true, email: true } },
    race: { select: { name: true } }
};

// =============================================================================
// 13. RBAC (Roles & Permissions)
// =============================================================================
export type TRoleInclude = Prisma.RoleInclude;

export const TRoleDetailInclude: Prisma.RoleInclude = {
    permissions: {
        include: { permission: true }
    },
    _count: { select: { users: true } }
};