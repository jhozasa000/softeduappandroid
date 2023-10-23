// se importan librerias globlaes de estilos y componentes
import './globals.css'
import { Roboto } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Context }  from './components/context/themecontext';
import { StrictMode } from 'react';
const roboto = Roboto({
  weight: ['300'],
  style: ['normal'],
  subsets: ['latin'],
})


export default function RootLayout({ children }) {
  return (
    <>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={'bg-light '+roboto.className}>
         <Context>{children}</Context>
        </body>
    </html>
    </>
    
  )
}
