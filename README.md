# 🏠 Shopping das Casas - Website Oficial & Plataforma de Conversão

Projeto desenvolvido com base na **Engenharia Reversa** do perfil oficial [@shoppingdascasas](https://www.instagram.com/shoppingdascasas/) (+138k seguidores).

---

## 🌟 Visão Geral & Funcionalidades Entregues

1. **Identidade Visual Fiel à Marca:**
   * Paleta de cores oficial: Verde Construtora (`#0F5132`), Laranja Ação/Telha (`#E65100`), Grafite e Branco Neve.
   * Tipografia moderna: *Outfit* para títulos e *Plus Jakarta Sans* para leitura fluida.
   * Imagens ultra-realistas de alta resolução geradas para modelos de casas, showroom e plantas baixas 3D humanizadas.

2. **Simulador Inteligente de Orçamento (Lead Magnet):**
   * Seleção interativa de estrutura: Concreto Pré-Moldado, Madeira Nobre Tratada em Autoclave ou Estrutura Mista.
   * Filtro de dormitórios (1, 2 e 3 quartos) e metragem (36m² a 85m²).
   * Cálculo dinâmico em tempo real de investimento total e parcelas estimadas de financiamento.
   * Botão de envio direto para o **WhatsApp Oficial (47) 99133-7816** com os dados do cliente e da casa já formatados.
   * **Persistência de Leads:** Todos os orçamentos são registrados em `localStorage` (`shopping_das_casas_leads`), prontos para serem integrados ao painel de leads e CRM.

3. **Catálogo de Modelos com Filtros e Modal 3D:**
   * Filtros por categoria e dormitórios.
   * Botão "Ver Planta 3D" com visualização isométrica humanizada, itens inclusos no kit e link de contato direto para o modelo escolhido.

4. **Comparativo Transparente (Pré-Fabricada vs Convencional):**
   * Tabela comparando prazo de obra (25-40 dias vs 6-12 meses), previsibilidade de custo (preço fechado vs estouros de orçamento), resíduos e garantia de 5 anos.

5. **Setor de Materiais de Construção & Madeiras:**
   * Venda de madeiras tratadas em autoclave, telhas cerâmicas e aberturas para construtores e reformas.

6. **Prova Social e Comunidade Instagram:**
   * Destaque para a base de mais de 138 mil seguidores no `@shoppingdascasas`.
   * Depoimentos de clientes de Araquari, Joinville, Barra do Sul e São Francisco do Sul.

7. **FAQ Interativo & SEO Local:**
   * Accordion com respostas para as 5 dúvidas mais frequentes sobre terrenos, autoclave e financiamento.
   * Marcação Schema.org para o Google Maps e SEO focado em Santa Catarina.

---

## 📁 Estrutura de Arquivos

```
shoppingdascasas/
├── index.html                  # Estrutura semântica HTML5 completa
├── style.css                   # Design system e folhas de estilo modernas
├── app.js                      # Lógica interativa, simulador e captura de leads
├── ENGENHARIA_REVERSA.md       # Documento de engenharia reversa do Instagram
├── README.md                   # Documentação do projeto
└── assets/
    └── images/
        ├── hero_house.jpg             # Fachada principal da casa modelo
        ├── house_chale.jpg            # Modelo chalé em madeira tratada
        ├── house_premoldada.jpg       # Modelo residencial concreto pré-moldado
        ├── house_familiar.jpg         # Modelo villa imperial 3 dormitórios
        ├── materials_store.jpg        # Showroom e depósito de materiais
        └── floorplan_humanizada.jpg   # Planta baixa humanizada 3D
```

---

## 🚀 Como Executar Localmente

Você pode abrir o arquivo `index.html` diretamente em qualquer navegador moderno, ou rodar via terminal:

```bash
# Via Python:
python -m http.server 8080

# Ou via Node / NPX:
npx serve .
```

Acesse em seu navegador: `http://localhost:8080`.
