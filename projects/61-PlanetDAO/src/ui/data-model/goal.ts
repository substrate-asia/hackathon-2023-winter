export interface Goal {
  goalId: {
    type: 'BigNumber' & string;
    hex: string;
  };
  Title: string;
  Description: string;
  Budget: string;
  End_Date: Date;
  logo?: string;
}
