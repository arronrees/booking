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
  Address: AddressInterface;
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
