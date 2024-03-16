import { bars } from "./bars.js"
import { images } from "./images.js"

export const createBarChart = (svg, prev, next) => {
    const updateBars = bars(svg, prev, next)
    // const updateLabels = labels(svg, prev, next)
    const updateImages = images(svg, prev, next)

    return { updateBars, updateImages }
}

export const updateBarChart = (barChartFuncs, keyframe, transition) => {
    const { updateBars, updateImages } = barChartFuncs

    updateBars(keyframe, transition)
    // updateLabels(keyframe, transition)
    updateImages(keyframe, transition)
}