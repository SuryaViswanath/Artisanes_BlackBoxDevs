import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Hand, BookOpen, ShoppingCart, X } from 'lucide-react'

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x600?text=Handcrafted+Product'

function getFocusables(container) {
  if (!container) return []
  const selector = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')
  return Array.from(container.querySelectorAll(selector))
}

function ProductDetail({ product, onClose }) {
  const dialogRef = useRef(null)
  const previousActiveRef = useRef(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const listing = product?.listing ?? {}
  const photoUrls = Array.isArray(product?.photoUrls) ? product.photoUrls : []
  const bulletPoints = Array.isArray(listing.bulletPoints) ? listing.bulletPoints : []
  const tags = Array.isArray(listing.tags) ? listing.tags : []
  const mainImageUrl = photoUrls[currentImageIndex] ?? PLACEHOLDER_IMAGE

  useEffect(() => {
    previousActiveRef.current = document.activeElement
    const firstFocusable = dialogRef.current && getFocusables(dialogRef.current)[0]
    if (firstFocusable) {
      firstFocusable.focus()
    }
    return () => {
      if (previousActiveRef.current?.focus) {
        previousActiveRef.current.focus()
      }
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose?.()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusables = getFocusables(dialogRef.current)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.()
  }

  const handleBuyOnAmazon = () => {
    const url = product?.amazonUrl || 'https://amazon.com'
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[500] p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      aria-describedby="product-detail-desc"
    >
      <div
        ref={dialogRef}
        className="bg-card rounded shadow-modal max-w-[1200px] w-full max-h-[90vh] overflow-y-auto relative animate-slide-up product-detail-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card border border-border-gray flex items-center justify-center text-text-primary cursor-pointer z-10 transition-colors hover:bg-bg-light focus-ring"
          onClick={onClose}
          aria-label="Close product details"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="sticky top-4 h-fit">
            <div className="w-full aspect-square rounded overflow-hidden bg-card mb-2">
              <img
                src={mainImageUrl}
                alt={listing.title || 'Product image'}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE
                }}
              />
            </div>

            {photoUrls.length > 1 && (
              <div
                className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2"
                role="tablist"
                aria-label="Product images"
              >
                {photoUrls.map((url, index) => (
                  <button
                    key={url + index}
                    type="button"
                    role="tab"
                    aria-selected={index === currentImageIndex}
                    aria-label={`View image ${index + 1}`}
                    className={`aspect-square rounded overflow-hidden cursor-pointer border-2 transition-colors p-0 bg-bg-light hover:border-input-focus ${
                      index === currentImageIndex
                        ? 'border-brand-orange'
                        : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover block" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 bg-new-badge-bg text-new-badge-text py-2 px-3 rounded-[3px] text-[12px] font-bold w-fit">
              <Hand size={14} strokeWidth={2} />
              Handcrafted by Artisan
            </div>

            <h1
              id="product-detail-title"
              className="text-[28px] font-bold text-text-primary m-0 leading-9"
            >
              {listing.title}
            </h1>

            <div
              id="product-detail-desc"
              className="text-[14px] text-text-secondary py-2 px-3 bg-bg-light rounded-[3px]"
            >
              <strong>Category:</strong> {listing.category ?? '—'}
            </div>

            {bulletPoints.length > 0 && (
              <div className="py-4 border-b border-border-gray">
                <h3 className="text-[18px] font-bold text-text-primary m-0 mb-2">
                  Key Features
                </h3>
                <ul className="list-none p-0 m-0">
                  {bulletPoints.map((point, index) => (
                    <li
                      key={index}
                      className="py-2 text-[14px] text-text-primary leading-5 border-b border-border-gray last:border-b-0"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="py-4 border-b border-border-gray">
              <h3 className="text-[18px] font-bold text-text-primary m-0 mb-2">
                Product Description
              </h3>
              <p className="text-[14px] text-text-secondary leading-5 m-0">
                {listing.description ?? 'No description available.'}
              </p>
            </div>

            {listing.storyCard && (
              <div className="bg-new-badge-bg py-4 px-4 rounded border-l-4 border-link-blue">
                <h3 className="text-[18px] font-bold text-link-blue m-0 mb-2 flex items-center gap-2">
                  <BookOpen size={18} strokeWidth={2} />
                  Artisan Story
                </h3>
                <p className="text-[14px] text-text-primary leading-5 m-0">
                  {listing.storyCard}
                </p>
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={tag + index}
                    className="bg-bg-light text-text-secondary py-1 px-2 rounded-[3px] text-[12px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="py-6 text-center">
              <button
                type="button"
                className="w-full py-2 bg-brand-orange text-text-primary border border-brand-orange-border rounded-lg text-[13px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-colors hover:bg-brand-orange-hover focus-ring min-h-[40px]"
                onClick={handleBuyOnAmazon}
              >
                <ShoppingCart size={20} strokeWidth={2} />
                Buy on Amazon
              </button>
              <p className="mt-2 text-[12px] text-text-secondary">
                Secure checkout and fulfillment by Amazon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ProductDetail.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.string,
    listing: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      category: PropTypes.string,
      bulletPoints: PropTypes.arrayOf(PropTypes.string),
      tags: PropTypes.arrayOf(PropTypes.string),
      storyCard: PropTypes.string,
    }),
    photoUrls: PropTypes.arrayOf(PropTypes.string),
    amazonUrl: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ProductDetail
