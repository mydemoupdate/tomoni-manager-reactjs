
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
import swal from 'sweetalert';
import { useLocation } from "react-router";
import { Input } from "../FieldFeedbackLabel/input";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import {   updateSupplier,getSupllier} from "../../_redux_/productsSlice";
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
    name: Yup.string(),
    email: Yup.string(),
    address: Yup.string(),
    link: Yup.string(),
    note: Yup.string(),
    id: Yup.string(),

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


export function SupplierUpdate() {

    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [link, setLink] = useState('')
    const [note, setNote] = useState('');
    const [supplier, setSupplier] = useState([])

    
    const history = useHistory();
    let location = useLocation();
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
    useEffect(() => {
       getSupllier(ids).then(result  => {
            setSupplier(result.data);
            setName(result.data?.name);
            setEmail(result.data?.email);
            setAddress(result.data?.address);
            setLink(result.data?.link);
            setNote(result.data?.note)
       })
        
    }, [location]);

    console.log('supplier', supplier, ids, name)
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
                                name: name,
                                email: email,
                                address: address,
                                link: link,
                                note: note,
                            }
                            swal({
                                title: "Bạn có muốn chỉnh sửa thông tin cho nhà cung cấp này?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["No", "Yes"],
                            }).then((willUpdate) => {
                                if (willUpdate) {
                                    setTimeout(() => {
                                        updateSupplier(ids, name, link, email, address, note)
                                            .then((res) => {
                                                swal("Đã cập nhật thành công!", {
                                                    icon: "success",
                                                }).then(history.push('/admin/supplierupdate/'+ ids));

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
                                <CardHeader title="Thông tin nhà cung cấp">
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
                                                    value={ids}
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label>Tên nhà cung cấp</label>
                                                <Field
                                                    type="name"
                                                    name="name"
                                                    value={name}
                                                    onInput={e => setName(e.target.value)}
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
                                                    name="email"
                                                    type="email"
                                                    label=""
                                                    value={email}
                                                    onInput={e => setEmail(e.target.value)}
                                                    placeholder="Email nhà cung cấp"
                                                    component={Input}
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label>Địa chỉ nhà cung cấp</label>
                                                <Field
                                                    type="address"
                                                    name="address"
                                                    value={address}
                                                    onInput={e => setAddress(e.target.value)}
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
                                                    value={link}
                                                    onInput={e => setLink(e.target.value)}
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
                                                    value={note}
                                                    onInput={e => setNote(e.target.value)}
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