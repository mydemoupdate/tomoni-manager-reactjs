import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { useDispatch } from 'react-redux'
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "react-select";
import {
    getCustomerByObject,
    getTransactionTypeWithObject,
    getPaymentMethod,
    updatePaymentMethod,
    savePaymentMethod,
    deletePaymentMethod,
    saveTransaction,
    saveReceipt
} from "../../_redux_/accountingSlice";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import { Button, Modal, OverlayTrigger, Tooltip, Form, FormControl } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
export function TransactionCreate() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [userList, setUserList] = useState([]);
    const [valueSearch, setValueSearch] = useState('');
    const [amount, setAmount] = useState(0);
    const [typeAmount, setTypeAmount] = useState();
    const [paymentMethod, setPaymentMethod] = useState();
    const [description, setDescription] = useState('');
    const [currentPageUser, setCurrentPageUser] = useState(1);
    const [showFowY, setShowFlowY] = useState(true);
    const [typeTransactionList, setTypeTransactionList] = useState([]);
    const [valueTypeSelect, setValueTypeSelect] = useState();
    const [paymentList, setPaymentList] = useState([]);
    const [valuePaymentSelect, setValuePaymentSelect] = useState();
    const [checkModalPaymentMethod, setCheckModalPaymentMethod] = useState(false);
    const [IDPayment, setIDPayment] = useState('');
    const [namePayment, setNamePayment] = useState('');
    const [checkIdEditPayment, setCheckIDEditPayment] = useState(false);
    const [file, setFile] = useState();

    useEffect(() => {
        dispatch(getTransactionTypeWithObject('?with=currency')).then((res) => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name + ' - ' + _data[i]?.currency?.name
                });
            }
            setTypeTransactionList(result);
            setValueTypeSelect(_data[0].id)
        })

        getPaymentMethodList();

    }, [dispatch]);
    function getPaymentMethodList(){
        dispatch(getPaymentMethod()).then((res) => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name
                });
            }
            setPaymentList(result);
            setValuePaymentSelect(_data[0].id)
        })
    }
    function save() {
        if (valueSearch == '') {
            swal("Chọn khách hàng !", {
                icon: "warning",
            });
            return;
        }
        if (valuePaymentSelect == '') {
            swal("Chọn phương thức thanh toán!", {
                icon: "warning",
            });
            return;
        }
        if (isNaN(amount)) {
            swal("Tiền phải là số!", {
              icon: "warning",
            });
            return;
        }
        if (amount<0) {
            swal("Tiền phải lớn hơn 0!", {
              icon: "warning",
            });
            return;
        }
        dispatch(saveTransaction({
            user_id: valueSearch,
            amount: amount,
            description: description,
            type_id: valueTypeSelect,
            payment_method_id: valuePaymentSelect
        })).then((respon)=>{
           saveReceipt(file,respon.data.id);
           history.push('/admin/transaction/'+respon.data.id) 
        }).catch((resp)=>{
            swal("Tạo mới thất bại!", {
                        icon: "warning",
                      });
              })
        
    }
    function handleInputChange(e) {
        setValueSearch(e.target.value)
        setShowFlowY(true)
        dispatch(getCustomerByObject('?search=' + e.target.value)).then((data) => {
            const _data = data.data || {};
            setCurrentPageUser(_data.last_page);
            setUserList(_data.data);
        })
    }
    function onUserChange(values) {
        setValueSearch(values.id)
        setShowFlowY(false)
    }

    function typeTransactionChange(val) {
        setValueTypeSelect(val.value)
        console.log(val);
    }
    function paymentMethodChange(val) {
        setValuePaymentSelect(val.value)
        console.log(val);
    }
    function savePayment(){
        if (IDPayment == '') {
            swal("Nhập ID  !", {
                icon: "warning",
            });
            return;
        }
        if (namePayment == '') {
            swal("Nhập Tên  !", {
                icon: "warning",
            });
            return;
        }
        if (checkIdEditPayment) {
            dispatch(updatePaymentMethod({
                id: IDPayment,
                name: namePayment
            })).then(() => {
                swal("Đã cập nhật thành công!", {
                    icon: "success",
                })
                getPaymentMethodList();
             setIDPayment('');
             setNamePayment('');
             setCheckIDEditPayment(false)
            }).catch(() => {
                swal("Cập nhật thất bại !", {
                    icon: "warning",
                });
            })
        } else {
            dispatch(savePaymentMethod({
                id: IDPayment,
                name: namePayment
            })).then(() => {
                swal("Đã tạo thành công!", {
                    icon: "success",
                })
                getPaymentMethodList();
                setIDPayment('');
                setNamePayment('');
            }).catch(() => {
                swal("Tạo thất bại !", {
                    icon: "warning",
                });
                setIDPayment('');
            })
        }
    }
    function cancelPayment(){
        setCheckIDEditPayment(false);
        setIDPayment('');
        setNamePayment('');
    }
    function fileChange(e){
            setFile(e.target.files[0])
    }
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <Card>
                        <CardHeader title="Tạo giao dịch">
                            <CardHeaderToolbar>
                                <button
                                    type="button"
                                    className="btn btn-primary float-right"
                                    onClick={save}
                                >
                                    Lưu
                </button>

                            </CardHeaderToolbar>
                        </CardHeader>
                        <CardBody>
                            <div className="row">
                                <div className="col-2"></div>


                                <div className="col-8">


                                    <h1 className=" text-dark font-weight-bold mb-10">
                                        Thông tin khách hàng:</h1>

                                    <div className="row">
                                        <label className="col-4">
                                            Chọn khách hàng
                                        </label>
                                        <div className="col-8">
                                            <input
                                                className="form-control"
                                                value={valueSearch}
                                                onChange={handleInputChange}
                                                onClick={handleInputChange}
                                            />
                                            {
                                                userList.length > 0 && showFowY ?
                                                    <ul className="product-item-autocomplete" style={{ width: '96%' }} onScroll={(event) => {
                                                        const target = event.target;
                                                        if (
                                                            target.scrollHeight - target.scrollTop ==
                                                            target.clientHeight
                                                        ) {

                                                            dispatch(getCustomerByObject('?search=' + valueSearch + '&page=' + currentPageUser)).then((data) => {
                                                                const _data = data.data || {};
                                                                if (currentPageUser <= _data.last_page) {
                                                                    return;
                                                                }
                                                                setCurrentPageUser(_data.last_page);
                                                                setUserList(userList.concat(_data.data));
                                                            })
                                                        }
                                                    }}>

                                                        {

                                                            userList.map((val, key) =>

                                                                <li key={key} onClick={() => onUserChange(val)}>{val.id} ({val.email})</li>

                                                            )

                                                        }

                                                    </ul> : ''
                                            }

                                        </div>
                                    </div>


                                    <div className="separator separator-dashed my-10"></div>

                                    <div className="form-group row mb-0">
                                        <label className="col-9 col-form-label">
                                            <h1 className=" text-dark font-weight-bold mb-10">
                                                Thông tin giao dịch:
    </h1>
                                        </label>
                                        <div className="col-3 text-right pt-5">
                                            <i
                                                className="ki ki-plus icon-lg mr-5"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => { history.push('/admin/transaction-type/') }}
                                            ></i>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <label className="col-4 col-form-label">Loại giao dịch</label>
                                        <div className="col-8">
                                            <Select
                                                value={typeTransactionList.filter(
                                                    (obj) => obj.value === valueTypeSelect
                                                )}
                                                options={typeTransactionList}
                                                onChange={typeTransactionChange}
                                            />
                                        </div>
                                    </div>


                                    <div className="separator separator-dashed my-10"></div>

                                    <div className="form-group row mb-0">
                                        <label className="col-9 col-form-label">
                                            <h1 className=" text-dark font-weight-bold mb-10">
                                                Phương thức thanh toán:
