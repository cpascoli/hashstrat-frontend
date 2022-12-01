
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { makeStyles, Box, Typography, useTheme } from  "@material-ui/core"

import React from 'react';
import ReactDOM from 'react-dom';
import { VictoryPie } from 'victory';


const COLORS = ['#7ac1ff', '#ffa87d', '#45ffdc', '#F9D423', '#9187A2', '#CC527A', '#2F9599', '#45ADA8'];

const RADIAN = Math.PI / 180;

export type PieChartsData = {
    name: string;
    value: number;
}

export type ChartData = {
    title: string;
    data: PieChartsData[];
    width?: number
    height?: number
    includePercent?: boolean
}

  

export const VPieChart = ( chartData : ChartData ) => {

  const useStyle = makeStyles( theme => ({
    chart: {
        margin: "auto",
        minWidth: chartData.width ?? 240,
        border: `1px solid ${theme.palette.type === 'light' ?  theme.palette.grey[500] : "white" }`,
        paddingTop: 10
    }
  }))
  

  const data = chartData.data.map( (row, idx) => { return { x: row.name, y: row.value, idx: idx } } )

  const total = chartData.data.reduce( (acc, val) => {
    acc += val.value
    return acc
  }, 0)

  const classes = useStyle()
  const theme = useTheme()

  return (
      <Box className={classes.chart}>
          <Typography align='center' variant='body1'> {chartData.title} </Typography>
          <svg viewBox="0 0 400 400">
            <VictoryPie
              standalone={false}
              width={400} height={400}
              data={data}
              labels={ ({ datum }) => (datum.y / total) > 0.08 ?  `${datum.x} (${((datum.y / total) * 100).toFixed(0)}%)` : '' }

              style={{
                labels: { fontSize: 20, fontWeight: 500, fill: theme.palette.type === 'light' ? theme.palette.grey[800] : theme.palette.grey[100] },
                data: {
                  fill: ({ datum }) => datum && data[datum.idx] ? COLORS[ Number(datum.idx) % COLORS.length ] : 'white'
                }
              }}
              innerRadius={0} 
              // radius={150}
              labelRadius={40}
            />
          </svg>
      </Box>
    )
  }

