import Image from 'next/image';
import PreviewModalContainer from '../../components/ui/preview-modal-container';
import { BaseButton } from '../../components/ui/base-button';

type Props = {
  project?: any;
  open: boolean;
  close: () => void;
};

export function PreviewArtLarge({ open, close }: Props) {
  return (
    <PreviewModalContainer
      header={{ title: '', description: '' }}
      openModal={open}
      closeModal={close}
    >
      <div className="flex w-full flex-col gap-[62px]">
        <div className="grid w-full grid-cols-4 gap-4">
          <div className="flex flex-col items-center gap-[26px]">
            <Image
              src={'/images/projects/project-seven.png'}
              alt=""
              width={261}
              height={261}
              priority
            />
            <BaseButton onClick={close}>Regenerate V1</BaseButton>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Image
              src={'/images/projects/project-seven.png'}
              alt=""
              width={261}
              height={261}
              priority
            />
            <BaseButton onClick={close}>Regenerate V1</BaseButton>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Image
              src={'/images/projects/project-seven.png'}
              alt=""
              width={261}
              height={261}
              priority
            />
            <BaseButton onClick={close}>Regenerate V1</BaseButton>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Image
              src={'/images/projects/project-seven.png'}
              alt=""
              width={261}
              height={261}
              priority
            />
            <BaseButton onClick={close}>Regenerate V1</BaseButton>
          </div>
        </div>
      </div>
    </PreviewModalContainer>
  );
}
