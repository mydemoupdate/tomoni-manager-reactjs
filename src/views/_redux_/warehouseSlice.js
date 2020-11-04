import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { floor } from "lodash";
import { object } from "prop-types";


const token = localStorage.getItem("accessToken")
const initialWareHouseState = {
    listLoading: false,
    actionsLoading: false,
    totalCount: 0,
    entities: null,
    perPage: 0

};

export const warehouseSlice = createSlice({
    name: "safs",
    initialState: initialWareHouseState,
    reducers: {
        // getProducts
        WareHousesuccess: (state, action) => {
            state.perPage = action.payload;
            state.totalCount = action.payload;
            state.entities = action.payload;
            state.entitiesOrigin = action.payload
        },

    }
});
const { WareHousesuccess } = warehouseSlice.actions

const api = axios.create({
    'baseURL': 'http://139.180.207.4:86/api/',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
const apiOrder = axios.create({
    'baseURL': 'http://139.180.207.4:83/api/',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
const apiProduct = axios.create({
    'baseURL': 'http://139.180.207.4:84/api/',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
export const getWareHouseAll = (object) => async dispatch => {
    return api.get('sfas?with=receipts;agency' +'&'+ object)
}

export function createWareHouse(tracking, quantity, shipping, coupon) {
    return api.post('sfas?' + `tracking=${tracking}&quantity=${quantity}&shipping_inside=${shipping}&coupon=${coupon}`)
}
export function getWareHouse(id) {
    return api.get("sfas/" + id + "?with=boxes;agency")
}

export function deleteWareHouse(id) {
    return api.delete('sfas/' + id)
}
export function updateWareHouse(id, tracking, quantity, shipping, coupon, agency_id) {
    return api.put('sfas/' + id + `?tracking=${tracking}&quantity=${quantity}&shipping_inside=${shipping}&coupon=${coupon}&agency_id=${agency_id}`)
}

export function deleteBoxWareHouse(id) {
    return api.delete('boxes/' + id)
}

export function createBoxWareHouse(sfa_id, weight, length, width, height) {
    return api.post('boxes?' + `sfa_id=${sfa_id}&weight=${weight}&length=${length}&width=${width}&height=${height}`)
}

export const getBoxAll = (object) => async dispatch => {
    return api.get('boxes?' + object)
}

// export function getSFA (){
//     return api.get('sfas')
// }
export function getBoxParent() {
    return api.get('box-items')
}
export const getOrder= (page) => async dispatch => {
    return apiOrder.get('orders?page='+ page)
}
export const getPallet = (page) => async dispatch => {
    return api.get('pallets?page='+ page)
}
export const getLaddingBill= (page) => async dispatch =>{
    return api.get('lading-bills?page='+ page)
}

export const getSFA = (page) => async dispatch => {
    return api.get('sfas?page=' + page)
}
export function createProductBox(box_id, product_id, quantity){
    return api.post('box-items?'+`box_id=${box_id}&product_id=${product_id}&quantity=${quantity}`)
}
export const getBoxes = (id) =>{
   return api.get('boxes/'+ id +'?appends=order&with=cost;pallet.shelve.area;ladingBill')
}
export function deleteBox (id) {
    return api.delete('boxes/' + id)
}
export const getBoxItemAll = (object, id) => async dispatch => {
    return api.get('box-items?appends=product&search=box_id:'+ id +'&'+object)
}
export function updateCostBox(id, additional, shipping,storage ) {
    return api.put('box-costs/' + id + `?additional=${additional}&shipping=${shipping}&storage=${storage}`)
}
export function updateLocalBox(id, pallet_id){
    return api.put('boxes/'+ id+`?pallet_id=${pallet_id}`)
}
export function updatePalletBox(id, shelve_id, row, column, floor){
    return api.put('pallets/'+id+`?shelve_id=${shelve_id}&row=${row}&column=${column}&floor=${floor}`)
}
export function updateShelvetBox(id,row, column, floor){
    return api.put('shelves/'+id+`?&row=${row}&column=${column}&floor=${floor}`)
}

export const getShelveAll = (object) =>async dispatch =>{
    return api.get('shelves?'+ object)
}

export const getShelve = (page) =>async dispatch =>{
    return api.get('shelves?page='+ page)
}

export const getPallets = (page) =>async dispatch =>{
    return api.get('pallets?page='+ page)
}

export function getShelveId (id) {
    return api.get('shelves/' + id)
}
export function updateBox(id, length, width, height, weight, sfa_id ){
    return api.put('boxes/' + id +`?length=${length}&width=${width}&height=${height}&weight=${weight}&sfa_id=${sfa_id}`)
}
export function deleteBoxChild (id) {
    return api.delete('box-items/'+ id)
}
export function createBoxChild(box_id, product_id, quantity){
    return api.post('box-items?'+ `box_id=${box_id}&product_id=${product_id}&quantity=${quantity}`)
}

export const searchProductBy=(object)=> async dispatch => {
    return  apiProduct.get('products?locale=vi&search='+object)
}
export function updateBoxChild(id, product_id, quantity){
    return api.put('box-items/'+ id+`?quantity=${quantity}&product_id=${product_id}`)
}
export function createBoxWH( sfa_id, weight, length, width, height, order_id, pallet_id, lading_bill_id, quantity){
    return api.post('boxes?' + `&sfa_id=${sfa_id}&weight=${weight}&length=${length}&width=${width}&height=${height}&order_id=${order_id}&pallet_id=${pallet_id}&lading_bill_id=${lading_bill_id}&quantity=${quantity}`)
}
export function getBoxParents(id){
    return api.get('boxes/'+ id +'?with=parent;items')
}
export function getAgency(){
    return api.get('agencies')
}
export function duplicateBox(id, numbers){
    return api.put('boxes/'+ id + `?action=duplicate&params=${numbers}`)
}
export function createAgency (name, address, tel){
    return api.post('agencies?' + `name=${name}&address=${address}&tel=${tel}`)
}
export function deleteAgency(id){
    return api.delete('agencies/'+ id)
}
export function updateAgency(id,name, tel, address){
    return api.put('agencies/'+ id +`?name=${name}&tel=${tel}&address=${address}`)
}
export function getShippingMethod(){
    return api.get('shipment-methods')
}
export function createShippingMethod(id, name, fee){
    return api.post('shipment-methods?' + `id=${id}&name=${name}&fee=${fee}`)
}
export function updateShippingMethod(id, name, fee){
    return api.put(`shipment-methods/${id}?name=${name}&fee=${fee}`)
}
export function deleteShippingMethod(id){
    return api.delete('shipment-methods/'+ id)
}
export const getShelves =(object) => async dispatch => {
    return api.get('shelves?with=area&'+object)
}
export function createShelve(area_id, row, column, floor) {
    return api.post('shelves?'+ `area_id=${area_id}&row=${row}&column=${column}&floor=${floor}`)
}
export function deleteShelve(id){
    return api.delete('shelves/'+ id)
}
export function updateShelve(id, row, column, floor, area_id ){
    return api.put(`shelves/${id}?row=${row}&column=${column}&floor=${floor}&area_id=${area_id}`)
}
export const getPalletAll =(object) => async dispatch => {
    return api.get('pallets?with=shelve&'+object)
}
export function createPallet(shelve_id,row,column,floor){
    return api.post(`pallets?shelve_id=${shelve_id}&row=${row}&column=${column}&floor=${floor}`)
}
export function deletePallet(id){
    return api.delete('pallets/'+ id)
}
export function updatePallte(id, shelve_id, row, column, floor ){
    return api.put(`pallets/${id}?shelve_id=${shelve_id}&row=${row}&column=${column}&floor=${floor}`)  
}
