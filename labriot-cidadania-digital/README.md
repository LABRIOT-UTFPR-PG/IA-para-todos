# Portal de Cidadania Digital — LABRIOT UTFPR

Aplicação web estática (HTML, CSS e JavaScript puro) projetada para rodar em computadores de laboratório em **rotação por estações/blocos com duplas de alunos** (com ou sem internet) e hospedável diretamente na **Vercel**.

## Recursos para Uso em Sala de Aula (Duplas & Bancadas)
- **Identificação da Dupla**: Campos para Integrante 1, Integrante 2 e Turma, com salvamento automático no navegador (`localStorage`) para evitar perda de dados ao atualizar a página.
- **Modo Bloco Fixo por Computador (`⚙️ Bancada #X`)**: Permite travar cada computador da sala em um bloco específico (Bloco 01, 02, 03 ou 04) ou abrir diretamente via URL, por exemplo:
  - `?bancada=1&bloco=aula1&fixo=1`
  - `?bancada=2&bloco=aula2&fixo=1`
  - `?bancada=3&bloco=aula3&fixo=1`
  - `?bancada=4&bloco=aula4&fixo=1`
- **Registro e Histórico de Entregas**: Ao final de cada bloco, a dupla conclui e salva sua entrega no computador. Depois basta clicar em **Preparar para a Próxima Dupla** para zerar a tela sem apagar o histórico salvo. O professor pode visualizar todas as entregas em **⚙️ Bancada → Entregas Salvas** e baixar o relatório em `.txt`.
- **Atividades Interativas Aprimoradas**:
  - **Bloco 01**: Loja com 3 apps grátis, medidor de exposição, comparação entre permissões necessárias e abusivas, 2 casos de metadados com correção detalhada e debate guiado em dupla.
  - **Bloco 02**: Termos de Uso com cronômetro real, marcação interativa de cláusulas armadilha, 3 missões LGPD com checklist e modelo de apoio, e cartaz imprimível com os nomes da dupla.
  - **Bloco 03**: Laboratório Raio-X de Deepfakes com painéis visuais SVG interativos (vídeo, foto e áudio clonado) + modo de ajuda Raio-X.
  - **Bloco 04**: 3 casos no Método SIFT offline (com rastreamento das 4 abas investigadas) + gerador de cartão de campanha imprimível.

## Estrutura de Arquivos
- `index.html`: Estrutura principal, cabeçalho institucional LABRIOT / UTFPR e container de modal.
- `style.css`: Identidade visual (marrom escuro, amarelo UTFPR e fundo claro) + suporte a impressão dos cartazes e campanhas gerados pelas duplas.
- `data.js`: Banco de conteúdo dos 4 blocos (apps, casos de metadados, cláusulas, missões LGPD, casos de Deepfake e notícias SIFT).
- `app.js`: Lógica das estações, persistência local, painéis SVG interativos, verificadores e painel do professor.
- `vercel.json`: Configuração de deploy estático na Vercel.

## Como subir na Vercel
1. Crie um repositório no GitHub com estes arquivos e importe na Vercel (Framework Preset: **Other**), **ou**
2. Instale a CLI da Vercel (`npm i -g vercel`) e rode `vercel --prod` dentro desta pasta.
