import { Router } from 'express';

export interface Plugin {
    name: string;
    description: string;
    parameter: string;
    route: string;
    run: (router: Router) => void;
}

export interface InstaDownloadItem {
    thumbnail_link: string | undefined;
    download_link: string | undefined;
}

export interface TranslateResult {
    langTo?: string;
    translatedText?: string;
    error?: string;
    supportedLanguages?: string[];
}

export interface ImageResult {
    title: string;
    mature: boolean;
    indexed_on: string;
    height: number;
    width: number;
    imageURL: string;
}

export interface Author {
    name: string;
    tag: string | undefined;
    channelId: string;
    channelUrl: string;
}

export interface DownloadLink {
    quality: string;
    url: string;
}

export interface VideoInfo {
    title: string;
    author: Author;
    description: string | null;
    views: string;
    likes: number | null;
    uploadAt: string;
    duration: string;
    downloadLinks: DownloadLink[];
}

export interface OpenverseImage {
    title: string;
    mature: boolean;
    indexed_on: string;
    height: number;
    width: number;
    url: string;
}

export interface ImageResult {
    title: string;
    mature: boolean;
    indexed_on: string;
    height: number;
    width: number;
    imageURL: string;
}

export interface AudioInfo {
    title: string;
    author: Author;
    description: string | null;
    views: string;
    likes: number | null;
    uploadAt: string;
    duration: string;
    downloadLink: string;
}
