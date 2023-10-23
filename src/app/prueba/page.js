"use client"
import { list } from '@vercel/blob';
import { useEffect } from 'react';
import 'dotenv/config'


export default function listblob(){

    useEffect(() => {
        lists()
    }, []);
     
    const lists =  async () => {
        const blobs  = await list({
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        console.log(blobs);
    }
   

    return <h1>llego</h1>
}

