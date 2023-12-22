import Image from 'next/image';
import { useEffect, useState } from 'react';

const ImageListDisplay = ({ images, onDeleteImage }: { images: any[]; onDeleteImage: (i) => number }) => {
  const [displayImages, setDisplayImages] = useState([]);

  useEffect(() => {
    setDisplayImages(images);
  }, [images]);

  return (
    <div className="flex gap-2">
      {displayImages.map((item, i) => {
        return (
          <button key={i} onClick={() => onDeleteImage(i)} name="deleteBTN" className="h-[64px] w-[128px] rounded-moon-i-xs relative overflow-hidden">
            {item.type.includes('image') ? (
              <Image src={URL.createObjectURL(item)} alt="" fill={true} className="object-cover" />
            ) : (
              <>
                <div className="Goal-Uploaded-File-Container">
                  <span className="Goal-Uploaded-File-name">{item.name.substring(0, 10)}...</span>
                </div>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ImageListDisplay;
