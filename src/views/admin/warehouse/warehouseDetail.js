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
import { Link, useHistory } from "react-router-dom";
import { getWareHouse, 
         deleteWareHouse, 
         updateWareHouse, 
         deleteBoxWareHouse, 
         createBoxWareHouse, 
         deleteBoxChild,
         createBoxChild,
         updateBoxChild,
         getAgency,
         duplicateBox,
        } from '../../_redux_/warehouseSlice';
import { useDispatch } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import { Button, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import Select from 'react-select';
import BarcodeReader from 'react-barcode-reader'




export function WareHouseDetail() {

    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [wareHouse, setWareHouse] = useState([])
    const [allBox, setAllBox] = useState([])
    let [orderNumerical, setOrderNumerical] = useState(1);
    const history = useHistory();
    let location = useLocation();
    let num = 1;
    let nums = 1;


    //modal update SFA
    const [checkModal, setCheckModal] = useState(false)
    const [idSFA, setIdSFA] = useState('');
    const [tracking, setTracking] = useState('');
    const [quantity, setQuantity] = useState('');
    const [coupon, setCoupon] = useState('');
    const [shipping, setShipping] = useState('');
    const [agency, setAgency] = useState('');
    const [idAgency, setIdAgency] = useState('')

    //modal create Box  of SFA
    const [checkModalBox, setCheckModalBox] = useState(false)

    // const [palledId, setPalledId] = useState('')
    // const [quantityBox, setQuantityBox] = useState('')
    // const [boxParentId, setBoxParentId] = useState('')
    // const [orderId, setOrderId] = useState('')
    // const [ladingBillId, setLadingBillId] = useState('')




   
    const [checkFormTracking, setCheckFormTracking] = useState('');


     //create box duplicate
    const [checkModalBoxDuplicate, setCheckModalBoxDuplacate] = useState(false)
    const [idBox, setIdBox] = useState(Math.floor(100000000000 + Math.random() * 900000000000))
    const [idBoxQuantity, setIdBoxQuantity] = useState([])
    const [quantityDuplicate, setQuantityDuplicate] = useState('')
    const [weight, setWeight] = useState('')
    const [length, setLength] = useState('')
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [palledId, setPalledId] = useState('')
    const [quantityBox, setQuantityBox] = useState('')
    const [boxParentId, setBoxParentId] = useState('')
    const [orderId, setOrderId] = useState('')
    const [ladingBillId, setLadingBillId] = useState('')
    const [sfaId, setSfaId] = useState('')
    const [productList, setProductList] = useState([])
    const [quantityProduct, setQuantityProduct] = useState('')
    

    //update quantity product
    const [checkModalUpdateQuantity, setModalUpdateQuantity]= useState(false)
    const [idProductItem, setIdProductItem] = useState('')
    const [quantityProducts, setQuantityProducts] = useState('')
    const [idItem, setIdItem] = useState('')


    //create product in box
    const [idProductInBox, setIdProductInBox] = useState('')
    const [quantityProductInBox, setQuantityProductInBox] = useState('')

    //create box
    const [weightBox, setWeightBox] = useState('')
    const [lengthBox, setLengthBox] = useState('')
    const [widthBox, setWidthBox] = useState('')
    const [heightBox, setHeightBox] = useState('')
    const [idBoxs, setIdBoxs] = useState(Math.floor(100000000000 + Math.random() * 900000000000))
    const [productIdBox, setProductIdBox] = useState('')
    const [quantityBoxs, setQuantityBoxs] = useState('')

    //get agency
    const [agencyList, setAgencyList] = useState([])
    const [agencys, setAgencyS] = useState('');
    
    //duplicate update
    const [idBoxDuplicate, setIdBoxDuplicate] = useState([])

    const getHandlerTableChange = (e) => { }

    useEffect(() => {

        getWareHouse(ids).then(result => {
            setWareHouse(result.data)
            setIdSFA(result.data?.id)
            setTracking(result.data?.tracking)
            setQuantity(result.data?.quantity)
            setCoupon(result.data?.coupon)
            setShipping(result.data?.shipping_inside)
            setAllBox(result.data?.boxes)
            setAgency(result.data?.agency?.name)
            setAgencyS(result.data?.agency?.name)

            getAgency().then((res) => {
                const _data = res.data || [];
                var result = [];
                for (var i = 0; i < _data.length; i++) {
                    result.push({
                        value: _data[i].name,
                        label:_data[i].name,
                        id:_data[i].id
                    });
                }
                setAgencyList(result);
            });

        })



    }, [location]);
    const dispatch = useDispatch();
    const options = {
        hideSizePerPage: true,
        // onPageChange: (page, sizePerPage) => {
        //     dispatch(getUnitsList());
        // },
    };

    const columns = [
        {
            dataField: "stt",
            text: "Số thứ tự",
            sort: true,

        },
        {
            dataField: "id",
            text: "SKU",
            sort: true,
            style: {
                fontWeight: "bold"
            },
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "quantity",
            text: "Số Lượng",
            sort: true,
        },
        {
            dataField: "weight",
            text: "Trọng Lượng",
            sort: true,
        },

        {
            dataField: "volume",
            text: "Thể Tích",
            sort: true,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "created_at",
            text: "Ngày nhận hàng",
            sort: true,
            style: {
                fontWeight: "500"
            },

        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: rankFormatter,
            style: {
                minWidth: "100px",
                width:'20%'
            }
        },
    ]



    const onPalletChange = (e) => {
        setPalledId(e.value)

    }

    const onBoxParentChange = (e) => {
        setBoxParentId(e.value)

    }

    const onLaddingBillChange = (e) => {
        setLadingBillId(e.value)

    }

    const onOrderChange = (e) => {
        setOrderId(e.value)

    }


    const handleScan = (data) => {
        setTracking(data)
    }
    const handleError = (err) => {
        console.log(err)
        swal("Vui lòng thử lại!", {
            icon: "warning",
        });
    }
    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            history.push('/admin/boxdetail/' + row.id);
        }
    };
    const agencyChange = (e) =>{
        setAgencyS(e.value)
        setIdAgency(e.id)

    }



    const expandRow = {
        renderer: row => (
            <div className="react-bootstrap-table table-responsive ml-15">
                <table className="table table table-head-custom table-vertical-center overflow-hidden">
                    <thead>
                        <tr>
                            <th className="border-top-0 border-top-0 ">Mã thùng</th>
                            <th className="border-top-0">Mã sản phẩm</th>
                            <th className="border-top-0">Số lượng</th>
                            <th className="border-top-0" width="40%">
                                {/* <i className="ki ki-plus" style={{ cursor: 'pointer' }} onClick={() => setCheckFormTracking(row.id)} ></i> */}
                                <OverlayTrigger 
                                    overlay={<Tooltip>Thêm sản phẩm vào thùng</Tooltip>}
                                >
                                    <i className="ki ki-plus" style={{cursor:'pointer'}} onClick={() => setCheckFormTracking(row.id)}></i>
                                </OverlayTrigger>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            checkFormTracking == row.id ?
                                <tr className="font-weight-boldest">
                                    <td className="pt-2 " width="10%">
                                        {/* <input className="form-control"  /> */}
                                    </td>
                                    <td className="pt-2 ">
                                        <input className="form-control" onChange={e => setIdProductInBox(e.target.value)}/>
                                    </td>
                                    <td className="pt-2 ">
                                        <input className="form-control" onChange={e => setQuantityProductInBox(e.target.value)}/>
                                    </td>
                                    <td className="pt-3 " width="40%">
                                        <button type="button"
                                            className="btn btn-success mr-1 btn-sm"
                                            onClick={() =>{
                                                createBoxChild(row.id, idProductInBox, quantityProductInBox) 
                                                .then((res) => {
                                                    swal("Đã cập thêm thành công!", {
                                                        icon: "success",
                                                    }).then(history.push("/admin/warehousedetail/" + ids));;
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    swal("Thêm không thành công!", {
                                                        icon: "warning",
                                                    });
                                                });
                                                setCheckFormTracking(false)
                                            }}
                                            >Lưu
                                            
                                        </button>
                                        <button type="button"
                                            className="btn btn-danger btn-sm" onClick={() => setCheckFormTracking(false)}>Huỷ
                                        </button>
                                    </td>
                                </tr>
                                : <tr></tr>
                        }


                        {
                            row?.items?.map((item, i) =>
                                <tr >
                                    <td>{item?.id}</td>
                                    <td>{item?.product_id}</td>
                                    <td>{item?.quantity}</td>

                                    <OverlayTrigger overlay={<Tooltip>Cập Nhập</Tooltip>}>
                                        <a className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                            style={{marginTop: '1%'}}
                                            onClick={() => {
                                                setModalUpdateQuantity(true)
                                                setQuantityProducts(item.quantity)
                                                setIdProductItem(item?.product_id)
                                                setIdItem(item?.id)
                                            }}
                                        >
                                            <span className="svg-icon svg-icon-md svg-icon-primary">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")} />
                                            </span>
                                        </a>
                                    </OverlayTrigger>
                                    <OverlayTrigger  overlay={<Tooltip>Xoá Sản Phẩm</Tooltip>}>
                                        <a className="btn btn-icon btn-light btn-hover-danger btn-sm"
                                            style={{marginTop: '1%'}}
                                            onClick={() => {
                                                swal({
                                                    title: "Bạn có muốn xoá thùng hàng " + row.id + " ?",
                                                    icon: "warning",
                                                    dangerMode: true,
                                                    buttons: ["Huỷ", "Xoá"],
                                                })
                                                    .then((willDelete) => {
                                                        if (willDelete) {
                                                            deleteBoxChild(item?.id).then(() => {
                                                                swal("Đã xoá thành công!", {
                                                                    icon: "success",
                                                                }).then(history.push("admin/boxdetail/" + ids));
                                                            }).catch((err) => {
                                                                swal("Xoá thất bại !", {
                                                                    icon: "warning",
                                                                });
                                                            })
                                                        }
                                                    });
                                            }}
                                        >
                                            <span className="svg-icon svg-icon-md svg-icon-danger">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                                            </span>
                                        </a>
                                    </OverlayTrigger>
                                </tr>



                            )
                        }


                    </tbody>


                </table>
            </div>
        ),
        showExpandColumn: true,
        expandByColumnOnly: true,
        expandHeaderColumnRenderer: ({ isAnyExpands }) => {
            if (isAnyExpands) {
                return <b></b>;
            }
            return <b></b>;
        },
        expandColumnRenderer: ({ expanded }) => {
            if (expanded) {
                return (
                    <a className="datatable-toggle-detail"><i className="fa fa-caret-down" style={{ color: '#3699FF' }}></i></a>
                );
            }
            return (
                <>
                    <a className="datatable-toggle-detail" ><i className="fa fa-caret-right" style={{ color: '#3699FF' }}></i></a>
                </>
            );
        }
    };

    function rankFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Chi tiết</Tooltip>}
                >
                    <Link 
                        onClick={() => history.push('/admin/boxdetail/' + row.id)}
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                    >
                        <span className="svg-icon svg-icon-md svg-icon-primary">
                            <SVG
                                src={toAbsoluteUrl("/media/svg/icons/General/Visible.svg")}
                            />
                        </span>
                    </Link>
                </OverlayTrigger>
                <>
                </>
                <OverlayTrigger
                    overlay={<Tooltip>Duplicate</Tooltip>}
                >

                    <Link
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                        style={{ float: "right" }}
                        onClick={() => {
                            setCheckModalBoxDuplacate(true)
                            setIdBoxDuplicate(row.id)
                            console.log(row?.id)
                            // setWeight(row?.weight)
                            // setLength(row?.length)
                            // setWidth(row?.width)
                            // setHeight(row?.height)
                            // setPalledId(row?.pallet_id)
                            // setQuantityBox(row?.quantity)
                            // setBoxParentId(row?.box_parent_id)
                            // setOrderId(row?.order_id)
                            // setLadingBillId(row?.lading_bill_id) 
                            // setSfaId(row?.sfa_id)
                            // setProductList( row?.items?.map(item => item))
                            // setQuantityProduct(row?.items?.map(item => item?.quantity))
                            
                        }}
                    >
                        <span className="svg-icon svg-icon-md svg-icon-primary">
                            <SVG
                                src={toAbsoluteUrl("/media/svg/icons/General/Duplicate.svg")}
                            />
                        </span>
                    </Link>
                </OverlayTrigger>
                <>
                </>
                <OverlayTrigger
                    overlay={<Tooltip>Xoá Thùng Hàng </Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => {
                            swal({
                                title: "Bạn có muốn xoá thùng hàng " + row.id + " ?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["Huỷ", "Xoá"],
                            })
                                .then((willDelete) => {
                                    if (willDelete) {
                                        deleteBoxWareHouse(row.id).then(() => {
                                            swal("Đã xoá thành công!", {
                                                icon: "success",
                                            }).then(history.push("/admin/warehousedetail/" + ids));
                                        }).catch((err) => {
                                            swal("Xoá thất bại !", {
                                                icon: "warning",
                                            });
                                        })
                                    }
                                });
                        }}
                    >
                        <span className="svg-icon svg-icon-md svg-icon-danger">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                        </span>
                    </a>
                </OverlayTrigger>
            </>
        );
    }
    function setIdBoxsQuantity () {
        for (var i = 1; i <= quantityDuplicate; i++) {
            setIdBoxQuantity(idBox+ i)
            // console.log(idBoxQuantity)
            // console.log(idBox+ i)
        }

    }
    function handleEnter(event) {
        if (event.keyCode === 13) {
          const form = event.target.form;
          const index = Array.prototype.indexOf.call(form, event.target);
          form.elements[index + 1].focus();
          event.preventDefault();
        }
    }
    function actionEnter(event) {
        if (event.key == 'Enter') {
            // arrayProduct.push({id:productId, quantity: quantityBox})
            // setTrackList([...trackList, { code: code, expected_delivery: expected_delivery }]);
            // setArrayProduct([...arrayProductS,{id:productId, quantity: quantityBox} ])
             setTimeout(() => {
                createBoxWareHouse(idSFA, weightBox, lengthBox, width, heightBox)                                          
                    .then((res) => {
                        swal("Đã cập thêm thành công!", {
                            icon: "success",
                            }).then(history.push("/admin/warehousedetail/" + ids)).then(setIdBoxs(Math.floor(100000000000 + Math.random() * 900000000000)+1));
                        })
                    .catch((err) => {
                        console.log(err);
                        swal("Thêm không thành công!", {
                            icon: "warning",
                        });
                    });

                                        // createProductBox(idBox, productId, quantityBox )

            })
        }
    }
    // console.log('id',idAgency)
    return (
        <div>
            <div className="card card-custom " style={{ height: "10%" }}>
                <CardHeader title="Chi tiết SFA" >
                    <CardHeaderToolbar>

                        <Link
                            type="button"
                            className="btn btn-danger "
                            to={'/admin/warehouse'}
                            style={{ marginRight: "5px" }}
                        >
                            <i className="fa fa-arrow-left"></i>
                            Trở về
                        </Link>
                        <Link
                            type="button"
                            className="btn btn-secondary "
                            style={{ marginRight: "5px" }}
                            onClick={() => {
                                deleteWareHouse(ids)
                                    .then((res) => {
                                        swal("Đã cập nhật thành công!", {
                                            icon: "success",
                                        }).then(history.push("/admin/warehouse"));
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        swal("Cập nhật không thành công!", {
                                            icon: "warning",
                                        });
                                    })
                            }}
                        >
                            <i class="far fa-trash-alt"></i>
                            Xoá SFA
                        </Link>
                    </CardHeaderToolbar>
                </CardHeader>
            </div>
            <div className='row' style={{ marginTop: '1%' }}>
                <div className="col-4">
                    <Card >
                        <CardHeader title={"Thông tin chi tiết SFA"}>
                            <CardHeaderToolbar>
                                <OverlayTrigger
                                    overlay={<Tooltip>Cập nhập</Tooltip>}
                                >

                                    <Link
                                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                        style={{ float: "right" }}
                                        onClick={() => setCheckModal(true)}
                                    >
                                        <span className="svg-icon svg-icon-md svg-icon-primary">
                                            <SVG
                                                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                                            />
                                        </span>
                                    </Link>
                                </OverlayTrigger>


                            </CardHeaderToolbar>
                        </CardHeader>

                        <CardBody style={{ height: '100%' }} >
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-success align-self-stretch" ></span>
                                <label className="col-4 col-form-label">Mã SFA:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {wareHouse?.id}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row my-2">

                                <BarcodeReader
                                    onError={handleError}
                                    onScan={handleScan}
                                />
                                <span className="bullet bullet-bar bg-primary align-self-stretch" ></span>
                                <label className="col-4 col-form-label">Mã Tracking:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {wareHouse?.tracking}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-warning align-self-stretch" ></span>
                                <label className="col-4 col-form-label">Người Nhận:</label>
                                <div className="col-7">
                                    {wareHouse?.receiver_id}
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-dark align-self-stretch" ></span>
                                <label className="col-4 col-form-label">Số Lượng:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {wareHouse?.quantity}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-danger align-self-stretch" ></span>
                                <label className="col-4 col-form-label">Phí Vận Chuyển:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {wareHouse?.shipping_inside}
                                    </span>

                                </div>
                            </div>

                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-info align-self-stretch" ></span>
                                <label className="col-4 col-form-label">Mã Giảm Giá:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {wareHouse?.coupon}
                                    </span>

                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-success align-self-stretch" ></span>
                                <label className="col-4 col-form-label">Đại lý kho:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {agency}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-muted align-self-stretch" ></span>
                                <label className="col-4 col-form-label">Ngày Nhận Hàng:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {wareHouse?.created_at}
                                    </span>
                                </div>
                            </div>
                            
                            
                        </CardBody>
                    </Card>
                    <Card style={{marginBottom:'0'}} >
                        <CardHeader title={"Thêm thùng hàng"}>
                            <CardHeaderToolbar>
                                {/* <OverlayTrigger
                                    overlay={<Tooltip>Cập nhập</Tooltip>}
                                >

                                    <Link
                                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                        style={{ float: "right" }}
                                        onClick={() => setCheckModal(true)}
                                    >
                                        <span className="svg-icon svg-icon-md svg-icon-primary">
                                            <SVG
                                                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                                            />
                                        </span>
                                    </Link>
                                </OverlayTrigger> */}


                            </CardHeaderToolbar>
                        </CardHeader>

                        <CardBody style={{ height: '100%' }} >
                            {/* <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-success align-self-stretch" ></span>
                                <label className="col-3 col-form-label">Mã SFA:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {wareHouse?.id}
                                    </span>
                                </div>
                            </div> */}
                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-primary align-self-stretch" ></span> */}
                                <label className="col-3 col-form-label">Trọng Lượng:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập trọng lượng" onInput={e => setWeightBox(e.target.value)}  />
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-warning align-self-stretch" ></span> */}
                                <label className="col-3 col-form-label">Chiều Dài:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập chiều dài" onInput={e => setLengthBox(e.target.value)} />
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-dark align-self-stretch" ></span> */}
                                <label className="col-3 col-form-label">Chiều Rộng:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập chiều rộng" onInput={e => setWidthBox(e.target.value)} />
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-dark align-self-stretch" ></span> */}
                                <label className="col-3 col-form-label">Chiều Cao:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập chiều rộng" onInput={e => setHeightBox(e.target.value)} onKeyDown={actionEnter}/>
                                    </span>
                                </div>
                            </div>

                            {/* <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-danger align-self-stretch" ></span>
                                <label className="col-3 col-form-label">Số Lượng:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập số lượng" onInput={e => setQuantityBoxs(e.target.value)} />
                                    </span>

                                </div>
                            </div> */}
                            <div>
                            <Link 
                                style={{float:'right'}}
                                onClick={() => {
                                    setTimeout(() => {
                                        createBoxWareHouse(idSFA, weightBox, lengthBox, width, heightBox)
                                            
                                            .then((res) => {
                                                swal("Đã cập thêm thành công!", {
                                                    icon: "success",
                                                }).then(history.push("/admin/warehousedetail/" + ids)).then(setIdBoxs(Math.floor(100000000000 + Math.random() * 900000000000)+1));
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                swal("Thêm không thành công!", {
                                                    icon: "warning",
                                                });
                                            });

                                        // createProductBox(idBox, productId, quantityBox )

                                    })
                                    

                                }}
                                type="button"
                                className="btn btn-primary"
                            ><i className="fa fa-plus"></i>
                                Thêm thùng hàng
                            </Link>

                            </div>

                            {/* <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-info align-self-stretch" ></span>
                                <label className="col-4 col-form-label">Mã Giảm Giá:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {wareHouse?.coupon}
                                    </span>

                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-muted align-self-stretch" ></span>
                                <label className="col-4 col-form-label">Ngày Nhận Hàng:</label>
                                <div className="col-7">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {wareHouse?.created_at}
                                    </span>
                                </div>
                            </div> */}
                        </CardBody>
                    </Card>

                </div>
                <div className="col-8" >
                    <form className="form form-label-right" style={{ height: '100%' }}>
                        <Card style={{ marginBottom: "0", height: '100%' }}>
                            <CardHeader title="Danh sách thùng hàng">
                                <CardHeaderToolbar>
                                    {/* <OverlayTrigger
                                        overlay={<Tooltip>Thêm thùng</Tooltip>}
                                    >

                                        <Link
                                            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                            style={{ float: "right" }}
                                            onClick={() => setCheckModalBox(true)}
                                        >
                                            <span className="svg-icon svg-icon-md svg-icon-primary">
                                                <SVG
                                                    src={toAbsoluteUrl("/media/svg/icons/Files/File-plus.svg")}
                                                />
                                            </span>
                                        </Link>
                                    </OverlayTrigger> */}


                                </CardHeaderToolbar>
                            </CardHeader>
                            <CardBody>
                                <BootstrapTable
                                    wrapperClasses="table-responsive"
                                    classes="table table-head-custom table-vertical-center overflow-hidden"
                                    // remote
                                    // hover
                                    rowStyle={{ cursor: "pointer" }}
                                    bordered={false}
                                    keyField='id'
                                    data={allBox.map(box => ({
                                        ...box,
                                        stt: num++,

                                    }))}
                                    columns={columns}
                                    expandRow={expandRow}
                                    onTableChange={getHandlerTableChange}
                                // rowEvents={rowEvents}
                                // pagination={paginationFactory(options)}
                                />
                            </CardBody>
                        </Card>
                    </form>

                </div>

            </div>


            {/* Modal update SFA*/}
            <Modal
                show={checkModal}
                dialogClassName="w-custome-20"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Cập nhập SFA {idSFA}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Mã S.F.A   </label>
                                <input className="form-control"
                                    type="id"
                                    name="id"
                                    value={idSFA}
                                    />
                            </div>
                        </div>
                        <div class="col" >
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Mã Giảm Gía  </label>
                                <input className="form-control"
                                    type="coupon"
                                    name="coupon"
                                    value={coupon}
                                    onInput={e => setCoupon(e.target.value)}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Mã Tracking  </label>
                                <input className="form-control"
                                    type="tracking"
                                    name="tracking"
                                    value={tracking}
                                    onInput={e => setTracking(e.target.value)}
                                    />
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Phí Vận Chuyển  </label>
                                <input className="form-control"
                                    type="shipping_inside"
                                    name="shipping_inside"
                                    value={shipping}
                                    onInput={e => setShipping(e.target.value)}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Số Lượng </label>
                                <input className="form-control"
                                    type="quantity"
                                    name="quantity"
                                    value={quantity}
                                    onInput={e => setQuantity(e.target.value)}
                                    />
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                            <label for="exampleFormControlInput1">Đại lý kho</label> 
                                <Select
                                    value={agencyList.filter(
                                        (obj) => obj.value === agencys
                                    )}
                                    options={agencyList}
                                    onChange={agencyChange}
                                />
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {
                            setTimeout(() => {
                                updateWareHouse(ids, tracking, quantity, shipping, coupon, idAgency)
                                    .then((res) => {
                                        swal("Đã cập nhật thành công!", {
                                            icon: "success",
                                        }).then(setCheckModal(false)).then(history.push("/admin/warehousedetail/" + ids));;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        swal("Cập nhật không thành công!", {
                                            icon: "warning",
                                        });
                                    });

                            }, 500)

                        }}
                    >
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>






            {/* Modal update quantty product */}
            <Modal
                show={checkModalUpdateQuantity}
                dialogClassName="w-custome-20"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết sản phẩm
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="row">

                        <div class="col">
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Mã Sản Phẩm</label>
                                <input class="form-control" id="exampleFormControlInput1" value={idProductItem} />
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Số Lượng</label>
                                <input class="form-control" id="exampleFormControlInput1" value={quantityProducts} placeholder="Nhập số lượng sản phẩm " onInput={e => setQuantityProducts(e.target.value)} />
                            </div>
                        </div>
                        
                    </div>

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setModalUpdateQuantity(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {
                            updateBoxChild (idItem,idProductItem ,quantityProducts )
                            .then((res) => {
                                swal("Đã cập nhật thành công!", {
                                    icon: "success",
                                }).then(setModalUpdateQuantity(false)).then(history.push("/admin/warehousedetail/" + ids));;
                            })
                            .catch((err) => {
                                console.log(err);
                                swal("Cập nhật không thành công!", {
                                    icon: "warning",
                                });
                            });

                         }
                    }
                    >
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>



            {/* Modal create box of SFA */}
            <Modal
                show={checkModalBoxDuplicate}
                dialogClassName="w-custome-20"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Thêm thùng hàng mới 
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Số Lượng</label>
                                <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập số lượng thùng " onInput={e => setQuantityDuplicate(e.target.value)} />
                            </div>
                        </div>
                        
                    </div>

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalBoxDuplacate(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {
                            duplicateBox(idBoxDuplicate, quantityDuplicate)
                            .then((res) => {
                                swal("Đã cập thêm thành công!", { 
                                    icon: "success",
                                }) 
                                .then(setCheckModalBoxDuplacate(false)).then(history.push("/admin/warehousedetail/" + ids));                                      
                                })
                                .catch((err) => {
                                    console.log(err);
                                    swal("Thêm không thành công!", {
                                        icon: "warning",    
                                        });
                                });    


                            // let promiseCreateBox=[];
                            // let promisecreateBoxChild=[];
                            // let idBoxArr=[];

                            // for (var i = 1; i <= quantityDuplicate; i++) {
                            //     let idBoxS= idBox+ i; 
                            //     idBoxArr.push(idBoxS);
                            //     promiseCreateBox.push(createBoxWH(idBoxS, ids, weight, length, width, height, orderId, palledId, ladingBillId, quantityBox));
                            // }
                            
                            // Promise.all(promiseCreateBox).then(()=>{
                            //     for(var index in promiseCreateBox){
                            //         productList.map(item=> {
                            //             promisecreateBoxChild.push(createBoxChild(idBoxArr[index], item?.product_id, item?.quantity))
                            //             })
                            //     }
                            //     Promise.all(promisecreateBoxChild)
                            // }).then(swal("OK",{icon:"success"})).catch(err=> {console.log(err); swal("!!",{icon:"warning"})})
                            
                            // let promises = [];
                            // for (var i = 1; i <= quantityDuplicate; i++) {
                            //     // setIdBoxQuantity(idBox+ i)
                            //     // console.log(idBoxQuantity)
                            //     let idBoxS= idBox+ i
                            //     console.log(idBoxS)
                            //     let t =createBoxWH(idBoxS, ids, weight, length, width, height, orderId, palledId, ladingBillId, quantityBox)         
                            //         .then((res) => {
                            //             productList.map(item => createBoxChild(idBoxS, item?.product_id, item?.quantity)) 
                            //             swal("Đã cập thêm thành công!", { 
                            //                 icon: "success",
                            //             }) 
                            //             .then(setCheckModalBoxDuplacate(false)).then(setIdBox(Math.floor(100000000000 + Math.random() * 900000000000)+1)).then(history.push("/admin/warehousedetail/" + ids));
                                    
                            //         })
                            //         .catch((err) => {
                            //             console.log(err);
                            //             swal("Thêm không thành công!", {
                            //                 icon: "warning",    
                            //             });
                            //         })   ;    
                            //         promises.push(t);               
                            // }
                            // Promise.all(promises); 
                         }
                    }
                    >
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}