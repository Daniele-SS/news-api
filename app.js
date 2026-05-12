'use strict'

const API_KEY = '1bf7720515e16b9161bdbfed9f6641a2'

const CATEGORIAS = {
    general: 'Geral', nation: 'Nação', world: 'Mundo',
    business: 'Economia', technology: 'Tecnologia',
    entertainment: 'Entretenimento', sports: 'Esportes',
    science: 'Ciência', health: 'Saúde'
}

// Pares de moeda a exibir na barra (símbolo → nome exibido)
const MOEDAS = [
    { par: 'USD-BRL', nome: 'USD',  prefixo: 'R$' },
    { par: 'EUR-BRL', nome: 'EUR',  prefixo: 'R$' },
    { par: 'GBP-BRL', nome: 'GBP',  prefixo: 'R$' },
    { par: 'BTC-BRL', nome: 'BTC',  prefixo: 'R$' },
    { par: 'ETH-BRL', nome: 'ETH',  prefixo: 'R$' },
    { par: 'USD-BRL', nome: 'IBOV', prefixo: ''   }, // placeholder visual
]

// ── COTAÇÕES (AwesomeAPI — gratuita, sem chave) ──
async function buscarCotacoes() {
    try {
        const pares = ['USD-BRL', 'EUR-BRL', 'GBP-BRL', 'BTC-BRL', 'ETH-BRL', 'ARS-BRL']
        const url   = `https://economia.awesomeapi.com.br/json/last/${pares.join(',')}`
        const res   = await fetch(url)
        const data  = await res.json()
        return data
    } catch (e) {
        console.warn('Cotações indisponíveis:', e)
        return null
    }
}

function renderCotacoes(data) {
    const inner = document.getElementById('cotacoes-inner')
    if (!inner || !data) return

    const itens = [
        { key: 'USDBRL', nome: 'USD',  formato: (v) => `R$ ${parseFloat(v).toFixed(2)}` },
        { key: 'EURBRL', nome: 'EUR',  formato: (v) => `R$ ${parseFloat(v).toFixed(2)}` },
        { key: 'GBPBRL', nome: 'GBP',  formato: (v) => `R$ ${parseFloat(v).toFixed(2)}` },
        { key: 'ARSBRL', nome: 'ARS',  formato: (v) => `R$ ${parseFloat(v).toFixed(4)}` },
        { key: 'BTCBRL', nome: 'BTC',  formato: (v) => `R$ ${Number(parseFloat(v).toFixed(0)).toLocaleString('pt-BR')}` },
        { key: 'ETHBRL', nome: 'ETH',  formato: (v) => `R$ ${Number(parseFloat(v).toFixed(0)).toLocaleString('pt-BR')}` },
    ]

    // Duplica para o ticker ficar contínuo
    const todosItens = [...itens, ...itens]

    inner.innerHTML = todosItens.map(({ key, nome, formato }) => {
        const item = data[key]
        if (!item) return ''
        const variacao  = parseFloat(item.pctChange)
        const direcao   = variacao >= 0 ? 'up' : 'down'
        const varStr    = `${variacao >= 0 ? '+' : ''}${variacao.toFixed(2)}%`
        return `
            <div class="cotacao-item">
                <span class="cotacao-nome">${nome}</span>
                <span class="cotacao-valor">${formato(item.bid)}</span>
                <span class="cotacao-variacao ${direcao}">${varStr}</span>
            </div>
        `
    }).join('')

    // Animação contínua proporcional
    requestAnimationFrame(() => {
        const largura  = inner.scrollWidth / 2
        const duracao  = Math.round(largura / 80) // px/s
        inner.style.animation = 'none'
        inner.getBoundingClientRect()
        inner.style.animation = `cotacoes-scroll ${duracao}s linear infinite`
    })
}

// Injeta keyframe da animação de cotações dinamicamente
const styleSheet = document.createElement('style')
styleSheet.textContent = `
    @keyframes cotacoes-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
`
document.head.appendChild(styleSheet)

// ── NOTICIAS ──
async function getDadosNoticias(category = 'nation') {
    const cat = category.trim().toLowerCase() || 'nation'
    const url = `https://gnews.io/api/v4/top-headlines?category=${cat}&lang=pt&country=br&max=10&apikey=${API_KEY}`
    const res  = await fetch(url)
    return res.json()
}

function formatarTempo(publishedAt) {
    if (!publishedAt) return ''
    const diff    = Date.now() - new Date(publishedAt).getTime()
    const diffMin = Math.floor(diff / 60000)
    const diffH   = Math.floor(diffMin / 60)
    const diffD   = Math.floor(diffH / 24)
    if (diffMin < 2)  return 'Agora mesmo'
    if (diffMin < 60) return `Há ${diffMin} min`
    if (diffH < 24)   return `Há ${diffH}h`
    return `Há ${diffD}d`
}

