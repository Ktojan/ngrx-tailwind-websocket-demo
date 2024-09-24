import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { WebsocketComponent } from './websocket/websocket.component';

const routes: Routes = [
  {
    path: 'websocket',
    component: WebsocketComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: '**',
    redirectTo: 'websocket',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
