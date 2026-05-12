'use strict'

async function getDadosNoticias(category) {
    const url      = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=pt&country=br&max=10&apikey=1bf7720515e16b9161bdbfed9f6641a2`
    const response = await fetch(url)
    const data     = await response.json()
    
    return data
}

function criarCard(article) {
    const card = document.createElement('div')
    card.className = 'card'

    const img = document.createElement('img')
    img.src = article.image ?? ''
    img.alt = article.title

    const texto = document.createElement('div')
    texto.className = 'card-text'
    texto.textContent = article.title

    card.appendChild(img)
    card.appendChild(texto)
    return card
}

function setStatus(mensagem) {
    const container = document.getElementById('container-noticias')
    const el = document.createElement('p')
    el.className = 'mensagem-status'
    el.textContent = mensagem
    container.replaceChildren(el)
}

async function principaisNoticias() {
    const container  = document.getElementById('container-noticias')
    const input      = document.getElementById('category')
    const btn        = document.getElementById('btn-pesquisar')
    const categoria  = input.value.trim() || 'nation'

    btn.disabled = true
    setStatus('Carregando notícias...')

    try {
        const resultado = await getDadosNoticias(categoria)
        console.log(resultado)

        if (!resultado.articles || resultado.articles.length === 0) {
            setStatus('Nenhuma notícia encontrada para essa categoria.')
            return
        }

        container.replaceChildren(...resultado.articles.map(criarCard))

    } catch (erro) {
        console.error('Erro ao buscar notícias:', erro)
        setStatus('Erro ao carregar notícias. Verifique sua conexão.')
    } finally {
        btn.disabled = false
    }
}

// Carrega notícias nacionais ao abrir a página
principaisNoticias()

// Botão de busca
document.getElementById('btn-pesquisar').addEventListener('click', principaisNoticias)

// Enter no campo também dispara a busca
document.getElementById('category').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') principaisNoticias()
})
