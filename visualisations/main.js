import { width, height, chart2Height } from "./constants.js"
import { chart1 } from "./chart1.js"
import { chart2 } from "./chart2.js"

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

getData().then(data => {
    chart1(svgChart1, data)
    chart2(svgChart2, data)
})