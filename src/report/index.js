/**
 * Created by Darron on 1/28/2017.
 */

import React from 'react';
import { render } from 'react-dom';
import eventBus from '../core/event-bus';
import Report from './report';
import ReportForm from './form';

export default class Reports extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="panel panel-default">
                <ReportForm></ReportForm>
                <Report></Report>
            </div>
        )
    }
};