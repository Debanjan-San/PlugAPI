import axios from 'axios';
import { Router } from 'express';
import { ImageResult, OpenverseImage, Plugin } from '../types/index';

const imageSearch = async (term: string): Promise<ImageResult[] | { error: string }> => {
    try {
        const { data } = await axios.get<{ results: OpenverseImage[] }>(
            `https://api.openverse.engineering/v1/images/?q=${term}`
        );
        if (!data.results) return { error: 'Not found ;-;' };

        const filtered: ImageResult[] = data.results.map(({ title, mature, indexed_on, height, width, url }) => ({
            title,
            mature,
            indexed_on,
            height,
            width,
            imageURL: url,
        }));

        return filtered;
    } catch (err) {
        console.error(err);
        return { error: 'Something went wrong!!' };
    }
};

export default (): Plugin => {
    return {
        name: 'IMAGE SEARCH',
        description: 'API for searching images',
        parameter: 'query=(Search term)',
        route: '/api/imageSearch?query=cat',
        run: (router: Router) => {
            router.get('/imageSearch', async (req, res) => {
                const query = req.query.query as string;
                if (!query)
                    return res.status(400).json({
                        error: 'No query was provided in your request',
                    });

                const data = await imageSearch(query);
                res.status(200).setHeader('Content-Type', 'application/json').json(data);
                if ('error' in data) return res.status(404).json(data);
            });
        },
    };
};
