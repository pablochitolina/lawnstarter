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

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('ResourceLink', () => {
    it('renders loading state initially', () => {
        render(<ResourceLink url="https://swapi.dev/api/people/1/" isLast={false} />, { wrapper });
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('renders fetched name correctly', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { name: 'Luke Skywalker' } });

        render(<ResourceLink url="https://swapi.dev/api/people/1/" isLast={true} />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
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
