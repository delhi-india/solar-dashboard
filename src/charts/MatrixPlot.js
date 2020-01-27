import React ,{ Component } from 'react';
import Chart from 'chart.js'
import 'chartjs-chart-matrix'
import Color from 'chartjs-color'

//import './MatrixPlot.css'

class MatrixPlot extends Component {
    chartRef = React.createRef()
    daysConfig = 40
    staticState = {
        chart: null,
        data: []
    }
    
    days = ["", "Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", ""]

    constructor(props) {
        super(props)
        // console.log('const')
        // console.log(props.data)
        // console.log(this.staticState.data)
        for(let i=this.daysConfig; i >= 1; i--) {
            for(let j=1; j <= 7; j++) {
                this.staticState.data.push({
                    x: i,
                    y: j,
                    v: 0
                })
            }
        }
        
    }

    matrix() {
        let self = this
        

        const ref = this.chartRef.current.getContext("2d")
        this.staticState.chart = new Chart(ref, {
            type: 'matrix',
            data: {
                datasets: [{
                    data: this.staticState.data,
                    backgroundColor: function(ctx) {
                        var value = ctx.dataset.data[ctx.dataIndex].v;
                        if(value === 0) {
                            return Color("#cccccc44").rgbString()
                        }
                        var alpha = value / 10000
                        return Color('#507AFF').alpha(alpha).rgbString();
                    },
                    width: function(ctx) {
                        //var a = ctx.chart.chartArea;
                        return 20;
                    },
                    height: function(ctx) {
                        var a = ctx.chart.chartArea;
                        return (a.bottom - a.top)/8.1;
                    }
                }]
            },
            options: {
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                tooltips: {
                    callbacks: {
                        label: function(i, d) {
                            return 'Value: ' + d.datasets[i.datasetIndex].data[i.index].v.toFixed(2) + ' kWh'
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            callback: function(value, index, values) {
                                let d = new Date()
                                d.setDate(new Date().getDate() - self.daysConfig + value)
                                return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()
                            }
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            callback: function(value, index, values) {
                                return self.days[8-value]
                            },
                            suggestedMin: 0,
                            suggestedMax: 8,
                        },
                        gridLines: {
                            display: false,
                            tickMarkLength: 5
                        }
                    }]
                }
            }
        });
    }

	componentDidMount() {
		this.matrix()
        this.extractData()
	}

    componentDidUpdate() {
        // console.log('matrix')
        // console.log(this.props.data)
        this.extractData()
    }

    extractData() {
        if(this.props.data) {
            let data = this.props.data
            let l = data.length
            let empty = 6 - new Date(data[l-1]._id).getDay()
            let i = 0
            for(; i<empty; i++) {
                this.staticState.data[i]['v'] = 0
            }
            for(let j=0; j<l; j++) {
                this.staticState.data[i+j]['v'] = data[l-j-1].powerGeneratedTodayMaxSum
            }
            this.staticState.chart.update()
        }
    }

	render() {
		return(
			<canvas id="scatter-plot" ref={this.chartRef}></canvas>
		)
	}
}

export default MatrixPlot