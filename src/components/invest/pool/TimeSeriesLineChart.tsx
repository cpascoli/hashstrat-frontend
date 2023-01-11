import moment from 'moment'

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
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


export const TimeSeriesLineChart = ( chartData  : ChartData ) => {

  const start = (chartData.data && chartData.data.length > 1) ? chartData.data[0].time : (new Date()).getTime() - 604800 * 1000
  const end =   (chartData.data && chartData.data.length > 1) ? chartData.data[chartData.data.length-1].time : (new Date()).getTime()

  return (
  <ResponsiveContainer width = '95%' height = {300} >
    <LineChart 
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          width={500}  height={300}
          data={chartData.data}
    >
      <CartesianGrid strokeDasharray="1 1" />

      <XAxis
        dataKey = 'time'
        domain = {[start, end]}
        name = 'Time'
        tickFormatter = {(unixTime) => moment(unixTime).format('yyyy-MM-DD')}
        type = 'number'
      />

      {/* <YAxis name = "Asset 1" type="number" domain={[0, 100]} yAxisId="left-axis" /> */}
      <YAxis name = "Asset % Chg" type="number"  yAxisId="right-axis" orientation="right" />

      <Legend verticalAlign="top" height={30}/>
      <Tooltip 
        labelFormatter={(unixTime) => moment(unixTime).format('yyyy-MM-DD hh:mm:ss')}
        // formatter={numberFormatter}
      />

      <Line
        type="linear"
        dataKey={chartData.label1}
        yAxisId="right-axis"
        stroke="#8884d8"
        fill="#8884d8"
      />

    <Line
        type="linear"
        dataKey={chartData.label2}
        yAxisId="right-axis"
        stroke="#82ca9d"
        fill="#82ca9d"
      />

    </LineChart>
  </ResponsiveContainer>
)}

