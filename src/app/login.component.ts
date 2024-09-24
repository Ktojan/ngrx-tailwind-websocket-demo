import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loggedUserName} from './products/state/products.selectors';
import { currentUserUpdate } from './products/state/products.actions';
import { PREDEFINED_USERS } from './in-memory-data.service';

@Component({
  selector: 'app-login',
  template: `
  <div class="container bg-gray-200 mx-auto mt-2 flex flex-wrap px-4 py-2 rounded-lg">
    <div class="min-w-0 flex-1">
      <p class="inline-flex items-center mr-6 text-sm text-gray-900 font-semibold">
        <span class="text-lg px-3 py-2 rounded-full bg-gray-200 text-gray-800">
          {{userName$ | async }}
        </span>
      </p>
    </div>
    <div class="flex items-center">
      <input type="text" name="user" #userinput (keyup.enter)="setCurrentUser(userinput.value); userinput.value = ''" />
      <button (click)="setCurrentUser(userinput.value); userinput.value = ''" type="button"
        class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        Login
      </button>
      <label class="ml-8 hidden lg:flex">Predefined users:</label>
      <span *ngFor="let user of users" class="ml-3 hidden sm:block">
        <button type="button" (click)="setCurrentUser(user.name)" [class]="user.colors"
          class="inline-flex items-center rounded-md  px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset">
          {{user.name}}
        </button>
      </span>
    </div>
  </div>`,
  styleUrls: ['./app.component.css']
})
export class LoginComponent {
  constructor(private store: Store) { }

  userName$ = this.store.select(loggedUserName);
  users = PREDEFINED_USERS;

  setCurrentUser(input: string) {
    this.store.dispatch(currentUserUpdate({ currentUser: input }));
  }
}
