import { render, screen, cleanup } from '@testing-library/react'
import ResizeObserver from 'resize-observer-polyfill'
import { SectorRotationTemplate } from '@/templates';

describe('SectorRotationTemplate', () => {
  beforeAll(() => {
    global.ResizeObserver = ResizeObserver
  })

  afterAll(cleanup)

  it("renders gracefully", () => {
      render(<SectorRotationTemplate />);
      expect(screen.getByText("Sector Rotation")).toBeInTheDocument();
    });
})
