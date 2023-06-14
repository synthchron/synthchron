import { faker } from '@faker-js/faker'

import { XESLog } from '@synthchron/xes'

type LogAggregate = Map<string, number> //Map<Transition, Amount>

//Also pie chart
type DoughnutData = {
  label: string
  data: number[]
  backgroundColor: string[]
  hoverOffset: number
}

type DefaultData = {
  data: number[]
  borderColor: string
  backgroundColor: string
}

type Dataset = DoughnutData | DefaultData

type ChartData = {
  labels: string[]
  datasets: Dataset[]
}

export enum ChartType {
  Doughnut,
  Other,
}

// Maybe add 'string' last key, to highlight ending event with another color in statistics.
export const TransformToAggregate = (log: XESLog): LogAggregate[] => {
  const aggregate: LogAggregate[] = []
  log.traces.forEach((trace, index) => {
    aggregate[index] = new Map<string, number>()
    trace.events.forEach((event) => {
      event.attributes.forEach((attribute) => {
        const currentValue = aggregate[index].get(attribute.value) ?? 0
        aggregate[index].set(attribute.value, currentValue + 1)
      })
    })
  })

  return aggregate
}

export const AggregateToChartData = (
  aggArr: LogAggregate[],
  chartTypeV: ChartType
): ChartData => {
  //Might be nice if the data was sorted, so the line chart for example only goes downwards

  const labels = Array.from(
    new Set(aggArr.flatMap((aggregate) => Array.from(aggregate.keys())))
  )

  const averageMap = aggArr.reduce((result, map) => {
    map.forEach((value, key) => {
      result.set(key, (result.get(key) || 0) + value)
    })
    return result
  }, new Map())

  const totalEvents = Array.from(averageMap.values()).reduce(
    (sum, value) => sum + value,
    0
  )

  averageMap.forEach((value, key, map) => {
    map.set(key, value / totalEvents)
  })

  const datasetArr: Dataset[] = []

  const doughnutColors = Array.from({ length: labels.length }, () =>
    faker.color.rgb({ format: 'css' })
  )

  switch (chartTypeV) {
    case ChartType.Doughnut:
      // eslint-disable-next-line no-case-declarations
      const dataSetD: DoughnutData = {
        label: 'Trace ',
        data: Array.from(averageMap.values()).map((value) => value * 100),
        backgroundColor: doughnutColors,
        hoverOffset: 20,
      }
      datasetArr.push(dataSetD)
      break
    case ChartType.Other:
      // eslint-disable-next-line no-case-declarations
      const colorAsText = faker.color.rgb({ format: 'decimal' }).join(', ')

      // eslint-disable-next-line no-case-declarations
      const dataSet: DefaultData = {
        data: Array.from(averageMap.values()).map((value) => value * 100),
        borderColor: 'rgb(' + colorAsText + ')',
        backgroundColor: 'rgba(' + colorAsText + ', 0.5)',
      }

      datasetArr.push(dataSet)
      break
  }

  const chartdata: ChartData = {
    labels: labels,
    datasets: datasetArr,
  }

  return chartdata
}

export const AggregateToTable = (
  aggArr: LogAggregate[]
): Record<string, number> => {
  const resObj: Record<string, number> = {}

  aggArr.forEach((agg) => {
    agg.forEach((value, key) => {
      resObj[key] = (resObj[key] || 0) + value
    })
  })

  return resObj
}
