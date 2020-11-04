import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getManageUsersList, deleteUsers,getUser } from "../../_redux_/userSlice";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import SVG from "react-inlinesvg";
import swal from "sweetalert";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import Moment from "moment";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import MailIcon from "@material-ui/icons/Mail";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {
  toAbsoluteUrl,
  sortCaret,
  headerSortingClasses,
} from "../../../_metronic/_helpers";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../_metronic/_partials/controls";
import { InputGroup, OverlayTrigger, Tooltip, Form } from "react-bootstrap";

import { TreeSelect } from "antd";

import "../../../assets/css/custome-antd.css";

function ManageUser() {
  const dispatch = useDispatch();
  const [info, setInfo] = useState({
    id: "",
    email: "",
    status: "",
    roles: [],
    direct_permissions: [],
  });
  const [isLoadData, setIsLoadData] = useState(false);
  const [balance, setBalance] = useState(10);
  const [currency_id, setCurrency] = useState("");
  const [balance_vn, setBalanceVN] = useState(0);
  const [balance_jp, setBalanceJP] = useState(0);
  const { SearchBar } = Search;

  const data = [
    {
      id: 21,
      amount: 1000000,
      type_id: "deposit_jpy",
      description: "nộp tiền",
      user_id: "customer.2",
      prepared_by_id: "accountant",
      payment_method_id: "visa",
      created_at: "2020-08-15T14:07:09.000000Z",
      updated_at: "2020-08-15T14:07:09.000000Z",
    },
  ];
  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
  };
  const options = {
    hideSizePerPage: true,
  };
  const columns_transaction = [
    {
      dataField: "created_at",
      text: "Ngày thực hiện ",
      formatter: dateFormatter,
    },
    {
      dataField: "prepared_by_id",
      text: "Người thực hiện ",
    },
    {
      dataField: "amount",
      text: "Số tiền",
    },
    {
      dataField: "description",
      text: "Nội dung",
    },
  ];
  const columns_user = [
    {
      dataField: "id",
      text: "Mã người dùng",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        fontWeight: "600",
      },
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "status_id",
      text: "Trạng thái ",
      sort: true,
      formatter: statusFormatter,
    },
    {
      dataField: "created_at",
      text: "Ngày đăng kí ",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: dateFormatter,
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
    },
  ];

  function deleteModal(object) {
    swal({
      title: "Bạn có chắc muốn xoá người dùng này ?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Huỷ", "Xoá"],
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteUsers(object.id))
          .then((res) => {
            console.log(res);
            swal("Đã xoá thành công!", {
              icon: "success",
            });
            dispatch(getManageUsersList(info.id));
          })
          .catch((err) => {
            console.log(err);
            swal("Xoá thất bại !", {
              icon: "warning",
            });
          });
      }
    });
  }
  function dateFormatter(created_at) {
    return (
      <>
        <span>
          {" "}
          {created_at ? Moment(created_at).format("DD-MM-YYYY HH:MM") : ""}
        </span>
      </>
    );
  }
  function statusFormatter(status_id) {
    return (
      <>
        {status_id === "locked" ? (
          <span
            className="badge  badge-danger"
            style={{ color: "#F64E60", backgroundColor: "#FFE2E5" }}
          >
            {status_id}
          </span>
        ) : (
          <span
            className="badge  badge-success"
            style={{ color: "#1BC5BD", backgroundColor: "#C9F7F5" }}
          >
            {status_id}
          </span>
        )}
      </>
    );
  }

  function rankFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <>
        <OverlayTrigger overlay={<Tooltip>Chi tiết</Tooltip>}>
          <Link
            to={`/admin/users/${row.id}`}
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <RemoveRedEyeIcon></RemoveRedEyeIcon>
            </span>
          </Link>
        </OverlayTrigger>
        <></>
        <OverlayTrigger overlay={<Tooltip>Xoá Người dùng</Tooltip>}>
          <a
            className="btn btn-icon btn-light btn-hover-danger btn-sm mx-3"
            onClick={() => deleteModal(row)}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
            </span>
          </a>
        </OverlayTrigger>
      </>
    );
  }
  useEffect(() => {
    getUser()
      .then((res) => res.json())
      .then((data) => {
        setInfo({
          ...info,
          id: data?.id,
          email: data?.email,
          status: data?.status_id,
          roles: data?.roles,
          direct_permissions: data?.direct_permissions,
        });
        setIsLoadData(true);
      });
  },[]);
  useEffect(() => {
    if (isLoadData === true) {
      dispatch(getManageUsersList(info.id));
    }
  }, [isLoadData]);
  // useEffect(() => {
  //   if (isLoadData === true) {
  //     getBalance(info.id)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         setCurrency(result?.data?.map((item) => item?.currency_id));
  //         setBalance(result?.data?.map((item) => item?.balance));
  //       });
  //     currency_id === ["JPY"] ? setBalanceVN(0) : setBalanceJP(balance);
  //     currency_id === ["VND"] ? setBalanceVN(balance) : setBalanceJP(0);
  //   }
  // }, [isLoadData]);

  let arrayDirectPermissions = [];
  for (let item of info.direct_permissions) {
    let title = item.name;
    let key = item.id;
    let value = item.id;
    arrayDirectPermissions.push({
      title: title,
      key: key,
      value: value,
    });
  }
  let arrayRoles = [];
  for (let item of info.roles) {
    let title = item.name;
    let key = item.id;
    let value = item.id;
    let arrPer = item.permissions;
    let children = [];
    for (let itemPer of arrPer) {
      let title = itemPer.name;
      let key = itemPer.id;
      let value = itemPer.id;
      children.push({ title: title, key: key, value: value });
    }
    arrayRoles.push({
      title: title,
      key: key,
      value: value,
      children: children,
    });
  }

  const { currentState } = useSelector(
    (state) => ({ currentState: state.users }),
    shallowEqual
  );
  const {  entities } = currentState;
  var tProps = null;
  var tProps2 = null;
  tProps = {
    treeData: arrayRoles,
    value: arrayRoles,
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "60%",
    },
  };
  tProps2 = {
    treeData: arrayDirectPermissions,
    value: arrayDirectPermissions,
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    style: {
      width: "60%",
    },
  };
  return (
    <div>
      <div class="card-header py-3">
        <div class="card-title align-items-start flex-column">
          <h3 class="card-label font-weight-bolder text-dark">
            Thông tin của tôi
          </h3>
          <span class="text-muted font-weight-bold font-size-sm mt-1">
            Xem đầy đủ chi tiết cá nhân
          </span>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          class="card card-custom card-stretch mt-4"
          style={{ width: "50%" }}
        >
          <form class="form">
            <div class="card-body" style={{ marginLeft: "5%" }}>
              <div class="form-group row">
                <PermIdentityIcon
                  fontSize="large"
                  style={{ marginTop: "1%", color: "red" }}
                ></PermIdentityIcon>
                <label class="col-xl-3 col-lg-3 col-form-label">ID</label>
                <div class="col-lg-9 col-xl-6">
                  <input
                    class="form-control form-control-lg form-control-solid"
                    type="text"
                    value={info.id}
                  />
                </div>
              </div>
              <div class="form-group row">
                <CheckCircleIcon
                  color="primary"
                  fontSize="large"
                  style={{ marginTop: "1%" }}
                ></CheckCircleIcon>
                <label class="col-xl-3 col-lg-3 col-form-label">
                  Trạng thái
                </label>
                <div class="col-lg-9 col-xl-6">
                  <input
                    class="form-control form-control-lg form-control-solid"
                    type="text"
                    value={info.status}
                  />
                </div>
              </div>
              <div class="form-group row">
                <MailIcon
                  color="secondary"
                  fontSize="large"
                  style={{ marginTop: "1%" }}
                ></MailIcon>
                <label class="col-xl-3 col-lg-3 col-form-label">
                  Địa chỉ email
                </label>
                <div class="col-lg-9 col-xl-6">
                  <div class="input-group input-group-lg input-group-solid">
                    <div class="input-group-prepend">
                      <span class="input-group-text">@</span>
                    </div>
                    <input
                      type="text"
                      class="form-control form-control-lg form-control-solid"
                      value={info.email}
                      placeholder="Email"
                    />
                  </div>
                  <span class="form-text text-muted">
                    We'll never share your email with anyone else.
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="card mt-4" style={{ width: "50%", marginLeft: "2rem" }}>
          <form class="form">
            <div class="card-body">
              <div class="form-group row">
                <label class="col-xl-4 col-lg-3 col-form-label">
                  Quyền trực tiếp
                </label>
                <TreeSelect {...tProps2} />
              </div>
              <div class="form-group row">
                <label class="col-xl-4 col-lg-3 col-form-label">
                  Quyền theo vai trò
                </label>
                <TreeSelect {...tProps} />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="card mt-8" style={{ width: "40%" }}>
          <div class="card-header py-3" style={{ borderBottom: "none" }}>
            <div class="card-title align-items-start flex-column">
              <h3 class="card-label font-weight-bolder text-dark pt-2">
                Tài khoản tiền
              </h3>
            </div>
          </div>

          <div class="form-group row">
            <label
              class="col-xl-3 col-lg-3 col-form-label text-right"
              style={{ fontSize: "larger" }}
            >
              <strong>VND</strong>
            </label>
            <div class="col-lg-9 col-xl-6">
              <input
                class="form-control form-control-lg form-control-solid"
                type="text"
                value={balance_vn}
              />
            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-xl-3 col-lg-3 col-form-label text-right"
              style={{ fontSize: "larger" }}
            >
              <strong>JPY</strong>
            </label>
            <div class="col-lg-9 col-xl-6">
              <input
                class="form-control form-control-lg form-control-solid"
                type="text"
                value={balance_jp}
              />
            </div>
          </div>
        </div>
        <div
          class="card mt-8 ml-8 "
          style={{ borderBottom: "none", display: "flex", width: "60%" }}
        >
          <div
            class="pt-4"
            style={{
              borderBottom: "none",
              display: "flex",
              paddingLeft: "2rem",
            }}
          >
            <div class="card-title align-items-start flex-column">
              <h3 class="card-label font-weight-bolder text-dark">
                Giao dịch gần đây
              </h3>
            </div>
            <Link
              to="/admin/profile/transaction"
              style={{ marginLeft: "auto", color: "blue",marginRight:"2%" }}
            >
              Xem thêm &gt;&gt;
            </Link>
          </div>
          <BootstrapTable
            wrapperClasses="table-responsive ml-5"
            classes="table table-head-custom table-vertical-center overflow-hidden"
            bordered={false}
            keyField="id"
            data={data}
            columns={columns_transaction}
          />
        </div>
      </div>
      <Card className="mt-8">
        <CardHeader title="Danh sách người dùng"></CardHeader>
        <CardBody>
          <ToolkitProvider
            keyField="id"
            data={entities === null ? [] : entities.entities}
            columns={columns_user}
            search
          >
            {(props) => (
              <div>
                <div className="row">
                  <div className="col-6 pl-0">
                    <InputGroup style={{ marginLeft: "2%" }}>
                      <InputGroup.Append>
                        <Form.Group>
                          <Form.Control as="select">
                            <option value="">Tất cả</option>
                            <option value="id">Mã Người dùng</option>
                            <option value="name">Email</option>
                            <option value="name">Trạng thái</option>
                          </Form.Control>
                        </Form.Group>
                      </InputGroup.Append>
                      <SearchBar
                        style={{ marginLeft: "4%" }}
                        {...props.searchProps}
                      />
                    </InputGroup>
                  </div>
                </div>

                <BootstrapTable
                  hover
                  wrapperClasses="table-responsive"
                  classes="table table-head-custom table-vertical-center overflow-hidden"
                  bordered={false}
                  {...props.baseProps}
                  pagination={paginationFactory(options)}
                />
              </div>
            )}
          </ToolkitProvider>
        </CardBody>
      </Card>
    </div>
  );
}

export default ManageUser;
