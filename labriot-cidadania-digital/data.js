const LESSONS_DATA = {
  apps: [
    {
      id: "super-corrida",
      name: "Super Corrida Turbo 3D",
      icon: "🏎️",
      category: "Jogo Grátis",
      yearlyValue: 18,
      permissions: [
        { key: "loc", label: "Localização exata em tempo real (GPS)", value: 6, reason: "Saber onde você mora, estuda e passeia para vender anúncios locais." },
        { key: "contacts", label: "Lista de amigos e contatos", value: 4, reason: "Descobrir quem são seus amigos para recomendar o jogo e mapear sua rede." },
        { key: "time", label: "Horários em que você usa o celular", value: 5, reason: "Descobrir quando você dorme e quando está entediado." },
        { key: "search", label: "Histórico de vídeos e pesquisas", value: 7, reason: "Saber quais brinquedos, tênis ou jogos você quer comprar." }
      ]
    },
    {
      id: "filtro-magico",
      name: "Filtro Mágico FaceFun",
      icon: "🤳",
      category: "Fotos & Vídeos Grátis",
      yearlyValue: 22,
      permissions: [
        { key: "photos", label: "Galeria completa de fotos e rostos", value: 9, reason: "Treinar inteligências artificiais com suas fotos para sempre." },
        { key: "mic", label: "Microfone e áudio ambiente", value: 6, reason: "Identificar o que você assiste na TV ou ouve no quarto." },
        { key: "loc", label: "Cidade e bairro onde está", value: 4, reason: "Direcionar propagandas de lojas próximas." },
        { key: "device", label: "Modelo do aparelho e tempo de tela", value: 3, reason: "Calcular quanto tempo você passa olhando para anúncios." }
      ]
    }
  ],

  metadataCase: {
    clues: [
      "🕒 02:45 da manhã — Abriu um jogo online e ficou conectado por 1h30.",
      "🔍 14:10 da tarde — Pesquisou 'chuteira infantil promoção' e 'final do campeonato'.",
      "📍 16:00 da tarde — Localização registrada em uma quadra de esportes do bairro.",
      "💬 19:20 da noite — Enviou 45 mensagens seguidas para o mesmo contato favorito."
    ],
    deductions: [
      { id: "d1", text: "Provavelmente dorme tarde ou tem pouco sono nos dias de semana.", correct: true },
      { id: "d2", text: "É fã de futebol e um ótimo alvo para anúncios de artigos esportivos.", correct: true },
      { id: "d3", text: "Gosta de ler livros de culinária francesa.", correct: false },
      { id: "d4", text: "Tem um melhor amigo com quem conversa quase toda noite.", correct: true }
    ]
  },

  lgpdMissions: [
    {
      team: "Missão A — Direito de Acesso",
      badge: "👁️ ACESSO AOS DADOS",
      scenario: "O aplicativo 'Super Corrida' mostra anúncios muito específicos para você, mas você não sabe o que ele anotou no seu perfil.",
      task: "Escreva um bilhete oficial ao suporte do app exigindo saber quais informações pessoais eles guardaram sobre você e para que usam."
    },
    {
      team: "Missão B — Eliminação de Conta de Menor",
      badge: "🗑️ ELIMINAÇÃO (LGPD)",
      scenario: "Uma criança de 10 anos criou uma conta em uma rede social sem a permissão dos pais ou responsáveis (o que a lei brasileira exige para menores de 12 anos).",
      task: "Escreva o pedido formal exigindo que a empresa apague imediatamente todos os dados e fotos da criança, de graça."
    },
    {
      team: "Missão C — Mudar de Ideia (Revogação)",
      badge: "🚫 REVOGAR PERMISSÃO",
      scenario: "No mês passado você clicou em 'Permitir Localização' em um jogo, mas agora percebeu que ele não precisa saber onde você está.",
      task: "Escreva uma solicitação pedindo para o app parar de usar sua localização para mostrar anúncios."
    }
  ],

  deepfakeCases: [
    {
      id: "df1",
      title: "Caso 1: Vídeo do Jogador Famoso Anunciando Prêmio Grátis",
      description: "Um vídeo circula nos grupos dizendo que um craque da seleção está doando videogames para quem clicar num link.",
      imageSummary: "🎥 Cena analisada: Rosto iluminado de frente em um estúdio escuro, falando rápido com entusiasmo.",
      clues: [
        { id: "c1", label: "Olhos e Piscadas: O jogador fica 18 segundos seguidos sem piscar nenhuma vez.", isFakeClue: true, explanation: "Acertou! Modelos de IA muitas vezes esquecem de imitar o piscar natural humano." },
        { id: "c2", label: "Bordas do Rosto: Perto da orelha e do cabelo há um contorno embaçado quando ele vira a cabeça.", isFakeClue: true, explanation: "Exato! A 'colagem' do rosto falso costuma borrar nas bordas." },
        { id: "c3", label: "Cor da Camisa: Ele está usando o uniforme oficial azul.", isFakeClue: false, explanation: "A cor da camisa é comum em vídeos reais, não prova manipulação." },
        { id: "c4", label: "Voz e Boca: O som da voz chega meio segundo depois do movimento dos lábios.", isFakeClue: true, explanation: "Muito bem! Falha clássica de sincronia labial (lip-sync) em deepfakes." }
      ]
    },
    {
      id: "df2",
      title: "Caso 2: Foto do 'Cachorro Azul Descoberto na Floresta'",
      description: "Uma imagem viralizou afirmando que cientistas encontraram uma nova espécie de cachorro naturalmente azul neon.",
      imageSummary: "🖼️ Imagem analisada: Cachorro sentado na grama sob sol forte, pelagem azul brilhante.",
      clues: [
        { id: "c1", label: "Luz e Sombras: O sol bate pela direita, mas a sombra do cachorro está projetada para a frente.", isFakeClue: true, explanation: "Boa observação! Sombras incoerentes entregam montagens e imagens geradas por IA." },
        { id: "c2", label: "Patas e Detalhes: Uma das patas traseiras se mistura com a grama e tem 6 dedos.", isFakeClue: true, explanation: "Perfeito! Anatomia estranha em mãos, patas e fundos é marca registrada de IA." },
        { id: "c3", label: "Grama Verde: O chão tem grama verde comum.", isFakeClue: false, explanation: "Grama verde é normal em qualquer foto ao ar livre." }
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
      expectedVerdict: "Falso"
    },
    {
      id: "sift2",
      headline: "Foto mostra neve cobrindo totalmente as ruas de Ponta Grossa ontem à noite!",
      emotion: "Surpresa e curiosidade local.",
      sourceInfo: "Postado por um perfil anônimo sem foto real em um grupo de bairro.",
      factCheckInfo: "Jornais locais e Simepar: 'A temperatura mínima ontem em Ponta Grossa foi de 14°C, sem qualquer registro de neve.'",
      reverseSearchInfo: "Busca Reversa: A mesma foto apareceu em um jornal do Canadá em janeiro de 2021.",
      expectedVerdict: "Fora de Contexto"
    }
  ]
};
