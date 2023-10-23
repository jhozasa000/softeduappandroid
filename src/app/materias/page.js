"use client"
import { Getdata } from "../components/functions/Getdata";
import { Postdata } from "../components/functions/Postdata";
import { Putdata } from "../components/functions/Putdata";
import { Alertas } from "../components/functions/helpers";
import Menu from "../components/menu/Menu"
import { useEffect, useRef, useState } from 'react';
import  Swal  from 'sweetalert2';

const metadata = {
    title: 'Materias',
    description: 'Materias',
  }

export default function Materias(){    

    const inputNomCourse = useRef(null);
    const inpCl = useRef(null)
    const inpGra = useRef(null)
    const inpTeac = useRef(null)
    const [loadsubject, setLoadsubject] = useState(true);
    const [fillcor, setFillcor] = useState('');
    const [fillcl, setFillcl] = useState('');
    const [fillpro, setFillpro] = useState('');
    const [filltea, setFilltea] = useState('');
    const [fillrela, setFillrela] = useState('');
    const [loadrela, setLoadrela] = useState(true);
    const [btnpro, setBtnpro] = useState('Insertar');


    useEffect(() => {
        setLoadsubject(false)
        loaddata()
        filldatarelationship()
    }, [loadsubject]);

    useEffect(() => {
        setLoadrela(false)
        loadrel()
    }, [loadrela]);

    const insertCourse = () =>{
        const inpNomPro = inputNomCourse.current.value.trim()
        if(!inpNomPro){
            Alertas('Información','El campo no puede estar vacío')
            return false
        }
        const datos = {
            name:inpNomPro,
        }
        Postdata('materias/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe la materias')
                return false
            }else{
                Postdata('materias/insert',datos).then((res) => {
                    if(res?.data?.acknowledged){
                        Alertas('Información', `Se inserto la materias en el sistema`)
                        inputNomCourse.current.value = ''
                        setLoadsubject(true)
                    }else if(res?.data?.error){
                        Alertas('Información', res.data.error)
                        return false
                    }
                })
            }
          })
    }
    const loaddata = () =>{
        Getdata('materias/select').then((info)=>{
            setFillcor( info.data.map(({id, name},x) =>{

                const materiasdelete = (id) =>{
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
                            Putdata('materias/delete',datos).then(res => {
                                if(res?.data?.matchedCount > 0 ){
                                    Alertas('Información',`Se eliminó la ${name} del sistema`)
                                    setLoadsubject(true)
                                }
                            })
                        } 
                    })
                }


                return <li key={x} className="list-group-item d-flex border-0 align-items-center justify-content-center">
                            <div className="ms-2 me-auto ">
                                <i className="bi bi-arrow-right-circle ms-3">{name}</i>
                            </div>
                            <span><a onClick={() => materiasdelete(id)}><i className="bi bi-trash fs-4 px-2 text-danger"></i></a></span>
                            <span><a onClick={() => materiasedit(info.data[x])}><i className="bi bi-pencil-square fs-4 px-2 text-success"></i></a></span>
                        </li>
            }))
        })   
    }

    const materiasedit = ({id,name}) => {
        setBtnpro("Actualizar")
        inputNomCourse.current.value = name
        const div = document.getElementById("btncoursechange")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btnedit.innerText = "Actualizar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { materiasupdate(id) }

        const btncancel = document.createElement('button')
        btncancel.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btncancel.innerText = "Cancelar"
        btncancel.id = 'btn_cancel_sche'
        btncancel.name = 'btn_cancel_sche'
        btncancel.onclick = function() { materiascancel() }

        div.appendChild(btnedit)
        div.appendChild(btncancel)

    }

    const materiascancel = () => {
        const div = document.getElementById("btncoursechange")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary my-3')
        btnedit.innerText = "Insertar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { insertCourse() }
        div.appendChild(btnedit)
        setBtnpro('Insertar')
        inputNomCourse.current.value = ''
    }

    const materiasupdate = (id) => {
        const value = inputNomCourse.current.value.trim()
        if(!value){
            Alertas('Información','El campo no puede estar vacío')
            return false
        }
        const datos = {
            name: value,
            id:  id
        }

        Postdata('materias/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe el materias con ese nombre')
                return false
            }else{
                Putdata('materias/edit',datos).then((res) => {
                    if(res?.data?.matchedCount > 0){
                        const div = document.getElementById("btncoursechange")
                        div.innerHTML = ""

                        const btnedit = document.createElement('button')
                        btnedit.setAttribute('class', 'btn btn-primary my-3')
                        btnedit.innerText = "Insertar"
                        btnedit.id = 'btn_insert_sche'
                        btnedit.name = 'btn_insert_sche'
                        btnedit.onclick = function() { insertCourse() }
                        div.appendChild(btnedit)
                        setBtnpro('Insertar')
                        Alertas('Información', `Se actualizo la materias en el sistema`)
                        inputNomCourse.current.value = ''
                        setLoadsubject(true)
                        
                    }else if(res?.data?.error){
                        Alertas('Información', res.data.error)
                        return false
                    }
                })
            }
        })
    }


    const filldatarelationship = () => {
        Getdata('materias/select').then((info)=>{
            setFillcl( info.data.map(({id, name},x) =>{
                return <option key={x+1} value={id}>{name}</option>
            }))
        })
        Getdata('grados/select').then((info)=>{
            setFillpro( info.data.map(({id, namegra,namecal,namejor},x) =>{
                return <option key={x+1} value={id}>{namegra +' - '+ namecal  +' - '+ namejor}</option>
            }))
        })
        Getdata('docentes/select').then((info)=>{
            setFilltea( info.data.map(({id,name,numberid,profession},x) =>{
                return <option key={x+1} value={id}>{name +' - '+ numberid +' - '+ profession}</option>
            }))
        })
        
    }

    const insertRelationship = () =>{
        const inpmD = inpCl.current.value
        const inpgD = inpGra.current.value
        const inpdD = inpTeac.current.value

        if(!inpmD || !inpgD || !inpdD){
            Alertas('Información','Los campos no pueden estar vacíos')
            return false
        }

        const datos = {
            idm:inpmD,
            idg:inpgD,
            idd:inpdD,
        }

        Postdata('materiasrelacion/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe la relación')
                return false
            }else{
                Postdata('materiasrelacion/insert',datos).then((res) => {
                    if(res?.data?.acknowledged){
                        Alertas('Información', `Se inserto la relación en el sistema`)
                        inpCl.current.value = ''
                        inpGra.current.value = ''
                        inpTeac.current.value = ''
                        setLoadrela(true)
                    }else if(res?.data?.error){
                        Alertas('Información', res.data.error)
                        return false
                    }
                })
            }
          })
    }

    const loadrel = () =>{
        Getdata('materiasrelacion/select').then((info)=>{
            setFillrela( info.data.map(({id, namemat,namegra,namedoc,namepro,namecal,namejor,numberid},x) =>{

                const materiasrelaciondelete = (id) =>{
                    const datos = {
                        id:id
                    }
                    Swal.fire({
                        title: `<strong>¿Desea eliminar: ${namemat}?</strong>`,
                        showDenyButton: false,
                        showCancelButton: true,
                        confirmButtonText:'Eliminar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#3085d6',
                        cancelButtonText:'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Putdata('materiasrelacion/delete',datos).then(res => {
                                if(res?.data?.matchedCount > 0 ){
                                    Alertas('Información',`Se eliminó la ${namemat} del sistema`)
                                    setLoadrela(true)
                                }
                            })
                        } 
                    })
                }


                return <li key={x} className="list-group-item d-flex border-0 align-items-center justify-content-center">
                            <div className="ms-2 me-auto ">
                                <div className='text-primary fw-bold'>{namegra} {namecal} {namejor} - {namedoc} {numberid} {namepro}</div>
                                <i className="bi bi-arrow-right-circle ms-3">{namemat}</i>
                            </div>
                            <span><a onClick={() => materiasrelaciondelete(id)}><i className="bi bi-trash fs-4 px-2 text-danger"></i></a></span>
                            <span><a onClick={() => materiasrelacionedit(info.data[x])}><i className="bi bi-pencil-square fs-4 px-2 text-success"></i></a></span>
                        </li>
            }))
        })   
    }

    const materiasrelacionedit = ({id, idm,idg,idd}) => {

        console.log('id si llega ', id);
        inpCl.current.value =  idm
        inpGra.current.value = idg
        inpTeac.current.value = idd
        const div = document.getElementById("btnrelchange")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btnedit.innerText = "Actualizar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { materiasrelacionupdate(id) }

        const btncancel = document.createElement('button')
        btncancel.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btncancel.innerText = "Cancelar"
        btncancel.id = 'btn_cancel_sche'
        btncancel.name = 'btn_cancel_sche'
        btncancel.onclick = function() { materiasrelacioncancel() }

        div.appendChild(btnedit)
        div.appendChild(btncancel)

    }

    const materiasrelacioncancel = () => {
        const div = document.getElementById("btnrelchange")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary my-3')
        btnedit.innerText = "Insertar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { insertRelationship() }
        div.appendChild(btnedit)
        inpCl.current.value = ''
        inpGra.current.value = ''
        inpTeac.current.value = ''
    }

    const materiasrelacionupdate = (id) => {
        const inpmD = inpCl.current.value
        const inpgD = inpGra.current.value
        const inpdD = inpTeac.current.value
       
        if(!inpmD || !inpgD || !inpdD){
            Alertas('Información','Los campos no pueden estar vacíos')
            return false
        }
        const datos = {
            id:id,
            idm:inpmD,
            idg:inpgD,
            idd:inpdD,
        }

        Postdata('materiasrelacion/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe la relación')
                return false
            }else{
                Putdata('materiasrelacion/edit',datos).then((res) => {
                    if(res?.data?.matchedCount > 0){
                        const div = document.getElementById("btnrelchange")
                        div.innerHTML = ""

                        const btnedit = document.createElement('button')
                        btnedit.setAttribute('class', 'btn btn-primary my-3')
                        btnedit.innerText = "Insertar"
                        btnedit.id = 'btn_insert_sche'
                        btnedit.name = 'btn_insert_sche'
                        btnedit.onclick = function() { insertRelationship() }
                        div.appendChild(btnedit)
                        Alertas('Información', `Se actualizo la relación en el sistema`)
                        inpCl.current.value = ''
                        inpGra.current.value = ''
                        inpTeac.current.value = ''
                        setLoadrela(true)
                        
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
            <title>{'Materias'}</title>
            <Menu flag='materias' />
            <div className="container-fluid mt-5"> 
                <div className="row">
                    <div className="col-sm-12 col-md-6 mb-2" >
                        <div className="card h-100">
                            <h3 className="my-2 text-center">{btnpro} materia</h3>
                            <div className="row align-items-center justify-content-center">
                                <label htmlFor="inputNomCourse" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Nombre materia</label>
                                <div className="col-6">
                                    <input type="text" className="form-control border-primary" name='inputNomCourse' id="inputNomCourse"  ref={inputNomCourse}/>
                                </div>
                            </div>
                            <div className="text-center" id="btncoursechange"> <button className='btn btn-primary my-3 ' onClick={insertCourse}>Insertar</button></div>
                        </div>
                        
                    </div>
                    <div className="col-sm-12 col-md-6 mb-2">
                        <div className="card h-100">
                            <h3 className="my-2 text-center">Materias</h3>
                            {fillcor != '' && <ul className="list-group border-0">
                                {fillcor}
                            </ul>}
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-12 mb-2" >
                        <div className="card h-100">
                            <h3 className="my-2 text-center">Relación materia - grado - docente</h3>
                            <div className="row align-items-center justify-content-center my-2 card-body">
                                <div className="col-sm-12 col-md-4">
                                    <div className="form-floating">
                                        <select className="form-select border-primary" id="inpCl" ref={inpCl}>
                                            <option key={0} value={''}>Selecciona materia</option>
                                            {fillcl}
                                        </select>
                                        <label htmlFor="inpCl">Materia</label>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-4">
                                    <div className="form-floating">
                                        <select className="form-select border-primary" id="inpGra" ref={inpGra}>
                                            <option key={0} value={''}>Selecciona grado</option>
                                            {fillpro}
                                        </select>
                                        <label htmlFor="inpGra">Grado</label>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-4">
                                    <div className="form-floating">
                                        <select className="form-select border-primary" id="inpTeac" ref={inpTeac}>
                                            <option key={0} value={''}>Selecciona docente</option>
                                            {filltea}
                                        </select>
                                        <label htmlFor="inpTeac">Docente</label>
                                    </div>
                                </div>
                            <div className="text-center" id="btnrelchange"> <button className='btn btn-primary my-3 ' onClick={insertRelationship}>Insertar</button></div>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 mb-2" >
                        <div className="card h-100">
                            {fillrela}
                        </div>
                    </div>
                  
                </div>
            </div>
        </main>
    )

}           