# 📰 DNews | Portal de Notícias & Cotações em Tempo Real

O **DNews** é uma interface moderna de notícias projetada com foco em performance e legibilidade. O projeto consome APIs globais para exibir manchetes atualizadas e um ticker financeiro dinâmico, utilizando uma estrutura de design baseada nos grandes portais de comunicação.

---

## 🚀 Funcionalidades

*   **Agregador de Notícias:** Consome a [GNews API](https://gnews.io/) para trazer manchetes em tempo real.
*   **Ticker Financeiro:** Barra animada com cotações de moedas (USD, EUR, GBP, ARS) e criptomoedas (BTC, ETH) via [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas).
*   **Barra Breaking News:** Um ticker secundário que destaca os títulos das notícias principais com scroll contínuo.
*   **Filtros Inteligentes:** Navegação entre categorias como Tecnologia, Economia, Esportes e Saúde.
*   **Layout Adaptativo:** Design totalmente responsivo (Mobile First) utilizando CSS Grid e Flexbox.
*   **Formatação de Tempo:** Lógica JavaScript para exibir o tempo relativo da publicação (ex: "Há 2 horas").

---

## 🛠️ Tecnologias

*   **Frontend:** HTML5, CSS3 (Variáveis nativas e Animações Keyframes).
*   **Lógica:** JavaScript (ES6+), Fetch API, Async/Await.
*   **Design:** Google Fonts (Bebas Neue, Merriweather, Source Sans 3).

---

## 📦 Como Instalar e Usar

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/dnews.git](https://github.com/seu-usuario/dnews.git)
    ```

2. **Obtenha uma Chave de API:**

* Cadastre-se gratuitamente em [GNews API](https://gnews.io/dashboard)

* Copie sua API Key.

3. **Configure o projeto:**

Abra o arquivo app.js e substitua o valor da constante API_KEY:

```const API_KEY = 'SUA_CHAVE_AQUI';```

4.  **Execute:**
    *   Abra o `index.html` diretamente no seu navegador ou utilize a extensão *Live Server* no VS Code.

---

## 🖼️ Estrutura do Layout

O layout foi dividido em zonas de prioridade visual:

| Seção | Descrição |
| :--- | :--- |
| **Navbar** | Menu de categorias e busca rápida. |
| **Cotações** | Ticker financeiro com variação percentual (verde/vermelho). |
| **Hero Card** | Notícia principal com maior destaque e descrição. |
| **Grid Secundário** | Mosaico de notícias complementares com imagens. |
| **Lista** | Feed vertical para leitura rápida de últimas notícias. |

---

## 📝 Licença

Este projeto é de uso livre para fins de estudo e portfólio. As APIs utilizadas possuem seus próprios termos de uso.

---
