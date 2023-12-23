'use client';

import { useState } from 'react'
import { parseUnits } from 'viem'
import { usePublicClient, useWalletClient, useBalance, useAccount } from 'wagmi'
import {
  Card,
  CardBody,
  Typography,
  Button,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Alert,
} from '@/components/material-tailwind'
import { LDOT, DOT } from '@acala-network/contracts/utils/MandalaTokens'
import Homa from '@acala-network/contracts/build/contracts/Homa.json'
import { HOMA } from '@acala-network/contracts/utils/Predeploy'

import { mandala } from '@/utils/chains'

export function Profile() {
  const { address } = useAccount()
  const { data: ldotData, isLoading: ldotIsLoading, refetch: ldotRefetch } = useBalance({
    address,
    token: LDOT,
  })
  const { data: dotData, isLoading: dotIsLoading, refetch: dotRefetch } = useBalance({
    address,
    token: DOT,
  })
  const [openUnstack, setOpenUnstack] = useState(false)
  const [openAlert, setAlert] = useState(false)
  const [openSwap, setOpenSwap] = useState(false)
  const [openBridge, setOpenBridge] = useState(false)

  return (
    <div className="m-x-auto">
      <Alert className="mb-4" color="green" open={openAlert} onClose={() => setAlert(false)}>
        Unstack successfully.
      </Alert>
      <UnstackDialog
        open={openUnstack}
        handler={() => setOpenUnstack(!openUnstack)}
        onSuccess={() => {
          setAlert(true)
          setOpenUnstack(!openUnstack)
          dotRefetch()
          ldotRefetch()
        }}
      />
      <Dialog open={openSwap} handler={() => setOpenSwap(!openSwap)}>
        <DialogHeader>Swap</DialogHeader>
        <DialogBody>
          <img className="pointer-events-none m-auto" alt="" src="/mock-swap.png" />
        </DialogBody>
      </Dialog>
      <Dialog open={openBridge} handler={() => setOpenBridge(!openBridge)}>
        <DialogHeader>Bridge</DialogHeader>
        <DialogBody>
          <img className="pointer-events-none m-auto" alt="" src="/mock-bridge.png" />
        </DialogBody>
      </Dialog>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              LDOT Balance
            </Typography>
            <Typography className="text-lg">
              {
                ldotIsLoading ? (
                  <Spinner />
                ) : ldotData ? ldotData.formatted : '-'
              }
            </Typography>
            <div className="flex justify-end mt-10">
              <Button onClick={() => setOpenUnstack(true)}>Unstack</Button>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              DOT Balance
            </Typography>
            <Typography className="text-lg">
              {
                dotIsLoading ? (
                  <Spinner />
                ) : dotData ? dotData.formatted : '-'
              }
            </Typography>
            <div className="flex justify-end mt-10 gap-2">
              <Button onClick={() => setOpenSwap(true)}>Swap</Button>
              <Button onClick={() => setOpenBridge(true)}>Bridge</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}


const UnstackDialog = ({ open, handler, onSuccess }: any) => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const handleConfirm = async () => {
    if (!value || Number(value) < 10) {
      alert('Amount should be greater than 10.')
      return
    }
    if (!walletClient) {
      return
    }
    setLoading(true)
    try {
      const hash = await walletClient.writeContract({
        chain: mandala,
        address: HOMA,
        abi: Homa.abi,
        functionName: 'requestRedeem',
        args: [parseUnits(value, 10), true]
      })
      await publicClient.waitForTransactionReceipt({
        hash: hash,
        timeout: 300_000,
      })
    } catch (error) {
      console.error(error)
      setLoading(false)
      handler()
      return
    }
    setLoading(false)
    onSuccess()
  }

  return (
    <Dialog open={open} handler={handler} dismiss={{ enabled: false }}>
      <DialogHeader>Unstack LDOT</DialogHeader>
      <DialogBody>
        <Input
          size="lg"
          label="Unstack LDOT Amount"
          onChange={(e) => setValue(e.target.value)}
        />
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handler}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button loading={loading} variant="gradient" color="green" onClick={handleConfirm}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
