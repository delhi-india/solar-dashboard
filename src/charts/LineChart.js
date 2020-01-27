import React ,{ Component } from 'react';
import Chart from 'chart.js'

import './LineChart.css'

class LineChart extends Component {
    chartRef = React.createRef()
    staticState = {
        chart: null
    }
    styleMap = [
        {
            yAxisID: 'A',
            borderColor: "#C6C6C6",
            backgroundColor: "#C6C6C666",
            position: "right"
        },
        {
            yAxisID: 'B',
            borderColor: "#507AFF00",
            backgroundColor: "#507AFF",
            position: "left"
        }
    ]

    /* componentDidUpdate() {
        //console.log('linechart')
        //console.log(this.props.data)
        //this.extractUpdatedData()
        //console.log(this.props.label)
        //console.log('update')
    } */

    extractUpdatedData() {
        if(this.props.data) {
            let data = this.props.data

            this.staticState.chart.data.labels = data.x
            this.staticState.chart.data.datasets.data = this.props.label

            this.staticState.chart.update()

            /* let l = data.length
            let empty = 6 - new Date(data[l-1]._id).getDay()
            let i = 0
            for(; i<empty; i++) {
                this.staticState.data[i]['v'] = 0
            }
            for(let j=0; j<l; j++) {
                this.staticState.data[i+j]['v'] = data[l-j-1].powerGeneratedTodayMaxSum
            } */
            
        }
    }

    prepareData(data) {
        let datasets = []
        let yAxes = []

        data.forEach((v, idx) => {
            let ds = []
            if(v === undefined) {
                return
            }
            v.forEach((d) => {
                if(d === 0) {
                    ds.push(NaN)
                }
                else {
                    ds.push(d.toFixed(2))
                }
            })
            datasets.push({
                yAxisID: this.styleMap[idx].yAxisID,
                data: ds,
                borderColor: this.styleMap[idx].borderColor,
                fill: 'start',
                backgroundColor: this.styleMap[idx].backgroundColor,
                pointRadius: 0
            })
            yAxes.push({
                id: this.styleMap[idx].yAxisID,
                type: 'linear',
                position: this.styleMap[idx].position,
            })
        })

        return { datasets, yAxes }
    }

	componentDidUpdate() {
		const myChartRef = this.chartRef.current.getContext("2d");

        let { datasets, yAxes } = this.prepareData(this.props.data)
        
        this.staticState.chart = new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.props.label,
                datasets: datasets
            },
            options: {
                spanGaps: true,
                title: {
                    display: this.props.name === undefined ? false : true,
                    text: this.props.name === undefined ? "" : this.props.name.toUpperCase()
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: yAxes
                },
                tooltips: {
                    mode: 'index',
                    axis: 'x',
                    intersect: false
                }
            }
        });
	}

	render() {
        //console.log('line')
		return(
			<div className="chart-box">
				<canvas id="chart" ref={this.chartRef}></canvas>
			</div>
		)
	}
}

export default LineChart