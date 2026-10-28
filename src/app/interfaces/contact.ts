export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  number: string;
  address: string;
  email: string;
  company: string;
  description: string;
  isFavorite: boolean;
  groupIds?: string[];
}