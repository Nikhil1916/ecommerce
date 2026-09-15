import { useState } from "react";
import type { ProductImage } from "../../types/product.types";
import styles from "./ProductImageGallery.module.css";
import { getOptimizedImageUrl } from "../../utils/cloudinary";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery = ({
  images,
  productName,
}: ProductImageGalleryProps) => {
  //   const mainImage = images[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = images[selectedImageIndex];

  if (!selectedImage) {
    return (
      <div className={styles.gallery}>
        <div className={styles.noImage}>
          <span>No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <img
          src={getOptimizedImageUrl(selectedImage.url, 800)}
          srcSet={`
    ${getOptimizedImageUrl(selectedImage.url, 400)} 400w,
    ${getOptimizedImageUrl(selectedImage.url, 800)} 800w,
    ${getOptimizedImageUrl(selectedImage.url, 1200)} 1200w
  `}
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={selectedImage.alt || productName}
          className={styles.mainImage}
        />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={image._id}
              type="button"
              className={`${styles.thumbnail} ${
                index === selectedImageIndex ? styles.activeThumbnail : ""
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={getOptimizedImageUrl(image.url, 120)}
                alt={image.alt || `${productName} ${index + 1}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
