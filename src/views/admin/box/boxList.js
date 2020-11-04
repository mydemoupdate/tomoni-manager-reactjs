import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { createBoxWareHouse,
         getBoxAll, 
         getSFA, 
         getBoxParent, 
         getOrder, 
         getPallet, 
         getLaddingBill, 
         createProductBox,
         createBoxChild,
         updateBoxChild,
         deleteBoxChild 
        } from '../../_redux_/warehouseSlice'
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import paginationFactory from 'react-bootstrap-table2-paginator';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
    Input
} from "../../../_metronic/_partials/controls";
import { InputGroup, OverlayTrigger, Tooltip, Form, FormControl } from "react-bootstrap";
import swal from 'sweetalert';
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { sortCaret, headerSortingClasses } from "../../../_metronic/_helpers/TableSortingHelpers"
import { Button, Modal } from "react-bootstrap";
import { Formik, Field } from "formik";
import { set } from 'object-path';
import * as Yup from "yup";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Select from 'react-select';
import BarcodeReader from 'react-barcode-reader'


export function BoxList() {


    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [typeSearch, setTypeSearch] = useState();
    const [typeProduct, setTypeProduct] = useState("Retail");
    const [params, setParams] = useState("");

    const [boxList, setBoxList] = useState([])
    const { SearchBar } = Search;
    const [totals, setTotals] = useState(0);
    const [perPages, setPerPages] = useState(0);
    let [orderNumerical, setOrderNumerical] = useState(1);
    const [checkModal, setCheckModal] = useState(false);
    const [tracking, setTracking] = useState('');
    const [quantity, setQuantity] = useState('');
    const [coupon, setCoupon] = useState('');
    const [shipping, setShipping] = useState('')
    const [wareHouseList, setWareHouseList] = useState([])





    //modal create Box  of SFA
    const [checkModalBox, setCheckModalBox] = useState(false)
    const [idBox, setIdBox] = useState(Math.floor(100000000000 + Math.random() * 900000000000))
    const [idSFA, setSFA] = useState('')
    const [weight, setWeight] = useState('')
    const [length, setLength] = useState('')
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [palledId, setPalledId] = useState('')
    const [boxParentId, setBoxParentId] = useState('')
    const [orderId, setOrderId] = useState('')
    const [ladingBillId, setLadingBillId] = useState('')

    const [productId, setProductId] = useState('')
    const [quantityBox, setQuantityBox] = useState(1)


    const [SFAList, setSFAList] = useState([])
    const [palletList, setPalletList] = useState([])
    const [boxParentList, setBoxParentList] = useState([])
    const [laddingBillList, setLaddingBillList] = useState([])
    const [orderList, setOrderList] = useState([])
    
    // list products (productId, quantityBox)
    const [arrayProductS, setArrayProduct] = useState([])
    const arrayProduct=[]

    // add product in box
    const [checkFormAddProduct, setCheckFormProduct] = useState('')
    const [idProductInBox, setIdProductInBox] = useState([])
    const [quantityProductInBox, setQuantityProductInBox] = useState([])
    
    const [checkModalUpdateQuantity, setModalUpdateQuantity]= useState(false)
    const [idProductItem, setIdProductItem] = useState('')
    const [quantityProducts, setQuantityProducts] = useState('')
    const [idItem, setIdItem] = useState('')



    

    const history = useHistory();
    const onFindChange = (e) => {
        setTypeSearch(e.target.value);
    }
    const onChangeBoxes = (e) => {

        if (typeSearch) {
            getBoxList('search=' + typeSearch + ":" + e.target.value)

        } else {
            getBoxList('search=' + e.target.value)
        }
    }

    // function deleteModal(object) { // React creates function whenever rendered
    //     swal({
    //         title: "Bạn có muốn xoá nhà cung cấp " + object.id + " ?",
    //         icon: "warning",
    //         dangerMode: true,
    //         buttons: ["Huỷ", "Xoá"],
    //     })
    //         .then((willDelete) => {
    //             if (willDelete) {
    //                 dispatch(deleteProducts(object.id)).then(() => {
    //                     swal("Đã xoá thành công!", {
    //                         icon: "success",
    //                     }).then(history.push("/admin/product"));
    //                     setParams("search=" + typeProduct + "&searchFields=director.type.id&page=1");
    //                     dispatch(getProductsList());

    //                 }).catch((err) => {
    //                     swal("Xoá thất bại !", {
    //                         icon: "warning",
    //                     });
    //                 })
    //             }
    //         });
    // }
    const getHandlerTableChange = (e) => { }
    const dispatch = useDispatch()
    let location = useLocation();

    useEffect(() => {
        getBoxList()
        // getSFA().then(result => setSFA(result.data))
        // getWareHouseList()







    }, [location]);

    function getBoxList(object) {
        dispatch(getBoxAll(object)).then(res => {
            const _data = res.data || {};
            setPerPages(_data.per_page);
            setTotals(_data.total);
            setBoxList(_data.data);

            // dispatch(getSFA()).then(res => {
            //     const _data = res.data.data || [];

            //     const pageLast = res.data.last_page;

            //     if (pageLast > 1) {
            //         var arrDataList = [];
            //         arrDataList = arrDataList.concat(_data);
            //         for (var i = 2; i <= pageLast; i++) {
            //             dispatch(getSFA(i)).then((respon) => {
            //                 var arrData = respon.data.data || [];

            //                 arrDataList = arrDataList.concat(arrData);
            //                 // console.log(i, pageLast);
            //                 if (i > pageLast) {
            //                     // console.log(arrDataList);
            //                     var result = [];
            //                     for (var j = 0; j < arrDataList.length; j++) {
            //                         result.push({
            //                             value: arrDataList[j].id,
            //                             label: arrDataList[j].id,
            //                         });
            //                     }
            //                     // console.log(result);
            //                     setSFAList(result);

            //                 }
            //             });
            //         }
            //     } else {

            //         var result = [];
            //         for (var i = 0; i < _data.length; i++) {
            //             result.push({
            //                 value: _data[i].id,
            //                 label: _data[i].id,
            //             });
            //         }
            //         setSFAList(result);

            //     }
            // })



            // dispatch(getPallet()).then(res => {
            //     const _data = res.data.data || [];

            //     const pageLast = res.data.last_page;

            //     if (pageLast > 1) {
            //         var arrDataList = [];
            //         arrDataList = arrDataList.concat(_data);
            //         for (var i = 2; i <= pageLast; i++) {
            //             dispatch(getPallet(i)).then((respon) => {
            //                 var arrData = respon.data.data || [];

            //                 arrDataList = arrDataList.concat(arrData);
            //                 // console.log(i, pageLast);
            //                 if (i > pageLast) {
            //                     // console.log(arrDataList);
            //                     var result = [];
            //                     for (var j = 0; j < arrDataList.length; j++) {
            //                         result.push({
            //                             value: arrDataList[j].id,
            //                             label: arrDataList[j].id,
            //                         });
            //                     }
            //                     // console.log(result);
            //                     setPalletList(result);

            //                 }
            //             });
            //         }
            //     } else {

            //         var result = [];
            //         for (var i = 0; i < _data.length; i++) {
            //             result.push({
            //                 value: _data[i].id,
            //                 label: _data[i].id,
            //             });
            //         }
            //         setPalletList(result);

            //     }
            // })


            // getBoxParent().then((res) => {
            //     const _data = res.data || [];
            //     var result = [];
            //     for (var i = 0; i < _data.length; i++) {
            //         result.push({
            //             value: _data[i].box_id,
            //             label: _data[i].box_id,
            //         });
            //     }
            //     setBoxParentList(result);
            // });



            // dispatch(getLaddingBill()).then(res => {
            //     const _data = res.data.data || [];

            //     const pageLast = res.data.last_page;

            //     if (pageLast > 1) {
            //         var arrDataList = [];
            //         arrDataList = arrDataList.concat(_data);
            //         for (var i = 2; i <= pageLast; i++) {
            //             dispatch(getLaddingBill(i)).then((respon) => {
            //                 var arrData = respon.data.data || [];

            //                 arrDataList = arrDataList.concat(arrData);
            //                 // console.log(i, pageLast);
            //                 if (i > pageLast) {
            //                     // console.log(arrDataList);
            //                     var result = [];
            //                     for (var j = 0; j < arrDataList.length; j++) {
            //                         result.push({
            //                             value: arrDataList[j].id,
            //                             label: arrDataList[j].id,
            //                         });
            //                     }
            //                     // console.log(result);
            //                     setLaddingBillList(result);

            //                 }
            //             });
            //         }
            //     } else {

            //         var result = [];
            //         for (var i = 0; i < _data.length; i++) {
            //             result.push({
            //                 value: _data[i].id,
            //                 label: _data[i].id,
            //             });
            //         }
            //         setLaddingBillList(result);

            //     }
            // })

            // dispatch(getOrder()).then(res => {
            //     const _data = res.data.data || [];

            //     const pageLast = res.data.last_page;

            //     if (pageLast > 1) {
            //         var arrDataList = [];
            //         arrDataList = arrDataList.concat(_data);
            //         for (var i = 2; i <= pageLast; i++) {
            //             dispatch(getOrder(i)).then((respon) => {
            //                 var arrData = respon.data.data || [];

            //                 arrDataList = arrDataList.concat(arrData);
            //                 // console.log(i, pageLast);
            //                 if (i > pageLast) {
            //                     // console.log(arrDataList);
            //                     var result = [];
            //                     for (var j = 0; j < arrDataList.length; j++) {
            //                         result.push({
            //                             value: arrDataList[j].id,
            //                             label: arrDataList[j].id,
            //                         });
            //                     }
            //                     // console.log(result);
            //                     setOrderList(result);

            //                 }
            //             });
            //         }
            //     } else {

            //         var result = [];
            //         for (var i = 0; i < _data.length; i++) {
            //             result.push({
            //                 value: _data[i].id,
            //                 label: _data[i].id,
            //             });
            //         }
            //         setOrderList(result);

            //     }
            // })





        })
    }

    // function getWareHouseList(object) {
    //     dispatch(getWareHouseAll(object)).then(res => {
    //         const _data = res.data || {};
    //         setPerPages(_data.per_page);
    //         setTotals(_data.total);
    //         setWareHouseList(_data.data);

    //     })
    // }

    const { currentState } = useSelector(
        (state) => ({ currentState: state.products }),
        shallowEqual
    );
    const arrayIndex = []
    let num = 1;

    const { totalCount, entities, perPage } = currentState;

    const columnsBox = [
        {
            dataField: "stt",
            text: "Số thứ tự",
            sort: true,

        },
        {
            dataField: "id",
            text: "Mã SKU",
            sort: true,
            style: {
                fontWeight: "bold"
            },
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "sfa_id",
            text: "Mã SFA",
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
            // sortCaret: sortCaret,
            // headerSortingClasses,
            // onSort: (field, warehouse) => {
            //     getBoxList(`orderBy=quantity&sortedBy=${warehouse}`)
            // },
            style: {
                fontWeight: "500"
            }
        },

        {
            dataField: "weight",
            text: "Trọng Lượng",
            sort: true,
            style: {
                fontWeight: "500"
            },

        },
        {
            dataField: "volume",
            text: "Thể Tích",
            sort: true,
            style: {
                fontWeight: "500"
            },

        },
        {
            dataField: "order_id",
            text: "Mã Đơn Hàng",
            sort: true,
            style: {
                fontWeight: "500"
            },

        },
        {
            dataField: "lading_bill_id",
            text: "Mã Vận Đơn",
            sort: true,
            style: {
                fontWeight: "500"
            },

        },
        {
            dataField: "created_at",
            text: "Ngày nhận hàng",
            sort: true,
            style: {
                fontWeight: "500"
            },
            formatter: statusFormatter
        },
    ]
    const columnsProduct = [
        {
            dataField: "stt",
            text: "Số thứ tự",
            sort: true,

        },
        {
            dataField: "id",
            text: "Mã Sản Phẩm",
            sort: true,

        },
        {
            dataField: "quantity",
            text: "Số Lượng",
            sort: true,
        },
        // {
        //     dataField: "action",
        //     text: "Actions",
        //     classes: "text-right pr-0",
        //     headerClasses: "text-right pr-3",
        //     formatter: rankFormatter,
        //     style: {
        //         minWidth: "100px",
              
        //     }
        // },

    ]
    function createData(id, quantity) {
        return { id, quantity};
    }
    let rows =[
        createData(productId, quantityBox),
    ]
    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
    function rankFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <>
                </>
                <OverlayTrigger
                    overlay={<Tooltip>Xoá Sản Phẩm </Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => {
                            var array = arrayProductS.indexOf(row.stt);
                            var index = arrayProductS.indexOf(row.stt);
                            console.log('index', arrayProductS.indexOf(row.id))
                            console.log('arr2',arrayProductS)
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



    function statusFormatter(name) {
        return (
            <>
                {
                    name === 'Box' ?
                        <span className="badge badge-pill badge-success">
                            {name}
                        </span> :
                        <span className="badge badge-pill badge-primary">
                            {name}
                        </span>

                }
            </>
        )
    }

    const onSFAChange = (e) => {
        setSFA(e.value)


    }
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


    const options = {
        hideSizePerPage: true,
        sizePerPage: perPages,
        totalSize: totals,
        onPageChange: (page, sizePerPage) => {
            getBoxList('page=' + page)
            setOrderNumerical(15 * (page - 1) + 1)
        },
    };


    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            history.push('/admin/boxdetail/' + row.id);
            // console.log(row)
        }
    };

    const handleScan = (data) => {
        setSFA(data)
    }
    const handleError = (err) => {
        console.log(err)
        swal("Vui lòng thử lại!", {
            icon: "warning",
        });
    }
    function handleEnter(event) {
        if (event.keyCode === 13) {
          const form = event.target.form;
          const index = Array.prototype.indexOf.call(form, event.target);
          form.elements[index + 1].focus();
          event.preventDefault();
        }
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
                            <th className="border-top-0" width="40%" >
                                {/* <i className="ki ki-plus" style={{ cursor: 'pointer' }}  onClick={() => setCheckFormProduct(row.id)} ></i> */}
                                <OverlayTrigger
                                    overlay={<Tooltip>Thêm sản phẩm vào thùng </Tooltip>}
                                >
                                    <i className="ki ki-plus" style={{ cursor: 'pointer' }}  onClick={() => setCheckFormProduct(row.id)} ></i> 
                                </OverlayTrigger>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            checkFormAddProduct == row.id ?
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
                                                    }).then(history.push("/admin/box"));;
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    swal("Thêm không thành công!", {
                                                        icon: "warning",
                                                    });
                                                });
                                                setCheckFormProduct(false)
                                            }}
                                            >Lưu
                                            
                                        </button>
                                        <button type="button"
                                            className="btn btn-danger btn-sm" onClick={() => setCheckFormProduct(false)}>Huỷ
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
                                                                }).then(history.push("/admin/box"));
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
    
    function actionEnter(event) {
        if (event.key == 'Enter') {
            // arrayProduct.push({id:productId, quantity: quantityBox})
            // setTrackList([...trackList, { code: code, expected_delivery: expected_delivery }]);
            setArrayProduct([...arrayProductS,{id:productId, quantity: quantityBox} ])
        }
    }
    // console.log('arr2',arrayProductS)

    return (
        <div>
            <form className="form form-label-right">
                <Card style={{ marginBottom: "0" }}>
                    <CardHeader title="Tạo thùng hàng">
                        <CardHeaderToolbar>
                            <Link
                                onClick={() => {
                                    setTimeout(() => {
                                        createBoxWareHouse( idSFA, weight, length, width, height)

                                            .then((res) => {
                                                swal("Đã cập thêm thành công!", {
                                                    icon: "success",
                                                }).then(setCheckModalBox(false)).then(setIdBox(Math.floor(100000000000 + Math.random() * 900000000000)+1)).then(history.push("/admin/box"));
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                swal("Thêm không thành công!", {
                                                    icon: "warning",
                                                });
                                            });

                                        // createProductBox(idBox, productId, quantityBox)

                                    })


                                }}
                                type="button"
                                className="btn btn-primary"
                            ><i className="fa fa-plus"></i>
                                Tạo thùng hàng mới
                            </Link>

                        </CardHeaderToolbar>
                    </CardHeader>
                    <CardBody>
                        <div className="row">
                            <div className="col-6">
                                <div className="row">
                                    <div class="col">
                                        <BarcodeReader
                                            onError={handleError}
                                            onScan={handleScan}
                                        />
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1" style={{ fontSize: '2rem' }}>Mã S.F.A</label>
                                            <input class="form-control" style={{ fontSize: '2rem' }} placeholder="Nhập mã SFA" onInput={e => setSFA(e.target.value)} value={idSFA} onKeyDown={handleEnter} />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1" style={{ fontSize: '2rem' }}>Chiều Rộng  </label>
                                            <input class="form-control" style={{ fontSize: '2rem' }} id="exampleFormControlInput1" placeholder="Nhập chiều rộng" onInput={e => setWidth(e.target.value)} onKeyDown={handleEnter}  />
                                        </div>
                                    </div>
                                    

                                </div>
                                <div className='row'>
                                    <div class="col">
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1" style={{ fontSize: '2rem' }}>Chiều Cao</label>
                                            <input class="form-control" style={{ fontSize: '2rem' }} id="exampleFormControlInput1" placeholder="Nhập chiều cao" onInput={e => setHeight(e.target.value)} onKeyDown={handleEnter} />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1" style={{ fontSize: '2rem' }}>Chiều Dài  </label>
                                            <input class="form-control" style={{ fontSize: '2rem' }} id="exampleFormControlInput1" placeholder="Nhập chiều dài" onInput={e => setLength(e.target.value)} onKeyDown={handleEnter} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">

                                    
                                    <div class="col">
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1" style={{ fontSize: '2rem' }}>Trọng Lượng</label>
                                            <input class="form-control" style={{ fontSize: '2rem' }} id="exampleFormControlInput1" placeholder="Nhập trọng lượng" onInput={e => setWeight(e.target.value)} onKeyDown={handleEnter} />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1" style={{ fontSize: '2rem' }}>Mã Sản Phẩm</label>
                                            <input class="form-control" style={{ fontSize: '2rem' }} id="exampleFormControlInput1" placeholder="Nhập mã sản phẩm" onInput={e => setProductId(e.target.value)} onKeyDown={handleEnter} />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label for="exampleFormControlInput1" style={{ fontSize: '2rem' }}>Số Lượng</label>
                                            <input class="form-control" style={{ fontSize: '2rem' }} id="exampleFormControlInput1" placeholder="Nhập số lượng sản phẩm" onInput={e => setQuantityBox(e.target.value)} onKeyPress={actionEnter} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-6">
                                <BootstrapTable
                                    wrapperClasses="table-responsive "
                                    classes="table table-head-custom table-vertical-center overflow-hidden"
                                    // remote
                                    // hover
                                    rowStyle={{ cursor: "pointer" }}
                                    bordered={false}
                                    keyField='id'
                                    data={arrayProductS === null ? [] : arrayProductS?.map(supp => ({
                                        ...supp,
                                        stt: orderNumerical++,

                                    }))}
                                    columns={columnsProduct}
                                    onTableChange={getHandlerTableChange}
                                    // rowEvents={rowEvents}
                                    // pagination={paginationFactory(options)}
                                />
                            </div>

                        </div>

                    </CardBody>
                </Card>

            </form>

                    <form className="form form-label-right" style={{ marginTop: '1%' }}>
                        <Card style={{ marginBottom: "0" }}>
                            <CardHeader title="Danh sách thùng hàng">
                                <CardHeaderToolbar>
                                    {/* <Link
                                onClick={() => setCheckModalBox(true)}
                                type="button"
                                className="btn btn-primary"
                            ><i className="fa fa-plus"></i>
                                Tạo thùng hàng mới
                            </Link> */}

                                </CardHeaderToolbar>
                            </CardHeader>
                            <CardBody>
                                <div className="row">
                                    <div className="col-2 pl-0">

                                        <Form.Control as="select" onChange={onFindChange} >
                                            <option value=''>Tất cả</option>
                                            <option value='id'>Mã SKU</option>
                                            <option value='sfa_id'>Mã SFA</option>
                                            {/* <option value='quantity'>Số lượng</option>
                                            <option value='weight'>Trọng lượng</option>
                                            <option value='volume'>Thể tích</option> */}
                                            <option value='order_id'>Mã đơn hàng</option>
                                            <option value='lading_bill_id'>Mã vận đơn</option>
                                        </Form.Control>
                                    </div>
                                    <div className="col-9 pr-0" style={{ marginLeft: "-1%" }}>
                                        <FormControl
                                            placeholder="Nội dung tìm kiếm"
                                            onChange={onChangeBoxes}
                                        />
                                    </div>

                                </div>
                                <BootstrapTable
                                    wrapperClasses="table-responsive "
                                    classes="table table-head-custom table-vertical-center overflow-hidden"
                                    remote
                                    // hover
                                    rowStyle={{ cursor: "pointer" }}
                                    bordered={false}
                                    keyField='id'
                                    data={boxList.map(box => ({
                                        ...box,
                                        stt: orderNumerical++,

                                    }))}
                                    expandRow={expandRow}
                                    columns={columnsBox}
                                    onTableChange={getHandlerTableChange}
                                    rowEvents={rowEvents}
                                    pagination={paginationFactory(options)}
                                />
                            </CardBody>
                        </Card>

                    </form>





                    {/* <Modal>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Thêm thùng hàng mới
                    </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="overlay overlay-block cursor-default">

                        <div className="row">

                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">Mã thùng</label>
                                    <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập mã thùng" onInput={e => setIdBox(e.target.value)} />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">Mã S.F.A </label>

                                    {/* <Autocomplete
                                        options={SFAList}
                                        autoHighlight
                                        onChange={onSFAChange}
                                        getOptionLabel={(option) => option.id}
                                        renderOption={(option) => (
                                            <React.Fragment>
                                               {option.id}
                                            </React.Fragment>
                                        )}
                                        renderInput={(params) => (
                                            <TextField {...params} variant="outlined" />
                                        )}
                                    /> */}

                    {/* <Select
                                        // value={SFAList.map(x => x?.id)}
                                        options={SFAList}
                                        onChange={onSFAChange}
                                        placeholder="Chọn mã SFA"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">Trọng Lượng </label>
                                    <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập trọng lượng" onInput={e => setWeight(e.target.value)} />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">Chiều Dài</label>
                                    <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập chiều dài" onInput={e => setLength(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">Chiều Rộng</label>
                                    <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập chiều rộng" onInput={e => setWidth(e.target.value)} />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">Chiều Cao</label>
                                    <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập chiều cao" onInput={e => setHeight(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">Mã Pallet</label>
                                    <Select
                                        // value={SFAList.map(x => x?.id)}
                                        options={palletList}
                                        onChange={onPalletChange}
                                        placeholder="Chọn mã pallet"
                                    />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">Thùng Chứa</label>
                                    <Select
                                        // value={SFAList.map(x => x?.id)}
                                        options={boxParentList}
                                        onChange={onBoxParentChange}
                                        placeholder="Chọn mã thùng chứa"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">Mã Đơn Hàng</label>
                                    <Select
                                        // value={SFAList.map(x => x?.id)}
                                        options={orderList}
                                        onChange={onOrderChange}
                                        placeholder="Chọn mã đơn hàng"
                                    />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">Mã Vận Đơn</label>
                                    <Select
                                        // value={SFAList.map(x => x?.id)}
                                        options={laddingBillList}
                                        onChange={onLaddingBillChange}
                                        placeholder="Chọn mã vận đơn"
                                    />
                                </div>
                            </div>
                        </div>


                    </Modal.Body>
                    <Modal.Footer >
                        <Button variant="secondary" onClick={() => setCheckModalBox(false)}>
                            Đóng
                    </Button>
                        <Button variant="primary"
                            onClick={() => {
                                setTimeout(() => {
                                    createBoxWareHouse(idBox, idSFA, weight, length, width, height)
                                        .then((res) => {
                                            swal("Đã cập thêm thành công!", {
                                                icon: "success",
                                            }).then(setCheckModalBox(false)).then(history.push("/admin/box"));
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            swal("Thêm không thành công!", {
                                                icon: "warning",
                                            });
                                        });

                                }, 200)

                            }}
                        >
                            Lưu
                    </Button>
                    </Modal.Footer> */}
                    {/* </Modal> */}



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
                                }).then(setModalUpdateQuantity(false)).then(history.push("/admin/box"));;
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




        </div>




    );
}


