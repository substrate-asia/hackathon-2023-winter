export interface Idea {
  ideasId: {
    type: 'BigNumber';
    hex: '0x00';
  };
  Title: string;
  Description: string;
  wallet: string;
  logo?: string;
  allfiles: unknown;
  donation: number;
  votes: number;
}
