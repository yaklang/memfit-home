import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import type {Props} from '@theme/MDXComponents/Img';

type ImageLayout = 'wide' | 'standard' | 'narrow' | 'tall';

function getNumericDimension(value: Props['width']): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return Number.parseFloat(value);
  }

  return 0;
}

function getImageLayout(width: number, height: number): ImageLayout {
  if (width <= 0 || height <= 0) {
    return 'standard';
  }

  const ratio = width / height;

  if ((ratio < 0.9 && height >= 900) || height / width >= 1.45) {
    return 'tall';
  }

  if (ratio >= 1.55) {
    return 'wide';
  }

  if (ratio < 0.95) {
    return 'narrow';
  }

  return 'standard';
}

export default function MDXImg(props: Props): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [layout, setLayout] = useState<ImageLayout>(() =>
    getImageLayout(
      getNumericDimension(props.width),
      getNumericDimension(props.height),
    ),
  );
  const {className, onLoad, ...imgProps} = props;
  const altText =
    typeof imgProps.alt === 'string' && imgProps.alt.length > 0
      ? imgProps.alt
      : 'Document image';

  const handleLoad = useCallback<React.ReactEventHandler<HTMLImageElement>>(
    (event) => {
      const image = event.currentTarget;
      setLayout(getImageLayout(image.naturalWidth, image.naturalHeight));
      onLoad?.(event);
    },
    [onLoad],
  );

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const lightbox =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="memfit-doc-lightbox"
            data-layout={layout}
            role="dialog"
            aria-modal="true"
            aria-label={altText}
            onClick={(event) => {
              if (event.currentTarget === event.target) {
                setIsOpen(false);
              }
            }}>
            <button
              type="button"
              className="memfit-doc-lightbox__close"
              aria-label="Close image preview"
              onClick={() => setIsOpen(false)}>
              X
            </button>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
              decoding="async"
              loading="eager"
              {...imgProps}
              alt={altText}
              className="memfit-doc-lightbox__image"
            />
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        className="memfit-doc-figure"
        data-layout={layout}
        aria-label={`Open image preview: ${altText}`}
        onClick={() => setIsOpen(true)}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          decoding="async"
          loading="lazy"
          {...imgProps}
          onLoad={handleLoad}
          className={clsx('memfit-doc-image', className)}
        />
      </button>
      {lightbox}
    </>
  );
}
