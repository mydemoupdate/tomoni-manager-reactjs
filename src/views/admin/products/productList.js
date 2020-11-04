import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getProductsList, deleteProducts, getOrigins, getTaxes, getUnits, getProductAll } from '../../_redux_/productsSlice'
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
} from "../../../_metronic/_partials/controls";
import { InputGroup, OverlayTrigger, Tooltip, Form, FormControl } from "react-bootstrap";
// import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import swal from 'sweetalert';
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { sortCaret, headerSortingClasses } from "../../../_metronic/_helpers/TableSortingHelpers"

export function ProductList() {

    const [typeSearch, setTypeSearch] = useState();
    const [typeProduct, setTypeProduct] = useState("Retail");
    const [params, setParams] = useState("");
    const [origins, setOrigins] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [units, setUnits] = useState([]);

    const [productsList, setProductsList] = useState([])
    const { SearchBar } = Search;
    const [totals, setTotals] = useState(0);
    const [perPages, setPerPages] = useState(0);
    let   [orderNumerical, setOrderNumerical] = useState(1)

    const history = useHistory();
    const onFindChange = (e) => {
        setTypeSearch(e.target.value);
    }
    const onChangeProduct = (e) => {

        if (typeSearch) {
            getProductList('search='+ typeSearch+":"+e.target.value)

        } else {
            getProductList('search='+e.target.value)
        }
        // e.target.value="";
    }
    // const onKeySearch = (e) => {
    //     if (e.key === 'Enter') {

    //         console.log(typeSearch)

    //         if(typeSearch){
    //             dispatch(getProductsList('search='+typeSearch+':'+e.target.value+'&locale=vi')).then(res=>{
    //                 const _data = res.data || {};
    //                 setPerPage(_data.per_page);
    //                 setTotal(_data.total);
    //                 setListOrder(_data.data);


    //             })
    //         }else {
    //             dispatch(getProductsList('search='+e.target.value+'&locale=vi')).then(res=>{
    //                 const _data = res.data || {};
    //                 setPerPage(_data.per_page);
    //                 setTotal(_data.total);
    //                 setListOrder(_data.data);


    //             })
    //         }
    //         e.target.value="";

    //     }
    // }


    function deleteModal(object) { // React creates function whenever rendered
        swal({
            title: "Bạn có muốn xoá nhà cung cấp " + object.id + " ?",
            icon: "warning",
            dangerMode: true,
            buttons: ["Huỷ", "Xoá"],
        })
            .then((willDelete) => {
                if (willDelete) {
                    dispatch(deleteProducts(object.id)).then(() => {
                        swal("Đã xoá thành công!", {
                            icon: "success",
                        }).then(history.push("/admin/product"));
                        setParams("search=" + typeProduct + "&searchFields=director.type.id&page=1");
                        dispatch(getProductsList());

                    }).catch((err) => {
                        swal("Xoá thất bại !", {
                            icon: "warning",
                        });
                    })
                }
            });
    }
    const getHandlerTableChange = (e) => { } // React creates function whenever rendered
    // Products UI Context
    const dispatch = useDispatch()
    let location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('wholesale')) {
            setTypeProduct("Wholesale");
        } else if (location.pathname.includes('auction')) {
            setTypeProduct("Auction");
        } else if (location.pathname.includes('shipping')) {
            setTypeProduct("ShippingPartner");
        } else if (location.pathname.includes('payment')) {
            setTypeProduct("PaymentPartner");
        } else {
            setTypeProduct("Retail");
        }
        setParams("search=" + typeProduct + "&searchFields=director.type.id&page=1");

        // dispatch(getProductsList("search=" + typeProduct + "&searchFields=director.type.id&page=1"));
        getProductList()
        getOrigins().then(result => setOrigins(result.data))
        getTaxes().then(result => setTaxes(result.data))
        getUnits().then(result => setUnits(result.data))


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
            history.push('/admin/products/detail/' + row.id);
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
            text: "Mã Sản Phẩm",
            sort: true,
            style: {
                fontWeight: "bold"
            },
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "name",
            text: "Tên Sản Phẩm",
            sort: true,
        },
        {
            dataField: "price",
            text: "Gía",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            onSort:(field, product) =>{
                getProductList(`orderBy=price&sortedBy=${product}`)
            },
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "origin_name",
            text: "Xuất xứ ",
            sort: true,
            style: {
                fontWeight: "500"
            }
        },
        // {
        //     dataField: "supplier_id",
        //     text: "Tên Nhà Cung Cấp ",
        //     sort: true,
        //     style: {
        //         fontWeight: "500"
        //     }
        // },
        {
            dataField: "tax_name",
            text: "Thuế ",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            onSort:(field, product) =>{
                getProductList(`orderBy=price&sortedBy=${product}`)
            },
            style: {
                fontWeight: "500"
            },

        },
        {
            dataField: "unit_name",
            text: "Đơn Vị ",
            sort: true,
            style: {
                fontWeight: "500"
            },
            formatter: statusFormatter
        },
        // {
        //     dataField: "ingredients.ja",           
        //     text: "Thành Phần ",
        //     sort: true,
        //     style:{
        //         fontWeight: "500"
        //     }
        // },
        // {s
        //     dataField: "ingredients.en",
        //     text: "Thành phần ",
        //     sort: true,
        // },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: rankFormatter,
            style: {
                minWidth: "100px",
            }
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


    function getProductList(object) {
        dispatch(getProductAll(object)).then(res => {
            const _data = res.data || {};
            setPerPages(_data.per_page);
            setTotals(_data.total);
            setProductsList(_data.data);

        })
    }


    function rankFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Chi tiết</Tooltip>}
                >
                    <Link to={`products/detail/${row.id}`}
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
                    overlay={<Tooltip>Xoá Sản Phẩm </Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() =>{deleteModal(row)}}
                    >
                        <span className="svg-icon svg-icon-md svg-icon-danger">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                        </span>
                    </a>
                </OverlayTrigger>
            </>
        );
    }
    const options = {
        hideSizePerPage: true,
        sizePerPage: perPages,
        totalSize: totals,
        onPageChange: (page, sizePerPage) => {
            getProductList('page=' + page)
            setOrderNumerical(15*(page-1) +1)
        },
    };
    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    
    return (
        <form className="form form-label-right">
            <Card style={{ marginBottom: "0" }}>
                <CardHeader title="Danh sách sản phẩm">
                    <CardHeaderToolbar>
                        <Link to={'createproduct'}
                            type="button"
                            className="btn btn-primary"
                        ><i className="fa fa-plus"></i>
                                Thêm sản phẩm
                            </Link>

                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    {/* <ToolkitProvider
                        keyField="id"
                        data={productsList.map(product => ({
                            ...product,
                            stt: num++,
                            origin_name: origins?.find(x => x?.id === product?.origin_id)?.name,
                            tax_name: taxes?.find(x => x?.id === product?.tax_id)?.name,
                            unit_name: units.find(x => x?.id === product?.unit_id)?.name,
                            name_ja: isBlank(product.name.ja) ? (product.name.en) : (product.name.ja || product.name.vn),
                        }))}

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
                                                        <option value='id'>Mã Sản Phẩm</option>
                                                        <option value='name'>Tên sản phẩm</option>
                                                        <option value='ingredients.ja'>Thành phần</option>
                                                        <option value='unit.name'>Đơn vị</option>
                                                        <option value='tax.percent'>Phần trăm thuế</option>
                                                        <option value='suppliers.name'>Nhà cung cấp</option>

                                                    </Form.Control>
                                                </Form.Group>
                                            </InputGroup.Append>
                                            <SearchBar style={{ marginLeft: "4%", width: "400%" }} {...props.searchProps} />
                                        </InputGroup>
                                    </div>
                                </div>
                                <BootstrapTable
                                    hover
                                    data={productsList}
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
                                <option value='id'>Mã Sản Phẩm</option>
                                <option value='name'>Tên sản phẩm</option>
                                <option value='ingredients'>Thành phần</option>
                                <option value='unit.name'>Đơn vị</option>
                                <option value='tax.percent'>Phần trăm thuế</option>
                                <option value='suppliers.name'>Nhà cung cấp</option>
                            </Form.Control>
                        </div>
                        <div className="col-9 pr-0"  style={{marginLeft:"-1%"}}>
                            <FormControl
                                placeholder="Nội dung tìm kiếm"
                                onChange={onChangeProduct}
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
                        data={productsList.map(product => ({
                            ...product,
                            stt: orderNumerical++,
                            origin_name: origins?.find(x => x?.id === product?.origin_id)?.name,
                            tax_name: taxes?.find(x => x?.id === product?.tax_id)?.name,
                            unit_name: units.find(x => x?.id === product?.unit_id)?.name,
                            name_ja: isBlank(product.name.ja) ? (product.name.en) : (product.name.ja || product.name.vn),
                        }))}
                        // columns={columns}
                        columns={columns }
                        onTableChange={getHandlerTableChange}
                        // rowEvents={rowEvents}
                        pagination={paginationFactory(options)}
                    />
                </CardBody>
            </Card>

        </form>

    );
}


