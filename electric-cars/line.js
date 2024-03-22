export const svgWidth = 700
export const svgHeight = 600

export const margin = {
    left: 64,
    right: 64,
    top: 32,
    bottom: 8
}
export const width = svgWidth - margin.left - margin.right
export const height = svgHeight - margin.top - margin.bottom


const drawLayoutLine = (baseX, legend) => {
    chart
        .append('line')
        .attr('x1', baseX)
        .attr('y1', 0)
        .attr('x2', baseX)
        .attr('y2', height)
        .attr('stroke', 'grey')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 5')

    chart
        .append('text')
        .attr('x', baseX - 14)
        .attr('y', -10)
        .attr('fill', 'grey')
        .attr('font-size', 12)
        .text(legend)
}

const drawDataLine = (x, y, d1, d2, colour) => {
    chart
        .append('line')
        .attr('x1', x(d1.year))
        .attr('y1', y(d1.sold))
        .attr('x2', x(d2.year))
        .attr('y2', y(d2.sold))
        .style('stroke', colour)
        .style('stroke-width', 2)

    chart
        .append('text')
        .attr('x', x(d1.year) - d1.sold.toString().length * 9)
        .attr('y', y(d1.sold) + 4)
        .attr('fill', 'grey')
        .attr('font-size', 12)
        .text(d1.sold)

    chart
        .append('text')
        .attr('x', x(d2.year) + 7)
        .attr('y', y(d2.sold) + 4)
        .attr('fill', 'grey')
        .attr('font-size', 12)
        .text(d2.sold)

    chart
        .append('circle')
        .attr('cx', x(d1.year))
        .attr('cy', y(d1.sold))
        .attr('r', 3)
        .attr('fill', colour)

    chart
        .append('circle')
        .attr('cx', x(d2.year))
        .attr('cy', y(d2.sold))
        .attr('r', 3)
        .attr('fill', colour)
}


const getData = async () =>
    d3.json('./data.json')

const svg = d3
    .select('#chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

const chart = svg
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)

getData().then(data => {
    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.sold) * 1.05])
        .range([height, 0])


    // Years lines
    drawLayoutLine(0, '2019')
    drawLayoutLine(width, '2022')


    // Data lines
    const electric = data.filter(d => d.type === 'electric')
    const nonElectric = data.filter(d => d.type === 'non-electric')

    drawDataLine(x, y, electric[0], electric[1], 'brown')
    drawDataLine(x, y, nonElectric[0], nonElectric[1], 'grey')
})