import { createAction, createActionGroup, emptyProps, props, } from '@ngrx/store';
import { Product } from '../product.model';

export const toggleShowType = 'Toggle show code';
export const toggleShowAction = createAction(toggleShowType);

export const productsPageActions = createActionGroup({
  source: 'Products Page',
  events: {
    'Toggle show code': emptyProps(),
    'Load products': emptyProps(),
    'Add product': props<{ product: Product}>(),
    'Update product': props<{ product: Product}>(),
    'Delete product': props<{ id: number }>(),
  }
})

export const productsAPIActions = createActionGroup({
  source: 'Products API',
  events: {
    'Products loaded success': props<{ products: Product[] }>(),
    'Products loaded fail': props<{ message: string }>(),
    'Products added success': props<{ product: Product }>(),
    'Products added fail': props<{ message: string }>(),
    'Products updated success': props<{ product: Product }>(),
    'Products updated fail': props<{ message: string }>(),
    'Products deleted success': props<{ id: number }>(),
    'Products deleted fail': props<{ message: string }>(),
}
})

export const currentUserUpdate = createAction(
  '[User auth] current user updated',
  props<{ currentUser: string }>()
);

    