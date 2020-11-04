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
import { getAgency, createAgency, deleteAgency, updateAgency } from '../../_redux_/warehouseSlice';
import { useDispatch } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import { Button, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import Select from 'react-select';





export function AgencyList() {

    const history = useHistory();
    let location = useLocation();
    let num = 1;

    const [agencyList, setAgencyList] = useState([]);
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [tel, setTel] = useState('')

    //update agency
    const [checkModal, setCheckModal] = useState(false)
    const [idAgency, setIdAgency] = useState('')
    const [nameUpdate, setNameUpdate] = useState('')
    const [addressUpdate, setAddressUpdate] = useState('')
    const [telUpdate, setTelUpdate] = useState('')





    const getHandlerTableChange = (e) => { }

    useEffect(() => {
        getAgency().then(result => setAgencyList(result.data))

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
            dataField: "address",
            text: "Địa chỉ",
            sort: true,
        },
        {
            dataField: "tel",
            text: "Số điện thoại",
            sort: true,
        },

        // {
        //     dataField: "created_at",
        //     text: "Ngày tạo",
        //     sort: true,
        //     style: {
        //         fontWeight: "500"
        //     }
        // },
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
                            setIdAgency(row.id)
                            setNameUpdate(row.name)
                            setAddressUpdate(row.address)
                            setTelUpdate(row.tel)
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
                                title: "Bạn có muốn đại lý " + row.name + " ?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["Huỷ", "Xoá"],
                            })
                                .then((willDelete) => {
                                    if (willDelete) {
                                        deleteAgency(row.id).then(() => {
                                            swal("Đã xoá thành công!", {
                                                icon: "success",
                                            }).then(history.push("/admin/agency"));
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
                        <CardHeader title={"Thêm đại lý kho"}>
                            <CardHeaderToolbar>

                            </CardHeaderToolbar>
                        </CardHeader>

                        <CardBody style={{ height: '100%' }} >

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-primary align-self-stretch" ></span> */}
                                <label className="col-4 col-form-label">Tên đại lý :</label>
                                <div className="col-8">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập tên đại lý" onInput={e => setName(e.target.value)} />
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-warning align-self-stretch" ></span> */}
                                <label className="col-4 col-form-label">Địa chỉ:</label>
                                <div className="col-8">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập địa chỉ" onInput={e => setAddress(e.target.value)} />
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-dark align-self-stretch" ></span> */}
                                <label className="col-4 col-form-label">Số điện thoại:</label>
                                <div className="col-8">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập số điện thoại" onInput={e => setTel(e.target.value)} />
                                    </span>
                                </div>
                            </div>



                            <div>
                                <Link
                                    style={{ float: 'right' }}
                                    onClick={() => {
                                        setTimeout(() => {
                                            createAgency(name, address, tel)

                                                .then((res) => {
                                                    swal("Đã thêm thành công!", {
                                                        icon: "success",
                                                    }).then(history.push("/admin/agency"));
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
                            <CardHeader title="Danh sách đại lý kho">
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
                                    data={agencyList.map(agency => ({
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
                        <label className="col-3 col-form-label"> Tên đại lý:</label>
                        <div className="col-9">
                            <input
                                className="form-control"
                                value={nameUpdate}
                                onInput={e => setNameUpdate(e.target.value)} 
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-3 col-form-label"> Địa chỉ:</label>
                        <div className="col-9">
                            <input
                                className="form-control"
                                value={addressUpdate}
                                onInput={e => setAddressUpdate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-3  col-form-label"> Số điện thoại:</label>
                        <div className="col-9">
                            <input
                                className="form-control"
                                value={telUpdate} 
                                onInput={e => setTelUpdate(e.target.value)} 
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
                            updateAgency(idAgency, nameUpdate, telUpdate, addressUpdate)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModal(false)).then(history.push("/admin/agency"));;
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