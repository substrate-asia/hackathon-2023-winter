export interface Idea {
  ideasId: number;
  Title: string;
  Description: string;
  wallet: string;
  logo?: string;
  allfiles: unknown;
  donation: number;
  votes: number;
  isVoted?:boolean;
  isOwner?:boolean;
}
