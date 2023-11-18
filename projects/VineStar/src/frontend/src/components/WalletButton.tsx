import Image from 'next/image'
import { useState, ReactNode } from 'react'
import { useWallet, useAllWallets } from 'useink'
import { Modal, Button } from 'flowbite-react'

export const ConnectWallet = ({ children }: { children: ReactNode }) => {
  const { account, connect, disconnect } = useWallet()
  const wallets = useAllWallets()
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

  const handleConnectClick = extensionName => {
    setIsConnectModalOpen(false)
    connect(extensionName)
  }

  return (
    <>
      <Modal
        show={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      >
        <Modal.Header>Connect to a Wallet</Modal.Header>
        <Modal.Body>
          <ul className='flex flex-wrap'>
            {wallets.map(w => (
              <li key={w.title}>
                {w.installed ? (
                  <button onClick={() => handleConnectClick(w.extensionName)}>
                    <Image
                      width={120}
                      height={120}
                      src={w.logo.src}
                      alt={w.logo.alt}
                    />
                    Connect to {w.title}
                  </button>
                ) : (
                  <a href={w.installUrl}>
                    <Image
                      width={120}
                      height={120}
                      src={w.logo.src}
                      alt={w.logo.alt}
                    />
                    Install {w.title}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
      <Modal
        show={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      >
        <Modal.Header>{account?.name}</Modal.Header>
        <Modal.Body className='flex flex-col gap-2'>
          <p className='text-black'>Address: {account?.address}</p>
          <Button onClick={disconnect}>Disconnect</Button>
        </Modal.Body>
      </Modal>
      <Button
        onClick={
          account
            ? () => {
                setIsAccountModalOpen(true), console.debug('a')
              }
            : () => setIsConnectModalOpen(true)
        }
      >
        {account ? account.name : 'Connect'}
      </Button>
    </>
  )
}
