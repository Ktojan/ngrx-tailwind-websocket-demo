import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProductsState } from "./products.reducer";
import { AuthState } from "./auth.reducer";
import { sumProducts } from "../products.service";

export const selectProductsState = createFeatureSelector<ProductsState>('products')
export const selectAuthState = createFeatureSelector<AuthState>('auth')

export const selectProducts = createSelector(
  selectProductsState,
  (state) => state.products
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.isLoading
);

export const selectProductsShowCode = createSelector(
  selectProductsState,
  (state) => state.showProductCode
);

export const selectProductsTotal = createSelector(
    selectProducts,
    sumProducts
)

// -------------------  User (Auth) states -------------------------

export const loggedUserName = createSelector(
  selectAuthState,
  (state) => state.currentUser
);
