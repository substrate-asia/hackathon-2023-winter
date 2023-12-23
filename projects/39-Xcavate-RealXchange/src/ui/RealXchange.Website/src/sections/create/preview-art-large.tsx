import Image from 'next/image';
import PreviewModalContainer from '../../components/ui/preview-modal-container';
import { BaseButton } from '../../components/ui/base-button';

type Props = {
  project?: any;
  open: boolean;
  close: () => void;
  images: (string | undefined)[];
};

export function PreviewArtLarge({ open, close, images }: Props) {
  return (
    <PreviewModalContainer
      header={{ title: '', description: '' }}
      openModal={open}
      closeModal={close}
    >
      <div className="flex w-full flex-col items-center gap-[62px]">
        <div className="flex w-full flex-wrap justify-center gap-4">
          {images.map(url => (
            <div className="flex flex-col items-center gap-[26px]">
              <Image src={url!} alt="" width={261} height={261} priority />
              {/* <BaseButton onClick={close}>Regenerate V1</BaseButton> */}
            </div>
          ))}
        </div>
      </div>
    </PreviewModalContainer>
  );
}
