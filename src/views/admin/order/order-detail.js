import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  CardFooter,
} from "../../../_metronic/_partials/controls";
import {
  getOrderById,
  getProductList,
  getSupplierList,
  getShimmentMethodBy,
  getBox,
  getTransaction,
  getLadingBills,
  getNotification,
  updateStatus,
  updateOrder,
  writeNotification,
  createTracking,
  updateItemOrder,
  getTaxesList,
  getShipmentList,
  updateCostOrder,
  updatePackage,
  getItemOrder
} from "../../_redux_/ordersSlice";
import { useParams } from "react-router-dom";
import Moment from "moment";
import swal from "sweetalert";
import Select from "react-select";
import { Link, useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../assets/css/style-main.css";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
export function OrderDetail() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [steps, setStep] = useState([]);
  const [checkModalTracking, setCheckModalTracking] = useState(false);
  const [statusObject, setStatusObject] = useState({
    id: "",
    name: "",
  });
  const [orderObject, setOrderObject] = useState({
    type: {
      id: "Retail",
      name: "",
    },
    steps: [],
    id: "",
    status: { name: "" },
    note: "",
    created_at: "",
    updated_at: "",
    cost: {
      sub_total: 0,
      tax: 0,
      addtional: 0,
      discount_tax_percent: 0,
      balance: 0,
    },
    items: [
      {
        id: "",
        trackings: [],
        purchase: { items: [] },
      },
    ],
    shipment_infor: {
      consignee: "",
      address: "",
      tel: "",
      user_id: ''
    },
    shipment_method_id: "air",
    shipmentMethodWarehouse: { fee: 0 },
    trackings: [],
    name: '',
    package: 0,
    shipment_method: {
      id: '',
      name: '',
      fee: 0
    }
  });
  const [balance, setBalance] = useState(0);
  const [discountTax, setDiscountTax] = useState(0)
  const [shipmentList, setShipmentList] = useState([]);
  const classArray = ["warning", "success", "danger", "info", "primary"];
  const [boxes, setBoxes] = useState([]);
  const [ladingBill, setLadingBill] = useState([]);
  const [transition, setTransition] = useState([]);
  const [log, setLog] = useState([
    {
      content: {},
      class: "",
    },
  ]);
  const [selectedValue, setSelectedValue] = useState("");
  const [contentLog, setContentLog] = useState("");
  const dateNow = new Date();
  const year = dateNow.getFullYear(); // Getting current year from the created Date object
  const monthWithOffset = dateNow.getUTCMonth() + 1; // January is 0 by default in JS. Offsetting +1 to fix date for calendar.
  const month = // Setting current Month number from current Date object
    monthWithOffset.toString().length < 2 // Checking if month is < 10 and pre-prending 0 to adjust for date input.
      ? `0${monthWithOffset}`
      : monthWithOffset;
  var date =
    dateNow.getUTCDate().toString().length < 2 // Checking if date is < 10 and pre-prending 0 if not to adjust for date input.
      ? `0${dateNow.getUTCDate()}`
      : dateNow.getUTCDate();
  const dateDataNow = `${year}-${month}-${date}`;
  const [expected_delivery, setExpectedDelivery] = useState(dateDataNow);
  const [payment_due_date, setPaymentDueDate] = useState(dateDataNow);
  const [code, setCode] = useState("");
  const [checkFormTracking, setCheckFormTracking] = useState('');
  const [addtional, setAddtional] = useState(0);
  const [taxList, setTaxList] = useState([0]);
  const [selectedValueTax, setSelectedValueTax] = useState(0);
  const [checkInputAddtional, setCheckInputAddtional] = useState(false);
  const [checkFormTax, setCheckFormTax] = useState(false);
  const [checkFormTaxDiscountItem, setCheckFormTaxDiscountItem] = useState('');
  const [orderWholesaleObject, setOrderWholesaleObject] = useState({
    price: 0,
    quantity: 0,
    product_id: '',
    type: 0,
    check: false,
    is_box: true,
    package: 0,
    IdOrderItem: '',
    taxPercent: '',
    note: '',
    properties: ''
  })
  const [shipMentObiect, setShipMentObject] = useState({
    consignee: "",
    address: "",
    tel: "",
    id: "",
  });
  const { id } = useParams();
  const [checkLoading, setCheckLoading] = useState(true);
  const [checkHideBox, setCheckHideBox] = useState(false);
  useEffect(() => {
    if (id) {
      getOrderDetail(id);

    }
  }, [dispatch]);
  const getOrderDetail = (id) => {
    dispatch(getOrderById(id)).then((res) => {
      const object = res.data || {};
      setSelectedValue(object.shipment_method_id);
      setBalance(object.cost.balance || 0);
      setDiscountTax(object.cost.discount_tax_percent || 0);
      setStep(object.steps);
      setAddtional(object.cost.addtional)
      // setSelectedValueTax(object.tax_id);

      setStatusObject({
        id: object.status.id,
        name: object.status.name,
      });
      var objectItems = object.items || [];
      if (objectItems.length > 0) {
        setCheckLoading(false)
      dispatch(getItemOrder('appends=product.unit;product.package;supplier&search=order_id:'+id)).then((response)=>{
       const _data = response.data.data || [];
       
        for (var m = 0; m < objectItems.length; m++) {
          for (var n = 0; n < _data.length; n++) {
            if (objectItems[m].product_id === _data[n].product_id) {
              objectItems[m]["name"] = _data[n]?.product.name;
              objectItems[m]["images"] = _data[n]?.product?.images?.url;
              objectItems[m]["package"] =objectItems[m].is_box?_data[n]?.product?.package?.quantity:'';
            }
            if(_data[n].supplier){
              if (objectItems[m].supplier_id === _data[n]?.supplier?.id) {
                objectItems[m]["supplier"] = {
                  name: _data[n]?.supplier?.name,
                  email: _data[n]?.supplier?.email,
                  address: _data[n]?.supplier?.address,
                  note: _data[n]?.supplier?.note,
                };
              }
            }
            
          }
        }
        setOrderObject(object);
        
        getDataExpand();
      }).catch(() => {
        setOrderObject(object);
        setCheckLoading(false)
        getDataExpand();
      });
    }else {
      setOrderObject(object);
      setCheckLoading(false)
      getDataExpand();
    }

      if (object?.shipment_infor?.user_id) {
        setShipMentObject({
          consignee: object?.shipment_infor?.consignee,
          address: object?.shipment_infor?.address,
          tel: object?.shipment_infor?.tel,
          id: object?.shipment_infor?.id,
        })
        console.log(object?.shipment_infor?.user_id);
        loadShipment(object?.shipment_infor?.user_id)
      }



    });


  }

  const loadShipment = (id) => {
    dispatch(getShipmentList(1, id)).then((res) => {
      const _data = res.data.data || [];

      const pageLast = res.data.last_page;

      if (pageLast > 1) {
        var arrDataList = [];
        arrDataList = arrDataList.concat(_data);
        for (var i = 2; i <= pageLast; i++) {
          dispatch(getShipmentList(i, id)).then((respon) => {
            var arrData = respon.data.data || [];
            arrDataList = arrDataList.concat(arrData);
            if (i > pageLast) {
              setShipmentList(arrDataList);
              console.log(arrDataList);
            }
          });
        }
      } else {
        setShipmentList(_data);
      }
    });
  };

  const getDataExpand = () => {
    getMessage(id);
    dispatch(getBox(id)).then((res) => {
      setBoxes(res.data.data);
    });



    dispatch(getTransaction(id)).then((res) => {
      setTransition(res.data.data);
    });

    dispatch(getTaxesList()).then((res) => {
      const _data = res.data || [];
      var result = [];
      for (var i = 0; i < _data.length; i++) {
        result.push({
          value: _data[i].percent,
          label: _data[i].name,
          id: _data[i].id
        });
      }

      setTaxList(result);

    });
    dispatch(getLadingBills(id)).then((res) => {
      setLadingBill(res.data.data);
    });
  }
  const taxChange = (e) => {
    // setSelectedValueTax(e.value);
    console.log(e.value);
    setOrderWholesaleObject({
      quantity: orderWholesaleObject.quantity,
      check: true,
      is_box: orderWholesaleObject.is_box,
      price: orderWholesaleObject.price,
      package: orderWholesaleObject.package,
      product_id: orderWholesaleObject.product_id,
      IdOrderItem: orderWholesaleObject.IdOrderItem,
      taxPercent: e.value,
      properties: orderWholesaleObject.properties,
      note: orderWholesaleObject.note
    })
  };
  function getOrderShipment(id) {
    dispatch(getOrderById(id)).then((res) => {
      const object = res.data || {};
      setOrderObject(object);
      console.log(object);
    });
  }
  function getMessage(id) {
    var logArr = [];
    dispatch(getNotification(id, 1)).then((res) => {
      const _data = res.data.data || [];
      const pageLast = res.data.last_page;
      logArr = logArr.concat(changeDataLog(_data));
      if (pageLast > 1) {
        for (var i = 2; i <= pageLast; i++) {
          dispatch(getNotification(id, i)).then((log) => {
            var arrDataLog = log.data.data || [];
            logArr = logArr.concat(changeDataLog(arrDataLog));
            if (i > pageLast) {
              setLog(logArr);
            }
          });
        }
      } else {
        // console.log(logArr);
        setLog(logArr);
      }
    });
  }
  function changeDataLog(arr) {
    var index = 0;
    for (var i = 0; i < arr.length; i++) {
      index += 1;
      if (index > classArray.length - 1) {
        index = 0;
      }
      arr[i]["class"] = classArray[index];
      arr[i].content = JSON.parse(arr[i].content);
      if (arr[i].content.wrote) {
        if (arr[i].content.wrote.toString().indexOf("{") != -1) {
          arr[i].content.wrote = JSON.parse(arr[i].content.wrote);
        }
      }
      console.log(i + "       ", arr[i]);
      for (var key in arr[i].content) {
        if (
          key == "wrote" ||
          key == "supplier_id" ||
          key == "director_id" ||
          key == "product_id"
        ) {
          console.log(key);
          break;
        } else {
          arr[i].content["product"] = {
            id: key,
            name: arr[i].content[key],
          };
          console.log(key);
          console.log(Object.keys(arr[i].content?.product?.name).length);
          if (Object.keys(arr[i].content?.product?.name).length > 1) {
            var data = '';
            if (arr[i].content?.product?.name?.quantity) {
              data = ' Sl ' + arr[i].content?.product?.name?.quantity;
            }
            if (arr[i].content?.product?.name?.price) {
              data += ', Giá ' + arr[i].content?.product?.name?.price;
            }
            if (arr[i].content?.product?.name?.note) {
              data += ', Ghi chú ' + arr[i].content?.product?.name?.note;
            }
            if (arr[i].content?.product?.name?.tax_percent) {
              data += ', % thuế ' + arr[i].content?.product?.name?.tax_percent;
            }
            console.log(data);

            arr[i].content['mess'] = data;
            console.log(arr[i]);
          }
        }
      }
    }
    return arr;
  }
  const shipOption = [
    {
      label: "Đường biển",
      value: "sea",
    },
    {
      label: "Đường bay",
      value: "air",
    },
  ];
  const shipMethodChange = (e) => {
    console.log(e.value);
    setSelectedValue(e.value);
    dispatch(
      updateOrder({
        id: orderObject.id,
        shipment_method_id: e.value,
      })
    ).then((res) => {
      orderObject.shipment_method_id = res.data.shipment_method_id;

      swal("Đã cập nhật hình thức vận chuyển!", {
        icon: "success",
      });
      getMessage(id);
      console.log(orderObject);
    });
  };
  const onShipmentChange = (event, values) => {
    if (values) {

      if (values.id != shipMentObiect.id) {
        setShipMentObject(values);
        dispatch(updateOrder({
          id: id,
          shipment_infor_id: values.id
        })).then(() => {
          getOrderDetail(id);
          swal("Đã thay đổi thông tin giao hàng!", {
            icon: "success",
          });

        })
      }

    }
  };
  const columns = [
    {
      dataField: "id",
      text: "STT",
      formatter: STTFormatter,
      editable: false,
    },

    {
      dataField: "xcv",
      text: "Sản phẩm",
      formatter: productFormatter,
      editable: false,
      headerAlign: "center",
    },
    {
      style: {
        width: '100px',
        fontSize: '18px'

      },
      headerStyle: { width: '100px' },
      dataField: "price",
      text: "Giá",
      align: "center",
      headerAlign: "center"
    },
    {
      dataField: "quantity",
      text: "Số lượng",
      align: "center",
      headerAlign: "center",
      style: {
        width: '100px',
        fontSize: '18px'
      },
      headerStyle: { width: '100px' },
    },
    {
      dataField: "package",
      text: "pcs",
      headerAlign: "center",
      align: "center",
      // editable: false,
      style: {
        width: '100px',
        fontSize: '18px'
      },
      headerStyle: { width: '100px' },
      editable: (content, row, rowIndex, columnIndex) => row?.is_box
    },
    {
      dataField: "tax",
      text: "Thuế",
      headerAlign: "center",
      editable: false,
      formatter: taxPercentFormatter,
      align: "center",
      headerAlign: "center",
      style: {
        fontSize: '18px'
      },

    },
    {
      dataField: "amount",
      text: "Tiền hàng",
      headerAlign: "center",
      editable: false,
      align: "center",
      headerAlign: "center",
      style: {
        fontSize: '18px'
      },
      // headerStyle: { width: '100px' },

    },
    {
      dataField: "discount_tax",
      text: "Chiết khấu",
      headerAlign: "center",
      align: "center",
      editable: false,
      style: {
        fontSize: '18px'
      },
      formatter: discountTaxFormatter,
      // headerStyle: { width: '100px' },

    },
    {
      dataField: "balance",
      text: "Tổng tiền",
      editable: false,
      // formatter: taxPercentFormatter,
      align: "center",
      headerAlign: "center",
      style: {
        fontSize: '18px'
      },
      formatter: balanceFormatter,
    },

    {
      editable: false,
      dataField: "action",
      text: "Actions",
      classes: "text-right pr-0",
      headerClasses: "text-right",
      formatter: actionFormatterWholesale,
      style: {
        // minWidth: "100px",
      }
    },
  ];
  function discountTaxFormatter(cell, row){
    return (
        <>
        {row?.discount_tax?Number(row?.discount_tax).toFixed(1):0}
        </>
    )
}
function balanceFormatter(cell, row){
  return (
      <>
      {row?.balance?Number(row?.balance).toFixed(1):0}
      </>
  )
}
  const columnsWholesaleBox = [
    {
      dataField: "id",
      text: "STT",
      formatter: STTFormatter,
      editable: false,
    },

    {
      dataField: "xcv",
      text: "Sản phẩm",
      formatter: productFormatter,
      editable: false,
      headerAlign: "center",
      style: {
        width: '30%'
      },
    },
    {
      dataField: "price",
      text: "Giá",

      style: {
        width: '100px',
        fontSize: '18px'
      },
      headerStyle: { width: '100px' },
      // formatter: priceFormatter,
    },
    {
      dataField: "quantity",
      text: "Số lượng",
      headerAlign: "center",
      align: "center",
      style: {
        width: '100px',
        fontSize: '18px'
      },
      headerStyle: { width: '100px' },
      // formatter: quantityFormatter,
    },
    {
      dataField: "package",
      text: "pcs",
      headerAlign: "center",
      align: "center",
      // editable: false,
      style: {
        width: '100px',
        fontSize: '18px'
      },
      headerStyle: { width: '100px' },
      editable: (content, row, rowIndex, columnIndex) => row?.is_box
    },
    {
      dataField: "tax_percent",
      text: "Thuế",
      headerAlign: "center",
      editable: false,
      formatter: taxPercentFormatter,
      align: "center",
      headerAlign: "center",
      style: {
        width: '100px',
        fontSize: '18px'
      },
    },
    {
      dataField: "amount",
      text: "Tiền hàng",
      headerAlign: "center",
      editable: false,
      style: {
        fontSize: '18px'
      },
      align: "center",

    },
    {
      dataField: "discount_tax",
      text: "Chiết khấu",
      headerAlign: "center",
      align: "center",
      editable: false,
      style: {
        fontSize: '18px'
      },
      formatter: discountTaxFormatter,
    },
    {
      dataField: "balance",
      text: "Tổng tiền",
      editable: false,
      // formatter: taxPercentFormatter,
      align: "center",
      headerAlign: "center",
      style: {
        fontSize: '18px'
      },
      formatter: balanceFormatter,
    },

    {
      dataField: "action",
      text: "Actions",
      classes: "text-right",
      headerClasses: "text-right",
      editable: false,
      formatter: actionFormatterWholesale,
      style: {
        // minWidth: "100px",
      }
    },
  ];

  function actionFormatterWholesale(cell, row, rowIndex, formatExtraData) {
    return (
      <>
        <OverlayTrigger
          overlay={<Tooltip>Chỉnh sửa</Tooltip>}
        >
          <button
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            onClick={() => {
              const object =
                taxList.filter(function (object) {
                  return object.value == Math.round(row.tax_percent);
                })[0] || {};
              console.log(object);

              setOrderWholesaleObject({
                check: true,
                IdOrderItem: row.id,
                taxPercent: object.id ? object.value : taxList[0].value,
                properties: row.properties,
                note: row.note,
              })
            }}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
              />
            </span>
          </button>
        </OverlayTrigger>
      </>
    );
  }
  const columnsPayment = [
    {
      dataField: "id",
      text: "STT",
      formatter: STTFormatter,
      editable: false,
    },

    {
      style: {
        width: '25%'
      },
      dataField: "xcv",
      text: "Sản phẩm",
      headerAlign: "center",
      formatter: productFormatter,
      editable: false,
    },
    {
      dataField: "price",
      text: "Giá",
      align: "center",
      headerAlign: "center",
      style: {
        width: '100px',
        fontSize: '18px'
      },
      headerStyle: { width: '100px' }
    },
    {
      dataField: "quantity",
      text: "Số lượng",
      align: "center",
      headerAlign: "center",
      style: {
        width: '100px',
        fontSize: '18px'
      },
      headerStyle: { width: '100px' }
    },
    {
      dataField: "package",
      text: "pcs",
      headerAlign: "center",
      align: "center",
      // editable: false,
      style: {
        width: '100px',
        fontSize: '18px'
      },
      headerStyle: { width: '100px' },
      editable: (content, row, rowIndex, columnIndex) => row?.is_box
    },
    // {
    //   dataField: "13",
    //   text: "Chi phí",
    //   formatter: costFormatter,
    //   editable: false,
    //   style: {
    //     width: '150px',

    //   },
    //   headerStyle: { width: '150px' }
    // },
    {
      dataField: "tax_percent",
      text: "Thuế",
      headerAlign: "center",
      editable: false,
      formatter: taxPercentFormatter,
      align: "center",
      headerAlign: "center",
      style: {
        fontSize: '18px'
      },

    },
    {
      dataField: "amount",
      text: "Tiền hàng",
      headerAlign: "center",
      align: "center",
      editable: false,
      style: {
        fontSize: '18px'
      },
      // style: {
      //   width: '100px',
      // },
      // headerStyle: { width: '100px' },

    },
    {
      dataField: "discount_tax",
      text: "Chiết khấu",
      headerAlign: "center",
      align: "center",
      editable: false,
      style: {
        fontSize: '18px'
      },
      formatter: balanceFormatter,
      // style: {
      //   width: '100px',
      // },
      // headerStyle: { width: '100px' },

    },
    {
      dataField: "balance",
      text: "Tổng tiền",
      editable: false,
      formatter: balanceFormatter,
      align: "center",
      headerAlign: "center",
      style: {
        fontSize: '18px'
      },
    },
    {
      dataField: "su",
      text: "Nhà cung cấp",
      formatter: supplierFormatter,
      editable: false,
    },
    {
      dataField: "action",
      text: "Actions",
      classes: "text-right",
      headerClasses: "text-right",
      editable: false,
      formatter: actionFormatterWholesale,
      style: {
        // minWidth: "100px",
      }
    },
  ];
  function supplierFormatter(cell, row, i) {
    return (
      <>
        <div>{row.supplier?.name}</div>
        <div>{row.supplier?.email}</div>
        <div>{row.supplier?.address}</div>
        <div>{row.supplier?.note}</div>
      </>
    );
  }
  function STTFormatter(cell, row, i) {
    return (
      <>
        <span>{i + 1}</span>
      </>
    );
  }
  function productImageFormatter(cell, row, i) {
    return (
      <>
        <div className="symbol symbol-70 flex-shrink-0">
          {
            row?.images ?
              <img src={row?.images} />
              : ''
          }

        </div>

      </>
    )
  }
  function productFormatter(cell, row) {
    return (
      <>
        <div className="d-flex align-items-center">
          {
            row?.images ?
              <div className="symbol symbol-100 flex-shrink-0">

                <img src={row?.images} />


              </div>
              : ''
          }
          <div className="ml-2">


            <div className="font-weight-bolder">
              {row?.name ? row?.name : "Giặt quần jersey mắt cá chân phải"}
            </div>
            <div className="font-weight-bolder">
              <span className="font-weight-bold">Jancode:</span>
              <a href="javascript:;" className="text-muted font-weight-bold text-hover-primary"> {row.product_id}</a>

            </div>
            <div>
              Hình thức:{" "}
              <span className="text-info">
                {
                  row.is_box ? 'Thùng':"Cái"
                }
              </span>
            </div>
          </div>
        </div>


      </>
    );
  }

  function taxPercentFormatter(cell, row) {
    return (
      <>
        {row.tax_percent ? Math.round(row.tax_percent) : 0}%

      </>
    );
  }
  function priceFormatter(cell, row) {
    return (
      <>
        <div>Giá bán: <span style={{
          fontSize: '18px'
        }}>{row.price}</span></div>
        <div>Giá mua: <span style={{
          fontSize: '18px'
        }}>
          {row?.purchase != null
            ? row.purchase?.items.filter(
              (val) => val.product_id == row.product_id
            ).length > 0
              ? row?.purchase?.items.filter(
                (val) => val.product_id == row.product_id
              )[0].price
              : 0
            : 0}
        </span>
        </div>
      </>
    );
  }
  
  function quantityFormatter(cell, row) {
    return (
      <>
        <div>Sl bán: <span style={{
          fontSize: '18px'
        }}>{row.quantity}</span></div>
        <div>Sl mua: <span style={{
          fontSize: '18px'
        }}>
          {row?.purchase != null
            ? row.purchase.items.filter((val) => val.product_id == row.product_id)
              .length > 0
              ? row.purchase.items.filter(
                (val) => val.product_id == row.product_id
              )[0].quantity
              : 0
            : 0}
        </span>
        </div>
      </>
    );
  }
  function costFormatter(cell, row) {
    return (
      <>
        <div>
          Tiền hàng: <span className="text-primary" style={{ fontSize: '15px' }}>{row.amount}</span>
        </div>
        <div>
          Tiền thuế: <span className="text-primary" style={{ fontSize: '15px' }}>{row.tax}</span>{" "}
        </div>
        <div>
          Tổng tiền: <span className="text-primary" style={{ fontSize: '15px' }}>{row.balance}</span>{" "}
        </div>
      </>
    );
  }
  function trackingFormatter(cell, row) {
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

  const CaptionElement = () => (
    <h3 style={{ color: "#3F4254" }}>Danh sách hàng hoá</h3>
  );
  const columnsBox = [
    {
      dataField: "id",
      text: "Mã SKU",
    },
    {
      dataField: "weight",
      text: "Trọng lượng",
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "volume",
      text: "Thể tích",
      align: "center",
      headerAlign: "center",
    },
  ];
  const dataBox = [
    {
      id: 1223,
      weight: 23.4,
      volume: 12.3,
    },
    {
      id: 12234,
      weight: 23.4,
      volume: 12.3,
    },
    {
      id: 12235,
      weight: 23.4,
      volume: 12.3,
    },
  ];

  const columnsLadingBills = [
    {
      dataField: "id",
      text: "Mã",
    },
    {
      dataField: "xcv",
      text: "Phương thức vận chuyển",
      align: "center",
      headerAlign: "center",
      formatter: shipmentMethodFormatter
    },
    {
      dataField: "balance",
      text: "Tổng tiền",
      align: "center",
      headerAlign: "center",
    },
  ];
  const dataLadingBills = [
    {
      id: 1234,
      shipment_method_id: "sea",
      balance: 123.25,
    },
    {
      id: 12324,
      shipment_method_id: "air",
      balance: 123.23,
    },
    {
      id: 12354,
      shipment_method_id: "sea",
      balance: 1233.2,
    },
  ];

  function shipmentMethodFormatter(cell, row) {
    return (
      <>
        {row.shipment_method_id === "air" ? (
          <span
            className="label label-lg label-light-primary label-inline"
            style={{ marginLeft: "0", marginTop: "0" }}
          >
            Đường bay
          </span>
        ) : (
            <span
              className="label label-lg label-light-info label-inline"
              style={{ marginLeft: "0", marginTop: "0" }}
            >
              Đường biển
            </span>
          )}
      </>
    );
  }

  const columnsTransaction = [
    {
      dataField: "amount",
      text: "Số tiền",
    },
    {
      dataField: "description",
      text: "Nội dung",
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "user_id",
      text: "Người thực hiện",
      align: "center",
      headerAlign: "center",
    },
  ];
  const dataTrasaction = [
    {
      amount: 123.2,
      description: "description",
      user_id: "Admin",
    },
    {
      amount: 123.222,
      description: "description",
      user_id: "Admin",
    },
    {
      amount: 123.234,
      description: "description",
      user_id: "Admin",
    },
  ];

  const columnsTracking = [
    {
      dataField: "id",
      text: "STT",
      formatter: STTFormatter,
    },
    {
      dataField: "code",
      text: "Mã Tracking",
    },

    {
      dataField: "xvxvsd",
      text: "Ngày nhận hàng",
      align: "center",
      headerAlign: "center",
      formatter: expectedDeliveryFormatter,
    },
    {
      dataField: "12",
      text: "Hạn thanh toán",
      align: "center",
      headerAlign: "center",
      formatter: paymentDueDateFormatter,
    },
    {
      dataField: "xcv",
      text: "Trạng thái",
      formatter: statusFormatter,
    },
    {
      dataField: "action",
      text: "#",
      classes: "text-right",
      headerClasses: "text-right",
      formatter: actionFormatter,
      style: {
        minWidth: "100px",
      },
    },
  ];
  function actionFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <>
        <OverlayTrigger overlay={<Tooltip>Xoá Tracking</Tooltip>}>
          <a
            className="btn btn-icon btn-light btn-hover-danger btn-sm"
            onClick={() => {
              dispatch(
                updateOrder({
                  id: orderObject.id,
                  params: JSON.stringify(["trackings", row.id.toString()]),
                  action: "detach",
                })
              ).then(() => {
                swal("Xoá tracking thành công!", {
                  icon: "success",
                });
                getOrderShipment(id);
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
  function expectedDeliveryFormatter(cell, row) {
    return (
      <>
        {/* {row.expected_delivery
          ? Moment(row.expected_delivery).format("DD-MM-YYYY HH:MM")
          : ""} */}

        {row.expected_delivery
          ? row.expected_delivery
          : ""}
      </>
    );
  }
  function paymentDueDateFormatter(cell, row) {
    return (
      <>
        {/* {row.payment_due_date
          ? Moment(row.payment_due_date).format("DD-MM-YYYY HH:MM")
          : ""} */}

        {row.payment_due_date
          ? row.payment_due_date
          : ""}
      </>
    );
  }


  const expandRow = {
    renderer: row => (
      <div className="react-bootstrap-table table-responsive ml-15">

        <table className="table table table-head-custom table-vertical-center overflow-hidden">
          <thead>
            <tr><th className="border-top-0">Mã Tracking</th><th className="border-top-0">Ngày giao hàng</th><th className="border-top-0">Hạn thanh toán</th>
              <th className="border-top-0" width="40%"><i className="ki ki-plus" style={{ cursor: 'pointer' }} onClick={() => setCheckFormTracking(row.id)}></i></th></tr>
          </thead>
          <tbody>



            {
              checkFormTracking == row.id ?
                <tr className="font-weight-boldest">
                  <td className="pt-2 border-left border-bottom" width="40%">
                    <input className="form-control" value={code} onChange={(e) => {
                      setCode(e.target.value)
                    }} />
                  </td>
                  <td className="pt-2 border-bottom">
                    <TextField
                      // style={{ width: 125 }}
                      type="date"
                      defaultValue={expected_delivery}
                      onInput={e => setExpectedDelivery(e.target.value)}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </td>
                  <td className="pt-2 border-bottom">
                    <TextField
                      // style={{ width: 125 }}
                      type="date"
                      defaultValue={payment_due_date}
                      onInput={e => setPaymentDueDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </td>
                  <td className="pt-3 border-right" width="40%">
                    <button type="button"
                      className="btn btn-success mr-1 btn-sm" onClick={() => AddTrackingItem(row.id)}>Lưu
</button>
                    <button type="button"
                      className="btn btn-danger btn-sm" onClick={() => setCheckFormTracking(false)}>Huỷ
</button>
                  </td>
                </tr>
                : <tr></tr>



            }
            {
              row?.trackings.map((val, i) =>
                <tr key={i + 'trackings'}>
                  <td className="border-left border-bottom">

                    {
                      val.checked ? (

                        <span className="badge badge-info">{val.code}</span>

                      ) : (

                          <span className="badge badge-light">{val.code}</span>

                        ) 
                    }
                  </td>
                  {/* <td className="border-bottom"> {val.expected_delivery?Moment(val.expected_delivery).format('DD-MM-YYYY HH:MM'):'' }</td>
              <td className="border-bottom"> {val.payment_due_date?Moment(val.payment_due_date).format('DD-MM-YYYY HH:MM'):'' }</td> */}

                  <td className="border-bottom"> {val.expected_delivery ? val.expected_delivery : ''}</td>
                  <td className="border-bottom"> {val.payment_due_date ? val.payment_due_date : ''}</td>
                  <td className="border-right border-bottom">  <>
                    <OverlayTrigger
                      overlay={<Tooltip>Xoá Tracking</Tooltip>}
                    >
                      <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => {
                          dispatch(updateItemOrder({
                            id: row.id,
                            params: JSON.stringify(['trackings', val.id.toString()]),
                            action: 'detach'
                          })).then(() => {
                            swal("Xoá tracking thành công!", {
                              icon: "success",
                            });
                            getOrderDetail(id)
                          })
                        }}
                      >
                        <span className="svg-icon svg-icon-md svg-icon-danger">
                          <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                        </span>
                      </a>
                    </OverlayTrigger>
                  </></td>
                </tr>

              )
            }


          </tbody>    


        </table>
      </div>
    ),
    showExpandColumn: true,
    expandByColumnOnly: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <b></b>;
      }
      return <b></b>;
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return (
          <a className="datatable-toggle-detail"><i className="fa fa-caret-down" style={{ color: '#3699FF' }}></i></a>
        );
      }
      return (
        <>
          <a className="datatable-toggle-detail" ><i className="fa fa-caret-right" style={{ color: '#3699FF' }}></i></a>
        </>
      );
    }
  };


  function statusFormatter(cell, row) {
    return (
      <>
        {row.checked ? (
          <span
            className="label label-lg label-light-success label-inline"
            style={{ marginLeft: "0", marginTop: "0" }}
          >
            Đã nhận
          </span>
        ) : (
            <span
              className="label label-lg label-light-info label-inline"
              style={{ marginLeft: "0", marginTop: "0" }}
            >
              Chưa nhận
            </span>
          )}
      </>
    );
  }

  const AddTracking = () => {
    if (code === "") {
      swal("Nhập mã tracking!", {
        icon: "warning",
      });
      return;
    }
    const data = {
      code: code,
      expected_delivery: expected_delivery,
      payment_due_date: payment_due_date,
    };
    console.log(data);

    dispatch(createTracking(data))
      .then((res) => {
        const _data = res.data;
        dispatch(
          updateOrder({
            id: orderObject.id,
            params: JSON.stringify(["trackings", _data.id.toString()]),
            action: "attach",
          })
        ).then((res) => {
          swal("Tạo tracking thành công!", {
            icon: "success",
          });
          getOrderShipment(id);
          setCheckModalTracking(false);
        });
      })
      .catch(() => {
        swal("Mã tracking đã tồn tại!", {
          icon: "warning",
        });
      });

    setCode("");
  };

  const AddTrackingItem = (IdItem) => {
    console.log(IdItem);
    if (code === '') {
      swal("Nhập mã tracking!", {
        icon: "warning",
      });
      return;
    }
    const data = {
      code: code,
      expected_delivery: expected_delivery,
      payment_due_date: payment_due_date
    }
    console.log(data);

    dispatch(createTracking(data)).then((res) => {
      const _data = res.data;
      dispatch(updateItemOrder({
        id: IdItem,
        params: JSON.stringify(['trackings', _data.id.toString()]),
        action: 'attach'
      })).then((res) => {
        swal("Tạo tracking thành công!", {
          icon: "success",
        });

        getOrderDetail(id);
      })
    }).catch(() => {
      swal("Mã tracking đã tồn tại!", {
        icon: "warning",
      });
    })

    setCode('');
  }


  return (
    <React.Fragment>
      <div className={checkLoading ? "overlay overlay-block rounded" : ""}>
        <div className={checkLoading ? "overlay-wrapper " : ""}>
          <div className="row">
            <div className="col pl-0 pr-0">
              <Card>
                <CardHeader
                  title={
                    orderObject.type?.id == "Wholesale"
                      ? "Chi tiết đơn sỉ"
                      : orderObject.type?.id == "Retail"
                        ? "Chi tiết đơn lẻ"
                        : orderObject.type?.id == "Shipment"
                          ? "Chi tiết đơn vận chuyển hộ"
                          : orderObject.type?.id == "Payment"
                            ? "Chi tiết đơn thanh toán hộ"
                            : "Chi tiết đơn đấu giá"
                  }
                >
                  <CardHeaderToolbar>
                    {orderObject.type?.id == "Wholesale" ? (
                      <Link
                        to={"/admin/orders/create-wholesale"}
                        type="button"
                        className="btn btn-primary mr-1"
                      >
                        <i className="fa fa-plus"></i>
                    Tạo đơn sỉ
                      </Link>
                    ) : orderObject.type?.id == "Shipment" ? (
                      <Link
                        to={"create-shippingpartner"}
                        type="button"
                        className="btn btn-primary mr-1"
                      >
                        <i className="fa fa-plus"></i>
                    Tạo đơn vận chuyển hộ
                      </Link>
                    ) : orderObject.type?.id == "Payment" ? (
                      <Link
                        to={"create-paymentpartner"}
                        type="button"
                        className="btn btn-primary mr-1"
                      >
                        <i className="fa fa-plus"></i>
                    Tạo đơn thanh toán hộ
                      </Link>
                    ) : (
                            ""
                          )}

                  </CardHeaderToolbar>
                </CardHeader>
              </Card>
            </div>
            {steps.length > 0 ? (
              <div className="col-auto pr-0">
                <Card>
                  <CardHeader title={"Thay đổi trạng thái đơn "}>
                    <CardHeaderToolbar>
                      {steps.map((item) => (
                        <div key={item}>
                          <button
                            type="button"
                            className="btn btn-primary mr-1"
                            onClick={() => {
                              dispatch(updateStatus(orderObject.id, item))
                                .then((res) => {
                                  swal("Đã cập nhật trạng thái!", {
                                    icon: "success",
                                  });
                                  setStep(res.data.steps);
                                  setStatusObject({
                                    name: res.data.status.name,
                                    id: res.data.status.id,
                                  });
                                  getMessage(id);
                                })
                                .catch(() => {
                                  swal("Chưa có sản phẩm nào trong đơn!", {
                                    icon: "warning",
                                  });
                                });
                            }}
                          >
                            {item}
                          </button>
                        </div>
                      ))}
                    </CardHeaderToolbar>
                  </CardHeader>
                </Card>
              </div>
            ) : (
                ""
              )}
          </div>

          {orderObject.type.id !== "Shipment" ? (
            <>
              <div className="row">
                <div className="col-5 pl-0 pr-0">
                  <Card style={{ height: "410px" }}>
                    <CardHeader title={"Thông tin đơn hàng"}></CardHeader>
                    <CardBody>
                      <div className="form-group row my-2">
                        <label className="col-5 col-form-label">Mã đơn:</label>
                        <div className="col-7">
                          <span className="form-control-plaintext font-weight-bolder">
                            #{orderObject.id}
                          </span>
                        </div>
                      </div>

                      <div className="form-group row my-2">
                        <label className="col-5 col-form-label">Trạng thái:</label>
                        <div className="col-7 pl-0 pr-0">
                          <span className="form-control-plaintext font-weight-bolder">
                            {statusObject.id === "Approved" ? (
                              <span
                                className="label label-lg label-light-info label-inline"
                                style={{ marginLeft: "0", marginTop: "0" }}
                              >
                                {statusObject.name}
                              </span>
                            ) : statusObject.id === "Pending" ? (
                              <span
                                className="label label-lg label-light-primary label-inline"
                                style={{ marginLeft: "0", marginTop: "0" }}
                              >
                                {statusObject.name}
                              </span>
                            ) : statusObject.id === "Cancelled" ? (
                              <span
                                className="label label-lg label-light-danger label-inline"
                                style={{ marginLeft: "0", marginTop: "0" }}
                              >
                                {statusObject.name}
                              </span>
                            ) : statusObject.id === "Finish" ? (
                              <span
                                className="label label-lg label-light-success label-inline"
                                style={{ marginLeft: "0", marginTop: "0" }}
                              >
                                {statusObject.name}
                              </span>
                            ) : statusObject.id === "Purchased" ? (
                              <span
                                className="label label-lg label-light-warning label-inline"
                                style={{ marginLeft: "0", marginTop: "0" }}
                              >
                                {statusObject.name}
                              </span>
                            ) : (
                                        <span
                                          className="label label-lg label-light-dark label-inline"
                                          style={{ marginLeft: "0", marginTop: "0" }}
                                        >
                                          {statusObject.name}
                                        </span>
                                      )}
                          </span>
                        </div>
                      </div>

                      <div className="form-group row my-2">
                        <label className="col-5 col-form-label">Loại:</label>
                        <div className="col-7">
                          <span className="form-control-plaintext font-weight-bolder">
                            {orderObject.type.id == "Retail" ? (
                              <span className="font-weight-bold text-primary">
                                {orderObject.type.name}
                              </span>
                            ) : orderObject.type.id == "Wholesale" ? (
                              <span className="font-weight-bold text-danger">
                                {orderObject.type.name}
                              </span>
                            ) : orderObject.type.id == "Auction" ? (
                              <span className="font-weight-bold text-success">
                                {orderObject.type.name}
                              </span>
                            ) : orderObject.type.id == "Auction" ? (
                              <span className="font-weight-bold text-info">
                                {orderObject.type.name}
                              </span>
                            ) : (
                                      <span className="font-weight-bold text-warning">
                                        {orderObject.type.name}
                                      </span>
                                    )}
                          </span>
                        </div>
                      </div>

                      <div className="form-group row my-2">
                        <label className="col-5 col-form-label">Ghi chú:</label>
                        <div className="col-7">
                          <span className="form-control-plaintext font-weight-bolder">
                            {orderObject.note}
                          </span>
                        </div>
                      </div>

                      <div className="form-group row my-2">
                        <label className="col-5 col-form-label">
                          Ngày đặt hàng:
                    </label>
                        <div className="col-7">
                          <span className="form-control-plaintext font-weight-bolder">
                            {/* {orderObject.created_at
                          ? Moment(orderObject.created_at).format(
                            "DD-MM-YYYY HH:MM"
                          )
                          : ""} */}
                            {orderObject.created_at
                              ? orderObject.created_at
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="form-group row my-2">
                        <label className="col-5 col-form-label">
                          Cập nhật lần cuối:
                    </label>
                        <div className="col-7">
                          <span className="form-control-plaintext font-weight-bolder">
                            {orderObject.updated_at
                              ? orderObject.updated_at
                              : ""}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="col-3">
                  <Card style={{ height: "410px" }}>
                    <CardHeader title={"Chi phí"}></CardHeader>
                    <CardBody>
                      <div className="form-group row my-2">
                        <label className="col-7 col-form-label">Tiền hàng:</label>
                        <div className="col-5 pl-0">

                          <span className="form-control-plaintext font-weight-bolder" style={{ fontSize: '18px' }}>
                            {orderObject.cost.sub_total}
                          </span>
                        </div>
                      </div>
                      <div className="form-group row my-2">
                        <label className="col-7 col-form-label">Thuế:</label>
                        <div className="col-5 pl-0">

                          <span className="form-control-plaintext font-weight-bolder" style={{ fontSize: '18px' }}>
                            {orderObject.cost.tax}
                          </span>
                        </div>
                      </div>

                      <div className="form-group row my-2">
                        <label className="col-7 col-form-label">Phụ phí:</label>
                        <div className="col-5 pl-0">
                          {
                            checkInputAddtional ?
                              <input className="form-control" value={addtional} onChange={(e) => {
                                setAddtional(e.target.value)
                              }} onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  setCheckInputAddtional(false);
                                  dispatch(updateCostOrder({
                                    id: id,
                                    addtional: addtional
                                  })).then((res) => {
                                    swal("Đã cập nhật phụ phí!", {
                                      icon: "success",
                                    });
                                    getMessage(id);
                                    setBalance(res.data.balance)
                                  }).catch(() => {
                                    swal("Cập nhật thất bại!", {
                                      icon: "warning",
                                    });
                                  })
                                }

                              }}  onBlur={()=>{
                                setCheckInputAddtional(false);
                              }} autoFocus/>
                              :
                              <span onClick={() => { setCheckInputAddtional(true) }} className="form-control-plaintext font-weight-bolder" data-toggle="tooltip" data-placement="right" title="Chỉnh sửa phụ phí" style={{ cursor: "pointer", fontSize: '18px' }}>
                                {addtional}
                              </span>
                          }


                        </div>
                      </div>

                      <div className="form-group row my-2">
                        <label className="col-7 col-form-label pr-0">
                          Chiết khấu thuế:
                    </label>
                        <div className="col-5 pl-0">
                          {
                            checkFormTax ?

                              <input className="form-control" value={discountTax} onChange={(e) => {
                                console.log(isNaN(e.target.value));
                                if (isNaN(e.target.value)) {
                                  swal("Thuế phải là số!", {
                                    icon: "warning",
                                  });
                                  setDiscountTax(orderObject.cost.discount_tax_percent)
                                  return;
                                }
                                if (e.target.value > 5) {
                                  swal("Thuế phải nhỏ hơn 5", {
                                    icon: "warning",
                                  });
                                  setDiscountTax(orderObject.cost.discount_tax_percent)
                                  return;
                                }
                                setDiscountTax(e.target.value)
                              }} onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  if (!discountTax) {
                                    swal("Nhập thuế ", {
                                      icon: "warning",
                                    });
                                    return;
                                  }
                                  setCheckFormTax(false);
                                  dispatch(updateCostOrder({
                                    id: id,
                                    discount_tax_percent: discountTax
                                  })).then((res) => {
                                    swal("Đã cập nhật thuế!", {
                                      icon: "success",
                                    });
                                    getMessage(id);
                                    setBalance(res.data.balance)
                                  }).catch(() => {
                                    swal("Cập nhật thất bại!", {
                                      icon: "warning",
                                    });
                                  })
                                }

                              }} onBlur={()=>{
                                setCheckFormTax(false);
                              }} autoFocus/>

                              :
                              <span onClick={() => { setCheckFormTax(true) }} className="pt-1 form-control-plaintext font-weight-bolder" data-toggle="tooltip" data-placement="right" title="Chỉnh sửa chiết khấu thuế" style={{ cursor: "pointer", fontSize: '18px' }}>
                                {discountTax}%
                        </span>
                          }

                        </div>
                      </div>

                      <div className="form-group row my-2">
                        <label className="col-7 col-form-label pr-0">Tổng tiền:</label>
                        <div className="col-5 pl-0">
                          <span className="form-control-plaintext font-weight-bolder" style={{ fontSize: '18px' }}>
                            {balance?Number(balance).toFixed(1):0}
                            
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="col-4">
                  <div className="row">
                    <div className="col-12 pl-0 pr-0">
                      <Card style={{ height: "160px" }} className="mb-2">
                        <CardHeader
                          className="pr-1"
                          title={"Hình thức vận chuyển"}
                        ></CardHeader>
                        <CardBody className="pb-1 pt-1">
                          <div className="form-group row my-2">
                            <label className="col-auto col-form-label"> Vận chuyển:</label>
                            <div className="col">
                              <Select
                                value={shipOption.filter(
                                  (obj) => obj.value === selectedValue
                                )}
                                options={shipOption}
                                onChange={shipMethodChange}
                              />
                            </div>
                          </div>
                          <div className="form-group row my-2">
                            <label className="col-auto col-form-label">Phí vận chuyển:</label>
                            <div className="col">
                              <span className="form-control-plaintext font-weight-bolder pt-1" style={{ fontSize: '18px' }}>
                                {orderObject?.shipment_method ? orderObject?.shipment_method?.fee : 0}
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 pl-0 pr-0">
                      <Card style={{ height: "243px" }}>
                        <CardHeader className="pr-0">
                          <div className="row w-100">
                            <div className="col-auto pt-7 pr-0">
                              <h3 className="card-label" style={{ fontWeight: '500', fontSize: '1.275rem' }}>Thông tin giao hàng</h3>
                            </div>
                            <div className="col pt-5 pr-0">
                              <Autocomplete
                                options={shipmentList}
                                autoHighlight
                                onChange={onShipmentChange}
                                getOptionLabel={(option) => option.consignee}
                                renderOption={(option) => (
                                  <React.Fragment>
                                    {option.consignee}
                                    {/* - {option.address} + {option.tel} */}
                                  </React.Fragment>
                                )}
                                renderInput={(params) => (
                                  <TextField {...params} variant="outlined" />
                                )}
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <CardBody className="pt-0 pb-0">

                          <div className="form-group row my-2">
                            <label className="col-4 col-form-label pr-0 pl-0">
                              Người nhận:
                        </label>
                            <div className="col-8">
                              <span className="form-control-plaintext font-weight-bolder">
                                {shipMentObiect.consignee}
                              </span>
                            </div>
                          </div>
                          <div className="form-group row my-2">
                            <label className="col-4 col-form-label pr-0 pl-0">
                              Số điện thoại:
                        </label>
                            <div className="col-8">
                              <span className="form-control-plaintext font-weight-bolder">
                                {shipMentObiect.tel}
                              </span>
                            </div>
                          </div>
                          <div className="form-group row my-2">
                            <label className="col-4 col-form-label pr-0 pl-0">
                              Địa chỉ:
                        </label>
                            <div className="col-8">
                              <span className="form-control-plaintext font-weight-bolder">
                                {shipMentObiect.address}
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 pl-0 pr-0">
                  <Card>
                    <CardBody>
                      <BootstrapTable
                        wrapperClasses="table-responsive"
                        classes="table table-head-custom table-vertical-center overflow-hidden"
                        onTableChange={console.log("Ok")}
                        bordered={false}
                        keyField="id"
                        caption={<CaptionElement />}
                        data={orderObject.items.length > 0 ? orderObject.items : []}
                        expandRow={expandRow}
                        columns={
                          orderObject.type.id == "Payment"
                            ? columnsPayment
                            : orderObject.type.id == "Wholesale"
                              ? columnsWholesaleBox
                              : columns
                        }
                        cellEdit={cellEditFactory({
                          mode: "click",
                          beforeSaveCell: (oldValue, newValue, row, column) => {
                            console.log(column);
                            if (column.dataField === "price") {
                              dispatch(
                                updateItemOrder({
                                  id: row.id,
                                  price: newValue,
                                })
                              ).then(() => {
                                getOrderDetail(id);
                                swal("Đã cập nhật giá!", {
                                  icon: "success",
                                });
                                getMessage(id);
                              });
                            } else if (column.dataField == "quantity") {
                              dispatch(
                                updateItemOrder({
                                  id: row.id,
                                  quantity: newValue,
                                })
                              ).then(() => {
                                getOrderDetail(id);
                                swal("Đã cập nhật số lượng!", {
                                  icon: "success",
                                });
                                getMessage(id);

                              });
                            } else if (column.dataField == 'package') {
                              dispatch(updatePackage({
                                id: row.product_id,
                                quantity: newValue,
                              })).then(() => {

                                getOrderDetail(id);
                                getMessage(id);
                                swal("Đã cập nhật!", {
                                  icon: "success",
                                });
                              })



                            }
                            console.log(column);
                          }
                        })}
                      />
                    </CardBody>
                  </Card>
                </div>
              </div>

              <div className="row">
                <div className="col pl-0">
                  <Card>
                    <CardHeader
                      title={"Danh sách thùng hàng (Chưa có vận đơn)"}
                    ></CardHeader>
                    <CardBody style={{ height: "250px", overflow: "auto" }}>
                      <BootstrapTable
                        wrapperClasses="table-responsive"
                        classes="table table-head-custom table-vertical-center overflow-hidden"
                        remote
                        bordered={false}
                        keyField="id"
                        data={boxes.length > 0 ? boxes : dataBox}
                        columns={columnsBox}
                      />
                    </CardBody>
                  </Card>
                </div>
                <div className="col pr-0">
                  <Card>
                    <CardHeader title={"Danh sách vận đơn"}></CardHeader>
                    <CardBody style={{ height: "250px", overflow: "auto" }}>
                      <BootstrapTable
                        wrapperClasses="table-responsive"
                        classes="table table-head-custom table-vertical-center overflow-hidden"
                        remote
                        bordered={false}
                        keyField="id"
                        data={ladingBill.length > 0 ? ladingBill : dataLadingBills}
                        columns={columnsLadingBills}
                      />
                    </CardBody>
                  </Card>
                </div>
              </div>

              <div className="row">
                <div className="col pl-0">
                  <Card>
                    <CardHeader title={"Giao dịch phát sinh"}></CardHeader>
                    <CardBody style={{ height: "300px", overflow: "auto" }}>
                      <BootstrapTable
                        wrapperClasses="table-responsive"
                        classes="table table-head-custom table-vertical-center overflow-hidden"
                        remote
                        bordered={false}
                        keyField="id"
                        data={transition.length > 0 ? transition : dataTrasaction}
                        columns={columnsTransaction}
                      />
                    </CardBody>
                  </Card>
                </div>
                <div className="col pr-0">
                  <Card>
                    <CardHeader title={"Lịch sử cập nhật"}></CardHeader>
                    <CardBody>
                      <div
                        style={{ height: "200px", overflow: "auto" }}
                        onScroll={(event) => {
                          const target = event.target;
                          if (
                            target.scrollHeight - target.scrollTop ==
                            target.clientHeight
                          ) {
                            console.log(
                              target.scrollHeight + "   " + target.scrollTop
                            );
                            // target.scrollTop+=0;
                          }
                        }}
                      >
                        <div className="timeline timeline-5 mt-3 timeline-demo">
                          {log.map((val, i) => (
                            <div
                              className="timeline-item align-items-start"
                              key={i}
                            >
                              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">{

                              }
                                {/* {val.updated_at
                                  ? Moment(val.updated_at).format(
                                    "DD-MM-YYYY HH:MM"
                                  )
                                  : "20/3/2020 10:30"} */}
                                {val.created_at
                                  ? val.created_at
                                  : "20/3/2020 10:30"}
                              </div>

                              <div className="timeline-badge">
                                <i
                                  className={
                                    "fa fa-genderless icon-xl text-" + val.class
                                  }
                                ></i>
                              </div>

                              <div className="font-weight-mormal font-size-lg timeline-content text-muted pl-3">
                                {val.content?.wrote?.status ? (
                                  <span>
                                    Đã cập nhật trạng thái{" "}
                                    <span className="text-primary">
                                      {" "}
                                      {val.content?.wrote?.status}
                                    </span>
                                  </span>
                                ) : val.content?.wrote ? (
                                  val.content?.wrote
                                ) : val.content?.supplier_id ? (
                                  <span>
                                    Đã cập nhật supplier_id{" "}
                                    <span className="text-primary">
                                      {" "}
                                      {val.content?.supplier_id}
                                    </span>
                                  </span>
                                ) : val.content?.director_id ? (
                                  <span>
                                    Đã cập nhật director_id{" "}
                                    <span className="text-primary">
                                      {" "}
                                      {val.content?.director_id}
                                    </span>
                                  </span>
                                ) : val.content?.product_id ? (
                                  <span>
                                    Đã cập nhật product_id
                                    <span className="text-primary">
                                      {" "}
                                      {val.content?.product_id}
                                    </span>
                                  </span>
                                ) :
                                          val.content?.mess ? (
                                            <span>
                                              Chỉnh sửa {' '}
                                              <span className="text-primary">
                                                {val.content?.product?.id}
                                              </span>

                                              <span >
                                                {val.content?.mess}
                                              </span>


                                            </span>
                                          ) :





                                            val.content?.product?.name?.quantity ? (
                                              <span>
                                                Chỉnh sửa{" "}
                                                <span className="text-primary">
                                                  {val.content?.product?.id}
                                                </span>{" "}
                                sl:{" "}
                                                <span className="text-primanry">
                                                  {val.content?.product?.name?.quantity}
                                                </span>
                                              </span>
                                            ) : val.content?.product?.name?.price ? (
                                              <span>
                                                Chỉnh sửa{" "}
                                                <span className="text-primary">
                                                  {val.content?.product?.id}
                                                </span>{" "}
                                giá:{" "}
                                                <span className="text-primanry">
                                                  {val.content?.product?.name?.price}
                                                </span>
                                              </span>
                                            ) : val.content?.product?.name?.tax_percent >= 0 ? (
                                              <span>
                                                Chỉnh sửa{" "}
                                                <span className="text-primary">
                                                  {val.content?.product?.id}
                                                </span>{" "}
                              % thuế:{" "}
                                                <span className="text-primanry">
                                                  {val.content?.product?.name?.tax_percent}
                                                </span>
                                              </span>
                                            ) : val.content?.addtional ? (
                                              <span>
                                                Đã cập nhật phụ phí
                                                <span className="text-primary">
                                                  {" "}
                                                  {val.content?.addtional}
                                                </span>
                                              </span>
                                            ) : val.content?.discount_tax_percent >= 0 ? (
                                              <span>
                                                Đã cập nhật thuế
                                                <span className="text-primary">
                                                  {" "}
                                                  {val.content?.discount_tax_percent}
                                                </span>
                                              </span>
                                            ) : val.content?.tax_percent ? (
                                              <span>
                                                Đã cập nhật % thuế
                                                <span className="text-primary">
                                                  {" "}
                                                  {val.content?.tax_percent}
                                                </span>
                                              </span>
                                            ) : (
                                                          ""
                                                        )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="input-group mt-4">
                        <input
                          className="form-control"
                          value={contentLog}
                          onChange={(e) => {
                            setContentLog(e.target.value);
                          }}
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => {
                              console.log("OK", contentLog);
                              dispatch(
                                writeNotification({
                                  content: contentLog,
                                  logable_type: "AppEntitiesOrder",
                                  logable_id: orderObject.id.toString(),
                                })
                              ).then((res) => {
                                console.log(res);
                                setContentLog("");
                                getMessage(orderObject.id);
                              });
                            }}
                          >
                            Lưu
                      </button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </>
          ) : (
              <>
                <div className="row">
                  <div className="col-6 pl-0">
                    <Card style={{ height: "405px" }}>
                      <CardHeader title={"Thông tin đơn hàng"}></CardHeader>
                      <CardBody>
                        <div className="form-group row my-2">
                          <label className="col-6 col-form-label">Mã đơn:</label>
                          <div className="col-6">
                            <span className="form-control-plaintext font-weight-bolder">
                              #{orderObject.id}
                            </span>
                          </div>
                        </div>

                        <div className="form-group row my-2">
                          <label className="col-6 col-form-label">Trạng thái:</label>
                          <div className="col-6">
                            <span className="form-control-plaintext font-weight-bolder">
                              {statusObject.id === "Approved" ? (
                                <span
                                  className="label label-lg label-light-info label-inline"
                                  style={{ marginLeft: "0", marginTop: "0" }}
                                >
                                  {statusObject.name}
                                </span>
                              ) : statusObject.id === "Pending" ? (
                                <span
                                  className="label label-lg label-light-primary label-inline"
                                  style={{ marginLeft: "0", marginTop: "0" }}
                                >
                                  {statusObject.name}
                                </span>
                              ) : statusObject.id === "Cancelled" ? (
                                <span
                                  className="label label-lg label-light-danger label-inline"
                                  style={{ marginLeft: "0", marginTop: "0" }}
                                >
                                  {statusObject.name}
                                </span>
                              ) : statusObject.id === "Finish" ? (
                                <span
                                  className="label label-lg label-light-success label-inline"
                                  style={{ marginLeft: "0", marginTop: "0" }}
                                >
                                  {statusObject.name}
                                </span>
                              ) : statusObject.id === "Purchased" ? (
                                <span
                                  className="label label-lg label-light-warning label-inline"
                                  style={{ marginLeft: "0", marginTop: "0" }}
                                >
                                  {statusObject.name}
                                </span>
                              ) : (
                                          <span
                                            className="label label-lg label-light-dark label-inline"
                                            style={{ marginLeft: "0", marginTop: "0" }}
                                          >
                                            {statusObject.name}
                                          </span>
                                        )}
                            </span>
                          </div>
                        </div>

                        <div className="form-group row my-2">
                          <label className="col-6 col-form-label">Loại:</label>
                          <div className="col-6">
                            <span className="form-control-plaintext font-weight-bolder">
                              {orderObject.type.id == "Retail" ? (
                                <span className="font-weight-bold text-primary">
                                  {orderObject.type.name}
                                </span>
                              ) : orderObject.type.id == "Wholesale" ? (
                                <span className="font-weight-bold text-danger">
                                  {orderObject.type.name}
                                </span>
                              ) : orderObject.type.id == "Auction" ? (
                                <span className="font-weight-bold text-success">
                                  {orderObject.type.name}
                                </span>
                              ) : orderObject.type.id == "Auction" ? (
                                <span className="font-weight-bold text-info">
                                  {orderObject.type.name}
                                </span>
                              ) : (
                                        <span className="font-weight-bold text-warning">
                                          {orderObject.type.name}
                                        </span>
                                      )}
                            </span>
                          </div>
                        </div>

                        <div className="form-group row my-2">
                          <label className="col-6 col-form-label">Ghi chú:</label>
                          <div className="col-6">
                            <span className="form-control-plaintext font-weight-bolder">
                              {orderObject.note}
                            </span>
                          </div>
                        </div>

                        <div className="form-group row my-2">
                          <label className="col-6 col-form-label">
                            Ngày đặt hàng:
                    </label>
                          <div className="col-6">
                            <span className="form-control-plaintext font-weight-bolder">
                              {orderObject.created_at
                                ? orderObject.created_at
                                : ""}
                            </span>
                          </div>
                        </div>

                        <div className="form-group row my-2">
                          <label className="col-6 col-form-label">
                            Cập nhật lần cuối:
                    </label>
                          <div className="col-6">
                            <span className="form-control-plaintext font-weight-bolder">
                              {orderObject.updated_at
                                ? orderObject.updated_at
                                : ""}
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <div className="col-6 pr-0">
                    <div className="row">
                      <div className="col-12">
                        <Card>
                          <CardHeader title={"Hình thức vận chuyển"}>
                          </CardHeader>
                          <CardBody className="pb-1 pt-1">
                            <div className="form-group row my-2">
                              <label className="col-auto col-form-label"> Vận chuyển:</label>
                              <div className="col">
                                <Select
                                  value={shipOption.filter(
                                    (obj) => obj.value === selectedValue
                                  )}
                                  options={shipOption}
                                  onChange={shipMethodChange}
                                />
                              </div>
                            </div>
                            {/* <div className="form-group row my-2">
                      <label className="col-2 col-form-label"> Tên:</label>
                      <div className="col-10">
                        <span className="form-control-plaintext font-weight-bolder">
                          {selectedValue == "air" ? "Đường bay" : "Đường biển"}
                        </span>
                      </div>
                    </div> */}
                            <div className="form-group row my-2">
                              <label className="col-auto col-form-label">Phí vận chuyển:</label>
                              <div className="col">
                                <span className="form-control-plaintext font-weight-bolder pt-1"
                                  style={{ fontSize: '18px' }}>
                                  {orderObject?.shipment_method ? orderObject?.shipment_method?.fee : 0}
                                </span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <Card
                        >
                          <CardHeader className="pr-0">
                            <div className="row w-100">
                              <div className="col-auto pt-7 pr-0">
                                <h3 className="card-label" style={{ fontWeight: '500', fontSize: '1.275rem' }}>Thông tin giao hàng</h3>
                              </div>
                              <div className="col pt-5 pr-0">
                                <Autocomplete
                                  options={shipmentList}
                                  autoHighlight
                                  onChange={onShipmentChange}
                                  getOptionLabel={(option) => option.consignee}
                                  renderOption={(option) => (
                                    <React.Fragment>
                                      {option.consignee}
                                      {/* - {option.address} + {option.tel} */}
                                    </React.Fragment>
                                  )}
                                  renderInput={(params) => (
                                    <TextField {...params} variant="outlined" />
                                  )}
                                />
                              </div>
                            </div>
                          </CardHeader>
                          <CardBody className="pt-0 pb-0">
                            <div className="form-group row my-2">
                              <label className="col-4 col-form-label pr-0 pl-0">
                                Người nhận:
                        </label>
                              <div className="col-8">
                                <span className="form-control-plaintext font-weight-bolder">
                                  {shipMentObiect.consignee}
                                </span>
                              </div>
                            </div>
                            <div className="form-group row my-2">
                              <label className="col-4 col-form-label pr-0 pl-0">
                                Số điện thoại:
                        </label>
                              <div className="col-8">
                                <span className="form-control-plaintext font-weight-bolder">
                                  {shipMentObiect.tel}
                                </span>
                              </div>
                            </div>
                            <div className="form-group row my-2">
                              <label className="col-4 col-form-label pr-0 pl-0">
                                Địa chỉ:
                        </label>
                              <div className="col-8">
                                <span className="form-control-plaintext font-weight-bolder">
                                  {shipMentObiect.address}
                                </span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 pl-0 pr-0">
                    <Card>
                      <CardHeader title={"Danh sách tracking"}>
                        <CardHeaderToolbar>
                          <i
                            className="ki ki-plus"
                            style={{ cursor: "pointer" }}
                            onClick={() => setCheckModalTracking(true)}
                          ></i>
                        </CardHeaderToolbar>
                      </CardHeader>
                      <CardBody>
                        <BootstrapTable
                          wrapperClasses="table-responsive"
                          classes="table table-head-custom table-vertical-center overflow-hidden"
                          remote
                          bordered={false}
                          keyField="id"
                          data={
                            orderObject.trackings.length > 0
                              ? orderObject.trackings
                              : []
                          }
                          columns={columnsTracking}
                        />
                      </CardBody>
                    </Card>
                  </div>
                </div>

                <div className="row">
                  <div className="col pl-0">
                    <div className="row">
                      <div className="col">
                        <Card style={{ height: "100%" }}>
                          <CardHeader
                            title={"Danh sách thùng hàng (Chưa có vận đơn)"}
                          ></CardHeader>
                          <CardBody>
                            <BootstrapTable
                              wrapperClasses="table-responsive"
                              classes="table table-head-custom table-vertical-center overflow-hidden"
                              remote
                              bordered={false}
                              keyField="id"
                              data={boxes.length > 0 ? boxes : dataBox}
                              columns={columnsBox}
                            />
                          </CardBody>
                        </Card>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col">
                        <Card style={{ height: "100%" }}>
                          <CardHeader title={"Danh sách vận đơn"}></CardHeader>
                          <CardBody>
                            <BootstrapTable
                              wrapperClasses="table-responsive"
                              classes="table table-head-custom table-vertical-center overflow-hidden"
                              remote
                              bordered={false}
                              keyField="id"
                              data={
                                ladingBill.length > 0 ? ladingBill : dataLadingBills
                              }
                              columns={columnsLadingBills}
                            />
                          </CardBody>
                        </Card>
                      </div>
                    </div>
                  </div>
                  <div className="col pr-0">
                    <Card style={{ height: "100%" }}>
                      <CardHeader title={"Lịch sử cập nhật"}></CardHeader>
                      <CardBody className="pb-0">
                        <div style={{ height: "455px", overflow: "auto" }}>
                          <div className="timeline timeline-5 timeline-demo mt-3">
                            {log.map((val, i) => (
                              <div
                                className="timeline-item align-items-start"
                                key={i}
                              >
                                <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                                  {/* {val.created_at
                                    ? Moment(val.created_at).format(
                                      "DD-MM-YYYY HH:MM"
                                    )
                                    : "12/2/2020 12:30"} */}
                                  {val.created_at
                                    ? val.created_at
                                    : "12/2/2020 12:30"}
                                </div>

                                <div className="timeline-badge">
                                  <i
                                    className={
                                      "fa fa-genderless icon-xl text-" + val.class
                                    }
                                  ></i>
                                </div>

                                <div className="font-weight-mormal font-size-lg timeline-content text-muted pl-3">
                                  {val.content?.wrote?.status ? (
                                    <span>
                                      Đã cập nhật trạng thái{" "}
                                      <span className="text-primary">
                                        {val.content?.wrote?.status}
                                      </span>
                                    </span>
                                  ) : val.content?.wrote ? (
                                    val.content?.wrote
                                  ) : val.content?.supplier_id ? (
                                    <span>
                                      Đã cập nhật supplier_id{" "}
                                      <span className="text-primary">
                                        {val.content?.supplier_id}
                                      </span>
                                    </span>
                                  ) : val.content?.director_id ? (
                                    <span>
                                      Đã cập nhật director_id{" "}
                                      <span className="text-primary">
                                        {val.content?.director_id}
                                      </span>
                                    </span>
                                  ) : val.content?.product_id ? (
                                    <span>
                                      Đã cập nhật product_id{" "}
                                      <span className="text-primary">
                                        {val.content?.product_id}
                                      </span>
                                    </span>
                                  ) :
                                            val.content?.mess ? (
                                              <span>
                                                Chỉnh sửa
                                                <span className="text-primary">
                                                  {val.content?.product?.id}
                                                </span>

                                                <span >
                                                  {val.content?.mess}
                                                </span>


                                              </span>
                                            ) : val.content?.product?.name?.quantity ? (
                                              <span>
                                                Chỉnh sửa{" "}
                                                <span className="text-primary">
                                                  {val.content?.product?.id}
                                                </span>{" "}
                                sl:{" "}
                                                <span className="text-primanry">
                                                  {val.content?.product?.name?.quantity}
                                                </span>
                                              </span>
                                            ) : val.content?.product?.name?.price ? (
                                              <span>
                                                Chỉnh sửa{" "}
                                                <span className="text-primary">
                                                  {val.content?.product?.id}
                                                </span>{" "}
                                giá:{" "}
                                                <span className="text-primanry">
                                                  {val.content?.product?.name?.price}
                                                </span>
                                              </span>
                                            ) : val.content?.product?.name?.tax_percent >= 0 ? (
                                              <span>
                                                Chỉnh sửa{" "}
                                                <span className="text-primary">
                                                  {val.content?.product?.id}
                                                </span>{" "}
                                % thuế:{" "}
                                                <span className="text-primanry">
                                                  {val.content?.product?.name?.tax_percent}
                                                </span>
                                              </span>
                                            ) : val.content?.addtional ? (
                                              <span>
                                                Đã cập nhật phụ phí
                                                <span className="text-primary">
                                                  {" "}
                                                  {val.content?.addtional}
                                                </span>
                                              </span>
                                            ) : val.content?.discount_tax_percent >= 0 ? (
                                              <span>
                                                Đã cập nhật thuế
                                                <span className="text-primary">
                                                  {" "}
                                                  {val.content?.discount_tax_percent}%
                                  </span>
                                              </span>
                                            ) : (
                                                          ""
                                                        )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardBody>
                      <CardFooter className="pt-0">
                        <div className="input-group mt-4">
                          <input
                            className="form-control"
                            value={contentLog}
                            onChange={(e) => {
                              setContentLog(e.target.value);
                            }}
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-primary"
                              type="button"
                              onClick={() => {
                                dispatch(
                                  writeNotification({
                                    content: contentLog,
                                    logable_type: "AppEntitiesOrder",
                                    logable_id: orderObject.id.toString(),
                                  })
                                ).then((res) => {
                                  console.log(res);
                                  setContentLog("");
                                  getMessage(orderObject.id);
                                });
                              }}
                            >
                              Lưu
                      </button>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </>
            )}
        </div>

        {
          checkLoading ?
            <div className="overlay-layer rounded bg-primary-o-20">
              <div className="spinner spinner-primary"></div>
            </div> : ''
        }
      </div>
      <Modal show={checkModalTracking}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo Tracking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group row">
            <label className="col-4 col-form-label"> Mã Tracking:</label>
            <div className="col-8">
              <input
                className="form-control"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-4 col-form-label"> Ngày giao hàng:</label>
            <div className="col-8">
              <TextField
                // style={{ width: 125 }}
                type="date"
                defaultValue={expected_delivery}
                onInput={(e) => setExpectedDelivery(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-4 col-form-label"> Hạn thanh toán:</label>
            <div className="col-8">
              <TextField
                // style={{ width: 125 }}
                type="date"
                defaultValue={payment_due_date}
                onInput={(e) => setPaymentDueDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setCheckModalTracking(false)}
          >
            Đóng
          </Button>
          <Button variant="primary" onClick={() => AddTracking()}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={orderWholesaleObject.check}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div className="form-group row">
            <label className="col-6 col-form-label"> Giá bán:</label>
            <div className="col-6">
              <input
                className="form-control"
                value={orderWholesaleObject.price}
                onChange={(e) => {
                  setOrderWholesaleObject({
                    price: e.target.value,
                    check: true,
                    is_box: orderWholesaleObject.is_box,
                    quantity: orderWholesaleObject.quantity,
                    package: orderWholesaleObject.package,
                    product_id: orderWholesaleObject.product_id,
                    IdOrderItem: orderWholesaleObject.IdOrderItem,
                    taxPercent: orderWholesaleObject.taxPercent
                  })
                }}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-6 col-form-label"> Số lượng bán:</label>
            <div className="col-6">
              <input
                className="form-control"
                value={orderWholesaleObject.quantity}
                onChange={(e) => {
                  setOrderWholesaleObject({
                    quantity: e.target.value,
                    check: true,
                    is_box: orderWholesaleObject.is_box,
                    price: orderWholesaleObject.price,
                    package: orderWholesaleObject.package,
                    product_id: orderWholesaleObject.product_id,
                    IdOrderItem: orderWholesaleObject.IdOrderItem,
                    taxPercent: orderWholesaleObject.taxPercent,
                    note: orderWholesaleObject.note
                  })
                }}
              />
            </div>
          </div> */}
          <div className="form-group row">
            <label className="col-6 col-form-label"> Phần trăm thuế:</label>
            <div className="col-6">
              <Select
                value={taxList.filter(
                  (obj) => obj.value === orderWholesaleObject.taxPercent
                )}
                options={taxList}
                onChange={taxChange}
              />
            </div>
          </div>
          {/* {
            orderWholesaleObject.is_box ?
              <div className="form-group row">
                <label className="col-6 col-form-label"> Số lượng cái trong thùng:</label>
                <div className="col-6">
                  <input
                    className="form-control"
                    value={orderWholesaleObject.package}
                    onChange={(e) => {
                      setOrderWholesaleObject({
                        package: e.target.value,
                        check: true,
                        is_box: true,
                        price: orderWholesaleObject.price,
                        quantity: orderWholesaleObject.quantity,
                        product_id: orderWholesaleObject.product_id,
                        IdOrderItem: orderWholesaleObject.IdOrderItem,
                        taxPercent: orderWholesaleObject.taxPercent,
                        properties: orderWholesaleObject.properties,
                        note: orderWholesaleObject.note
                      })
                    }}
                  />
                </div>
              </div>
              : ''
          } */}
          {/* <div className="form-group row">
            <label className="col-6 col-form-label"> Thuộc tính:</label>
            <div className="col-6">
              <input
                className="form-control"
                value={orderWholesaleObject.properties}
                onChange={(e) => {
                  setOrderWholesaleObject({
                    quantity: orderWholesaleObject.quantity,
                    check: true,
                    is_box: orderWholesaleObject.is_box,
                    price: orderWholesaleObject.price,
                    package: orderWholesaleObject.package,
                    product_id: orderWholesaleObject.product_id,
                    IdOrderItem: orderWholesaleObject.IdOrderItem,
                    taxPercent: orderWholesaleObject.taxPercent,
                    note: orderWholesaleObject.note,
                    properties: e.target.value
                  })
                }}
              />
            </div>
          </div> */}
          <div className="form-group row">
            <label className="col-6 col-form-label"> Ghi chú:</label>
            <div className="col-6">
              <input
                className="form-control"
                value={orderWholesaleObject.note}
                onChange={(e) => {
                  setOrderWholesaleObject({
                    quantity: orderWholesaleObject.quantity,
                    check: true,
                    is_box: orderWholesaleObject.is_box,
                    price: orderWholesaleObject.price,
                    package: orderWholesaleObject.package,
                    product_id: orderWholesaleObject.product_id,
                    IdOrderItem: orderWholesaleObject.IdOrderItem,
                    taxPercent: orderWholesaleObject.taxPercent,
                    properties: orderWholesaleObject.properties,
                    note: e.target.value
                  })
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setOrderWholesaleObject({ check: false })}
          >
            Đóng
          </Button>
          <Button variant="primary" onClick={() => {
            dispatch(
              updateItemOrder({
                id: orderWholesaleObject.IdOrderItem,
                tax_percent: orderWholesaleObject.taxPercent,
                // properties: orderWholesaleObject.properties,
                note: orderWholesaleObject.note
              })
            ).then(() => {

              setCheckLoading(true)
              getOrderDetail(id);
              getMessage(id);

              swal("Đã cập nhật!", {
                icon: "success",
              });
              setOrderWholesaleObject({ check: false })
            });
            // if (orderWholesaleObject.is_box) {
            //   dispatch(
            //     updateItemOrder({
            //       id: orderWholesaleObject.IdOrderItem,
            //       price: orderWholesaleObject.price,
            //       quantity: orderWholesaleObject.quantity,
            //       tax_percent: orderWholesaleObject.taxPercent,
            //       // properties: orderWholesaleObject.properties,
            //       note: orderWholesaleObject.note
            //     })
            //   ).then(() => {
            //     dispatch(updatePackage({
            //       id: orderWholesaleObject.product_id,
            //       quantity: orderWholesaleObject.package
            //     })).then(() => {
            //       setCheckLoading(true)
            //       getOrderDetail(id);
            //       getMessage(id);
            //       setOrderWholesaleObject({ check: false })
            //       swal("Đã cập nhật!", {
            //         icon: "success",
            //       });
            //     })
            //   });
            // } else {
            //   dispatch(
            //     updateItemOrder({
            //       id: orderWholesaleObject.IdOrderItem,
            //       price: orderWholesaleObject.price,
            //       quantity: orderWholesaleObject.quantity,
            //       tax_percent: orderWholesaleObject.taxPercent,
            //       // properties: orderWholesaleObject.properties,
            //       note: orderWholesaleObject.note
            //     })
            //   ).then(() => {

            //     setCheckLoading(true)
            //     getOrderDetail(id);
            //     getMessage(id);

            //     swal("Đã cập nhật!", {
            //       icon: "success",
            //     });
            //     setOrderWholesaleObject({ check: false })
            //   });
            // }

            console.log(orderWholesaleObject);
          }}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
