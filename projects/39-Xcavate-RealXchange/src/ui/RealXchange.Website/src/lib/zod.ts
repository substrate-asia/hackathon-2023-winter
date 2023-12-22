import z, { array, number, object, string } from 'zod';

export const createProjectSchema = object({
  name: string().min(5),
  category: string(),
  location: string(),
  description: string().min(20),
  target: string(),
  length: string()
});

export const addNFTSchema = object({
  nfts: array(
    object({
      keyword: string().min(1, { message: 'Please add a keyword' }),
      color: string().min(1),
      supply: string(),
      price: string(),
      description: string().min(5, { message: 'Please add description' })
    })
  )
});
