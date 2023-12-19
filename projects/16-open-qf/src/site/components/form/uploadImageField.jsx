import { useRef, useState } from "react";
import { nextApi } from "services";
import { SystemAdd, SystemDelete } from "@osn/icons/opensquare";
import { cn } from "@/utils";
import { noop } from "lodash-es";

export default function UploadImageField({
  className = "",
  onUploaded = noop,
}) {
  const inputEl = useRef();
  const [currentImage, setCurrentImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSelectFile = () => {
    if (uploading) {
      return;
    }

    inputEl.current?.click();
  };

  const onSelectFile = (e) => {
    e.preventDefault();
    const { files } = e.target;
    uploadImage(files);
  };

  const resetSelectedFile = () => {
    if (inputEl.current) {
      inputEl.current.value = "";
    }
  };

  const uploadImage = (files) => {
    if (files && files.length) {
      const image = files[0];
      if (!/image\/\w+/.exec(image.type)) {
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("banner", image, image.name);
      nextApi
        // FIXME: upload api
        .postFormData("ipfs/files", formData)
        .then(({ result }) => {
          if (result) {
            setCurrentImage(result.url);
            onUploaded(result.url);
          }
        })
        .finally(() => {
          setUploading(false);
          resetSelectedFile();
        });
    }
  };

  return (
    <div>
      <div
        className={cn(
          "w-20 h-20",
          "flex items-center justify-center",
          "bg-fill-bg-secondary",
          "rounded-full border border-stroke-action-default",
          className,
        )}
      >
        {currentImage && (
          <div
            className={cn(
              "group/current",
              "w-full h-full",
              "rounded-[inherit]",
              "overflow-hidden",
              "flex items-center justify-center",
              "relative",
            )}
          >
            <img
              src={currentImage}
              alt=""
              className="object-cover w-full h-full "
            />
            <div
              className={cn(
                "flex items-center justify-center",
                "absolute inset-0",
                "rounded-[inherit]",
                "opacity-0 group-hover/current:opacity-100",
              )}
            >
              <SystemDelete
                className="[&_path]:fill-text-tertiary [&_path]:hover:fill-text-secondary"
                role="button"
                onClick={() => {
                  setCurrentImage("");
                }}
              />
            </div>
          </div>
        )}

        <div
          role="button"
          onClick={handleSelectFile}
          className={cn(
            "w-full h-full",
            "flex items-center justify-center",
            currentImage && "hidden",
          )}
        >
          <SystemAdd className="[&_path]:fill-text-tertiary" />

          <input
            className="hidden"
            type="file"
            ref={inputEl}
            accept="image/*"
            onChange={onSelectFile}
          />
        </div>
      </div>
    </div>
  );
}
