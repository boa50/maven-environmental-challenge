import { width, chart2Height as height, margin } from "./constants.js"
import { percentFormat, emissionsFormat, categoryFormat } from "./aux.js"

const prepareData = data => {
    let dataPrepared = data.filter(d =>
        d.Type === 'Gross emissions'
        && d['Fiscal Year'] === '2022'
    )
    dataPrepared = d3.rollup(dataPrepared, d => d3.sum(d, v => v.Emissions), d => d.Category)
    dataPrepared = d3.map(dataPrepared, d => { return { 'Category': categoryFormat(d[0]), 'Emissions': d[1] } })

    const percent = d3
        .scaleLinear()
        .domain([0, d3.sum(dataPrepared, d => d.Emissions)])
        .range([0, 1])

    let sum = 0
    dataPrepared = d3.map(dataPrepared, d => {
        const val = {
            value: d.Emissions,
            xPosition: sum,
            label: d.Category,
            percent: percent(d.Emissions)
        }
        sum += d.Emissions

        return val
    })

    return dataPrepared
}

export const chart2 = (svg, data) => {
    const dataPrepared = prepareData(data)

    const x = d3
        .scaleLinear()
        .domain([0, d3.sum(dataPrepared, d => d.value)])
        .range([margin.left, width - margin.right])

    const colours = d3
        .scaleOrdinal()
        .domain(d3.map(dataPrepared, d => d.label))
        .range(d3.schemeTableau10)

    svg
        .selectAll('.bar')
        .data(dataPrepared)
        .join('rect')
        .attr('x', d => x(d.xPosition))
        .attr('y', margin.top)
        .attr('width', d => x(d.value))
        .attr('height', height - margin.bottom)
        .attr('fill', d => colours(d.label))

    svg
        .selectAll('.value')
        .data(dataPrepared)
        .join('text')
        .attr('x', d => x(d.xPosition) + (x(d.value) / 2))
        .attr('y', height / 2)
        .text(d => emissionsFormat(d.value))
        .attr('text-anchor', 'middle')

    svg
        .selectAll('.percent')
        .data(dataPrepared)
        .join('text')
        .attr('x', d => x(d.xPosition) + (x(d.value) / 2))
        .attr('y', height / 4)
        .text(d => percentFormat(d.percent))
        .attr('text-anchor', 'middle')

    svg
        .selectAll('.label')
        .data(dataPrepared)
        .join('text')
        .attr('x', d => x(d.xPosition) + (x(d.value) / 2))
        .attr('y', (height / 2) + (height / 4))
        .text(d => d.label)
        .attr('text-anchor', 'middle')
}