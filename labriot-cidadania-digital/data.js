const LESSONS_META = [
  {
    key: 'aula1',
    number: '01',
    tag: 'Bloco 01 • Privacidade',
    title: 'Seus Dados & Pegadas Digitais',
    summary: 'Descubra como apps "grátis" ganham dinheiro com suas permissões e investigue pistas de metadados.',
    highlight: true,
    pairTip: 'Um integrante assume o papel de usuário curioso e o outro de detetive dos dados — discutam antes de marcar!'
  },
  {
    key: 'aula2',
    number: '02',
    tag: 'Bloco 02 • Privacidade',
    title: 'Termos de Uso & Direitos LGPD',
    summary: 'Enfrente o desafio dos 8 segundos, exercite seus direitos na lei e crie o Cartaz da Escola.',
    highlight: true,
    pairTip: 'Leiam as cláusulas juntos e dividam as tarefas para montar o pedido LGPD e o cartaz da escola.'
  },
  {
    key: 'aula3',
    number: '03',
    tag: 'Bloco 03 • Deepfakes',
    title: 'Ver para Crer? Raio-X de Deepfakes',
    summary: 'Inspecione imagens, vídeos e áudios suspeitos para encontrar falhas clássicas da Inteligência Artificial.',
    highlight: false,
    pairTip: 'Olhem com calma no modo Raio-X: cada pessoa da dupla pode procurar um tipo de pista diferente!'
  },
  {
    key: 'aula4',
    number: '04',
    tag: 'Bloco 04 • Fake News',
    title: 'Detetives SIFT & Campanha Escolar',
    summary: 'Investigue boatos virais em 4 passos (SIFT) offline e crie uma campanha gentil contra desinformação.',
    highlight: false,
    pairTip: 'Só carimbem o veredito depois de passar pelas 4 abas S-I-F-T e concordarem com a justificativa!'
  }
];

