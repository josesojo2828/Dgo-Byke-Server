// =================================================================
// UTILIDADES
// =================================================================

// Tipo auxiliar para manejar campos JSONB (flexibles)
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Alias para IDs, útil si mañana cambias de UUID a Int o BigInt
export type Type_ID = string;

// Interfaz base para todas las entidades que tienen auditoría automática
export interface BaseEntity {
  id: Type_ID;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; // Soft Delete
}

// =================================================================
// ENUMS (Replicados del Schema para uso en lógica)
// =================================================================

export enum SystemRole {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  CYCLIST = 'CYCLIST',
}

export enum OrgRole {
  PRESIDENTE = 'PRESIDENTE',
  VICEPRESIDENTE = 'VICEPRESIDENTE',
  SECRETARIO = 'SECRETARIO',
  MIEMBRO = 'MIEMBRO',
}

export enum RaceType {
  CIRCUITO = 'CIRCUITO',
  RUTA_LINEAL = 'RUTA_LINEAL',
  CONTRARELOJ = 'CONTRARELOJ',
}

export enum RaceStatus {
  BORRADOR = 'BORRADOR',
  PROGRAMADA = 'PROGRAMADA',
  INSCRIPCION_CERRADA = 'INSCRIPCION_CERRADA',
  EN_CURSO = 'EN_CURSO',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA',
}

export enum BikeType {
  MTB = 'MTB',
  RUTA = 'RUTA',
  GRAVEL = 'GRAVEL',
  BMX = 'BMX',
  E_BIKE = 'E_BIKE',
  OTRO = 'OTRO',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  EXPORT_DATA = 'EXPORT_DATA',
}

// =================================================================
// ENTIDADES DE DOMINIO
// =================================================================

export interface User extends BaseEntity {
  email: string;
  password?: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;

  systemRole: SystemRole;

  // IDs de Relaciones
  organizationId?: Type_ID | null;
  orgRole?: OrgRole | null;

  // Relaciones
  organization?: Organization;
  cyclistProfile?: CyclistProfile;

  metadata?: Json | null;

  // Conteos de relaciones
  _count?: {
    auditLogs: number;
    managedRaces: number;
  };
}

export interface CyclistProfile {
  id: Type_ID;
  userId: Type_ID;

  birthDate: Date;
  bloodType?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;

  stats?: Json | null;

  // Relaciones
  user?: User;
  bicycles?: Bicycle[];
  participations?: RaceParticipant[];

  // Conteos
  _count?: {
    bicycles: number;
    participations: number;
  };
}

export interface Bicycle extends BaseEntity {
  cyclistProfileId: Type_ID;

  brand: string;
  model: string;
  type: BikeType;
  color?: string | null;
  serialNumber?: string | null;
  photoUrl?: string | null;
  isActive: boolean;

  specs?: Json | null;

  // Relaciones
  cyclist?: CyclistProfile;
  racesUsed?: RaceParticipant[]; // Historial donde se usó

  // Conteos
  _count?: {
    racesUsed: number;
  };
}

export interface Organization extends BaseEntity {
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;

  metadata?: Json | null;

  // Relaciones
  members?: User[];
  races?: Race[];
  tracks?: Track[];

  // Conteos
  _count?: {
    members: number;
    races: number;
    tracks: number;
  };
}

export interface Track extends BaseEntity {
  name: string;
  description?: string | null;
  distanceKm: number;
  elevationGain?: number | null;

  geoData: Json; // GeoJSON

  organizationId: Type_ID;

  // Relaciones
  organization?: Organization;
  races?: Race[];

  // Conteos
  _count?: {
    races: number;
  };
}

export interface Category extends BaseEntity {
  name: string;
  minAge?: number | null;
  maxAge?: number | null;
  gender?: string | null;

  // Relaciones
  similarTo?: Category[];
  similarFrom?: Category[]; // Relación inversa
  races?: Race[];

  // Conteos
  _count?: {
    similarTo: number;
    similarFrom: number;
    races: number;
  };
}

export interface Race extends BaseEntity {
  name: string;
  date: Date;
  locationName?: string | null;
  status: RaceStatus;
  type: RaceType;

  laps?: number | null;
  price?: number | null;

  organizationId: Type_ID;
  trackId: Type_ID;
  creatorId: Type_ID;

  // Relaciones
  organization?: Organization;
  track?: Track;
  creator?: User;
  categories?: Category[];
  participants?: RaceParticipant[];
  liveEvents?: RaceEvent[];

  metadata?: Json | null;

  // Conteos
  _count?: {
    categories: number;
    participants: number;
    liveEvents: number;
  };
}

export interface RaceParticipant {
  id: Type_ID;
  raceId: Type_ID;
  profileId: Type_ID;
  bicycleId?: Type_ID | null;

  categoryAssignedId?: Type_ID | null;
  bibNumber: number;
  hasPaid: boolean;
  status?: string | null;

  finalTime?: number | null; // ms
  rank?: number | null;

  registeredAt: Date;

  // Relaciones
  race?: Race;
  profile?: CyclistProfile;
  bicycle?: Bicycle;
  events?: RaceEvent[];

  // Conteos
  _count?: {
    events: number; // Cantidad de vueltas/checkpoints registrados
  };
}

export interface RaceEvent {
  id: Type_ID;
  raceId: Type_ID;
  participantId: Type_ID;

  type: string;
  value?: number | null;
  timestamp: Date;

  syncedAt: Date;
  deviceUuid?: string | null;
  appVersion?: string | null;
  hash?: string | null;

  // Relaciones
  race?: Race;
  participant?: RaceParticipant;

  // Es una hoja (nodo final), no suele tener _count hijos
}

export interface AuditLog {
  id: Type_ID;
  userId?: Type_ID | null;

  action: AuditAction;
  entity: string;
  entityId: string;

  oldData?: Json | null;
  newData?: Json | null;

  ipAddress: string;
  userAgent?: string | null;

  createdAt: Date;

  // Relaciones
  user?: User;

  // Es una hoja (nodo final), no suele tener _count hijos
}
