import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post, PostFromServer } from './post-interface';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private posts: Post[] = [];
    private postSubject = new Subject<Post[]>();

    constructor(private httpClient: HttpClient) {}

    getPostById(id: string) {
        return this.httpClient
                   .get<PostFromServer>(`http://localhost:3000/api/posts/${id}`);
    }

    getPosts(page: number, pageSize: number): void {
        const query = `?ps=${pageSize}&p=${page}`;
        this.httpClient
            .get<{message: string, data: any[]}>(`http://localhost:3000/api/posts${query}`)
            .pipe(map((response) => {
                return response.data.map(post => {
                    return {
                        id: post._id,
                        title: post.title,
                        content: post.content,
                        filePath: post.filePath
                    };
                });
            }))
            .subscribe(recivedPosts => {
                this.posts = recivedPosts;
                this.postSubject.next(this.posts);
            });
    }

    addPost(title: string, content: string, file: File): void {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('uploadedFile', file, title);

        this.httpClient
            .post('http://localhost:3000/api/posts', formData)
            .subscribe((response: PostFromServer) => {
                // triggered only when succes
                const newPost: Post = { title, content, id: response._id, filePath: response.filePath };
                this.posts.push(newPost);
                this.postSubject.next(this.posts);
            });
    }

    updatePost(id: string, title: string, content: string, fileOrPath: File | string) {
        let updatedPost: FormData | Post ;
        if (typeof(fileOrPath === 'object')) {
            updatedPost = new FormData();
            updatedPost.append('id', id);
            updatedPost.append('title', title);
            updatedPost.append('content', content);
            updatedPost.append('uploadedFile', fileOrPath);
        } else {
            updatedPost = { id, title, content, filePath: fileOrPath as string};
        }
        this.httpClient
            .put(`http://localhost:3000/api/posts/${id}`, updatedPost)
            .subscribe((response: PostFromServer) => {
                console.log(response);
                const index = this.posts.findIndex((p) => p.id === id);
                this.posts[index].title = title;
                this.posts[index].content = content;
                this.posts[index].filePath = response.filePath;
                this.postSubject.next(this.posts);
            });
    }

    deletePost(postId: string): void {
        this.httpClient
            .delete(`http://localhost:3000/api/posts/${postId}`)
            .subscribe((deletedPost) => {
                console.log(deletedPost);
                this.posts = this.posts.filter((post) => post.id !== postId);
                this.postSubject.next(this.posts);
            });
    }

    getPostUpdateListener() {
        return this.postSubject.asObservable();
    }
}
