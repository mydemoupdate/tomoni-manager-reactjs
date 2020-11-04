import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";
import { DashboardPage } from "../../app/pages/DashboardPage";
import Profile from "./profile/ProfilePage";
import { TransactionList } from "./transaction/transactionList";
import UserDetail from "./manage_user/UserDetail";
import { OrderPurchaseList } from "./purchase/purchase-list";
import { OrderPurchaseDetail } from "./purchase/purchase-detail";
import { ProductList } from "./products/productList";
import { ProductDetail } from "./products/productDetail";
import { ProductCreate } from "./products/productCreate";
import { ProductUpdate } from "./products/updateProduct";
import { UpdatePackage } from "./products/createPackage";
import { CreatePaymentOrder } from "./products/createPaymentOrder";
import { CreateWholesale } from "./products/createWholeSale";
import ManageUser from "./manage_user/manageUser";
import { SupplierList } from "./suppliers/supplierList";
import { SupplierCreate } from "./suppliers/supplierCreate";
import { SupplierUpdate } from "./suppliers/supplierUpdate";
import { ManagerList } from "./managerOthers/managerList";
import { WarehouseList } from './warehouse/warehouseList';
import {WareHouseCreate} from './warehouse/warehouseCreate';
import {WareHouseDetail} from './warehouse/warehouseDetail'
import TransactionRoutes from "./transactions/transactionRoutes";
import { TransactionType } from "./transactions/transaction-type";
import {BoxList} from './box/boxList';
import {BoxDetail} from './box/boxDetail';
import {AgencyList} from './managerOthers/agencyList';
import {ShippingMethodList} from './managerOthers/shippingMethodList';
import {ShelveList} from './managerOthers/shelveList'
import {PalletList} from './managerOthers/palletList'

const OrderRoutes = lazy(() => import("./order/OrderRoutes"));
export default function AdminRoutes() {
  return (
    <Suspense fallback="Load">
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/admin" />
        }
        <ContentRoute path="/admin/transaction-type" component={TransactionType}/>
        <Route path="/admin/transaction/" component={TransactionRoutes} />
        
        <ContentRoute
          path="/admin/purchase/:id"
          component={OrderPurchaseDetail}
        />
        <Route path="/admin/orders" component={OrderRoutes} />
        <ContentRoute path="/admin/purchase" component={OrderPurchaseList} />
        <ContentRoute path="/admin/users/:id" component={UserDetail} />
        <ContentRoute
          path="/admin/profile/transaction"
          component={TransactionList}
        />
        <ContentRoute path="/admin/profile" component={Profile} />
        <ContentRoute
          path="/admin/manage-user"
          component={ManageUser}
        ></ContentRoute>
        <ContentRoute path="/admin/product" component={ProductList} />
        <ContentRoute
          path="/admin/products/detail/:id"
          component={ProductDetail}
        />
        <ContentRoute path="/admin/createproduct" component={ProductCreate} />
        <ContentRoute
          path="/admin/updateprodut/:id"
          component={ProductUpdate}
        />
        <ContentRoute
          path="/admin/createpackage/:id"
          component={UpdatePackage}
        />
        <ContentRoute
          path="/admin/createpaymentorder/:id"
          component={CreatePaymentOrder}
        />
        <ContentRoute
          path="/admin/createwholesale/:id"
          component={CreateWholesale}
        />
        <ContentRoute path="/admin/supplier" component={SupplierList} />
        <ContentRoute path="/admin/createsupplier" component={SupplierCreate} />
        <ContentRoute
          path="/admin/supplierupdate/:id"
          component={SupplierUpdate}
        />
        <ContentRoute path="/admin/othermanager" component={ManagerList} />
        <ContentRoute path="/admin/warehouse" component={WarehouseList} />
        <ContentRoute path="/admin/warehousecreate" component={WareHouseCreate} />
        <ContentRoute path="/admin/warehousedetail/:id" component={WareHouseDetail}/>
        <ContentRoute path="/admin/box" component={BoxList}/>
        <ContentRoute path='/admin/boxdetail/:id' component={BoxDetail}/>
        <ContentRoute path="/admin/agency" component={AgencyList}/>
        <ContentRoute path="/admin/shipmentmethod" component={ShippingMethodList}/>
        <ContentRoute path="/admin/shelve" component={ShelveList}/>
        <ContentRoute path="/admin/pallet" component={PalletList}/>
        <ContentRoute path="/admin" component={DashboardPage} />

      </Switch>
    </Suspense>
  );
}
