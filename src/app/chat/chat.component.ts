import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loggedUserName } from '../products/state/products.selectors';
import { Comment } from './comment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { PREDEFINED_USERS } from '../in-memory-data.service';

const dummyComment = {
  author: 'Mister Gold',
date: 'Mar. 12, 2024',
message: `Look around you`,
rating: 5,
replies: [],
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [`
    .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 4rem;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  button span {
    line-height: 1.5rem;
  }`],
})
export class ChatComponent {
  constructor(private store: Store, private http: HttpClient) {}

  comments: Comment[] = [];
  newComment: string = '';
  newReply: string = '';
  showReply = false;
  isEditingComment = false;
  users = PREDEFINED_USERS;
  currentUser = {name: ''};
  private commentsAPIUrl = 'api/comments';

  ngOnInit() {
    this.store.select(loggedUserName).subscribe(user => this.currentUser = {name: user});
    this.getInitialComments().subscribe(comms => this.comments = comms);
  }

  getInitialComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsAPIUrl)
    .pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  addComment() {
    if (this.newComment.length<3) return;
    let commentToAdd = {...dummyComment};
    commentToAdd = {...commentToAdd,
      message: this.newComment,
      author: this.currentUser.name,
      date: new Date().toUTCString()
    };
    this.comments.push(commentToAdd);
    this.newComment = '';
  }

  deleteComment(comment: Comment | null, index: number) {
    if (comment) comment.replies?.splice(index, 1) || [];
    else this.comments.splice(index, 1);
  }

  replyComment(comment: Comment) {
    delete comment.showReply;
    if (this.isEditingComment) {
      comment.message = this.newReply;
      comment.date = new Date().toUTCString();
      this.isEditingComment = false;
    } else {
      comment.replies!.push({...dummyComment, date: new Date().toUTCString(),
        message: this.newReply, author: this.currentUser.name});
    }
    this.newReply = '';
  }

  replyDiscussion(index: number, replies?: any, reply?: Comment) {
    if (this.isEditingComment && reply) {
      reply.message = this.newReply;
      reply.date = new Date().toUTCString();
      this.isEditingComment = false;
      reply.showReply = false;
    } else {
    replies.splice(index+1, 0,{...dummyComment, date: new Date().toUTCString(),
       message: this.newReply, author: this.currentUser.name});
    }
    this.newReply = '';
  }

  updateRating(comment: Comment, delta: number) { comment.rating += delta;  }

  setBadgeColors(author: string) {
    return this.users.find(u => u.name === author)?.colors ?? ' bg-gray-200 text-gray-800 ';
  }

  scroll(dir: 'down' | 'up') {
    const level = dir === 'down'? document.body.scrollHeight : 0;
    window.scrollTo({ left: 0, top: level, behavior: 'smooth'});
  }

  private handleError({ status }: HttpErrorResponse) {
    return throwError(
      () => `${status}: Something bad happened.`
    );
  }
}
