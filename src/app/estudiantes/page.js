"use client"
import { Getdata } from "../components/functions/Getdata";
import { Postdata } from "../components/functions/Postdata";
import { Putdata } from "../components/functions/Putdata";
import { Alertas } from "../components/functions/helpers";
import Menu from "../components/menu/Menu"
import { useRef, useEffect } from 'react';
import { useState } from 'react';
import  Swal  from 'sweetalert2';

const metadata = {
    title: 'Estudiantes',
    description: 'Estudiantes',
  }

export default function Estudiantes(){    
    const inpStu = useRef(null)
    const inpLast = useRef(null)
    const inpBir = useRef(null)
    const inpTelfamilia = useRef(null)
    const inpMail = useRef(null)
    const inpId = useRef(null)
    const inpIdnumber = useRef(null)
    const inpGra = useRef(null)
    const inpStudent = useRef(null)
    const [fillstu, setFillstu] = useState('');
    const [load, setLoad] = useState(true);
    const [loadrel, setLoadrel] = useState(true);
    const [fillgrade, setFillgrade] = useState('');
    const [fillstudent, setFillstudent] = useState('');
    const [fillrela, setFillrela] = useState('');
    const [filltipo, setFilltipo] = useState('');
    const [loadstu, setLoadstu] = useState('');
    const [btnpro, setBtnpro] = useState('Insertar');
    const [loadsturel, setLoadsturel] = useState(true);
    const [btnprorel, setBtnprorel] = useState('Insertar');


    useEffect(() => {
        loaddata()
        setLoad(false)
        setLoadstu(false)
        filldatarelationship()
        loaddatarelationship()
        setLoadrel(false)
        setLoadsturel(false)
    },[load,loadstu,loadrel,loadsturel]);

    const insertStudent = () => {
        const namestu = inpStu.current.value.trim()
        const lastname = inpLast.current.value.trim()
        const typeid = inpId.current.value
        const inpIdnum = inpIdnumber.current.value.trim()
        const datebirth = inpBir.current.value.trim()
        const telephone = inpTelfamilia.current.value.trim()
        const email = inpMail.current.value.trim()
        
        if(!namestu || !lastname || !typeid || !inpIdnum || !datebirth || !telephone || !email){
            Alertas('Información','Los campos no pueden estar vacíos')
            return false
        }
        const datos = {
            name : namestu,
            lastname : lastname,
            typeid : typeid,
            numberid : inpIdnum,
            datebirth : datebirth,
            telephone : telephone,
            email : email
        }

       Postdata('estudiantes/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe el estudiante')
                return false
            }else{
                Postdata('estudiantes/insert',datos).then((res) => {
                    if(res?.data?.acknowledged){
                        Alertas('Información', `Se inserto el estudiante en el sistema`)
                        inpStu.current.value = ''
                        inpLast.current.value = ''
                        inpId.current.value = ''
                        inpIdnumber.current.value = ''
                        inpBir.current.value = ''
                        inpTelfamilia.current.value = ''
                        inpMail.current.value = ''
                        setLoadstu(true)
                    }else if(res?.data?.error){
                        Alertas('Información', res.data.error)
                        return false
                    }
                })
            }
        })
    }

    const loaddata = () =>{

        Getdata('tipoidentificacion/select').then((info)=>{
            setFilltipo( info.data.map(({id, name},x) =>{
                return <option key={x+1} value={id}>{name}</option>
            }))
        })

        Getdata('estudiantes/select').then((info)=>{
            setFillstu( info.data.map(({id, name,lastname,numberid,telephone},x) =>{

                const estudiantesdelete = (id) =>{
                    const datos = {
                        id:id
                    }
                    Swal.fire({
                        title: `<strong>¿Desea eliminar a: ${name}?</strong>`,
                        showDenyButton: false,
                        showCancelButton: true,
                        confirmButtonText:'Eliminar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#3085d6',
                        cancelButtonText:'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Putdata('estudiantes/delete',datos).then(res => {
                                if(res?.data?.matchedCount > 0 ){
                                    Alertas('Información',`Se eliminó a ${name} del sistema`)
                                    setLoadstu(true)
                                }
                            })
                        } 
                    })
                }
                return <li key={x} className="list-group-item d-flex border-0 align-items-center justify-content-center">
                            <div className="ms-2 me-auto">
                                    <div className='text-primary fw-bold'>{name}  {lastname} - {numberid}</div>
                                        <i className="bi bi-arrow-right-circle ms-3">Tel. Acudiente:    {telephone}</i>
                                </div>
                            <span><a onClick={() => estudiantesdelete(id)}><i className="bi bi-trash fs-4 px-2 text-danger"></i></a></span>
                            <span><a onClick={() => estudiantesedit(info.data[x])}><i className="bi bi-pencil-square fs-4 px-2 text-success"></i></a></span>
                        </li>
            }))
        })

    }

    const estudiantesedit = ({id,name,lastname,typeid,numberid,datebirth,telephone,email}) => {
        setBtnpro("Actualizar")
        inpStu.current.value = name
        inpLast.current.value = lastname
        inpId.current.value = typeid
        inpId.current.setAttribute('disabled',true)
        inpId.current.classList.add('bg-light')
        inpIdnumber.current.value = numberid
        inpIdnumber.current.setAttribute('readonly',true)
        inpIdnumber.current.classList.add('bg-light')


        inpBir.current.value = datebirth
        inpTelfamilia.current.value = telephone
        inpMail.current.value = email
        const div = document.getElementById("btnstuchange")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btnedit.innerText = "Actualizar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { estudiantesupdate(id) }

        const btncancel = document.createElement('button')
        btncancel.setAttribute('class', 'btn btn-primary mx-3 my-3')
        btncancel.innerText = "Cancelar"
        btncancel.id = 'btn_cancel_sche'
        btncancel.name = 'btn_cancel_sche'
        btncancel.onclick = function() { estudiantescancel() }

        div.appendChild(btnedit)
        div.appendChild(btncancel)

    }

    const estudiantescancel = () => {
        const div = document.getElementById("btnstuchange")
        div.innerHTML = ""

        const btnedit = document.createElement('button')
        btnedit.setAttribute('class', 'btn btn-primary my-3')
        btnedit.innerText = "Insertar"
        btnedit.id = 'btn_insert_sche'
        btnedit.name = 'btn_insert_sche'
        btnedit.onclick = function() { insertStudent() }
        div.appendChild(btnedit)
        setBtnpro('Insertar')
        inpStu.current.value = ''
        inpLast.current.value = ''
        inpId.current.value = ''
        inpIdnumber.current.value = ''
        inpBir.current.value = ''
        inpTelfamilia.current.value = ''
        inpMail.current.value = ''
        inpId.current.removeAttribute('disabled')
        inpId.current.classList.remove('bg-light')
        inpIdnumber.current.removeAttribute('readonly')
        inpIdnumber.current.classList.remove('bg-light')
    }

    const estudiantesupdate = (id) => {
        const name = inpStu.current.value.trim()
        const lastname = inpLast.current.value.trim()
        const typeid = inpId.current.value
        const inpIdnum = inpIdnumber.current.value.trim()
        const datebirth = inpBir.current.value.trim()
        const telephone = inpTelfamilia.current.value.trim()
        const email = inpMail.current.value.trim()
        
        if(!name || !lastname || !typeid || !inpIdnum || !datebirth || !telephone || !email){
            Alertas('Información','Los campos no pueden estar vacíos')
            return false
        }
        const datos = {
            id:id,
            name : name,
            lastname : lastname,
            typeid : typeid,
            numberid : inpIdnum,
            datebirth : datebirth,
            telephone : telephone,
            email : email
        }

        Putdata('estudiantes/edit',datos).then((res) => {
            if(res?.data?.matchedCount > 0){
                const div = document.getElementById("btnstuchange")
                div.innerHTML = ""

                const btnedit = document.createElement('button')
                btnedit.setAttribute('class', 'btn btn-primary my-3')
                btnedit.innerText = "Insertar"
                btnedit.id = 'btn_insert_sche'
                btnedit.name = 'btn_insert_sche'
                btnedit.onclick = function() { insertStudent() }
                div.appendChild(btnedit)
                setBtnpro('Insertar')
                Alertas('Información', `Se actualizo estudiante en el sistema`)
                inpStu.current.value = ''
                inpLast.current.value = ''
                inpId.current.value = ''
                inpIdnumber.current.value = ''
                inpBir.current.value = ''
                inpTelfamilia.current.value = ''
                inpMail.current.value = ''
                inpId.current.removeAttribute('disabled')
                inpId.current.classList.remove('bg-light')
                inpIdnumber.current.removeAttribute('readonly')
                inpIdnumber.current.classList.remove('bg-light')
                setLoadstu(true)
                setLoadrel(true)

                
            }else if(res?.data?.error){
                Alertas('Información', res.data.error)
                return false
            }
        })
    }


    const filldatarelationship =() =>{

        Getdata('grados/select').then((info)=>{
            setFillgrade( info.data.map(({idgra, namegra,namecal,namejor},x) =>{
                return <option key={x+1} value={idgra}>{namegra +' - '+ namecal  +' - '+ namejor}</option>
            }))
        })      

        //select relacion de estudiante materia
        Getdata('estudiantes/select').then((info)=>{
            setFillstudent( info.data.map(({id, name,lastname, numberid},x) =>{
                return <option key={x+1} value={id}>{name} {lastname}  {numberid}</option>
            }))
        })
    }

    const insertRelationshipsstu = () =>{
        const inpS = inpStudent.current.value
        const inpG = inpGra.current.value
        if(!inpS || !inpG){
            Alertas('Información','Los campos no pueden estar vacíos')
            return false
        }
        const datos = {
            idstu:inpS,
            idgra:inpG
        }

        Postdata('estudiantesrelacion/select',datos).then((ele) => {
            if(ele?.data?.length){
                Alertas('Información','Ya existe la relación')
                return false
            }else{
                Postdata('estudiantesrelacion/insert',datos).then((res) => {
                    if(res?.data?.acknowledged){
                        Alertas('Información', `Se inserto la relación en el sistema`)
                        inpStudent.current.value  = ''
                        inpGra.current.value  = ''
                        setLoadsturel(true)
                    }else if(res?.data?.error){
                        Alertas('Información', res.data.error)
                        return false
                    }
                })
            }
          })
    }

