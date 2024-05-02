export interface Photo {
    id: string;
    url: string;
    urlDownload: string;
    altDescription: string;
    author: {
        name: string;
        profileImage: string;
    };
    datePublished: string;
}