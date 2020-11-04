import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { Button, Modal, OverlayTrigger, Tooltip, Form, FormControl } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { Link, useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useDispatch } from 'react-redux';
import Select from "react-select";
import {
    getTransactionTypeWithObject,
    deleteTransactionType,
    getCurrenciesWithObject,
    saveTransactionType,
    updateTransactionType,
    deleteCurrencies,
    updateCurrencies,
    saveCurrencies
} from '../../_redux_/accountingSlice'
import swal from "sweetalert";
export function TransactionType() {
    const dispatch = useDispatch()
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [transactionType, setTransactionType] = useState([]);
    const [ID, setID] = useState('');
    const [name, setName] = useState('');
    const [currency_id, setCurrency_id] = useState();
    const [currencyList, setCurrencyList] = useState([]);
    const [checkIDEdit, setCheckIdEdit] = useState(false);
    const [checkCurrencyForm, setCheckCurrencyForm] = useState(false);
    const [IDcurrencies, setIDcurrencies] = useState('');
    const [nameCurrencies, setNameCurrencies] = useState('');
    const [symbolCurrencies, setSymbolCurrencies] = useState('');
    const [checkIdEditCurrencty, setCheckIDEditCurrency] = useState(false);
    const [typeSearch, setTypeSearch] = useState('');
    useEffect(() => {
        getListTransactionType('');
        getListCurrencyList();
    }, [dispatch]);
    function getListTransactionType(search) {
        dispatch(getTransactionTypeWithObject('?with=currency&orderBy=id&sortedBy=desc'+search)).then((response) => {
            const dataObject = response.data || {};
            setTransactionType(dataObject)
        })
    }
    function getListCurrencyList() {
        dispatch(getCurrenciesWithObject('?orderBy=id&sortedBy=desc')).then((response) => {
            const dataObject = response.data || {};
            var result = [];
            for (var i = 0; i < dataObject.length; i++) {
                result.push({
                    value: dataObject[i].id,
                    label: dataObject[i].name,
                    symbol: dataObject[i].symbol,
                });
            }
            setCurrencyList(result);
            setCurrency_id(dataObject[0].id)
        })
    }
    const onFindChange = (e) => {
        setTypeSearch(e.target.value)
    }
    const onKeySearch = (e) => {
        if(typeSearch && e.target.value){
            getListTransactionType('&search='+typeSearch+':'+e.target.value);

        }else{
            getListTransactionType('&search='+e.target.value);
        }
    }
    function currencyChange(object) {
        if (object) {
            setCurrency_id(object.value)
        }
    }
    function saveTransitionType() {
        if (ID == '') {
            swal("Nhập ID  !", {
                icon: "warning",
            });
            return;
        }
        if (name == '') {
            swal("Nhập Tên  !", {
                icon: "warning",
            });
            return;
        }
        if (checkIDEdit) {
            dispatch(updateCurrencies({
                id: ID,
                name: name,
                currency_id: currency_id
            })).then(() => {
                swal("Đã cập nhật thành công!", {
                    icon: "success",
                })
                getListTransactionType('');
                setID('')
                setName('');
                setCheckIdEdit(false);
            }).catch((error) => {
                if(error?.response?.status == 403){
                    swal("Không có quyền cập nhật !", {
                        icon: "warning",
                    });
                 return;   
                }
                swal("Cập nhật thất bại !", {
                    icon: "warning",
                });
                setID('')
                setName('');
                setCheckIdEdit(false);
            })
        } else {
            dispatch(saveTransactionType({
                id: ID,
                name: name,
                currency_id: currency_id
            })).then(() => {
                swal("Đã tạo thành công!", {
                    icon: "success",
                })
                getListTransactionType('');
                setID('')
                setName('')
            }).catch((error) => {
                if(error?.response?.status == 403){
                    swal("Không có quyền tạo !", {
                        icon: "warning",
                    });
                 return;   
                }
                swal("Tạo thất bại !", {
                    icon: "warning",
                });
                setID('')
            })
        }


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
                    dispatch(deleteTransactionType(object.id)).then(() => {
                        swal("Đã xoá thành công!", {
                            icon: "success",
                        })
                        getListTransactionType('');

                    }).catch((error) => {
                        if(error?.response?.status == 403){
                            swal("Không có quyền xoá !", {
                                icon: "warning",
                            });
                         return;   
                        }
                        swal("Xoá thất bại !", {
                            icon: "warning",
                        });
                    })
                }
            });
    }
    function editDataRow(row) {
        setCheckIdEdit(true);
        setID(row.id);
        setName(row.name);
        setCurrency_id(row.currency_id);
    }
    function saveCurrency() {
        if (IDcurrencies == '') {
            swal("Nhập ID  !", {
                icon: "warning",
            });
            return;
        }
        if (nameCurrencies == '') {
            swal("Nhập Tên  !", {
                icon: "warning",
            });
            return;
        }
        if (symbolCurrencies == '') {
            swal("Nhập biểu tượng  !", {
                icon: "warning",
            });
            return;
        }
        if (checkIdEditCurrencty) {
            dispatch(updateCurrencies({
                id: IDcurrencies,
                name: nameCurrencies,
                symbol: symbolCurrencies
            })).then(() => {
                swal("Đã cập nhật thành công!", {
                    icon: "success",
                })
                getListCurrencyList();
             setIDcurrencies('');
             setNameCurrencies('');
             setSymbolCurrencies('');
             setCheckIDEditCurrency(false);
            }).catch((error) => {
                if(error?.response?.status == 403){
                    swal("Không có quyền cập nhật !", {
                        icon: "warning",
                    });
                 return;   
                }
                swal("Cập nhật thất bại !", {
                    icon: "warning",
                });
            })
        } else {
            dispatch(saveCurrencies({
                id: IDcurrencies,
                name: nameCurrencies,
                symbol: symbolCurrencies
            })).then(() => {
                swal("Đã tạo thành công!", {
                    icon: "success",
                })
                getListCurrencyList();
                setIDcurrencies('');
                setNameCurrencies('');
                setSymbolCurrencies('');
            }).catch((error) => {
                if(error?.response?.status == 403){
                    swal("Không có quyền tạo !", {
                        icon: "warning",
                    });
                 return;   
                }
                swal("Tạo thất bại !", {
                    icon: "warning",
                });
                setIDcurrencies('');
            })
        }
    }
    function cancelCurrency() {
        setIDcurrencies('');
        setNameCurrencies('');
        setSymbolCurrencies('');
        setCheckIDEditCurrency(false)
    }
    const columnsTransactionType = [
        {
            dataField: "id",
            text: "ID",
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "name",
            text: "Tên",
        },
        {
            dataField: "currency.name",
            text: "Loại tiền",
        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
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
                    <a
                        onClick={() => { editDataRow(row) }}
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
                        onClick={() => { deleteModal(row) }}
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
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <Card>
                        <CardHeader title="Danh sách loại giao dịch">
                            <CardHeaderToolbar>
                            </CardHeaderToolbar>
                        </CardHeader>
                        <CardBody>

                            <div className="row">
                                <div className="form-group col-3 pl-0">
                                    <label>ID</label>
                                    <input className="form-control"
                                        disabled={checkIDEdit}
                                        value={ID}
                                        onChange={(e) => {
                                            setID(e.target.value)
                                        }} />
                                </div>
                                <div className="form-group col-3">
                                    <label >Tên</label>
                                    <input className="form-control" value={name}
                                        onChange={(e) => {
                                            setName(e.target.value)
                                        }} />
                                </div>
                                <div className="form-group col-3">
                                    <label >Loại tiền <i
                                        className="ki ki-plus ml-5"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => { setCheckCurrencyForm(true) }}
                                    ></i></label>

                                    <Select
                                        value={currencyList.filter(
                                            (obj) => obj.value === currency_id
                                        )}
                                        options={currencyList}
                                        onChange={currencyChange}
                                    />
                                </div>
                                <div className="form-group col-2">
                                    {
                                        checkIDEdit ?
                                            <button className="btn btn-danger mt-8 mr-1" onClick={() => {
                                                setCheckIdEdit(false)
                                                setID('')
                                                setName('')
                                            }}>Huỷ</button>
                                            : ''
                                    }
                                    <button className="btn btn-primary mt-8" onClick={saveTransitionType}>Lưu</button>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-3 pl-0">

                                    <Form.Control as="select" onChange={onFindChange}>
                                        <option value=''>Tất cả</option>
                                        <option value='id'>ID</option>
                                        <option value='name'>Tên</option>
                                    </Form.Control>
                                </div>
                                <div className="col-7">
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
                                        data={transactionType.length > 0 ? transactionType : []}
                                        columns={columnsTransactionType}
                                        onTableChange={() => { }}
                                    // rowEvents={rowEvents}
                                    // pagination={paginationFactory(options)}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>


            <Modal show={checkCurrencyForm}
                size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tạo loại tiền</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="react-bootstrap-table table-responsive ">

                        <table className="table table table-head-custom table-vertical-center overflow-hidden">
                            <thead>
                                <tr>
                                    <th className="border-top-0">Mã</th>
                                    <th className="border-top-0">Tên</th>
                                    <th className="border-top-0">Biểu tượng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="font-weight-boldest">
                                    <td className="pt-2 border-left border-bottom">
                                        <input className="form-control" value={IDcurrencies} onChange={(e) => {
                                            setIDcurrencies(e.target.value)
                                        }}
                                        disabled={checkIdEditCurrencty} 
                                        />
                                    </td>
                                    <td className="pt-2 border-bottom">
                                        <input className="form-control" value={nameCurrencies} onChange={(e) => {
                                            setNameCurrencies(e.target.value)
                                        }} />
                                    </td>
                                    <td className="pt-2 border-bottom">
                                        <input className="form-control" value={symbolCurrencies} onChange={(e) => {
                                            setSymbolCurrencies(e.target.value)
                                        }} />
                                    </td>
                                    <td className="pt-3 border-right" width="20%">
                                        <button type="button"
                                            className="btn btn-success mr-1 btn-sm" onClick={saveCurrency}>Lưu
</button>
                                        <button type="button"
                                            className="btn btn-danger btn-sm" onClick={cancelCurrency}>Huỷ
</button>
                                    </td>
                                </tr>

                                {
                                    currencyList.map((val, i) =>
                                        <tr key={i + 'currencies'}>
                                            <td className="border-left border-bottom">{val.value}</td>
                                            <td className="border-bottom"> {val.label}</td>
                                            <td className="border-bottom"> {val.symbol}</td>
                                            <td className="border-right border-bottom text-right">  <>
                                                <OverlayTrigger
                                                    overlay={<Tooltip>Chỉnh sửa</Tooltip>}
                                                >
                                                    <a
                                                        onClick={() => {
                                                            setIDcurrencies(val.value)
                                                            setNameCurrencies(val.label)
                                                            setSymbolCurrencies(val.symbol)
                                                            setCheckIDEditCurrency(true)
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
                                                            dispatch(deleteCurrencies(val.value)).then(() => {
                                                                swal("Đã xoá thành công!", {
                                                                    icon: "success",
                                                                })
                                                                getListCurrencyList();

                                                            }).catch((error) => {
                                                                if(error?.response?.status == 403){
                                                                    swal("Không có quyền xoá !", {
                                                                        icon: "warning",
                                                                    });
                                                                 return;   
                                                                }
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
                        onClick={() => setCheckCurrencyForm(false)}
                    >
                        Đóng
          </Button>

                </Modal.Footer>
            </Modal>

        </React.Fragment>

    );
}


