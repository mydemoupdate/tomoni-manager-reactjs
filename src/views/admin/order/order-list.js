import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {getOrderAll,getOrderAllSearch,getProductList,
    getSupplierList,
    getStatusOrder } from '../../_redux_/ordersSlice'
import BootstrapTable from "react-bootstrap-table-next";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import paginationFactory from 'react-bootstrap-table2-paginator';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { FormControl, Form } from "react-bootstrap";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import swal from 'sweetalert';
import { useLocation } from "react-router";
import {Link, useHistory} from "react-router-dom";
import Moment from 'moment';
import { sortCaret, headerSortingClasses } from "../../../_metronic/_helpers/TableSortingHelpers"
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import Select from "react-select";
export function OrderList() {
    const [listOrder, setListOrder] = useState([]);
    const [typeSearch, setTypeSearch] = useState();
    const [typeOrder, setTypeOrder] = useState();
    const [params, setParams] = useState();
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [statusList, setStatusList] = useState([]);
    const [statusSelect, setStatusSelect] = useState('');

    const history = useHistory();

    const onFindChange = (e) => {
        setTypeSearch(e.target.value);
        setStatusSelect('')
        if(e.target.value==''){
            getOrderList('with=cost;items;trackings&search=director.type.id:'+typeOrder+'&searchJoin=and&orderBy=created_at&sortedBy=desc', typeOrder)
        }
    }
    const onKeySearch = (e) => {

            console.log(typeSearch)

            if(typeSearch && e.target.value){
                getOrderList('with=cost;items;trackings&search=director.type.id:'+typeOrder+';'+typeSearch+':'+e.target.value+'&searchJoin=and&orderBy=created_at&sortedBy=desc', typeOrder)
         
            }else {
                dispatch(getOrderAllSearch(typeOrder+'?with=cost;items;trackings&search='+e.target.value+'&orderBy=created_at&sortedBy=desc')).then(res=>{
                    const _data = res.data || {};
                    setPerPage(_data.per_page);
                    setTotal(_data.total);
                    getNameProductAuction(_data)


                })
            }
            // e.target.value="";

        
    }

    function getOrderList(key, typeOrder){
        dispatch(getOrderAll(key)).then(res=>{
            const _data = res.data || {};
            setPerPage(_data.per_page);
            setTotal(_data.total);
            if(typeOrder=='Auction'){
                getNameProductAuction(_data);
            }else if(typeOrder=='payment'){
                getSupplierPayment(_data);
            }else{
               
                setListOrder(_data.data);
            }
           
        })
    }
    function getNameProductAuction(_data){
       
            const arrItem = _data.data || [];
            if(arrItem.length>0){
            arrItem.forEach((val,key)=>{
                if(val.items.length>0){
                    var produtID = val.items[0].product_id;
                    dispatch(getProductList(produtID)).then((res)=>{
                        const arrData = res.data.data || [];
                        if(arrData.length>0){
                            if(arrData[0].id == produtID){
                                val['product']={
                                    id: arrData[0].id,
                                    name: arrData[0].name
                                }
                            }
                        }
                        if(key==arrItem.length-1){
                            setListOrder(arrItem);
                        }
                    })

                }
            })
        }else{
            setListOrder(arrItem);
        }
        }

    function getSupplierPayment(_data){
        const arrItem = _data.data || [];
        if(arrItem.length>0){
            arrItem.forEach((val, key)=>{
                if(val.items.length>0){
                    var supplierID = val.items[0].supplier_id;
                    dispatch(getSupplierList(supplierID)).then((res)=>{
                        const arrData = res.data.data || [];
                        if(arrData.length>0){
                            if(arrData[0].id==supplierID){
                                val['supplier']={
                                    name: arrData[0].name,
                                    address: arrData[0].address
                                }
                            }
                        }
                        if(key==arrItem.length-1){
                            setListOrder(arrItem);
                        }
                    })
                }
            })
        }else{
            setListOrder(arrItem);
        }
    
    }
    const getHandlerTableChange = (e) => {}
    const dispatch = useDispatch()
    let location = useLocation();

    useEffect(() => {
        var orderType = 'retail';
        if(location.pathname.includes('wholesale')){
            setTypeOrder('wholesale');
            orderType = 'wholesale';
        }else if(location.pathname.includes('auction')){
            setTypeOrder("Auction");
            orderType= "Auction"
        }else if (location.pathname.includes('shipment')){
            setTypeOrder("shipment");
            orderType= "shipment"
        }else if (location.pathname.includes('payment')){
            setTypeOrder("payment");
            orderType= "payment"
        }else{
            setTypeOrder("retail");
            orderType= "retail"
        }
        getOrderList('with=cost;items;trackings&search='+orderType+'&searchFields=director.type.id&orderBy=created_at&sortedBy=desc', orderType);
        dispatch(getStatusOrder()).then((res)=>{
            const _data = res.data || [];
            var result = [{value:'',label:'--- Tất cả ---'}];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name
                });
            }
            setStatusList(result);
        });

    }, [dispatch,location]);


    function statusChange(object){
        setStatusSelect(object.value);
        if(object.value==''){
            getOrderList('with=cost;items;trackings&search=director.type.id:'+typeOrder+'&searchJoin=and&orderBy=created_at&sortedBy=desc', typeOrder)
        }else{
            getOrderList('with=cost;items;trackings&search=director.type.id:'+typeOrder+';director.status.id:'+object.value+'&searchJoin=and&orderBy=created_at&sortedBy=desc', typeOrder)
        }
       
    }
    function balanceFormatter(cell, row){
        return (
            <>
            {row?.cost.balance?Number(row?.cost.balance).toFixed(1):0}
            </>
        )
    }
    const columns = [
        {
            dataField: "id",
            text: "Mã đơn ",
            headerStyle: { color: 'black' },
            //  headerStyle: { fontWeight: 'bold' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "customer_id",
            text: "Khách hàng",
        },
        {
            dataField: "status",
            text: "Trạng thái",
            formatter: statusFormatter,
        },
        {
            dataField: "cost.balance",
            text: "Đơn giá",
            formatter: balanceFormatter,
        },
        {
            dataField: "note",
            text: "Ghi chú",
        },
        {
            dataField: "created_at",
            text: "Cập nhật lúc",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            onSort: (field, order) => {
                getOrderList('with=cost;items;trackings&search=director.type.id:'+typeOrder+'&orderBy=created_at&sortedBy='+order, typeOrder)
              }
        },
        {
            dataField: "type.name",
            text: "Loại đơn",
            sort: true,
            formatter: typeFormater

        }
    ]


    const columnsPayment = [
        {
            dataField: "id",
            text: "Mã đơn ",
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "customer_id",
            text: "Khách hàng"
        },
        {
            dataField: "status",
            text: "Trạng thái",
            formatter: statusFormatter,
        },
        {
            dataField: "cost.balance",
            text: "Đơn giá",
            formatter: balanceFormatter,
        },
        {
            dataField: "vv",
            text: "Nhà cung cấp",
            formatter: supplierFormatter,
        },

        {
            dataField: "note",
            text: "Ghi chú"
        },
        {
            dataField: "updated_at",
            text: "Cập nhật lúc",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            onSort: (field, order) => {
                getOrderList('with=cost;items;trackings&search=director.type.id:'+typeOrder+'&orderBy=created_at&sortedBy='+order, typeOrder)
              }
        },
        {
            dataField: "type.name",
            text: "Loại đơn"

        }

        ]
    function supplierFormatter(cell, row){
        return (
            <>
                <div className="font-weight-bold">{
                    row?.supplier?.name?row?.supplier?.name:'Rakuten'
                }</div>
                <div>{
                    row?.supplier?.address?row?.supplier?.address:'Ông Ích Khiêm, Hải Châu, Đà Nẵng'}</div>

            </>
        )
    }
    const columnsAuction = [
        {
            dataField: "id",
            text: "Mã đơn ",
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "customer_id",
            text: "Khách hàng",
        },
        {
            dataField: "status",
            text: "Trạng thái",
            formatter: statusFormatter,
        },
        {
            dataField: "jancode",
            text: "Jancode",
            formatter: productFormatter,
            headerStyle: {textAlign: 'center'},
            style:{textAlign: 'center'}
        },
        {
            dataField: "shipment_infor_id",
            text: "Đơn giá",
        },
        {
            dataField: "note",
            text: "Ghi chú"
        },
        {
            dataField: "updated_at",
            text: "Cập nhật lúc",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            onSort: (field, order) => {
                getOrderList('with=cost;items;trackings&search=director.type.id:'+typeOrder+'&orderBy=created_at&sortedBy='+order, typeOrder)
              }
        },
        {
            dataField: "type.name.vi",
            text: "Loại đơn",

        }

    ]
    function productFormatter(cell, row){
        return (
            <>
                {/* <div className="font-weight-bold">{row?.product?.name?row?.product?.name:'Máy sấy tóc Nhật Bản'}</div>
        <div>{row?.product?.id?row?.product?.id:'23241'}</div> */}
        {
            row.items.length>0?
            row.items.map((val,key)=>
                <span key={key+'jancode'}>
                    {
                        row.items.length>1?
                            key != row.items.length-1?
                            val?.product_id+';'
                            :val?.product_id
                        :
                        val?.product_id
                    }
                </span>
            )
            :''
        }

            </>
        )
    }
    const columnsShipping = [
        {
            dataField: "id",
            text: "Mã đơn ",
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "customer_id",
            text: "Khách hàng",
        },
        {
            dataField: "status",
            text: "Trạng thái",
            formatter: statusFormatter,
        },
        {
            dataField: "note",
            text: "Ghi chú",
        },
        {
            dataField: "updated_at",
            text: "Cập nhật lúc",
            sortCaret: sortCaret,
            headerSortingClasses,
            onSort: (field, order) => {
                getOrderList('with=cost;items;trackings&search=director.type.id:'+typeOrder+'&orderBy=created_at&sortedBy='+order, typeOrder)
              }
        },
        {
            dataField: "tr",
            text: "Danh sách tracking",
            formatter: trackingFormatter,
        },
        {
            dataField: "type.name",
            text: "Loại đơn"

        }
    ]
    function trackingFormatter(cell, row){
        return (
            <>
              {row.trackings.map((track, i) =>
                track.checked ? (
                  <div key={i} className="mb-1">
                    <span className="badge badge-info">{track.code}</span>
                  </div>
                ) : (
                  <div key={i} className="mb-1">
                    <span className="badge badge-light">{track.code}</span>
                  </div>
                )
              )}
            </>
          );
    }
    function statusFormatter(cell, row){
        return (
            <>
                {row.status.id==='Approved'?
                    <span className="label label-lg label-light-info label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                    {row.status.name}
                    </span>
                    :
                    row.status.id==='Pending'?
                        <span className="label label-lg label-light-primary label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                    {row.status.name}
                    </span>
                        :
                        row.status.id==='Cancelled'?
                            <span className="label label-lg label-light-danger label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                    {row.status.name}
                    </span>:
                    row.status.id==='Finish'?
            <span className="label label-lg label-light-success label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                    {row.status.name}
                    </span>:
                    row.status.id==='Purchased'?
                    <span className="label label-lg label-light-warning label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                            {row.status.name}
                            </span>:
                             <span className="label label-lg label-light-dark label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                             {row.status.name}
                             </span>
                }
            </>
        )
    }

    function typeFormater(cele, row){
        return (
            <>
            <span>
                <span className="label label-primary label-dot mr-2" style={{marginLeft: '0', marginTop: '0'}}></span>
                {
                    row.type.id=='Retail'?
                <span className="font-weight-bold text-primary" >{row.type.name}</span>:
                row.type.id=='Wholesale'?
                <span className="font-weight-bold text-danger">{row.type.name}</span>:
                row.type.id =='Auction'?
                <span className="font-weight-bold text-success">{row.type.name}</span>:
                row.type.id =='Shipment'?
                <span className="font-weight-bold text-info">{row.type.name}</span>:
                <span className="font-weight-bold text-warning">{row.type.name}</span>
                }
               
            </span>
            </>
        )
    }

    const options = {
        hideSizePerPage: true,
        sizePerPage:perPage,
        totalSize:total,
        onPageChange: (page, sizePerPage) => {
            console.log(page)
            getOrderList('with=cost;items;trackings&search='+typeOrder+'&searchFields=director.type.id&page='+page, typeOrder);

        },
    };


    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            history.push('/admin/orders/'+row.id);
        }
    };

   
    return (
        <React.Fragment>

        <Card>
            <CardHeader title="Danh sách đơn hàng">
                <CardHeaderToolbar>
                    {
                        typeOrder=='wholesale'?
                        <Link to={'/admin/orders/create-wholesale'}
                        type="button"
                        className="btn btn-primary"
                  ><i className="fa fa-plus"></i>
                      Tạo đơn sỉ
                  </Link>
                        :
                        typeOrder=='shipment'?
                    <Link to={'create-shippingpartner'}
                          type="button"
                          className="btn btn-primary ml-1 mr-1"
                    ><i className="fa fa-plus"></i>
                        Tạo đơn vận chuyển hộ
                    </Link>
                        : 
                        typeOrder =='payment'?
                        <Link to={'create-paymentpartner'}
                        type="button"
                        className="btn btn-primary"
                  ><i className="fa fa-plus"></i>
                      Tạo đơn thanh toán hộ
                  </Link>
                        :''
                    }
                 
                    
                   
                </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    <div className="row">
                        <div className="col-3 pl-0">

                            <Form.Control as="select" onChange={onFindChange}>
                                <option value=''>Tất cả</option>
                                <option value='id'>Mã đơn hàng</option>
                                <option value='customer_id'>Khách hàng</option>
                                <option value='note'>Ghi chú</option>
                                <option value='status'>Trạng thái</option>
                                {/* <option value='director.type.name'>Loại đơn</option> */}
                                <option value='items.product_id'>Mã hàng hoá</option>
                                {
                                    typeOrder==='shipment'?
                                        <option value='tracking.code'>Mã tracking</option>
                                        :
                                        typeOrder==='payment'?
                                            <option value='supplier.name'>Nhà cung cấp</option>:''

                                }
                            </Form.Control>
                        </div>
                        <div className="col-9 pr-0">
                            {
                                typeSearch=='status'?
                                <Select
                                                value={statusList.filter(
                                                    (obj) => obj.value === statusSelect
                                                )}
                                                options={statusList}
                                                onChange={statusChange}
                                            />:
                                            <FormControl
                                            placeholder="Nội dung tìm kiếm"
                                            onChange={onKeySearch}
                                        />
                            }
                           
                        </div>

                    </div>

                    <div className="row mt-2">
                        <div className="col-12 pl-0">
                            <BootstrapTable
                                wrapperClasses="table-responsive table-hover"
                                classes="table table-head-custom table-vertical-center overflow-hidden"
                                remote
                                rowStyle={{cursor: "pointer"}}
                                bordered={false}
                                keyField='id'
                                data={listOrder}
                                columns={
                                    typeOrder==='shipment'?
                                        columnsShipping:
                                        typeOrder === 'payment'?
                                            columnsPayment:
                                            typeOrder==='Auction'?
                                                columnsAuction:columns

                                }
                                onTableChange={getHandlerTableChange}
                                rowEvents={ rowEvents }
                                pagination={paginationFactory(options)}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

        </React.Fragment>

    );
}


