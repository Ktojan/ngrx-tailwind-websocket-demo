import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsPageComponent } from './products-page/products-page.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { StoreModule } from '@ngrx/store';
import { productsReducer } from './state/products.reducer';

@NgModule({
  declarations: [
    ProductsPageComponent,
    ProductsListComponent,
    ProductEditComponent,
    ProductPageComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    StoreModule.forFeature('products', productsReducer),
  ],
})
export class ProductsModule {}
