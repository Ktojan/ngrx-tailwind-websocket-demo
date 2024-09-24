import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InMemoryDataService } from './in-memory-data.service';
import { ChatComponent } from './chat/chat.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment.development';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authReducer } from './products/state/auth.reducer';
import { WebsocketComponent } from './websocket/websocket.component';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, ChatComponent, WebsocketComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService),
    StoreModule.forRoot({}),
    StoreModule.forFeature('auth', authReducer),
    StoreDevtoolsModule.instrument({
      name: 'Ngrx Websocket Tailwind Demo',
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
