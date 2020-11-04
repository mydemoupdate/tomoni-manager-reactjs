import apiAccounting from '../server/accountingAP';
import apiUser from '../server/userAPI';
export const token = localStorage.getItem("accessToken");
export const getAccountingWithObject= (object) => async dispatch => {
    return  apiAccounting.get('transactions'+object);
}
export const getTransactionTypeWithObject= (object) => async dispatch => {
    return  apiAccounting.get('transaction-types'+object);
}
export const getCurrenciesWithObject= (object) => async dispatch => {
    return  apiAccounting.get('currencies'+object);
}
export const saveTransaction= (object) => async dispatch => {
    return  apiAccounting.post('transactions',object);
}
export const saveTransactionType= (object) => async dispatch => {
    return  apiAccounting.post('transaction-types',object);
}
export const saveCurrencies= (object) => async dispatch => {
    return  apiAccounting.post('currencies',object);
}
export const updateTransactionType= (object) => async dispatch => {
    return  apiAccounting.put('transaction-types/'+object.id,object);
}
export const updateCurrencies= (object) => async dispatch => {
    return  apiAccounting.put('currencies/'+object.id,object);
}
export const deleteTransactionType= (id) => async dispatch => {
    return  apiAccounting.delete('transaction-types/'+id);
}
export const deleteCurrencies= (id) => async dispatch => {
    return  apiAccounting.delete('currencies/'+id);
}
export const getPaymentMethod=()=> async dispatch => {
    return  apiAccounting.get('payment-methods')
}
export const getCustomerByObject=(object)=> async dispatch => {
    return  apiUser.get('users'+object)
}
export const savePaymentMethod= (object) => async dispatch => {
    return  apiAccounting.post('payment-methods',object);
}
export const updatePaymentMethod= (object) => async dispatch => {
    return  apiAccounting.put('payment-methods/'+object.id,object);
}
export const deletePaymentMethod= (id) => async dispatch => {
    return  apiAccounting.delete('payment-methods/'+id);
}
export const saveReceipt = (file, id) => {

    let formData = new FormData();
    formData.append('file', file);

    var resquest = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: formData
    }
    return fetch(
        `http://139.180.207.4:82/api/receipts?transaction_id=${id}`,
        resquest
      );
}
export const updateReceipt = (file, id) => {

    let formData = new FormData();
    formData.append('file', file);

    var resquest = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: formData
    }
    return fetch(
        `http://139.180.207.4:82/api/receipts/${id}?_method=PUT`,
        resquest
      );
}
export const deleteReceipt= (id) => async dispatch => {
    return  apiAccounting.delete('receipts/'+id);
}