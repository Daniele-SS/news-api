'use strict'

//Função assíncrona para retornar as noticias
async function getDadosNoticias() {
    const url       = `https://gnews.io/api/v4/top-headlines?category&lang=pt&country=br&max=10&apikey=1bf7720515e16b9161bdbfed9f6641a2`
    const response  = await fetch(url)
    const data      = await response.json()

    return data 
}