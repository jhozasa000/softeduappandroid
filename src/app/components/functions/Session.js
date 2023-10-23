"use client"
import { useEffect, useState } from 'react'
import { useRouter} from 'next/navigation' 
import { Reducer } from '../context/themecontext'
import { Alertas } from './helpers'
 
export default function Session() {
  const { datasite } = Reducer()
  const router = useRouter()
  const [loadsite, setLoadsite] = useState(true);
 
  useEffect(() => {

    if (!(datasite.user)) {
     // router.push('/')
      setLoadsite(false)
    }
  }, [datasite.user,loadsite])

    if(!loadsite){
       // Alertas('Iniciar sesión', 'Ingresar datos para acceder al sistema')
    }
}
