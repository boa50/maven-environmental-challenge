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
        .domain([d3.min(dataPrepared, d => d.year), new Date(2030, 0, 1)])
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

    const regressionData = [
        { year: dataPrepared[dataPrepared.length - 1].year, emissions: dataPrepared[dataPrepared.length - 1].emissions },
        { year: new Date(2030, 0, 1), emissions: dataPrepared[dataPrepared.length - 1].emissions * 0.25 }
    ]

    const linearRegression = d3
        .regressionLinear()
        .x(d => d.year)
        .y(d => d.emissions)
        .domain(d3.extent(regressionData, d => d.year))

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

    svg
        .append('line')
        .datum(linearRegression(regressionData))
        .attr("x1", d => x(d[0][0]))
        .attr("x2", d => x(d[1][0]))
        .attr("y1", d => y(d[0][1]))
        .attr("y2", d => y(d[1][1]))
        .attr('stroke', d3.schemeTableau10[6])
        .attr('stroke-width', 2)
        .style('stroke-dasharray', ('7,7'))
}