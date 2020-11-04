import React, { useEffect, useState } from 'react';
import {  useDispatch } from 'react-redux'
import { getProducts, getSuppliersList,  deleteSuppliers, getSuppliersAll} from '../../_redux_/productsSlice'
import BootstrapTable from "react-bootstrap-table-next";
import  { Search } from "react-bootstrap-table2-toolkit";
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
import { FormControl, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import swal from 'sweetalert';
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router";


export function SupplierList() {

    const [suppliers, setSupplier] = useState([]);
    const dispatch = useDispatch()
    const history = useHistory();
    let location = useLocation();
    const [typeSearch, setTypeSearch] = useState();
    const [totals, setTotals] = useState(0);
    const [perPages, setPerPages] = useState(0);
    const [suppliersList, setSuppliersList] = useState([])

    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [expanded, setExpanded] = React.useState(false);


    const onFindChange = (e) => {
        setTypeSearch(e.target.value);

    }

    const onChangeSupplier = (e) => {
        if (typeSearch) {
            getSupplierList('search=' + typeSearch + ":" + e.target.value)

        } else {
            getSupplierList('search=' + e.target.value)
        }
        // e.target.value="";
    }


    useEffect(() => {

        getSupplierList()

        dispatch(getSuppliersList()).then(res => {
            setSupplier(res.data.data)
        })

    }, [location]);




    function getSupplierList(object) {
        dispatch(getSuppliersAll(object)).then(res => {
            const _data = res.data || {};
            setPerPages(_data.per_page);
            setTotals(_data.total);
            setSuppliersList(_data.data);

        })
    }

    const columns = [
        {
            dataField: "id",
            text: "STT",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "name",
            text: "Tên",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "link",
            text: "Liên kết",
            sort: true,
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
        },
        {
            dataField: "address",
            text: "Địa chỉ ",
            sort: true,
        },
        {
            dataField: "note",
            text: "Ghi chú",
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
            },
        }


    ]
    const getHandlerTableChange = (e) => { }
    const options = {
        hideSizePerPage: true,
        sizePerPage: perPages,
        totalSize: totals,
        onPageChange: (page, sizePerPage) => {
            getSupplierList('page=' + page);
        },
    };
    function deleteModal(object) { // React creates function whenever rendered
        swal({
            title: "Bạn có muốn xoá nhà cung cấp" + object.id + " ?",
            icon: "warning",
            dangerMode: true,
            buttons: ["Huỷ", "Xoá"],
        })
            .then((willDelete) => {
                if (willDelete) {
                    dispatch(deleteSuppliers(object.id)).then(() => {
                        swal("Đã xoá thành công!", {
                            icon: "success",
                        }).then(history.push(`supplier`));
                    }).catch((err) => {
                        swal("Xoá thất bại !", {
                            icon: "warning",
                        });
                    })
                }
            });
    }
    function rankFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Chi tiết</Tooltip>}
                >
                    <Link to={`supplierupdate/${row.id}`}
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
                    overlay={<Tooltip>Xoá nhà cung cấp </Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => deleteModal(row)}
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
        <form className="form form-label-right">
            <Card style={{ marginBottom: "0" }}>
                <CardHeader title="Danh nhà cung cấp">
                    <CardHeaderToolbar>
                        <Link to={'createsupplier'}
                            type="button"
                            className="btn btn-primary"
                        ><i className="fa fa-plus"></i>
                                Thêm nhà cung cấp
                            </Link>

                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    {/* <ToolkitProvider
                        keyField="id"
                        data={suppliers === null ? [] : suppliers}

                        columns={columns}
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
                                                        <option value='id'>Tên nhà cung cấp</option>
                                                        <option value='email'>Email nhà cung cấp</option>
                                                        <option value='address'>Địa chỉ nhà cung cấp</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </InputGroup.Append>
                                            <SearchBar style={{ marginLeft: "4%", width: "400%"}} {...props.searchProps} />
                                        </InputGroup>
                                    </div>
                                </div>
                                <BootstrapTable
                                    hover
                                    wrapperClasses="table-responsive"
                                    classes="table table-head-custom table-vertical-center overflow-hidden"
                                    bordered={false}
                                    {...props.baseProps}
                                    onTableChange={getHandlerTableChange}
                                    pagination={paginationFactory(options)}
                                />
                            </div>
                        )}
                    </ToolkitProvider> */}


                    <div className="row">
                        <div className="col-2 pl-0">

                            <Form.Control as="select" onChange={onFindChange}>
                                <option value=''>Tất cả</option>
                                <option value='name'>Tên nhà cung cấp</option>
                                <option value='email'>Email nhà cung cấp</option>
                                <option value='address'>Địa chỉ nhà cung cấp</option>
                            </Form.Control>
                        </div>
                        <div className="col-9 pr-0" style={{marginLeft:"-1%"}}>
                            <FormControl
                                placeholder="Nội dung tìm kiếm"
                                onChange={onChangeSupplier}
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
                        data={suppliersList}
                        // columns={columns}
                        columns={columns}
                        onTableChange={getHandlerTableChange}
                        pagination={paginationFactory(options)}
                    />
                </CardBody>
            </Card>

        </form>

    );
}


