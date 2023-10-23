import Ads from "../components/functions/Ads"
import { Barcharts } from "../components/functions/Charts"
import Menu from "../components/menu/Menu"


export const metadata = {
    title:'Inicio',
    description: 'Inicio'
}

export default function Home(){
    return(
        <main>
            <title>{'Inicio'}</title>
            <Menu/>
            <div className="container"> 
                <div className="row">
                    <div className="col-sm-12 col-md-6 text-center" >
                        <h3 className="my-3">Notas estudiantes</h3>
                            <div style={{height:'250px'}}>
                            <Barcharts />
                            </div>
                    </div>
                    <div className="col-sm-12 col-md-6 text-center">
                        <h3 className="my-3">Anuncios</h3>
                            <Ads/>
                    </div>
                </div>
            </div>
        </main>
       
    )
}