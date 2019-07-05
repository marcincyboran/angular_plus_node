export interface Post {
    id: string;
    title: string;
    content: string;
    filePath: string;
}

export interface PostFromServer {
    _id: string;
    title: string;
    content: string;
    filePath: string;
}
