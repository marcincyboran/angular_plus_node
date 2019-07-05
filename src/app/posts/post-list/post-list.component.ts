import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post-interface';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    listOfPosts: Post[] = [];
    postsSubscription: Subscription;

    allItems = 10;
    currentPage = 1;
    pageSize = 2;
    pageSizeOptions = [2, 5, 10, 20];

    constructor(public postService: PostService) {}

    ngOnInit() {
        this.postService.getPosts(this.currentPage, this.pageSize);
        this.postsSubscription = this.postService.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                this.listOfPosts = posts;
            });
    }

    onPageChanged(pageEvent: PageEvent) {
        this.currentPage = pageEvent.pageIndex + 1;
        this.pageSize = pageEvent.pageSize;
        this.postService.getPosts(this.currentPage, this.pageSize);
    }

    onDelete(id: string) {
        this.postService.deletePost(id);
    }

    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
    }
}
