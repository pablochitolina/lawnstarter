import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Home';
import * as apiClient from '../api/client';

// Mock the API client
vi.mock('../api/client', () => ({
    search: vi.fn(),
}));

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
);

describe('Home Page', () => {
    it('renders search input and button', () => {
        render(<Home />, { wrapper });
        expect(screen.getByPlaceholderText(/e.g. Chewbacca/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'SEARCH' })).toBeInTheDocument();
    });

    it('disables search button when input is empty', () => {
        render(<Home />, { wrapper });
        const button = screen.getByRole('button', { name: 'SEARCH' });
        expect(button).toBeDisabled();
    });

    it('enables search button when input has text', () => {
        render(<Home />, { wrapper });
        const input = screen.getByPlaceholderText(/e.g. Chewbacca/i);
        const button = screen.getByRole('button', { name: 'SEARCH' });

        fireEvent.change(input, { target: { value: 'Luke' } });
        expect(button).not.toBeDisabled();
    });

    it('calls search API and displays results', async () => {
        const mockResults = {
            results: [
                { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
            ],
        };
        (apiClient.search as any).mockResolvedValue(mockResults);

        render(<Home />, { wrapper });
        const input = screen.getByPlaceholderText(/e.g. Chewbacca/i);
        const button = screen.getByRole('button', { name: 'SEARCH' });

        fireEvent.change(input, { target: { value: 'Luke' } });
        fireEvent.click(button);

        expect(screen.getByText('Searching...')).toBeInTheDocument(); // Exact match to avoid button text

        await waitFor(() => {
            expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
        });
    });

    it('displays "No results found" when API returns empty list', async () => {
        (apiClient.search as any).mockResolvedValue({ results: [] });

        render(<Home />, { wrapper });
        const input = screen.getByPlaceholderText(/e.g. Chewbacca/i);
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: 'Unknown' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/No results found/i)).toBeInTheDocument();
        });
    });

    it('updates search type when radio button is clicked', () => {
        render(<Home />, { wrapper });

        const moviesRadio = screen.getByLabelText(/Movies/i);
        const peopleRadio = screen.getByLabelText(/People/i);

        expect(peopleRadio).toBeChecked();
        expect(moviesRadio).not.toBeChecked();

        fireEvent.click(moviesRadio);

        expect(moviesRadio).toBeChecked();
        expect(peopleRadio).not.toBeChecked();
        expect(moviesRadio).toBeChecked();
        expect(peopleRadio).not.toBeChecked();
    });

    it('triggers search on Enter key', () => {
        render(<Home />, { wrapper });
        const input = screen.getByPlaceholderText(/e.g. Chewbacca/i);

        fireEvent.change(input, { target: { value: 'Han' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        // Since looking for "Searching..." is racy/dependent on mock, 
        // we can check if the button became "SEARCHING..." or check API call count.
        expect(screen.getByText('Searching...')).toBeInTheDocument();
    });
});
