import React, { useEffect, useState } from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import "../../../assets/css/wizard.wizard-4.css"
import '../../../assets/css/style-main.css'
import swal from 'sweetalert';
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { getShelve, getPalletAll, createPallet, deletePallet, updatePallte } from '../../_redux_/warehouseSlice';
import { useDispatch } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import { Button, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import Select from 'react-select';




export function PalletList() {

    const history = useHistory();
    let location = useLocation();

    const [totals, setTotals] = useState(0);
    const [perPages, setPerPages] = useState(0);
    const [shelveList, setShelveList] = useState([]);
    const [palletList, setPalletList] = useState([])
    let [orderNumerical, setOrderNumerical] = useState(1);

    const [shelveId, setShelveId] = useState('');
    const [row, setRow] = useState('');
    const [column, setColumn] = useState('')
    const [floor, setFloor] = useState('');


    //update shipping method
    const [checkModal, setCheckModal] = useState(false)
    const [idPllet, setIdPallet] = useState('')
    const [idShelve, setIdShelve] = useState('')
    const [rowUpdate, setRowUpdate] = useState('')
    const [columnUpdate, setColumnUpdate] = useState('')
    const [floorUpdate, setFloorUpdate] = useState('')



    const getHandlerTableChange = (e) => { }

    useEffect(() => {
        getPalletList()

    }, [location]);
    const dispatch = useDispatch();

    function getPalletList(object) {
        dispatch(getPalletAll(object)).then(res => {
            const _data = res.data || {};
            setPerPages(_data.per_page);
            setTotals(_data.total);
            setPalletList(_data.data);

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
            })

        })


    }
    const options = {
        hideSizePerPage: true,
        sizePerPage: perPages,
        totalSize: totals,
        onPageChange: (page, sizePerPage) => {
            getPalletList('page=' + page)
            setOrderNumerical(15 * (page - 1) + 1)
        },
    };

    const columns = [
        {
            dataField: "stt",
            text: "Số thứ tự",
            sort: true,
            style: {
                minWidth: "100px",
                width: '10%'
            }

        },
        {
            dataField: "id",
            text: "Mã pallet",
            sort: true,
            // style: {
            //     fontWeight: "bold"
            // },
            // headerStyle: { color: 'black' },
            // style: { fontWeight: 'bold' }
        },
        {
            dataField: "row",
            text: "Hàng",
            sort: true,
        },
        {
            dataField: "column",
            text: "Cột",
            sort: true,
        },
        {
            dataField: "floor",
            text: "Tầng",
            sort: true,
        },
        {
            dataField: "shelve_id",
            text: "Shelve Id",
            sort: true,
            // formatter: shelveFormatter,
        },
        {
            dataField: "area_name",
            text: "Khu vực hàng",
            sort: true,
        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: rankFormatter,
            // style: {
            //     minWidth: "100px",
            //     width: '20%'
            // }
        },
    ]

    function shelveFormatter(cell, row) {
        return (
            <>
                <div>
                    Hàng: <span style={{ marginLeft: '1%' }}>{row?.row}</span>
                </div>
                <div>
                    Cột: <span style={{ marginLeft: '1%' }}>{row?.column}</span>{" "}
                </div>
                <div>
                    Tầng: <span style={{ marginLeft: '1%' }}>{row?.floor}</span>{" "}
                </div>
            </>
        );
    }

    function rankFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Chi tiết</Tooltip>}
                >
                    <Link
                        onClick={() => {
                            setCheckModal(true)
                            setIdPallet(row.id)
                            setIdShelve(row.shelve_id)
                            setRowUpdate(row.row)
                            setColumnUpdate(row.column)
                            setFloorUpdate(row.floor)
                        }}
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

                <>
                </>
                <OverlayTrigger
                    overlay={<Tooltip>Xoá đại lý kho </Tooltip>}
                >
                    <a
                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                        onClick={() => {
                            swal({
                                title: "Bạn có muốn xoá kệ " + row.id + " ?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["Huỷ", "Xoá"],
                            })
                                .then((willDelete) => {
                                    if (willDelete) {
                                        deletePallet(row.id).then(() => {
                                            swal("Đã xoá thành công!", {
                                                icon: "success",
                                            }).then(setOrderNumerical(1)).then(history.push("/admin/pallet"));
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
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    const areaChange = (e) => {
        setShelveId(e.value)
    }
    const areaUpdate = (e) => {
        setIdShelve(e.value)
    }

    return (
        <div>
            <div className='row' style={{ marginTop: '1%' }}>
                <div className="col-3">
                    <Card style={{ marginBottom: '0' }} >
                        <CardHeader title={"Thêm đế đựng hàng"}>
                            <CardHeaderToolbar>

                            </CardHeaderToolbar>
                        </CardHeader>

                        <CardBody style={{ height: '100%' }} >

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-primary align-self-stretch" ></span> */}
                                <label className="col-4 col-form-label">Hàng:</label>
                                <div className="col-8">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập hàng" onInput={e => setRow(e.target.value)} />
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-warning align-self-stretch" ></span> */}
                                <label className="col-4 col-form-label">Cột:</label>
                                <div className="col-8">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập cột" onInput={e => setColumn(e.target.value)} />
                                    </span>
                                </div>
                            </div>

                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-dark align-self-stretch" ></span> */}
                                <label className="col-4 col-form-label">Tầng:</label>
                                <div className="col-8">
                                    <span className="form-control-plaintext font-weight-bolder">
                                        <input class="form-control" id="exampleFormControlInput1" placeholder="Nhập tầng" onInput={e => setFloor(e.target.value)} />
                                    </span>
                                </div>
                            </div>
                            <div className="form-group row my-2">
                                {/* <span className="bullet bullet-bar bg-dark align-self-stretch" ></span> */}
                                <label className="col-4 col-form-label">Mã shelve:</label>
                                <div className="col-8">
                                    <span>
                                        <Select
                                            // value={agencyList.filter(
                                            //     (obj) => obj.value === agencys
                                            // )}
                                            options={shelveList}
                                            onChange={areaChange}
                                            placeholder='Chọn mã shelve'
                                        />
                                    </span>
                                </div>
                            </div>
                            <div>
                                <Link
                                    style={{ float: 'right' }}
                                    onClick={() => {
                                        setTimeout(() => {
                                            createPallet(shelveId, row, column, floor)

                                                .then((res) => {
                                                    swal("Đã thêm thành công!", {
                                                        icon: "success",
                                                    }).then(setOrderNumerical(1)).then(history.push("/admin/pallet"));
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    swal("Thêm không thành công!", {
                                                        icon: "warning",
                                                    });
                                                });

                                            // createProductBox(idBox, productId, quantityBox )

                                        })
                                    }}
                                    type="button"
                                    className="btn btn-primary"
                                ><i className="fa fa-plus"></i>
                                    Lưu
                                </Link>
                            </div>
                        </CardBody>
                    </Card>

                </div>
                <div className="col-9" >
                    <form className="form form-label-right" style={{ height: '100%' }}>
                        <Card style={{ marginBottom: "0", height: '100%' }}>
                            <CardHeader title="Danh sách đế hàng">
                                <CardHeaderToolbar>
                                    {/* <OverlayTrigger
                                        overlay={<Tooltip>Thêm thùng</Tooltip>}
                                    >

                                        <Link
                                            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                            style={{ float: "right" }}
                                            // onClick={() => setCheckModalBox(true)}
                                        >
                                            <span className="svg-icon svg-icon-md svg-icon-primary">
                                                <SVG
                                                    src={toAbsoluteUrl("/media/svg/icons/Files/File-plus.svg")}
                                                />
                                            </span>
                                        </Link>
                                    </OverlayTrigger> */}


                                </CardHeaderToolbar>
                            </CardHeader>
                            <CardBody>
                                <BootstrapTable
                                    wrapperClasses="table-responsive"
                                    classes="table table-head-custom table-vertical-center overflow-hidden"
                                    remote
                                    // hover
                                    rowStyle={{ cursor: "pointer" }}
                                    bordered={false}
                                    keyField='id'
                                    data={palletList.map(pallet => ({
                                        ...pallet,
                                        stt: orderNumerical++,
                                        area_name: capitalizeFirstLetter(pallet?.shelve?.area_id) 
                                    }))}
                                    columns={columns}
                                    onTableChange={getHandlerTableChange}
                                    pagination={paginationFactory(options)}


                                />
                            </CardBody>
                        </Card>
                    </form>

                </div>

            </div>


            {/* Modal update agency*/}
            <Modal
                show={checkModal}
                dialogClassName="w-custome-20"
            // aria-labelledby="example-custom-modal-styling-title"
            // size="lg"
            // min-width='35%'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết pallet {idPllet}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="form-group row">
                        <label className="col-3 col-form-label"> Hàng:</label>
                        <div className="col-9">
                            <input
                                className="form-control"
                                value={rowUpdate}
                                onInput={e => setRowUpdate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-3 col-form-label"> Cột:</label>
                        <div className="col-9">
                            <input
                                className="form-control"
                                value={columnUpdate}
                                onInput={e => setColumnUpdate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-3  col-form-label"> Tầng:</label>
                        <div className="col-9">
                            <input
                                className="form-control"
                                value={floorUpdate}
                                onInput={e => setFloorUpdate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-3  col-form-label"> Mã shelve:</label>
                        <div className="col-9">
                            <span>
                                <Select
                                    value={shelveList.filter(
                                        (obj) => obj.value === idShelve
                                    )}
                                    options={shelveList}
                                    onChange={areaUpdate}
                                    placeholder='Chọn mã shelve'
                                />
                            </span>
                        </div>
                    </div>





                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary"
                        onClick={() => {
                            updatePallte(idPllet, idShelve, rowUpdate, columnUpdate, floorUpdate)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModal(false)).then(history.push("/admin/pallet"));
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