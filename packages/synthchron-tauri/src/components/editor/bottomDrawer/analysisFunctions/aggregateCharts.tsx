import { faker } from '@faker-js/faker'

import { XESLog } from '@synthchron/xes'

type LogAggregate = Map<string, number> //Map<key, value>

//Also bar and pie chart
type DoughnutData = {
  label: string
  data: number[]
  backgroundColor: string[]
  hoverOffset: number
}

type DefaultData = {
  label: string
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

export const AggregateToData = (
  aggArr: LogAggregate[],
  chartTypeV: ChartType
): ChartData => {
  //Might be nice if the data was sorted, so the line chart for example only goes downwards

  const labels = Array.from(
    new Set(aggArr.flatMap((aggregate) => Array.from(aggregate.keys())))
  )

  const datasetArr: Dataset[] = []

  const doughnutColors = Array.from({ length: labels.length }, () =>
    faker.color.rgb({ format: 'css' })
  )

  aggArr.forEach((agg, index) => {
    switch (chartTypeV) {
      case ChartType.Doughnut:
        // eslint-disable-next-line no-case-declarations
        const dataSetD: DoughnutData = {
          label: 'Trace ' + index,
          data: Array.from(agg.values()),
          backgroundColor: doughnutColors,
          hoverOffset: 20,
        }
        console.log(dataSetD)

        datasetArr.push(dataSetD)
        break
      case ChartType.Other:
        // eslint-disable-next-line no-case-declarations
        const colorAsText = faker.color.rgb({ format: 'decimal' }).join(', ')

        // eslint-disable-next-line no-case-declarations
        const dataSet: DefaultData = {
          label: 'Trace ' + index,
          data: Array.from(agg.values()),
          borderColor: 'rgb(' + colorAsText + ')',
          backgroundColor: 'rgba(' + colorAsText + ', 0.5)',
        }

        datasetArr.push(dataSet)
        break
    }
  })

  const chartdata: ChartData = {
    labels: labels,
    datasets: datasetArr,
  }

  return chartdata
}

export const aggregateToTable = (
  aggArr: LogAggregate[]
): Record<string, number> => {
  const resObj: Record<string, number> = {}

  aggArr.forEach((agg) => {
    agg.forEach((value, key) => {
      resObj[key] = value
    })
  })

  return resObj
}
