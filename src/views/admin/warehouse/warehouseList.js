import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getWareHouseAll, createWareHouse } from '../../_redux_/warehouseSlice'
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
import BarcodeReader from 'react-barcode-reader'

const ProductSchema = Yup.object().shape({
    id: Yup.string()
        .min(1, "Vui lòng nhập id hợp lệ")
        .max(2000000000000, "Vui lòng nhập id hợp lệ")
        .required("Vui lòng nhập id "),
    tracking: Yup.number()
        .min(5, "Vui mã tracking")
        .max(100000000000, "Nhập mã tracking")
        .required("Nhập mã tracking"),
    // origin_id:Yup.string(),
    // supplier_id:Yup.string() ,
    // unit_id:Yup.string()

    quantity: Yup.string()
        .min(1, "Vui lòng nhập số lượng")
        .max(13, "Vui lòng nhập số lượng")
        .required("Vui lòng nhập số lượng"),
    // locale: Yup.string()
    //     .min(1, "Vui lòng nhập locale hợp lệ")
    //     .max(20, "Vui lòng nhập locale hợp lệ")
    //     .required("Vui lòng nhập locale"),
    shipping_inside: Yup.number()
        .min(1, "Vui lòng nhập phí vận chuyển")
        .max(2000000000000, "Vui lòng nhập phí vận chuyển")
        .required("Vui lòng nhập thành phần cho sản phẩm"),
    // tax_id:Yup.string(),
    coupon: Yup.string()
        .min(1, "Vui lòng nhập mã giảm giá")
        .required("Vui lòng nhập mã giảm giá")

});

