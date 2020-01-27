import React ,{ Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap'
import Chart from 'chart.js'
import './MinorPanel.css';

import DataService from '../services/data/DataService'

class MinorPanel extends Component {
    chartRef = React.createRef()
    prChartRef = React.createRef()
    cufChartRef = React.createRef()

    staticState = {
        stationDetails: DataService.fetchStatic()
    }

    stationSummaryChart(ref) {
        new Chart(ref, {
            type: 'horizontalBar',
            data: {
                labels: [""],
                datasets: [
                    {
                        label: '# of dead stations',
                        data: [8],
                        backgroundColor: "#BCBCBC"
                    },
                    {
                        label: '# of online stations',
                        data: [15],
                        backgroundColor: "#507AFF"
                    },
                    {
                        label: "# of disconnected stations",
                        data: [12],
                        backgroundColor: "#BBCEFF"
                    }
                ]
            },
            options: {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    }

    prChart(ref, data) {
        new Chart(ref, {
            type: "doughnut",
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#BCBCBC',
                        '#507AFF'
                    ]
                }]
            }
        })
    }

    componentDidMount() {
        const cRef = this.chartRef.current.getContext("2d")
        this.stationSummaryChart(cRef)

        /* const prRef = this.prChartRef.current.getContext("2d")
        this.prChart(prRef, [10.9, 89.1]) */

        /* const cufRef = this.cufChartRef.current.getContext("2d")
        this.prChart(cufRef, [100-16.1, 16.1]) */
    }

    render() {
        return(
            <div className="panel-container">
                <h2>Delhi Solar Power Station Dashboard</h2>
                <Button variant="outline-dark" block>Learn More</Button>
                <div className="time-container">
                    <h3>TODAY</h3>
                    <div className="info-box">
                        <canvas id="ch" ref={this.chartRef}/>
                    </div>
                    <div className="info-box">
                        <Row>
                            <Col>
                                <span className="ele-name">Power Output</span>
                                <span className="ele-value">{this.props.aggPowerOutput}</span>
                                <span className="ele-unit">kW</span>
                            </Col>
                            <Col>
                                <span className="ele-name">Energy Generated Today</span>
                                <span className="ele-value">{this.props.aggEnergyOutput}</span>
                                <span className="ele-unit">kWh</span>
                            </Col>
                        </Row>
                    </div>
                    <div className="info-box">
                        <Row>
                            {/* <Col md={4}>
                                <span className="ele-name">Performance Ratio</span>
                                <span className="ele-value">89.9</span>
                                <span className="ele-unit">%</span>
                                <canvas id="pr" ref={this.prChartRef}></canvas>
                                
                            </Col> */}
                            <Col md={6}>
                                <span className="ele-name">Specific Yield</span>
                                <span className="ele-value">{(this.props.aggEnergyOutput/this.staticState.stationDetails.capSum).toFixed(2)}</span>
                                <span className="ele-unit">kWh/kWp</span>
                            </Col>
                            <Col md={6}>
                                <span className="ele-name">Capacity Utilisation Factor</span>
                                <span className="ele-value">{(this.props.aggEnergyOutput / (24 * this.staticState.stationDetails.capSum) * 100).toFixed(2)}</span>
                                <span className="ele-unit">%</span>
                                {/* <canvas id="cuf" ref={this.cufChartRef}></canvas> */}
                            </Col>
                        </Row>
                    </div>
                </div>


                {/* <div className="time-container">
                    <h3>TODAY</h3>
                    <div className="info-box">
                    hello
                    </div>
                    <div className="info-box">
                        <Row>
                            <Col>
                                <span className="ele-name">Power Output</span>
                                <span className="ele-value">124.33</span>
                                <span className="ele-unit">mW</span>
                            </Col>
                            <Col>
                                <span className="ele-name">Energy Generated Today</span>
                                <span className="ele-value">635.34</span>
                                <span className="ele-unit">mWh</span>
                            </Col>
                        </Row>
                    </div>
                    <div className="info-box">
                        <Row>
                            <Col>
                                <span className="ele-name">Performance Ratio</span>
                                <span className="ele-value">89.9</span>
                                <span className="ele-unit">%</span>
                            </Col>
                            <Col>
                                <span className="ele-name">Specific Yield</span>
                                <span className="ele-value">3.25</span>
                                <span className="ele-unit">kWh/kWp</span>
                            </Col>
                            <Col>
                                <span className="ele-name">Capacity Utilisation Factor</span>
                                <span className="ele-value">16.1</span>
                                <span className="ele-unit">%</span>
                            </Col>
                        </Row>
                    </div>
                </div> */}
            </div>
        )
    }
}

export default MinorPanel