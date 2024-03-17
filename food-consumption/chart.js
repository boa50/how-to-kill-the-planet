import { bars } from "./bars.js"
import { images } from "./images.js"
import { labels } from "./labels.js"

export const createBarChart = (svg, prev) => {
    const updateBars = bars(svg, prev)
    const updateLabels = labels(svg, prev)
    const updateImages = images(svg, prev)

    return { updateBars, updateImages, updateLabels }
}

export const updateBarChart = (barChartFuncs, keyframe, transition, isLast) => {
    const { updateBars, updateImages, updateLabels } = barChartFuncs

    updateBars(keyframe, transition)
    updateLabels(keyframe, transition, isLast)
    updateImages(keyframe, transition)
}