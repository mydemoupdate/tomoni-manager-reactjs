
import {all} from "redux-saga/effects";
import {combineReducers} from "redux";

import * as auth from "../views/admin/Auth/_redux/authRedux"
import {customersSlice} from "../app/modules/ECommerce/_redux/customers/customersSlice";
import {remarksSlice} from "../app/modules/ECommerce/_redux/remarks/remarksSlice";
import {specificationsSlice} from "../app/modules/ECommerce/_redux/specifications/specificationsSlice";
import {ordersSlice} from "../views/_redux_/ordersSlice";
import {productsSlice} from "../views/_redux_/productsSlice.js"
import {usersSlice} from "../views/_redux_/userSlice";
import {warehouseSlice} from "../views/_redux_/warehouseSlice"

export const rootReducer = combineReducers({
  auth: auth.reducer,
  customers: customersSlice.reducer,
  products: productsSlice.reducer,
  remarks: remarksSlice.reducer,
  specifications: specificationsSlice.reducer,
  users:usersSlice.reducer,
  warehouse: warehouseSlice.reducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
}

