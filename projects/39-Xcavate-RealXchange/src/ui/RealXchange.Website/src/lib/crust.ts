// import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';

export async function createAuthHeader(address: string) {
  const { web3Enable, web3FromAddress } = await import('@polkadot/extension-dapp');
  await web3Enable('RealXchange');

  const injector = await web3FromAddress(address);

  const signature = await injector.signer.signRaw!({
    type: 'bytes',
    address,
    data: stringToHex(address)
  });

  const sigHex = signature.signature;

  const authHeader = Buffer.from(`sub-${address}:${sigHex}`).toString('base64');

  return authHeader;
}

export async function uploadImageToIPFS(
  imageUrl: string,
  authHeader: string,
  uploadUrl: string
) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Network response was not ok.');
    const imageBlob = await response.blob();

    const formData = new FormData();
    formData.append('file', imageBlob, 'image.jpg');

    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`
      },
      body: formData
    };

    const uploadResponse = await fetch(uploadUrl, requestOptions);
    if (!uploadResponse.ok) throw new Error('Upload failed.');
    const data = await uploadResponse.json();
    return data;
  } catch (error) {
    console.error('Error during image upload:', error);
    throw error;
  }
}

export async function pinImageOnCrust(
  authHeader: string,
  crustId: string,
  filename: string,
  endpointUrl: string
) {
  try {
    const body = JSON.stringify({
      cid: crustId,
      name: filename
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authHeader}`
      },
      body: body
    };

    const response = await fetch(endpointUrl, requestOptions);
    if (!response.ok) throw new Error('Network response was not ok.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during POST request:', error);
    throw error;
  }
}

export async function uploadAndPinMultiple(authHeader: string, imageList: any[]) {
  try {
    const imageUrls = extractImageUrls(imageList);
    const uploadCalls = imageUrls.map(url => {
      return uploadImageToIPFS(url, authHeader, 'https://crustipfs.xyz/api/v0/add');
    });

    const uploadResults = await Promise.all(uploadCalls);
    const crustIds = uploadResults.map(crustObj => {
      return crustObj.Hash;
    });

    const pinCalls = crustIds.map(cid => {
      return pinImageOnCrust(
        authHeader,
        cid,
        cid + '-RealXchange',
        'https://pin.crustcode.com/psa/pins'
      );
    });

    const pinResults = await Promise.all(pinCalls);
    return crustIds;
  } catch (e) {
    console.log(e);
  }
}

export function extractImageUrls(imageList: any[]): string[] {
  let urls = imageList.map(imgObj => {
    return imgObj.data[0].url;
  });
  return urls;
}

export function stringToHex(value: string) {
  return '0x' + Buffer.from(value, 'utf-8').toString('hex');
}
