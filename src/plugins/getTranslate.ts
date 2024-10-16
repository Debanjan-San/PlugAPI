import axios from 'axios';
import { Router } from 'express';
import { Plugin, TranslateResult } from '../types/index';

// Define supported languages interface
const supportedLanguages: string[] = [
    'ar',
    'ur',
    'en',
    'fr',
    'de',
    'id',
    'gu',
    'hi',
    'it',
    'ja',
    'kn',
    'ta',
    'te',
    'bn',
    'ml',
    'mr',
    'ne',
    'pa',
    'es',
    'ru',
    'pt',
    'tr',
    'vi',
];

// Function to generate a random User-Agent string
const generateRandomUserAgent = (): string => {
    const versions = [
        '4.0.3',
        '4.1.1',
        '4.2.2',
        '4.3',
        '4.4',
        '5.0.2',
        '5.1',
        '6.0',
        '7.0',
        '8.0',
        '9.0',
        '10.0',
        '11.0',
    ];
    const deviceModels = ['M2004J19C', 'S2020X3', 'Xiaomi4S', 'RedmiNote9', 'SamsungS21', 'GooglePixel5'];
    const buildVersions = [
        'RP1A.200720.011',
        'RP1A.210505.003',
        'RP1A.210812.016',
        'QKQ1.200114.002',
        'RQ2A.210505.003',
    ];

    const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    const randomChromeVersion = (): string => {
        const majorVersion = Math.floor(Math.random() * 80) + 1;
        const minorVersion = Math.floor(Math.random() * 999) + 1;
        const buildVersion = Math.floor(Math.random() * 9999) + 1;
        return `Chrome/${majorVersion}.${minorVersion}.${buildVersion}`;
    };

    const randomWhatsAppVersion = (): string => {
        const major = Math.floor(Math.random() * 9) + 1;
        const minor = Math.floor(Math.random() * 9) + 1;
        return `WhatsApp/1.${major}.${minor}`;
    };

    return `Mozilla/5.0 (Linux; Android ${randomElement(versions)}; ${randomElement(deviceModels)} Build/${randomElement(buildVersions)}) AppleWebKit/537.36 (KHTML, like Gecko) ${randomChromeVersion()} Mobile Safari/537.36 ${randomWhatsAppVersion()}`;
};

// Function to generate a random IP address
const generateRandomIP = (): string => {
    const randomByte = (): number => Math.floor(Math.random() * 256);
    return `${randomByte()}.${randomByte()}.${randomByte()}.${randomByte()}`;
};

// Function to set headers for the request
const headers = () => ({
    'User-Agent': generateRandomUserAgent(),
    'X-Forwarded-For': generateRandomIP(),
});

// Function to perform translation
const getTranslate = async (langTo: string, text: string): Promise<TranslateResult> => {
    if (!supportedLanguages.includes(langTo)) {
        return { supportedLanguages }; // Return with supportedLanguages if the langTo is not valid
    }

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langTo}&ie=UTF-8&dt=t&q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(url, {
            headers: {
                Host: 'translate.google.com',
                ...headers(),
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
        });

        const translatedText = data[0].map((item: any) => item[0]).join('');
        return translatedText.trim().length > 1 ? { langTo, translatedText } : { error: 'Invalid Input!!' };
    } catch (error) {
        console.error(error); // Log error for debugging
        return { error: 'Failed to translate!!' };
    }
};

// Export the translation plugin
export default (): Plugin => {
    return {
        name: 'TRANSLATE',
        description: 'API for text translation',
        parameter: 'langTo=(language code)&text=(text to translate)',
        route: '/api/getTranslate?langTo=en&text=こんにちは！今日はどんなことをお話ししたいですか？',
        run: (router: Router) => {
            router.get('/getTranslate', async (req, res) => {
                const { langTo, text } = req.query;

                if (!langTo || typeof langTo !== 'string')
                    return res.status(400).json({
                        error: 'Missing langTo parameter in your request',
                    });

                if (!text || typeof text !== 'string')
                    return res.status(400).json({
                        error: 'Missing text parameter in your request',
                    });

                const data = await getTranslate(langTo, text);
                if (data.error) return res.status(404).json(data);

                res.status(200).setHeader('Content-Type', 'application/json').json(data);
            });
        },
    };
};
