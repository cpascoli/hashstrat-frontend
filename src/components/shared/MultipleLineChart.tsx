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

import { scaleLog } from 'd3-scale';

export interface TimeSeriesData {
    value: number;
    value2: number;
    time: number;
}

export interface ChartData {
    title: string;
    data: TimeSeriesData[];
    label1: string,
    label2?: string,
    label3?: string,
    label4?: string,
    yAxisRange: any
    scale: 'linear' | 'log'
}


export const MultipleLineChart = ( chartData  : ChartData ) => {

  const start = (chartData.data && chartData.data.length > 1) ? chartData.data[0].time : (new Date()).getTime() - 604800 * 1000
  const end =   (chartData.data && chartData.data.length > 1) ? chartData.data[chartData.data.length-1].time : (new Date()).getTime()

  return (
  <ResponsiveContainer width = '100%' height = {400} >
 
    <LineChart 
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
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

      <YAxis name = "Y Axis" 
        type="number" 
        yAxisId="right-axis"
        orientation="right" 
        // domain={[0, 'auto']}
        // scale={ scaleLog().base(Math.E) }
        scale={ chartData.scale === 'log' ? 'log' : 'linear' }
        domain={ chartData.yAxisRange ? chartData.yAxisRange  : ['auto', 'auto'] } 
      />

      <Legend verticalAlign="top" height={30}/>
      <Tooltip 
        labelFormatter={(unixTime) => moment(unixTime).format('yyyy-MM-DD')}
        // formatter={numberFormatter}
      />

      <Line
        type="linear"
        dataKey={chartData.label1}
        yAxisId="right-axis"
        stroke="#2364aa"
        fill="#2364aa"
        isAnimationActive={false}
        dot={false}
      />

    { chartData.label2 && 
      <Line
        type="linear"
        dataKey={chartData.label2}
        yAxisId="right-axis"
        stroke="#fb5607"
        fill="#fb5607"
        isAnimationActive={false}
        dot={false}
      />
    }

    { chartData.label3 && 
      <Line
        type="linear"
        dataKey={chartData.label3}
        yAxisId="right-axis"
        stroke="#98c1d9"
        fill="#98c1d9"
        isAnimationActive={false}
        dot={false}
      />
    }

    { chartData.label4 && 
      <Line
        type="linear"
        dataKey={chartData.label4}
        yAxisId="right-axis"
        stroke="#98c1d9"
        fill="#98c1d9"
        isAnimationActive={false}
        dot={false}
      />
    }

    </LineChart>
  </ResponsiveContainer>
)}

