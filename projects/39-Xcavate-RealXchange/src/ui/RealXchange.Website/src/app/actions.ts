'use server';

export async function getImageAsFile(imageUrl: string) {
  const response = await fetch(imageUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error('Network response was not ok.');
  console.log('Response was ok!');
  const imageBlob = await response.blob();

  const formData = new FormData();
  formData.append('file', imageBlob, 'image.jpg');
  return formData;
}

export async function uploadImageToIPFS(
  imageUrl: string,
  authHeader: string,
  uploadUrl: string
) {
  try {
    const formData = await getImageAsFile(imageUrl);

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
    console.log('imageUrls');
    console.log(imageUrls);
    const uploadCalls = imageUrls.map(url => {
      return uploadImageToIPFS(url, authHeader, 'https://crustipfs.xyz/api/v0/add');
    });

    const uploadResults = await Promise.all(uploadCalls);
    console.log('IPFS UPLOAD RESULTS');
    console.log(uploadResults);
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

function extractImageUrls(imageList: any[]): string[] {
  let urls = imageList.map(imgObj => {
    return imgObj.data[0].url;
  });
  return urls;
}
