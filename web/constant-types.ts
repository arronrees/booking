enum EventType {
  MUSIC = 'MUSIC',
  FESTIVAL = 'FESTIVAL',
  THEATRE = 'THEATRE',
  SPORT = 'SPORT',
  COMEDY = 'COMEDY',
  OTHER = 'OTHER',
}

export interface UserInterface {
  id: string;
  email: string;
  name: string;
  telephone: string;
  age: number;
  Address: AddressInterface;
  token: string;
  emailVerified: boolean;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
}

export interface EventInterfaceCompact {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  slug: string;
  date: Date;
  location: string;
  type: EventType;
  typeSlug: string;
  public: boolean;
  maxBookings: number;
  addressId: string;
  userId: string;
  imageFileUrl: string;
}

export interface EventInterfaceFull {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  slug: string;
  date: Date;
  location: string;
  type: EventType;
  typeSlug: string;
  public: boolean;
  maxBookings: number;
  addressId: string;
  userId: string;
  imageFileUrl: string;
  Address: AddressInterface;
  BookingType: BookingTypeInterface[];
}

export interface AddressInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  addressLine1: string;
  addressLine2?: string;
  town: string;
  county?: string;
  postcode: string;
  country: string;
}

export interface BookingTypeInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  price: number;
  maxBookings: number;
  eventId: string;
}

export interface JsonApiResponseType {
  success: boolean;
  data?: [] | {} | string;
  error?: string;
}

enum UserAdminRequestStatusType {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

export interface UserAdminRequestType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: UserAdminRequestStatusType;
  dateComplete: Date | null;
  complete: boolean;
}
