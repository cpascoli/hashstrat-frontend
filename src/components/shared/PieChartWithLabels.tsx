
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { makeStyles, Box, Typography, useTheme } from  "@material-ui/core"


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

  
const useStyle = makeStyles( theme => ({
  chart: {
      margin: "auto",
      border: `1px solid ${theme.palette.type === 'light' ?  theme.palette.grey[500] : "white" }`,
      paddingTop: 10
  }
}))

export const PieChartWithLabels = ( chartData : ChartData ) => {

  const classes = useStyle()
  const theme = useTheme()

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index } : any ) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const symbol = chartData.data[index].name
  
    return (
      <text x={x} y={y}  dy={-4} 
          fill={theme.palette.type === 'light' ? theme.palette.grey[800] : "white" } 
          textAnchor= "middle"// {x > cx ? 'start' : 'end'} 
          dominantBaseline="central" >
        { chartData.includePercent ? `${symbol} ${(percent * 100).toFixed(0)}%` :  `${symbol}`  }
      </text>
    );
  };


  
  
  return (
      <Box className={classes.chart}>
        <Typography align='center' variant='body1'> {chartData.title} </Typography>

        <ResponsiveContainer width={chartData.width?? 220} height={chartData.height?? 220}>

        <PieChart width={chartData.width?? 220} height={chartData.height?? 220} 
                  style={{marginLeft: 10, marginRight: 10}} >
            <Pie
              data={chartData.data}
              cx="50%"
              cy="50%"  
              labelLine={false}
              // label={true}
              label={renderCustomizedLabel}
              innerRadius={0}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
          </ResponsiveContainer>
        </Box>
    )


  }

