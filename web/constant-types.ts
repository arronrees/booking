enum EventType {
  MUSIC = 'MUSIC',
  FESTIVAL = 'FESTIVAL',
  THEATRE = 'THEATRE',
  SPORT = 'SPORT',
  COMEDY = 'COMEDY',
  OTHER = 'OTHER',
}

export interface EventInterface {
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
