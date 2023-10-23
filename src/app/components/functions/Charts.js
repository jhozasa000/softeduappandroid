"use client"
import { Chart } from "chart.js";
import * as Chartjs from "chart.js";
import { Bar } from 'react-chartjs-2';
import { Postdata } from "./Postdata";
import { Getdata } from "./Getdata";


const Barcharts = () => {
  let nuevoArray    = []
  let arrayTemporal = []

  const data = {
    labels: [],
    datasets: [{
      label: 'Bajo',
      data: [0,0,0,0], //[trimestre 1,trimestre 2, trimestre 3, trimestre 4]
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth:2,
      
    },{
        label: 'Medio',
        data: [0,0,0,0],
        backgroundColor: [
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth:2,
        
      },
      {
        label: 'Alto',
        data: [0,0,0,0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth:2,
        
      }],
    
  }

const controllers = Object.values(Chartjs).filter(
  (chart) => chart.id !== undefined
);
Chart.register(...controllers);


  Getdata('notas/loadnotescharts').then(respu => {
    const ele = respu.data
    ele.map(({period, notas, idstu}) =>{
      arrayTemporal = nuevoArray.filter(resp => resp.period == period  && resp.idstu == idstu)
      let sum = 0; 
      let len = notas.length ;
      let sumPro = 0
      notas.map(({num}) => {
        sum += parseFloat(num)
      })
      sumPro = sum / len
        if(arrayTemporal.length > 0){
          nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["notas"].push(sumPro.toFixed(1))
        }else{
          nuevoArray.push({'idstu':idstu,'period':period,'notas':[sumPro.toFixed(1)]})
          if(data.labels.indexOf(`Período ${period}`) == -1){
            data.labels.push(`Período ${period}`)
          }
        }
    })


    nuevoArray.map(({period,notas}) =>{
        console.log('period    ', period);
        let pro = 0
        let len = notas.length
        notas.map((num) => {
          pro += parseFloat(num)
        })

        let proFinal = (pro / len).toFixed(1)
        if(proFinal < 3){
          data.datasets[0].data[period-1] += 1
        }else if(proFinal >=3 && proFinal < 4){
          data.datasets[1].data[period-1] += 1
        }else{
          data.datasets[2].data[period-1] += 1
        }
    })
    

  })  
    return  <Bar
                data={data}
                width={700}
                height={150}
                options={{
                    maintainAspectRatio: false
                }}
            />
}  

export {Barcharts}