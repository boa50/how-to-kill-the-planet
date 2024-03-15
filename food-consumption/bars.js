import { width, height, barPadding, n } from "./constants.js"

const getRank = (mapping, d) => (mapping.get(d) || d).rank
const getValue = (mapping, d) => (mapping.get(d) || d).value

export const x = d3
    .scaleBand()
    .domain(d3.range(n))
    .range([0, width])
    .padding(barPadding)

export const y = d3
    .scaleLinear()
    .domain([0, 120])
    .range([height, 0])


const bars = (svg, prev, next) => {
    let bar = svg
        .append('g')
        .attr('fill-opacity', 0.6)
        .selectAll('rect')

    return ([date, data], transition) => bar = bar
        .data(data.slice(0, n), d => d.name)
        .join(
            enter => enter
                .append('rect')
                .attr('fill', '#F0B60F')
                .attr('x', d => x(getRank(prev, d)))
                .attr('y', d => y(getValue(prev, d)))
                .attr('height', d => height - y(getValue(prev, d)))
                .attr('width', x.bandwidth()),
            update => update
        )
        .call(
            bar => bar
                .transition(transition)
                .attr('y', d => y(d.value))
                .attr('height', d => height - y(d.value))
        )
}


export const createBarChart = (svg, keyframes, prev, next) => {
    const updateBars = bars(svg, prev, next)
    // const updateLabels = labels(svg, prev, next)
    // const updateImages = images(svg, prev, next)

    return { updateBars }
}

export const updateBarChart = (barChartFuncs, keyframe, transition) => {
    const { updateBars } = barChartFuncs

    updateBars(keyframe, transition)
    // updateLabels(keyframe, transition)
    // updateImages(keyframe, transition)
}