import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { Mocked } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import ResourceLink from './ResourceLink';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

import { MemoryRouter } from 'react-router-dom';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
);

describe('ResourceLink', () => {
    it('renders fetched name correctly and links to details', async () => {
        const mockData = { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });

        render(<ResourceLink url="https://swapi.dev/api/people/1/" isLast={true} />, { wrapper });

        await waitFor(() => {
            const link = screen.getByRole('link', { name: 'Luke Skywalker' });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', '/details');
        });

        // Ensure no comma if isLast is true
        expect(screen.queryByText(',')).not.toBeInTheDocument();
    });

    it('renders comma if not last', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { title: 'A New Hope' } });

        render(<ResourceLink url="https://swapi.dev/api/films/1/" isLast={false} />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('A New Hope')).toBeInTheDocument();
        });

        expect(screen.getByText(',')).toBeInTheDocument();
    });
});
