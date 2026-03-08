import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { getProducts } from '../api/client'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import './Marketplace.css'

function Marketplace() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const carouselSlides = [
    {
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1500',
      title: 'Discover Authentic Handcrafted Products',
      subtitle: 'Support local artisans and find unique treasures',
      cta: 'Shop Now',
      link: '#products'
    },
    {
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1500',
      title: 'Traditional Crafts, Modern Marketplace',
      subtitle: 'Each piece tells a story of heritage and skill',
      cta: 'Explore',
      link: '#products'
    },
    {
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1500',
      title: 'Handmade with Love',
      subtitle: 'Direct from artisans to your home',
      cta: 'Browse',
      link: '#products'
    }
  ]

  const categories = [
    {
      name: 'All',
      icon: '🌟',
      description: 'Browse all products',
      keywords: []
    },
    {
      name: 'Pottery',
      icon: '🏺',
      description: 'Handcrafted ceramics and pottery',
      keywords: ['pottery', 'ceramic', 'clay', 'vase', 'bowl', 'plate', 'mug']
    },
    {
      name: 'Textiles',
      icon: '🧵',
      description: 'Woven fabrics and textile art',
      keywords: ['textile', 'fabric', 'weaving', 'tapestry', 'cloth', 'embroidery', 'knit', 'crochet']
    },
    {
      name: 'Jewelry',
      icon: '💍',
      description: 'Handmade jewelry and accessories',
      keywords: ['jewelry', 'jewellery', 'necklace', 'bracelet', 'earring', 'ring', 'pendant', 'accessory']
    },
    {
      name: 'Home Decor',
      icon: '🏠',
      description: 'Decorative items for your home',
      keywords: ['home', 'decor', 'decoration', 'wall art', 'candle', 'pillow', 'cushion', 'lamp']
    },
    {
      name: 'Art',
      icon: '🎨',
      description: 'Original artwork and paintings',
      keywords: ['art', 'painting', 'drawing', 'canvas', 'print', 'artwork', 'illustration']
    },
    {
      name: 'Woodwork',
      icon: '🪵',
      description: 'Carved and crafted wooden items',
      keywords: ['wood', 'wooden', 'carving', 'furniture', 'sculpture', 'timber', 'craft']
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const filteredProducts = useMemo(() => {
    let list = data?.products ?? []

    // Filter by category
    if (selectedCategory !== 'All') {
      const category = categories.find(cat => cat.name === selectedCategory)
      if (category && category.keywords.length > 0) {
        list = list.filter((product) => {
          const title = product.listing?.title?.toLowerCase() ?? ''
          const description = product.listing?.description?.toLowerCase() ?? ''
          const tags = Array.isArray(product.listing?.tags)
            ? product.listing.tags.join(' ').toLowerCase()
            : ''
          const searchText = `${title} ${description} ${tags}`

          return category.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
        })
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      list = list.filter((product) => {
        const title = product.listing?.title?.toLowerCase() ?? ''
        const description = product.listing?.description?.toLowerCase() ?? ''
        const tags = Array.isArray(product.listing?.tags)
          ? product.listing.tags.join(' ').toLowerCase()
          : ''
        return title.includes(query) || description.includes(query) || tags.includes(query)
      })
    }

    return list
  }, [data, searchQuery, selectedCategory, categories])

  const handleProductClick = (product) => {
    navigate(`/product/${product.productId}`)
  }

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName)
    // Scroll to products section
    const productsSection = document.getElementById('products')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (isLoading) return <Loading message="Loading amazing products..." />
  if (isError) {
    return (
      <ErrorMessage
        message={error?.message ?? 'Failed to load products'}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="marketplace-container">
      {/* Hero Carousel */}
      <div className="hero-carousel">
        <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {carouselSlides.map((slide, index) => (
            <div key={index} className="carousel-slide">
              <img src={slide.image} alt={slide.title} />
              <div className="carousel-overlay">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <a href={slide.link} className="carousel-btn">{slide.cta}</a>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-heading">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`category-item ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.name)}
              aria-label={`Filter by ${cat.name}`}
              title={cat.description}
            >
              <div className="category-icon">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="products-section">
        <div className="products-header">
          <div className="products-header-left">
            <h2 className="section-heading">
              {selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory} Products`}
            </h2>
            {selectedCategory !== 'All' && (
              <button
                className="clear-filter-btn"
                onClick={() => setSelectedCategory('All')}
                aria-label="Clear category filter"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search handcrafted products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={<Search size={48} className="text-text-muted" />}
            title="No products found"
            description="Try adjusting your search or check back later for new items"
          />
        ) : (
          <>
            <div className="products-count">
              <p className="text-text-secondary text-[12px] m-0">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <div className="products-grid" role="list">
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
      </section>
    </div>
  )
}

export default Marketplace
