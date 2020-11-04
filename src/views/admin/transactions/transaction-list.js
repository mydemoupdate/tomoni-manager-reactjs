import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import {OverlayTrigger, Tooltip,Form, FormControl } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { Link, useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {useDispatch } from 'react-redux'
import { getAccountingWithObject
 } from '../../_redux_/accountingSlice'
 import { sortCaret, headerSortingClasses } from "../../../_metronic/_helpers/TableSortingHelpers"
export function TransactionList() {
    const dispatch = useDispatch()
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [accountingList, setAccountingList] = useState([]);
    const [typeSearch, setTypeSearch] = useState('id');
    useEffect(() => {
        getListTransaction('?sortedBy=desc&orderBy=updated_at');
    }, [dispatch]);

    function getListTransaction(pamram){
        dispatch(getAccountingWithObject(pamram)).then((response)=>{
            const dataObject = response.data || {};
            setAccountingList(dataObject.data|| [])
            setPerPage(dataObject.per_page);
            setTotal(dataObject.total);
        })
    }

    const onFindChange = (e) => {
        setTypeSearch(e.target.value)
    }
    const onKeySearch = (e) => {
        if(typeSearch && e.target.value){
            getListTransaction('?search='+typeSearch+':'+e.target.value);
        }else{
            getListTransaction('?sortedBy=desc&orderBy=updated_at');
        }
    }
    const options = {
        hideSizePerPage: true,
        sizePerPage: perPage,
        totalSize: total,
        onPageChange: (page, sizePerPage) => {
            dispatch(getAccountingWithObject('?page='+page+'&sortedBy=desc&orderBy=updated_at')).then((response)=>{
                const dataObject = response.data || {};
                setAccountingList(dataObject.data|| [])
                setPerPage(dataObject.per_page);
                setTotal(dataObject.total);
            })
        }
    };
    const columnsTransaction = [
        {
            dataField: "id",
            text: "ID",
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "user_id",
            text: "Khách hàng",
        },
        {
            dataField: "amount",
            text: "Số tiền",
        },
        {
            dataField: "prepared_by_id",
            text: "Người thực hiện",
        },
        {
            dataField: "payment_method_id",
            text: "Phương thức giao dịch",
        },

        {
            dataField: "updated_at",
            text: "Cập nhật",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            onSort: (field, order) => {
                getListTransaction('?orderBy=updated_at&sortedBy='+order);
              }
        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: actionFormatter,
        },

    ]
    function actionFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Chi tiết</Tooltip>}
                >
                    <Link to={`${row.id}`}
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                    >
                        <span className="svg-icon svg-icon-md svg-icon-primary">
                            <SVG
                                src={toAbsoluteUrl("/media/svg/icons/General/Visible.svg")}
                            />
                        </span>
                    </Link>
                </OverlayTrigger>
                </>
   
        );
    }
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <Card>
                        <CardHeader title="Danh sách giao dịch">
                            <CardHeaderToolbar>
                            <Link to={'create'}
                          type="button"
                          className="btn btn-primary ml-1 mr-1"
                    ><i className="fa fa-plus"></i>
                        Tạo giao dịch
                    </Link>
                            </CardHeaderToolbar>
                        </CardHeader>
                        <CardBody>
                        <div className="row">
                                <div className="col-3 pl-0">

                                    <Form.Control as="select" onChange={onFindChange}>
                                        <option value='id'>ID</option>
                                        <option value='user_id'>Khách hàng</option>
                                        <option value='payment_method_id'>Người thực hiện</option>
                                        <option value='updated_at'>Ngày cập nhật</option>
                    

                                    </Form.Control>
                                </div>
                                <div className="col-9">
                                    <FormControl
                                        placeholder="Nội dung tìm kiếm"
                                        onChange={onKeySearch}
                                    />
                                </div>

                            </div>

                            <div className="row mt-2">
                                <div className="col-12 pl-0">
                                    <BootstrapTable
                                        wrapperClasses="table-responsive"
                                        classes="table table-head-custom table-vertical-center overflow-hidden"
                                        remote
                                        hover
                                        rowStyle={{ cursor: "pointer" }}
                                        bordered={false}
                                        keyField='id'
                                        data={accountingList.length>0?accountingList:[]}
                                        columns={columnsTransaction}
                                        onTableChange={()=>{}}
                                        // rowEvents={rowEvents}
                                        pagination={paginationFactory(options)}
                                    />
                                </div>
                            </div>
                 </CardBody>
                    </Card>
                </div>
            </div>


        </React.Fragment>

    );
}