const loaddatarelationship = () =>{
    Getdata('estudiantesrelacion/select').then((info)=>{

        console.log('info  ---   ', info);


        setFillrela( info.data.map(({id, name, lastname, numberid ,namegra ,namecal , namejor},x) =>{

            const estudiantesrelaciondelete = (id) =>{
                const datos = {
                    id:id
                }
                Swal.fire({
                    title: `<strong>¿Desea eliminar: ${name} ${lastname} - ${numberid}?</strong>`,
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText:'Eliminar',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#3085d6',
                    cancelButtonText:'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Putdata('estudiantesrelacion/delete',datos).then(res => {
                            if(res?.data?.matchedCount > 0 ){
                                Alertas('Información',`Se eliminó  ${name} ${lastname} - ${numberid} del sistema`)
                                setLoadsturel(true)
                            }
                        })
                    } 
                })
            }


            return <li key={x} className="list-group-item d-flex border-0 align-items-center justify-content-center">
                        <div className="ms-2 me-auto ">
                        <div className='text-primary fw-bold'>Estudiante {name} {lastname} - {numberid}</div>
                            <i className="bi bi-arrow-right-circle ms-3">{namegra} {namecal} {namejor}  </i>
                        </div>
                        <span><a onClick={() => estudiantesrelaciondelete(id)}><i className="bi bi-trash fs-4 px-2 text-danger"></i></a></span>
                        <span><a onClick={() => estudiantesrelacionedit(info.data[x])}><i className="bi bi-pencil-square fs-4 px-2 text-success"></i></a></span>
                    </li>
        }))
    })   
}

