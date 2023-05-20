import React from 'react'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'

interface TablePreviewProps {
  object: object
}

const toRow = (
  [key, value]: [string, unknown],
  prefix: string[] = []
): React.ReactNode | React.ReactNode[] => {
  if (key == null) return <></>

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return (
      <TableRow key={key}>
        <TableCell component='th' scope='row'>
          {[...prefix, key].join('/')}
        </TableCell>
        <TableCell align='right'>
          {typeof value === 'boolean' ? (
            value ? (
              'true'
            ) : (
              'false'
            )
          ) : value == null || value === '' ? (
            <div
              style={{
                fontStyle: 'italic',
                fontWeight: 'lighter',
              }}
            >
              null
            </div>
          ) : (
            value
          )}
        </TableCell>
      </TableRow>
    )
  }

  if (Array.isArray(value)) {
    const textValue = value.map((x) => JSON.stringify(x)).join(', ')
    return (
      <TableRow key={key}>
        <TableCell component='th' scope='row'>
          {[...prefix, key].join('/')}
        </TableCell>
        <TableCell align='right'>
          <Tooltip title={textValue}>
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '200px',
              }}
            >
              {textValue}
            </div>
          </Tooltip>
        </TableCell>
      </TableRow>
    )
  }

  if (typeof value === 'object' && value != null) {
    return Object.entries(value).flatMap((entry) =>
      toRow(entry, [...prefix, key])
    )
  }

  return <></>
}

export const TablePreview: React.FC<TablePreviewProps> = ({
  object: configuration,
}) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 20 }} aria-label='simple table'>
      <TableHead>
        <TableRow>
          <TableCell>Key</TableCell>
          <TableCell align='right'>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(configuration).flatMap((entry) => toRow(entry, []))}
      </TableBody>
    </Table>
  </TableContainer>
)
