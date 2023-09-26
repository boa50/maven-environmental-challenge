export const percentFormat = d3.format('.2%')
export const emissionsFormat = d3.format('.2s')
export const categoryFormat = c => c.replace(' emissions', '')

export const expandAxis = (limits, percent) => {
    const percentFactor = percent ? percent : 0.05
    const multFactor = [1 - percentFactor, 1 + percentFactor]

    return limits.map((element, index) => {
        return element * multFactor[index]
    })
}