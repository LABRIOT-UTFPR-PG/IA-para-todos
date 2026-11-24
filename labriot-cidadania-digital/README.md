# Portal de Cidadania Digital — LABRIOT UTFPR

Aplicação web estática (HTML, CSS e JavaScript puro) projetada para rodar em 5 computadores de laboratório (com ou sem internet) e hospedável diretamente na **Vercel**.

## Estrutura de Arquivos
- `index.html`: Estrutura principal e cabeçalho institucional LABRIOT / UTFPR.
- `style.css`: Identidade visual (marrom escuro, amarelo UTFPR e fundo claro) + suporte a impressão dos cartazes gerados pelos alunos.
- `data.js`: Banco de conteúdo das 4 aulas (Apps grátis, pistas de metadados, missões LGPD, casos de Deepfake e notícias SIFT).
- `app.js`: Lógica interativa das estações/bancadas, cronômetro de 8 segundos e verificadores.
- `vercel.json`: Configuração de deploy estático na Vercel.

## Como subir na Vercel
1. Crie um repositório no GitHub com estes arquivos e importe na Vercel (Framework Preset: **Other**), **ou**
2. Instale a CLI da Vercel (`npm i -g vercel`) e rode `vercel --prod` dentro desta pasta.