const estudiantesrelacionedit = ({id,idstu,idgra}) => {
    inpStudent.current.value = idstu
    inpGra.current.value = idgra

    const div = document.getElementById("btnsturelchange")
    div.innerHTML = ""

    const btnedit = document.createElement('button')
    btnedit.setAttribute('class', 'btn btn-primary mx-3 my-3')
    btnedit.innerText = "Actualizar"
    btnedit.id = 'btn_insert_sche'
    btnedit.name = 'btn_insert_sche'
    btnedit.onclick = function() { estudiantesrelacionupdate(id) }

    const btncancel = document.createElement('button')
    btncancel.setAttribute('class', 'btn btn-primary mx-3 my-3')
    btncancel.innerText = "Cancelar"
    btncancel.id = 'btn_cancel_sche'
    btncancel.name = 'btn_cancel_sche'
    btncancel.onclick = function() { estudiantesrelacioncancel() }

    div.appendChild(btnedit)
    div.appendChild(btncancel)

}

const estudiantesrelacioncancel = () => {
    const div = document.getElementById("btnsturelchange")
    div.innerHTML = ""

    const btnedit = document.createElement('button')
    btnedit.setAttribute('class', 'btn btn-primary my-3')
    btnedit.innerText = "Insertar"
    btnedit.id = 'btn_insert_sche'
    btnedit.name = 'btn_insert_sche'
    btnedit.onclick = function() { insertRelationshipsstu() }
    div.appendChild(btnedit)
    inpStudent.current.value  = ''
    inpGra.current.value  = ''
}

