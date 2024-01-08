"use client";

import Link from 'next/link'
import { useEffect, useMemo, useState } from "react"
import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react"
import { Avatar, Button, ButtonGroup, DialogBody, Dialog, DialogFooter, Input, Typography, Spinner } from '@material-tailwind/react'


import { useAccount, useConnect, useNetwork, useSignMessage, useSwitchNetwork, useDisconnect } from "wagmi"
import { mandala } from '@/utils/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { SiweMessage } from "siwe"

import { trpcQuery } from '@/server/trpcProvider'


const connector = new InjectedConnector()

const Login = () => {
  const { data: session, status, update: updateSession } = useSession()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { chain } = useNetwork()
  const { connect } = useConnect({ connector })
  const { disconnect } = useDisconnect()
  const { switchNetwork, status: switchStatus } = useSwitchNetwork({ chainId: mandala.id })

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
      await signIn("credentials", {
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
      onSignIn('credentials')
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
          <Link href="/questions/create">
            <Button className="bg-[#d3f2a4] text-black">Create Question</Button>
          </Link>
          <Link href="/me">
            <Button className="flex flex-row gap-1.5 items-center" size="sm" variant="text">
              <Avatar src={'https://effigy.im/a/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045.png'} size="xs" />
              {session.user.name}
            </Button>
          </Link>
          <Button onClick={() => signOut()} variant="text">Sign Out</Button>
        </div>
        {/* <Button onClick={() => setOpenDia(true)}>open</Button> */}
        <Dialog open={openDia} handler={() => setOpenDia(!openDia)} dismiss={{ enabled: false }}>
          <DialogBody>
            <form className="flex flex-col gap-6">
              <Typography variant="lead">Finishing your profile to continue.</Typography>
              <div>
              <Input
                label="Name"
                variant="static"
                value={nameInput}
                onChange={e => { resetHandleNameSetError(); setNameInput(e.target.value) }}
                size="lg"
                placeholder="Your nickname"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                icon={isSetHandleNameLoading ? <Spinner /> : null}
                success={!!nameInput}
              />
              </div>
              <Input
                label="Handle"
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
            <ButtonGroup>
              <Button
                onClick={() => {
                  disconnect()
                  setOpenDia(false)
                  signOut()
                }}
              >
                  Disconnect
              </Button>
              <Button disabled={!nameInput || !handleInput} loading={isSetHandleNameLoading} variant="gradient" onClick={onCommitHandleName}>
                <span>Confirm</span>
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </Dialog>
      </div>
    )
  }
  return (
    <Button
      onClick={() => isConnected ? signIn('credentials') : connect()}
      loading={status === 'loading'}
      variant="outlined"
    >
      Connect Wallet
    </Button>
  )
  // return (
  //   <Menu>
  //     <MenuHandler>
  //       <Button loading={status === 'loading'} variant="outlined">Sign In</Button>
  //     </MenuHandler>
  //     <MenuList>
  //       <MenuItem onClick={() => onSignIn('google')}>SIGN IN WITH GOOGLE</MenuItem>
  //       <MenuItem onClick={() => onSignIn('github')}>SIGN IN WITH GITHUB</MenuItem>
  //       <hr className="my-3" />
  //       <Button onClick={() => isConnected ? signIn('credentials') : connect()}>Connect Wallet</Button>
  //     </MenuList>
  //   </Menu>
  // )
}
export default Login