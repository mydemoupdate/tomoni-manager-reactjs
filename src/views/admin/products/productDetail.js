import {  useDispatch } from 'react-redux'
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardHeaderToolbar,

} from "../../../_metronic/_partials/controls";
// import '../../../assets/css/wizard.wizard-4.css';
import "../../../assets/css/wizard.wizard-4.css"
import '../../../assets/css/style-main.css'
import { Button, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import CardContent from '@material-ui/core/CardContent';
import swal from 'sweetalert';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { useLocation } from "react-router";
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import {
    getProduct,
    getPackage,
    getOrigins,
    getTaxes,
    getUnits,
    getProducts,
    getUnitsList,
    getSuppliersList,
    getOriginsList,
    getTaxesList,
    updateProduct,
    getProductsS,
    updateImage,
    updatePackage,
    updateImageProduct
} from "../../_redux_/productsSlice";
import 'semantic-ui-css/semantic.min.css';
import { Image } from 'semantic-ui-react';
import { sortCaret, headerSortingClasses } from "../../../_metronic/_helpers/TableSortingHelpers"
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';
import { result, isEmpty, set } from 'lodash';
import { Suppliers } from "./supplier";
import Typography from '@material-ui/core/Typography';
import clsx from "clsx";
import { Dropdown } from "react-bootstrap";
import { DropdownTopbarItemToggler } from "./dropDowntop";
import Select from 'react-select';

const languages = [
    {
        lang: "en",
        name: "English",
        flag: toAbsoluteUrl("/media/svg/flags/226-united-states.svg"),
    },

    {
        lang: "ja",
        name: "Japanese",
        flag: toAbsoluteUrl("/media/svg/flags/063-japan.svg"),
    },
    {
        lang: "vi",
        name: "Việt Nam",
        flag: toAbsoluteUrl("/media/svg/flags/220-vietnam.svg"),
    },

];
const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: "100%",
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


const unitId = [
    { label: "Box" },
    { label: "Slice" },
];
const originId = [
    { label: "ja" },
    { label: "vn" },
    { label: "en" },
]
const supplierId = [
    { label: "Amazon JP" },
    { label: "Rakuten" },
    { label: "Uniqlo" },
]
const ProductSchema = Yup.object().shape({
    price: Yup.number()
        .min(1, "Vui lòng nhập số tiền")
        .max(1000000, "$1000000 là lớn nhất")
        .required("Nhập giá"),
    id: Yup.string()
        .min(1, "Vui lòng nhập ID hợp lệ")
        .max(20, "Vui lòng nhập ID hợp lệ")
        .required("Vui lòng nhập ID"),
    name_VN: Yup.string()
        .min(1, "Vui lòng nhập tên sản phẩm hợp lệ")
        .max(20, "Vui lòng nhập tên sản phẩm hợp lệ")
        .required("Vui lòng nhập tên sản phẩm"),
    name_JA: Yup.string()
        .min(1, "Vui lòng nhập tên sản phẩm hợp lệ")
        .max(20, "Vui lòng nhập tên sản phẩm hợp lệ")
        .required("Vui lòng nhập tên sản phẩm"),
    tax_id: Yup.string()
        .min(1, "Vui lòng nhập mã số thuế hợp lệ")
        .max(20, "Vui lòng nhập mã số thuế hợp lệ")
        .required("Vui lòng nhập mã số thuế"),
    origin_id: Yup.string()
        .min(3, "Vui lòng nhập ID hợp lệ")
        .max(20, "Vui lòng nhập ID hợp lệ")
        .required("Vui lòng nhập ID"),
    ingredients_VN: Yup.string()
        .min(1, "Vui lòng nhập thành phần cho sản phẩm")
        .max(50, "Vui lòng nhập thành phần cho sản phẩm")
        .required("Vui lòng nhập thành phần cho sản phẩm"),
    ingredients_EN: Yup.string()
        .min(1, "Vui lòng nhập thành phần cho sản phẩm")
        .max(50, "Vui lòng nhập thành phần cho sản phẩm")
        .required("Vui lòng nhập thành phần cho sản phẩm")
});


export function ProductDetail(props) {
    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );

    const [step, setStep] = useState(false)
    const [shipment, setShipment] = useState('');
    const [typeProduct, setTypeProduct] = useState();
    const [productDetail, setProductDetail] = useState([]);
    const [origins, setOrigins] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [units, setUnits] = useState([]);
    const [packages, setPackages] = useState([]);

    //flag and language
    const [language, setLanguage] = useState('vi');
    const [flag, setFlag] = useState(`${toAbsoluteUrl("/media/svg/flags/220-vietnam.svg")}`)
    const [productLanguage, setProductLanguage] = useState([])

    //product
    const [product, setProduct] = useState([])
    const [ingredient, setIngredient] = useState('')
    const [checkModalProduct, setCheckModalProduct] = useState(false);
    const [images, setImages] = useState(null);
    const [taxList, setTaxList] = useState([0]);
    const [selectedValueTax, setSelectedValueTax] = useState(0);
    const [originList, setOriginList] = useState([0]);
    const [selectedValueOrigin, setSelectedValueOrigin] = useState('');
    const [unitList, setUnitList] = useState([0]);
    const [selectedValueUnit, setSelectedValueUnit] = useState('');
    const [products, setProducts] = useState([])
    const [texesDefaullt, setTaxesDefault] = useState({})
    const [supplierId, setSupplierId] = useState('')
    const [name, setName] = useState('')
    const [productID, setProductID] = useState([])
    const [price, setPrice] = useState('')
    const [suppliers, setSupplier] = useState([]);
    const [profileImg, setImage] = useState("")


    //package
    const [checkModalPackage, setCheckModalPackage] = useState(false);
    const [packageS, setPackage] = useState([])
    const [quantity, setQuantity] = useState('')
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState([])
    const [length, setLength] = useState('')
    const [width, setWidth] = useState([])

    //image
    const classes = useStyles();

    const history = useHistory();
    let location = useLocation();
    useEffect(() => {
        if (location.pathname.includes('wholesale')) {
            setTypeProduct('wholesale');
        } else if (location.pathname.includes('auction')) {
            setTypeProduct("auction");
        } else if (location.pathname.includes('shipping')) {
            setTypeProduct("shippingpartner");
        } else if (location.pathname.includes('payment')) {
            setTypeProduct("paymentpartner");
        } else {
            setTypeProduct("retail");
        }

        //product
        getProduct(ids).then(result => setProductDetail(result.data));
        getOrigins().then(result => setOrigins(result.data));
        getTaxes().then(result => setTaxes(result.data));
        getUnits().then(result => setUnits(result.data));
        getPackage(ids).then(result => setPackages(result.data))
        getProducts(ids, language).then(result => setProduct(result.data))


        dispatch(getOriginsList()).then(res => {
            setOrigins(res.data)
            setTaxesDefault(res.data[0].name)
        })
        dispatch(getSuppliersList()).then(res => {
            setSupplier(res.data.data)
        })
        dispatch(getUnitsList()).then(res => {
            setUnits(res.data)
        })

        getProductsS(ids).then(result => {

            setProduct(result.data);
            setProductID(result.data.id)
            setName(result.data.name);
            setPrice(result.data.price)
            setSelectedValueTax(result.data.tax_id)
            setSelectedValueOrigin(result.data.origin_id)
            setSelectedValueUnit(result.data.unit_id)
            setIngredient(result.data?.ingredients)
            setImage(result.data?.images?.url)

        })
        // getProducts(ids).then(result => {
        //     console.log(result);
        //     // setProducts(result.data)

        // })


        dispatch(getTaxesList()).then((res) => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name,
                });
            }
            setTaxList(result);
        });
        dispatch(getOriginsList()).then((res) => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name,
                });
            }
            setOriginList(result);
        });
        dispatch(getOriginsList()).then((res) => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name,
                });
            }
            setOriginList(result);
        });
        dispatch(getUnitsList()).then((res) => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name,
                });
            }
            setUnitList(result);
        });



        //package

        if (selectedValueUnit === 'box') {
            getPackage(ids).then(result => {
                setPackage(result.data)
                setQuantity(result.data.quantity)
                setWeight(result.data.weight)
                setHeight(result.data.height)
                setLength(result.data.length)
                setWidth(result.data.width)
            })
        }

    }, [location]);

    const linkImage = product?.images?.url === undefined ? "https://www.drjainsherbals.com/wp-content/uploads/2015/12/no-product-image.jpg" : product?.images?.url

    const taxChange = (e) => {
        setSelectedValueTax(e.value);
    };
    const originChange = (e) => {
        setSelectedValueOrigin(e.value);
    };
    const unitChange = (e) => {
        setSelectedValueUnit(e.value);
    };

    const dispatch = useDispatch()



    const imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImage(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
        setImages(e.target.files[0])

    };
    const columnsInfor = [
        {
            dataField: "id",
            text: "STT",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "name",
            text: "Tên nhà cung cấp",
            sort: true,
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "address",
            text: "Đại chỉ ",
            sort: true,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "note",
            text: "Ghi chú ",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                fontWeight: "500"
            }
        },

    ]
    function createData(id, amount, weight, volume, datecreate) {
        return { id, amount, weight, volume, datecreate };
    }

    const rows = [
        createData('123456789', "100", "50", "70", "2020-12-30  13:00"),
    ];


    const columnsInventory = [
        {
            dataField: "stt",
            text: "STT",
            sort: true,
            style: {
                fontWeight: "bold"
            },
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "id",
            text: "Mã số hàng",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "amount",
            text: "Số lượng",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "weight",
            text: "Trọng lượng ",
            sort: true,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "volume",
            text: "Thể tích ",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "datecreate",
            text: "Ngày tạo ",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                fontWeight: "500"
            }
        },
        // {
        //     dataField: "action",
        //     text: "Actions",
        //     classes: "text-right pr-0",
        //     headerClasses: "text-right pr-3",
        //     formatter: rankFormatter,
        //     style: {
        //         minWidth: "100px",
        //     },
        // }

    ]
    // console.log(product)
    function rankFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Xoá nhà cung cấp</Tooltip>}
                >
                    <button
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                    // onClick={() => {
                    //     swal({
                    //         title: "Bạn có muốn xoá nhà sản xuất này?",
                    //         icon: "warning",
                    //         dangerMode: true,
                    //         buttons: ["No", "Yes"],
                    //     }).then((willUpdate) => {
                    //         if (willUpdate) {
                    //             setTimeout(() => {
                    //                 // deleteSupplier(ids, row.id)
                    //                     then((res) => {
                    //                         swal("Đã xoá thành công!", {
                    //                             icon: "success",
                    //                         }).then(history.push(`products/detail/` + ids));

                    //                     })
                    //                     .catch((err) => {
                    //                         console.log(err);
                    //                         swal("Xoá không thành công!", {
                    //                             icon: "warning",
                    //                         });
                    //                     });
                    //             }, 500)

                    //         }
                    //     })


                    // }}
                    >
                        <span className="svg-icon svg-icon-md svg-icon-danger">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                        </span>
                    </button>
                </OverlayTrigger>
            </>
        );
    }
    const getHandlerTableChange = (e) => { }
    const styles = {
        ui: {
            display: 'flex'
        },
        image: {
            marginTop: "2rem",
            marginLeft: "1rem",
            margin: "1% 2% 1% 0%",
        }
    }
    // const options = {
    //     hideSizePerPage: true,
    //     onPageChange: (page, sizePerPage) => {
    //         setParams("search=" + typeProduct + "&searchFields=director.type.id&page=" + page);
    //         dispatch(getProductsList(params));
    //     },
    // };


    const xhr = new XMLHttpRequest();
    const linksss = "https://www.drjainsherbals.com/wp-content/uploads/2015/12/no-product-image.jpg"
    xhr.open('GET', linksss);
    function escape(key, val) {
        if (typeof (val) != "string") return val;
        return val
            .replace(/[\\]/g, '\\\\')
            .replace(/[\/]/g, '\\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t')
            .replace(/[\"]/g, '\\"')
            .replace(/\\'/g, "\\'");
    }
    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }
    function replaces(str) {
        str.replace('/"', ' ')
    }
    function check(image) {
        if (image !== undefined) {
            return JSON.parse(image)
        }
    }
    function subStrings(string) {
        let strings = ''
        if (string !== undefined) {
            strings = string.toString().substring(1, string.length - 1);
        }
        return strings
    }
    function rankFormatterss(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <div class="image-input image-input-outline" id="kt_image_4" style="background-image: url(assets/media/>users/blank.png)">
                    <div class="image-input-wrapper" style="background-image: url(<?php echo Page::getMediaPath();?>users/100_1.jpg)"></div>

                    <label class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="change" data-toggle="tooltip" title="" data-original-title="Change avatar">
                        <i class="fa fa-pen icon-sm text-muted"></i>
                        <input type="file" name="profile_avatar" accept=".png, .jpg, .jpeg" />
                        <input type="hidden" name="profile_avatar_remove" />
                    </label>

                    <span class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="cancel" data-toggle="tooltip" title="Cancel avatar">
                        <i class="ki ki-bold-close icon-xs text-muted"></i>
                    </span>

                    <span class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="remove" data-toggle="tooltip" title="Remove avatar">
                        <i class="ki ki-bold-close icon-xs text-muted"></i>
                    </span>
                </div>
            </>
        );
    }


    return (
        <div>
            <div className="card card-custom " style={{ height: "10%" }}>
                <CardHeader title="Chi tiết sản phẩm">
                    <CardHeaderToolbar>
                        {/* onClick={history.push("/admin/createpaymentorder/" + ids)} */}

                          <Link
                            type="button"
                            className="btn btn-danger "
                            to={'/admin/product'}
                            style={{ marginRight: "5px" }}
                        >
                            <i className="fa fa-arrow-left"></i>
                      Trở về
                    </Link>
                        {`  `}
                    
                        <Link
                            type="button"
                            className="btn btn-info "
                            to={("/admin/orders/create-wholesale/" + ids)}
                            style={{ marginRight: "5px" }}
                            onClick={props === ids}
                        >
                            <i class="fa fa-plus" aria-hidden="true"></i>
                            Tạo đơn sỉ
                    </Link>
                        {`  `}
                        {`  `}
                        <Link
                            type="button"
                            className="btn btn-success"
                            to={("/admin/orders/create-paymentpartner/" + ids)}

                        >
                            <i class="fa fa-plus" aria-hidden="true"></i>
                            Tạo đơn thanh toán hộ
                    </Link>
                        {`  `}
                        <Dropdown drop="down" alignRight>
                            <Dropdown.Toggle
                                as={DropdownTopbarItemToggler}
                                id="dropdown-toggle-my-cart"
                            >
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip id="language-panel-tooltip">Select Language</Tooltip>
                                    }
                                >
                                    <div className="btn btn-icon btn-clean btn-dropdown btn-lg mr-1">
                                        <img
                                            className="h-25px w-25px rounded"
                                            src={toAbsoluteUrl(flag)}
                                            alt={"Việt Nam"}
                                        />
                                    </div>
                                </OverlayTrigger>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround">
                                <ul className="navi navi-hover py-4">
                                    {languages.map((language) => (
                                        <li
                                            key={language.lang}
                                            className={clsx("navi-item", {
                                                active: language.lang === languages.lang,
                                            })}
                                        >
                                            <a
                                                onClick={() => getProducts(ids, language.lang).then(result => setProduct(result.data)).then(setFlag(language.flag))}
                                                className="navi-link"
                                            >
                                                <span className="symbol symbol-20 mr-3">
                                                    <img src={language.flag} alt={language.name} />
                                                </span>
                                                <span className="navi-text">{language.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </Dropdown.Menu>
                        </Dropdown>
                    </CardHeaderToolbar>
                </CardHeader>
            </div>
            <div style={{ height: "80%" }}>
                <div style={{ display: "flex", height: "30%" }}>
                    <div style={{ width: "20%", margin: "1% 2% 1% 0%" }}>
                        <Card className={classes.card}>
                            <CardContent>
                                <a href={linkImage}>
                                    <img src={linkImage} style={{ width: "100%", height: "410px" }}></img>
                                </a>
                            </CardContent>

                        </Card>

                    </div>
                    <div style={{ width: "77.5%", margin: "1% 0% 0% 0%" }}>
                        <div className="row" style={{ display: 'flex' }}>
                            <Card style={{ width: productDetail?.unit_id === "box" ? "65%" : "100%", height: "450px" }}>
                                <div className="table-responsive" style={{ overflowX: "unset", padding: "1% 1% 1% 3%" }}>
                                    <table className="table">
                                        <tbody>
                                            <tr className="font-weight-boldest">
                                                <td className="border-top-0" style={{ width: "40%", }} >
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Thông tin sản phẩm
                                                    </div>
                                                </td>
                                                <td className="border-top-0">
                                                    <OverlayTrigger
                                                        overlay={<Tooltip>Cập nhập</Tooltip>}
                                                    >

                                                        <Link
                                                            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                                            style={{ float: "right" }}
                                                            onClick={() => setCheckModalProduct(true)}
                                                        >
                                                            <span className="svg-icon svg-icon-md svg-icon-primary">
                                                                <SVG
                                                                    src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                                                                />
                                                            </span>
                                                        </Link>
                                                    </OverlayTrigger>
                                                </td>
                                            </tr>

                                            <tr className="font-weight-boldest">
                                                <td className="pt-5" style={{ display: 'flex' }}>
                                                    <span className="bullet bullet-bar bg-success align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Mã sản phẩm:
                                                    </div>
                                                </td>
                                                <td className="pt-5 ">{product.id}</td>
                                                <div style={{ marginRight: "1rem" }}></div>
                                            </tr>

                                            <tr className="font-weight-boldest">
                                                <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                                    <span className="bullet bullet-bar bg-primary align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Tên sản phẩm:
                                                    </div>
                                                </td>
                                                <td className="pt-5 border-top-0 ">{product.name}</td>
                                            </tr>

                                            <tr className="font-weight-boldest">
                                                <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                                    <span className="bullet bullet-bar bg-warning align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Giá:
                                                    </div>
                                                </td>
                                                <td className="pt-5  border-top-0 ">{product.price}</td>
                                            </tr>

                                            <tr className="font-weight-boldest">
                                                <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                                    <span className="bullet bullet-bar bg-dark align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Xuất xứ:
                                                    </div>
                                                </td>
                                                <td className="pt-5 border-top-0 ">{product?.origin?.name}</td>
                                            </tr>
                                            <tr className="font-weight-boldest">
                                                <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                                    <span className="bullet bullet-bar bg-danger align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Đơn vị:
                                                    </div>
                                                </td>
                                                <td className="pt-5 border-top-0 ">{product?.unit?.name}</td>
                                            </tr>
                                            <tr className="font-weight-boldest">
                                                <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                                    <span className="bullet bullet-bar bg-info align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Thuế:
                                                    </div>
                                                </td>
                                                <td className="pt-5 border-top-0 "> {product?.tax?.name}</td>
                                            </tr>
                                            <tr className="font-weight-boldest">
                                                <td className="pt-5 border-top-0   " style={{ display: 'flex' }}>
                                                    <span className="bullet bullet-bar bg-muted align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Thành phần:
                                                    </div>
                                                </td>
                                                <td className="pt-5  border-top-0  ">{product?.ingredients + ""}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <>
                                    </>
                                    {/* <Link
                                        type="button"
                                        className="btn btn-primary"
                                        to={`/admin/updateprodut/${ids}`}
                                        style={{ float: "right", marginRight: "2%" }}
                                    >
                                        <i className="fa fa-arrow-right"></i>
                                                               Cập nhập
                                        </Link> */}

                                </div>
                            </Card>
                            {productDetail?.unit_id === "box" ?
                                <Card style={{ width: "33%", marginLeft: "2%" }}>
                                    <div className="table-responsive" style={{ overflowX: "unset", marginRight: "2%", padding: "1% 3% 1% 3%" }}>
                                        <table className="table">

                                            <tbody>
                                                <tr className="font-weight-boldest">
                                                    <td className="border-top-0" style={{ width: "55%" }} >
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Thông tin thùng chứa
                                                        </div>
                                                    </td>
                                                    <td className="border-top-0">
                                                        <OverlayTrigger
                                                            overlay={<Tooltip>Cập nhập</Tooltip>}
                                                        >

                                                            <Link
                                                                onClick={() => setCheckModalPackage(true)}
                                                                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                                                style={{ float: "right" }}
                                                            >
                                                                <span className="svg-icon svg-icon-md svg-icon-primary">
                                                                    <SVG
                                                                        src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                                                                    />
                                                                </span>
                                                            </Link>
                                                        </OverlayTrigger>
                                                    </td>
                                                </tr>

                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5  " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-success align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Số lượng:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5  ">{packages?.quantity} </td>
                                                </tr>

                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5 border-top-0 " style={{ display: 'flex' }} >
                                                        <span className="bullet bullet-bar bg-primary align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Trọng lượng:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5 border-top-0 ">{packages?.weight} </td>
                                                </tr>

                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5   border-top-0 " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-warning align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Chiều dài:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5 border-top-0 ">{packages?.length}</td>
                                                </tr>

                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5   border-top-0 " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-dark align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Chiều rộng:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5 border-top-0 "> {packages?.width}</td>
                                                </tr>
                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5   border-top-0 " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-danger align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Chiều cao:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5 border-top-0 ">{packages?.height}</td>
                                                </tr>
                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5   border-top-0 " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-info align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Thể tích:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5 border-top-0 ">{packages?.volume} </td>
                                                </tr>
                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5   border-top-0 " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-muted align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Dung trọng:
                                                        </div>

                                                    </td>
                                                    <td className=" pt-5 border-top-0  " >{packages?.volumetric_weight} </td>
                                                </tr>
                                            </tbody>
                                        </table>


                                        {/* <Link
                                            type="button"
                                            className="btn btn-primary"
                                            to={`/admin/createpackage/${ids}`}
                                            style={{ float: "right", marginRight: "2%" }}>
                                            <i className="fa fa-arrow-right"></i>
                                                            Cập nhập
                                        </Link> */}
                                    </div>
                                </Card>
                                : ""}
                        </div>

                    </div>
                </div>
                <div>
                    <Suppliers />
                </div>
                <div>
                    <Card style={{ padding: "1% 1% 1% 3%" }}>
                        <div >
                            <div className="row mt-2" style={{ padding: "1% 3% 1% 1%" }} >
                                <div className="col-12 pl-0">
                                    <tr className="font-weight-boldest">
                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                            Danh sách hàng tồn kho
                                        </div>
                                    </tr>
                                    <BootstrapTable
                                        wrapperClasses="table-responsive"
                                        classes="table table-head-custom table-vertical-center overflow-hidden"
                                        bordered={false}
                                        keyField='id'
                                        data={rows === null ? [] : rows?.map(supp => ({
                                            ...supp,
                                            stt: 1,

                                        }))}
                                        columns={columnsInventory}
                                        onTableChange={getHandlerTableChange}
                                    // pagination={paginationFactory(options)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            {/* <div className="card card-custom " style={{ height: "10%", width: '100%' }}>
                <CardHeader>
                    <CardHeaderToolbar style={{ width: '100%' }}>
                        <Link
                            type="button"
                            className="btn btn-danger "
                            to={'/admin/product'}
                        >
                            <i className="fa fa-arrow-left"></i>
                      Trở về
                    </Link>
                        {`  `}
                        {`  `}

                        <Link
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setCheckModalProduct(true)}
                            style={{ marginLeft: '75%' }}
                        >
                            <i className="fa fa-arrow-right"></i>
                    Cập nhập thông tin sản phẩm
                    </Link>
                        {`  `}
                    </CardHeaderToolbar>
                </CardHeader>

            </div> */}



            {/* Modal update product */}
            <Modal
                show={checkModalProduct}
                dialogClassName="w-custome-70"
                // aria-labelledby="example-custom-modal-styling-title"
                // size="lg"
                // min-width='35%'
                style={{ transform: "translate(0%, 12%)" }}


            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Cập nhập thông tin sản phẩm: {product.name}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: "0" }} className="overlay overlay-block cursor-default">
                    <div style={styles.ui}>
                        <div>
                            <div >
                                <div className="img-holder">
                                    <img src={profileImg} alt="" id="img" className="img" />
                                </div>
                                <input type="file" accept="image/*" name="image-upload" id="input" onChange={imageHandler} />
                                <div className="label">

                                    <label className="image-upload" htmlFor="input">
                                        <i className="material-icons">add_photo_alternate</i>
						                    Thêm ảnh
					                </label>
                                </div>
                            </div>

                            <div style={{ marginLeft: "5%", marginTop: '6%' }}>
                                <div className="form-group row">
                                    <div className="col-12">
                                        <input className="form-control" placeholder="Thêm ảnh bằng url" onInput={e => setImage(e.target.value)} style={{ textAlign: 'center' }} />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div style={{ marginLeft: '5%', paddingRight:'1%' }}>
                            <div style={{ display: 'flex' }}>
                                <div className="form-group row">
                                    <label className="col-10 col-form-label"> ID sản phẩm</label>
                                    <div className="col-12">
                                        <input className="form-control"
                                            value={ids}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row" style={{ marginLeft: '2%' }}>
                                    <label className="col-10 col-form-label"> Giá tiền sản phẩm</label>
                                    <div className="col-12">
                                        <input className="form-control"
                                            value={price}
                                            onInput={e => setPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div className="form-group row">
                                    <label className="col-10 col-form-label"> Tên sản phẩm</label>
                                    <div className="col-12">
                                        <input className="form-control"
                                            value={name}
                                            onInput={e => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row" style={{ marginLeft: '2%' }}>
                                    <label className="col-10 col-form-label"> Thành phẩn sp</label>
                                    <div className="col-12">
                                        <input className="form-control"
                                            value={ingredient}
                                            onInput={e => setIngredient(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div className="form-group row">
                                    <label className="col-10 col-form-label"> Phần trăm thuế</label>
                                    <div className="col-12">
                                        <Select
                                            value={taxList.filter(
                                                (obj) => obj.value === selectedValueTax
                                            )}
                                            options={taxList}
                                            onChange={taxChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row" style={{ marginLeft: '2%' }}>
                                    <label className="col-10 col-form-label"> Tên nơi xuất xứ </label>
                                    <div className="col-12">
                                        <Select
                                            value={originList.filter(
                                                (obj) => obj.value === selectedValueOrigin
                                            )}
                                            options={originList}
                                            onChange={originChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row" style={{ marginLeft: '2%' }}>
                                    <label className="col-10 col-form-label"> Đơn vị sản phẩm </label>
                                    <div className="col-12">
                                        <Select
                                            value={unitList.filter(
                                                (obj) => obj.value === selectedValueUnit
                                            )}
                                            options={unitList}
                                            onChange={unitChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </Modal.Body>

                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalProduct(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setTimeout(() => {
                            updateProduct(productID, name, JSON.stringify(ingredient), selectedValueUnit, price, selectedValueTax, selectedValueOrigin)
                            updateImage(productID, images)
                                .then((res) => {
                                    swal("Đã cập nhật thành công!", {
                                        icon: "success",
                                    }).then(setCheckModalProduct(false)).then(history.push("/admin/products/detail/" + ids));;
                                })
                                .catch((err) => {
                                    console.log(err);
                                    swal("Cập nhật không thành công!", {
                                        icon: "warning",
                                    });
                                });
                        }, 300)
                        setTimeout(() => {
                            updateImageProduct(productID, profileImg)
                        }, 200)
                    }}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>





            {/* Modal package */}
            <Modal
                show={checkModalPackage}
                aria-labelledby="example-modal-sizes-title-lg modal-dialog modal-lg"
                size="lg"
                style={{ transform: "translate(0%, 12%)" }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Cập nhập thông tin thùng {product.name}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: "2%  2% 2% 10%" }}>
                    <div style={{ marginTop: '0%' }}>
                        <div style={{ display: 'flex' }}>
                            <div className="form-group row">
                                <label className="col-10 col-form-label">ID sản phẩm</label>
                                <div className="col-12">
                                    <input className="form-control"
                                        value={ids}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '2%' }}>
                                <label className="col-10 col-form-label">Số lượng</label>
                                <div className="col-12">
                                    <input className="form-control"
                                        value={quantity}
                                        onInput={e => setQuantity(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div className="form-group row">
                                <label className="col-10 col-form-label">Cân nặng</label>
                                <div className="col-12">
                                    <input className="form-control"
                                        value={weight}
                                        onInput={e => setWeight(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '2%' }}>
                                <label className="col-10 col-form-label">Chiều cao</label>
                                <div className="col-12">
                                    <input className="form-control"
                                        value={height}
                                        onInput={e => setHeight(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div className="form-group row">
                                <label className="col-10 col-form-label">Chiều dài</label>
                                <div className="col-12">
                                    <input className="form-control"
                                        value={length}
                                        onInput={e => setLength(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '2%' }}>
                                <label className="col-10 col-form-label">Chiều rộng </label>
                                <div className="col-12">
                                    <input className="form-control"
                                        value={width}
                                        onInput={e => setWidth(e.target.value)}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                </Modal.Body>

                <Modal.Footer >
                    <Button variant="secondary" onClick={() => setCheckModalPackage(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => {
                        updatePackage(ids, quantity, weight, height, length, width)
                            .then((res) => {
                                swal("Đã cập nhật thành công!", {
                                    icon: "success",
                                }).then(setCheckModalPackage(false)).then(history.push("/admin/products/detail/" + ids));;
                            })
                            .catch((err) => {
                                console.log(err);
                                swal("Cập nhật không thành công!", {
                                    icon: "warning",
                                });
                            });
                    }}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>







        </div>
    );
}