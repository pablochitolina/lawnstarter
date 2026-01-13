import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchSwapi } from '../api/client';
import { Link } from 'react-router-dom';

export default function Home() {
    const [query, setQuery] = useState('');
    const [type, setType] = useState<'people' | 'movies'>('people');
    const [searchTrigger, setSearchTrigger] = useState('');

    const { data: results, isLoading, isFetched } = useQuery({
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
        <div className="flex flex-col lg:flex-row justify-center items-start pt-12 px-4 gap-8">
            <div className="bg-white p-6 rounded shadow-card border border-light-gray w-full lg:w-[410px]">
                <h2 className="text-gray-700 font-semibold mb-5 text-sm">
                    What are you searching for?
                </h2>

                <div className="flex gap-8 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${type === 'people' ? 'border-green-sw' : 'border-gray-300'}`}>
                            {type === 'people' && <div className="w-2 h-2 rounded-full bg-green-sw" />}
                        </div>
                        <input
                            type="radio"
                            name="type"
                            checked={type === 'people'}
                            onChange={() => setType('people')}
                            className="hidden"
                        />
                        <span className="font-bold text-sm text-gray-800">People</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${type === 'movies' ? 'border-green-sw' : 'border-gray-300'}`}>
                            {type === 'movies' && <div className="w-2 h-2 rounded-full bg-green-sw" />}
                        </div>
                        <input
                            type="radio"
                            name="type"
                            checked={type === 'movies'}
                            onChange={() => setType('movies')}
                            className="hidden"
                        />
                        <span className="font-bold text-sm text-gray-800">Movies</span>
                    </label>
                </div>

                <input
                    type="text"
                    placeholder="e.g. Chewbacca, Yoda, Boba Fett"
                    className="w-full border border-gray-300 rounded p-3 mb-6 focus:outline-none focus:border-green-sw font-bold text-gray-800 shadow-inner placeholder-gray-300"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    onClick={handleSearch}
                    disabled={!query}
                    className={`w-full py-2.5 rounded-full font-bold text-white text-sm tracking-wide transition-all duration-200 shadow-md ${!query
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-green-sw hover:bg-green-600'
                        }`}
                >
                    {isSearching ? 'SEARCHING...' : 'SEARCH'}
                </button>
            </div>

            <div className="bg-white px-8 py-8 rounded shadow-card border border-light-gray w-full lg:w-[720px] min-h-[550px]">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Results</h2>
                <hr className="border-light-gray mb-6" />

                {!isFetched && !isSearching && (
                    <div className="text-center text-gray-300 mt-32">
                        <p className="font-bold text-sm text-gray-400">There are zero matches.</p>
                        <p className="text-sm text-gray-400">Use the form to search for People or Movies.</p>
                    </div>
                )}

                {isSearching && (
                    <div className="text-center text-gray-400 mt-32">
                        <p className="font-bold animate-pulse">Searching...</p>
                    </div>
                )}

                {isFetched && results && results.results && results.results.length === 0 && (
                    <div className="text-center text-gray-400 mt-32">
                        <p className="font-bold">No results found.</p>
                    </div>
                )}

                {isFetched && results && results.results && results.results.length > 0 && (
                    <ul className="space-y-0">
                        {results.results.map((item: any, index: number) => (
                            <li key={index} className="flex justify-between items-center border-b border-gray-100 py-3 last:border-0 hover:bg-gray-50 transition px-2 -mx-2 rounded">
                                <span className="font-bold text-gray-800">
                                    {item.name || item.title}
                                </span>
                                <Link
                                    to="/details"
                                    state={{ item, type }}
                                    className="bg-green-sw text-white text-[10px] font-bold py-2 px-5 rounded-full hover:bg-green-600 shadow uppercase tracking-wide"
                                >
                                    See Details
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
