import { width, height, margin } from "./constants.js"
import { emissionsFormat, categoryFormat } from "./aux.js"

const prepareData = data => {
    let dataPrepared = data.filter(d => d.Type === 'Gross emissions')
    dataPrepared = d3.rollup(dataPrepared, d => d3.sum(d, v => v.Emissions), d => d.Category)
    dataPrepared = d3.map(dataPrepared, d => { return { 'Category': categoryFormat(d[0]), 'Emissions': d[1] } })

    return dataPrepared
}

export const chart1 = (svg, data) => {
    const dataPrepared = prepareData(data)

    const x = d3
        .scaleBand()
        .domain(d3.map(dataPrepared, d => d.Category))
        .range([margin.left, width - margin.right])
        .padding([0.2])
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(dataPrepared, d => d.Emissions) * 1.05])
        .range([height - margin.bottom, margin.top])
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).tickFormat(emissionsFormat))

    svg
        .selectAll('.bar')
        .data(dataPrepared)
        .join('rect')
        .attr('x', d => x(d.Category))
        .attr('y', d => y(d.Emissions))
        .attr('width', x.bandwidth())
        .attr('height', d => height - margin.bottom - y(d.Emissions))
        .attr('fill', 'steelblue')
}