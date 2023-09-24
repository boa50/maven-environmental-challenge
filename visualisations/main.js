import { width, height, chart2Height } from "./constants.js"
import { chart1 } from "./chart1.js"
import { chart2 } from "./chart2.js"
import { chart3 } from "./chart3.js"

const getData = async () =>
    d3.csv('../dataset/apple_emissions/greenhouse_gas_emissions.csv')

const svgChart1 = d3
    .select('#chart1')
    .attr('width', width)
    .attr('height', height)

const svgChart2 = d3
    .select('#chart2')
    .attr('width', width)
    .attr('height', chart2Height)

const svgChart3 = d3
    .select('#chart3')
    .attr('width', width)
    .attr('height', height)

getData().then(data => {
    chart1(svgChart1, data)
    chart2(svgChart2, data)
    chart3(svgChart3, data)
})