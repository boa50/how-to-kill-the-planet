import { height } from "./constants.js"
import { x, y, getRank } from "./aux.js"

export const labels = (svg, prev) => {
    let label = svg
        .append('g')
        .style('font-size', '1.15em')
        .attr('fill', '#030118')
        .attr('text-anchor', 'middle')
        .selectAll('text')

    return ([, data], transition, isLast) => label = label
        .data(data, d => d.name)
        .join(
            enter => enter
                .append('text')
                .style('visibility', 'hidden')
                .attr('x', d => x(getRank(prev, d)) + x.bandwidth() / 2)
                .attr('y', height - 12),
            update => update
        )
        .call(
            img => img
                .transition(transition)
                .attr('y', d => y(d.value) + 24)
                .text(d => `${d.value} kgCO₂`)
                .style('visibility', isLast ? 'visible' : 'hidden')
        )
}