import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Modal } from '@gear-js/ui';
import { Accounts } from '../accounts';


type Props = {
  accounts: InjectedAccountWithMeta[] | undefined;
  close: () => void;
};

function AccountsModal({ accounts, close }: Props) {
  return (
    <Modal heading='Connect' close={close}>
      <center>
      {accounts ? (
        <Accounts list={accounts} onChange={close} />
      ) : (
        <p>
          Wallet extension was not found.
          {' '}
          <a href='https://wiki.gear-tech.io/docs/idea/account/create-account' target='_blank' rel='noreferrer'
             className='link-text'>
            here
          </a>.
        </p>
      )}
      </center>
    </Modal>
  );
}

export { AccountsModal };