export function WarehouseList() {

    const [typeSearch, setTypeSearch] = useState();
    const [typeProduct, setTypeProduct] = useState("Retail");
    const [params, setParams] = useState("");

    const [wareHouseList, setWareHouseList] = useState([])
    const { SearchBar } = Search;
    const [totals, setTotals] = useState(0);
    const [perPages, setPerPages] = useState(0);
    let [orderNumerical, setOrderNumerical] = useState(1);
    const [checkModal, setCheckModal] = useState(false);
    const [idSFA, setIdSFA] = useState('');
    const [tracking, setTracking] = useState('');
    const [quantity, setQuantity] = useState('');
    const [coupon, setCoupon] = useState('');
    const [shipping, setShipping] = useState('')
    const [trackingBarcode, setTrackingBarcode] = useState('')

    const history = useHistory();
    const onFindChange = (e) => {
        setTypeSearch(e.target.value);
    }
    const onChangeWareHouse = (e) => {

        if (typeSearch) {
            getWareHouseList('search=' + typeSearch + ":" + e.target.value)

        } else {
            getWareHouseList('search=' + e.target.value)
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
        getWareHouseList()
        setParams("search=" + typeProduct + "&searchFields=director.type.id&page=1");


    }, [location]);
    const { currentState } = useSelector(
        (state) => ({ currentState: state.products }),
        shallowEqual
    );
    const arrayIndex = []
    let num = 1;

    const { totalCount, entities, perPage } = currentState;
    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            history.push('/admin/warehousedetail/' + row.id);
            // console.log(row?.agency?.name)
        }
    };
    const columns = [
        {
            dataField: "stt",
            text: "Số thứ tự",
            sort: true,

        },
        {
            dataField: "id",
            text: "Mã SFA",
            sort: true,
            style: {
                fontWeight: "bold"
            },
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "tracking",
            text: "Mã Tracking",
            sort: true,
        },
        {
            dataField: "quantity",
            text: "Số Lượng",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            onSort: (field, warehouse) => {
                getWareHouseList(`orderBy=quantity&sortedBy=${warehouse}`)
            },
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "shipping_inside",
            text: "Phí vận chuyển",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            onSort: (field, warehouse) => {
                getWareHouseList(`orderBy=shipping_inside&sortedBy=${warehouse}`)
            },
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "coupon",
            text: "Mã giảm giá ",
            sort: true,
            style: {
                fontWeight: "500"
            },

        },
        {
            dataField: "receiver_id",
            text: "Người nhận ",
            sort: true,
            style: {
                fontWeight: "500"
            },

        },
        {
            dataField: "agency_name",
            text: "Đại lý kho",
            sort: true,
            formatter: agencyFormatter

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
    function agencyFormatter(cell, row) {
        return (
          <>
            <div className="font-weight-bolder" style={{fontSize:'15px'}}>{row?.agency?.name}</div>
            <div>
              Địa chỉ: <span style={{ marginLeft: '1%' }}>{row?.agency?.address}</span>
            </div>
            <div>
              SDT: <span  style={{ marginLeft: '1%' }}>{row?.agency?.tel}</span>{" "}
            </div>
            {/* <div>
              Tổng tiền: <span className="text-primary" style={{ fontSize: '15px' }}>{row.balance}</span>{" "}
            </div> */}
          </>
        );
      }


    function getWareHouseList(object) {
        dispatch(getWareHouseAll(object)).then(res => {
            const _data = res.data || {};
            setPerPages(_data.per_page);
            setTotals(_data.total);
            setWareHouseList(_data.data);

        })
    }



    const options = {
        hideSizePerPage: true,
        sizePerPage: perPages,
        totalSize: totals,
        onPageChange: (page, sizePerPage) => {
            getWareHouseList('page=' + page)
            setOrderNumerical(15 * (page - 1) + 1)
        },
    };

    const checkValidation = () => {
        if (tracking.length <= 5) {
            swal("Mã checking lớn hơn 5 ký tự", {
                icon: "warning"
            })
            return;
        }
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
            createWareHouse(tracking, quantity, shipping, coupon)
                .then((res) => {
                    swal("Đã cập nhật thành công!", {
                        icon: "success",
                    }).then(history.push("/admin/warehouse"));;
                })
                .catch((err) => {
                    console.log(err);
                    swal("Cập nhật không thành công!", {
                        icon: "warning",
                    });
                });
        }
    }
    return (
        <div>


            <form className="form form-label-right">
                <Card >
                    <CardHeader title="Tạo SFA">
                        <CardHeaderToolbar>
                            <Link
                                onClick={() => {

                                    createWareHouse(tracking, quantity, shipping, coupon)
                                        .then((res) => {
                                            swal("Đã cập nhật thành công!", {
                                                icon: "success",
                                            }).then(history.push("/admin/warehouse"));;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            swal("Cập nhật không thành công!", {
                                                icon: "warning",
                                            });
                                        });
                                }}
                                type="button"
                                className="btn btn-primary"
                            ><i className="fa fa-plus"></i>
                                Tạo SFA
                                        </Link>
                        </CardHeaderToolbar>

                    </CardHeader>
                    <CardBody>

                        <div style={{ display: 'flex' }}>
                            <div className="form-group row">
                                <label className="col-10 col-form-label" style={{ fontSize: '2rem' }}>Số Lượng </label>
                                <div className="col-12" style={{ fontSize: '3rem' }} >
                                    <input className="form-control"
                                        style={{ fontSize: '3rem' }}
                                        placeholder="Nhập số lượng"
                                        onInput={e => setQuantity(e.target.value)}
                                        onKeyDown={handleEnter}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '2%' }}>
                                <label className="col-10 col-form-label" style={{ fontSize: '2rem' }}>Mã Giảm Giá  </label>
                                <div className="col-12" style={{ fontSize: '3rem' }}>
                                    <input className="form-control"
                                        style={{ fontSize: '3rem' }}
                                        placeholder="Nhập mã giảm giá"
                                        onInput={e => setCoupon(e.target.value)}
                                        onKeyDown={handleEnter}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '2%' }}>
                                <BarcodeReader
                                    onError={handleError}
                                    onScan={handleScan}
                                />
                                <label className="col-10 col-form-label" style={{ fontSize: '2rem' }}> Mã Tracking </label>
                                <div className="col-12" style={{ fontSize: '3rem' }}>
                                    <input className="form-control"
                                        style={{ fontSize: '3rem' }}
                                        placeholder="Nhập mã tracking"
                                        onInput={e => setTracking(e.target.value)}
                                        value={tracking}
                                        onKeyDown={handleEnter}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '2%' }}>
                                <label className="col-10 col-form-label" style={{ fontSize: '2rem' }}> Phí Vận Chuyển </label>
                                <div className="col-12" style={{ fontSize: '3rem' }}>
                                    <input className="form-control"
                                        style={{ fontSize: '3rem' }}
                                        placeholder="Nhập phí vận chuyển"
                                        onInput={e => setShipping(e.target.value)}
                                        onKeyPress={actionEnter}
                                    />
                                </div>
                            </div>
                            {/* <div className="form-group row" style={{ marginLeft: '2%', marginTop: '1rem' }}>
                                <label className="col-10 col-form-label"></label>
                                <div className="col-12">
                                   
                                </div>

                            </div> */}

                        </div>

                    </CardBody>
                </Card>

            </form>
            <form className="form form-label-right">
                <Card style={{ marginBottom: "0" }}>
                    <CardHeader title="Danh sách SFA">
                        {/* <CardHeaderToolbar>
                            <Link
                                onClick={() => setCheckModal(true)}
                                type="button"
                                className="btn btn-primary"
                            ><i className="fa fa-plus"></i>
                                Tạo SFA
                            </Link>

                        </CardHeaderToolbar> */}
                    </CardHeader>
                    <CardBody>
                        {/* <div style={{ display: 'flex' }}>
                            <div className="form-group row">
                                <label className="col-10 col-form-label">Số Lượng </label>
                                <div className="col-12">
                                    <input className="form-control"
                                        placeholder="Nhập số lượng"
                                        onInput={e => setQuantity(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '2%' }}>
                                <label className="col-10 col-form-label">Mã Giảm Gía  </label>
                                <div className="col-12">
                                    <input className="form-control"
                                        placeholder="Nhập mã giảm giá"
                                        onInput={e => setCoupon(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '2%' }}>
                                <BarcodeReader
                                    onError={handleError}
                                    onScan={handleScan}
                                />
                                <label className="col-10 col-form-label"> Mã Tracking </label>
                                <div className="col-12">
                                    <input className="form-control"
                                        placeholder="Nhập mã tracking"
                                        onInput={e => setTracking(e.target.value)}
                                        value={tracking}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '2%' }}>
                                <label className="col-10 col-form-label"> Phí Vận Chuyển </label>
                                <div className="col-12">
                                    <input className="form-control"
                                        placeholder="Nhập phí vận chuyển"
                                        onInput={e => setShipping(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div> */}
                        <div className="row">
                            <div className="col-2 pl-0">
                                <Form.Control as="select" onChange={onFindChange} >
                                    <option value=''>Tất cả</option>
                                    <option value='id'>Mã SFA</option>
                                    <option value='tracking'>Mã tracking</option>
                                    <option value='quantity'>Số lượng</option>
                                    <option value='shipping_inside'>Phí vận chuyển</option>
                                    <option value='receiver_id'>Người nhận</option>
                                    {/* <option value='created_at'>Ngày nhận hàng</option> */}
                                </Form.Control>
                            </div>
                            <div className="col-9 pr-0" style={{ marginLeft: "-1%" }}>
                                <FormControl
                                    placeholder="Nội dung tìm kiếm"
                                    onChange={onChangeWareHouse}
                                />
                            </div>

                        </div>
                        <BootstrapTable
                            wrapperClasses="table-responsive table-hover"
                            classes="table table-head-custom table-vertical-center overflow-hidden"
                            remote
                            // hover
                            rowStyle={{ cursor: "pointer" }}
                            bordered={false}
                            keyField='id'
                            data={wareHouseList.map(warehouse => ({
                                ...warehouse,
                                stt: orderNumerical++,
                                agency_name: warehouse?.agency?.name

                            }))}
                            columns={columns}
                            onTableChange={getHandlerTableChange}
                            rowEvents={rowEvents}
                            pagination={paginationFactory(options)}
                        />
                    </CardBody>
                </Card>

            </form>




            <Modal
                show={checkModal}
                dialogClassName="w-custome-20"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Tạo SFA mới
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div style={{ display: 'flex' }}>
                        <div className="form-group row">
                            <label className="col-10 col-form-label">Số Lượng </label>
                            <div className="col-12">
                                <input className="form-control"
                                    placeholder="Nhập số lượng"
                                    onInput={e => setQuantity(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginLeft: '2%' }}>
                            <label className="col-10 col-form-label">Mã Giảm Gía  </label>
                            <div className="col-12">
                                <input className="form-control"
                                    placeholder="Nhập mã giảm giá"
                                    onInput={e => setCoupon(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className="form-group row">
                            <label className="col-10 col-form-label"> Mã Tracking </label>
                            <div className="col-12">
                                <input className="form-control"
                                    placeholder="Nhập mã tracking"
                                    onInput={e => setTracking(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginLeft: '2%' }}>
                            <label className="col-10 col-form-label"> Phí Vận Chuyển </label>
                            <div className="col-12">
                                <input className="form-control"
                                    placeholder="Nhập phí vận chuyển"
                                    onInput={e => setShipping(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>

                        {/* <div className="form-group row" style={{ marginLeft: '2%' }}>
                            <label className="col-10 col-form-label">Số lượng</label>
                            <div className="col-12">
                                <input className="form-control"

                                />
                            </div>
                        </div> */}
                    </div>

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {

                            createWareHouse(tracking, quantity, shipping, coupon)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModal(false)).then(history.push("/admin/warehouse"));;
                                })
                                .catch((err) => {
                                    console.log(err);
                                    swal("Cập nhật không thành công!", {
                                        icon: "warning",
                                    });
                                });
                        }}
                    >
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>



    );
}