const LESSONS_DATA = {
  apps: [
    {
      id: "super-corrida",
      name: "Super Corrida Turbo 3D",
      icon: "🏎️",
      category: "Jogo Grátis",
      description: "Jogo de corrida offline com carrinhos personalizáveis.",
      permissions: [
        {
          key: "save",
          label: "Armazenamento local (salvar pontuação)",
          value: 0,
          necessary: true,
          reason: "Necessária! O jogo realmente precisa guardar suas fases e recordes no aparelho."
        },
        {
          key: "loc",
          label: "Localização exata em tempo real (GPS)",
          value: 7,
          necessary: false,
          reason: "Abusiva! Um jogo de corrida não precisa saber onde você mora, estuda ou passeia para vender anúncios locais."
        },
        {
          key: "contacts",
          label: "Lista completa de amigos e contatos",
          value: 5,
          necessary: false,
          reason: "Desnecessária! Serve para mapear sua rede de amizades e enviar convites automáticos."
        },
        {
          key: "time",
          label: "Horários em que você usa o celular",
          value: 5,
          necessary: false,
          reason: "Invasiva! Descobre quando você dorme, estuda e quando está mais propenso a clicar em propagandas."
        },
        {
          key: "search",
          label: "Histórico de vídeos e pesquisas",
          value: 8,
          necessary: false,
          reason: "Muito valiosa! Revela quais brinquedos, tênis ou jogos você quer comprar para direcionar anúncios."
        }
      ]
    },
    {
      id: "filtro-magico",
      name: "Filtro Mágico FaceFun",
      icon: "🤳",
      category: "Fotos & Vídeos Grátis",
      description: "Aplica orelhas de cachorro e efeitos divertidos em selfies.",
      permissions: [
        {
          key: "cam",
          label: "Câmera apenas enquanto o app estiver aberto",
          value: 0,
          necessary: true,
          reason: "Necessária! Sem a câmera ligada na hora da foto, o filtro não funciona."
        },
        {
          key: "photos",
          label: "Galeria completa de fotos antigas e rostos",
          value: 10,
          necessary: false,
          reason: "Alerta! Permite copiar todas as suas fotos antigas para treinar sistemas de reconhecimento facial."
        },
        {
          key: "mic",
          label: "Microfone e áudio ambiente em segundo plano",
          value: 7,
          necessary: false,
          reason: "Suspeita! O app pode identificar o que você assiste na TV ou conversas no quarto."
        },
        {
          key: "loc",
          label: "Cidade, bairro e locais frequentados",
          value: 4,
          necessary: false,
          reason: "Desnecessária! Usada para direcionar propagandas de lojas e eventos próximos."
        },
        {
          key: "device",
          label: "Modelo do aparelho e tempo de tela",
          value: 3,
          necessary: false,
          reason: "Monitoramento! Ajuda a calcular seu poder de compra e quanto tempo você olha para anúncios."
        }
      ]
    },
    {
      id: "lanterna-pro",
      name: "Lanterna & Bússola Pro",
      icon: "🔦",
      category: "Utilitário Grátis",
      description: "Acende o flash da câmera para iluminar no escuro.",
      permissions: [
        {
          key: "flash",
          label: "Controle do flash da câmera",
          value: 0,
          necessary: true,
          reason: "Necessária! É a única coisa que uma lanterna precisa para funcionar."
        },
        {
          key: "calls",
          label: "Registro de ligações e número de telefone",
          value: 8,
          necessary: false,
          reason: "Perigo! Uma lanterna nunca precisa ler quem ligou para você."
        },
        {
          key: "contacts",
          label: "Agenda de contatos da família",
          value: 6,
          necessary: false,
          reason: "Abusiva! Dados vendidos para listas de telemarketing e spam."
        },
        {
          key: "loc",
          label: "GPS ligado mesmo com a tela apagada",
          value: 7,
          necessary: false,
          reason: "Rastreamento oculto! Acompanha seus trajetos diários sem você perceber."
        }
      ]
    }
  ],

  metadataCases: [
    {
      id: "meta1",
      title: "Caso 1: O Perfil Misterioso da Noite",
      context: "Sem ler o conteúdo de nenhuma mensagem, o algoritmo juntou apenas horários, locais e cliques:",
      clues: [
        "🕒 02:45 da manhã — Abriu um jogo online e ficou conectado por 1h30.",
        "🔍 14:10 da tarde — Pesquisou 'chuteira infantil promoção' e 'final do campeonato'.",
        "📍 16:00 da tarde — Localização registrada em uma quadra de esportes do bairro.",
        "💬 19:20 da noite — Enviou 45 mensagens seguidas para o mesmo contato favorito."
      ],
      deductions: [
        {
          id: "d1",
          text: "Provavelmente dorme tarde ou tem pouco sono nos dias em que joga.",
          correct: true,
          feedback: "Correto! A pista das 02:45 da manhã mostra atividade na madrugada."
        },
        {
          id: "d2",
          text: "Tem interesse em futebol e é um alvo fácil para anúncios de artigos esportivos.",
          correct: true,
          feedback: "Correto! A pesquisa de chuteira + presença na quadra confirmam esse perfil."
        },
        {
          id: "d3",
          text: "Gosta de ler livros de culinária francesa.",
          correct: false,
          feedback: "Incorreto! Nenhuma pista de horário, local ou busca aponta para culinária."
        },
        {
          id: "d4",
          text: "Tem um contato de muita confiança com quem conversa com frequência.",
          correct: true,
          feedback: "Correto! O volume alto de mensagens repetidas revela proximidade mesmo sem ler o texto."
        }
      ]
    },
    {
      id: "meta2",
      title: "Caso 2: A Rotina Antes da Prova",
      context: "Agora analisem os metadados de outro aparelho durante uma terça-feira comum:",
      clues: [
        "🚌 07:10 da manhã — Conexão ao Wi-Fi do ponto de ônibus próximo à escola.",
        "🔕 07:30 às 11:50 — Celular ficou parado no modo silencioso no mesmo prédio.",
        "🔍 22:40 da noite — Pesquisou 'dicas para não ficar nervoso na prova de matemática'.",
        "🛒 23:05 da noite — Viu um vídeo curto sobre canetas marca-texto."
      ],
      deductions: [
        {
          id: "m2d1",
          text: "Estuda no período da manhã e vai para a escola por volta das 7h.",
          correct: true,
          feedback: "Correto! O horário e o local fixo das 7h30 às 11h50 indicam rotina escolar matinal."
        },
        {
          id: "m2d2",
          text: "Está preocupado com uma avaliação escolar e pode receber anúncios de cursos ou reforço.",
          correct: true,
          feedback: "Correto! Empresas usam buscas de ansiedade e estudo para direcionar propagandas na hora exata."
        },
        {
          id: "m2d3",
          text: "Trabalha como motorista de ônibus durante a madrugada.",
          correct: false,
          feedback: "Incorreto! Só há um registro no ponto de ônibus às 07:10, típico de passageiro."
        },
        {
          id: "m2d4",
          text: "É provável que clique em anúncios de material de papelaria.",
          correct: true,
          feedback: "Correto! O histórico recente mostra interesse em itens escolares."
        }
      ]
    }
  ],

  debateRoles: {
    question: "Se uma loja descobre pelos seus dados que você está ansioso por um tênis ou jogo específico e cobra mais caro só de você, isso é justo?",
    roleA: "🗣️ Integrante 1 (Visão do Consumidor): Explique como você se sentiria e quais riscos isso traz para famílias e estudantes.",
    roleB: "🏢 Integrante 2 (Regra de Proteção): Proponham uma regra que toda empresa deveria ser obrigada a seguir para evitar abusos."
  },

  tosClauses: [
    {
      id: "cl1",
      title: "CLÁUSULA 1 — DO ACESSO GERAL",
      text: "Ao utilizar esta plataforma gratuita, o usuário declara estar ciente de que todas as interações, cliques, pausas de tela e preferências serão catalogadas em servidores internacionais por tempo indeterminado.",
      trapSummary: "Vigilância contínua: seus cliques e até onde você para a tela são gravados sem prazo para apagar."
    },
    {
      id: "cl2",
      title: "CLÁUSULA 2 — DA LICENÇA DE IMAGEM E VOZ",
      text: "O usuário concede à empresa licença mundial, irrevogável, gratuita e eterna para reproduzir, modificar e distribuir qualquer foto, desenho ou texto publicado, inclusive após o encerramento da conta.",
      trapSummary: "Fotos para sempre: mesmo se você apagar a conta, a empresa continua podendo usar suas imagens."
    },
    {
      id: "cl3",
      title: "CLÁUSULA 3 — TREINAMENTO DE INTELIGÊNCIA ARTIFICIAL",
      text: "Todos os textos, áudios e imagens enviados poderão ser utilizados para treinar algoritmos comerciais e robôs de aprendizado de máquina, sem qualquer pagamento ou aviso prévio ao autor.",
      trapSummary: "Robôs aprendendo com você: seus trabalhos, áudios e fotos treinam IAs comerciais sem permissão extra."
    },
    {
      id: "cl4",
      title: "CLÁUSULA 4 — ARBITRAGEM E RECLAMAÇÕES",
      text: "Em caso de conflito, o usuário renuncia ao direito de abrir processos coletivos, devendo resolver qualquer disputa em foro privado escolhido exclusivamente pela plataforma.",
      trapSummary: "Reclamar fica difícil: tenta impedir que usuários se juntem para exigir seus direitos na justiça."
    }
  ],

  lgpdMissions: [
    {
      id: "acesso",
      team: "Missão A — Direito de Acesso",
      badge: "👁️ ACESSO AOS DADOS",
      scenario: "O aplicativo 'Super Corrida' mostra anúncios muito específicos para você, mas você não sabe o que ele anotou no seu perfil.",
      task: "Escreva um pedido oficial ao suporte do app exigindo saber quais dados pessoais eles guardaram sobre você e para que usam.",
      template: "Olá, equipe de suporte. Com base na LGPD (Lei Geral de Proteção de Dados), solicito a lista completa dos meus dados pessoais armazenados no aplicativo 'Super Corrida' e a explicação de como e com quem eles são compartilhados.",
      checklist: [
        "Citar o nome do aplicativo ou conta",
        "Pedir a lista dos dados armazenados",
        "Perguntar para que finalidade são usados"
      ]
    },
    {
      id: "eliminacao",
      team: "Missão B — Eliminação de Conta de Menor",
      badge: "🗑️ ELIMINAÇÃO (LGPD)",
      scenario: "Uma criança de 10 anos criou uma conta em uma rede social sem a permissão dos pais ou responsáveis (o que a lei brasileira exige para menores de 12 anos).",
      task: "Escreva o pedido formal exigindo que a empresa apague imediatamente todos os dados e fotos da criança, de graça.",
      template: "Prezados, conforme a LGPD exige consentimento dos responsáveis para menores de 12 anos, solicitamos a exclusão imediata e gratuita da conta, fotos e todos os dados coletados sem autorização.",
      checklist: [
        "Explicar que não houve permissão dos pais/responsáveis",
        "Exigir a exclusão dos dados e fotos",
        "Reforçar que o atendimento deve ser gratuito"
      ]
    },
    {
      id: "revogacao",
      team: "Missão C — Mudar de Ideia (Revogação)",
      badge: "🚫 REVOGAR PERMISSÃO",
      scenario: "No mês passado você clicou em 'Permitir Localização' em um jogo, mas agora percebeu que ele não precisa saber onde você está.",
      task: "Escreva uma solicitação pedindo para o app parar de usar sua localização para mostrar anúncios.",
      template: "Olá! Exercendo meu direito de revogação do consentimento previsto na LGPD, solicito que o aplicativo pare imediatamente de coletar e utilizar minha localização para publicidade.",
      checklist: [
        "Informar que está revogando a permissão dada antes",
        "Especificar o dado (localização)",
        "Pedir o fim do uso para anúncios"
      ]
    }
  ],

  deepfakeCases: [
    {
      id: "df1",
      type: "video",
      title: "Caso 1: Vídeo do Jogador Famoso Anunciando Prêmio Grátis",
      description: "Um vídeo circula nos grupos dizendo que um craque da seleção está doando videogames para quem clicar num link.",
      imageSummary: "🎥 Cena analisada: Rosto iluminado de frente em um estúdio escuro, falando rápido com entusiasmo.",
      clues: [
        {
          id: "c1",
          label: "Olhos e Piscadas: O jogador fica 18 segundos seguidos sem piscar nenhuma vez.",
          shortTag: "Olhos (18s sem piscar)",
          isFakeClue: true,
          explanation: "Acertou! Modelos de IA muitas vezes esquecem ou erram o ritmo natural das piscadas."
        },
        {
          id: "c2",
          label: "Bordas do Rosto: Perto da orelha e do cabelo há um contorno embaçado quando ele vira a cabeça.",
          shortTag: "Borda borrada",
          isFakeClue: true,
          explanation: "Exato! A 'colagem' do rosto falso costuma borrar ou tremer nas bordas do cabelo e orelha."
        },
        {
          id: "c3",
          label: "Cor da Camisa: Ele está usando o uniforme oficial azul.",
          shortTag: "Camisa azul",
          isFakeClue: false,
          explanation: "Pista falsa! A cor da camisa é comum em vídeos reais, não prova manipulação."
        },
        {
          id: "c4",
          label: "Voz e Boca: O som da voz chega meio segundo depois do movimento dos lábios.",
          shortTag: "Boca fora de sincronia",
          isFakeClue: true,
          explanation: "Muito bem! Falha clássica de sincronia labial (lip-sync) em deepfakes de vídeo."
        }
      ]
    },
    {
      id: "df2",
      type: "photo",
      image: "Gemini_Generated_Image_y08siy08siy08siy.jpg",
      title: "Caso 2: Foto do 'Cachorro Raro com 3 Orelhas'",
      description: "Uma imagem circula nas redes afirmando que nasceu um Golden Retriever raríssimo com três orelhas em um parque.",
      imageSummary: "🖼️ Imagem analisada: Golden Retriever sentado na grama de um parque ensolarado.",
      clues: [
        {
          id: "c1",
          label: "Anatomia Impossível: Há uma terceira orelha apontando para cima no meio da cabeça.",
          shortTag: "Terceira orelha no topo da cabeça",
          isFakeClue: true,
          explanation: "Perfeito! Cães têm apenas duas orelhas laterais — membros ou orelhas extras são erros clássicos de imagens geradas por IA."
        },
        {
          id: "c2",
          label: "Fusão de Pelos na Testa: A base da orelha extra se mistura aos pelos da cabeça sem marca de recorte.",
          shortTag: "Base da orelha fundida nos pelos",
          isFakeClue: true,
          explanation: "Boa observação! A IA cria texturas de pelo e luz tão convincentes que 'costura' partes impossíveis sem deixar borda de montagem."
        },
        {
          id: "c3",
          label: "Coleira Azul: O cachorro usa uma coleira azul com plaquinha no pescoço.",
          shortTag: "Coleira azul no pescoço",
          isFakeClue: false,
          explanation: "Pista neutra! Coleira com plaquinha é comum em qualquer foto real de cachorro."
        },
        {
          id: "c4",
          label: "Grama e Fundo Desfocado: O parque tem grama verde e árvores desfocadas ao fundo.",
          shortTag: "Grama verde no parque",
          isFakeClue: false,
          explanation: "Pista neutra! Fundo desfocado (modo retrato) e grama verde são normais em fotos comuns."
        }
      ]
    },
    {
      id: "df3",
      type: "audio",
      title: "Caso 3: Áudio Urgente Pedindo Transferência no WhatsApp",
      description: "Um áudio de 12 segundos com a voz muito parecida com a de um familiar pede Pix urgente de um número novo.",
      imageSummary: "🎙️ Áudio analisado: Mensagem encaminhada de número desconhecido pedindo dinheiro rápido sem atender chamada de vídeo.",
      clues: [
        {
          id: "c1",
          label: "Pausas e Respiração: Não há som natural de respiração entre as frases — os cortes são robóticos.",
          shortTag: "Sem respiração natural",
          isFakeClue: true,
          explanation: "Excelente! Áudios clonados por IA costumam ter pausas artificiais e entonação plana."
        },
        {
          id: "c2",
          label: "Pronúncia Estranha: A voz erra o jeito que a família sempre fala um apelido ou nome da cidade.",
          shortTag: "Entonação estranha",
          isFakeClue: true,
          explanation: "Isso mesmo! A IA imita o timbre, mas tropeça em sotaques, gírias e apelidos íntimos."
        },
        {
          id: "c3",
          label: "Duração Curta: O áudio tem 12 segundos.",
          shortTag: "Duração de 12s",
          isFakeClue: false,
          explanation: "Pista neutra! Muitas mensagens reais de WhatsApp também duram cerca de 12 segundos."
        },
        {
          id: "c4",
          label: "Pressa e Bloqueio de Ligação: Recusa chamada de vídeo e exige envio imediato antes de confirmar.",
          shortTag: "Urgência + sem vídeo",
          isFakeClue: true,
          explanation: "Acertou! Pressa emocional combinada com recusa de verificação ao vivo é o padrão clássico de golpe com voz clonada."
        }
      ]
    }
  ],

  siftCases: [
    {
      id: "sift1",
      headline: "URGENTE!! Governo vai cancelar o recreio nas escolas do Brasil a partir de segunda-feira!! Compartilhe antes que apaguem!!",
      emotion: "Dá susto, raiva e pede para compartilhar correndo (letras maiúsculas e muitos pontos de exclamação).",
      sourceInfo: "Publicado pelo site 'noticias-bombasticas-agora123.xyz' — Não possui nome de jornalista, endereço nem telefone.",
      factCheckInfo: "Agência Lupa e Aos Fatos: 'É FALSO que o recreio será proibido. Nenhuma lei ou portaria do Ministério da Educação trata desse assunto.'",
      reverseSearchInfo: "Google Imagens / TinEye: A foto da escola fechada usada na postagem foi tirada em 2016 durante uma reforma de telhado em outro país.",
      expectedVerdict: "Falso",
      explanation: "O boato foi inventado para gerar cliques pelo medo, usa site anônimo e foto antiga de outro país."
    },
    {
      id: "sift2",
      headline: "Foto mostra neve cobrindo totalmente as ruas de Ponta Grossa ontem à noite!",
      emotion: "Surpresa e curiosidade local — vontade rápida de mandar nos grupos da cidade.",
      sourceInfo: "Postado por um perfil anônimo sem foto real em um grupo de bairro, sem citar jornal ou horário exato.",
      factCheckInfo: "Jornais locais e Simepar: 'A temperatura mínima ontem em Ponta Grossa foi de 14°C, sem qualquer registro de neve.'",
      reverseSearchInfo: "Busca Reversa: A mesma foto já havia sido publicada em um jornal do Canadá em janeiro de 2021.",
      expectedVerdict: "Fora de Contexto",
      explanation: "A foto em si não foi feita por IA — ela é real, mas aconteceu no Canadá em 2021 e foi usada fora do contexto original."
    },
    {
      id: "sift3",
      headline: "Cientistas confirmam que tela antes de dormir atrapalha o sono — por isso todo celular será proibido no Brasil para menores de 18 anos amanhã!",
      emotion: "Mistura uma informação conhecida com um anúncio radical que gera pânico nos estudantes.",
      sourceInfo: "Post de influenciador sem link para lei oficial, citando apenas parcialmente uma pesquisa médica antiga.",
      factCheckInfo: "Checagem jornalística: 'Estudos de saúde realmente mostram que luz de telas à noite atrasa o sono, mas NÃO existe lei proibindo celulares no país inteiro amanhã.'",
      reverseSearchInfo: "Rastreamento original: A primeira frase veio de um artigo sério da Sociedade de Pediatria; a segunda frase foi inventada na legenda.",
      expectedVerdict: "Meio Verdadeiro",
      explanation: "Muito comum na internet! Começa com um fato verdadeiro (tela atrapalha o sono) para fazer as pessoas acreditarem na mentira do final."
    }
  ]
};
