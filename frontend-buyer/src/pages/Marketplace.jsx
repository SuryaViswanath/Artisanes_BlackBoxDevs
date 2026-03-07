import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { getProducts } from '../api/client'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

function Marketplace() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = React.useState('')

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const filteredProducts = useMemo(() => {
    const list = data?.products ?? []
    if (!searchQuery.trim()) return list
    const query = searchQuery.toLowerCase()
    return list.filter((product) => {
      const title = product.listing?.title?.toLowerCase() ?? ''
      const description = product.listing?.description?.toLowerCase() ?? ''
      const tags = Array.isArray(product.listing?.tags)
        ? product.listing.tags.join(' ').toLowerCase()
        : ''
      return (
        title.includes(query) ||
        description.includes(query) ||
        tags.includes(query)
      )
    })
  }, [data, searchQuery])

  const handleProductClick = (product) => {
    navigate(`/product/${product.productId}`)
  }

  if (isLoading) {
    return <Loading message="Loading amazing products..." />
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error?.message ?? 'Failed to load products'}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="max-w-[1500px] mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-[28px] font-bold leading-9 text-text-primary mb-1">
          Discover Authentic Handcrafted Products
        </h1>
        <p className="text-[14px] text-text-secondary m-0">
          Support local artisans and find unique, handmade treasures
        </p>
      </div>

      <div className="flex max-w-2xl mx-auto mb-4">
        <label htmlFor="marketplace-search" className="sr-only">
          Search for products, materials, or styles
        </label>
        <input
          id="marketplace-search"
          type="search"
          placeholder="Search for products, materials, or styles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-10 border border-border-input rounded-l rounded-r-none py-1 px-2 text-[15px] transition-[border-color,box-shadow] focus:outline-none focus:border-input-focus focus:shadow-input-focus"
          autoComplete="off"
          aria-label="Search for products, materials, or styles"
        />
        <span
          className="h-10 w-[45px] bg-search-btn rounded-r flex items-center justify-center text-text-primary shrink-0"
          aria-hidden="true"
        >
          <Search size={20} strokeWidth={2} />
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Search size={48} className="text-text-muted" />}
          title="No products found"
          description="Try adjusting your search or check back later for new items"
        />
      ) : (
        <>
          <div className="mb-3">
            <p className="text-text-secondary text-[12px] m-0">
              Showing {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          <div
            className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 mb-4"
            role="list"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Marketplace
