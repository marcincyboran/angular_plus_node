import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../post-interface';
import { mimeType } from './mime-type.validator';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    mode = 'create';
    postId: string;
    private post: Post;
    form: FormGroup;
    imagePreview: string;
    file;

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private router: Router) {}

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(3)
                ]
            }),
            content: new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(3)
                ]
            }),
            uploadedFile: new FormControl(null, {
                validators: [
                    Validators.required
                ],
                asyncValidators: [
                    mimeType
                ]
            })
        });
        this.route.paramMap.subscribe((params) => {
            if (params.has('postId')) {
                this.mode = 'edit';
                this.postId = params.get('postId');
                this.postService.getPostById(this.postId).subscribe((post) => {
                    this.post = {
                        id: post._id,
                        title: post.title,
                        content: post.content,
                        filePath: post.filePath
                    };
                    this.form.setValue({
                        title: this.post.title,
                        content: this.post.content,
                        uploadedFile: this.post.filePath
                    });
                    this.imagePreview = this.post.filePath;
                });
            } else {
                this.mode = 'create';
                this.post = null;
            }
        });
    }

    onFileChange(event: Event) {
        this.file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({ uploadedFile: this.file });
        this.form.get('uploadedFile').updateValueAndValidity();
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.imagePreview = (reader.result as string);
        });
        reader.readAsDataURL(this.file);
    }

    onSavePost() {
        if (this.form.invalid) { return; }
        if (this.mode === 'edit') {
            this.postService.updatePost(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.uploadedFile);
        } else {
            this.postService.addPost(
                this.form.value.title,
                this.form.value.content,
                this.form.value.uploadedFile);
            this.form.reset();
        }
        this.router.navigate(['/']);
    }

    getFileName() {
        return (this.file) ? this.file.name.split('.')[0] : this.post.title;
    }
}
