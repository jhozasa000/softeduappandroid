"use client"
import Swal from "sweetalert2";
import { Getdata } from "../components/functions/Getdata";
import { Postdata } from "../components/functions/Postdata";
import { Alertas } from "../components/functions/helpers";
import Menu from "../components/menu/Menu"
import { useRef , useState , useEffect} from 'react';
import { Putdata } from "../components/functions/Putdata";


 const metadata = {
  title: 'Anuncios',
  description:'Anuncios'
}

export default function Anuncios(){
    // declaracion de variables
  const inptitle = useRef(null)
  const inpdescription = useRef(null)
  const inpdate = useRef(null)
  const [loadusers, setLoadusers] = useState(true);
  const [fillusers, setFillusers] = useState('');
  const [btnprorel, setBtnprorel] = useState('Insertar');

   // declaracion de inicializacion de funcion
  useEffect(() => {
    setLoadusers(false)
    load()
  },[loadusers]);

 // funcion insertar anuncios
const insert = () =>{
    const inpT = inptitle.current.value.trim()
    const inpDes = inpdescription.current.value.trim()
    const inpDat = inpdate.current.value.trim()
    if(!inpT || !inpDes || !inpDat){
        Alertas('Información','Los campos no pueden estar vacíos')
        return false
    }
    const datos = {
        title:inpT,
        description:inpDes,
        date:inpDat,
        state:1
    }

    Postdata('anuncios/insert',datos).then((res) => {
        if(res.data.acknowledged){
            Alertas('Información', `Se inserto el anuncio en el sistema`)
            inptitle.current.value  = ''
            inpdescription.current.value  = ''
            inpdate.current.value  = ''
            setLoadusers(true)
        }else if(res.data.error){
            Alertas('Información', res.data.error)
            return false
        }
    })
     
}

const load = () =>{
Getdata('anuncios/select').then((info)=>{
    setFillusers( info.data.map(({id, title,description,date},x) => {
        const anunciosdelete = (id) =>{
            const datos = {
                id:id
            }
            // cuadro de confirmacion para eliminar regstro
            Swal.fire({
                title: `<strong>¿Desea eliminar: ${title}?</strong>`,
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText:'Eliminar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#3085d6',
                cancelButtonText:'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Putdata('anuncios/delete',datos).then(res => {
                        if(res.data.matchedCount > 0 ){
                            Alertas('Información',`Se eliminó  ${title} del sistema`)
                            setLoadusers(true)
                        }
                    })
                } 
            })
        }

        // se retorna lista 
        return <li key={x} className="list-group-item d-flex border-0 align-items-center justify-content-center">
                    <div className="ms-2 me-auto ">
                    <div className='text-primary fw-bold'>Titulo - {title} | Fecha - {date}</div>
                        <i className="bi bi-arrow-right-circle ms-3">{description}</i>
                    </div>
                    <span><a onClick={() => anunciosdelete(id)}><i className="bi bi-trash fs-4 px-2 text-danger"></i></a></span>
                    <span><a onClick={() => anunciosedit(info.data[x])}><i className="bi bi-pencil-square fs-4 px-2 text-success"></i></a></span>
                </li>
    }))
})   
}

const anunciosedit = ({id,title,description,date}) => {
    // se setean los valores en los input
    inptitle.current.value = title
    inpdescription.current.value = description
    inpdate.current.value = date

    const div = document.getElementById("btnsturelchange")
    div.innerHTML = ""

    setBtnprorel('Actualizar')

    // se crean los botones
    const btnedit = document.createElement('button')
    btnedit.setAttribute('class', 'btn btn-primary mx-3 my-3')
    btnedit.innerText = "Actualizar"
    btnedit.id = 'btn_insert_sche'
    btnedit.name = 'btn_insert_sche'
    btnedit.onclick = function() { anunciosupdate(id) }

    const btncancel = document.createElement('button')
    btncancel.setAttribute('class', 'btn btn-primary mx-3 my-3')
    btncancel.innerText = "Cancelar"
    btncancel.id = 'btn_cancel_sche'
    btncancel.name = 'btn_cancel_sche'
    btncancel.onclick = function() { anuncioscancel() }

    div.appendChild(btnedit)
    div.appendChild(btncancel)

}

const anuncioscancel = () => {
    const div = document.getElementById("btnsturelchange")
    div.innerHTML = ""
    setBtnprorel('Insertar')
    const btnedit = document.createElement('button')
    btnedit.setAttribute('class', 'btn btn-primary my-3')
    btnedit.innerText = "Insertar"
    btnedit.id = 'btn_insert_sche'
    btnedit.name = 'btn_insert_sche'
    btnedit.onclick = function() { insert() }
    div.appendChild(btnedit)
    inptitle.current.value  = ''
    inpdescription.current.value  = ''
    inpdate.current.value = ''
}

const anunciosupdate = (id) => {
    const inpT = inptitle.current.value.trim()
    const inpDes = inpdescription.current.value.trim()
    const inpDat = inpdate.current.value.trim()
    if(!inpT || !inpDes || !inpDat){
        Alertas('Información','Los campos no pueden estar vacíos')
        return false
    }

    const datos = {
        title:inpT,
        description:inpDes,
        date:inpDat,
        id:id
    }

    Putdata('anuncios/edit',datos).then((res) => {
        if(res.data.matchedCount > 0){
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
            inptitle.current.value = ''
            inpdescription.current.value = ''
            inpdate.current.value = ''
            setLoadusers(true)
            
        }else if(res.data.error){
            Alertas('Información', res.data.error)
            return false
        }
    })
}


  return (
          <main>
            <title>{'Anuncios'}</title>
            <Menu flag='anuncios' /> 
            <div className="container-fluid mt-5"> 
                <div className="row">
                    <div className="col-sm-12 col-md-6 mb-2" >
                        <div className="card h-100">
                            <h3 className="my-2 text-center">{btnprorel} anuncio</h3>
                            <div className="row align-items-center justify-content-center">
                                <label htmlFor="inptitle" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Título</label>
                                <div className="col-6">
                                    <input type="text" className="form-control border-primary my-3 " name='inptitle' id="inptitle"  ref={inptitle}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center">
                                <label htmlFor="inpdescription" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Descripción</label>
                                <div className="col-6">
                                    <input type="text" className="form-control border-primary my-3" name='inpdescription' id="inpdescription"  ref={inpdescription}/>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center">
                                <label htmlFor="inpdate" className="col-5 col-form-label col-form-label-sm fs-4 fw-bold">Fecha del evento</label>
                                <div className="col-6">
                                    <input type="date" className="form-control border-primary my-3" name='inpdate' id="inpdate"  ref={inpdate}/>
                                </div>
                            </div>
                            <div className="text-center" id="btnsturelchange"> <button className='btn btn-primary my-3 ' onClick={insert}>Insertar</button></div>
                        </div>
                        
                    </div>
                    <div className="col-sm-12 col-md-6 mb-2">
                    <div className="card h-100">
                            <h3 className="my-2 text-center">Anuncios</h3>
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