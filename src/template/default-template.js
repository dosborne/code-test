/**
 * Created by Darron on 1/28/2017.
 */

import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import Users from './users';

export default class DefaultTemplate extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Duty Hours</h1>

                <div className="pull-right form-inline">
                    <Users></Users>
                </div>

                <ul className="nav nav-tabs">
                    <li><Link to="/shifts">Shifts</Link></li>
                    <li><Link to="/report">Report</Link></li>
                </ul>

                {this.props.children}
            </div>
        )
    }
};