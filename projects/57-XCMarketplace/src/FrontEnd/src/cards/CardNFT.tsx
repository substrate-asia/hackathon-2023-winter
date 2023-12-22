"use client"
import React from 'react'
import { 
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
} from '..'
import Image from 'next/image'
import ActionButton from '../buttons/ActionButton'
import chains from '../chains.json'


interface CardNftProps {
  chain: Chain,
  name: string,
  amount: number,
  uri:string,
  asset: MultiAsset
}

const CardNFT = ({chain, name, amount, uri, asset}: CardNftProps) => {
  return (
    <Card className="w-96 border-2 rounded-md" placeholder={undefined}>
    <CardHeader floated={false} className="h-80 flex items-center justify-evenly rounded-sm" placeholder={undefined}>
      <Image src={uri} alt="profile-picture" layout="fill" objectFit="cover" />
    </CardHeader>
    <CardBody className="text-center" placeholder={undefined}>
      <Typography variant="h4" color="blue-gray" className="mb-2" placeholder={undefined}>
        {name}
      </Typography>
      <Typography color="blue-gray" className="font-medium" textGradient placeholder={undefined}>
        {amount} {chain.name}
      </Typography>
    </CardBody>
    <CardFooter className="flex justify-center gap-7 pt-2" placeholder={undefined}>
      <ActionButton chain={chains['parachain-nfts']} action={{name: "Buy", chain:chains['parachain-nfts'], desiredNftInstance: Uint8Array.from([1]), desiredNftLocation: asset.id.Concrete}} />
    </CardFooter>
  </Card>
  )
}

export default CardNFT