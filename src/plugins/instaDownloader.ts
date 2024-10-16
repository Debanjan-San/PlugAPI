import axios from 'axios';
import { load } from 'cheerio';
import { Router } from 'express';
import { InstaDownloadItem, Plugin } from '../types/index';
import qs from 'qs';

const instaDownloader = async (url: string): Promise<InstaDownloadItem[] | { error: string }> => {
    try {
        const isValidUrl = (str: string): boolean => /^https?:\/\//.test(str);
        if (!isValidUrl(url) || !/instagram\.com/i.test(url)) {
            return { error: 'Invalid URL: ' + url };
        }

        const apiUrl = 'https://saveig.app/api/ajaxSearch';
        const params = {
            q: url,
            t: 'media',
            lang: 'en',
        };

        const headers = {
            Accept: '*/*',
            Origin: 'https://saveig.app',
            Referer: 'https://saveig.app/en',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Sec-Ch-Ua': '"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183',
            'X-Requested-With': 'XMLHttpRequest',
        };

        const { data } = await axios.post(apiUrl, qs.stringify(params), { headers });
        const responseData = data.data;
        const $ = load(responseData);

        const downloadItems = $('.download-items');
        const result: InstaDownloadItem[] = [];

        downloadItems.each((_, element) => {
            const thumbnailLink = $(element).find('.download-items__thumb > img').attr('src');
            const downloadLink = $(element).find('.download-items__btn > a').attr('href');

            result.push({
                thumbnail_link: thumbnailLink,
                download_link: downloadLink,
            });
        });

        return result;
    } catch (err) {
        console.error(err);
        return { error: 'Something went wrong!' };
    }
};

export default (): Plugin => {
    return {
        name: 'INSTA DOWNLOAD',
        description: 'API for getting video information and links',
        parameter: 'link=(IG link)',
        route: '/api/instaDownloader?link=https://www.instagram.com/reel/C4akXazJ60W/?utm_source=ig_web_copy_link',
        run: (router: Router) => {
            router.get('/instaDownloader', async (req, res) => {
                const link = req.query.link as string;
                if (!link)
                    return res.status(400).json({
                        error: 'No URL was provided in your request',
                    });

                const data = await instaDownloader(link);
                res.status(200).setHeader('Content-Type', 'application/json').json(data);
                if ('error' in data) return res.status(404).json(data);
            });
        },
    };
};
