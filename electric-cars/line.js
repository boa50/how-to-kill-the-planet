export const svgWidth = 500
export const svgHeight = 600

export const margin = {
    left: 32,
    right: 32,
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

    // chart
    //     .append('g')
    //     .call(d3.axisTop(x))

    // chart
    //     .append('g')
    //     .call(d3.axisLeft(y))


    // Years lines
    drawLayoutLine(0, '2019')
    drawLayoutLine(width, '2022')


    // Data lines
    const electric = data.filter(d => d.type === 'electric')
    const nonElectric = data.filter(d => d.type === 'non-electric')

    chart
        .append('line')
        .attr('x1', x(electric[0].year))
        .attr('y1', y(electric[0].sold))
        .attr('x2', x(electric[1].year))
        .attr('y2', y(electric[1].sold))
        .style('stroke', 'brown')
        .style('stroke-width', 2)

    chart
        .append('line')
        .attr('x1', x(nonElectric[0].year))
        .attr('y1', y(nonElectric[0].sold))
        .attr('x2', x(nonElectric[1].year))
        .attr('y2', y(nonElectric[1].sold))
        .style('stroke', 'grey')
        .style('stroke-width', 2)
})