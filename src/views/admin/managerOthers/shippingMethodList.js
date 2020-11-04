import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import "../../../assets/css/wizard.wizard-4.css"
import '../../../assets/css/style-main.css'
import swal from 'sweetalert';
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { getShippingMethod, createShippingMethod, updateShippingMethod, deleteShippingMethod } from '../../_redux_/warehouseSlice';
import { useDispatch } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import { Button, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";





export function ShippingMethodList() {

    const history = useHistory();
    let location = useLocation();
    let num = 1;

    const [shippingMethodList, setShippingMethod] = useState([])
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [fee, setFee] = useState('')

    //update shipping method
    const [checkModal, setCheckModal] = useState(false)
    const [idUpdate, setIdUpdate] = useState('')
    const [nameUpdate, setNameUpdate] = useState('')
    const [feeUpdate, setFeeUpdate] = useState('')



    const getHandlerTableChange = (e) => { }

    useEffect(() => {
        getShippingMethod().then(result => setShippingMethod(result.data))

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
            style: {
                minWidth: "100px",
                width:'10%'
            }

        },
        {
            dataField: "name",
            text: "Tên",
            sort: true,
            style: {
                fontWeight: "bold"
            },
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "fee",
            text: "Phí",
            sort: true,
        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: rankFormatter,
            style: {
                minWidth: "100px",
                width: '20%'
            }
        },
    ]

    function rankFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Chi tiết</Tooltip>}
                >
                    <Link
                        onClick={() => {
                            setCheckModal(true)
                            setIdUpdate(row.id)
                            setNameUpdate(row.name)
                            setFeeUpdate(row.fee)
                        }}
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

                <>
                </>
                <OverlayTrigger
                    overlay={<Tooltip>Xoá đại lý kho </Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => {
                            swal({
                                title: "Bạn có muốn xoá phương thức " + row.name + " ?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["Huỷ", "Xoá"],
                            })
                                .then((willDelete) => {
                                    if (willDelete) {
                                        deleteShippingMethod(row.id).then(() => {
                                            swal("Đã xoá thành công!", {
                                                icon: "success",
                                            }).then(history.push("/admin/shipmentmethod"));
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


    return (
        <div>
            <div className='row' style={{ marginTop: '1%' }}>
                <div className="col-3">
                    <Card style={{ marginBottom: '0' }} >
                        <CardHeader title={"Thêm phương thức vận chuyển"}>
                            <CardHeaderToolbar>

                            </CardHeaderToolbar>
                        </CardHeader>

                        <CardBody style={{ height: '100%' }} >

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-primary align-self-stretch" ></span> */}
                                <label className="col-4 col-form-label">Mã phương thức :</label>
                                <div className="col-8">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập mã phương thức" onInput={e => setId(e.target.value)} />
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-warning align-self-stretch" ></span> */}
                                <label className="col-4 col-form-label">Tên phương thức:</label>
                                <div className="col-8">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập tên phương thức" onInput={e => setName(e.target.value)} />
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-dark align-self-stretch" ></span> */}
                                <label className="col-4 col-form-label">Phí:</label>
                                <div className="col-8">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập phí" onInput={e => setFee(e.target.value)} />
                                    </span>
                                </div>
                            </div>
                            <div>
                                <Link
                                    style={{ float: 'right' }}
                                    onClick={() => {
                                        setTimeout(() => {
                                            createShippingMethod(id, name, fee)

                                                .then((res) => {
                                                    swal("Đã thêm thành công!", {
                                                        icon: "success",
                                                    }).then(history.push("/admin/shipmentmethod"));
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
                                    Lưu
                                </Link>
                            </div>
                        </CardBody>
                    </Card>

                </div>
                <div className="col-9" >
                    <form className="form form-label-right" style={{ height: '100%' }}>
                        <Card style={{ marginBottom: "0", height: '100%' }}>
                            <CardHeader title="Danh sách phương thức vận chuyển">
                                <CardHeaderToolbar>
                                    {/* <OverlayTrigger
                                        overlay={<Tooltip>Thêm thùng</Tooltip>}
                                    >

                                        <Link
                                            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                            style={{ float: "right" }}
                                            // onClick={() => setCheckModalBox(true)}
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
                                    remote
                                    // hover
                                    rowStyle={{ cursor: "pointer" }}
                                    bordered={false}
                                    keyField='id'
                                    data={shippingMethodList.map(agency => ({
                                        ...agency,
                                        stt: num++
                                    }))}
                                    columns={columns}
                                    // expandRow={expandRow}
                                    onTableChange={getHandlerTableChange}
                                // rowEvents={rowEvents}
                                // pagination={paginationFactory(options)}
                                />
                            </CardBody>
                        </Card>
                    </form>

                </div>

            </div>


            {/* Modal update agency*/}
            <Modal
                show={checkModal}
                dialogClassName="w-custome-20"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết đại lý kho
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="form-group row">
                        <label className="col-3 col-form-label"> Mã Phương Thức:</label>
                        <div className="col-9">
                            <input
                                className="form-control"
                                value={idUpdate}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-3 col-form-label"> Tên phương thức:</label>
                        <div className="col-9">
                            <input
                                className="form-control"
                                value={nameUpdate}
                                onInput={e => setNameUpdate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-3  col-form-label"> Phí:</label>
                        <div className="col-9">
                            <input
                                className="form-control"
                                value={feeUpdate} 
                                onInput={e => setFeeUpdate(e.target.value)} 
                            />
                        </div>
                    </div>


                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {
                            updateShippingMethod(idUpdate, nameUpdate, feeUpdate)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModal(false)).then(history.push("/admin/shipmentmethod"));;
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