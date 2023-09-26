import { margin, width, height } from "./constants.js"
import { emissionsFormat, expandAxis } from "./aux.js"

const prepareData = (greenhouseData, normalizingData) => {
    let dataPrepared = greenhouseData.filter(d => d.Category === 'Product life cycle emissions')

    dataPrepared = d3
        .nest()
        .key(d => d['Fiscal Year'])
        .rollup(d => d3.sum(d, v => v.Emissions))
        .entries(dataPrepared)
        .map(d => {
            return {
                emissions: d.value,
                revenue: normalizingData.filter(v => v['Fiscal Year'] === d.key)[0].Revenue
            }
        })

    return dataPrepared
}


export const chart5 = (svg, greenhouseData, normalizingData) => {
    const dataPrepared = prepareData(greenhouseData, normalizingData)

    const x = d3
        .scaleLinear()
        .domain(expandAxis(d3.extent(dataPrepared, d => d.revenue)))
        .range([margin.left, width - margin.right])
    svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(emissionsFormat))

    const y = d3
        .scaleLinear()
        .domain(expandAxis(d3.extent(dataPrepared, d => d.emissions)))
        .range([height - margin.bottom, margin.top])
    svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(emissionsFormat))

    svg
        .selectAll('.dot')
        .data(dataPrepared)
        .join('circle')
        .attr('cx', d => x(d.revenue))
        .attr('cy', d => y(d.emissions))
        .attr('r', 5)
        .style('fill', d3.schemeTableau10[3])
}