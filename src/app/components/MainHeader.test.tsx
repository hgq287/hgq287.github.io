import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainHeader from './MainHeader';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
    return <img alt={alt || ''} {...props} />;
  },
}));

jest.mock('./ThemeToggle', () => ({
  ThemeToggle: function MockThemeToggle() {
    return <div data-testid="theme-toggle">Theme</div>;
  },
}));

describe('MainHeader', () => {
  describe('hamburger and mobile menu', () => {
    it('shows hamburger button when minimal and showHamburger', () => {
      render(<MainHeader minimal showHamburger />);
      const button = screen.getByTestId('hamburger-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Open menu');
    });

    it('opens mobile menu when hamburger is clicked', () => {
      render(<MainHeader minimal showHamburger />);
      const button = screen.getByTestId('hamburger-button');
      expect(screen.queryByTestId('mobile-menu-drawer')).not.toBeInTheDocument();

      fireEvent.click(button);

      expect(screen.getByTestId('mobile-menu-drawer')).toBeInTheDocument();
      expect(screen.getByRole('dialog', { name: /menu/i })).toBeInTheDocument();
    });

    it('shows nav links inside mobile menu when open', () => {
      render(<MainHeader minimal showHamburger />);
      fireEvent.click(screen.getByTestId('hamburger-button'));
      const drawer = screen.getByTestId('mobile-menu-drawer');

      expect(drawer.querySelector('a[href="/"]')).toHaveTextContent('Home');
      expect(drawer.querySelector('a[href="/blog"]')).toHaveTextContent('Blog');
      expect(drawer.querySelector('a[href="https://github.com/hgq287/hgq287.github.io#readme"]')).toHaveTextContent('Systems');
    });

    it('closes mobile menu when backdrop is clicked', async () => {
      render(<MainHeader minimal showHamburger />);
      fireEvent.click(screen.getByTestId('hamburger-button'));
      expect(screen.getByTestId('mobile-menu-drawer')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('mobile-menu-backdrop'));

      await waitFor(
        () => {
          expect(screen.queryByTestId('mobile-menu-drawer')).not.toBeInTheDocument();
        },
        { timeout: 400 }
      );
    });

    it('closes mobile menu when Close menu button is clicked', async () => {
      render(<MainHeader minimal showHamburger />);
      fireEvent.click(screen.getByTestId('hamburger-button'));
      expect(screen.getByTestId('mobile-menu-drawer')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('sidebar-close-button'));

      await waitFor(
        () => {
          expect(screen.queryByTestId('mobile-menu-drawer')).not.toBeInTheDocument();
        },
        { timeout: 400 }
      );
    });

    it('toggles menu when hamburger is clicked twice', async () => {
      render(<MainHeader minimal showHamburger />);
      const button = screen.getByTestId('hamburger-button');

      fireEvent.click(button);
      expect(screen.getByTestId('mobile-menu-drawer')).toBeInTheDocument();

      fireEvent.click(button);
      await waitFor(
        () => {
          expect(screen.queryByTestId('mobile-menu-drawer')).not.toBeInTheDocument();
        },
        { timeout: 400 }
      );
    });
  });
});
