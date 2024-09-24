import { createReducer, on } from '@ngrx/store';
import { productsAPIActions, productsPageActions } from './products.actions';
import { Product } from '../product.model';

export interface ProductsState {
  showProductCode: boolean;
  isLoading: boolean,
  products: Product[]
}

const intitialState: ProductsState = {
  showProductCode: false,
  isLoading: false,
  products: []
};

export const productsReducer = createReducer(
  intitialState,
  on(productsPageActions.toggleShowCode, (state: ProductsState) => ({
    ...state,
    showProductCode: !state.showProductCode
  })),
  on(productsPageActions.loadProducts, (state: ProductsState) => ({
    ...state,
    isLoading: true,
  })),
  on(productsAPIActions.productsLoadedSuccess, (state: ProductsState, { products}) => ({
    ...state,
    isLoading: false,
    products
  }))
);
