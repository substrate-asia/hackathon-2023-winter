"use client";
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from "react"
import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react"
import { Avatar, Button, Menu, MenuHandler, MenuList, MenuItem, DialogHeader, DialogBody, Dialog, DialogFooter, Input, Typography, Spinner } from '@/components/material-tailwind'


import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage, useSwitchNetwork } from "wagmi"
import { mandala } from '@/utils/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { SiweMessage } from "siwe"

import { trpcQuery } from '@/server/trpcProvider'

const Login = () => {
  const router = useRouter()
  const { data: session, status, update: updateSession } = useSession()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { chain } = useNetwork()
  const { connect, isLoading, error } = useConnect({
    connector: new InjectedConnector(),
  })
  // const { disconnect } = useDisconnect()
  const { switchNetwork, chains, status: switchStatus } = useSwitchNetwork({ chainId: mandala.id })

  const [openDia, setOpenDia] = useState(false)
  const [handleInput, setHandleInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const { mutateAsync: updateHandleName, isLoading: isSetHandleNameLoading, error: handleNameSetError, reset: resetHandleNameSetError } = trpcQuery.users.setHandleName.useMutation({
    onSuccess: updateSession,
  })

  const onSignIn = async (sType: string) => {
    if (sType === 'credentials') {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      const res = await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      })
    } else {
      await signIn(sType)
    }
    // router.replace('/')
  }

  const onCommitHandleName = async () => {
    await updateHandleName({ name: nameInput, handle: handleInput })
    setOpenDia(false)
  }

  const needSwitchChain = useMemo(() => {
    return chain?.id !== mandala.id
  }, [chain])

  useEffect(() => {
    if (isConnected && !session) {
      // fuck
      // onSignIn('credentials')
    } else if (isConnected && session) {
      if (needSwitchChain) {
        if (switchStatus === 'idle') {
          switchNetwork?.()
        }
      }
    }
  }, [isConnected, session, needSwitchChain, switchStatus])

  useEffect(() => {
    if (session && !(session.user as any)?.handle) {
      setOpenDia(true)
    }
  }, [session])

  const checkHandleValidate = async () => {
    await updateHandleName({ name: nameInput, handle: handleInput, check: true })
  }

  useEffect(() => {
    let delayInputTimeoutId: string | number | NodeJS.Timeout | undefined
    if (handleInput) {
      delayInputTimeoutId = setTimeout(() => {
        checkHandleValidate();
      }, 300);
    }
    return () => clearTimeout(delayInputTimeoutId);
  }, [handleInput])

  if (session) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-row gap-2.5">
          <Link href="/me" className="flex items-center gap-2">
            <Avatar src={'https://effigy.im/a/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045.png'} size="sm" />
            <Typography variant="h6">{session.user.name}</Typography>
          </Link>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
        {/* <Button onClick={() => setOpenDia(true)}>open</Button> */}
        <Dialog open={openDia} handler={() => setOpenDia(!openDia)} dismiss={{ enabled: false }}>
          <DialogHeader>Last Step.</DialogHeader>
          <DialogBody>
            <form className="mt-8 mb-2 flex flex-col gap-6 px-5">
              We require you set your handle and name
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Name
              </Typography>
              <Input
                variant="static"
                value={nameInput}
                onChange={e => { resetHandleNameSetError(); setNameInput(e.target.value) }}
                size="lg"
                placeholder="Name"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                icon={isSetHandleNameLoading ? <Spinner /> : null}
                success={!!nameInput}
              />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Handle
              </Typography>
              <Input
                variant="static"
                value={handleInput}
                onChange={e => { resetHandleNameSetError(); setHandleInput(e.target.value) }}
                size="lg"
                placeholder="Handle"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                icon={isSetHandleNameLoading ? <Spinner /> : null}
                success={!!handleInput && !handleNameSetError && !isSetHandleNameLoading}
                error={!!handleNameSetError}
              />
              {handleNameSetError && <Typography
                variant="small"
                color="red"
                className="mt-2 flex items-center gap-1 font-normal"
              >
                {handleNameSetError.message}
              </Typography>}
            </form>
          </DialogBody>
          <DialogFooter>
            <Button disabled={!nameInput || !handleInput} loading={isSetHandleNameLoading} variant="gradient" onClick={onCommitHandleName}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    )
  }
  return (
    <Menu>
      <MenuHandler>
        <Button loading={status === 'loading'}>Sign In</Button>
      </MenuHandler>
      <MenuList>
        <MenuItem onClick={() => onSignIn('google')}>SIGN IN WITH GOOGLE</MenuItem>
        <MenuItem onClick={() => onSignIn('github')}>SIGN IN WITH GITHUB</MenuItem>
        <hr className="my-3" />
        <MenuItem onClick={() => isConnected ? signIn('credentials') : connect()}>SIGN IN WITH METAMASK</MenuItem>
      </MenuList>
    </Menu>
  )
}
export default Login