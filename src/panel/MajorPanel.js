import React ,{ Component } from 'react';
import { Tabs, Tab, Row, Col, Container } from 'react-bootstrap'
import './MajorPanel.css';

import github from './github.svg'
import twitter from './twitter.svg'

import LineChart from '../charts/LineChart'
import ScatterPlot from '../charts/ScatterPlot'
import MatrixPlot from '../charts/MatrixPlot'
import StationMap from '../map/StationMap'
import HeadingWithTooltip from '../utils/HeadingWithTooltip'

import DataService from '../services/data/DataService'

class MajorPanel extends Component {
    state = {
        energyProducedData: null
    }
    staticState = {
        noStations: 0,
        stationStatic: {}
    }

    history() {
        DataService.fetchHistory().then((res) => {
            this.setState({
                energyProducedData: res.data
            })
        })
	}

    componentDidMount() {
        this.history()
        this.staticState.stationStatic = DataService.fetchStatic()
    }

    componentDidUpdate() {
        //console.log(this.state.energyProducedData)
    }

    prepareScatterPlotData() {
        let data = this.props.plantEnergyPowerMap
        let plotPowerData = []
        let plotEnergyData = []
        Object.keys(data).forEach((key) => {
            plotPowerData.push({
                x: this.staticState.stationStatic.capMap[key],
                y: data[key]['currentPowerOutput'],
                name: 'Name: ' + (data[key]['name'].toUpperCase()) + ' [Cap: ' + this.staticState.stationStatic.capMap[key] + ' kWp / Power Output: ' + (data[key]['currentPowerOutput'].toFixed(2)) + ' kW]'
            })
            plotEnergyData.push({
                x: this.staticState.stationStatic.capMap[key],
                y: data[key]['powerGeneratedToday'],
                name: 'Name: ' + (data[key]['name'].toUpperCase()) + ' [Cap: ' + this.staticState.stationStatic.capMap[key] + ' kWp / Energy Output: ' + (data[key]['powerGeneratedToday'].toFixed(2)) + ' kWh]'
            })
        })
        this.staticState.noStations = Object.keys(data).length
        return [plotPowerData, plotEnergyData]
    }

    prepareStationLineChartData() {
        let rows = [], cols = []
        let stationData = this.props.stationData
		Object.keys(stationData).forEach((key, idx) => {
            let val = stationData[key]
			cols.push(
				<Col key={idx}>
					<LineChart data={[val['irradiation']['y'], val['currentPowerOutput']['y']]} label={val['currentPowerOutput']['x']} name={val['name']}/>
				</Col>
			)
			if(((idx+1) % 3) === 0) {
				rows.push(
					<Row key={idx} className="extra-margin-bottom">
						{cols}
					</Row>
				)
				cols = []
			}
		})
        rows.push(
            <Row key="remaining" className="extra-margin-bottom">
                {cols}
            </Row>
        )
        return rows
    }

    renderGraphs() {
        let rows = this.prepareStationLineChartData()
        let scatterData = this.prepareScatterPlotData()
        // console.log('scatterData')
        // console.log(this.props.aggData.x)
        // console.log(this.props.aggData.powerOutput)
        return (
            <>
                <div className="header">
                    <a href="/login"><img src={github} alt="github"/></a>
                    <a href="/login"><img src={twitter} alt="twitter"/></a>
                </div>
                <div>
                <Tabs defaultActiveKey="summary" id="uncontrolled-tab-example" style={{flex:1,justifyContent:'space-around',flexDirection:'row'}}>
                    <Tab eventKey="summary" title="Aggregated Summary" tabClassName={{flex:1}}>
                        <div className="matrix">
                            <HeadingWithTooltip content={"Daily Energy Output"} tooltip_title={"Help"} tooltip_content={['This chart shows ', <u key="daily">daily energy produced (kWh)</u>, ' for all power stations.']}/>
                            <MatrixPlot data={this.state.energyProducedData}/>
                        </div>
                        <Container>
                            <Row className="extra-margin-bottom">
                                <Col md={6}>
                                    <div className="info-box-left-border">
                                        <h6>Total Capacity</h6>
                                        <h3>{this.staticState.stationStatic.capSum}</h3>kWp
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="info-box-left-border">
                                        <h6># of live stations</h6>
                                        <h3>{this.staticState.noStations}</h3>nos
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                        <Container>
                            <Row className="extra-margin-bottom">
                                <Col md={4}>
                                    <HeadingWithTooltip content={"Today's Power Generation Trend (kW)"} tooltip_title={"Help"} tooltip_content={'This chart shows power generated today.'}/>
                                    <LineChart data={[this.props.aggData.powerOutput]} label={this.props.aggData.x}/>
                                    {/* <canvas id="power-gen" ref={this.powerGenRef}></canvas> */}
                                </Col>
                                <Col md={4}>
                                    <HeadingWithTooltip content={"Today's Solar Insolation Trend (kW/m^2)"} tooltip_title={"Help"}/>
                                    <LineChart data={[this.props.aggData.irradiationOutput]} label={this.props.aggData.x}/>
                                </Col>
                                <Col md={4}>
                                    <HeadingWithTooltip content={"Today's Energy Generation Trend (kWh)"} tooltip_title={"Help"}/>
                                    <LineChart data={[this.props.aggData.energyOutout]} label={this.props.aggData.x}/>
                                </Col>
                            </Row>
                        </Container>

                        
                    </Tab>
                    <Tab eventKey="details" title="Station Details" tabClassName={{flex:1}}>
                        <div className="station-comparision-box">
                            <HeadingWithTooltip content={"Today's Power Generation (kW) - Insolation Trend (kW/m^2)"} tooltip_title={"Help"} tooltip_content={'This chart shows power generated today.'}/>
                            {rows}
                        </div>
                    </Tab>
                    <Tab eventKey="comparision" title="Station Comparision" tabClassName={{flex:1}}>
                        <div className="station-comparision-box">
                            <HeadingWithTooltip content={"Today's Power Output (kW) vs Plant Capacity (kWp)"} tooltip_title={"Help"} tooltip_content={'This chart shows power generated today.'}/>
                            <ScatterPlot data={scatterData[0]}/>
                            <HeadingWithTooltip content={"Today's Energy Output (kWh) vs Plant Capacity (kWp)"} tooltip_title={"Help"} tooltip_content={'This chart shows power generated today.'}/>
                            <ScatterPlot data={scatterData[1]}/>
                        </div>
                    </Tab>
                </Tabs>
                </div>
            </>
        )
    }

    render() {
        let renderCom = null
        if(!this.props.switchState) {
            renderCom = this.renderGraphs()
        } else {
            renderCom = <StationMap/>
        }
        return(
            <div className="major-container">
                {renderCom}
            </div>
        )
    }
}

export default MajorPanel