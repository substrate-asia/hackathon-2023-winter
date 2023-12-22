import { Profile } from '@lens-protocol/react-web';

import { useBuildResourceSrc } from '../../hooks/useBuildResourceSrc';
import { Avatar } from '@chakra-ui/react';

const PROFILE_PICTURE_SIZE = '4rem';

function FallbackProfilePicture() {
  return (
    <div
      style={{
        height: PROFILE_PICTURE_SIZE,
        width: PROFILE_PICTURE_SIZE,
        background: '#b6b4b4',
        borderRadius: '50%',
        display: 'inline-block',
      }}
    />
  );
}

type RemoteProfilePictureProps = {
  url: string;
};

function RemoteProfilePicture({ url }: RemoteProfilePictureProps) {
  const src = useBuildResourceSrc(url);
  return (
    <Avatar
      src={src}
      style={{
        height: PROFILE_PICTURE_SIZE,
        width: PROFILE_PICTURE_SIZE,
        borderRadius: '50%',
      }}
    />
  );
}

type ProfilePictureProps = {
  picture: Profile['picture'];
};

export function ProfilePicture({ picture }: ProfilePictureProps) {
  if (picture == '0x770a') return <RemoteProfilePicture url="https://cdn-icons-png.flaticon.com/512/141/141783.png" />
  else return <RemoteProfilePicture url="https://s3-alpha.figma.com/hub/file/1844050371/ebbfb0be-4adb-45be-baa1-354c4f691440-cover.png" />
  // if (!picture) return <FallbackProfilePicture />;

  // switch (picture.__typename) {
  //   case 'MediaSet':
  //     return <RemoteProfilePicture url={picture.original.url} />;
  //   default:
  //     return <FallbackProfilePicture />;
  // }
}
