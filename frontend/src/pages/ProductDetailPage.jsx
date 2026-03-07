import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../api/client'
import ProductDetail from '../components/ProductDetail'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
  })

  const handleClose = () => navigate('/', { replace: true })

  if (isLoading) return <Loading message="Loading product..." />
  if (isError) {
    return (
      <ErrorMessage
        message={error?.message ?? 'Failed to load product'}
        onRetry={() => refetch()}
      />
    )
  }
  if (!product) return null

  return <ProductDetail product={product} onClose={handleClose} />
}

export default ProductDetailPage
