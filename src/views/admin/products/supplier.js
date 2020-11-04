import React, { useEffect, useState } from 'react';
import { useDispatch} from 'react-redux'
import { getProducts, getSuppliersList, updateSuppliers, deleteSupplier, getProductsS , updatePrice} from '../../_redux_/productsSlice'
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import SVG from "react-inlinesvg";
import paginationFactory from 'react-bootstrap-table2-paginator';
import {
    Card,
    CardBody,
} from "../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import swal from 'sweetalert';
import {  useHistory } from "react-router-dom";
import { useLocation } from "react-router";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import cellEditFactory from 'react-bootstrap-table2-editor';

const useStyless = makeStyles(theme => ({
    card: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));
export function Suppliers(state, action) {

    const [product, setProduct] = useState([])
    const [suppliers, setSupplier] = useState([]);
    const [suppList, setSupplierList] = useState([])
    const dispatch = useDispatch()
    const history = useHistory();
    let location = useLocation();
    const { SearchBar } = Search;
    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const classes = useStyless();
    const [expanded, setExpanded] = React.useState(false);

    function handleExpandClick() {
        setExpanded(!expanded);
    }
   
    let num = 1;

    useEffect(() => {

        getProductsS(ids).then(result => setProduct(result.data?.suppliers))
        getProductsS(ids).then(result => setSupplierList(result.data?.suppliers))
        dispatch(getSuppliersList()).then(res => {
            setSupplier(res.data.data)
        })

    }, [location]);
    // console.log(product)
    const columns = [
        {
            dataField: "id_",
            text: "STT",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' },
            editable: false
        },
        {
            dataField: "name",
            text: "Tên",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' },
            editable: false
        },
        {
            dataField: "link",
            text: "Liên kết",
            sort: true,
            editable: false
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
            editable: false
        },
        {
            dataField: "address",
            text: "Địa chỉ ",
            sort: true,
            editable: false
        },
        {
            dataField: "price_",
            text: "Giá tiền",
            sort: true,

        },
        {
            dataField: "note",
            text: "Ghi chú",
            sort: true,
            editable: false
        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: rankFormatter,
            style: {
                minWidth: "100px",
            },
            editable: false
        }


    ]
    const getHandlerTableChange = (e) => { }
    const useStyles = makeStyles(theme => ({
        button: {
            margin: theme.spacing(1),
        },
        leftIcon: {
            marginRight: theme.spacing(1),
        },
        rightIcon: {
            marginLeft: theme.spacing(1),
        },
        iconSmall: {
            fontSize: 20,
        },
    }));

    const onSupplierChange = async (event, values) => {
        if (values) {
            console.log(product.findIndex(x => x.id === values.id))
            if (product.findIndex(x => x.id === values.id) === -1) {
                setProduct([...product, values])
            }

        }
    }
    const options = {
        hideSizePerPage: true,
        onPageChange: (page, sizePerPage) => {
            dispatch(getProducts());
        },
    };
    Array.prototype.intersection = function (arr) {
        return this.filter(function (e) {
            return arr.indexOf(e) === -1;
        });
    };

    var intersection = (product.map(m => m.id)).intersection((suppList.map(m => m?.id)));

    // function handleChange() {
    //     setChecked(prev => !prev);
    // }
    console.log(intersection)
    function rankFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <>
                </>
                <OverlayTrigger
                    overlay={<Tooltip>Xoá nhà cung cấp</Tooltip>}
                >
                    <button
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                        onClick={() => {
                            swal({
                                title: "Bạn có muốn xoá nhà cung cấp này?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["No", "Yes"],
                            }).then((willUpdate) => {
                                if (willUpdate) {
                                    setTimeout(() => {
                                        deleteSupplier(ids, row.id)
                                            .then((res) => {
                                                swal("Đã xoá thành công!", {
                                                    icon: "success",
                                                }).then(history.push(`products/detail/` + ids));

                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                swal("Xoá không thành công!", {
                                                    icon: "warning",
                                                });
                                            });
                                    }, 500)

                                }
                            })

                        }}
                    >
                        <span className="svg-icon svg-icon-md svg-icon-danger">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                        </span>
                    </button>
                </OverlayTrigger>

            </>
        );
    }

    return (
        <div>
            <Card style={{ padding: "1% 1% 1% 1%" }}>
                <div className="row mt-2">
                    <div className="col-lg-12" >
                        <div >
                            <div >
                                <tr className="font-weight-boldest">
                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                        Danh sách nhà cung cấp
                            </div>
                                </tr>
                                <CardActions disableSpacing style={{ marginTop: "-2%" }}>
                                    <td className="border-top-0" style={{ marginLeft: "85%" }}>Chọn nhà cung cấp</td>
                                    <IconButton
                                        className={clsx(classes.expand, {
                                            [classes.expandOpen]: expanded,
                                        })}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        aria-label="Show more"
                                        hover="Chọn nhà cung cấp"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>

                                </CardActions>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <div style={{ width: "25%", marginLeft: "72% " }} >
                                        <Autocomplete
                                            // name="supplier_id"
                                            // type="supplier_id"
                                            onChange={onSupplierChange}
                                            options={suppliers}
                                            autoHighlight
                                            getOptionLabel={option => option.name}
                                            renderOption={option => (
                                                <React.Fragment>
                                                    ({option.id})   {option.name}
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
                                </Collapse>
                            </div>
                        </div>
                        <div >
                            <div className={classes.root}>


                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-12 pl-0" style={{ marginLeft: "1%", paddingRight: "2.5%" }}>
                    <CardBody>
                        <ToolkitProvider
                            keyField="id"
                            data={product === null ? [] : product?.map(supp => ({
                                ...supp,
                                id_: num++,
                                price_: supp?.pivot?.price
                            }))}
                            columns={columns}
                            search
                        >
                            {(props) => (
                                <div>
                                    <div className="row">
                                        <div className="col-6 pl-0">
                                            <InputGroup style={{ marginLeft: "2%" }}>
                                                <SearchBar style={{ width: "225%", marginTop: "-25%" }} {...props.searchProps} />
                                            </InputGroup>
                                        </div>
                                    </div>
                                    <BootstrapTable
                                        hover
                                        wrapperClasses="table-responsive"
                                        classes="table table-head-custom table-vertical-center overflow-hidden"
                                        bordered={false}
                                        {...props.baseProps}
                                        onTableChange={getHandlerTableChange}
                                        pagination={paginationFactory(options)}
                                        cellEdit={ cellEditFactory({
                                            mode: 'click',
                                            beforeSaveCell: (oldValue, newValue, row, column) => {                                              
                                                updatePrice(
                                                  ids,
                                                  row.id, newValue
                                                ).then(()=>{
                                                  swal("Đã cập nhật giá!", {
                                                    icon: "success",
                                                  }).then(history.push(`products/detail/` + ids));
                                                })
                                              
                                              
                                             },
                                          }) }
                                    />
                                </div>
                            )}
                        </ToolkitProvider>
                    </CardBody>
                    {/* <BootstrapTable
                            wrapperClasses="table-responsive"
                            classes="table table-head-custom table-vertical-center overflow-hidden"
                            remote
                            bordered={false}
                            keyField='id'
                            data={product === null ? [] : product?.map(supp => ({
                                ...supp,
                                id_: num++
                            }))}
                            columns={columns}
                        /> */}
                </div>
                <div style={{ display: "flex" }}>
                    {/* <FormControlLabel
                                        control={<Switch checked={checked} onChange={handleChange} />}
                                        label="Chọn nhà cung cấp "
                                    /> */}
                    <div style={{ marginLeft: "92.5%", float: "right" }}>
                        <button
                            id="updatePackage"
                            type="button"
                            className="btn btn-primary"
                            to={`/admin/updateprodut/${ids}`}
                            style={{ float: "right" }}
                            onClick={() =>
                                swal({
                                    title: "Bạn có muốn cập nhập nhà cung cấp?",
                                    icon: "warning",
                                    dangerMode: true,
                                    buttons: ["No", "Yes"],
                                }).then((willUpdate) => {
                                    if (willUpdate) {
                                        setTimeout(() => {
                                            updateSuppliers(ids, intersection.map(m => m).join())
                                                .then((res) => {
                                                    swal("Đã cập nhật thành công!", {
                                                        icon: "success",
                                                    }).then(history.push(`products/detail/` + ids));

                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    swal("Cập nhật không thành công!", {
                                                        icon: "warning",
                                                    });
                                                });
                                        }, 500)

                                    }
                                })
                            }>

                            Cập nhập
                        </button>
                    </div>
                </div>
            </Card>
        </div>

    );
}


