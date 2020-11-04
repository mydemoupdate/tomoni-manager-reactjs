import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import swal from "sweetalert";
import Moment from "moment";
import Select from "react-select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {
  getSupplier,
  getTaxesList,
  updatePackage,
  getPurchasesById, getProductList, getSupplierById, updatePurchases, createTracking, updateItemOrder,
  getItemOrder
} from '../../_redux_/ordersSlice'
import { useParams } from "react-router-dom";
import { FormControl, Button, Modal, Tab, Tabs, OverlayTrigger, Tooltip } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from 'react-bootstrap-table2-editor';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
export function OrderPurchaseDetail() {
  const dispatch = useDispatch()
  const [steps, setStep] = useState([]);
  const [statusObject, setStatusObject] = useState({
    id: "",
    name: "",
  });
  const [orderObject, setOrderObject] = useState({
    type: {
      id: 'Retail',
      name: ''
    },
    steps: [],
    id: '',
    status: { name: '' },
    note: '',
    created_at: '',
    updated_at: '',
    cost: {
      sub_total: 0,
      tax: 0,
      addtional: 0,
      discount_tax_percent: 0,
      balance: 0
    },
    order_items: [
      {
        trackings: []
      }
    ],
    shipment_infor: {
      consignee: '',
      address: '',
      tel: ''
    },
    shipment_method_id: 'air',
    shipmentMethodWarehouse: { fee: 0 },
    buyer_id: ''

  });
  const [orderObjectModal, setOrderObjectModal] = useState({
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
  const [supplierList, setSupplierList] = useState([]);
  const [supplierObject, setSupplierObject] = useState({
    id: '',
    name: '',
    address: '',
    email: ''
  })
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
  const [code, setCode] = useState('');
  const [checkFormTracking, setCheckFormTracking] = useState('');
  const [taxList, setTaxList] = useState([0]);
  const { id } = useParams()
  useEffect(() => {
    if (id) {
      getOrderPurchasesById(id);
      dispatch(getSupplier()).then(res => {
        const _data = res.data.data;
        setSupplierList(_data);
      })
    }
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
  }, [dispatch]);
  function getOrderPurchasesById(id) {
    dispatch(getPurchasesById(id)).then(res => {
      const object = res.data || {};
      var productID = [];
      var objectItems = object.order_items || [];
      setStatusObject({
        id: object.status.id,
        name: object.status.name,
      });


      for (var i = 0; i < objectItems.length; i++) {
        productID.push(objectItems[i].product_id);
      }
      console.log(object)
      if (objectItems.length > 0) {
        dispatch(getItemOrder('appends=product.unit;product.package;supplier&search=purchase.id:'+id)).then((response)=>{
          const _data = response.data.data || [];
          for (var m = 0; m < objectItems.length; m++) {
            for (var n = 0; n < _data.length; n++) {
              if (objectItems[m].product_id === _data[n].product_id) {
                objectItems[m]["name"] = _data[n]?.product.name;
                objectItems[m]["images"] = _data[n]?.product?.images?.url;
                objectItems[m]["package"] =objectItems[m].is_box?_data[n]?.product?.package?.quantity:'';
              } 
            }
          }
          setOrderObject(object);
        }).catch(() => {
          setOrderObject(object);
        })
      } else {
        setOrderObject(object);
      }
      console.log(object)

      dispatch(getSupplierById(object.supplier_id)).then(res => {
        setSupplierObject(res.data)
      })
    })
  }
  const onSupplierChange = (event, values) => {
    if (values) {

      dispatch(updatePurchases({
        id: orderObject.id,
        supplier_id: values.id
      })).then(res => {
        swal("Đã cập nhật nhà cung cấp!", {
          icon: "success",
        });
        setSupplierObject(values);
      })
    }
  }
  const AddTracking = (IdItem) => {
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
        getOrderPurchasesById(id);
      })
    }).catch(() => {
      swal("Mã tracking đã tồn tại!", {
        icon: "warning",
      });
    })

    setCode('');
  }
  const taxChange = (e) => {
    setOrderObjectModal({
      check: true,
      IdOrderItem: orderObjectModal.IdOrderItem,
      taxPercent: e.value,
      properties: orderObjectModal.properties,
      note: orderObjectModal.note
    })
  };

  const columns = [
    {
      dataField: "stt",
      text: "STT",
      editable: false,
      formatter: STTFormatter,
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
      headerStyle: { width: '100px' }

    },
    {
      headerStyle: { width: '100px' },
      dataField: "quantity",
      text: "Số lượng",
      style: {
        width: '100px',
        fontSize: '18px'
      },
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
      // style: {
      //   width: '100px',
      // },
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
    },

    {
      dataField: "action",
      text: "Actions",
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      editable: false,
      formatter: actionFormatter,
      style: {
        minWidth: "100px",
      }
    },
  ]
  function actionFormatter(cell, row, rowIndex, formatExtraData) {
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

              setOrderObjectModal({
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
  function taxPercentFormatter(cell, row) {
    return (
      <>
        {row.tax_percent ? Math.round(row.tax_percent) : 0}%

      </>
    );
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
              {row.product_id}
            </div>
            <div>
              Hình thức:{" "}
              <span className="text-info">
                {
                  row.is_box ? 'Thùng'

                    :
                    "Cái"

                }
              </span>
            </div>
          </div>
        </div>


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
  function typeFormatter(cell, row) {
    return (
      <>
        {row.is_box ?
          <span className="label label-lg label-light-info label-inline" style={{ marginLeft: '0', marginTop: '0' }}>
            Thùng
                </span>
          :
          <span className="label label-lg label-light-primary label-inline" style={{ marginLeft: '0', marginTop: '0' }}>
            Cái
                </span>

        }
      </>
    )
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
                      format={'DD/MM/YYYY'}
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
                      className="btn btn-success mr-1 btn-sm" onClick={() => AddTracking(row.id)}>Lưu
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
                  <td className="border-left border-bottom">{val.code}</td>
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
                            getOrderPurchasesById(id);
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

  return (
    <>
      <div className="row">
        <div className="col">
          <Card>
            <CardHeader title="Chi tiết đơn mua hàng">

            </CardHeader>
          </Card>
        </div>
        {steps.length > 0 ? (
          <div className="col">
            <Card>
              <CardHeader title={"Thay đổi trạng thái đơn "}>
                <CardHeaderToolbar>
                  {steps.map((item) => (
                    <div key={item}>

                      <button
                        type="button"
                        className="btn btn-primary mr-1"
                        onClick={() => {
                          dispatch(updatePurchases(
                            {
                              id: orderObject.id,
                              status: item
                            }
                          )).then(res => {
                            swal("Đã cập nhật trạng thái!", {
                              icon: "success",
                            });
                          })
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


      <div className="row">
        <div className="col-6">
          <Card style={{ height: "340px" }}>
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
                <label className="col-5 col-form-label">Người mua:</label>
                <div className="col-7">
                  <span className="form-control-plaintext font-weight-bolder">
                    #{orderObject.buyer_id}
                  </span>
                </div>
              </div>

              <div className="form-group row my-2">
                <label className="col-5 col-form-label">Trạng thái:</label>
                <div className="col-7">
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
                    {/* {orderObject.updated_at
                          ? Moment(orderObject.updated_at).format(
                              "DD-MM-YYYY HH:MM"
                            )
                          : ""} */}
                    {orderObject.updated_at
                      ? orderObject.updated_at
                      : ""}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="col-6">
          <Card style={{ height: "340px" }}>
            <CardHeader>
              <div className="row w-100">
                <div className="col-auto pt-7 ">
                  <h3 className="card-label" style={{ fontWeight: '500', fontSize: '1.275rem' }}>Thông tin nhà cung cấp</h3>
                </div>
                <div className="col pt-5">
                  <Autocomplete
                    options={supplierList}
                    autoHighlight
                    onChange={onSupplierChange}
                    getOptionLabel={option => option.name}
                    renderOption={option => (
                      <React.Fragment>
                        {option.name} -  ({option.email}) - {option.address}
                      </React.Fragment>
                    )}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              </div>

            </CardHeader>
            <CardBody>
              <div className="form-group row my-2">
                <label className="col-4 col-form-label">Tên nhà cung cấp:</label>
                <div className="col-8">
                  <span className="form-control-plaintext font-weight-bolder">
                    {supplierObject.name}
                  </span>
                </div>
              </div>

              <div className="form-group row my-2">
                <label className="col-4 col-form-label pr-0">
                  Email:
                    </label>
                <div className="col-8">
                  <span className="form-control-plaintext font-weight-bolder">
                    {supplierObject.email}
                  </span>
                </div>
              </div>
              <div className="form-group row my-2">
                <label className="col-4 col-form-label pr-0">
                  Địa chỉ:
                    </label>
                <div className="col-8">
                  <span className="form-control-plaintext font-weight-bolder">
                    {supplierObject.address}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="col-12">
          <Card>
            <CardHeader title={"Nội dung hàng hoá"}></CardHeader>
            <CardBody>
              <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"

                onTableChange={console.log('Ok')}
                rowStyle={{ cursor: "pointer" }}
                bordered={false}
                keyField='id'
                data={orderObject?.order_items.length>0?orderObject.order_items:[]}
                columns={columns}
                cellEdit={cellEditFactory({
                  mode: 'click',
                  beforeSaveCell: (oldValue, newValue, row, column) => {
                    if (column.dataField === 'price') {
                      dispatch(updateItemOrder({
                        id: row.id,
                        price: newValue
                      })).then(() => {
                        getOrderPurchasesById(id);
                        swal("Đã cập nhật giá!", {
                          icon: "success",
                        });
                      })
                    } else if (column.dataField == 'quantity') {
                      dispatch(updateItemOrder({
                        id: row.id,
                        quantity: newValue
                      })).then(() => {
                        getOrderPurchasesById(id);
                        swal("Đã cập nhật số lượng!", {
                          icon: "success",
                        });
                      })
                    } else if (column.dataField == 'package') {
                      dispatch(updatePackage({
                        id: row.product_id,
                        quantity: newValue,
                      })).then(() => {

                        getOrderPurchasesById(id);
                        swal("Đã cập nhật!", {
                          icon: "success",
                        });
                      })



                    }
                  },
                })}
                expandRow={expandRow}
              />
            </CardBody>
          </Card>

        </div>
      </div>


      <Modal show={orderObjectModal.check}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group row">
            <label className="col-6 col-form-label"> Phần trăm thuế:</label>
            <div className="col-6">
              <Select
                value={taxList.filter(
                  (obj) => obj.value === orderObjectModal.taxPercent
                )}
                options={taxList}
                onChange={taxChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-6 col-form-label"> Ghi chú:</label>
            <div className="col-6">
              <input
                className="form-control"
                value={orderObjectModal.note}
                onChange={(e) => {
                  setOrderObjectModal({
                    check: true,
                    IdOrderItem: orderObjectModal.IdOrderItem,
                    taxPercent: orderObjectModal.taxPercent,
                    properties: orderObjectModal.properties,
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
            onClick={() => setOrderObjectModal({ check: false })}
          >
            Đóng
          </Button>
          <Button variant="primary" onClick={() => {
            dispatch(
              updateItemOrder({
                id: orderObjectModal.IdOrderItem,
                tax_percent: orderObjectModal.taxPercent,
                note: orderObjectModal.note
              })
            ).then(() => {
              getOrderPurchasesById(id);

              swal("Đã cập nhật!", {
                icon: "success",
              });
              setOrderObjectModal({ check: false })
            });

          }}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>

  );
}


