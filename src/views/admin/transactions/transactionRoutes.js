
import React, {Suspense, lazy} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../../../_metronic/layout";
import { TransactionCreate } from "./transaction-create";
import { TransactionDetail } from "./transaction-detail";
import { TransactionList } from "./transaction-list";
import { TransactionType } from "./transaction-type";
export default function TransactionRoutes() {

    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    <Redirect exact={true} from="/admin/transaction" to="/admin/transaction/list"/>
                    
                }
                    
                 <ContentRoute path="/admin/transaction/create" component={TransactionCreate}/>
                <ContentRoute path="/admin/transaction/list" component={TransactionList}/>
                <ContentRoute path="/admin/transaction/:id" component={TransactionDetail}/>
               
            </Switch>
        </Suspense>
    );

}
