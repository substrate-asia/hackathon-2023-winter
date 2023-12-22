import { useDropzone, FileWithPath } from 'react-dropzone';

interface IProps {
  setImg: (img: string) => void;
}

export default function FileInput() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div
        className="flex h-[150px] w-[471px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-foreground px-[99px] py-[30px]"
        {...getRootProps()}
      >
        <div className="flex w-full max-w-[242px] flex-col items-center justify-center gap-4">
          <div className="rounded-[17px] bg-primary/[0.24] px-4 py-[6px] text-[0.75rem]/[1.5rem] font-light text-primary">
            Upload{' '}
          </div>
          <div className="w-full space-y-2">
            <p className="text-[1rem]">Supporting documents</p>
            <p className="text-[0.5rem] font-light">
              Max 4 files total of 5mb each. PDF, PNG, MP4 or MP3
            </p>
          </div>
        </div>
        <input {...getInputProps({ className: 'hidden' })} />
      </div>
    </div>
  );
}
