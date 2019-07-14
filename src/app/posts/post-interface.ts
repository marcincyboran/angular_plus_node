export interface Post {
    id: string;
    title: string;
    content: string;
    filePath: string;
    creator: string;
}

export interface PostFromServer {
    _id: string;
    title: string;
    content: string;
    filePath: string;
    creator: string;
}
