import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { search } from '../api/client';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [type, setType] = useState<'people' | 'movies'>((searchParams.get('type') as 'people' | 'movies') || 'people');
    const [searchTrigger, setSearchTrigger] = useState(searchParams.get('q') || '');

    useEffect(() => {
        if (searchTrigger) {
            setSearchParams({ q: searchTrigger, type });
        }
    }, [searchTrigger, type, setSearchParams]);

    const { data: results, isLoading, isFetched } = useQuery({
        queryKey: ['search', searchTrigger, type],
        queryFn: () => search(searchTrigger, type),
        enabled: !!searchTrigger,
    });

    const handleSearch = () => {
        if (query.trim().length >= 2) {
            setSearchTrigger(query);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const isSearching = isLoading && !!searchTrigger;
    const isSearchDisabled = query.trim().length < 2;

    const handleTypeChange = (newType: 'people' | 'movies') => {
        setType(newType);
        setSearchTrigger('');
        setQuery('');
        setSearchParams({ type: newType });
    };

    return (
        <div className="flex flex-col lg:flex-row justify-center items-start pt-12 px-4 gap-8">
            <div className="bg-white p-6 rounded shadow-card border border-light-gray w-full lg:w-[410px]">
                <h2 className="text-gray-700 font-semibold mb-5 text-sm">
                    {t('home.search_title')}
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
                            onChange={() => handleTypeChange('people')}
                            className="hidden"
                        />
                        <span className="font-bold text-sm text-gray-800">{t('home.people')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${type === 'movies' ? 'border-green-sw' : 'border-gray-300'}`}>
                            {type === 'movies' && <div className="w-2 h-2 rounded-full bg-green-sw" />}
                        </div>
                        <input
                            type="radio"
                            name="type"
                            checked={type === 'movies'}
                            onChange={() => handleTypeChange('movies')}
                            className="hidden"
                        />
                        <span className="font-bold text-sm text-gray-800">{t('home.movies')}</span>
                    </label>
                </div>

                <input
                    type="text"
                    placeholder={t('home.placeholder')}
                    className="w-full border border-gray-300 rounded p-3 mb-6 focus:outline-none focus:border-green-sw font-bold text-gray-800 shadow-inner placeholder-gray-300"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    onClick={handleSearch}
                    disabled={isSearchDisabled}
                    className={`w-full py-2.5 rounded-full font-bold text-white text-sm tracking-wide transition-all duration-200 shadow-md uppercase ${isSearchDisabled
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-green-sw hover:bg-green-600'
                        }`}
                >
                    {isSearching ? t('home.searching') : t('home.search_button')}
                </button>
            </div>

            <div className="bg-white px-8 py-8 rounded shadow-card border border-light-gray w-full lg:w-[720px] min-h-[550px]">
                <h2 className="text-xl font-bold mb-4 text-gray-900">{t('home.results_title')}</h2>
                <hr className="border-light-gray mb-6" />

                {!isFetched && !isSearching && (
                    <div className="text-center text-gray-300 mt-32">
                        <p className="font-bold text-sm text-gray-400">{t('home.no_results_title')}</p>
                        <p className="text-sm text-gray-400">{t('home.no_results_desc')}</p>
                    </div>
                )}

                {isSearching && (
                    <div className="text-center text-gray-400 mt-32">
                        <p className="font-bold animate-pulse">{t('home.searching')}</p>
                    </div>
                )}

                {isFetched && results && results.results && results.results.length === 0 && (
                    <div className="text-center text-gray-300 mt-32">
                        <p className="font-bold text-sm text-gray-400">{t('home.no_results_title')}</p>
                        <p className="text-sm text-gray-400">{t('home.no_results_desc')}</p>
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
                                    {t('home.see_details')}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
