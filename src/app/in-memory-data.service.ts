import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Product } from './products/product.model';
import { Comment } from './chat/comment.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const products: Product[] = [
      { id: 1, price: 17, name: 'Mobile Phone Jail Cell' },
      { id: 2, price: 99, name: 'Ostrich Pillow' },
      { id: 3, price: 25, name: 'Charcoal Companion Meat Shredder Claws' },
      { id: 4, price: 37, name: 'Gilbins Taco Sleeping Bag' },
      { id: 57, price: 57500, name: 'Tesla Model X'},
    ];
    const comments: Comment[] = COMMENTS;
    return { products, comments };
  }
}
export const PREDEFINED_USERS = [
  {name: "Sir Green", colors: "bg-green-200 text-green-800"},
  {name: "Yellow-Stone", colors: "bg-yellow-200 text-yellow-800"},
  {name: "Indigo Baby", colors: "bg-indigo-200 text-indigo-800"},
  {name: "Mrs. Pink", colors: "bg-pink-200 text-pink-800"},
]

export const CODE_CHUNCKS = {
  chat: `
  getInitialComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsAPIUrl)
    .pipe(
      retry(1),
      catchError(this.handleError),
    )
  }
    .....

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
  `,

  products: `
  products$ = this.store.select(selectProducts);
  total$ = this.store.select(selectProductsTotal);

  getProducts() {
    this.store.dispatch(productsPageActions.loadProducts());
    this.productsService.getAll().subscribe({
      next: (products) => {
        this.store.dispatch(productsAPIActions.productsLoadedSuccess({ products}))
      },
      error: (error) => {
        (this.errorMessage = error);
        this.store.dispatch(productsAPIActions.productsLoadedFail({ message: error}))
      }
    });
  }
  ................
  <div *ngIf="(loading$ | async) === false; else loadingElement">
  <div class="container">
    <app-products-list
      [total]="total$ | async"
      [products]="products$ | async"
      [showProductCode]="showProductCode$ | async"
      (toggleProductCode)="toggleShowProductCode()"
    ></app-products-list>
  </div>
</div>

<ng-template #loadingElement>Loading...</ng-template>  
  `,
  "products/": `
  <form [formGroup]="productForm" (submit)="onSubmit()">
    <div class="form-field">
      <div>
        <label for="name">Name:</label>
        <input type="text" name="name" id="name" formControlName="name" />
      </div>
      <span class="invalid" *ngIf="
          productForm.get('name')?.touched &&
          productForm.get('name')?.hasError('required')
        ">Name is required.</span>
    </div>
    <div class="form-field">
      <div>
        <label for="price">Price:</label>
        <input min="0" type="number" name="price" id="price" formControlName="price" />
      </div>
      <span class="invalid" *ngIf="
          productForm.get('price')?.touched &&
          productForm.get('price')?.hasError('min')
        ">Price must be 0 or greater.</span>
    </div>
    ....
    onSubmit() {
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) return;

    const product = {
      id: this.oldProduct?.id ?? 0,
      name: this.productForm.value.name ?? '',
      price: this.productForm.value.price ?? 0,
    };

    this.oldProduct ? this.update.emit(product) : this.add.emit(product);
  }`,

  websocket: `
    streamer = new WebSocket('wss://ws-feed.exchange.coinbase.com');

    this.streamer.onmessage = (message) => {
      let data = JSON.parse(message.data);

      if (data['type'] === 'ticker') {
        let topBid = data['best_bid'];
        let topAsk = data['best_ask'];
        let timestamp = Date.parse(data['time']);

        if (timestamp % 2 !== 0) return; // filter only 1 of 2 updates to reduce intensivity

        console.log(data);

        if (topBid) {
          this.buf[this.exchange][0].push({
            x: timestamp,
            y: topBid
          });
        }
        if (topAsk) {
          this.buf[this.exchange][1].push({
            x: timestamp,
            y: topAsk
          });
        }
      }
    }
      .......
    let chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: [],
          label: 'Bid',
          borderColor: 'rgb(0, 255, 0)',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          fill: false,
        }, {
          data: [],
          label: 'Ask',
          borderColor: 'rgb(55, 48, 163)',
          backgroundColor: 'rgba(55, 48, 163, 0.5)',
          fill: false,
        }]
      },
      options: {
        scales: {
          x: {
            type: 'realtime',
            realtime: {
              delay: 2000,
              onRefresh: (chart) => {
                Array.prototype.push.apply(
                  chart.data.datasets[0].data, this.buf[this.exchange][0]
                );
                Array.prototype.push.apply(
                  chart.data.datasets[1].data, this.buf[this.exchange][1]
                );
                this.buf[this.exchange] = [[], []];
              }
            },
          },
        }
      }
    })

  `
}

export const KEY_FEATURES = {
  chat: `TailwindCSS, NGRX for login`,
  products: `NGRX for login, products list`,
  "products/": ``,
  websocket: `Websocket, Chart.js`
}


const COMMENTS: Comment[] = [
  {
    author: 'Joseph Campbell',
  date: 'Feb. 8, 2024',
  message: `You must have a room, or a certain hour or so a day, where you don't know what was in the newspapers that morning... a place where you can simply experience and bring forth what you are and what you might be.`,
  rating: 3,
  replies: [
    {
      author: 'Chilo',
    date: 'Feb. 12, 2024',
    message: `Be more prompt to go to a friend in adversity than in prosperity. ☺️`,
    rating: 3,
    replies: []
    },
    {
    author: PREDEFINED_USERS[0].name,
    date:"Mon, 12 Aug 2024",
    message:"No man is an island...",
    rating: 7,
    replies:  []
    },
    {
      author: 'Andre Gide',
    date: 'Aug 13, 2024',
    message: `Work and struggle and never accept an evil that you can change`,
    rating: 3,
    replies: []
    },
  ]
  },
  {
    author: PREDEFINED_USERS[2].name,
  date: 'Mar. 12, 2024',
  message: `People demand freedom of speech as a compensation for the freedom of thought which they seldom use.`,
  rating: 1,
  replies: []
  },
  {
    author: 'Thomas J. Watson',
  date: 'Jun. 23, 2024',
  message: `Follow the path of the unsafe, independent thinker. Expose your ideas to the dangers of controversy. Speak your mind and fear less the label of 'crackpot' than the stigma of conformity. And on issues that seem important to you, stand up and be counted at any cost.`,
  rating: 3,
  replies: [],
  },
  {
    author: PREDEFINED_USERS[3].name,
    date: "Mar. 12, 2024",
    message: "Silence is gold",
    rating:     5,
    replies: [],
  },
  {
    author: PREDEFINED_USERS[1].name,
  date: 'June. 2, 2024',
  message: `What I learned from Weight Watchers is that food was meant to be used as fuel for our bodies. If we are using it for any other reasons, it is time to take a step back and ask ourselves what’s up. `,
  rating: 0,
  replies: []
  },
  {
    author: 'Dale Carnegie',
  date: 'Jun. 3, 2024',
  message: `Any fool can criticize, condemn, and complain - and most fools do`,
  rating: 13,
  replies: [],
  },
]