function criarPlaceholder() {
    const div = document.createElement('div')
    div.className = 'card-img-placeholder'
    div.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`
    return div
}

function criarImgWrap(article, className) {
    const wrap = document.createElement('div')
    wrap.className = 'card-img-wrap'
    if (article.image) {
        const img = document.createElement('img')
        img.src = article.image
        img.alt = article.title
        img.loading = 'lazy'
        img.onerror = () => wrap.replaceChildren(criarPlaceholder())
        wrap.appendChild(img)
    } else {
        wrap.appendChild(criarPlaceholder())
    }
    return wrap
}

function criarCardHero(article) {
    const card = document.createElement('article')
    card.className = 'card-hero'
    card.onclick = () => window.open(article.url, '_blank')
    card.appendChild(criarImgWrap(article))
    card.insertAdjacentHTML('beforeend', `
        <div class="card-source">${article.source?.name ?? 'DNews'}</div>
        <h2 class="card-title">${article.title}</h2>
        <p class="card-desc">${article.description ?? ''}</p>
        <div class="card-meta">
            <span class="card-time">${formatarTempo(article.publishedAt)}</span>
            <a class="card-read-more" href="${article.url}" target="_blank" onclick="event.stopPropagation()">Ler mais →</a>
        </div>
    `)
    return card
}

function criarCardSecundario(article) {
    const card = document.createElement('article')
    card.className = 'card-secondary'
    card.onclick = () => window.open(article.url, '_blank')
    card.appendChild(criarImgWrap(article))
    card.insertAdjacentHTML('beforeend', `
        <div class="card-source">${article.source?.name ?? 'DNews'}</div>
        <h3 class="card-title">${article.title}</h3>
        <div class="card-meta">
            <span class="card-time">${formatarTempo(article.publishedAt)}</span>
            <a class="card-read-more" href="${article.url}" target="_blank" onclick="event.stopPropagation()">Ler mais →</a>
        </div>
    `)
    return card
}

function criarCardMedio(article) {
    const card = document.createElement('article')
    card.className = 'card-medio'
    card.onclick = () => window.open(article.url, '_blank')
    card.appendChild(criarImgWrap(article))
    card.insertAdjacentHTML('beforeend', `
        <div class="card-source">${article.source?.name ?? 'DNews'}</div>
        <h3 class="card-title">${article.title}</h3>
        <div class="card-meta">
            <span class="card-time">${formatarTempo(article.publishedAt)}</span>
            <a class="card-read-more" href="${article.url}" target="_blank" onclick="event.stopPropagation()">Ler mais →</a>
        </div>
    `)
    return card
}

function criarCardLista(article) {
    const item = document.createElement('div')
    item.className = 'card-lista'
    item.onclick = () => window.open(article.url, '_blank')

    const img = document.createElement('img')
    img.className = 'card-lista-img'
    img.src = article.image ?? ''
    img.alt = article.title
    img.loading = 'lazy'
    img.onerror = () => img.style.display = 'none'

    item.appendChild(img)
    item.insertAdjacentHTML('beforeend', `
        <div class="card-lista-body">
            <div class="card-lista-source">${article.source?.name ?? 'DNews'}</div>
            <div class="card-lista-title">${article.title}</div>
            <div class="card-lista-time">${formatarTempo(article.publishedAt)}</div>
        </div>
    `)
    return item
}

function setStatus(msg) {
    document.getElementById('container-noticias').innerHTML = `<p class="mensagem-status">${msg}</p>`
    document.getElementById('container-mais').innerHTML = ''
    document.getElementById('container-lista').innerHTML = ''
}

function atualizarSectionLabel(cat) {
    const l1 = document.querySelector('.section-label')
    const l2 = document.getElementById('label-mais')
    if (l1) l1.textContent = CATEGORIAS[cat] ?? cat
    if (l2) l2.textContent = `Mais: ${CATEGORIAS[cat] ?? cat}`
}

function atualizarBreakingTicker(articles) {
    const el = document.getElementById('breaking-text')
    if (!el || !articles?.length) return
    el.textContent = articles.map(a => a.title).join('   ·   ')
    requestAnimationFrame(() => {
        const duracao = Math.round(el.scrollWidth / 100)
        el.style.animation = 'none'
        el.getBoundingClientRect()
        el.style.animation = `ticker ${duracao}s linear infinite`
    })
}

async function principaisNoticias(categoria = 'nation') {
    const btn   = document.getElementById('btn-pesquisar')
    const input = document.getElementById('category')
    const cat   = categoria || input.value.trim().toLowerCase() || 'nation'

    btn.disabled = true
    setStatus('Carregando notícias...')
    atualizarSectionLabel(cat)

    try {
        const resultado = await getDadosNoticias(cat)

        if (!resultado.articles?.length) {
            setStatus('Nenhuma notícia encontrada. Tente: general, nation, technology, sports, health...')
            return
        }

        atualizarBreakingTicker(resultado.articles)

        const articles = resultado.articles
        // Bloco 1: hero + 4 secundários (índices 0–4)
        const containerPrincipal = document.getElementById('container-noticias')
        const [hero, ...resto] = articles
        containerPrincipal.replaceChildren(
            criarCardHero(hero),
            ...resto.slice(0, 4).map(criarCardSecundario)
        )

        // Bloco 2: 3 cards médios (índices 5–7)
        const containerMais = document.getElementById('container-mais')
        const maisCards = resto.slice(4, 7).map(criarCardMedio)
        containerMais.replaceChildren(...maisCards)

        // Bloco 3: lista das restantes (índices 8–9)
        const containerLista = document.getElementById('container-lista')
        const listaCards = resto.slice(7).map(criarCardLista)
        if (listaCards.length > 0) {
            containerLista.replaceChildren(...listaCards)
        } else {
            containerLista.innerHTML = ''
        }

    } catch (erro) {
        console.error('Erro ao buscar notícias:', erro)
        setStatus('Erro ao carregar notícias. Verifique sua conexão.')
    } finally {
        btn.disabled = false
    }
}

// ── EVENT LISTENERS ──
document.getElementById('btn-pesquisar').addEventListener('click', () => principaisNoticias())
document.getElementById('category').addEventListener('keydown', e => {
    if (e.key === 'Enter') principaisNoticias()
})
document.querySelectorAll('.nav-links a[data-cat]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault()
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'))
        link.classList.add('active')
        document.getElementById('category').value = link.dataset.cat
        principaisNoticias(link.dataset.cat)
    })
})

// ── INIT ──
buscarCotacoes().then(renderCotacoes)
principaisNoticias('nation')

// Atualiza cotações a cada 60s
setInterval(() => buscarCotacoes().then(renderCotacoes), 60000)