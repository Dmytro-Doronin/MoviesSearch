import Image, { type StaticImageData } from 'next/image';
import { useState } from 'react';

import noPoster from '@/assets/no-poster.png';

import styles from './image.module.scss';

type CardImageProps = {
    src?: string | StaticImageData;
    alt?: string;
    className?: string;
    variant: 'small' | 'middle' | 'large' | 'horizontal' | 'tiny' | 'largeRound' | 'vertical';
};

export const CardImage = ({ src, alt = 'Image', className, variant }: CardImageProps) => {
    const [imgSrc, setImgSrc] = useState<string | StaticImageData>(src ?? noPoster);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            className={`${styles[variant]} ${styles.image} ${className}`}
            onError={() => setImgSrc(noPoster)}
            sizes="(max-width: 768px) 50vw, 200px"
        />
    );
};
