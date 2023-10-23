"use client"
import { Getdata } from "../components/functions/Getdata";
import { Postdata } from "../components/functions/Postdata";
import { Putdata } from "../components/functions/Putdata";
import { Alertas } from "../components/functions/helpers";
import Menu from "../components/menu/Menu"
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';


 const metadata = {
    title: 'Calendario',
    description: 'calendario',
  }

export default function Calendario(){    

    const inputNomCal = useRef(null);
    const inputNomSchoolday = useRef(null);
    const [loadcal, setLoadcal] = useState(true);
    const [fillcall, setFillcall] = useState('');
    const [fillschoolday, setFillschoolday] = useState('');
    const [loadschoolday, setLoadschoolday] = useState(true);
    const [btncal, setBtncal] = useState('Insertar');
    const [btnjor, setBtnjor] = useState('Insertar');

    useEffect(() => {
        loaddata()
        setLoadcal(false)
    }, [loadcal]);

    useEffect(() => {
        loaddataschoolday()
        setLoadschoolday(false)
    }, [loadschoolday]);

    const insertSchedule = () =>{
        const inpNomCal = inputNomCal.current.value.trim()
        if(!inpNomCal){
            Alertas('Información','El campo no puede estar vacío')
            return false
        }
        const datos = {
            name:inpNomCal,
            state:1
        }
        Postdata('calendario/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe el calendario')
                return false
            }else{
                Postdata('calendario/insert',datos).then((res) => {
                    if(res?.data?.acknowledged){
                        Alertas('Información', `Se inserto el calendario en el sistema`)
                        inputNomCal.current.value = ''
                        setLoadcal(true)
                    }else if(res?.data?.error){
                        Alertas('Información', res.data.error)
                        return false
                    }
                })
            }
          })
    }

    const loaddata = () =>{
        Getdata('calendario/select').then((info)=>{
            setFillcall( info.data.map(({id, name},x) =>{

                const calendariodelete = (id) =>{
                    const datos = {
                        id:id
                    }
                    Swal.fire({
                        title: `<strong>¿Desea eliminar: ${name}?</strong>`,
                        showDenyButton: false,
                        showCancelButton: true,
                        confirmButtonText:'Eliminar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#3085d6',
                        cancelButtonText:'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Putdata('calendario/delete',datos).then(res => {
                                if(res?.data?.matchedCount > 0 ){
                                    Alertas('Información',`Se eliminó el ${name} del sistema`)
                                    setLoadcal(true)
                                }
                            })
                        } 
                    })
                }


                return <li key={x} className="list-group-item d-flex border-0 align-items-center justify-content-center">
                            <div className="ms-2 me-auto ">
                                <i className="bi bi-arrow-right-circle ms-3">{name}</i>
                            </div>
                            <span><a onClick={() => calendariodelete(id)}><i className="bi bi-trash fs-4 px-2 text-danger"></i></a></span>
                            <span><a onClick={() => calendarioedit(info.data[x])}><i className="bi bi-pencil-square fs-4 px-2 text-success"></i></a></span>
                        </li>
            }))
        })   
    }

    const calendarioedit = ({id,name}) => {
        setBtncal("Actualizar")
        inputNomCal.current.value = name
        const div = document.getElementById("btncalchange")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btnedit.innerText = "Actualizar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { calendarioupdate(id) }

        const btncancel = document.createElement('button')
        btncancel.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btncancel.innerText = "Cancelar"
        btncancel.id = 'btn_cancel_sche'
        btncancel.name = 'btn_cancel_sche'
        btncancel.onclick = function() { calendariocancel() }

        div.appendChild(btnedit)
        div.appendChild(btncancel)

    }

    const calendariocancel = () => {
        const div = document.getElementById("btncalchange")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary my-3')
        btnedit.innerText = "Insertar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { insertSchedule() }
        div.appendChild(btnedit)
        setBtncal('Insertar')
        inputNomCal.current.value = ''
    }

    const calendarioupdate = (id) => {
        const value = inputNomCal.current.value.trim()
        if(!value){
            Alertas('Información','El campo no puede estar vacío')
            return false
        }
        const datos = {
            name: value,
            id:  id
        }

        Postdata('calendario/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe el calendario con ese nombre')
                return false
            }else{
                Putdata('calendario/edit',datos).then((res) => {
                    if(res?.data?.matchedCount > 0){
                        const div = document.getElementById("btncalchange")
                        div.innerHTML = ""

                        const btnedit = document.createElement('button')
                        btnedit.setAttribute('class', 'btn btn-primary my-3')
                        btnedit.innerText = "Insertar"
                        btnedit.id = 'btn_insert_sche'
                        btnedit.name = 'btn_insert_sche'
                        btnedit.onclick = function() { insertSchedule() }
                        div.appendChild(btnedit)
                        setBtncal('Insertar')
                        Alertas('Información', `Se actualizo el calendario en el sistema`)
                        inputNomCal.current.value = ''
                        setLoadcal(true)
                        
                    }else if(res?.data?.error){
                        Alertas('Información', res.data.error)
                        return false
                    }
                })
            }
        })
    }

    const insertSchoolday = () =>{
        const inpNonSchoolday = inputNomSchoolday.current.value.trim()
        if(!inpNonSchoolday){
            Alertas('Información','El campo no puede estar vacío')
            return false
        }

        const datos = {
            name:inpNonSchoolday,
            state:1
        }
        Postdata('jornada/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe la jornada')
                return false
            }else{
                Postdata('jornada/insert',datos).then((res) => {
                    if(res?.data?.acknowledged){
                        Alertas('Información', `Se inserto la jornada en el sistema`)
                        inputNomSchoolday.current.value = ''
                        setLoadschoolday(true)
                    }
                })
            }
          })
    }

    const loaddataschoolday = () =>{

        Getdata('jornada/select').then((info)=>{
            setFillschoolday( info.data.map(({id, name},x) =>{

                const jornadadelete = (id) =>{
                    const datos = {
                        id:id
                    }
                    Swal.fire({
                        title: `<strong>¿Desea eliminar: ${name}?</strong>`,
                        showDenyButton: false,
                        showCancelButton: true,
                        confirmButtonText:'Eliminar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#3085d6',
                        cancelButtonText:'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Putdata('jornada/delete',datos).then(res => {
                                if(res?.data?.matchedCount > 0 ){
                                    Alertas('Información',`Se eliminó la jornada ${name} del sistema`)
                                    setLoadschoolday(true)
                                }
                            })
                        } 
                    })
                }


                return <li key={x} className="list-group-item d-flex border-0 align-items-center justify-content-center">
                            <div className="ms-2 me-auto ">
                                <i className="bi bi-arrow-right-circle ms-3">{name}</i>
                            </div>
                            <span><a onClick={() => jornadadelete(id)}><i className="bi bi-trash fs-4 px-2 text-danger"></i></a></span>
                            <span><a onClick={() => jornadaedit(info.data[x])}><i className="bi bi-pencil-square fs-4 px-2 text-success"></i></a></span>
                        </li>
            }))
        })  
    }

    const jornadaedit = ({id,name}) => {
        setBtnjor("Actualizar")
        inputNomSchoolday.current.value = name
        const div = document.getElementById("btnjornada")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btnedit.innerText = "Actualizar"
        btnedit.id = 'btn_insert_jor'
        btnedit.name = 'btn_insert_jor'
        btnedit.onclick = function() { jornadaupdate(id) }

        const btncancel = document.createElement('button')
        btncancel.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btncancel.innerText = "Cancelar"
        btncancel.id = 'btn_cancel_sche'
        btncancel.name = 'btn_cancel_sche'
        btncancel.onclick = function() { jornadacancel() }

        div.appendChild(btnedit)
        div.appendChild(btncancel)

    }

    const jornadacancel = () => {
        const div = document.getElementById("btnjornada")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary my-3')
        btnedit.innerText = "Insertar"
        btnedit.id = 'btn_insert_jor'
        btnedit.name = 'btn_insert_jor'
        btnedit.onclick = function() { insertSchoolday() }
        div.appendChild(btnedit)
        setBtnjor('Insertar')
        inputNomSchoolday.current.value = ''
    }

    const jornadaupdate = (id) => {
        const value = inputNomSchoolday.current.value.trim()
        if(!value){
            Alertas('Información','El campo no puede estar vacío')
            return false
        }
        const datos = {
            name: value,
            id:  id
        }

        Postdata('jornada/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe la jornada con ese nombre')
                return false
            }else{
                Putdata('jornada/edit',datos).then((res) => {
                    if(res?.data?.matchedCount > 0){
                        const div = document.getElementById("btnjornada")
                        div.innerHTML = ""

                        const btnedit = document.createElement('button')
                        btnedit.setAttribute('class', 'btn btn-primary my-3')
                        btnedit.innerText = "Insertar"
                        btnedit.id = 'btn_insert_jor'
                        btnedit.name = 'btn_insert_jor'
                        btnedit.onclick = function() { insertSchoolday() }
                        div.appendChild(btnedit)
                        setBtnjor('Insertar')
                        Alertas('Información', `Se actualizo la jornada en el sistema`)
                        inputNomSchoolday.current.value = ''
                        setLoadschoolday(true)
                        
                    }else if(res?.data?.error){
                        Alertas('Información', res.data.error)
                        return false
                    }
                })
            }
        })
    }

    return(
        <main>
            <title>{'Calendario Jornada'}</title>
            <Menu flag='calendario' />
            <div className="container-fluid mt-5"> 
                <div className="row ">
                    <div className="col-sm-12 col-md-6 mb-2 ">
                        <div className="card h-100">
                            <h3 className="my-2 text-center">{btncal} calendario</h3>
                                <div className="row align-items-center justify-content-center">
                                    <label htmlFor="inputNomCal" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Nombre calendario</label>
                                    <div className="col-6">
                                        <input type="text" className="form-control border-primary" name='inputNomCal' id="inputNomCal"  ref={inputNomCal}/>
                                    </div>
                                </div>
                               <div className="text-center" id="btncalchange"> <button className='btn btn-primary my-3 ' name="btn_insert_sche" id="btn_insert_sche" onClick={insertSchedule}>Insertar</button></div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-2 ">
                        <div className="card h-100">
                            <h3 className="my-2 text-center">Calendarios</h3>
                            {fillcall != '' && <ul className="list-group border-0">
                                {fillcall}
                            </ul>}
                        </div>
                    </div>
                    {/* contenido jornada */}
                    <div className="col-sm-12 col-md-6 mb-2 ">
                        <div className="card h-100">
                            <h3 className="my-2 text-center">{btnjor} jornada</h3>
                                <div className="row align-items-center justify-content-center">
                                    <label htmlFor="inputNomSchoolday" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Nombre jornada</label>
                                    <div className="col-6">
                                        <input type="text" className="form-control border-primary" name='inputNomSchoolday' id="inputNomSchoolday"  ref={inputNomSchoolday}/>
                                    </div>
                                </div>
                               <div className="text-center" id="btnjornada"> <button className='btn btn-primary my-3 ' name="btn_insert_jor" id="btn_insert_jor" onClick={insertSchoolday}>Insertar</button></div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-2 ">
                        <div className="card h-100">
                            <h3 className="my-2 text-center">Jornadas</h3>
                            {fillschoolday != '' && <ul className="list-group border-0">
                                {fillschoolday}
                            </ul>}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )

}           