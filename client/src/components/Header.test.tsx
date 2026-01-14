import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            if (key === 'header.title') return 'SWStarter';
            return key;
        },
        i18n: {
            changeLanguage: vi.fn(),
            language: 'en',
        },
    }),
}));

// Mock country-flag-icons
vi.mock('country-flag-icons/react/3x2', () => ({
    US: () => <div data-testid="flag-us">US Flag</div>,
    BR: () => <div data-testid="flag-br">BR Flag</div>,
    ES: () => <div data-testid="flag-es">ES Flag</div>,
}));

describe('Header', () => {
    it('renders the header title correctly', () => {
        render(<Header />);
        expect(screen.getByText('SWStarter')).toBeInTheDocument();
    });
});
