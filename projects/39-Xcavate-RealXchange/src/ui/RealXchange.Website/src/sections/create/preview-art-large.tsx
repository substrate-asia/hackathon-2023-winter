import Image from 'next/image';
import PreviewModalContainer from '../../components/ui/preview-modal-container';
import { BaseButton } from '../../components/ui/base-button';
import Spinner from '@/components/ui/spinner';

type Props = {
  project?: any;
  open: boolean;
  close: () => void;
  images: (string | undefined)[];
  loading: boolean;
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#ffffff" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export function PreviewArtLarge({ open, close, images, loading }: Props) {
  return (
    <PreviewModalContainer
      header={{
        title: 'Artwork preview',
        description: 'Accept or edit text prompt to regenerate.'
      }}
      openModal={open}
      closeModal={close}
    >
      <div className="flex w-full flex-col items-center gap-[62px]">
        {/* <div className="flex w-full flex-wrap justify-center gap-4"> */}
        {loading ? (
          <div className="justify-center py-[150px]">
            <Spinner />
            <div>Generating images...</div>
          </div>
        ) : images.length === 1 ? (
          images.map(url => {
            if (url) {
              return (
                <div key={url} className="h-full w-full">
                  <Image
                    key={url}
                    src={url}
                    alt=""
                    width={382}
                    height={392}
                    priority
                    placeholder={`data:image/svg+xml;base64,${toBase64(
                      shimmer(700, 475)
                    )}`}
                  />
                </div>
              );
            }
          })
        ) : (
          <div className="grid h-full w-full grid-cols-2 gap-4">
            {images.map(url => {
              if (url) {
                return (
                  // <div key={url} className="grid grid-cols-4 gap-[26px]">
                  <Image
                    key={url}
                    src={url}
                    alt=""
                    width={261}
                    height={261}
                    priority
                    placeholder={`data:image/svg+xml;base64,${toBase64(
                      shimmer(700, 475)
                    )}`}
                  />
                  // </div>
                );
              }
            })}
          </div>
        )}
        {/* {loading ? (
            <div className="justify-center">
              <Spinner />
              <div>Generating images...</div>
            </div>
          ) : (
            images.map(url => {
              if (url) {
                return (
                  <div key={url} className="flex flex-col items-center gap-[26px]">
                    <Image
                      key={url}
                      src={url}
                      alt=""
                      width={261}
                      height={261}
                      priority
                      placeholder={`data:image/svg+xml;base64,${toBase64(
                        shimmer(700, 475)
                      )}`}
                    />
                    <BaseButton onClick={close}>Regenerate V1</BaseButton>
                  </div>
                );
              }
            })
          )} */}
        {/* </div> */}
      </div>
    </PreviewModalContainer>
  );
}
