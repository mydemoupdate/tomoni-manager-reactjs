import {createSlice} from "@reduxjs/toolkit";
import axios from 'axios'
import api from '../server/orderAPI';
import apiProduct from '../server/productAPI';
import apiUser from '../server/userAPI';
import apiWareHouse from '../server/wareHouseAPI';
import apiAccounting from '../server/accountingAP';
import apiNotification from '../server/notificationAPI';
const initialOrdersState = {
    listLoading: false,
    actionsLoading: false,
    totalCount: 0,
    entities: null,
    perPage: 0

};
export const callTypes = {
    list: "list",
    action: "action"
};

export const ordersSlice = createSlice({
    name: "orders",
    initialState: initialOrdersState,
    reducers: {
        // getOrder
        OrderSuccess: (state, action) => {
            state.entities = action.payload;
        }

    }
});

const {OrderSuccess} = ordersSlice.actions
export const getOrderList = (params) => async dispatch => {
    try {
        await api.get('orders?' + params).then((res) => {
            var entities = res.data.data || [];
            // var totalCount = res.data.total || 0;
            // var perPage = res.data.per_page || 0;
            const data = {
                entities
            }
            dispatch(OrderSuccess(data));
            
        })

    } catch (e) {
        return console.error(e.message);
    }
}

export const getOrderAll= (object) => async dispatch => {
    return  api.get('orders?'+object);
}
export const getOrderAllSearch= (object) => async dispatch => {
    return  api.get('orders/'+object);
}
export const createOrder = (object) => async dispatch => {
    return  api.post('orders',object);
}
export const deleteOrder = (id) => async dispatch => {
        return  api.delete('orders/' + id);
}
export const updateItemOrder = (object) => async dispatch => {
    return  api.put('orders/items/' + object.id,object);
}
export const getItemOrder = (object) => async dispatch => {
    return  api.get('orders/items?'+object);
}
export const getStatusOrder = () => async dispatch => {
    return  api.get('orders/statuses');
}

export const getOrderById = (id) => async dispatch => {
    return  api.get('orders/' + id+"?with=items.purchase.items;items.trackings;trackings;cost;shipmentInfor&locale=vi");
}
export const updateStatus = (id, value) => async dispatch =>{
    return api.put('orders/'+id+'?status='+value+'&locale=vi');
}
export const updateOrder = (object) => async dispatch =>{
    return api.put('orders/'+object.id, object);
}
export const getProductListAll=(page)=> async dispatch => {
    return  apiProduct.get('products?locale=vi&page='+page)
}
export const searchProductBy=(object)=> async dispatch => {
    return  apiProduct.get('products?locale=vi&search='+object)
}
export const updatePackage=(object)=> async dispatch => {
    return  apiProduct.put('packages/'+object.id,object)
}
export const getProductList=(object)=> async dispatch => {
    if (object){
      return   apiProduct.get('products?with=origin;suppliers;unit;tax;package&search='+object+'&locale=vi');
    }
    return  apiProduct.get('products?locale=vi')
}
export const getSupplierList=(object)=> async dispatch => {
    if(object){
        return   apiProduct.get('suppliers?search='+object+'&locale=vi');
    }
    return  apiProduct.get('suppliers')
}
export const getTaxesList=()=> async dispatch => {
    return  apiProduct.get('taxes')
}
export const getShipmentList=(page,userID)=> async dispatch => {
    return  api.get('shipment-infors?page='+page+'&search=user_id:'+userID)
}
export const saveShipment=(object)=> async dispatch => {
    return  api.post('shipment-infors',object);
}
export const deleteShipment=(id)=> async dispatch => {
    return  api.delete('shipment-infors/'+id);
}
export const getCustomer=(page)=> async dispatch => {
    return  apiUser.get('users?page='+page)
}

export const getSupplier=()=> async dispatch => {
    return  apiProduct.get('suppliers')
}
export const getSupplierById=(id)=> async dispatch => {
    return  apiProduct.get('suppliers/'+id)
}

export const getShimmentMethodBy=(key)=> async dispatch => {
    return  apiWareHouse.get('shipment-methods/'+key)
}
export const getBox=(key)=> async dispatch => {
    return  apiWareHouse.get('boxes?search=order_id:'+key)
}
export const getLadingBills=(key)=> async dispatch => {
    return  apiWareHouse.get('lading-bills?search=boxes.order_id:'+key);
}
export const getTransaction=(key)=> async dispatch => {
    return  apiAccounting.get('receipts?search=receiptable_type:App\Entities\Order;receiptable_id:'+key+'&searchJoin=and&with=transaction')
}
export const getNotification=(key,page)=> async dispatch => {
    return  apiNotification.get('logs?search=logable_type:App\Entities\Order;logable_id:'+key+'&page='+page)
}
export const writeNotification=(object)=>async dispatch=>{
    return apiNotification.post('logs',object);
}
export const getPurchasesAll= (object) => async dispatch => {
    return  api.get('purchases?with=orderItems&appends=supplier;buyer&'+object);
}
export const getPurchasesById = (id) => async dispatch => {
    return  api.get('purchases/' + id+"?with=orderItems.trackings&locale=vi");
}
export const updatePurchases = (object) => async dispatch => {
    return  api.put('purchases/' + object.id, object);
}
export const createTracking = (object) => async dispatch => {
    return  api.post('trackings',object);
}
export const createShipmentInfor = (object) => async dispatch => {
    return  api.post('shipment-infors',object);
}
export const getIdProductByIdItem = (id) => async dispatch => {
    return  api.get('orders/items/' + id);
}
export const updateCostOrder = (object) => async dispatch => {
    return  api.put('orders/costs/' + object.id, object);
}