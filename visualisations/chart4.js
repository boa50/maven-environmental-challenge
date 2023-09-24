import { height, margin, width } from "./constants.js"
import { emissionsFormat } from "./aux.js"

const prepareData = data => {
    let dataPrepared = data.filter(d => d.Category === 'Product life cycle emissions')

    dataPrepared = d3
        .nest()
        .key(d => d['Fiscal Year'])
        .rollup(d => d3.sum(d, v => v.Emissions))
        .entries(dataPrepared)
        .map(d => {
            return {
                year: new Date(d.key, 0, 1),
                emissions: d.value
            }
        })

    return dataPrepared
}

export const chart4 = (svg, data) => {
    const dataPrepared = prepareData(data)

    const x = d3
        .scaleTime()
        .domain(d3.extent(dataPrepared, d => d.year))
        .range([margin.left, width - margin.right])
    svg
        .append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x))

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(dataPrepared, d => d.emissions) * 1.05])
        .range([height - margin.bottom, margin.top])
    svg
        .append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).tickFormat(emissionsFormat))

    const lineGenerator = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.emissions))

    svg
        .selectAll('.line')
        // .append('path')
        // .datum(dataPrepared)
        .data([dataPrepared])
        .join('path')
        .attr('d', lineGenerator)
        .attr('stroke', d3.schemeTableau10[3])
        .style('fill', 'none')
        .attr('stroke-width', 2)
}