const estudiantesrelacionupdate = (id) => {
    const inpS = inpStudent.current.value
    const inpG = inpGra.current.value
    if(!inpS || !inpG){
        Alertas('Información','Los campos no pueden estar vacíos')
        return false
    }

    const datos = {
        idstu:inpS,
        idgra:inpG,
        id: id
    }

    Postdata('estudiantesrelacion/select',datos).then((ele) => {
        if(ele?.data?.length){
            Alertas('Información','Ya existe el estudiante y la relación')
            return false
        }else{
            Putdata('estudiantesrelacion/edit',datos).then((res) => {
                if(res?.data?.matchedCount > 0){
                    const div = document.getElementById("btnsturelchange")
                    div.innerHTML = ""

                    const btnedit = document.createElement('button')
                    btnedit.setAttribute('class', 'btn btn-primary my-3')
                    btnedit.innerText = "Insertar"
                    btnedit.id = 'btn_insert_sche'
                    btnedit.name = 'btn_insert_sche'
                    btnedit.onclick = function() { insertRelationshipsstu() }
                    div.appendChild(btnedit)
                    setBtnprorel('Insertar')
                    Alertas('Información', `Se actualizo el estudiante en el sistema`)
                    inpStudent.current.value = ''
                    inpGra.current.value = ''
                    setLoadsturel(true)
                    
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
            <title>{'Estudiantes'}</title>
            <Menu flag='estudiantes' />
            <div className="container-fluid mt-5"> 
                <div className="row">
                    <div className="col-sm-12 col-md-6 mb-2" >
                        <div className="card h-100">
                            <h3 className="my-2 text-center">{btnpro} estudiante</h3>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpStu" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Nombres estudiante</label>
                                <div className="col-6">
                                    <input type="text" className="form-control border-primary" name='inpStu' id="inpStu"  ref={inpStu}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpLast" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Apellidos estudiante</label>
                                <div className="col-6">
                                    <input type="text" className="form-control border-primary" name='inpLast' id="inpLast"  ref={inpLast}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpId" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Tipo identificación</label>
                                <div className="col-6">
                                    <select className="form-select border-primary" ref={inpId} id="inpId" name="inpId">
                                        <option key={0} value={''}>Selecciona tipo</option>
                                        {filltipo}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpIdnumber" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Identificación estudiante</label>
                                <div className="col-6">
                                    <input type="number" className="form-control border-primary" name='inpIdnumber' id="inpIdnumber"  ref={inpIdnumber} min="1" pattern="^[0-9]+"/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpBir" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Fecha de nacimiento</label>
                                <div className="col-6">
                                    <input type="date" className="form-control border-primary" name='inpBir' id="inpBir"  ref={inpBir}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpTelfamilia" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Teléfono acudiente</label>
                                <div className="col-6">
                                    <input type="tel" className="form-control border-primary" name='inpTelfamilia' id="inpTelfamilia"  ref={inpTelfamilia}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center my-2">
                                <label htmlFor="inpMail" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Correo acudiente</label>
                                <div className="col-6">
                                    <input pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" type="email" className="form-control border-primary" name='inpMail' id="inpMail"  ref={inpMail}/>
                                </div>
                            </div>
                            <div className="text-center" id="btnstuchange"> <button className='btn btn-primary my-3 ' onClick={insertStudent}>Insertar</button></div>
                        </div>
                        
                    </div>
                    <div className="col-sm-12 col-md-6 mb-2">
                        <div className="card h-100">
                            <h3 className="my-2 text-center">Estudiantes</h3>
                            {fillstu != '' && <ul className="list-group border-0">
                                {fillstu}
                            </ul>}
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-12 mb-2" >
                        <div className="card h-100">
                        <h3 className="my-2 text-center">Relación estudiante - grado</h3>

                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <div className="form-floating">
                                    <select className="form-select" id="inpStudent" ref={inpStudent}>
                                        <option key={0} value={''}>Selecciona estudiante</option>
                                        {fillstudent}
                                    </select>
                                    <label htmlFor="inpGra">Estudiante</label>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <div className="form-floating">
                                    <select className="form-select" id="inpGra" ref={inpGra}>
                                        <option key={0} value={''}>Selecciona grado</option>
                                        {fillgrade}
                                    </select>
                                    <label htmlFor="inpGra">Grado</label>
                                </div>
                            </div>
                            <div className="text-center" id="btnsturelchange"> <button className='btn btn-primary my-3 ' onClick={insertRelationshipsstu}>Insertar</button></div>

                        </div>

                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 mb-2" >
                        <div className="card h-100 mb-4">
                            {fillrela}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )

}           