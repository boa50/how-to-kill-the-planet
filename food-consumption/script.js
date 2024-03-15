import { svgWidth, svgHeight, margin, width, height, barPadding } from "./constants.js"
import { data_old as data, prepareData } from "./data.js"

const svg = d3
    .select('#chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

const chart = svg
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)


const { keyframes, prev, next } = prepareData(data)


const x = d3
    .scaleBand()
    .domain(data.map(d => d.food))
    .range([0, width])
    .padding(barPadding)

const y = d3
    .scaleLinear()
    .domain([0, 120])
    .range([height, 0])

chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(
        d3
            .axisBottom(x)
            .tickSizeOuter(0)
    )

chart
    .append('g')
    .call(
        d3
            .axisLeft(y)
            .tickSizeOuter(0)
            .ticks(5)
    )



chart
    .selectAll('.bars')
    .data(data)
    .join('rect')
    .attr('x', d => x(d.food))
    .attr('y', d => y(d.emissions))
    .attr('height', d => height - y(d.emissions))
    .attr('width', x.bandwidth())
    .attr('fill', '#F0B60F')