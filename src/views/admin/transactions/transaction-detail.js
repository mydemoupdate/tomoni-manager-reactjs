import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { OverlayTrigger, Tooltip, Form, FormControl } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { Link, useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch } from 'react-redux';
import {
    getAccountingWithObject,
    saveReceipt,
    updateReceipt,
    deleteReceipt
} from '../../_redux_/accountingSlice'
import { useParams } from "react-router-dom";
import swal from 'sweetalert';
export function TransactionDetail() {
    const dispatch = useDispatch();
    const [transactionObject, setTransitionObject] = useState({
        user_id: '',
        amount: 0,
        prepared_by_id: '',
        type_id: '',
        payment_method_id: '',
        created_at: '',
        updated_at: '',
        description: '',
        receipts: []
    })
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            getTransactionList();
        }

    }, [dispatch]);
    function getTransactionList(){
        dispatch(getAccountingWithObject('/'+id+'?with=receipts;type')).then((res) => {
            const _data = res.data || {};
            setTransitionObject(_data);
        })
    }
    function fileChange(e){
        saveReceipt(e.target.files[0],id).then((res)=>{
            getTransactionList();
            swal("Đã cập nhật thành công!", {
                icon: "success",
            })
        }).catch(()=>{
            swal("Thêm thất bại !", {
                icon: "warning",
            });
        })
}
function editFIleChange(e,id){
    updateReceipt(e.target.files[0],id).then((res)=>{
        getTransactionList();
        swal("Đã cập nhật thành công!", {
            icon: "success",
        })
    }).catch(()=>{
        swal("Thêm thất bại !", {
            icon: "warning",
        });
    })
}
function deleteModal(object) { // React creates function whenever rendered
    swal({
        title: "Bạn có muốn xoá ?",
        icon: "warning",
        dangerMode: true,
        buttons: ["Huỷ", "Xoá"],
    })
        .then((willDelete) => {
            if (willDelete) {
                dispatch(deleteReceipt(object.id)).then(() => {
                    swal("Đã xoá thành công!", {
                        icon: "success",
                    })
                    getTransactionList();

                }).catch((err) => {
                    swal("Xoá thất bại !", {
                        icon: "warning",
                    });
                })
            }
        });
}
    const columnsReceipt = [
        {
            dataField: "abc",
            text: "STT",
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' },
            formatter: sttFormatter
        },
        {
            dataField: "path_file",
            text: "File",
            formatter: linkFormatter
        },
        {
            dataField: "receiptable_id",
            text: "Mã đối tượng",
        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: actionFormatter
        },

    ]
    function linkFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
            <a href={'http://139.180.207.4:82/storage/'+row.path_file} target="_blank">...{row?.path_file?.substring(row?.path_file.indexOf('.')-20)}</a>
               
            </>
        );
    }
    function sttFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
               {rowIndex+1}
            </>
        );
    }
    function actionFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
             <OverlayTrigger
                    overlay={<Tooltip>Chỉnh sửa</Tooltip>}
                >
                                                
                    <label for={row.id}
                        onClick={() => {  }}
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                    >
                        <input type="file" id={row.id} onChange={(e)=>{editFIleChange(e,row.id)}} className="file-receipts-list"/>
                        <span className="svg-icon svg-icon-md svg-icon-primary">
                            <SVG
                                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                            />
                        </span>
                    </label>
                </OverlayTrigger>
                <>
                </>
                <OverlayTrigger
                    overlay={<Tooltip>Xoá  </Tooltip>}
                >
                    <label
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                    onClick={() =>{deleteModal(row)}}
                    >
                        <span className="svg-icon svg-icon-md svg-icon-danger">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                        </span>
                    </label>
                </OverlayTrigger>
            </>
        );
    }
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-5">
                    <Card>
                        <CardHeader title="Chi tiết giao dịch">
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
                            <div className="d-flex align-items-center">
                                <span className="bullet bullet-bar bg-success align-self-stretch"></span>
                                <div className="mx-4 w-40">
                                    <a href="#" className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1">Khách hàng:</a>
                                </div>
                                <span>{transactionObject.user_id}</span>
                            </div>

                            <div className="d-flex align-items-center mt-5">
                                <span className="bullet bullet-bar bg-primary align-self-stretch"></span>
                                <div className="mx-4 w-40">
                                    <a href="#" className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1">Số tiền:</a>
                                </div>
                                <span>{transactionObject.amount}</span>
                            </div>
                            <div className="d-flex align-items-center mt-5">
                                <span className="bullet bullet-bar bg-warning align-self-stretch"></span>
                                <div className="mx-4 w-40">
                                    <a href="#" className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1">Người thực hiện:</a>
                                </div>
                                <span>{transactionObject.prepared_by_id}</span>
                            </div>



                            <div className="d-flex align-items-center mt-5">
                                <span className="bullet bullet-bar bg-danger align-self-stretch"></span>
                                <div className="mx-4 w-40">
                                    <a href="#" className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1">Loại giao dịch:</a>
                                </div>
                                <span>{transactionObject.type_id}</span>
                            </div>
                            <div className="d-flex align-items-center mt-5">
                                <span className="bullet bullet-bar bg-info align-self-stretch"></span>
                                <div className="mx-4 w-40">
                                    <a href="#" className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1">Phương thức thanh toán:</a>
                                </div>
                                <span>{transactionObject.payment_method_id}</span>
                            </div>
                            <div className="d-flex align-items-center mt-5">
                                <span className="bullet bullet-bar bg-muted align-self-stretch"></span>
                                <div className="mx-4 w-40">
                                    <a href="#" className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1">Ngày tạo:</a>
                                </div>
                                <span>{transactionObject.created_at}</span>
                            </div>
                            <div className="d-flex align-items-center mt-5">
                                <span className="bullet bullet-bar bg-success align-self-stretch"></span>
                                <div className="mx-4 w-40">
                                    <a href="#" className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1">Cập nhật lúc:</a>
                                </div>
                                <span>{transactionObject.created_at}</span>
                            </div>
                            <div className="d-flex align-items-center mt-5">
                                <span className="bullet bullet-bar bg-danger align-self-stretch"></span>
                                <div className="mx-4 w-40">
                                    <a href="#" className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1">Mô tả:</a>
                                </div>
                                <span>{transactionObject.description}</span>
                            </div>

                        </CardBody>
                    </Card>
                </div>

                <div className="col-7">
                    <Card>
                        <CardHeader title="Danh sách chứng từ">
                            <CardHeaderToolbar>
                            <label for="file-receipts"
                                                
                                                
                                            >
                                                <i className="ki ki-plus icon-lg mr-5"
                                                style={{ cursor: "pointer" }}></i>
                                            </label>
                                            <input type="file" id="file-receipts" onInput={fileChange}/>
                            </CardHeaderToolbar>
                        </CardHeader>
                        <CardBody>
                            <BootstrapTable
                                wrapperClasses="table-responsive"
                                classes="table table-head-custom table-vertical-center overflow-hidden"
                                remote
                                hover
                                rowStyle={{ cursor: "pointer" }}
                                bordered={false}
                                keyField='id'
                                data={transactionObject?.receipts?.length>0?transactionObject?.receipts:[]}
                                columns={columnsReceipt}
                                onTableChange={() => { }}
                            // rowEvents={rowEvents}
                            // pagination={paginationFactory(options)}
                            />
                        </CardBody>
                    </Card>
                </div>
            </div>


        </React.Fragment>

    );
}


