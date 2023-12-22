import Head from 'next/head';
import UseFormInput from '../../components/components/UseFormInput';
import { FilesGeneric, GenericUser } from '@heathmont/moon-icons-tw';
import { NFTStorage } from 'nft.storage';
import Card from '../../components/components/Card';
import { Avatar, Button, IconButton } from '@heathmont/moon-core-tw';
import { useState } from 'react';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import { toast } from 'react-toastify';

export default function Register() {
  const { api, deriveAcc, showToast } = usePolkadotContext();
  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8';
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  //Input fields
  const [image, set_Image] = useState({});
  const [Fullname, FullnameInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Add name',
    id: ''
  });

  const [Email, EmailInput] = UseFormInput({
    defaultValue: '',
    type: 'email',
    placeholder: 'Add email',
    id: ''
  });

  const [Password, PasswordInput] = UseFormInput({
    defaultValue: '',
    type: 'password',
    placeholder: 'Add password',
    id: ''
  });

  function chooseImage() {
    let input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('multiple', false);
    input.setAttribute('accept', 'image/*');
    input.onchange = function (event) {
      set_Image(this.files[0]);
    };
    input.click();
  }

  async function registerAccount() {
    const id = toast.loading('Uploading IPFS ...');
    const metadata = image.type ? await client.storeBlob(image) : '';
 
    toast.update(id, { render: "Registering User...", isLoading: true });

    const doAfter = () => {
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    };
    await api._extrinsics.users.registerUser(Fullname, Email, Password, metadata).signAndSend(deriveAcc, ({ status }) => {
      showToast(status, id, 'Registered Successfully!', doAfter);
    });
  }

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="description" content="PlanetDAO - Register" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center flex-col gap-8">
        <div className="gap-8 flex flex-col w-full bg-gohan pt-10 pb-6 border-beerus border">
          <div className="container flex w-full justify-between">
            <div className="flex flex-col gap-1 overflow-hidden">
              <h1 className="text-moon-32 font-bold">Register your account</h1>
              <h3 className="flex gap-2 whitespace-nowrap">It just takes a couple of clicks</h3>
            </div>
          </div>
        </div>
        <Card className="max-w-[480px]">
          <div className="flex items-center justify-center flex-col w-full gap-6">
            <div className="flex flex-col gap-6 w-full p-6">
              <div className="upload">
                <Avatar className="rounded-full border border-beerus bg-gohan text-moon-120 h-32 w-32">{image.type ? <img src={URL.createObjectURL(image)} className="h-full w-full object-cover" /> : <GenericUser className="h-24 w-24 text-trunks" />}</Avatar>
                <div className="flex items-center justify-center round">
                  <IconButton size="xs" icon={<FilesGeneric className="text-gohan" color="#ffff" />} onClick={chooseImage}></IconButton>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-2">
                <h6>Full Name</h6>
                {FullnameInput}
              </div>
              <div className="flex flex-col gap-2">
                <h6>Email</h6>
                {EmailInput}
              </div>
              <div className="flex flex-col gap-2">
                <h6>Password</h6>
                {PasswordInput}
              </div>
            </div>

            <div className="flex w-full justify-end">
              <Button id="RegisterBTN" onClick={registerAccount}>
                Register
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
