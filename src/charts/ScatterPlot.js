import React ,{ Component } from 'react';
import Chart from 'chart.js'

//import './ScatterPlot.css'

class ScatterPlot extends Component {
    chartRef = React.createRef()
    staticState = {
        chart: null
    }

    /* styleMap = [
        {
            yAxisID: 'A',
            borderColor: "#C6C6C6",
            backgroundColor: "#C6C6C666",
            position: "left"
        },
        {
            yAxisID: 'B',
            borderColor: "#507AFF00",
            backgroundColor: "#507AFF",
            position: "right"
        }
    ]

    prepareData(data) {
        let datasets = []
        let yAxes = []

        data.forEach((v, idx) => {
            let ds = []
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
    } */

	componentDidMount() {
		const myChartRef = this.chartRef.current.getContext("2d");

        //let { datasets, yAxes } = this.prepareData(this.props.data)

        let d = []
        /* for(let i=0; i<20; i++) {
            d.push({
                x: Math.random() * 10 + 1,
                y: Math.random() * 10 + 1,
                name: 'name'
            })
        } */

        if(this.props.data) {
            d = this.props.data
        }
        
        this.staticState.chart = new Chart(myChartRef, {
            type: "scatter",
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: d,
                    pointBackgroundColor: "#507AFF",
                    pointBorderWidth: 0,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                legend: {
                    display:false
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            labelString: 'Power Plant Capacity',
                            display: true
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            labelString: 'Power Plant Energy Output (Today)',
                            display: true
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function(i, d) {
                            return d.datasets[i.datasetIndex].data[i.index].name
                        }
                    }
                }
            }
        });
	}

    componentDidUpdate() {
        this.staticState.chart.data.datasets[0].data = this.props.data
        this.staticState.chart.update()
    }

	render() {
		return(
			<canvas id="matrix" ref={this.chartRef}></canvas>
		)
	}
}

export default ScatterPlot