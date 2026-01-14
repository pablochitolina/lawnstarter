import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Details from './Details';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Details Page', () => {
    it('renders "No item selected" when no state is passed', () => {
        render(
            <MemoryRouter initialEntries={['/details']}>
                <Routes>
                    <Route path="/details" element={<Details />} />
                </Routes>
            </MemoryRouter>,
            { wrapper }
        );

        expect(screen.getByText(/No item selected/i)).toBeInTheDocument();
    });

    it('renders item details when state is present', () => {
        const mockItem = {
            name: 'Luke Skywalker',
            birth_year: '19BBY',
            gender: 'male',
            eye_color: 'blue',
            hair_color: 'blond',
            height: '172',
            mass: '77',
            films: [],
        };

        render(
            <MemoryRouter initialEntries={[{ pathname: '/details', state: { item: mockItem, type: 'people' } }]}>
                <Routes>
                    <Route path="/details" element={<Details />} />
                </Routes>
            </MemoryRouter>,
            { wrapper }
        );

        expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
        expect(screen.getByText(/19BBY/)).toBeInTheDocument();
        expect(screen.getByText(/male/)).toBeInTheDocument();
    });
});
