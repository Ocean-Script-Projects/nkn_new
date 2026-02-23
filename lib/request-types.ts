export interface RequestModalContext {
  source?: 'general' | 'piece' | 'event';
  pieceName?: string;
  pieceType?: string;
  eventTitle?: string;
  eventId?: string;
}
