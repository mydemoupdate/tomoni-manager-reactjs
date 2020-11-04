import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {
    getProducts,
    getSuppliersList,
    getOriginsList,
    createUnit,
    getUnitsList,
    getTaxesList,
    deleteUnits,
    deleteOrigins,
    deleteTaxs,
    createOrigin,
    createTax,
    updateUnit,
    updateOrigin,
    updateTax
} from '../../_redux_/productsSlice'
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import SVG from "react-inlinesvg";
import paginationFactory from 'react-bootstrap-table2-paginator';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { Button, Modal, FormControl, InputGroup, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import swal from 'sweetalert';
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router";
import TextField from "@material-ui/core/TextField";

export function ManagerList() {


    const [origins, setOrigin] = useState([])
    const [taxs, setTax] = useState([])
    const [units, setUnits] = useState([])
    const dispatch = useDispatch()
    const history = useHistory();
    let location = useLocation();
    const { SearchBar } = Search;
    const [typeSearch, setTypeSearch] = useState();
    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [expanded, setExpanded] = React.useState(false);
    const [checkModalTracking, setCheckModalTracking] = useState(false);

    const [checkModalUnit, setCheckModalUnit] = useState({
        checkModal: false,
        id: '',
        name: ''
    });

    const [unitID, setUnitID] = useState('')
    const [checkModalOrigin, setCheckModalOrigin] = useState({
        checkModal: false,
        id: '',
        name: ''
    });
    const [checkModalTax, setCheckModalTax] = useState({
        checkModal: false,
        id: '',
        name: '',
    });

    const [unitId, setUnitId] = useState('')
    const [nameUnit, setNameUnit] = useState('')
    const [checkModalInputUnit, setCheckModalInputUnit] = useState(false)

    const [originId, setOriginId] = useState('')
    const [nameOrigin, setNameOrigin] = useState('')
    const [checkModalInputOrigin, setCheckModalInputOrigin] = useState(false)

    const [nameTax, setTaxName] = useState('')
    const [percentTax, setPercentTax] = useState('')
    const [checkModalInputTax, setCheckModalInputTax] = useState(false)
    let numberUnit = 1;
    let numberOrigin = 1;
    let numberTax = 1

    const onFindChange = (e) => {
        setTypeSearch(e.target.value);
    }


    useEffect(() => {


        dispatch(getUnitsList()).then(res => {
            setUnits(res.data)
        })
        dispatch(getOriginsList()).then(res => {
            setOrigin(res.data)
        })
        dispatch(getTaxesList()).then(res => {
            setTax(res.data)
        })

    }, [location]);

    const columnsUnit = [
        {
            dataField: "stt_",
            text: "STT",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "id",
            text: "ID đơn vị",
            sort: true,

        },
        {
            dataField: "name",
            text: "Tên",
            sort: true,
        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: rankFormatterUnit,
            style: {
                minWidth: "100px",
            },
        }


    ]
    const columnsOrigin = [
        {
            dataField: "stt_",
            text: "STT",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "id",
            text: "ID nơi xuất xứ",
            sort: true,

        },
        {
            dataField: "name",
            text: "Tên nơi xuất xứ",
            sort: true,
        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: rankFormatterOrigin,
            style: {
                minWidth: "100px",
            },
        }


    ]
    const columnsTax = [
        {
            dataField: "stt_",
            text: "STT",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "id",
            text: "ID thuế",
            sort: true,

        },
        {
            dataField: "name",
            text: "Phần trăm thuế",
            sort: true,
        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: rankFormatterTax,
            style: {
                minWidth: "100px",
            },
        }
    ]
    const getHandlerTableChange = (e) => { }
    const optionsUnit = {
        hideSizePerPage: true,
        onPageChange: (page, sizePerPage) => {
            dispatch(getUnitsList());
        },
    };
    const optionsOrigin = {
        hideSizePerPage: true,
        onPageChange: (page, sizePerPage) => {
            dispatch(getOriginsList());
        },
    };
    const optionsTax = {
        hideSizePerPage: true,
        onPageChange: (page, sizePerPage) => {
            dispatch(getTaxesList());
        },
    };

    // Delete Unit

    function deleteModalUnit(object) { // React creates function whenever rendered
        swal({
            title: "Bạn có muốn xoá đơn vị " + object.name + " ?",
            icon: "warning",
            dangerMode: true,
            buttons: ["Huỷ", "Xoá"],
        })
            .then((willDelete) => {
                if (willDelete) {
                    dispatch(deleteUnits(object.id)).then(() => {
                        swal("Đã xoá thành công!", {
                            icon: "success",
                        }).then(history.push(`othermanager`));
                    }).catch((err) => {
                        swal("Xoá thất bại !", {
                            icon: "warning",
                        });
                    })
                }
            });
    }


    //Delete origin
    function deleteModalOrigin(object) { // React creates function whenever rendered
        swal({
            title: "Bạn có muốn xoá nơi sản xuất " + object.name + " ?",
            icon: "warning",
            dangerMode: true,
            buttons: ["Huỷ", "Xoá"],
        })
            .then((willDelete) => {
                if (willDelete) {
                    dispatch(deleteOrigins(object.id)).then(() => {
                        swal("Đã xoá thành công!", {
                            icon: "success",
                        }).then(history.push(`othermanager`));
                    }).catch((err) => {
                        swal("Xoá thất bại !", {
                            icon: "warning",
                        });
                    })
                }
            });
    }


    //Delete tax
    function deleteModalTax(object) { // React creates function whenever rendered
        swal({
            title: "Bạn có muốn thuế " + object.name + " ?",
            icon: "warning",
            dangerMode: true,
            buttons: ["Huỷ", "Xoá"],
        })
            .then((willDelete) => {
                if (willDelete) {
                    dispatch(deleteTaxs(object.id)).then(() => {
                        swal("Đã xoá thành công!", {
                            icon: "success",
                        }).then(history.push(`othermanager`));
                    }).catch((err) => {
                        swal("Xoá thất bại !", {
                            icon: "warning",
                        });
                    })
                }
            });
    }


    //Formatter unit
    function rankFormatterUnit(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Chi tiết</Tooltip>}
                >
                    <Link
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                        onClick={() => setCheckModalUnit({
                            checkModal: true,
                            id: row.id,
                            name: row.name
                        })}
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
                    overlay={<Tooltip>Xoá đơn vị</Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => deleteModalUnit(row)}
                    >
                        <span className="svg-icon svg-icon-md svg-icon-danger">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                        </span>
                    </a>
                </OverlayTrigger>
            </>
        );
    }

    //Formatter Origin
    function rankFormatterOrigin(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Chi tiết</Tooltip>}
                >
                    <Link
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                        onClick={() => setCheckModalOrigin({
                            checkModal: true,
                            id: row.id,
                            name: row.name
                        })}
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
                    overlay={<Tooltip>Xoá nơi xuất xứ </Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => deleteModalOrigin(row)}
                    >
                        <span className="svg-icon svg-icon-md svg-icon-danger">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                        </span>
                    </a>
                </OverlayTrigger>
            </>
        );
    }

    //Formatter Tax
    function rankFormatterTax(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Chi tiết</Tooltip>}
                >
                    <Link
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                        onClick={() => setCheckModalTax({
                            checkModal: true,
                            id: row.id,
                            name: row.name
                        })}
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
                    overlay={<Tooltip>Xoá thuế </Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => deleteModalTax(row)}
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
        <div style={{ display: "flex" }}>




            {/* Table unit */}
            <div style={{ width: "32%", marginRight: "2%" }}>
                <form className="form form-label-right">
                    <Card style={{ marginBottom: "0" }}>
                        <CardHeader title="Danh sách đơn vị">
                            <CardHeaderToolbar>
                                <Link
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setCheckModalInputUnit(true)}
                                >
                                    <i className="fa fa-plus"></i>
                                Thêm đơn vị
                            </Link>

                            </CardHeaderToolbar>
                        </CardHeader>
                        <CardBody>
                            <ToolkitProvider
                                keyField="id"
                                data={units === null ? [] : units.map(unit => ({
                                    ...unit,
                                    stt_: numberUnit++
                                }))}
                                columns={columnsUnit}
                                search
                            >
                                {(props) => (
                                    <div>
                                        <div className="row">
                                            <div className="col-6 pl-0">
                                                <InputGroup style={{ marginLeft: "2%" }}>
                                                    <InputGroup.Append>
                                                        <Form.Group>
                                                            <Form.Control as="select" onChange={onFindChange}>
                                                                <option value=''>Tất cả</option>
                                                                <option value='id'>ID đơn vị</option>
                                                                <option value='name'>Tên đơn vị</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </InputGroup.Append>
                                                    <SearchBar style={{ marginLeft: "4%", width: "200%" }} {...props.searchProps} />
                                                </InputGroup>
                                            </div>
                                        </div>
                                        <BootstrapTable
                                            remote
                                            hover
                                            wrapperClasses="table-responsive"
                                            classes="table table-head-custom table-vertical-center overflow-hidden"
                                            bordered={false}
                                            {...props.baseProps}
                                            onTableChange={getHandlerTableChange}
                                            pagination={paginationFactory(optionsUnit)}
                                        />
                                    </div>
                                )}
                            </ToolkitProvider>
                        </CardBody>
                    </Card>

                </form>
            </div>





            {/* Table origin */}
            <div style={{ width: "32%", marginRight: "2%" }}>
                <form className="form form-label-right">
                    <Card style={{ marginBottom: "0" }}>
                        <CardHeader title="Danh sách nơi xuất xứ">
                            <CardHeaderToolbar>
                                <Link
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setCheckModalInputOrigin(true)}
                                >
                                    <i className="fa fa-plus"></i>
                                Thêm nơi xuất xứ
                                </Link>

                            </CardHeaderToolbar>
                        </CardHeader>
                        <CardBody>
                            <ToolkitProvider
                                keyField="id"
                                data={origins === null ? [] : origins.map(origin => ({
                                    ...origin,
                                    stt_: numberOrigin++
                                }))}
                                columns={columnsOrigin}
                                search
                            >
                                {(props) => (
                                    <div>
                                        <div className="row">
                                            <div className="col-6 pl-0">
                                                <InputGroup style={{ marginLeft: "2%" }}>
                                                    <InputGroup.Append>
                                                        <Form.Group>
                                                            <Form.Control as="select" onChange={onFindChange}>
                                                                <option value=''>Tất cả</option>
                                                                <option value='id'>ID nơi xuất xứ</option>
                                                                <option value='name'>Tên nhà xuất xứ</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </InputGroup.Append>
                                                    <SearchBar style={{ marginLeft: "4%", width: "200%" }} {...props.searchProps} />
                                                </InputGroup>
                                            </div>
                                        </div>
                                        <BootstrapTable
                                            remote
                                            hover
                                            wrapperClasses="table-responsive"
                                            classes="table table-head-custom table-vertical-center overflow-hidden"
                                            bordered={false}
                                            {...props.baseProps}
                                            onTableChange={getHandlerTableChange}
                                            pagination={paginationFactory(optionsOrigin)}
                                        />
                                    </div>
                                )}
                            </ToolkitProvider>
                        </CardBody>
                    </Card>

                </form>
            </div>




            {/* Table tax */}
            <div style={{ width: "32%" }} >
                <form className="form form-label-right">
                    <Card style={{ marginBottom: "0" }}>
                        <CardHeader title="Danh sách thuế">
                            <CardHeaderToolbar>
                                <Link
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setCheckModalInputTax(true)}
                                >
                                    <i className="fa fa-plus"></i>
                                Thêm thuế
                            </Link>
                            </CardHeaderToolbar>
                        </CardHeader>
                        <CardBody>
                            <ToolkitProvider
                                keyField="id"
                                data={taxs === null ? [] : taxs.map(origin => ({
                                    ...origin,
                                    stt_: numberTax++
                                }))}
                                columns={columnsTax}
                                search
                            >
                                {(props) => (
                                    <div>
                                        <div className="row">
                                            <div className="col-6 pl-0">
                                                <InputGroup style={{ marginLeft: "2%" }}>
                                                    <InputGroup.Append>
                                                        <Form.Group>
                                                            <Form.Control as="select" onChange={onFindChange}>
                                                                <option value=''>Tất cả</option>
                                                                <option value='id'>ID thuế</option>
                                                                <option value='name'>Phần  trăm thuế</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </InputGroup.Append>
                                                    <SearchBar style={{ marginLeft: "4%", width: "200%" }} {...props.searchProps} />
                                                </InputGroup>
                                            </div>
                                        </div>
                                        <BootstrapTable
                                            remote
                                            hover
                                            wrapperClasses="table-responsive"
                                            classes="table table-head-custom table-vertical-center overflow-hidden"
                                            bordered={false}
                                            {...props.baseProps}
                                            onTableChange={getHandlerTableChange}
                                            pagination={paginationFactory(optionsTax)}
                                        />
                                    </div>
                                )}
                            </ToolkitProvider>
                        </CardBody>
                    </Card>
                </form>
            </div>




            {/* Update unit */}
            <Modal
                show={checkModalUnit.checkModal}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết đơn vị
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> ID đơn vị:</label>
                        <div className="col-8">
                            <input className="form-control" value={checkModalUnit.id}
                                />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> Tên đơn vị:</label>
                        <div className="col-8">
                            <input className="form-control" value={checkModalUnit.name} onChange={(e) => { setCheckModalUnit({ checkModal: true, name: e.target.value, id: checkModalUnit.id }) }} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalUnit({ checkModal: false })}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setTimeout(() => {
                            updateUnit(checkModalUnit?.id, checkModalUnit?.name)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalUnit({ checkModal: false })).then(history.push("/admin/othermanager"));

                                })
                                .catch((err) => {
                                    console.log(err);
                                    swal("Cập nhật không thành công!", {
                                        icon: "warning",
                                    });
                                });
                        }, 100)
                    }}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>




            {/* Update origin */}
            <Modal
                show={checkModalOrigin.checkModal}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết nơi xuất xứ
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> ID nơi xuất xứ:</label>
                        <div className="col-8">
                            <input className="form-control" value={checkModalOrigin.id}
                                onChange={(e) => {
                                    swal("Không thể thay đổi ID!", {
                                        icon: "warning",
                                    })
                                }} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> Tên nơi sản xuất:</label>
                        <div className="col-8">
                            <input className="form-control" value={checkModalOrigin.name} onChange={(e) => { setCheckModalOrigin({ checkModal: true, name: e.target.value, id: checkModalOrigin.id }) }} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalOrigin({ checkModal: false })}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setTimeout(() => {
                            updateOrigin(checkModalOrigin?.id, checkModalOrigin?.name)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalOrigin({ checkModal: false })).then(history.push("/admin/othermanager"));

                                })
                                .catch((err) => {
                                    console.log(err);
                                    swal("Cập nhật không thành công!", {
                                        icon: "warning",
                                    });
                                });
                        }, 100)
                    }}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>




            {/* Update tax */}
            <Modal
                show={checkModalTax.checkModal}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết thuế
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> ID thuế:</label>
                        <div className="col-8">
                            <input className="form-control" value={checkModalTax.id}
                                onChange={(e) => {
                                    swal("Không thể thay đổi ID!", {
                                        icon: "warning",
                                    })
                                }} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> Tên thuế:</label>
                        <div className="col-8">
                            <input className="form-control" value={checkModalTax.name} onChange={(e) => { setCheckModalTax({ checkModal: true, name: e.target.value, id: checkModalTax.id }) }} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalTax({ checkModal: false })}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setTimeout(() => {
                            updateTax(checkModalTax?.id, checkModalTax?.name,  (checkModalTax?.name).replace('%',""))
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalTax({ checkModal: false })).then(history.push("/admin/othermanager"));

                                })
                                .catch((err) => {
                                    console.log(err);
                                    swal("Cập nhật không thành công!", {
                                        icon: "warning",
                                    });
                                });
                        }, 100)
                    }}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>




            {/* ADD new unit */}
            <Modal
                show={checkModalInputUnit}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Thêm đơn vị
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> ID đơn vị:</label>
                        <div className="col-8">
                            <input className="form-control" onChange={(e) => setUnitId(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> Tên đơn vị:</label>
                        <div className="col-8">
                            <input className="form-control" onChange={(e) => setNameUnit(e.target.value)} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalInputUnit(false)}>
                        Đóng
                     </Button>
                    <Button variant="primary" onClick={() => {
                        setTimeout(() => {
                            createUnit(nameUnit, unitId)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalInputUnit(false)).then(history.push("/admin/othermanager"));

                                })
                                .catch((err) => {
                                    console.log(err);
                                    swal("Cập nhật không thành công!", {
                                        icon: "warning",
                                    });
                                });
                        }, 100)

                    }}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>




            {/* ADD new origin */}
            <Modal
                show={checkModalInputOrigin}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Thêm nơi sản xuất
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> ID nơi sản xuất:</label>
                        <div className="col-8">
                            <input className="form-control" onChange={(e) => setOriginId(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> Tên nơi sản xuất:</label>
                        <div className="col-8">
                            <input className="form-control" onChange={(e) => setNameOrigin(e.target.value)} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalInputOrigin(false)}>
                        Đóng
                     </Button>
                    <Button variant="primary" onClick={() => {
                        setTimeout(() => {
                            createOrigin(nameOrigin, originId)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalInputOrigin(false)).then(history.push("/admin/othermanager"));

                                })
                                .catch((err) => {
                                    console.log(err);
                                    swal("Cập nhật không thành công!", {
                                        icon: "warning",
                                    });
                                });
                        }, 100)

                    }}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>




            {/* ADD new tax */}
            <Modal
                show={checkModalInputTax}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Thêm đơn vị
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> Phần trăm thuế:</label>
                        <div className="col-8">
                            <input className="form-control" onChange={(e) => setTaxName(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 col-form-label"> Tên:</label>
                        <div className="col-8">
                            <input className="form-control" onChange={(e) => setPercentTax(e.target.value)} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalInputTax(false)}>
                        Đóng
                     </Button>
                    <Button variant="primary" onClick={() => {
                        setTimeout(() => {
                            createTax(nameTax + String.fromCharCode(37), percentTax)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalInputTax(false)).then(history.push("/admin/othermanager"));

                                })
                                .catch((err) => {
                                    console.log(err);
                                    swal("Cập nhật không thành công!", {
                                        icon: "warning",
                                    });
                                });
                        }, 100)

                    }}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
}


