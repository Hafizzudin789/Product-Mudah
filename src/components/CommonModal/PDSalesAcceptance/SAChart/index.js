import React from "react";
//const Chart = require('chart.js');
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

import "./SAChart.scss";

class SAChart extends React.Component {
    constructor(props) {
        super(props);
        this.data = [];
    }

    componentWillReceiveProps(nextProps) {
        this.data = this.initChart(nextProps.data);
    }

    initChart = (_data) => {
        let data = [];
        _data.forEach((entry) => {
            data.push({
                name: entry.monthYear.split(",")[0],
                "Your achievement": Math.round(entry.actual * 100.0) / 100.0,
                Target: Math.round(entry.budget * 100.0) / 100.0,
            });
        });
        return data;
    };
    /*  initChart = (data) => {
        let month = [];
        let actual = [];
        let budget = [];
        const ctx = this.ctx.getContext('2d');
        data.forEach((dt) => {
          month.push(dt.monthYear);
          budget.push(dt.budget.toFixed(2));
          actual.push(dt.actual.toFixed(2));
        });
        let _data = {
            labels: month,
            datasets: [{
                data: actual,
                label: 'Your Achievement',
                backgroundColor: '#6ccee6'
            },{
                data: budget,
                label: 'Target',
                backgroundColor: '#858585'
            }]
        };

        let options = {
            barValueSpacing: 20,
            responsive: true,
            scales: {
                xAxes: [{
                    barPercentage: 0.2
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        new Chart(ctx, {
            type: 'bar',
            data: _data,
            options: options,
            animationDuration: 2000
        });
    } */

    render() {
        return (
            <ResponsiveContainer width={600} height={400}>
                <ComposedChart data={this.data} margin={{ top: 15, right: 0, bottom: 20, left: 0 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Bar dataKey="Your achievement" barSize={20} fill="#6ccee6" />
                    <Line type="linear" dataKey="Target" stroke="#ef3e42" activeDot={{ r: 6 }} />
                </ComposedChart>
            </ResponsiveContainer>
        );
        // return (
        //      <canvas className="sa-chart" ref={(ctx) => { this.ctx = ctx; }}></canvas>
        // );
    }
}

export default SAChart;
