import { useLocation, useNavigate } from 'react-router-dom';
import ResourceLink from '../components/ResourceLink';
import { useTranslation } from 'react-i18next';

export default function Details() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { item, type } = location.state || {};

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center pt-20">
                <p className="mb-4 text-gray-500">No item selected.</p>
                <button onClick={() => navigate('/')} className="text-green-sw font-bold hover:underline uppercase">{t('details.back_to_search')}</button>
            </div>
        );
    }

    const title = item.name || item.title;

    return (
        <div className="flex justify-center pt-12 px-4">
            <div className="bg-white px-8 py-8 rounded shadow-card border border-light-gray w-full md:w-[720px] min-h-[550px] relative">
                <h2 className="text-xl font-bold mb-8 text-gray-900">{title}</h2>

                <div className="flex flex-col md:flex-row gap-12">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-4 border-b border-light-gray pb-2 text-gray-900">
                            {type === 'people' ? 'Details' : t('details.opening_crawl')}
                        </h3>

                        {type === 'people' && (
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>{t('details.birth_year')}: {item.birth_year}</li>
                                <li>{t('details.gender')}: {item.gender === 'unknown' ? t('details.unknown_gender') : item.gender}</li>
                                <li>Eye Color: {item.eye_color}</li>
                                <li>Hair Color: {item.hair_color}</li>
                                <li>Height: {item.height}</li>
                                <li>Mass: {item.mass}</li>
                            </ul>
                        )}

                        {type === 'movies' && (
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {item.opening_crawl}
                            </p>
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-4 border-b border-light-gray pb-2 text-gray-900">
                            {type === 'people' ? t('details.related_movies') : t('details.related_characters')}
                        </h3>

                        <div className="text-sm text-blue-500 leading-relaxed">
                            {(item.films || item.characters || []).map((url: string, i: number, arr: string[]) => (
                                <ResourceLink
                                    key={url}
                                    url={url}
                                    isLast={i === arr.length - 1}
                                />
                            ))}
                            {((!item.films || item.films.length === 0) && (!item.characters || item.characters.length === 0)) && (
                                <span className="text-gray-400 italic">{t('details.none_available')}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-green-sw text-white text-sm font-bold py-2 px-6 rounded-full hover:bg-green-600 shadow-md uppercase tracking-wide transition-all"
                    >
                        {t('details.back_to_search')}
                    </button>
                </div>
            </div>
        </div>
    );
}
