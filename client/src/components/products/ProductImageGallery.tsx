import { useState } from "react";
import type { ProductImage } from "../../types/product.types";
import styles from "./ProductImageGallery.module.css";

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
          src={selectedImage.url}
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
              className={styles.thumbnail}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={image.url}
                alt={image.alt || productName}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;