/**
 * Created by Darron on 1/28/2017.
 */

import React from 'react';
import { render } from 'react-dom';
import eventBus from '../core/event-bus';
import reportsRepo from '../data/reports-repo';
import { Link } from 'react-router';

export default class Report extends React.Component {

    constructor(props) {
        super(props);

        this.ranReport = this.ranReport.bind(this);
        eventBus.on('ranReport', this.ranReport);

        this.state = {
            report: []
        };
    }

    componentWillUnmount() {
        eventBus.removeListener('ranReport', this.ranReport);
    }

    ranReport(report) {
        this.setState({report: report});
    }

    render() {
        return (

            <div className="panel panel-default">
                <div className="panel-heading">Violations Report</div>
                <div className="panel-body">
                    <div className="container-fluid">
                        {this.state.report.map(function (report, i) {
                            return <div className="report-divider row" key={i}>
                                <div className="col-md-2">
                                    <div className="row"><strong>User:</strong>{report.user.name}</div>
                                    <div className="row"><strong>Description:</strong>{report.description}</div>
                                    <div className="row"><strong>Number of
                                        Violations:</strong>{report.numberOfViolations}</div>
                                </div>
                                <div className="report-vertical-divider col-md-10">
                                    {report.violatingShifts.map(function (shift, i) {
                                        return <div className="row" key={i}>
                                            <div className="col-md-4"><Link to={"/shifts/"+shift.id}>View</Link></div>
                                            <div className="col-md-4"><strong>Shift
                                                Start:</strong>{shift.start.toLocaleString()}</div>
                                            <div className="col-md-4"><strong>Shift
                                                End:</strong>{shift.end.toLocaleString()}</div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        )
    }
};