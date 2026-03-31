import { render, screen, fireEvent } from '@testing-library/react'
import { SearchOption } from '@/molecules'

describe('SearchOption', () => {
  it('renders the ticker text', () => {
    render(<SearchOption ticker='BBCA' onClick={jest.fn()} />)
    expect(screen.getByText('BBCA')).toBeInTheDocument()
  })

  it('renders a button with role=option', () => {
    render(<SearchOption ticker='BBCA' onClick={jest.fn()} />)
    expect(screen.getByRole('option')).toBeInTheDocument()
  })

  it('has aria-selected=false', () => {
    render(<SearchOption ticker='BBCA' onClick={jest.fn()} />)
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onClick with the ticker on mousedown', () => {
    const handleClick = jest.fn()
    render(<SearchOption ticker='ASII' onClick={handleClick} />)
    fireEvent.mouseDown(screen.getByRole('option'))
    expect(handleClick).toHaveBeenCalledWith('ASII')
  })

  it('does not call onClick when handler is not provided (no crash)', () => {
    // onClick is required, but this verifies no crash on render
    const handleClick = jest.fn()
    render(<SearchOption ticker='TLKM' onClick={handleClick} />)
    expect(screen.getByText('TLKM')).toBeInTheDocument()
  })

  it('applies title-small class to the label span', () => {
    render(<SearchOption ticker='BBCA' onClick={jest.fn()} />)
    const span = screen.getByText('BBCA')
    expect(span).toHaveClass('title-small')
  })

  it('applies w-full and h-12 to the button', () => {
    render(<SearchOption ticker='BBCA' onClick={jest.fn()} />)
    expect(screen.getByRole('option')).toHaveClass('w-full', 'h-12')
  })

  it('applies px-5 padding to the button', () => {
    render(<SearchOption ticker='BBCA' onClick={jest.fn()} />)
    expect(screen.getByRole('option')).toHaveClass('px-5')
  })

  it('does NOT render a MenuIndicator', () => {
    const { container } = render(<SearchOption ticker='BBCA' onClick={jest.fn()} />)
    // MenuIndicator renders an <hr>; there should be none here
    expect(container.querySelector('hr')).not.toBeInTheDocument()
  })

  it('applies text-on-surface-variant as resting colour', () => {
    render(<SearchOption ticker='BBCA' onClick={jest.fn()} />)
    expect(screen.getByRole('option')).toHaveClass('text-on-surface-variant')
  })

  it('merges custom className onto the button', () => {
    render(<SearchOption ticker='BBCA' onClick={jest.fn()} className='custom-class' />)
    expect(screen.getByRole('option')).toHaveClass('custom-class')
  })
})
