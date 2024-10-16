import ytdl from 'ytdl-core';
import { Router } from 'express';
import { Plugin, AudioInfo } from '../types/index'; // Assuming you have an AudioInfo type defined

const getAudioInfoAndLink = async (url: string): Promise<AudioInfo | { error: string }> => {
    try {
        // Validate the YouTube URL
        if (!ytdl.validateURL(url)) {
            return {
                error: "Couldn't process the request. Check the URL and try again.",
            };
        }

        // Get video info
        const info = await ytdl.getInfo(url);
        if (!info)
            return {
                error: "Couldn't process the request. Check the URL and try again.",
            };

        // Extract relevant audio information
        const audioInfo: AudioInfo = {
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
            downloadLink: '', // Placeholder for download link
        };

        // Get the highest quality audio format
        const highestAudioFormat = ytdl.chooseFormat(info.formats, {
            filter: 'audioonly',
            quality: 'highestaudio',
        });

        // Check if an audio format is available
        if (!highestAudioFormat) return { error: 'No available audio formats found' };

        audioInfo.downloadLink = highestAudioFormat.url; // Set the download link

        return audioInfo;
    } catch (err) {
        console.error(err); // Log the error for debugging
        return { error: 'Error fetching audio information' };
    }
};

export default (): Plugin => {
    return {
        name: 'YT MP3',
        description: 'API for getting audio information and links',
        parameter: 'link=(YT URL)',
        route: '/api/getAudioInfoAndLink?link=https://youtu.be/Q30hhC5bSKs?si=oI6m0B_a7OSmcNe5',
        run: (router: Router) => {
            router.get('/getAudioInfoAndLink', async (req, res) => {
                const link = req.query.link as string;
                if (!link)
                    return res.status(400).json({
                        error: 'No URL was provided in your request',
                    });

                const data = await getAudioInfoAndLink(link);
                if ('error' in data) return res.status(404).json(data);

                res.status(200).setHeader('Content-Type', 'application/json').json(data);
            });
        },
    };
};
