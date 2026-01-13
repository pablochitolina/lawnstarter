import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

    return (
        <span>
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline"
            >
                {name}
            </a>
            {!isLast && <span className="text-gray-800 mr-1">,</span>}
        </span>
    );
}
