import { useTranslation } from 'react-i18next';
import { US, BR, ES } from 'country-flag-icons/react/3x2';

export default function Header() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="w-full bg-white shadow-sm py-5 mb-12 relative flex items-center justify-center">
            <h1 className="text-center text-green-sw font-bold text-lg tracking-wide uppercase">
                {t('header.title')}
            </h1>

            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-4">
                <button
                    onClick={() => changeLanguage('en')}
                    className={`w-6 transition-opacity hover:opacity-80 ${i18n.language === 'en' || i18n.language.startsWith('en') ? 'opacity-100' : 'opacity-40 grayscale'}`}
                    title="English"
                >
                    <US />
                </button>
                <button
                    onClick={() => changeLanguage('pt')}
                    className={`w-6 transition-opacity hover:opacity-80 ${i18n.language === 'pt' || i18n.language.startsWith('pt') ? 'opacity-100' : 'opacity-40 grayscale'}`}
                    title="Português"
                >
                    <BR />
                </button>
                <button
                    onClick={() => changeLanguage('es')}
                    className={`w-6 transition-opacity hover:opacity-80 ${i18n.language === 'es' || i18n.language.startsWith('es') ? 'opacity-100' : 'opacity-40 grayscale'}`}
                    title="Español"
                >
                    <ES />
                </button>
            </div>
        </header>
    );
}
