import { svgWidth, svgHeight, colours } from "./constants.js"

const margin = {
    left: 48,
    right: 48,
    top: 48,
    bottom: 8
}
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom


const getData = async () =>
    Promise.all([
        d3.json('./data/population.json'),
        d3.json('./data/cars-sold.json')
    ])

const svg = d3
    .select('#population-vs-cars')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

const chart = svg
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)

const plotLine = (data, x, y, colour) => {
    const line = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.value))

    chart
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colour)
        .attr('stroke-width', 3)
        .attr('d', line)
}


getData().then(datasets => {
    const carsSold = []
    const years = [...new Set(
        datasets[1]
            .filter(d => d.year <= d3.max(datasets[0], d => d.year))
            .map(d => d.year)
    )]

    years.forEach(year => {
        const filtered = datasets[1].filter(d => d.year === year)
        const total = filtered.reduce((total, current) => total + current.sold, 0)

        carsSold.push({
            year: year,
            value: total * 1000000
        })
    })

    const population = datasets[0].map((d, i) => {
        if (datasets[0][i - 1] !== undefined) {
            return {
                year: d.year,
                value: d.population - datasets[0][i - 1].population
            }
        }
    }).filter(d => d !== undefined)


    const x = d3
        .scaleLinear()
        .domain(d3.extent(population, d => d.year))
        .range([0, width])
    chart
        .append('g')
        .call(
            d3
                .axisTop(x)
                .tickValues(years)
                .tickFormat(d3.format('d'))
        )

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(population, d => d.value) * 1.25])
        .range([height, 0])
    chart
        .append('g')
        .call(
            d3
                .axisLeft(y)
                .tickFormat(d3.format('.2s'))
                .tickSizeOuter(0)
        )


    plotLine(population, x, y, colours.lowAttention)
    plotLine(carsSold, x, y, colours.carsSold)

    const legend = chart
        .append('g')
        .attr('transform', `translate(-45, -30)`)

    legend
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-weight', 700)
        .attr('font-size', 14)
        .attr('fill', colours.carsSold)
        .text('Cars Sold')

    legend
        .append('text')
        .attr('x', 70)
        .attr('y', 0)
        .attr('fill', '#777777')
        .text('|')

    legend
        .append('text')
        .attr('x', 80)
        .attr('y', 0)
        .attr('font-weight', 700)
        .attr('font-size', 14)
        .attr('fill', colours.lowAttention)
        .text('Population Increase')
})