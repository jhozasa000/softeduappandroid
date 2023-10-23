"use client"
import Swal from "sweetalert2";
import { Postdata } from "../components/functions/Postdata";
import { Putdata } from "../components/functions/Putdata";
import { Alertas, FirstletterUpper } from "../components/functions/helpers";
import Menu from "../components/menu/Menu"
import { useRef, useState , useEffect } from 'react';

const metadata = {
    title: 'Notas',
    description: 'Notas',
  }
let nuevoArray    = []
export default function Notas(){    

    const inputSearch = useRef(null)

    const inpE = useRef(null)
    const inpM = useRef(null)
    const inpP = useRef(null)
    const inpN = useRef(null)

    const [loaddatastu, setLoaddatastu] = useState(true);
    const [loadinfo , setLoadinfo ] = useState(false);
    const [loadselstu, setLoadselstu] = useState('');
    const [fillselperi, setFillselperi] = useState('');
    const [fillselmat, setFillselmat] = useState('');

    

    useEffect(() => {       
        setLoadinfo(false)
    },[loadinfo]);


    const loadNotes = (fillnotes,filldata,position) => {


        console.log('fillnotes   --  ', fillnotes);
        console.log('filldata   --  ', filldata);
        console.log('position   --  ', position);



            const cont = document.getElementById('fill');

            const tbl = document.createElement("table")
            const tblHead = document.createElement("thead")
            const trhead = document.createElement('tr')
            const tblBody = document.createElement("tbody")
            const quantity = 9

            let truser = document.createElement('tr')
            let thheaduser = document.createElement('th')
            thheaduser.colSpan = 6
            
            let cellText = document.createTextNode(`Estudiante: ${FirstletterUpper(filldata[position].name)} ${FirstletterUpper(filldata[position].lastname)}  Identifiacion: ${filldata[position].numberid}`);
            thheaduser.appendChild(cellText);
            truser.appendChild(thheaduser);

            tblHead.appendChild(truser)
            thheaduser = document.createElement('th')
            thheaduser.colSpan = 6
            
            cellText = document.createTextNode(`Información escolar: ${FirstletterUpper(filldata[position].namegra)} ${FirstletterUpper(filldata[position].namecal)} ${FirstletterUpper(filldata[position].namejor)}`);
            thheaduser.appendChild(cellText);
            truser.appendChild(thheaduser);
            tblHead.appendChild(truser)
            tbl.appendChild(tblHead)

            for(let f = 0;f < 12;f++){
                const thhead = document.createElement('th')
                thhead.setAttribute('class','text-center')
                let text = ''
                if(f === 0){
                    text = 'Asignatura'
                }else if(f === 1){
                    text = 'Periodo'
                }else if(f === 11){
                    text = 'Nota final'
                }else{
                    text = `Nota ${f -1}`
                }
                const cellText = document.createTextNode(text);
                thhead.appendChild(cellText);
                trhead.appendChild(thhead);
            }

            tblHead.appendChild(trhead)
            tbl.appendChild(tblHead)
        
        if(!fillnotes.length){
            let tbtr = ''
            tbtr = document.createElement('tr')
            let td = document.createElement('td')
            td.colSpan = 12
            td.classList.add('text-center')
            let cellTextmat = document.createTextNode('No hay asignaturas asociadas');
            td.appendChild(cellTextmat);
            tbtr.appendChild(td);
            tblBody.appendChild(tbtr)
        }else{

            fillnotes.map(({name,period,notas},x) => {
                
                let tbtr = ''
                tbtr = document.createElement('tr')
                let td = document.createElement('td')
                let cellTextmat = document.createTextNode(FirstletterUpper(name));
                td.appendChild(cellTextmat);
                tbtr.appendChild(td);

                td = document.createElement('td')
                td.setAttribute('class','text-center')
                cellTextmat = document.createTextNode(period);
                td.appendChild(cellTextmat);
                tbtr.appendChild(td);
                tblBody.appendChild(tbtr)

                const len = notas.length
                let pro = 0

                notas.map(({id,num}) => {
                    let td = document.createElement('td')
                    td.setAttribute('class','text-center')     
                    pro += parseFloat(num)
                    let inp = document.createElement('input')
                    inp.setAttribute("type", "number")
                    inp.setAttribute('id',`inputnoteup-${id}`)
                    inp.setAttribute('class','form-control form-control-sm border-primary')
                    inp.setAttribute("max", 100)
                    inp.setAttribute("min", 0.0)
                    inp.setAttribute("step", 0.0)
                //  inp.onkeyup = () => updatenote (id)
                    inp.onchange = () => updatenote (id)
                    inp.value = Number.parseFloat(num).toFixed(1)
                    td.appendChild(inp);
                    tbtr.appendChild(td);
                    tblBody.appendChild(tbtr)
                })

                for(let f = 0;f < (quantity - len);f++){
                    let td = document.createElement('td')
                    const cellText = document.createTextNode('');
                    td.appendChild(cellText);
                    tbtr.appendChild(td);
                }
                td = document.createElement('td')
                td.setAttribute('class','text-center')
    
                let proFinal = pro / len

                const cellText = document.createTextNode(proFinal.toFixed(1));
                td.appendChild(cellText);
                tbtr.appendChild(td);
            })
        }

        tbl.setAttribute('class', 'table table-bordered border-primary table-sm table-striped  ')
        tbl.appendChild(tblBody)
        cont.appendChild(tbl)
    }

    const updatenote = (id) => {
        const val = document.getElementById(`inputnoteup-${id}`).value.trim()
        const index = nuevoArray.map(object => object.id).indexOf(id);
        if(index !== -1){
            nuevoArray[index].num = val
        }else{	
            nuevoArray.push({id:id,num:val})
        }
    }

    const updatenotesdatabase = () => {
        const len = nuevoArray.filter(object => object.num == '' )
        const datos = {uptnotes:nuevoArray}
        if(nuevoArray.length === 0){
            Alertas('Informacióm','No hay notas para actualizar')
        }else if(len.length){
            Swal.fire({
                title: 'Informacióm',
                text: "Hay campos vacíos o mal digitados, desea continuar",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Actualizar'
              }).then((result) => {
                if (result.isConfirmed) {
                    Putdata('notas/edit',datos).then(res => {
                        if(res?.data?.matchedCount > 0){
                            Alertas('Información', `Se actualizaron las notas en el sistema`)
                            loaddatanotes()
                        }else if(res?.data?.error){
                            Alertas('Información', res.data.error)
                            return false
                        }
                   })
                }
              })
          //  Alertas('Informacióm','Validar notas ingresadas')
        }else{
            
            Putdata('notas/edit',datos).then(res => {
                if(res?.data?.matchedCount > 0){
                    Alertas('Información', `Se actualizaron las notas en el sistema`)
                    loaddatanotes()
                }else if(res?.data?.error){
                    Alertas('Información', res.data.error)
                    return false
                }
           })
        }

    }

    const findstudent = () =>{
        const val = inputSearch.current.value
        document.getElementById('fill').innerHTML = ''
        if(val.length >= 3){
            const datos = {
                datafind: val
            }

            const datperi = [1,2,3,4]
            setFillselperi(datperi.map((ele,x) => {
                return <option key={x+1} value={ele}>{ele}</option> 
            }))

            Postdata('notas/select',datos).then( info => {

                console.log('info....   ', info);


                setLoadselstu( info.data.map(({id, idstu, name,lastname},x) =>{
                    Postdata('notas/findnotes',{idstu:idstu}).then(respu => {
                        loadNotes(respu.data,info.data,x)
                    })  
                    return <option key={x+1} value={JSON.stringify(info.data[x])}>{name} {lastname}</option>
                }))
            })
        }
    }

    const loadsignature = (info) => {

        if(!info) return false
        const {idgra} = JSON.parse(info)

        const datos  = {
            idgra:idgra
        }
        Postdata('notas/findsignature',datos).then( info => {

            setFillselmat( info.data.map(({id, name},x) =>{
                return <option key={x+1} value={id}>{name} </option>
            }))

        })
    }

    const insert = () => {
        const idE = inpE.current.value  
        const idM = inpM.current.value
        const idP = inpP.current.value
        const idN = Number.parseFloat(inpN.current.value).toFixed(1)

        if(!idE || !idM || !idP || !idN){
            Alertas('Información','Validar campos obligatorios')
        }else{
            const {idstu} = JSON.parse(idE)
            const datos = {
                idstu:idstu,
                subject:idM,
                period:idP,
                note:idN,
            }

            Postdata('notas/insert',datos).then((res) => {
                if(res?.data?.acknowledged){
                    Alertas('Información', `Se inserto la nota en el sistema`)
                    loaddatanotes()
                }else if(res?.data?.error){
                    Alertas('Información', res.data.error)
                    return false
                }
            })
        }
    }

    const loaddatanotes = () => {
        nuevoArray = []
        const val = inputSearch.current.value
        const datos = {
                        datafind: val
                    }
        document.getElementById('fill').innerHTML = ''
        Postdata('notas/select',datos).then( info => {


                console.log('info    ', info);


                info.data.map(({idstu},x) => {
                Postdata('notas/findnotes',{idstu:idstu}).then(respu => {
                    loadNotes(respu.data,info.data,x)
                })  
            })
        })
    }

    return(
        <main>
            <title>{'Notas'}</title>
            <Menu flag='notas' />
            <div className="container-fluid mt-5"> 
                <div className="row">
                    <div className="col-sm-12  mb-2" >
                        <div className="card h-100">
                            
                            <div className="row align-items-center justify-content-center my-4">
                                <label htmlFor="inputSearch" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Buscar estudiante</label>
                                <div className="col-6">
                                    <input type="search" className="form-control border-primary" name='inputSearch' id="inputSearch"  ref={inputSearch} onChange={() => findstudent()}/>
                                </div>
                            </div>
                           {loadselstu &&  <div className="row mb-4">
                           <h3 className="my-2 text-center">Insertar nota</h3>
                                <div className="col-sm-12 col-md-3">
                                    <div className="form-floating">
                                        <select className="form-select border-primary" id="selstu" onChange={(e) => loadsignature(e.target.value)} ref={inpE}>
                                            <option key={0} value={''}>Selecciona estudiante</option>
                                            {loadselstu}
                                        </select>
                                        <label htmlFor="selstu">Estudiante</label>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3">
                                    <div className="form-floating">
                                        <select className="form-select border-primary" id="selmat"  ref={inpM}>
                                            <option key={0} value={''}>Selecciona materia</option>
                                            {fillselmat}
                                        </select>
                                        <label htmlFor="selmat">Materia</label>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3">
                                    <div className="form-floating">
                                        <select className="form-select border-primary" id="selper" ref={inpP}>
                                            <option key={0} value={''}>Selecciona periodo</option>
                                            {fillselperi}
                                        </select>
                                        <label htmlFor="selper">Periodo</label>
                                    </div>
                                </div>
                                
                                <div className="col-sm-12 col-md-3">
                                    <div className="form-floating">
                                        <input type="number" id="inpnot" name="inpnot" className="form-control border-primary" ref={inpN}/>
                                        <label htmlFor="inpnot">Nota</label>
                                    </div>
                                </div>
                            <div className="text-center" id="btnprochange"> <button className='btn btn-primary my-3 ' onClick={insert}>Insertar</button></div>

                            </div> } 
                        </div>
                    </div>

                    <div className="col-sm-12  mb-2">
                        <div className="card h-100">
                            <h3 className="my-2 text-center">Información estudiante y notas</h3>
                                <div className="container-fluid mt-2"> 
                                    <div className="text-center align-items-center justify-content-center">
                                        <button className='btn btn-primary my-3 ' onClick={updatenotesdatabase}>Actualizar</button>
                                    </div>
                                    <div id="fill" className="table-responsive"></div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )

}           