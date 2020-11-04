
import { Field, Form, Formik, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';

import {
    Card,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
// import '../../../assets/css/wizard.wizard-4.css';
import "../../../assets/css/wizard.wizard-4.css"
import '../../../assets/css/style-main.css'
import swal from 'sweetalert';
import { useLocation } from "react-router";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Input } from "../FieldFeedbackLabel/input";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { createProducts, getUnitsList, getSuppliersList, getOriginsList, getTaxesList, getProductIndex, updateSuppliers, updateImage, updateImageProduct } from "../../_redux_/productsSlice";
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



export function ProductCreate() {

    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [step, setStep] = useState(false);
    const [typeProduct, setTypeProduct] = useState();
    // const [selectedValue, setSelectedValue] = useState('');
    const [origins, setOrigins] = useState([]);
    const [suppliers, setSupplier] = useState([]);
    const [units, setUnits] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [originId, setOriginId] = useState('')
    const [taxesId, setTaxesId] = useState('')
    const [supplierId, setSupplierId] = useState('')
    const [unitId, setUnitId] = useState('')
    const [texesDefaullt, setTaxesDefault] = useState({})
    // const [productIndex, setProductIndex] = useState([])
    // const [productIndexs, setProductIndexs] = useState([])
    const [profileImg, setImage] = useState("https://www.drjainsherbals.com/wp-content/uploads/2015/12/no-product-image.jpg")
    const [images, setImages] = useState(null);
    const [imageUrl, setImageUrl] = useState('')



    const history = useHistory();
    let location = useLocation();


    const styles = {
        ui: {
            display: 'flex'
        }
    }



    useEffect(() => {
        if (location.pathname.includes('wholesale')) {
            setTypeProduct('wholesale');
        } else if (location.pathname.includes('auction')) {
            setTypeProduct("auction");
        } else if (location.pathname.includes('shipping')) {
            setTypeProduct("shippingpartner");
        } else if (location.pathname.includes('payment')) {
            setTypeProduct("paymentpartner");
        } else {
            setTypeProduct("retail");
        }
        dispatch(getOriginsList()).then(res => {
            setOrigins(res.data)
            setTaxesDefault(res.data[0].name)
        })
        dispatch(getSuppliersList()).then(res => {
            setSupplier(res.data.data)
        })
        dispatch(getUnitsList()).then(res => {
            setUnits(res.data)
        })
        dispatch(getTaxesList()).then(res => {
            setTaxes(res.data)
        })
        // getProductIndex().then(result => setProductIndex(result.data.total))
        // getProductIndex().then(result => setProductIndexs(result.data.total))
        // getSupplier().then(result => setSupplier(result.data) )
        // getUnits().then(result => setUnits(result.data))
    }, [location]);
    const dispatch = useDispatch();
    const onOriginChange = (event, values) => {
        if (values) {
            setOriginId(values?.id)
        }
    }
    const ontTaxesChange = async (event, values) => {
        if (values) {
            await setTaxesId(values?.id)
        }
    }
    const ontSupplierChange = async (event, values) => {
        if (values) {
            await setSupplierId(values.map(x => x?.id))
        }
    }
    const onUnitChange = async (event, values) => {
        if (values) {
            await setUnitId(values?.id)
        }
    }
    // const checkValidation = () => {
    //     if (originId === '' && supplierId === '' && unitId === '' && taxesId === '') {
    //         swal("Bạn nhập thiếu thông tin!", {
    //             icon: "warning"
    //         })
    //         return;
    //     }
    // }
    const imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImage(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
        setImages(e.target.files[0])

    };

    return (
        <div className="card card-custom card-transparent">
            {
                <Formik
                    initialValues={{ name: "", price: "", id: "", ingredients: "" }}
                    validationSchema={ProductSchema}
                    onSubmit={async (values, actions) => {
                        await setTimeout(() => {
                            //   alert(JSON.stringify(values, null, 2));
                            //   console.log(values)

                            const params = {
                                name: values.name,
                                price: values.price,
                                origin_id: originId,
                                supplier_id: supplierId,
                                unit_id: unitId,
                                id: values.id,
                                ingredients: JSON.stringify((values.ingredients)),
                                tax_id: taxesId
                            }
                            swal({
                                title: "Bạn có muốn tạo sản phẩm này?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["No", "Yes"],
                            }).then((willUpdate) => {
                                if (willUpdate) {
                                    setTimeout(() => {
                                        createProducts(params)
                                        updateImage(values.id, images)
                                            .then((res) => {
                                                swal("Đã cập nhật thành công!", {
                                                    icon: "success",
                                                }).then(history.push("/admin/product"));

                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                swal("Cập nhật không thành công!", {
                                                    icon: "warning",
                                                });
                                            });
                                    }, 100)
                                    setTimeout(() => {
                                        updateSuppliers(values.id, supplierId.map(m => m).join())
                                    }, 200)
                                    setTimeout(() => {
                                        updateImageProduct(values.id, profileImg)
                                    }, 300)

                                }
                            });

                        }, 300);
                    }}
                >
                    {(props: FormikProps<any>) => (
                        <Form>
                            <div className="card card-custom " style={{ height: "10%" }}>
                                <CardHeader title="Thêm sản phẩm mới">
                                    <CardHeaderToolbar>
                                        <Link
                                            type="button"
                                            className="btn btn-light"
                                            to={'/admin/product'}
                                        >
                                            <i className="fa fa-arrow-left"></i>
                                                   Trở về
                                              </Link>
                                        {`  `}
                                        {`  `}

                                        <button type="submit"
                                            className="btn btn-primary ml-2"
                                        // onClick={checkValidation}
                                        >
                                            <i className="fa fa-plus-circle"></i>
                                          Lưu
                                              </button>
                                    </CardHeaderToolbar>
                                </CardHeader>
                            </div>
                            <div style={styles.ui}>
                                <div style={{ width: "19%", margin: '1% 1% 0 0 ' }}>
                                    <Card style={{ height: '465px' }}>
                                        <div >
                                            <div style={{ width: "90%", height: '285px', borderRadius: '5px', margin: "1 rem 0 0 5%" }}>
                                                <img src={profileImg === null ? imageUrl : profileImg} alt="" id="img" style={{ width: '100%', height: "100%", margin: "6%" }} />
                                            </div>
                                            <input type="file" accept="image/*" name="image-upload" id="input" onChange={imageHandler} />
                                            <div className="label">
                                                <label className="image-upload" htmlFor="input" style={{ display: 'flex', marginLeft: "15%" }}>
                                                    <i className="material-icons">add_photo_alternate</i>
                                                    <div style={{ margin: '3%' }}>Thêm ảnh</div>
                                                </label>
                                            </div>
                                        </div>
                                        {/* <div style={{display:'flex'}}>
                                            <div style={{ borderTop: '1px dotted #bbb', width: '25%', margin:'2% 2% 5% 15%'}}></div>
                                            <div>or</div>
                                            <div style={{ borderTop: '1px dotted #bbb', width: '25%', marginLeft: '15%', marginBottom: '5%', marginTop: '2%' }}></div>
                                        </div> */}
                                        <div style={{ marginLeft: "24%", marginTop: '3%' }}>
                                            <div className="form-group row">
                                                <div className="col-8">
                                                    <input className="form-control" placeholder="Thêm ảnh bằng url" onInput={e => setImage(e.target.value)} style={{ textAlign: 'center' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                                <Card style={{ padding: '0% 3% 1% 2%', width: "80%", marginTop: '1%', height: '465px', marginBottom: '0' }}>
                                    <div className="form-group row mt-5">
                                        <div className="col-lg-6">
                                            <label>ID sản phẩm</label>
                                            <Field
                                                type="id"
                                                name="id"
                                                placeholder="ID Sẩn Phẩm"
                                                label=""
                                                component={Input}
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <label>Giá tiền sẩn phẩm</label>
                                            <Field
                                                type="price"
                                                name="price"
                                                placeholder="Nhập số tiền "
                                                label=""
                                                component={Input}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row mt-5">
                                        <div className="col-lg-6">
                                            <label>Tên sản phẩm </label>
                                            <Field
                                                type="name"
                                                name="name"
                                                placeholder="Tên sản phẩm"
                                                label=""
                                                component={Input}
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <label>Thành phần sản phẩm</label>
                                            <Field
                                                type="ingredients"
                                                name="ingredients"
                                                placeholder="Thành phần sản phẩm"
                                                component={Input}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group row mt-5">
                                        <div className="col-lg-6">
                                            <label>Phần trăm thuế</label>
                                            <Autocomplete
                                                // name="tax_id"
                                                // type="tax_id"
                                                placeholder={"Nhập phần trăm thuế"}
                                                onChange={ontTaxesChange}
                                                options={taxes}
                                                autoHighlight
                                                getOptionLabel={option => option.name}
                                                renderOption={option => (
                                                    <React.Fragment>
                                                        {option.name}
                                                    </React.Fragment>
                                                )}
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <label>Tên nơi xuất xứ </label>
                                            <Autocomplete
                                                // name="origin_id"
                                                // type="origin_id"
                                                onChange={onOriginChange}
                                                options={origins}
                                                autoHighlight
                                                getOptionLabel={option => option.name}
                                                renderOption={option => (
                                                    <React.Fragment>
                                                        {option.name} ({option.id})
                                                    </React.Fragment>
                                                )}
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </div>

                                    </div>

                                    <div className="form-group row mt-5">
                                        <div className="col-lg-6">
                                            <label>Tên nhà cung cấp </label>
                                            <Autocomplete
                                                // name="supplier_id"
                                                // type="supplier_id"
                                                multiple
                                                id="tags-standard"
                                                onChange={ontSupplierChange}
                                                options={suppliers}
                                                autoHighlight
                                                getOptionLabel={option => option.name}
                                                renderOption={option => (
                                                    <React.Fragment>
                                                        {option.name}
                                                    </React.Fragment>
                                                )}
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className="col-lg-6">
                                            <label>Đơn vị </label>
                                            <Autocomplete
                                                // name="unit_id"
                                                // type="unit_id"
                                                onChange={onUnitChange}
                                                options={units}
                                                // value={units.find(obj => obj.value === selectedValue)}
                                                // onChange={handleChange}
                                                autoHighlight
                                                getOptionLabel={option => option.name}
                                                renderOption={option => (
                                                    <React.Fragment>
                                                        {option.name}
                                                    </React.Fragment>
                                                )}
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                    />
                                                )}

                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row mt-5">
                                    </div>
                                </Card>
                            </div>
                        </Form>
                    )}
                </Formik>
            }
        </div>
    );
}