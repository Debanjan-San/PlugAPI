import ytdl from 'ytdl-core';
import { Router } from 'express';
import { Plugin, VideoInfo } from '../types/index';

const getVideoInfoAndLinks = async (url: string): Promise<VideoInfo | { error: string }> => {
    try {
        if (!ytdl.validateURL(url))
            return {
                error: "Couldn't process the request. Check the URL and try again.",
            };

        // Get video info
        const info = await ytdl.getInfo(url);
        if (!info)
            return {
                error: "Couldn't process the request. Check the URL and try again.",
            };

        // Extract relevant video information
        const videoInfo: VideoInfo = {
            title: info.videoDetails.title,
            author: {
                name: info.videoDetails.author.name,
                tag: info.videoDetails.author.user,
                channelId: info.videoDetails.author.id,
                channelUrl: info.videoDetails.author.channel_url,
            },
            description: info.videoDetails.description,
            views: info.videoDetails.viewCount,
            likes: info.videoDetails.likes,
            uploadAt: info.videoDetails.uploadDate,
            duration: info.videoDetails.lengthSeconds,
            downloadLinks: info.formats.map((format) => ({
                quality: format.qualityLabel,
                url: format.url,
            })),
        };

        return videoInfo;
    } catch (err) {
        console.error(err); // Log the error for debugging
        return { error: 'Error fetching video information' };
    }
};

export default (): Plugin => {
    return {
        name: 'YT MP4',
        description: 'API for getting video information and links',
        parameter: 'link=(YT URL)',
        route: '/api/getVideoInfoAndLinks?link=https://youtu.be/Q30hhC5bSKs?si=oI6m0B_a7OSmcNe5',
        run: (router: Router) => {
            router.get('/getVideoInfoAndLinks', async (req, res) => {
                const link = req.query.link as string;
                if (!link)
                    return res.status(400).json({
                        error: 'No URL was provided in your request',
                    });

                const data = await getVideoInfoAndLinks(link);
                if ('error' in data) return res.status(404).json(data);

                res.status(200).setHeader('Content-Type', 'application/json').json(data);
            });
        },
    };
};
