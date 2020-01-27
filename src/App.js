import React ,{ Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MenuPanel from 'panel/MenuPanel'
import MinorPanel from 'panel/MinorPanel'
import MajorPanel from 'panel/MajorPanel'

class App extends Component {

	state = {
        stationData: {},
		aggPowerOutput: 0,
		aggEnergyOutput: 0,
		plantEnergyPowerMap: {},
        switchChecked: false,
        aggData: {}
    }

    duration = 14

    constructor(props) {
        super(props)
        this.handleSwitch = this.handleSwitch.bind(this)
    }

    handleSwitch(val) {
        this.setState({
            switchChecked: !this.state.switchChecked
        })
        console.log('Val: ' + val)
    }

	fetch() {
		fetch('https://datalake.pravah.io:12434')
            .then((res) => {
                res.json().then((res) => {
                    this.prepareData(res.data)
                })
            })
	}

	prepareData(dataArr) {
        let data = {}
        dataArr.forEach((v, idx) => {
            //console.log(v['name'])
            data[v['_id']] = {
                'currentPowerOutput': this.extract(v['currentPowerOutput'], 'currentPowerOutput'),
                'irradiation': this.extract(v['irradiation'], 'irradiation'),
                'powerGeneratedToday': this.extract(v['powerGeneratedToday'], 'powerGeneratedToday'),
                'name': v['name']
            }
        })
        this.extractEnergyAgg(data)
    }

    aggAllPlantData(aggData, stationData, stIdx) {
        let tempPower = Array(this.duration).fill(0)
        let tempEnergy = Array(this.duration).fill(0)
        let tempIrr = Array(this.duration).fill(0)
        stationData['currentPowerOutput']['x'].forEach((val, i) => {
            if(val.getHours() >= 6 || val.getHours() < 20) {
                //let idx = (val.getHours() - 6) * 4 + Math.floor(val.getMinutes() / 15)
                let idx = (val.getHours() - 6)
                tempPower[idx] = stationData['currentPowerOutput']['y'][i]
                tempEnergy[idx] = stationData['powerGeneratedToday']['y'][i]
                tempIrr[idx] = stationData['irradiation']['y'][i]
            }
            
        })
        for(let i=0; i<tempPower.length; i++) {
            aggData['powerOutput'][i] += tempPower[i]
            aggData['energyOutout'][i] += tempEnergy[i]
            aggData['irradiationOutput'][i] = (aggData['irradiationOutput'][i] * stIdx + tempIrr[i]) / (stIdx + 1)
        }
    }

	extractEnergyAgg(station_data) {
        let powerOutput = 0
        let energyGen = 0
		let plantEnergyPowerMap = {}

        let aggData = {
            powerOutput: new Array(this.duration).fill(0),
            energyOutout: new Array(this.duration).fill(0),
            irradiationOutput: new Array(this.duration).fill(0),
            x: new Array(this.duration)
        }
        for(let i=0;i<this.duration;i++) {
            let hr = i + 6
            let min = '00'
            aggData.x[i] = '' + hr + ':' + min
        }
        Object.keys(station_data).forEach((key, i) => {
            let mostRecentDataDate = new Date()
            mostRecentDataDate.setMinutes(mostRecentDataDate.getMinutes() - 40)

            this.aggAllPlantData(aggData, station_data[key], i)

            let stringDateUpdatedAt = station_data[key]['currentPowerOutput']['x']
            let dataUpdatedAt = stringDateUpdatedAt[stringDateUpdatedAt.length - 1]

            let cp = station_data[key]['currentPowerOutput']['y']
            let en = station_data[key]['powerGeneratedToday']['y']

            let po = dataUpdatedAt.getTime() >= mostRecentDataDate.getTime() ? cp[cp.length-1] : 0
            let eo = en[en.length-1]

            powerOutput += po
            energyGen += eo

			plantEnergyPowerMap[key] = {
				'currentPowerOutput': po,
				'powerGeneratedToday': eo,
                'name': station_data[key]['name']
			}
        })
        this.setState({
            stationData: station_data,
            aggPowerOutput: powerOutput.toFixed(2),
            aggEnergyOutput: energyGen.toFixed(2),
			plantEnergyPowerMap: plantEnergyPowerMap,
            aggData: aggData
        })
    }

	extract(arr, name) {
        let x = [], y = []
        arr.forEach((v, idx) => {
            let d = new Date(parseInt(v['timestamp'])*1000)
            x.push(d)
            y.push(v[name] !== undefined ? v[name] : 0)
        })
        return {
            'x': x,
            'y': y
        }
    }

	componentDidMount() {
		this.fetch()
	}

	render() {

		return(
			<div className="app app-container">
				<div className="app-menu">
					<MenuPanel switchHandler={this.handleSwitch}/>
				</div>
				<div className="app-minor">
					<MinorPanel aggEnergyOutput={this.state.aggEnergyOutput} aggPowerOutput={this.state.aggPowerOutput}/>
				</div>
				<div className="app-major">
					<MajorPanel stationData={this.state.stationData} plantEnergyPowerMap={this.state.plantEnergyPowerMap} switchState={this.state.switchChecked} aggData={this.state.aggData}/>
				</div>
				{/* <MinorPanel />
				<MajorPanel /> */}
				{/* <div className="chart-container">
				<Container fluid="true">
				</Container>
					
				</div> */}
			</div>
			
		)
	}
}

export default App;
