import { faker } from '@faker-js/faker'

import { XESLog } from '@synthchron/xes'

type logAggregate = Map<string, number> //Map<key, value>

//Also bar and pie chart
type doughnotData = {
  label: string
  data: number[]
  backgroundColor: string[]
  hoverOffset: number
}

type defualtData = {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
}

type dataset = doughnotData | defualtData

type chartData = {
  labels: string[]
  datasets: dataset[]
}

export enum chartType {
  Doughnot,
  Other,
}

//REMOVE EXPORT
// Maybe add 'string' last key, to highlight ending event with another color in statistics.
export const TransformToAggregate = (log: XESLog): logAggregate[] => {
  const aggregate: logAggregate[] = []
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
  aggArr: logAggregate[],
  chartTypeV: chartType
): chartData => {
  //Might be nice if the data was sorted, so the line chart for example only goes downwards

  const labels = Array.from(
    new Set(aggArr.flatMap((aggregate) => Array.from(aggregate.keys())))
  )

  const datasetArr: dataset[] = []

  aggArr.forEach((agg, index) => {
    switch (chartTypeV) {
      case chartType.Doughnot:
        // eslint-disable-next-line no-case-declarations
        const colorAsTextD = Array.from({ length: agg.size }, () =>
          faker.color.rgb({ format: 'css' })
        )

        // eslint-disable-next-line no-case-declarations
        const dataSetD: doughnotData = {
          label: 'Dataset ' + index,
          data: Array.from(agg.values()),
          backgroundColor: colorAsTextD,
          hoverOffset: 20,
        }

        datasetArr.push(dataSetD)
        break
      case chartType.Other:
        // eslint-disable-next-line no-case-declarations
        const colorAsText = faker.color.rgb({ format: 'decimal' }).join(', ')

        // eslint-disable-next-line no-case-declarations
        const dataSet: defualtData = {
          label: 'Dataset ' + index,
          data: Array.from(agg.values()),
          borderColor: 'rgb(' + colorAsText + ')',
          backgroundColor: 'rgba(' + colorAsText + ', 0.5)',
        }

        datasetArr.push(dataSet)
        break
    }
  })

  const chartdata: chartData = {
    labels: labels,
    datasets: datasetArr,
  }

  return chartdata
}

export const aggregateToTable = (
  aggArr: logAggregate[]
): Record<string, number> => {
  const resObj: Record<string, number> = {}

  aggArr.forEach((agg) => {
    agg.forEach((value, key) => {
      resObj[key] = value
    })
  })

  return resObj
}
