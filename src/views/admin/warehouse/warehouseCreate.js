import React, { useEffect, useState } from 'react';

import {
    Card,
} from "../../../_metronic/_partials/controls";
// import '../../../assets/css/wizard.wizard-4.css';
import "../../../assets/css/wizard.wizard-4.css"
import '../../../assets/css/style-main.css'
import { useLocation } from "react-router";
import * as Yup from "yup";
import {  useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";


const ProductSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, "Vui lòng nhập tên sản phẩm hợp lệ")
        .max(2000000000000, "Vui lòng nhập tên sản phẩm hợp lệ")
        .required("Vui lòng nhập tên sản phẩm"),
    price: Yup.number()
        .min(1, "Vui lòng nhập số tiền")
        .max(100000000000, "$100000000000là lớn nhất")
        .required("Nhập giá"),
    // origin_id:Yup.string(),
    // supplier_id:Yup.string() ,
    // unit_id:Yup.string()

    id: Yup.string()
        .min(1, "Vui lòng nhập ID hợp lệ")
        .max(13, "ID tối đa 13 ký tự")
        .required("Vui lòng nhập ID"),
    // locale: Yup.string()
    //     .min(1, "Vui lòng nhập locale hợp lệ")
    //     .max(20, "Vui lòng nhập locale hợp lệ")
    //     .required("Vui lòng nhập locale"),
    ingredients: Yup.string()
        .min(1, "Vui lòng nhập thành phần cho sản phẩm")
        .max(2000000000000, "Vui lòng nhập thành phần cho sản phẩm hợp lệ")
        .required("Vui lòng nhập thành phần cho sản phẩm"),
    // tax_id:Yup.string(),

});



export function WareHouseCreate() {

    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [selectedValue, setSelectedValue] = useState('');
    // const [checkModal, setCheckModal] = (false)
    const history = useHistory();
    let location = useLocation();

    const handleChange = e => {
        setSelectedValue(e.value);
    }

    useEffect(() => {
       
    }, [location]);
    const dispatch = useDispatch();
   
    // const checkValidation = () => {
    //     if (originId === '' && supplierId === '' && unitId === '' && taxesId === '') {
    //         swal("Bạn nhập thiếu thông tin!", {
    //             icon: "warning"
    //         })
    //         return;
    //     }
    // }
   
    return (

        <div>haha</div>
       
    );
}