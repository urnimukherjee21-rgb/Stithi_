export type ArtworkCategory = 'all' | 'anatomical' | 'stippling' | 'psychological';

export interface Artwork {
  id: number;
  plateNumber: string;
  catalog: string;
  title: string;
  caption: string;
  story: string;
  medium: string;
  discipline: string;
  category: 'anatomical' | 'stippling' | 'psychological';
  image: string;
  rawImage?: string;
  isDiptych?: boolean;
  isSold?: boolean;
  availabilityNotice?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  artwork: string;
  message: string;
}
