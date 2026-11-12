🎵 Harmonia - Aplicação Interativa de Teoria Musical e Cifras

O Harmonia é uma plataforma web interativa desenvolvida em React para estudantes de música, instrumentistas e entusiastas. O aplicativo permite visualizar acordes em múltiplos instrumentos (braço de violão/guitarra, teclado e pauta musical), acompanhar a progressão harmônica de músicas em tempo real e aprender conceitos teóricos de forma prática.

🚀 Funcionalidades Principais

🎸 Visualização de Instrumentos:

Braço de Violão/Guitarra (Fretboard): Posições exatas das notas e dedos nas casas.

Teclado/Piano: Mapeamento visual das teclas ativas para cada acorde.

Pauta Musical (Staff): Representação em notação tradicional de partitura.

⏱️ Linha do Tempo de Acordes (Chord Timeline):

Player para acompanhar visualmente as sequências harmônicas e ritmo das músicas.

📥 Importador de Cifras (Importer):

Módulo para inserir, formatar e adaptar novas canções à biblioteca do app.

📚 Módulo de Aprendizado & FAQ:

Conteúdos educativos para consulta rápida de teoria musical e dúvidas frequentes.

🤖 Assistente Virtual:

Chat/guia interativo integrado para auxílio no estudo e tirar dúvidas de teoria.

🛠️ Tecnologias Utilizadas

React — Biblioteca principal de interface.

Vite — Build tool e servidor de desenvolvimento de alta performance.

Tailwind CSS — Estilização moderna baseada em classes utilitárias.

JavaScript (ES6+) — Estrutura de dados e lógica das rotas.

💻 Execução Local (Ambiente de Desenvolvedor)


🌐 Deploy no GitHub Pages

O projeto foi configurado com a propriedade base: '/harmoniamusica/' no vite.config.js para ser servido diretamente no GitHub Pages.

Para publicação automatizada via GitHub Actions, o fluxo compila a branch main e publica o resultado compilado na branch gh-pages.

📁 Estrutura de Diretórios

harmonia/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── src/
    ├── App.jsx            # Componente raiz da aplicação
    ├── main.jsx           # Ponto de entrada do React
    ├── theme.js          # Definições de cores e tema
    ├── components/
    │   ├── chat/          # Componente do assistente virtual
    │   ├── instruments/   # Visualizadores (Piano, Fretboard, ChordView)
    │   ├── player/        # Linha do tempo de execução de acordes
    │   ├── score/         # Pauta musical / Partitura
    │   └── ui/            # Ícones e elementos visuais genéricos
    ├── data/              # Acordes, músicas e perguntas frequentes
    ├── hooks/             # Custom hooks (gerenciamento de rotas)
    └── pages/             # Páginas (Home, SongView, Learn, Importer)


📄 Licença

Projeto desenvolvido para fins educacionais e de estudo.
