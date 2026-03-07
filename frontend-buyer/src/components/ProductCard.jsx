import React from 'react'
import PropTypes from 'prop-types'
import { Hand, ChevronRight } from 'lucide-react'

function getDaysAgo(dateString) {
  if (!dateString) return ''
  const days = Math.floor(
    (Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24)
  )
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function ProductCard({ product, onClick }) {
  const listing = product?.listing ?? {}
  const photoUrls = Array.isArray(product?.photoUrls) ? product.photoUrls : []
  const tags = Array.isArray(listing.tags) ? listing.tags.slice(0, 3) : []
  const description = listing.description ?? ''
  const truncatedDesc =
    description.length > 100 ? `${description.substring(0, 100)}...` : description
  const imageUrl = photoUrls[0] ?? 'https://via.placeholder.com/400x400?text=Handcrafted+Product'

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <article
      className="group bg-card border border-border-gray rounded rounded shadow-card transition-shadow duration-200 cursor-pointer flex flex-col hover:shadow-card-hover focus-ring focus:outline-none p-3"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${listing.title ?? 'product'}`}
    >
      <div className="relative w-full pt-[100%] overflow-hidden bg-card mb-2">
        <img
          src={imageUrl}
          alt={listing.title ?? 'Handcrafted product'}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/400x400?text=Handcrafted+Product'
          }}
        />
        <div
          className="absolute top-1 left-1 flex items-center gap-1 bg-new-badge-bg text-new-badge-text py-0.5 px-1 rounded-[3px] text-[11px] font-normal"
          aria-hidden="true"
        >
          <Hand size={12} strokeWidth={2} />
          Handmade
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="text-[14px] font-normal text-text-primary mb-1 leading-5 line-clamp-2">
          {listing.title}
        </h3>

        <p className="text-text-secondary text-[12px] leading-4 mb-2 line-clamp-2">
          {truncatedDesc}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag, index) => (
              <span
                key={tag + index}
                className="bg-bg-light text-text-secondary py-0.5 px-1.5 rounded-[3px] text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-border-gray">
          <span className="text-[11px] text-text-muted">
            {getDaysAgo(product?.createdAt)}
          </span>
          <span className="inline-flex items-center gap-0.5 text-link-blue text-[13px] font-bold hover:text-link-blue-hover">
            View Details
            <ChevronRight size={16} strokeWidth={2} />
          </span>
        </div>
      </div>
    </article>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.string,
    createdAt: PropTypes.string,
    listing: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    photoUrls: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default ProductCard
