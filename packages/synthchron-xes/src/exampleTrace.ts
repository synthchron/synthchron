import { XESLog } from './types'

export const example: XESLog = {
  traces: [
    {
      events: [
        {
          attributes: [
            {
              key: 'name',
              value: 'Event 1',
            },
          ],
        },
        {
          attributes: [
            {
              key: 'name',
              value: 'Event 2',
            },
          ],
        },
      ],
    },
    {
      events: [
        {
          attributes: [
            {
              key: 'name',
              value: 'Event 3',
            },
          ],
        },
      ],
    },
  ],
}
