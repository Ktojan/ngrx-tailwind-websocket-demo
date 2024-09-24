import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductsService } from '../products.service';
import { productsAPIActions, productsPageActions } from '../state/products.actions';
import { selectProducts, selectProductsLoading, selectProductsShowCode, selectProductsTotal } from '../state/products.selectors';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styles: [`
    .error-card {
    background-color: indianred;
    color: white;
    padding: 1rem;
    margin-bottom: 1rem;
}`],
})
export class ProductsPageComponent {
  products$ = this.store.select(selectProducts);
  total$ = this.store.select(selectProductsTotal);
  loading$ = this.store.select(selectProductsLoading);
  showProductCode$ = this.store.select(selectProductsShowCode);
  errorMessage = '';

  constructor(private productsService: ProductsService, private store: Store) {}

  ngOnInit() {
    this.getProducts()
  }

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

  toggleShowProductCode() {
    this.store.dispatch(productsPageActions.toggleShowCode());
  }
}
