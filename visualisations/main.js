import { width, height, margin } from "./constants.js"
import { chart1 } from "./chart1.js"

const getData = async () =>
    d3.csv('../dataset/apple_emissions/greenhouse_gas_emissions.csv')

const svgChart1 = d3
    .select('#chart1')
    .attr('width', width)
    .attr('height', height)

getData().then(data => {
    chart1(svgChart1, data)
})