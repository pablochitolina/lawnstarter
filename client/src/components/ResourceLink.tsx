import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ResourceLinkProps {
    url: string;
    isLast: boolean;
}

export default function ResourceLink({ url, isLast }: ResourceLinkProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['resource', url],
        queryFn: async () => {
            const res = await axios.get(url);
            return res.data;
        },
        staleTime: 1000 * 60 * 60,
    });

    if (isLoading) return <span className="text-gray-300">Loading...{isLast ? '' : ', '}</span>;
    if (!data) return null;

    const name = data.name || data.title;

    const type = url.includes('/films/') ? 'movies' : 'people';

    return (
        <span>
            <Link
                to="/details"
                state={{ item: data, type }}
                className="text-blue-500 hover:underline"
            >
                {name}
            </Link>
            {!isLast && <span className="text-gray-800 mr-1">,</span>}
        </span>
    );
}
