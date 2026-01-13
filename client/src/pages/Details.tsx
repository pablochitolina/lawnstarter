import { useLocation, useNavigate } from 'react-router-dom';

export default function Details() {
    const location = useLocation();
    const navigate = useNavigate();
    const { item, type } = location.state || {}; // { item: SWAPI object, type: 'people' | 'movies' }

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center pt-20">
                <p className="mb-4">No item selected.</p>
                <button onClick={() => navigate('/')} className="text-green-sw font-bold">Back to Search</button>
            </div>
        );
    }

    const title = item.name || item.title;

    // Config based on type
    // People: Birth Year, Gender, Eye Color, Hair Color, Height, Mass
    // Movies: Opening Crawl? Or Director/Producer.
    // Mocks show "Person Details". Assuming Movie details similar.

    return (
        <div className="flex justify-center pt-10 px-4">
            <div className="bg-white p-8 rounded shadow-md w-full md:w-[720px] min-h-[450px] relative">
                <h2 className="text-xl font-bold mb-8">{title}</h2>

                <div className="flex flex-col md:flex-row gap-10">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-4 border-b border-gray-200 pb-2">Details</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            {type === 'people' && (
                                <>
                                    <li>Birth Year: {item.birth_year}</li>
                                    <li>Gender: {item.gender}</li>
                                    <li>Eye Color: {item.eye_color}</li>
                                    <li>Hair Color: {item.hair_color}</li>
                                    <li>Height: {item.height}</li>
                                    <li>Mass: {item.mass}</li>
                                </>
                            )}
                            {type === 'movies' && (
                                <>
                                    <li>Director: {item.director}</li>
                                    <li>Producer: {item.producer}</li>
                                    <li>Release Date: {item.release_date}</li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-4 border-b border-gray-200 pb-2">
                            {type === 'people' ? 'Movies' : 'Characters'}
                        </h3>
                        <div className="text-sm text-blue-500">
                            {(item.films || item.characters || []).map((url: string, i: number) => (
                                <div key={i} className="mb-1 truncate hover:underline cursor-pointer">
                                    <a href={url} target="_blank" rel="noreferrer">
                                        View Resource {i + 1}
                                    </a>
                                </div>
                            ))}
                            {(!item.films && !item.characters) && (
                                <span className="text-gray-400">None available</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-green-sw text-white font-bold py-2 px-6 rounded-full hover:bg-green-600 transition"
                    >
                        BACK TO SEARCH
                    </button>
                </div>
            </div>
        </div>
    );
}
