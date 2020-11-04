import React, { useEffect, useState } from 'react';

import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
// import '../../../assets/css/wizard.wizard-4.css';
import "../../../assets/css/wizard.wizard-4.css"
import '../../../assets/css/style-main.css'
import swal from 'sweetalert';
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import {
    getSFA,
    getBoxes,
    getBoxItemAll,
    updateCostBox,
    getShelve,
    updateBox,
    deleteBox,
    deleteBoxChild,
    createBoxChild,
    searchProductBy,
    updateBoxChild,
    updateLocalBox,
    getPallets,
    getShelveId
} from '../../_redux_/warehouseSlice';
import { useDispatch } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import { Button, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import Select from 'react-select';
import paginationFactory from 'react-bootstrap-table2-paginator';



export function BoxDetail() {

    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );

    let [orderNumerical, setOrderNumerical] = useState(1);
    let [orderNumericals, setOrderNumericals] = useState(1);
    const history = useHistory();
    let location = useLocation();



    //modal update SFA
    // const [checkModal, setCheckModal] = useState(false)
    // const [tracking, setTracking] = useState('');
    // const [coupon, setCoupon] = useState('');
    // const [shipping, setShipping] = useState('')

    //modal create Box  of SFA
    // const [checkModalBox, setCheckModalBox] = useState(false)
    // const [palledId, setPalledId] = useState('')
    // const [quantityBox, setQuantityBox] = useState('')
    // const [boxParentId, setBoxParentId] = useState('')
    // const [orderId, setOrderId] = useState('')
    // const [ladingBillId, setLadingBillId] = useState('')



   
    // const [palletList, setPalletList] = useState([])
    // const [boxParentList, setBoxParentList] = useState([])
    // const [laddingBillList, setLaddingBillList] = useState([])
    // const [orderList, setOrderList] = useState([])


    //get Box
    const [box, setBox] = useState([])
    const [boxCost, setBoxCost] = useState([])
    const [boxLaddingBills, setBoxLaddingBill] = useState([])
    const [boxPallet, setBoxPallet] = useState([])
    const [boxItems, setBoxItem] = useState([])

    //table chill box and content product
    const [totals, setTotals] = useState(0);
    const [perPages, setPerPages] = useState(0);
    const [itemList, setItemList] = useState([])
    const [products, setProduct] = useState([])
    // const [quantityProduct, setQuantityProduct] = useState([])

    //update cost
    const [checkModalCost, setCheckModalCost] = useState(false)
    const [additional, setAdditional] = useState(0)
    const [storage, setStorage] = useState(0)
    const [balance, setBalance] = useState(0)
    const [shippingCost, setShippingCost] = useState(0)
    const [shippingInside, setShippingInside] = useState(0)

    //update local box
    const [checkModalLocal, setCheckModalLocal] =  useState(false)
    const [idPallet, setIdPallet] = useState('')
    const [columnPallet, setColumnPallet] = useState('')
    const [floorPallet, setFloorPallet] = useState('')
    const [rowPallet, setRowPallet] = useState('')
    const [idShelve, setIdShelve] = useState('')
    const [columnShelve, setColumnShelve] = useState('')
    const [floorShelve, setFloorShelve] = useState('')
    const [rowShelve, setRowShelve] = useState('')
    const [shelveList, setShelveList]= useState([])
    // const [perPagesShelve, setPerPagesShelve] = useState('');
    // const [totalsShelve, setTotalsShelve] = useState('');
    const [area, setArea] = useState('')


    //update box
    const [checkModalUpdateBox, setCheckModalUpdateBox] = useState(false)
    const [SFAList, setSFAList] = useState([])
    const [idSFA, setIdSFA] = useState('');
    const [weight, setWeight] = useState('')
    const [length, setLength] = useState('')
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [quantity, setQuantity] = useState('');

    //create Box Childs 
    const [checkModalCreateBoxChild, setCheckModalCreateBoxChild] = useState(false)
    const [quantityBoxChild, setQuantityBoxChild] = useState(0)
    const [idProduct, setIdProduct] = useState('')
    const [valueSearch, setValueSearch] = useState('')
    const [arrProducts, setArrProducts] = useState([]);
    const [showFowY, setShowFlowY] = useState(true);
    const [typeProduct, setTypeProduct] = useState("name");
    const [productObject, setProductObject] = useState({
        id: ""
    });
    // const [selectedValue, setSelectedValue] = useState(0);
    


    //update Info Box Child
    const [checkModalBoxUpdate, setCheckModalBoxUpdate] = useState({
        checkModal: false,
        id:'',
        quantity:'',
        idProduct:''
    })
    // const [quantityBoxChilds, setQuantityBoxChilds] = useState('')


    //get Box parent
    // const [boxParent, setBoxParent] = useState({})
    
    const [palletsList, setPalletsList] = useState([])


    //update quantity product
    const [checkModalUpdateQuantity, setModalUpdateQuantity]= useState(false)
    const [idProductItem, setIdProductItem] = useState('')
    const [quantityProducts, setQuantityProducts] = useState('')
    const [idItem, setIdItem] = useState('')


    //create product in box
    // const [checkFormTracking, setCheckFormTracking] = useState('');
    // const [idProductInBox, setIdProductInBox] = useState('')
    // const [quantityProductInBox, setQuantityProductInBox] = useState('')


    const getHandlerTableChange = (e) => { }

    useEffect(() => {


        getBoxes(ids).then(result => {

            //get Item list on table DANH SACH SAN PHAM

            getItemList()
            

            setBox(result.data)
            setBoxCost(result.data?.cost)
            setBoxLaddingBill(result.data?.lading_bill)
            setBoxPallet(result?.data?.pallet)
            setBoxItem(result.data?.items)
            
           

            setAdditional(result.data?.cost?.additional)
            setStorage(result.data?.cost?.storage)
            setBalance(result.data?.cost?.balance)
            setShippingCost(result.data?.cost?.shipping)
            setShippingInside(result.data?.cost?.shipping_inside)


            setIdPallet (result?.data?.pallet?.id)
            setColumnPallet(result.data?.pallet?.column)
            setFloorPallet(result.data?.pallet?.floor)
            setRowPallet(result.data?.pallet?.row)
            

            setIdShelve (result?.data?.pallet?.shelve?.id)
            setColumnShelve(result.data?.pallet?.shelve?.column)
            setFloorShelve(result.data?.pallet?.shelve?.floor)
            setRowShelve(result.data?.pallet?.shelve?.row)

            setArea(result.data?.pallet?.shelve?.area?.name)
            
            

            // getBoxParents(ids).then(result => setBoxParent(result.data?.parent))

            setIdSFA(result.data.sfa_id)
            setWeight(result.data.weight)
            setLength(result.data.length)
            setWidth(result.data.width)
            setHeight(result.data.height)
            setQuantity(result.data.quantity)

           

        })

    }, [location]);

    const dispatch = useDispatch();

    function getItemList(object) {
        dispatch(getBoxItemAll(object, ids)).then(res => {
            const _data = res.data || {};
            setPerPages(_data.per_page);
            setTotals(_data.total);
            setItemList(_data.data);



            dispatch(getShelve()).then(res => {

  
                const _data = res.data.data || [];
    
                const pageLast = res.data.last_page;
    
                if (pageLast > 1) {
                    var arrDataList = [];
                    arrDataList = arrDataList.concat(_data);
                    for (var i = 2; i <= pageLast; i++) {
                        dispatch(getShelve(i)).then((respon) => {
                            var arrData = respon.data.data || [];
    
                            arrDataList = arrDataList.concat(arrData);
                            // console.log(i, pageLast);
                            if (i > pageLast) {
                                // console.log(arrDataList);
                                var result = [];
                                for (var j = 0; j < arrDataList.length; j++) {
                                    result.push({
                                        value: arrDataList[j].id,
                                        label: arrDataList[j].id,
                                        column: arrDataList[j].column,
                                        floor:arrDataList[j].floor,
                                        row: arrDataList[j].row
                                    });
                                }
                                // console.log('result 1:',result);
                                setShelveList(result);
    
                            }
                        });
                    }
                } else {
    
                    var result = [];
                    for (var i = 0; i < _data.length; i++) {
                        result.push({
                            value: _data[i].id,
                            label: _data[i].id,
                            column: _data[i].column,
                            floor:_data[i].floor,
                            row: _data[i].row
                        });
                    }
                    // console.log('result 2:',result);
                    setShelveList(result);
    
                }


                 dispatch(getSFA()).then(res => {
                    const _data = res.data.data || [];
    
                    const pageLast = res.data.last_page;
    
                    if (pageLast > 1) {
                        var arrDataList = [];
                        arrDataList = arrDataList.concat(_data);
                        for (var i = 2; i <= pageLast; i++) {
                            dispatch(getSFA(i)).then((respon) => {
                                var arrData = respon.data.data || [];
    
                                arrDataList = arrDataList.concat(arrData);
                                // console.log(i, pageLast);
                                if (i > pageLast) {
                                    // console.log(arrDataList);
                                    var result = [];
                                    for (var j = 0; j < arrDataList.length; j++) {
                                        result.push({
                                            value: arrDataList[j].id,
                                            label: arrDataList[j].id,
                                        });
                                    }
                                    // console.log(result);
                                    setSFAList(result);
    
                                }
                            });
                        }
                    } else {
    
                        var result = [];
                        for (var i = 0; i < _data.length; i++) {
                            result.push({
                                value: _data[i].id,
                                label: _data[i].id,
                            });
                        }
                        setSFAList(result);
    
                    }

                    dispatch(getPallets()).then(res => {
                        const _data = res.data.data || [];
        
                        const pageLast = res.data.last_page;
        
                        if (pageLast > 1) {
                            var arrDataList = [];
                            arrDataList = arrDataList.concat(_data);
                            for (var i = 2; i <= pageLast; i++) {
                                dispatch(getPallets(i)).then((respon) => {
                                    var arrData = respon.data.data || [];
        
                                    arrDataList = arrDataList.concat(arrData);
                                    // console.log(i, pageLast);
                                    if (i > pageLast) {
                                        // console.log(arrDataList);
                                        var result = [];
                                        for (var j = 0; j < arrDataList.length; j++) {
                                            result.push({
                                                value: arrDataList[j].id,
                                                label: arrDataList[j].id,
                                                shelve_id: arrDataList[j].shelve_id,
                                                row: arrDataList[j].row,
                                                column: arrDataList[j].column,
                                                floor: arrDataList[j].floor
                                            });
                                        }
                                        // console.log(result);
                                        setPalletsList(result);
        
                                    }
                                });
                            }
                        } else {
        
                            var result = [];
                            for (var i = 0; i < _data.length; i++) {
                                result.push({
                                    value: _data[i].id,
                                    label: _data[i].id,
                                    shelve_id: _data[i].shelve_id,
                                    row: _data[i].row,
                                    column: _data[i].column,
                                    floor: _data[i].floor
                                });
                            }
                            setPalletsList(result);
        
                        }
                    })
                })
            })
           
            // setProduct(_data.data.map(item => item?.product))
            // setQuantityProduct(_data.data?.quantity);

        })

       
    }

    // function getShelve(object) {
    //     dispatch(getShelveAll(object)).then(res => {
    //         const _data = res.data || {};
    //         setPerPagesShelve(_data.per_page);
    //         setTotalsShelve(_data.total);
    //         setShelveList(_data.data);

    //     })
    // }


    const options = {
        hideSizePerPage: true,
        sizePerPage: perPages,
        totalSize: totals,
        onPageChange: (page, sizePerPage) => {
            getItemList('page=' + page)
            setOrderNumerical(15 * (page - 1) + 1)
        },
    };
    const optionsProduct = {
        hideSizePerPage: true,
        sizePerPage: perPages,
        totalSize: totals,
        onPageChange: (page, sizePerPage) => {
            getItemList('page=' + page)
            setOrderNumericals(15 * (page - 1) + 1)
        },
    };
    // console.log(boxCost)

    //     function LeftPadWithZeros(number, length)
    // {
    //     var str = '' + number;
    //     while (str.length < length) {
    //         str = '1' + str;
    //     }

    //     return str;
    // }
    // console.log()

    const columnsChillBox = [
        {
            dataField: "stt",
            text: "Số thứ tự",
            sort: true,

        },
        {
            dataField: "id",
            text: "Mã thùng hàng ",
            sort: true,
            style: {
                fontWeight: "bold"
            },
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        // {
        //     dataField: "box_id",
        //     text: "Mã thùng hàng",
        //     sort: true,
        // },
        {
            dataField: "volume",
            text: "Thể Tích",
            sort: true,
        },
        {
            dataField: "weight",
            text: "Trọng Lượng",
            sort: true,
        },

        {
            dataField: "quantity",
            text: "Số lượng",
            sort: true,
            style: {
                fontWeight: "500"
            }
        },
        // {
        //     dataField: "created_at",
        //     text: "Ngày nhận hàng",
        //     sort: true,
        //     style: {
        //         fontWeight: "500"
        //     },

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



    const columnsContentProduct = [
        {
            dataField: "stt",
            text: "Số thứ tự",
            sort: true,

        },
        {
            dataField: "id",
            text: "Sản Phẩm",
            sort: true,
            style: {
                fontWeight: "bold"
            },
            formatter: productFormatter
        },
        // {
        //     dataField: "name",
        //     text: "Tên Sản Phẩm",
        //     sort: true,
        // },
        {
            dataField:'quantity',
            text: 'Số Lượng',
            sort:true
        },
        // {
        //     dataField: "price",
        //     text: "Gía",
        //     sort: true,
        //     style: {
        //         fontWeight: "500"
        //     }
        // },
        // {
        //     dataField: "origin_name",
        //     text: "Xuất xứ ",
        //     sort: true,
        //     style: {
        //         fontWeight: "500"
        //     }
        // },

        // {
        //     dataField: "unit_name",
        //     text: "Đơn Vị ",
        //     sort: true,
        //     style: {
        //         fontWeight: "500"
        //     },
    
        // },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: rankFormatterProduct,
            style: {
                minWidth: "100px",
            }
        },

    ]
    function productFormatter(cell, row) {
        return (
          <>
            <div className="font-weight-bolder" style={{fontSize:'15px'}}>{row?.product_id}</div>
            <div className="font-weight-bolder" style={{fontSize:'15px'}}>{row?.product?.name}</div>
            {/* <div>
              Tổng tiền: <span className="text-primary" style={{ fontSize: '15px' }}>{row.balance}</span>{" "}
            </div> */}
          </>
        );
      }

    // console.log(balance, shippingInside)

    const onShelveChange = (e) => {
        setIdShelve(e.value)
        setRowShelve(e.row)
        setFloorShelve(e.floor)
        setColumnShelve(e.column)
        

    }

    const onPalletChange = (e) => {
        setIdPallet(e.value)
        setRowPallet(e.row)
        setFloorPallet(e.floor)
        setColumnPallet(e.column)
        setIdShelve(e.shelve_id)
        getShelveId(e.shelve_id).then(result => {
            setColumnShelve(result.data?.column)
            setFloorShelve(result.data?.floor)
            setRowShelve(result.data?.row)
            setArea(result.data?.area_id)
        })
        

    }


    const onSelectedSFAChange = (e) => {
        setIdSFA(e.value)

    }

    // const onRowPalletChange = (e) => {
    //     setRowPallet(e.value)

    // }

    // const onColumnShelveChange = (e) => {
    //     setColumnShelve(e.value)

    // }
    // const onFloorShelveChange = (e) => {
    //     setFloorShelve(e.value)

    // }

    // const onRowShelveChange = (e) => {
    //     setRowShelve(e.value)

    // }

    const handleInputChange = (e) => {

        setValueSearch(e.target.value)
        setShowFlowY(true);
        if (e.target.value) {
          if (typeProduct === 'id') {
            dispatch(searchProductBy('id:' + e.target.value)).then((data) => {
              setArrProducts(data.data.data);
            })
          } else {
            dispatch(searchProductBy('name:' + e.target.value)).then((data) => {
              setArrProducts(data.data.data);
            })
          }
        } else {
          setArrProducts([]);
        }
    
    
    }

    const handleInputChanges = (e) => {
        setCheckModalBoxUpdate({checkModal:true,idProduct: e.target.value})
        // setValueSearch(e.target.value)
        setShowFlowY(true);
        if (e.target.value) {
          if (typeProduct === 'id') {
            dispatch(searchProductBy('id:' + e.target.value)).then((data) => {
              setArrProducts(data.data.data);
            })
          } else {
            dispatch(searchProductBy('name:' + e.target.value)).then((data) => {
              setArrProducts(data.data.data);
            })
          }
        } else {
          setArrProducts([]);
        }
    
    
    }

   

    const onProductChange = (values) => {
        if (values) {
          setValueSearch(values.name)
          setProductObject(values);
        //   console.log(object);
        //   if (object.id) {
        //     setSelectedValue(object.value);
        //   }else{
        //     setSelectedValue([0].value);
        //   }
          setIdProduct(values.id)    
          setShowFlowY(false)
        }
      };

      const onProductChanges = (values) => {
        console.log(checkModalBoxUpdate);

      };


    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string?.slice(1);
    }

    function rankFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Chi tiết</Tooltip>}
                >
                    <Link 
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                        onClick={() => setCheckModalBoxUpdate({
                            checkModal:true,
                            id:row.id,
                            quantity:row.quantity,
                            idProduct: row.product_id
                        }) }
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
                    overlay={<Tooltip>Xoá Thùng Hàng  </Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => {
                            swal({
                                title: "Bạn có muốn xoá thùng hàng " + row.id + " ?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["Huỷ", "Xoá"],
                            })
                                .then((willDelete) => {
                                    if (willDelete) {
                                        deleteBoxChild(row.id).then(() => {
                                            swal("Đã xoá thành công!", {
                                                icon: "success",
                                            }).then(history.push("admin/boxdetail/"+ ids));
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

    function rankFormatterProduct(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Cập nhập</Tooltip>}
                >
                    <Link 
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                        onClick={() => {
                            setModalUpdateQuantity(true)
                            setQuantityProducts(row.quantity)
                            setIdProductItem(row?.product_id)
                            setIdItem(row?.id)
                        }}
                    >
                        <span className="svg-icon svg-icon-md svg-icon-primary">
                            <SVG
                                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                            />
                        </span>
                    </Link>
                </OverlayTrigger>
                <>
                </>
                
                <OverlayTrigger
                    overlay={<Tooltip>Xoá Sản Phẩm</Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => {
                            swal({
                                title: "Bạn có muốn xoá thùng hàng " + row.id + " ?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["Huỷ", "Xoá"],
                            })
                                .then((willDelete) => {
                                    if (willDelete) {
                                        deleteBoxChild(row.id).then(() => {
                                            swal("Đã xoá thành công!", {
                                                icon: "success",
                                            }).then(history.push("admin/boxdetail/"+ ids));
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
 
    // console.log('box',idPallet)
    
    // Object.keys(boxParent).map(function(key, index) {
        
    //   });
    // console.log('pallets',palletsList)

    // console.log('products',products)
    // console.log('itemList', itemList)
    // console.log('quantity', quantityProducts)
 

   
    return (

        <div>
            <div className="card card-custom " style={{ height: "10%" }}>
                <CardHeader title="Thông tin chi tiết thùng hàng" >
                    <CardHeaderToolbar>

                        <Link
                            type="button"
                            className="btn btn-danger "
                            to={'/admin/warehouse'}
                            style={{ marginRight: "5px" }}
                        >
                            <i className="fa fa-arrow-left"></i>
                            Trở về
                        </Link>
                        <Link   
                            type="button"
                            className="btn btn-secondary "
                            style={{ marginRight: "5px" }}
                            onClick={() => {
                                deleteBox(ids)
                                    .then((res) => {
                                        swal("Đã cập nhật thành công!", {
                                            icon: "success",
                                        }).then(history.push("/admin/box"));
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        swal("Cập nhật không thành công!", {
                                            icon: "warning",
                                        });
                                    })
                            }}
                        >
                            <i class="far fa-trash-alt"></i>
                            Xoá Thùng Hàng
                        </Link>
                    </CardHeaderToolbar>
                </CardHeader>
            </div>
            <div className='row'>
            <div className='col-3' style={{ marginTop: '1%' }}>
                <div >
                    <Card style={{ height: '100%' }}>
                        <CardHeader title={"Chi tiết thùng hàng "}>
                            <CardHeaderToolbar>
                                <OverlayTrigger
                                    overlay={<Tooltip>Cập nhập</Tooltip>}
                                >

                                    <Link
                                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                        style={{ float: "right" }}
                                        onClick={() => setCheckModalUpdateBox(true)}
                                    >
                                        <span className="svg-icon svg-icon-md svg-icon-primary">
                                            <SVG
                                                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                                            />
                                        </span>
                                    </Link>
                                </OverlayTrigger>


                            </CardHeaderToolbar>
                        </CardHeader>

                        <CardBody style={{ height: '100%' }} >
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-success align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Mã Thùng:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {box?.id}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-primary align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Mã SFA:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {box?.sfa_id}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-warning align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Thể tích :</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder" style={{display:'flex'}}>
                                        {box?.volume} <div style={{marginLeft:'5%'}}> ( {box?.length} |  {box?.width} | {box?.height} )</div>
                                    </span>

                                </div>
                            </div>

                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-info align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Trọng Lượng:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {box?.weight}
                                    </span>

                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-success align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Số Lượng:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {box?.quantity}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-warning align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Mã Vận Đơn:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {box?.lading_bill_id}
                                    </span>

                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-dark align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Mã Đơn Hàng:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {box?.order_id}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-muted align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Ngày Nhận Hàng:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {box?.created_at}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-danger align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Ngày Cập Nhập:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {box?.updated_at}
                                    </span>

                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div >
                    <Card style={{ height: '100%',marginTop: '-4%' }}>
                        <CardHeader title={"Vị trí thùng hàng"}>
                            <CardHeaderToolbar>
                                <OverlayTrigger
                                    overlay={<Tooltip>Cập nhập</Tooltip>}
                                >

                                    <Link
                                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                        style={{ float: "right" }}
                                        onClick={() => {
                                            setCheckModalLocal(true)
                                            // console.log(idShelve)
                                        }}
                                    >
                                        <span className="svg-icon svg-icon-md svg-icon-primary">
                                            <SVG
                                                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                                            />
                                        </span>
                                    </Link>
                                </OverlayTrigger>


                            </CardHeaderToolbar>
                        </CardHeader>

                        <CardBody style={{ height: '100%' }} >
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-success align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Area:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {boxPallet?.shelve?.area?.name}
                                    </span>

                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-primary align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Pallet:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {boxPallet?.column} | {boxPallet?.floor} | {boxPallet?.row}
                                    </span>
                                </div>
                            </div>
       

                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-warning align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Shelve:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {boxPallet?.shelve?.column} | {boxPallet?.shelve?.floor} | {boxPallet?.shelve?.row}
                                    </span>
                                </div>
                            </div>

                       
                        </CardBody>
                    </Card>
                </div>

                <div >
                    <Card style={{ height: '100%',marginTop: '-4%' }}>
                        <CardHeader title={"Thông tin chi phí "}>
                            <CardHeaderToolbar>
                                <OverlayTrigger
                                    overlay={<Tooltip>Cập nhập</Tooltip>}
                                >

                                    <Link
                                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                        style={{ float: "right" }}
                                        onClick={() => setCheckModalCost(true)}
                                    >
                                        <span className="svg-icon svg-icon-md svg-icon-primary">
                                            <SVG
                                                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                                            />
                                        </span>
                                    </Link>
                                </OverlayTrigger>


                            </CardHeaderToolbar>
                        </CardHeader>

                        <CardBody style={{ height: '100%' }} >
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-success align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Phí Vận Chuyển Về VN:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {boxCost?.shipping}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-primary align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Phí Lưu Kho:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {boxCost?.storage}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-warning align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Phụ Phí:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {boxCost?.additional}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-info align-self-stretch" ></span>

                                <label className="col-6 col-form-label">Phí Vận Chuyển Nội Địa Nhật:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {boxCost?.shipping_inside}
                                    </span>
                                </div>                             
                            </div>

                            <div className="form-group row my-2">
                                <span className="bullet bullet-bar bg-success align-self-stretch" ></span>
                                <label className="col-6 col-form-label">Tổng Phí:</label>
                                <div className="col-5">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        {boxCost?.balance}
                                    </span>
                                </div>
                               
                            </div>

                          
                        </CardBody>
                    </Card>
                </div>

                
                

            </div>

            <div class='col-9' style={{ marginTop: '1%' }}>
                <div  >
                    {/* <form className="form form-label-right" style={{ marginBottom: "0", height:'100%' }} >
                        <Card style={{ marginBottom: "0", height:'100%' }}>
                            <CardHeader title="Danh sách thùng hàng cha/ thùng hàng con">
                                <CardHeaderToolbar>
                                    <Link
                                        onClick={() => setCheckModalCreateBoxChild(true) }
                                        type="button"
                                        className="btn btn-primary"
                                        ><i className="fa fa-plus"></i>
                                        Tạo thùng hàng 
                                    </Link>
                                </CardHeaderToolbar>
                            </CardHeader>
                            <CardBody>
                                <BootstrapTable
                                    wrapperClasses="table-responsive table-hover"
                                    classes="table table-head-custom table-vertical-center overflow-hidden"
                                    remote
                                    // hover
                                    rowStyle={{ cursor: "pointer" }}
                                    bordered={false}
                                    keyField='id'
                                    // data={rows === null ? [] : rows?.map(supp => ({
                                    //     ...supp,
                                    //     stt: 1,

                                    // }))}
                                    data={itemList.map(box => ({
                                        ...box,
                                        stt: orderNumerical++,


                                    }))}
                                    columns={columnsChillBox}
                                    onTableChange={getHandlerTableChange}
                                    // rowEvents={rowEvents}
                                    pagination={paginationFactory(options)}
                                />
                            </CardBody>
                        </Card>

                    </form> */}


                </div>

                <div   >
                    <form className="form form-label-right" style={{ marginBottom: "0", height:'100%' }} >
                        <Card style={{ marginBottom: "0", height:'100%' }}>
                            <CardHeader title="Danh sách sản phẩm">
                                <CardHeaderToolbar>
                                    <OverlayTrigger
                                    overlay={<Tooltip>Thêm sản phẩm vào thùng</Tooltip>}>
                                        <Link
                                            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                            style={{ float: "right" }}
                                            onClick={() => {
                                                setCheckModalLocal(true)
                                            // console.log(idShelve)
                                            }}
                                    >
                                            <span className="svg-icon svg-icon-md svg-icon-primary">
                                                <SVG
                                                    src={toAbsoluteUrl("/media/svg/icons/Files/File-plus.svg")}
                                                />
                                            </span>
                                    </Link>
                                </OverlayTrigger>
                                </CardHeaderToolbar>
                            </CardHeader>
                            <CardBody>
                                <BootstrapTable
                                    wrapperClasses="table-responsive table-hover"
                                    classes="table table-head-custom table-vertical-center overflow-hidden"
                                    remote
                                    // hover
                                    rowStyle={{ cursor: "pointer" }}
                                    bordered={false}
                                    keyField='id'
                                    // data={products.map(product => ({
                                    //     ...product,
                                    //     stt: orderNumericals++,
                                    //     quantity:itemList?.find(x => x.product_id === product?.id)?.quantity,
                                    // }))}
                                    data={itemList.map(item => ({
                                        ...item,
                                        stt: orderNumericals++,
                                        
                                    }))}
                                    columns={columnsContentProduct}
                                    onTableChange={getHandlerTableChange}
                                    // rowEvents={rowEvents}
                                    pagination={paginationFactory(optionsProduct)}
                                />
                               
                            </CardBody>
                        </Card>

                    </form>


                </div>
            </div>
            </div>

        {/* Modal update Box */}
         <Modal
                show={checkModalCost}
                dialogClassName="w-custome-20"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết phí
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Phụ Phí</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        onInput={e => setAdditional(e.target.value)}
                                        value ={additional}
                                />
                            </div>
                        </div>
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Phí Vận Chuyển Về Việt Nam</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        onInput={e => setShippingCost(e.target.value)}
                                        value ={shippingCost}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Phí Lưu Kho</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        onInput={e => setStorage(e.target.value)}
                                        value ={storage}
                                />
                            </div>
                        </div>
                        
                    </div>
                   

                       

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalCost(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {

                            updateCostBox(ids, additional, shippingCost, storage)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalCost(false)).then(history.push("admin/boxdetail/"+ ids));;
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



            {/* Modal update local Box */}
         <Modal
                show={checkModalLocal}
                dialogClassName="w-custome-20"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết vị trí
                        
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Mã Pallet</label>
                                <Select
                                    value={palletsList.filter(
                                        (obj) => obj.label === idPallet
                                    )}
                                    options={palletsList}
                                    onChange={onPalletChange}
                                />
                            </div>
                        </div>
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Hàng Pallet</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setRowPallet(e.target.value)}
                                        value ={rowPallet}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Tầng Pallet</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setFloorPallet(e.target.value)}
                                        value ={floorPallet}
                                />
                            </div>
                        </div>
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Cột Pallet</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setColumnPallet(e.target.value)}
                                        value ={columnPallet}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Mã Shelve</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setRowShelve(e.target.value)}
                                        value ={idShelve}
                                />
                                {/* <Select
                                    value={shelveList.filter(
                                        (obj) => obj.label === idShelve
                                    )}
                                    options={shelveList}
                                    onChange={onShelveChange}
                                /> */}
                            </div>
                        </div>
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Hàng Shelve</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setRowShelve(e.target.value)}
                                        value ={rowShelve}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Tầng Shelve</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setFloorShelve(e.target.value)}
                                        value ={floorShelve}
                                />
                            </div>
                        </div>
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Cột Shelve</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setColumnShelve(e.target.value)}
                                        value ={columnShelve}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Area</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setFloorShelve(e.target.value)}
                                        value ={capitalizeFirstLetter(area)}
                                />
                            </div>
                        </div>
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1"></label>
                                {/* <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setColumnShelve(e.target.value)}
                                        value ={columnShelve}
                                /> */}
                            </div>
                        </div>
                    </div>


                       

                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalLocal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {

                            updateLocalBox(ids, idPallet)
                                // .then(updateShelvetBox(idShelve, rowShelve, columnShelve, floorShelve))
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalLocal(false)).then(history.push("admin/boxdetail/"+ ids));;
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


            <Modal
                show={checkModalUpdateBox}
                dialogClassName="w-custome-20"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết thùng hàng
                        
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Mã Thùng</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setAdditional(e.target.value)}
                                        value ={box?.id}
                                />
                            </div>
                        </div>
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Chiều Dài</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        onInput={e => setLength(e.target.value)}
                                        value ={length}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Chiều Rộng</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        onInput={e => setWidth(e.target.value)}
                                        value ={width}
                                />
                            </div>
                        </div>
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Chiều Cao</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        onInput={e => setHeight(e.target.value)}
                                        value ={height}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Mã Shelve</label>
                                <Select
                                    value={SFAList.filter(
                                        (obj) => obj.label === idSFA
                                    )}
                                    options={SFAList}
                                    onChange={onSelectedSFAChange}
                                />
                            </div>
                        </div>
                        
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Trọng Lượng</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        onInput={e => setWeight(e.target.value)}
                                        value ={weight}
                                />
                            </div>
                        </div>
                    </div>
                   


                       
                {/* Modal update box */}
                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalUpdateBox(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {

                            updateBox(ids, length, width, height,weight, idSFA )
                            
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalUpdateBox(false)).then(history.push("admin/boxdetail/"+ ids));;
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




            <Modal
                show={checkModalCreateBoxChild}
                dialogClassName="w-custome-25"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Thêm thùng hàng
                        
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Mã Thùng Hàng Cha</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setAdditional(e.target.value)}
                                        value ={box?.id}
                                />
                            </div>
                        </div>
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Số Lượng</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        onInput={e => setQuantityBoxChild(e.target.value)}
                                        value ={quantityBoxChild}
                                />
                            </div>
                        </div>
                    </div>
                    <label for="exampleFormControlInput1">Chọn Sản Phẩm Trong Thùng </label>
                    <div className="row">
                    <label className="col-3">
                      <select
                        value={typeProduct}
                        onChange={(e) => {
                          setTypeProduct(e.target.value);
                        }}
                        className="form-control"
                      >
                        <option value="id">Tìm theo Jancode</option>
                        <option value="name">Tìm theo tên</option>
                      </select>
                    </label>
                    <div className="col-9">
                      <input
                        className="form-control"
                        value={valueSearch}
                        onChange={handleInputChange}
                        placeholder="Thêm sản phẩm cho thùng"
                      />
                      {
                        arrProducts.length > 0 && showFowY ?
                          <ul className="product-item-autocomplete" onScroll={(event) => {
                            const target = event.target;
                            if (
                              target.scrollHeight - target.scrollTop === target.clientHeight
                            ) {
                              if (typeProduct === 'id') {
                                dispatch(searchProductBy('id:' + valueSearch)).then((data) => {
                                //   console.log(arrProducts.concat(data.data.data));
                                  setArrProducts(arrProducts.concat(data.data.data));
                                })
                              } else {
                                dispatch(searchProductBy('name:' + valueSearch)).then((data) => {
                                  setArrProducts(arrProducts.concat(data.data.data));
                                })
                              }

                            }
                          }}>
                            {
                              arrProducts.map((val, key) =>
                                <li key={key} onClick={() => onProductChange(val)}>{val.name} ({val.id})</li>

                              )

                            }

                          </ul> : ''
                      }

                    </div>
                  </div>
                    


                       
                {/* Modal update box */}
                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalCreateBoxChild(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {

                            createBoxChild(ids, idProduct,quantityBoxChild)
                            
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalCreateBoxChild(false)).then(history.push("admin/boxdetail/"+ ids));;
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


            <Modal
                show={checkModalBoxUpdate.checkModal}
                dialogClassName="w-custome-25"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết thùng hàng
                        
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="row">
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Mã Thùng Hàng Cha</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        // onInput={e => setAdditional(e.target.value)}
                                        value ={box?.id}
                                />
                            </div>
                        </div>
                        <div class="col">                                          
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Số Lượng</label>
                                <input  class="form-control" 
                                        id="exampleFormControlInput1" 
                                        onChange={e => setCheckModalBoxUpdate({checkModal:true,quantity:e.target.value})}
                                        value ={checkModalBoxUpdate.quantity}
                                />
                            </div>
                        </div>
                    </div>
                    <label for="exampleFormControlInput1">Sản Phẩm Có Trong Thùng Hàng</label>
                    <div className="row">
                    <label className="col-3">
                      <select
                        value={typeProduct}
                        onChange={(e) => {
                          setTypeProduct(e.target.value);
                        }}
                        className="form-control"
                      >
                        <option value="id">Tìm theo Jancode</option>
                        <option value="name">Tìm theo tên</option>
                      </select>
                    </label>
                    <div className="col-9">
                      <input
                        className="form-control"
                        value={checkModalBoxUpdate.idProduct}
                        onChange={handleInputChanges}
                        placeholder="Thêm sản phẩm cho thùng"
                      />
                      {
                        arrProducts.length > 0 && showFowY ?
                          <ul className="product-item-autocomplete" onScroll={(event) => {
                            const target = event.target;
                            if (
                              target.scrollHeight - target.scrollTop === target.clientHeight
                            ) {
                              if (typeProduct === 'id') {
                                dispatch(searchProductBy('id:' + checkModalBoxUpdate.idProduct)).then((data) => {
                                //   console.log(arrProducts.concat(data.data.data));
                                  setArrProducts(arrProducts.concat(data.data.data));
                                })
                              } else {
                                dispatch(searchProductBy('name:' + checkModalBoxUpdate.idProduct)).then((data) => {
                                  setArrProducts(arrProducts.concat(data.data.data));
                                })
                              }

                            }
                          }}>
                            {
                              arrProducts.map((val, key) =>
                                <li key={key} onClick={() => onProductChanges(val)}>{val.name} ({val.id})</li>

                              )

                            }

                          </ul> : ''
                      }

                    </div>
                  </div>
                   
                       
                {/* Modal update box */}
                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalBoxUpdate({checkModal:false})}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {console.log(checkModalBoxUpdate)
                            updateBoxChild(checkModalBoxUpdate.id, checkModalBoxUpdate.idProduct,checkModalBoxUpdate.quantity)
                            
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalBoxUpdate({checkModal:false})).then(history.push("admin/boxdetail/"+ ids));;
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


            {/* Modal update quantty product */}
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
                                }).then(setModalUpdateQuantity(false)).then(history.push("/admin/boxdetail/" + ids));;
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