import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const token = localStorage.getItem("accessToken");

const URL = "http://139.180.207.4:81/api";

const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", `Bearer ${token}`);

const initialUsersState = {
  listLoading: false,
  actionsLoading: false,
  entities: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const usersSlice = createSlice({
  name: "users",
  initialState: initialUsersState,
  reducers: {
    Userssuccess: (state, action) => {
      state.entities = action.payload;
    },
  },
});
const api = axios.create({
  baseURL: "http://139.180.207.4:81/api/",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const { Userssuccess } = usersSlice.actions;
export const getManageUsersList = (user_id) => async (dispatch) => {
  try {
    api.get(`users/${user_id}/?with=manageUsers`).then((res) => {
      var entities = res.data.manage_users || [];
      const data = {
        entities,
      };
      dispatch(Userssuccess(data));
    });
  } catch (e) {
    return console.error(e.message);
  }
};
export const deleteUsers = (id) => async (dispatch) => {
  return api.delete("users/" + id);
};

export const getAllUserDetail = (id) => {
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${URL}/users/${id}?with=roles.permissions;directPermissions`,
    requestOptions
  );
};
export const revokeRoles = (user_id, object) => {
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${URL}/users/${user_id}?action=detach&params=${object}`,
    requestOptions
  );
};
export const revokePermissions = (user_id, object) => {
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${URL}/users/${user_id}?action=detach&params=${object}`,
    requestOptions
  );
};
export const assignManageUsers = (user_id, object) => {
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${URL}/users/${user_id}?params=["manageUsers",${object}]&action=attach`,
    requestOptions
  );
};
export const deleteManageUsers = (user_id, object) => {
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${URL}/users/${user_id}?params=["manageUsers",${object}]&action=detach`,
    requestOptions
  );
};
export const assignMyManager = (user_id, object) => {
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${URL}/users/${user_id}?params=["myManagers",${object}]&action=attach`,
    requestOptions
  );
};
export const getRolesWithPermissions = () => {
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${URL}/roles?with=permissions`, requestOptions);
};
export const getAllDirectPermisisons = () => {
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${URL}/permissions`, requestOptions);
};
export const givePermission = (user_id, object) => {
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${URL}/users/${user_id}?action=attach&params=${object}`,
    requestOptions
  );
};
export const giveRoles = (user_id, object) => {
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${URL}/users/${user_id}?action=attach&params=${object}`,
    requestOptions
  );
};

export function Update(user_id, status_id) {
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${URL}/users/${user_id}?status_id=${status_id}`,
    requestOptions
  );
}

export function getStatus() {
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${URL}/user-statuses`, requestOptions);
}

// export  function getBalance(id) {
//   var requestOptions = {
//     method: "GET",
//     headers: myHeaders,
//     redirect: "follow",
//   };
//   return  fetch(
//     `${URL}/accounts?search=${id}&searchFields=user_id`,
//     requestOptions
//   );
// }

export function getUser() {
  return fetch(`${URL}/me?with=roles.permissions;directPermissions`, {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });
}
