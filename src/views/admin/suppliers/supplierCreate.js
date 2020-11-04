
import { Field, Form, Formik, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';

import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
// import '../../../assets/css/wizard.wizard-4.css';
import "../../../assets/css/wizard.wizard-4.css"
import '../../../assets/css/style-main.css'
import { Button, Row, Col } from "react-bootstrap";
import swal from 'sweetalert';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { useLocation } from "react-router";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Input } from "../FieldFeedbackLabel/input";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import {  createSuppliers } from "../../_redux_/productsSlice";
import { useDispatch } from "react-redux";


// const unitId = [
//     { label: "box" },
//     { label: "slice" },
// ];

// const originId = [
//     { label: "ja" },
//     { label: "vn" },
//     { label: "en" },

// ]
// const supplierId = [
//     { label: "Amazon JP" },
//     { label: "Rakuten" },
//     { label: "Uniqlo" },
// ]

const ProductSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, "Vui lòng nhập tên nhà cung cấp hợp lệ")
        .max(200, "Vui lòng nhập tên nhà cung cấp hợp lệ")
        .required("Vui lòng nhập tên nhà cung cấp"),
    email: Yup.string()
        .min(1, "Vui lòng nhập email nhà cung cấp hợp lệ")
        .max(200, "Vui lòng nhập email nhà cung cấp hợp lệ")
        .required("Vui lòng nhập email nhà cung cấp hợp lệ"),
    address: Yup.string()
        .min(1, "Vui lòng nhập địa chỉ hợp lệ")
        .max(200, "Vui lòng nhập địa chỉ hợp lệ")
        .required("Vui lòng nhập địa chỉ"),
    link: Yup.string()
        .min(1, "Vui lòng nhập liên kết nhà cung cấp hợp lệ")
        .max(200, "Vui lòng nhập liên kết nhà cung cấp hợp lệ")
        .required("Vui lòng nhập liên kết nhà cung cấp hợp lệ"),
    note: Yup.string()
        .min(1, "Vui lòng nhập ghi chú hợp lệ")
        .max(500, "Vui lòng nhập ghi chú hợp lệ")
        .required("Vui lòng nhập ghi chú hợp lệ"),
    id: Yup.string()
        .min(1, "Vui lòng nhập ID nhà cung cấp hợp lệ")
        .max(50, "Vui lòng nhập ID nhà cung cấp hợp lệ")
        .required("Vui lòng nhập ID nhà cung cấp"),

});
String.prototype.escapeSpecialChars = function () {
    return this.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
};


export function SupplierCreate() {

    const [selectedValue, setSelectedValue] = useState('');
    const [originId, setOriginId] = useState('')
    const [taxesId, setTaxesId] = useState('')
    const [supplierId, setSupplierId] = useState('')
    const [unitId, setUnitId] = useState('')
    const [images, setImages] = useState(null);

    
    const history = useHistory();
    let location = useLocation();

    const handleChange = e => {
        setSelectedValue(e.value);
    }
    const styles = {
        ui: {
            display: 'flex'
        }
    }


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
        <div className="card card-custom card-transparent">
            {
                <Formik
                    initialValues={{ name: "", email: "", address: "", link: "",note:"", id:""  }}
                    validationSchema={ProductSchema}
                    onSubmit={async (values, actions) => {
                        await setTimeout(() => {
                            //   alert(JSON.stringify(values, null, 2));
                            //   console.log(values)

                            const params = {
                                name: values.name,
                                email: values.email,
                                address: values.address,
                                link: values.link,
                                note: values.note,
                                id: values.id,
                            }
                            swal({
                                title: "Bạn có muốn tạo nhà cung cấp này?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["No", "Yes"],
                            }).then((willUpdate) => {
                                if (willUpdate) {
                                    setTimeout(() => {
                                        createSuppliers(params)
                                            .then((res) => {
                                                swal("Đã cập nhật thành công!", {
                                                    icon: "success",
                                                }).then(history.push("/admin/supplier"));

                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                swal("Cập nhật không thành công!", {
                                                    icon: "warning",
                                                });
                                            });
                                    }, 500)

                                }
                            });

                        }, 500);
                    }}
                >
                    {(props: FormikProps<any>) => (
                        <Form>
                            <Card>
                                <CardHeader title="Thêm sản phẩm mới">
                                    <CardHeaderToolbar>
                                        <Link
                                            type="button"
                                            className="btn btn-light"
                                            to={'/admin/supplier'}
                                        >
                                            <i className="fa fa-arrow-left"></i>
                                                   Trở về
                                              </Link>
                                        {`  `}

                                        <button type="submit"
                                            className="btn btn-primary ml-2"
                                        >
                                            <i className="fa fa-plus-circle"></i>
                                          Lưu
                                              </button>
                                    </CardHeaderToolbar>
                                </CardHeader>

                                <div style={styles.ui}>
                                    <CardBody>
                                        <div className="form-group row mt-5">
                                            <div className="col-lg-6">
                                                <label>ID nhà cung cấp</label>
                                                <Field
                                                    type="id"
                                                    name="id"
                                                    placeholder="ID nhà cung cấp"
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label>Tên nhà cung cấp</label>
                                                <Field
                                                    type="name"
                                                    name="name"
                                                    placeholder="Tên nhà cung cấp "
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row mt-5">
                                            <div className="col-lg-6">
                                                <label>Email nhà cung cấp </label>
                                                <Field
                                                    // type="email"
                                                    name="email"
                                                    placeholder="Email nhà cung cấp"
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label>Địa chỉ nhà cung cấp</label>
                                                <Field
                                                    type="address"
                                                    name="address"
                                                    placeholder="Địa chỉ nhà cung cấp"
                                                    component={Input}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row mt-5">
                                        <div className="col-lg-6">
                                                <label>Liên kết </label>
                                                <Field
                                                    type="link"
                                                    name="link"
                                                    placeholder="Liên kết"
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label>Ghi chú</label>
                                                <Field
                                                    type="note"
                                                    name="note"
                                                    placeholder="Ghi chú"
                                                    component={Input}
                                                />
                                            </div>

                                        </div>

                                        <div className="form-group row mt-5">
                                        </div>
                                        <div className="form-group row mt-5">
                                        </div>
                                    </CardBody>
                                </div>
                            </Card>
                        </Form>
                    )}
                </Formik>
            }
        </div>
    );
}