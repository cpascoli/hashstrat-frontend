import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from 'recharts'


export interface TimeSeriesData {
    value: number;
    value2: number;
    time: number;
}

export interface ChartData {
    title: string;
    data: TimeSeriesData[];
    label1: string,
    label2: string
}


export const TimeSeriesAreaChart = ( chartData  : ChartData ) => {
  
  const start = (chartData.data && chartData.data.length > 1) ? chartData.data[0].time : (new Date()).getTime() - 604800 * 1000
  const end =   (chartData.data && chartData.data.length > 1) ? chartData.data[chartData.data.length-1].time : (new Date()).getTime()

  return (
  <ResponsiveContainer width = '95%' height = {300} >
    <AreaChart 
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          width={500}  height={300}
          data={chartData.data}
    >
      <XAxis
        dataKey = 'time'
        domain = {[start, end]}
        name = 'Time'
        tickFormatter = {(unixTime) => moment(unixTime).format('yyyy-MM-DD')}
        type = 'number'
      />

      <YAxis name = "Asset 1" scale="auto" id="asset1" />
      <YAxis name = "Asset 2" scale="auto" id="asset2"  />

      <Legend verticalAlign="top" height={30}/>
      <CartesianGrid strokeDasharray="1 1" />
      <Tooltip
        labelFormatter={(unixTime) => moment(unixTime).format('yyyy-MM-DD')}
      />

      <Area
        type="linear"
        dataKey={chartData.label1}
        stackId="1"
        stroke="#8884d8"
        fill="#8884d8"
      />

    <Area
        type="linear"
        dataKey={chartData.label2}
        stackId="1"
        stroke="#82ca9d"
        fill="#82ca9d"
      />

    </AreaChart>
  </ResponsiveContainer>
)}

