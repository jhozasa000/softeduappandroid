"use client"
import 'dotenv/config'
import { Getdata } from "../components/functions/Getdata";
import { Postdata } from "../components/functions/Postdata";
import { Putdata } from "../components/functions/Putdata";
import { Alertas } from "../components/functions/helpers";
import Menu from "../components/menu/Menu"
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

import { put } from '@vercel/blob';
import { del } from '@vercel/blob';

const metadata = {
    title: 'Docentes',
    description: 'Docentes',
  }

export default function Docentes(){    

    const inputNomProfesion = useRef(null);
    const [loadpro, setLoadpro] = useState(true);
    const [fillpro, setFillpro] = useState('');

    const inp = useRef(null);
    const inpPro = useRef(null);
    const inpTel = useRef(null);
    const inpDir = useRef(null);
    const inpFile = useRef(null);
    const inpcedula = useRef(null)
    const [fillcarr, setfillcarr] = useState('');
    const [fillteacher, setFillteacher] = useState('');
    const [loadteacher, setLoadteacher] = useState(true);
    const [btnpro, setBtnpro] = useState('Insertar');
    const [btntea, setBtntea] = useState('Insertar');

    useEffect(() => {
        setLoadpro(false)
        loaddata()
        fillcareers()
        setLoadteacher(false)
        loaddataTeacher()
    }, [loadpro,loadteacher]);

    //funciones profesion
    const insertBachelor = () =>{
        const inpNomPro = inputNomProfesion.current.value.trim()
        if(!inpNomPro){
            Alertas('Información','El campo no puede estar vacío')
            return false
        }
        const datos = {
            name:inpNomPro,
            state:1
        }
        Postdata('profesion/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe la profesión')
                return false
            }else{
                Postdata('profesion/insert',datos).then((res) => {
                    if(res?.data?.acknowledged){
                        Alertas('Información', `Se inserto la profesion en el sistema`)
                        inputNomProfesion.current.value = ''
                        setLoadpro(true)
                    }
                })
            }
          })
    }

    const loaddata = () =>{
        Getdata('profesion/select').then((info)=>{
            setFillpro( info.data.map(({id, name},x) =>{

                const profesiondelete = (id) =>{
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
                            Putdata('profesion/delete',datos).then(res => {
                                if(res?.data?.matchedCount > 0 ){
                                    Alertas('Información',`Se eliminó la profesión ${name} del sistema`)
                                    setLoadpro(true)
                                }
                            })
                        } 
                    })
                }


                return <li key={x} className="list-group-item d-flex border-0 align-items-center justify-content-center">
                            <div className="ms-2 me-auto ">
                                <i className="bi bi-arrow-right-circle ms-3">{name}</i>
                            </div>
                            <span><a onClick={() => profesiondelete(id)}><i className="bi bi-trash fs-4 px-2 text-danger"></i></a></span>
                            <span><a onClick={() => profesionedit(info.data[x])}><i className="bi bi-pencil-square fs-4 px-2 text-success"></i></a></span>
                        </li>
            }))
        })   
    }

    const profesionedit = ({id,name}) => {
        setBtnpro("Actualizar")
        inputNomProfesion.current.value = name
        const div = document.getElementById("btnprochange")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btnedit.innerText = "Actualizar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { profesionupdate(id) }

        const btncancel = document.createElement('button')
        btncancel.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btncancel.innerText = "Cancelar"
        btncancel.id = 'btn_cancel_sche'
        btncancel.name = 'btn_cancel_sche'
        btncancel.onclick = function() { profesioncancel() }

        div.appendChild(btnedit)
        div.appendChild(btncancel)

    }

    const profesioncancel = () => {
        const div = document.getElementById("btnprochange")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary my-3')
        btnedit.innerText = "Insertar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { insertBachelor() }
        div.appendChild(btnedit)
        setBtnpro('Insertar')
        inputNomProfesion.current.value = ''
    }

    const profesionupdate = (id) => {
        const value = inputNomProfesion.current.value.trim()
        if(!value){
            Alertas('Información','El campo no puede estar vacío')
            return false
        }
        const datos = {
            name: value,
            id:  id
        }

        Postdata('profesion/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe la profesión con ese nombre')
                return false
            }else{
                Putdata('profesion/edit',datos).then((res) => {
                    if(res?.data?.matchedCount > 0){
                        const div = document.getElementById("btnprochange")
                        div.innerHTML = ""

                        const btnedit = document.createElement('button')
                        btnedit.setAttribute('class', 'btn btn-primary my-3')
                        btnedit.innerText = "Insertar"
                        btnedit.id = 'btn_insert_sche'
                        btnedit.name = 'btn_insert_sche'
                        btnedit.onclick = function() { insertBachelor() }
                        div.appendChild(btnedit)
                        setBtnpro('Insertar')
                        Alertas('Información', `Se actualizo la profesión en el sistema`)
                        inputNomProfesion.current.value = ''
                        setLoadpro(true)
                        
                    }
                })
            }
        })
    }

    const fillcareers = () => {
        Getdata('profesion/select').then((info)=>{
            setfillcarr( info.data.map(({id, name},x) =>{
                return <option key={x+1} value={id}>{name}</option>
            }))
        })
    }


    //funciones docentes
    const insertTeacher = () =>{
        if(!inp.current.value.trim()  || !inpcedula.current.value.trim()  || !inpPro.current.value.trim()  || !inpTel.current.value.trim()  || !inpDir.current.value.trim() ){
            Alertas('Información','Los campos no pueden estar vacíos')
            return false
        }
        const id = inpcedula.current.value 
        const datos = {
            numberid:id,
        }

        Postdata('docentes/select',datos).then(async (ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe un docente registrado con la cédula ',inpcedula.current.value)
                return false
            }else{
                let blobdata = ''
                if(inpFile?.current?.files[0]){
                    const file = inpFile?.current?.files[0]

                    if(file.size > 2097152){
                        Alertas('Información','El tamaño del archivo es superior a 2 mb')
                        return false
                    }
                    const blob = await put(file.name, file, {
                                            access: 'public',
                                            token: process.env.BLOB_READ_WRITE_TOKEN
                                        }); 
                    blobdata = blob.url
                }

                const datos = {
                    name : inp.current.value.trim() ,
                    numberid : inpcedula.current.value.trim() ,
                    profession :  inpPro.current.value.trim(),
                    telephone :  inpTel.current.value.trim(),
                    address :  inpDir.current.value.trim(),
                    files :  blobdata
                }
  
                Postdata('docentes/insert',datos).then((res) => {
                    if(res?.data?.error){
                        Alertas('Información',res?.data?.error)
                    }

                    if(res?.data?.acknowledged){
                        Alertas('Información', `Se inserto el docente en el sistema`)
                        inp.current.value = ''
                        inpcedula.current.value = ''
                        inpPro.current.value = ''
                        inpTel.current.value = ''
                        inpDir.current.value = ''
                        inpFile.current.value = ''
                        setLoadteacher(true)
                    }
                })
            }
          })
    }

    const loaddataTeacher = () =>{
        Getdata('docentes/select').then((info)=>{


            setFillteacher( info.data.map(({id, name, numberid, profession},x) =>{

                const docentesdelete = (id) =>{
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
                            Putdata('docentes/delete',datos).then(res => {
                                if(res?.data?.matchedCount > 0 ){
                                    Alertas('Información',`Se eliminó docente ${name} del sistema`)
                                    setLoadteacher(true)
                                }
                            })
                        } 
                    })
                }


                return <li key={x} className="list-group-item d-flex text-start text-wrap">
                        <div className="ms-2 me-auto">
                            <div className='text-primary fw-bold'>{name} - {numberid}</div>
                                <i className="bi bi-arrow-right-circle ms-3">{profession}</i>
                        </div>
                        <span><a onClick={() => docentesview(info.data[x])}><i className="bi bi-person-rolodex fs-4 px-2 text-primary"></i></a></span>
                        <span><a onClick={() => docentesdelete(id)}><i className="bi bi-trash fs-4 px-2 text-danger"></i></a></span>
                        <span><a onClick={() => docentesedit(info.data[x])}><i className="bi bi-pencil-square fs-4 px-2 text-success"></i></a></span>
                    </li>
            }))
        })   
    }

    const docentesview = ({id,name,numberid,telephone,address,files,profession}) => {

        console.log('files    ', files)


        Alertas(`Información docente: `,
            `
            <table class="table text-start">
                <tbody>
                    <tr>
                        <td>Nombre</td>
                        <td>${name}</td>
                    </tr>
                    <tr>
                        <td>Número identificación</td>
                        <td>${numberid}</td>
                    </tr>
                    <tr>
                        <td>Profesión</td>
                        <td>${profession}</td>
                    </tr>
                    <tr>
                        <td>Teléfono</td>
                        <td>${telephone}</td>
                    </tr>
                    
                    <tr>
                        <td>Dirección</td>
                        <td>${address}</td>
                    </tr>
                    <tr>
                        <td>Archivo PDF</td>
                        <td>${files.length?`<a href="${files}" download="docente-${numberid}.pdf">descargar</a>`:'0 archivos'}</td>
                    </tr>
                </tbody>
            </table>
           `
            ,0)
    }

    const docentesedit = ({id,name,numberid,idpro,telephone,address,files}) => {
        setBtntea("Actualizar")
        inp.current.value = name
        inpcedula.current.value = numberid
        inpcedula.current.setAttribute('readonly', true)
        inpcedula.current.classList.add('bg-light')
        inpPro.current.value = idpro
        inpTel.current.value = telephone
        inpDir.current.value = address

        const div = document.getElementById("btntea")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btnedit.innerText = "Actualizar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { docentesupdate(id,files) }

        const btncancel = document.createElement('button')
        btncancel.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btncancel.innerText = "Cancelar"
        btncancel.id = 'btn_cancel_sche'
        btncancel.name = 'btn_cancel_sche'
        btncancel.onclick = function() { docentescancel() }

        div.appendChild(btnedit)
        div.appendChild(btncancel)

    }

    const docentescancel = () => {
        const div = document.getElementById("btntea")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary my-3')
        btnedit.innerText = "Insertar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { insertTeacher() }
        div.appendChild(btnedit)
        setBtntea('Insertar')
        inp.current.value = ''
        inpcedula.current.value = ''
        inpcedula.current.removeAttribute('readonly')
        inpcedula.current.classList.remove('bg-light')
        inpPro.current.value = ''
        inpTel.current.value = ''
        inpDir.current.value = ''
        inpFile.current.value = ''
    }

    const docentesupdate = async  (id,files) => {

        const name = inp.current.value.trim()
        const numberid =inpcedula.current.value.trim()
        const profession = inpPro.current.value.trim()
        const telephone = inpTel.current.value.trim()
        const address = inpDir.current.value.trim()
        const filesnew = inpFile?.current?.files[0]??''

        if(!name || !numberid || !profession || !telephone || !address ){
            Alertas('Información','Los campos no pueden estar vacíos')
            return false
        }

        let archivo = ''
        if(filesnew){
            const file = inpFile?.current?.files[0]

            if(file.size > 2097152){
                Alertas('Información','El tamaño del archivo es superior a 2 mb')
                return false
            }
            console.log('files---    ', files);
            //eliminamos blob vercel
            if(files){
                 await del(files,{
                            token: process.env.BLOB_READ_WRITE_TOKEN
                        })
            }
           //subimos archivo blob vercel
            const blob = await put(file.name, file, {
                                    access: 'public',
                                    token: process.env.BLOB_READ_WRITE_TOKEN
                                }); 
            archivo = blob.url
        }

        if(!archivo){
            archivo = files??''
        }
        const datos = {
            id: id,
            name : inp.current.value.trim() ,
            numberid : inpcedula.current.value.trim() ,
            profession :  inpPro.current.value.trim(),
            telephone :  inpTel.current.value.trim(),
            address :  inpDir.current.value.trim(),
            files :  archivo
        }
     
        Putdata('docentes/edit',datos).then((res) => {

            if(res?.data?.matchedCount > 0){
                const div = document.getElementById("btntea")
                div.innerHTML = ""

                const btnedit = document.createElement('button')
                btnedit.setAttribute('class', 'btn btn-primary my-3')
                btnedit.innerText = "Insertar"
                btnedit.id = 'btn_insert_sche'
                btnedit.name = 'btn_insert_sche'
                btnedit.onclick = function() { insertTeacher() }
                div.appendChild(btnedit)
                setBtntea('Insertar')
                Alertas('Información', `Se actualizo docente en el sistema`)
                inp.current.value = ''
                inpcedula.current.value = ''
                inpcedula.current.removeAttribute('readonly')
                inpcedula.current.classList.remove('bg-light')
                inpPro.current.value = ''
                inpTel.current.value = ''
                inpDir.current.value = ''
                inpFile.current.value = ''
                setLoadteacher(true)
                
            }else if(res?.data?.error){
                Alertas('Información', res.data.error)
                return false
            }
        })
    }


    return(
        <main>
            <title>{'Docentes'}</title>
            <Menu flag='docentes' />
            <div className="container-fluid mt-5"> 
                <div className="row">
                    <div className="col-sm-12 col-md-6 mb-2" >
                        <div className="card h-100">
                            <h3 className="my-2 text-center">{btnpro} profesión</h3>
                            <div className="row align-items-center justify-content-center">
                                    <label htmlFor="inputNomProfesion" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Nombre profesión</label>
                                    <div className="col-6">
                                        <input type="text" className="form-control border-primary" name='inputNomProfesion' id="inputNomProfesion"  ref={inputNomProfesion}/>
                                    </div>
                                </div>
                               <div className="text-center" id="btnprochange"> <button className='btn btn-primary my-3 ' onClick={insertBachelor}>Insertar</button></div>
                        </div>
                        
                    </div>
                    <div className="col-sm-12 col-md-6 mb-2">
                        <div className="card h-100">
                            <h3 className="my-2 text-center">Profesiones</h3>
                            {fillpro != '' && <ul className="list-group border-0">
                                {fillpro}
                            </ul>}
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-2" >
                        <div className="card h-100">
                            <h3 className="my-2 text-center">{btntea} docente</h3>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpTea" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Nombre docente</label>
                                <div className="col-6">
                                    <input type="text" className="form-control border-primary" name='inpTea' id="inpTea"  ref={inp}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpcedula" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Cédula</label>
                                <div className="col-6">
                                    <input type="text" className="form-control border-primary" name='inpcedula' id="inpcedula"  ref={inpcedula}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpPro" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Profesión</label>
                                <div className="col-6">
                                    <select name='inpPro' id="inpPro"  ref={inpPro} className="form-select border-primary">
                                        <option key={0} value={''}>Selecciona profesión</option>
                                        {fillcarr}
                                    </select> 

                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpTel" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Teléfono</label>
                                <div className="col-6">
                                    <input type="tel" className="form-control border-primary" name='inpTel' id="inpTel"  ref={inpTel}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpDir" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Dirección</label>
                                <div className="col-6">
                                    <input type="text" className="form-control border-primary" name='inpDir' id="inpDir"  ref={inpDir}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center my-2">
                                <span className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Archivo</span>
                                <div className="col-6">
                                    <label htmlFor="inpFile" className="col-5 form-control form-control-sm border-ligth fs-4 fw-bold btn border-primary btn-sm">Subir archivo PDF
                                        <input type="file" className="form-control" name='inpFile' id="inpFile" style={{display:'none'}} accept=".pdf"  ref={inpFile}/>
                                    </label>
                                </div>
                            </div>
                            <div className="text-center" id="btntea"> 
                                <button className='btn btn-primary my-3 ' onClick={insertTeacher}>Insertar</button>
                            </div>

                        </div>
                        
                    </div>
                    <div className="col-sm-12 col-md-6 mb-2">
                        <div className="card h-100">
                            <h3 className="my-2 text-center">Docentes</h3>
                            {fillteacher != '' && <ul className="list-group border-0 w-100">
                                {fillteacher}
                            </ul>}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )

}           