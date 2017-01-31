/**
 * Created by Darron on 1/28/2017.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import DefaultTemplate from "../template/default-template";
import Report from '../report/index';
import Calendar from '../shifts/calendar';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={DefaultTemplate}>
            <IndexRoute component={Calendar}/>
            <Route path="shifts(/:shiftId)" component={Calendar}/>
            <Route path="report" component={Report}/>
        </Route>
    </Router>
), document.getElementById("hook"));