import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getAllUserDetail,
  assignManageUsers,
  revokeRoles,
  assignMyManager,
  revokePermissions,
  getManageUsersList,
  getRolesWithPermissions,
  getAllDirectPermisisons,
  giveRoles,
  givePermission,
  deleteManageUsers,
  getStatus,
  Update,
} from "../../_redux_/userSlice";

import { useLocation } from "react-router";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import Moment from "moment";
import SVG from "react-inlinesvg";
import swal from "sweetalert";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Link, useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";

import {
  toAbsoluteUrl,
  sortCaret,
  headerSortingClasses,
} from "../../../_metronic/_helpers";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import {
  InputGroup,
  OverlayTrigger,
  Tooltip,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import MailIcon from "@material-ui/icons/Mail";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { TreeSelect } from "antd";

function UserDetail() {
  const ProductSchema = Yup.object().shape({});
  const dispatch = useDispatch();
  const location = useLocation();
  const [info, setInfo] = useState({
    id: "",
    email: "",
    status: "",
    roles: [],
    direct_permissions: [],
    permissions: [],
  });
  const [arr, setArr] = useState([]);
  const [arrAll, setArrAll] = useState([]);
  const [roles_req, setRoleReq] = useState(["roles"]);
  const [pers_req, setPerReq] = useState(["directPermissions"]);
  const [roles_revoke, setRoleRevoke] = useState(["roles"]);
  const [pers_revoke, setPerRevoke] = useState(["directPermissions"]);
  const [all_permissions, setAllPermissions] = useState([]);
  const [balance, setBalance] = useState();
  const [currency_id, setCurrency] = useState();
  const [balance_vn, setBalanceVN] = useState(0);
  const [balance_jp, setBalanceJP] = useState(0);
  const [dataChild, setDataChild] = useState([]);
  const [dataPerChild, setDataPerChild] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [valueRoles, setValueRoles] = useState([]);
  const [valuePer, setValuePer] = useState([]);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState([]);
  const [user_manage, setUserManage] = useState([]);
  const [manageUser, setManageUser] = useState([]);
  const [status_req, setStatusReq] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isConvert, setIsConvert] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const ids = String(window.location.href).slice(
    String(window.location.href).lastIndexOf("/") + 1
  );
  const { SearchBar } = Search;
  const onSelectRoles = (selectedKeys, info) => {
    let newSelect = [...roles_req];
    newSelect.push(selectedKeys);
    setRoleReq(newSelect);
  };
  const onSelectPer = (selectedKeys, info) => {
    let newSelect = [...pers_req];
    newSelect.push(selectedKeys);
    setPerReq(newSelect);
  };
  const onDeselectPer = (deselectedKeys, info) => {
    let newSelect = [...pers_revoke];
    newSelect.push(deselectedKeys);
    setPerRevoke(newSelect);
  };
  const onDeselectRoles = (deselectedKeys, info) => {
    let newSelect = [...roles_revoke];
    newSelect.push(deselectedKeys);
    setRoleRevoke(newSelect);
  };
  const onChangeRoles = (value) => {
    setValueRoles(value);
  };
  const onChangePer = (value) => {
    setValuePer(value);
  };
  const { currentState } = useSelector(
    (state) => ({ currentState: state.users }),
    shallowEqual
  );
  const { entities } = currentState;
  var tProps = null;
  var tProps2 = null;
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
      sort: true,
    },
    {
      dataField: "amount",
      text: "Số tiền",
      sort: true,
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
  function statusFormatter(status_id) {
    return (
      <>
        {status_id === "locked" ? (
          <span className="badge  badge-danger">{status_id}</span>
        ) : (
          <span className="badge  badge-success">{status_id}</span>
        )}
      </>
    );
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

  const handleUpdate = () => {
    // React creates function whenever rendered
    swal({
      title: "Bạn có chắc chắn thay đổi thông tin không?",
      icon: "warning",
      dangerMode: true,
      buttons: ["No", "Yes"],
    }).then((willUpdate) => {
      if (willUpdate) {
        Update(ids, status_req)
          // assignManageUsers(ids, JSON.stringify(manageUser));
          // assignMyManager(ids, JSON.stringify(user_manage))
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              swal(`Cập nhật thành công`, {
                icon: "success",
              });
              getAllUserDetail(ids)
                .then((res) => res.json())
                .then((data) => {
                  setInfo({
                    ...info,
                    id: data?.id,
                    email: data?.email,
                    status: data?.status_id,
                  });
                });
              setShow(false);
            } else
              swal(`Thêm không thành công!\n Vui lòng kiểm tra lại`, {
                icon: "warning",
              });
          });
      }
    });
  };

  function deleteModal(object) {
    swal({
      title: "Bạn có chắc muốn xoá người dùng này ?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Huỷ", "Xoá"],
    }).then((willDelete) => {
      if (willDelete) {
        deleteManageUsers(ids, JSON.stringify(object.id))
          .then((res) => {
            console.log("res", res);
            swal("Đã xoá thành công!", {
              icon: "success",
            });
            dispatch(getManageUsersList(ids));
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
  function handleGive() {
    swal({
      title: "Bạn chắc chắn muốn thay đổi thông tin ?",
      icon: "warning",
      dangerMode: true,
      buttons: ["No", "Yes"],
    }).then((willDelete) => {
      if (willDelete) {
        giveRoles(ids, JSON.stringify(roles_req));
        if (pers_revoke.length > 1) {
          revokePermissions(ids, JSON.stringify(pers_revoke));
        }
        if (roles_revoke.length > 1) {
          revokeRoles(ids, JSON.stringify(roles_revoke));
        }
        givePermission(ids, JSON.stringify(pers_req))
          .then((res) => {
            swal("Cập nhật thành công!", {
              icon: "success",
            });
            getAllUserDetail(ids)
              .then((res) => res.json())
              .then((data) => {
                setInfo({
                  ...info,
                  id: data?.id,
                  email: data?.email,
                  status: data?.status_id,
                  direct_permissions: data?.direct_permissions,
                });
              });
          })
          .catch((err) => {
            console.log(err);
            swal("Cập nhật thất bại !", {
              icon: "warning",
            });
          });
      }
    });
  }
  useEffect(() => {
    getStatus()
      .then((response) => response.json())
      .then((result) => setStatus(result))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    dispatch(getManageUsersList(ids));
  }, [location]);
  useEffect(() => {
    getAllUserDetail(ids)
      .then((res) => res.json())
      .then((data) => {
        setInfo({
          ...info,
          id: data?.id,
          email: data?.email,
          status: data?.status_id,
          direct_permissions: data?.direct_permissions,
        });
        setArr(data?.roles);
        setIsLoadData(true);
      });
    getAllDirectPermisisons()
      .then((res) => res.json())
      .then((data) => {
        setAllPermissions(data);
      })
      .catch((error) => console.log("error", error));
    getRolesWithPermissions()
      .then((response) => response.json())
      .then((result) => {
        setArrAll(result);
      })
      .catch((error) => console.log("error", error));
  }, [location]);
  function convertPer() {
    let arrayPerOfUser = [];
    for (let item of info.direct_permissions) {
      let title = item.name;
      let key = item.id;
      let value = item.id;
      arrayPerOfUser.push({
        title: title,
        key: key,
        value: value,
      });
    }
    setIsConvert(true);
    setDataPerChild(arrayPerOfUser);
  }
  function convert() {
    let arrayRolesOfuser = [];
    for (let item of arr) {
      let title = item.name;
      let key = item.id;
      let value = item.id;
      let arrPer = item.permissions;
      let children = [];
      for (let itemPer of arrPer) {
        let title = itemPer.name;
        let key = itemPer.id;
        let value = item.id;
        children.push({ title: title, key: key, value: value });
      }
      arrayRolesOfuser.push({
        title: title,
        key: key,
        value: value,
        children: children,
      });
    }
    setIsConvert(true);
    setDataChild(arrayRolesOfuser);
  }

  useEffect(() => {
    if (isLoadData == true) {
      convert();
      convertPer();
      setIsLoadData(false);
    }
    if (isConvert == true) {
      var defaultValue = dataChild.map((item) => item.key);
      setValueRoles(defaultValue);
      setValuePer(dataPerChild.map((item) => item.key));
    }
  }, [isLoadData, isConvert]);
  let arrayRoles = [];
  for (let item of arrAll) {
    let title = item.name;
    let key = item.id;
    let value = item.id;
    let arrPer = item.permissions;
    let children = [];
    for (let itemPer of arrPer) {
      let title = itemPer.name;
      let key = itemPer.id;
      let value = itemPer.id;
      children.push({ title: title, key: key, value: value, disabled: true });
    }
    arrayRoles.push({
      title: title,
      key: key,
      value: value,
      children: children,
    });
  }
  let arrayAllPer = [];
  for (let item of all_permissions) {
    let title = item.name;
    let key = item.id;
    let value = item.id;
    arrayAllPer.push({ title: title, key: key, value: value });
  }

  if (isConvert == true) {
    tProps = {
      treeData: arrayRoles,
      value: valueRoles,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_PARENT,
      treeCheckStrictly: true,
      placeholder: "Please select",
      onSelect: onSelectRoles,
      selectedKeys: selectedKeys,
      onChange: onChangeRoles,
      style: {
        width: "60%",
      },
    };
  }
  if (isConvert == true) {
    tProps2 = {
      treeData: arrayAllPer,
      value: valuePer,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_PARENT,
      treeCheckStrictly: true,
      placeholder: "Please select",
      onSelect: onSelectPer,
      selectedKeys: selectedKeys,
      onChange: onChangePer,
      style: {
        width: "60%",
      },
    };
  }
  return (
    <div>
      <div class="card-header py-3" style={{ display: "flex" }}>
        <div class="card-title align-items-start flex-column">
          <h3 class="card-label font-weight-bolder text-dark">
            Thông tin {ids}
          </h3>
          <span class="text-muted font-weight-bold font-size-sm mt-1">
            Xem đầy đủ chi tiết cá nhân
          </span>
        </div>
        <div class="card-toolbar" style={{ marginLeft: "auto" }}>
          <button
            onCl
            onClick={handleShow}
            type="reset"
            class="btn btn-success mr-2"
          >
            Cập nhật thông tin
          </button>
          <Link to="/admin/manage-user" class="btn btn-secondary">
            Back
          </Link>
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

                <label class="col-xl-3 col-lg-3 col-form-label ">
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

                <label class="col-xl-3 col-lg-3 col-form-label ">
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
              <button
                style={{ marginLeft: "80%" }}
                onClick={handleGive}
                type="button"
                className=" btn btn-danger"
              >
                <i className="far"></i>
                Cập nhật quyền
              </button>

              <div class="form-group row mt-8">
                <label class="col-xl-4 col-lg-3 col-form-label">
                  Quyền trực tiếp
                </label>
                <TreeSelect onDeselect={onDeselectPer} {...tProps2} />
              </div>
              <div class="form-group row mt-3">
                <label class="col-xl-4 col-lg-3 col-form-label">
                  Quyền theo vai trò
                </label>
                <TreeSelect onDeselect={onDeselectRoles} {...tProps} />
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
              style={{ marginLeft: "auto", color: "blue", marginRight: "2%" }}
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
      <Modal
        show={show}
        onHide={handleClose}
        animation={true}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <div className="card card-custom card-transparent">
            {
              <Formik
                initialValues={{
                  id: "",
                  status_id: "",
                  roles: [],
                  permissions: [],
                }}
                validationSchema={ProductSchema}
                onSubmit={(values, actions) => {
                  setTimeout(() => {
                    actions.setSubmitting(false);
                  }, 1000);
                }}
              >
                {(props) => (
                  <Form>
                    <Card>
                      <CardBody style={{ display: "flex" }}>
                        <div style={{ width: "40%", margin: "0 7%" }}>
                          <div style={{ paddingBottom: "5%" }}>
                            <label>ID người dùng</label>
                            <input
                              class="form-control form-control-lg form-control-solid"
                              type="text"
                              disabled
                              defaultValue={ids}
                            />
                          </div>
                          <div style={{ paddingBottom: "5%" }}>
                            <label>Trạng thái người dùng </label>
                            <Autocomplete
                              style={{ backgroundColor: "#F3F6F9" }}
                              onChange={(event, newValue) => {
                                setStatusReq(newValue.id);
                              }}
                              id="combo-box-demo"
                              options={status}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Trạng thái"
                                  variant="outlined"
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div style={{ width: "40%", margin: "0 7%" }}>
                          <div style={{ paddingBottom: "5%" }}>
                            <label>Được quản lý </label>
                            <input
                              onChange={(e) => setManageUser(e.target.value)}
                              class="form-control form-control-lg form-control-solid"
                              type="text"
                              placeholder="Nhập ID người được quản lý"
                            />
                          </div>
                          <div style={{ paddingBottom: "5%" }}>
                            <label>Bị quản lý bởi </label>
                            <input
                              onChange={(e) => setUserManage(e.target.value)}
                              class="form-control form-control-lg form-control-solid"
                              type="text"
                              placeholder="Nhập ID người quản lý"
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Form>
                )}
              </Formik>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserDetail;
