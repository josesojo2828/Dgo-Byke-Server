// ==========================================
// 1. ENUMS (Tipos estrictos)
// ==========================================

export enum SystemRole {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  CYCLIST = 'CYCLIST'
}

export const ROLE_ROOT_PATHS: Record<SystemRole, string> = {
  // [ROL_EN_BD] : 'PREFIJO_EN_FRONTEND'

  [SystemRole.ADMIN]: '/admin',         // Para rutas como: localhost:3000/admin/users
  [SystemRole.ORGANIZER]: '/organizer', // Para rutas como: localhost:3000/organizer/users
  [SystemRole.CYCLIST]: '/portal',      // O '/cyclist', como hayas llamado a tu carpeta en Next.js
};

export enum OrgRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  MEMBER = 'MEMBER'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum RaceType {
  CIRCUITO = 'CIRCUITO',
  RUTA_LINEAL = 'RUTA_LINEAL',
  CONTRARELOJ = 'CONTRARELOJ'
}

export enum RaceStatus {
  BORRADOR = 'BORRADOR',
  PROGRAMADA = 'PROGRAMADA',
  INSCRIPCION_CERRADA = 'INSCRIPCION_CERRADA',
  EN_CURSO = 'EN_CURSO',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA'
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  EXPORT_DATA = 'EXPORT_DATA'
}

export enum BikeType {
  MTB = 'MTB',
  RUTA = 'RUTA',
  GRAVEL = 'GRAVEL',
  BMX = 'BMX',
  E_BIKE = 'E_BIKE',
  OTRO = 'OTRO'
}

// ==========================================
// 2. TIPOS AUXILIARES (Para manejar JSON y Decimales)
// ==========================================

// Tipo genérico para campos JSONB
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// ==========================================
// 3. INTERFACES DE MODELOS
// ==========================================

export interface User {
  id: string;
  email: string;
  password: string; // Hash
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  systemRole: SystemRole;
  metadata: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relaciones
  memberships?: OrganizationMember[];
  roles?: UserRole[];
  payments?: Payment[];
  cyclistProfile?: CyclistProfile | null;
  auditLogs?: AuditLog[];
  managedRaces?: Race[];
}

export interface CyclistProfile {
  id: string;
  userId: string;
  birthDate: Date;
  bloodType: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  stats: JsonValue | null;

  // Relaciones
  user?: User;
  bicycles?: Bicycle[];
  participations?: RaceParticipant[];
}

export interface Bicycle {
  id: string;
  cyclistProfileId: string;
  brand: string;
  model: string;
  type: BikeType;
  color: string | null;
  serialNumber: string | null;
  photoUrl: string | null;
  isActive: boolean;
  specs: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relaciones
  cyclist?: CyclistProfile;
  racesUsed?: RaceParticipant[];
}

export interface RaceParticipant {
  id: string;
  raceId: string;
  profileId: string;
  bicycleId: string | null;
  categoryAssignedId: string | null;
  bibNumber: number;
  hasPaid: boolean;
  status: string | null;
  finalTime: number | null; // Entero (posiblemente milisegundos o segundos)
  rank: number | null;
  registeredAt: Date;

  // Relaciones
  race?: Race;
  profile?: CyclistProfile;
  bicycle?: Bicycle | null;
  events?: RaceEvent[];
  raceTimings?: RaceTiming[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  metadata: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relaciones
  members?: OrganizationMember[];
  races?: Race[];
  tracks?: Track[];
}

export interface Track {
  id: string;
  name: string;
  description: string | null;
  distanceKm: number;
  elevationGain: number | null;
  geoData: JsonValue; // GeoJSON
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relaciones
  checkpoints?: Checkpoint[];
  organization?: Organization;
  races?: Race[];
}

export interface Category {
  id: string;
  name: string;
  minAge: number | null;
  maxAge: number | null;
  gender: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relaciones
  similarTo?: Category[];
  similarFrom?: Category[];
  races?: Race[];
}

export interface Race {
  id: string;
  name: string;
  date: Date;
  locationName: string | null;
  status: RaceStatus;
  type: RaceType;
  laps: number | null;
  price: number | null; // Decimal se suele manejar como number o string en JS
  organizationId: string;
  trackId: string;
  creatorId: string;
  metadata: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relaciones
  organization?: Organization;
  track?: Track;
  creator?: User;
  categories?: Category[];
  participants?: RaceParticipant[];
  liveEvents?: RaceEvent[];
  timings?: RaceTiming[];
  payments?: Payment[];
}

export interface RaceEvent {
  id: string;
  raceId: string;
  participantId: string;
  type: string;
  value: number | null;
  timestamp: Date;
  syncedAt: Date;
  deviceUuid: string | null;
  appVersion: string | null;
  hash: string | null;

  // Relaciones
  race?: Race;
  participant?: RaceParticipant;
  raceTimings?: RaceTiming[];
}

export interface RaceTiming {
  id: string;
  raceEventId: string | null;
  participantId: string;
  checkpointId: string;
  raceId: string;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  raceEvent?: RaceEvent | null;
  participant?: RaceParticipant;
  checkpoint?: Checkpoint;
  race?: Race;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  position: string | null;
  role: OrgRole;
  isActive: boolean;
  joinedAt: Date;

  // Relaciones
  user?: User;
  organization?: Organization;
}

export interface Checkpoint {
  id: string;
  trackId: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
  isStart: boolean;
  isFinish: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  track?: Track;
  timings?: RaceTiming[];
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  permissions?: RolePermission[];
  users?: UserRole[];
}

export interface Permission {
  id: string;
  action: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  roles?: RolePermission[];
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  assignedAt: Date;

  // Relaciones
  role?: Role;
  permission?: Permission;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: Date;

  // Relaciones
  user?: User;
  role?: Role;
}

export interface Payment {
  id: string;
  userId: string;
  raceId: string;
  amount: number; // Decimal
  currency: string;
  status: PaymentStatus;
  transactionId: string | null;
  metadata: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  user?: User;
  race?: Race;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: AuditAction;
  entity: string;
  entityId: string;
  oldData: JsonValue | null;
  newData: JsonValue | null;
  ipAddress: string;
  userAgent: string | null;
  createdAt: Date;

  // Relaciones
  user?: User | null;
}