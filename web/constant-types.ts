enum EventType {
  MUSIC = 'MUSIC',
  FESTIVAL = 'FESTIVAL',
  THEATRE = 'THEATRE',
  SPORT = 'SPORT',
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
  location: string | null;
  type: EventType;
  public: boolean;
  maxBookings: number;
  addressId: string;
  userId: string;
}
