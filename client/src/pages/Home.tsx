import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchSwapi } from '../api/client';
import { Link } from 'react-router-dom';

export default function Home() {
    const [query, setQuery] = useState('');
    const [type, setType] = useState<'people' | 'movies'>('people');
    const [searchTrigger, setSearchTrigger] = useState(''); // To trigger search on click

    const { data: results, isLoading, isError, isFetched } = useQuery({
        queryKey: ['search', searchTrigger, type],
        queryFn: () => searchSwapi(searchTrigger, type),
        enabled: !!searchTrigger,
    });

    const handleSearch = () => {
        if (query.trim()) {
            setSearchTrigger(query);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const isSearching = isLoading && !!searchTrigger;

    return (
        <div className="flex flex-col md:flex-row gap-6 justify-center items-start pt-10 px-4">
            {/* Search Card */}
            <div className="bg-white p-8 rounded shadow-md w-full md:w-[400px]">
                <h2 className="text-gray-700 font-medium mb-4">What are you searching for?</h2>

                <div className="flex gap-6 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            checked={type === 'people'}
                            onChange={() => setType('people')}
                            className="text-green-sw focus:ring-green-sw"
                        />
                        <span className="font-bold text-sm">People</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            checked={type === 'movies'}
                            onChange={() => setType('movies')}
                            className="text-green-sw focus:ring-green-sw"
                        />
                        <span className="font-bold text-sm">Movies</span>
                    </label>
                </div>

                <input
                    type="text"
                    placeholder="e.g. Chewbacca, Yoda, Boba Fett"
                    className="w-full border border-gray-300 rounded p-3 mb-6 focus:outline-none focus:border-green-sw font-bold"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    onClick={handleSearch}
                    disabled={!query}
                    className={`w-full py-3 rounded-full font-bold text-white transition-colors duration-200 ${!query
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-sw hover:bg-green-600 shadow-md'
                        }`}
                >
                    {isSearching ? 'SEARCHING...' : 'SEARCH'}
                </button>
            </div>

            {/* Results Card */}
            <div className="bg-white p-8 rounded shadow-md w-full md:w-[500px] min-h-[400px]">
                <h2 className="text-xl font-bold mb-4">Results</h2>
                <hr className="border-gray-200 mb-6" />

                {!isFetched && !isSearching && (
                    <div className="text-center text-gray-400 mt-20">
                        <p className="font-bold">There are zero matches.</p>
                        <p>Use the form to search for People or Movies.</p>
                    </div>
                )}

                {isSearching && (
                    <div className="text-center text-gray-400 mt-20">
                        <p className="font-bold animate-pulse">Searching...</p>
                    </div>
                )}

                {isFetched && results && results.results && results.results.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        <p className="font-bold">No results found.</p>
                    </div>
                )}

                {isFetched && results && results.results && results.results.length > 0 && (
                    <ul className="space-y-4">
                        {results.results.map((item: any, index: number) => (
                            <li key={index} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                                <span className="font-bold text-gray-800">
                                    {item.name || item.title}
                                </span>
                                <Link
                                    to="/details"
                                    state={{ item, type }}
                                    className="bg-green-sw text-white text-xs font-bold py-2 px-4 rounded-full hover:bg-green-600"
                                >
                                    SEE DETAILS
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
