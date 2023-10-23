"use client"
import Swal from "sweetalert2";
import { Getdata } from "../components/functions/Getdata";
import { Postdata } from "../components/functions/Postdata";
import { Alertas } from "../components/functions/helpers";
import Menu from "../components/menu/Menu"
import { useRef , useState , useEffect} from 'react';
import { Putdata } from "../components/functions/Putdata";


 const metadata = {
  title: 'Usuarios',
  description:'Usuarios'
}

export default function Usuarios(){
    // declaracion de variables
  const inpuser = useRef(null)
  const inppass = useRef(null)
  const [loadusers, setLoadusers] = useState(true);
  const [fillusers, setFillusers] = useState('');
  const [btnprorel, setBtnprorel] = useState('Insertar');

   // declaracion de inicializacion de funcion
  useEffect(() => {
    setLoadusers(false)
    load()
  },[loadusers]);

 // funcion insertar usuarios
const insert = () =>{
    const inpS = inpuser.current.value.trim()
    const inpG = inppass.current.value.trim()
    if(!inpS || !inpG){
        Alertas('Información','Los campos no pueden estar vacíos')
        return false
    }
    const datos = {
        user:inpS,
        pass:inpG,
        level:1,
        state:1
    }

    Postdata('usuarios/select',datos).then((ele) => {
      if(ele.data.length){
            Alertas('Información','Ya existe el usuario')
            return false
        }else{
            Postdata('usuarios/insert',datos).then((res) => {
                if(res.data.acknowledged){
                    Alertas('Información', `Se inserto el usuario en el sistema`)
                    inpuser.current.value  = ''
                    inppass.current.value  = ''
                    setLoadusers(true)
                }else if(res?.data?.error){
                    Alertas('Información', res.data.error)
                    return false
                }
            })
        }
      })
}

const load = () =>{
Getdata('usuarios/select').then((info)=>{
    setFillusers( info.data.map(({id, user},x) =>{

        const usuariosdelete = (id) =>{
            const datos = {
                id:id
            }
            // cuadro de confirmacion para eliminar regstro
            Swal.fire({
                title: `<strong>¿Desea eliminar: ${user}?</strong>`,
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText:'Eliminar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#3085d6',
                cancelButtonText:'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Putdata('usuarios/delete',datos).then(res => {
                        if(res?.data?.matchedCount > 0 ){
                            Alertas('Información',`Se eliminó  ${user} del sistema`)
                            setLoadusers(true)
                        }
                    })
                } 
            })
        }

        // se retorna lista 
        return <li key={x} className="list-group-item d-flex border-0 align-items-center justify-content-center">
                    <div className="ms-2 me-auto ">
                    <div className='text-primary fw-bold'>Usuario</div>
                        <i className="bi bi-arrow-right-circle ms-3">{user}</i>
                    </div>
                    <span><a onClick={() => usuariosdelete(id)}><i className="bi bi-trash fs-4 px-2 text-danger"></i></a></span>
                    <span><a onClick={() => usuariosedit(info.data[x])}><i className="bi bi-pencil-square fs-4 px-2 text-success"></i></a></span>
                </li>
    }))
})   
}

const usuariosedit = ({id,user,pass}) => {
    // se setean los valores en los input
    inpuser.current.value = user
    inppass.current.value = pass

    const div = document.getElementById("btnsturelchange")
    div.innerHTML = ""

    // se crean los botones
    const btnedit = document.createElement('button')
    btnedit.setAttribute('class', 'btn btn-primary mx-3 my-3')
    btnedit.innerText = "Actualizar"
    btnedit.id = 'btn_insert_sche'
    btnedit.name = 'btn_insert_sche'
    btnedit.onclick = function() { usuariosupdate(id) }

    const btncancel = document.createElement('button')
    btncancel.setAttribute('class', 'btn btn-primary mx-3 my-3')
    btncancel.innerText = "Cancelar"
    btncancel.id = 'btn_cancel_sche'
    btncancel.name = 'btn_cancel_sche'
    btncancel.onclick = function() { usuarioscancel() }

    div.appendChild(btnedit)
    div.appendChild(btncancel)

}

const usuarioscancel = () => {
    const div = document.getElementById("btnsturelchange")
    div.innerHTML = ""

    const btnedit = document.createElement('button')
    btnedit.setAttribute('class', 'btn btn-primary my-3')
    btnedit.innerText = "Insertar"
    btnedit.id = 'btn_insert_sche'
    btnedit.name = 'btn_insert_sche'
    btnedit.onclick = function() { insert() }
    div.appendChild(btnedit)
    inpuser.current.value  = ''
    inppass.current.value  = ''
}

const usuariosupdate = (id) => {
    const inpS = inpuser.current.value.trim()
    const inpG = inppass.current.value.trim()
    if(!inpS || !inpG){
        Alertas('Información','Los campos no pueden estar vacíos')
        return false
    }

    const datos = {
        user:inpS,
        pass:inpG,
        id:id
    }

    Postdata('usuarios/selectedit',datos).then((ele) => {
        if(ele?.data?.length){
            Alertas('Información','Ya existe el usuario con ese nombre')
            return false
        }else{
            Putdata('usuarios/edit',datos).then((res) => {
                if(res?.data?.matchedCount > 0){
                    const div = document.getElementById("btnsturelchange")
                    div.innerHTML = ""

                    const btnedit = document.createElement('button')
                    btnedit.setAttribute('class', 'btn btn-primary my-3')
                    btnedit.innerText = "Insertar"
                    btnedit.id = 'btn_insert_sche'
                    btnedit.name = 'btn_insert_sche'
                    btnedit.onclick = function() { insert() }
                    div.appendChild(btnedit)
                    setBtnprorel('Insertar')
                    Alertas('Información', `Se actualizo el usuario en el sistema`)
                    inpuser.current.value = ''
                    inppass.current.value = ''
                    setLoadusers(true)
                    
                }else if(res?.data?.error){
                    Alertas('Información', res.data.error)
                    return false
                }
            })
        }
    })
}


  return (
          <main>
            <title>{'Usuarios'}</title>
            <Menu flag='usuarios' /> 
            <div className="container-fluid mt-5"> 
                <div className="row">
                    <div className="col-sm-12 col-md-6 mb-2" >
                        <div className="card h-100">
                            <h3 className="my-2 text-center">{btnprorel} usuario</h3>
                            <div className="row align-items-center justify-content-center">
                                <label htmlFor="inputUser" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Nombre usuario</label>
                                <div className="col-6">
                                    <input type="text" className="form-control border-primary my-3 " name='inputUser' id="inputUser"  ref={inpuser}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center">
                                <label htmlFor="inputPass" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Clave usuario</label>
                                <div className="col-6">
                                    <input type="text" className="form-control border-primary my-3" name='inputPass' id="inputPass"  ref={inppass}/>
                                </div>
                            </div>
                            <div className="text-center" id="btnsturelchange"> <button className='btn btn-primary my-3 ' onClick={insert}>Insertar</button></div>
                        </div>
                        
                    </div>
                    <div className="col-sm-12 col-md-6 mb-2">
                    <div className="card h-100">
                            <h3 className="my-2 text-center">Usuarios</h3>
                            <div className="card h-100">
                              {fillusers}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            </main>
          )
}