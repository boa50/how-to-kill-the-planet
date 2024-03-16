import { x, y, getRank, getValue } from "./aux.js"

export const images = (svg, prev) => {
    let img = svg
        .append('g')
        .selectAll('image')

    return ([, data], transition) => img = img
        .data(data, d => d.name)
        .join(
            enter => enter
                .append('image')
                .style('visibility', 'hidden')
                .attr('xlink:href', d => `./img/${d.name}.png`)
                .attr('x', d => x(getRank(prev, d)) + x.bandwidth() / 4)
                .attr('y', d => y(getValue(prev, d)) - 60)
                .attr('height', 60),
            update => update
        )
        .call(
            img => img
                .transition(transition)
                .attr('y', d => y(d.value) - 60)
                .style('visibility', d => d.value > 0 ? 'visible' : 'hidden')
        )
}