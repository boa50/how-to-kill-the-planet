const data = [
    {
        food: 'Chocolate',
        emissions: 47
    },
    {
        food: 'Beef',
        emissions: 99
    },
    {
        food: 'Sheep',
        emissions: 40
    }
]

const svgWidth = 600
const svgHeight = 500
const margin = {
    left: 64,
    right: 16,
    top: 16,
    bottom: 16
}
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom
const barSize = 20
const nElements = 3
const barPadding = 0.1

const svg = d3
    .select('#chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

const chart = svg
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)


const x = d3
    .scaleBand()
    .domain(data.map(d => d.food))
    .range([0, width])
    .padding(barPadding)

const y = d3
    .scaleLinear()
    .domain([0, 100])
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