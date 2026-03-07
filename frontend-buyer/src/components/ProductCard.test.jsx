import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from './ProductCard'

const mockProduct = {
  productId: 'test-1',
  createdAt: new Date().toISOString(),
  listing: {
    title: 'Handcrafted Clay Pot',
    description: 'A beautiful handcrafted clay pot made by local artisans.',
    tags: ['handmade', 'pottery', 'clay'],
  },
  photoUrls: ['https://example.com/image.jpg'],
}

describe('ProductCard', () => {
  it('renders product title and description', () => {
    render(<ProductCard product={mockProduct} onClick={() => {}} />)
    expect(screen.getByText('Handcrafted Clay Pot')).toBeInTheDocument()
    expect(
      screen.getByText(/A beautiful handcrafted clay pot made by local artisans/)
    ).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ProductCard product={mockProduct} onClick={onClick} />)
    await user.click(
      screen.getByRole('button', { name: /view details for handcrafted clay pot/i })
    )
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('has accessible label for the product', () => {
    render(<ProductCard product={mockProduct} onClick={() => {}} />)
    expect(
      screen.getByRole('button', { name: /view details for handcrafted clay pot/i })
    ).toBeInTheDocument()
  })
})
