import { faker } from '@faker-js/faker'

import { XESLog } from '@synthchron/xes'

type logAggregate = Map<string, number> //Map<key, value>

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

type chartData = {
  labels: string[]
  datasets: (doughnotData | defualtData)[]
}

export enum chartType {
  Doughnot,
  Other,
}

//REMOVE EXPORT
// Should perhaps return a logAggregate[] with an aggregate per XESLog[],
// in this way we can have more datasets for our charts
export const TransformToAggregate = (log: XESLog): logAggregate => {
  const aggregate: logAggregate = new Map<string, number>() //logAggregate
  log.traces.map((trace) =>
    trace.events.map((event) =>
      event.attributes.map((attribute) =>
        aggregate.set(
          attribute.value,
          (aggregate.get(attribute.value) ?? 0) + 1
        )
      )
    )
  )
  return aggregate
}

export const AggregateToData = (
  agg: logAggregate,
  chartTypeV: chartType
): chartData => {
  //Might be nice if the data was sorted here
  const labels = Array.from(agg.keys())

  let chartdata: chartData

  switch (chartTypeV) {
    case chartType.Doughnot:
      // eslint-disable-next-line no-case-declarations
      const colorAsTextD = [
        faker.color.rgb({ format: 'css' }),
        faker.color.rgb({ format: 'css' }),
        faker.color.rgb({ format: 'css' }),
      ]

      // eslint-disable-next-line no-case-declarations
      const dataSetD: doughnotData = {
        label: 'Dataset 1', //Find way to make meaning full labels
        data: Array.from(agg.values()),
        backgroundColor: colorAsTextD,
        hoverOffset: 20,
      }

      chartdata = {
        labels: labels,
        datasets: [dataSetD],
      }
      break
    case chartType.Other:
      // eslint-disable-next-line no-case-declarations
      const colorAsText = faker.color.rgb({ format: 'decimal' }).join(', ')
      // eslint-disable-next-line no-case-declarations
      const dataSet: defualtData = {
        label: 'Dataset 1', //Find way to make meaning full labels
        data: Array.from(agg.values()),
        borderColor: 'rgb(' + colorAsText + ')',
        backgroundColor: 'rgba(' + colorAsText + ', 0.5)',
      }
      chartdata = {
        labels: labels,
        datasets: [dataSet],
      }
      break
  }

  return chartdata
}