</h1>
                                        </label>
                                        <div className="col-3 text-right pt-5">
                                            <i
                                                className="ki ki-plus icon-lg mr-5"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {setCheckModalPaymentMethod(true)}}
                                            ></i>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <label className="col-4 col-form-label">Chọn phương thức</label>
                                        <div className="col-8">
                                            <Select
                                                value={paymentList.filter(
                                                    (obj) => obj.value === valuePaymentSelect
                                                )}
                                                options={paymentList}
                                                onChange={paymentMethodChange}
                                            />
                                        </div>
                                    </div>


                                    <div className="separator separator-dashed my-10"></div>

                                    <h1 className=" text-dark font-weight-bold mb-10">
                                        Thông tin chung:</h1>

                                    <div className="row mt-5">
                                        <label className="col-4 col-form-label">
                                            Số tiền
                        </label>
                                        <div className="col-8">
                                            <input
                                                type="number"
                                                className="form-control"
                                                defaultValue={amount}
                                                onChange={(e) => {
                                                    setAmount(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-5">
                                        <label className="col-4 col-form-label">
                                            Mô tả
                        </label>
                                        <div className="col-8">
                                            <input
                                                className="form-control"
                                                defaultValue={description}
                                                onChange={(e) => {
                                                    setDescription(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>


                                    <div className="row mt-5">
                                        <label className="col-4 col-form-label">
                                            Chứng từ
                                        </label>
                                        <div className="col-8">
                                            <div className="custom-file">
                                                <input type="file" className="custom-file-input" onChange={fileChange}/ >
                                            <label className="custom-file-label">{file?.name?file.name:'Chọn file'}</label>
                                            </div>
                                        </div>
                                    </div>




                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <Modal show={checkModalPaymentMethod}
                size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tạo phương thức thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="react-bootstrap-table table-responsive ">

                        <table className="table table table-head-custom table-vertical-center overflow-hidden">
                            <thead>
                                <tr>
                                    <th className="border-top-0">Mã phương thức</th>
                                    <th className="border-top-0">Tên phương thức</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="font-weight-boldest">
                                    <td className="pt-2 border-left border-bottom">
                                        <input className="form-control" value={IDPayment} onChange={(e) => {
                                            setIDPayment(e.target.value)
                                        }}
                                        disabled={checkIdEditPayment} 
                                        />
                                    </td>
                                    <td className="pt-2 border-bottom">
                                        <input className="form-control" value={namePayment} onChange={(e) => {
                                            setNamePayment(e.target.value)
                                        }} />
                                    </td>
                                    <td className="pt-3 border-right" width="20%">
                                        <button type="button"
                                            className="btn btn-success mr-1 btn-sm" onClick={savePayment}>Lưu
</button>
                                        <button type="button"
                                            className="btn btn-danger btn-sm" onClick={cancelPayment}>Huỷ
</button>
                                    </td>
                                </tr>

                                {
                                    paymentList.map((val, i) =>
                                        <tr key={i + 'payment-method'}>
                                            <td className="border-left border-bottom">

                                                {
                                                    val.value
                                                }
                                            </td>

                                            <td className="border-bottom"> {val.label}</td>
                                            <td className="border-right border-bottom">  <>
                                                <OverlayTrigger
                                                    overlay={<Tooltip>Chỉnh sửa</Tooltip>}
                                                >
                                                    <a
                                                        onClick={() => {
                                                            setIDPayment(val.value)
                                                            setNamePayment(val.label)
                
                                                            setCheckIDEditPayment(true)
                                                        }}
                                                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                                    >
                                                        <span className="svg-icon svg-icon-md svg-icon-primary">
                                                            <SVG
                                                                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                                                            />
                                                        </span>
                                                    </a>
                                                </OverlayTrigger>
                                                <>
                                                </>
                                                <OverlayTrigger
                                                    overlay={<Tooltip>Xoá  </Tooltip>}
                                                >
                                                    <a
                                                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                                                        onClick={() => {
                                                            dispatch(deletePaymentMethod(val.value)).then(() => {
                                                                swal("Đã xoá thành công!", {
                                                                    icon: "success",
                                                                })
                                                                getPaymentMethodList();

                                                            }).catch((err) => {
                                                                swal("Xoá thất bại !", {
                                                                    icon: "warning",
                                                                });
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

                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setCheckModalPaymentMethod(false)}
                    >
                        Đóng
          </Button>
                </Modal.Footer>
            </Modal>

        </React.Fragment>

    );
}


