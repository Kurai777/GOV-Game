/* Governance Challenge — Boardroom Simulation
   Editorial monochrome aesthetic. 5 screens, fully interactive, mobile-responsive.
   Bilingual: English / Português (Brasil). Toggle in top frame; persisted in localStorage.
*/

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ============================================================
// I18N — UI STRINGS TABLE
// ============================================================

const LANG_KEY = "gc_lang";

const STRINGS = {
  // ── LANDING ──
  "landing.vol":              { en: "Vol. III · MMXXVI",                       pt: "Vol. III · MMXXVI" },
  "landing.titleLine1":       { en: "The",                                     pt: "O" },
  "landing.titleLine2":       { en: "Governance",                              pt: "Desafio da" },
  "landing.titleLine3":       { en: "Challenge",                               pt: "Governança" },
  "landing.titleItalicLine":  { en: 2,                                         pt: 3 }, // which line is italicized
  "landing.blurb":            { en: "A boardroom, rendered as a game of position. Six pillars, four moves, one fiduciary duty. Built for those who will, one day, be in the chair.",
                                pt: "Uma sala de conselho, transformada em jogo de posição. Seis pilares, quatro movimentos, um único dever fiduciário. Feito para quem, um dia, ocupará a cadeira." },
  "landing.cta":              { en: "Open the Boardroom →",                    pt: "Entrar na Sala do Conselho →" },
  "landing.sample":           { en: "Play a sample question",                  pt: "Jogar uma questão-modelo" },
  "landing.nav.curriculum":   { en: "Curriculum",                              pt: "Currículo" },
  "landing.nav.institutions": { en: "Institutions",                            pt: "Instituições" },
  "landing.nav.about":        { en: "About",                                   pt: "Sobre" },
  "landing.nav.signin":       { en: "Sign in",                                 pt: "Entrar" },
  "landing.footer.a":         { en: "A. Pillars",                              pt: "A. Pilares" },
  "landing.footer.aText":     { en: "Ethics · Risk · ESG · Audit · Strategy · Disclosure",
                                pt: "Ética · Risco · ESG · Auditoria · Estratégia · Divulgação" },
  "landing.footer.b":         { en: "B. Format",                               pt: "B. Formato" },
  "landing.footer.bText":     { en: "Single, table, scenario, crisis",         pt: "Individual, mesa, cenário, crise" },
  "landing.footer.c":         { en: "C. Source",                               pt: "C. Fontes" },
  "landing.footer.cText":     { en: "OECD · ESRS · TCFD · ISSB · IBGC",        pt: "OCDE · ESRS · TCFD · ISSB · IBGC · CVM" },
  "landing.footer.d":         { en: "D. Status",                               pt: "D. Status" },
  "landing.footer.dText":     { en: "Open beta — Spring cohort",               pt: "Beta aberto — Turma de outono" },
  "landing.tile.live":        { en: "NOW LIVE",                                pt: "AO VIVO" },
  "landing.tile.crisisHead":  { en: "Crisis 04 —",                             pt: "Crise 04 —" },
  "landing.tile.crisisTitle": { en: "The Whistleblower's Letter",              pt: "A Carta do Denunciante" },
  "landing.tile.crisisBody":  { en: "Forty-six minutes to disclosure. Three of four committee members reachable.",
                                pt: "Quarenta e seis minutos até a divulgação. Três dos quatro membros do comitê acessíveis." },
  "landing.tile.players":     { en: "2,418 PLAYERS",                           pt: "2.418 JOGADORES" },
  "landing.tile.open":        { en: "OPEN",                                    pt: "ABERTO" },
  "landing.bottomKicker":     { en: "◆  THE OPENING MOVE",                     pt: "◆  O LANCE DE ABERTURA" },
  "landing.bottomTitle1":     { en: "Govern as you would",                     pt: "Governe como gostaria de" },
  "landing.bottomTitle2":     { en: "be governed.",                            pt: "ser governado." },
  "landing.ticker.est":       { en: "EST. 2026",                               pt: "EST. 2026" },
  "landing.ticker.edition":   { en: "BOARDROOM EDITION",                       pt: "EDIÇÃO CONSELHO" },
  "landing.plate.left":       { en: "Plate 01 · The King in Council",          pt: "Estampa 01 · O Rei em Conselho" },
  "landing.plate.right":      { en: "Editorial · Reference Library",           pt: "Editorial · Biblioteca de Referência" },

  // ── MENU ──
  "menu.center":              { en: "II — The Lobby · Choose your table",     pt: "II — O Lobby · Escolha sua mesa" },
  "menu.session":             { en: "SESSION 0418",                            pt: "SESSÃO 0418" },
  "menu.cover":               { en: "← Cover",                                 pt: "← Capa" },
  "menu.dossier":             { en: "DIRECTOR · DOSSIER",                      pt: "CONSELHEIRO · DOSSIÊ" },
  "menu.directorTitle":       { en: "Independent Director · Cohort III",      pt: "Conselheira Independente · Turma III" },
  "menu.stat.rating":         { en: "Rating",                                  pt: "Pontuação" },
  "menu.stat.tier":           { en: "Tier",                                    pt: "Nível" },
  "menu.stat.decisions":      { en: "Decisions",                               pt: "Decisões" },
  "menu.stat.streak":         { en: "Streak",                                  pt: "Sequência" },
  "menu.stat.weekHint":       { en: "+12 this week",                           pt: "+12 esta semana" },
  "menu.stat.tierVal":        { en: "Independent",                             pt: "Independente" },
  "menu.stat.streakVal":      { en: "6 wks",                                   pt: "6 sem" },
  "menu.pillarMastery":       { en: "PILLAR MASTERY",                          pt: "DOMÍNIO DOS PILARES" },
  "pillar.ethics":            { en: "Ethics",                                  pt: "Ética" },
  "pillar.risk":              { en: "Risk",                                    pt: "Risco" },
  "pillar.esg":               { en: "ESG",                                     pt: "ESG" },
  "pillar.audit":             { en: "Audit",                                   pt: "Auditoria" },
  "pillar.strategy":          { en: "Strategy",                                pt: "Estratégia" },
  "pillar.disclosure":        { en: "Disclosure",                              pt: "Divulgação" },
  "menu.tactical.label":      { en: "TACTICAL · LEDGER",                       pt: "TÁTICO · LIVRO" },
  "menu.tactical.titleA":     { en: "Hostile",                                 pt: "Aquisição" },
  "menu.tactical.titleB":     { en: "Takeover",                                pt: "Hostil" },
  "menu.tactical.desc":       { en: "Spend {cost} influence points to spin the crisis wheel. Comply or explain.",
                                pt: "Gaste {cost} pontos de influência para girar a roleta de crises. Cumpra ou explique." },
  "menu.tactical.cta":        { en: "Spin the Wheel →",                        pt: "Girar a Roleta →" },
  "menu.section":             { en: "SECTION B · GAME MODES",                  pt: "SEÇÃO B · MODOS DE JOGO" },
  "menu.takeYourSeatA":       { en: "Take your",                               pt: "Tome seu" },
  "menu.takeYourSeatB":       { en: "seat.",                                   pt: "assento." },
  "menu.timeGmt":             { en: "21:47 · GMT",                             pt: "21:47 · GMT" },
  "menu.openSeated":          { en: "OPEN · 2,418 SEATED",                     pt: "ABERTO · 2.418 SENTADOS" },
  "menu.boardSet":            { en: "\"The board is set.\"",                   pt: "\"O tabuleiro está posto.\"" },
  "menu.cohortOpens":         { en: "— Cohort opens 09:00 GMT, Monday",        pt: "— Turma abre 09:00 GMT, segunda-feira" },
  "menu.sectionEnd":          { en: "§B · END",                                pt: "§B · FIM" },
  "menu.enter":               { en: "Enter",                                   pt: "Entrar" },

  "mode.solo.label":          { en: "Solo Briefing",                           pt: "Sessão Individual" },
  "mode.solo.desc":           { en: "A single-player governance gauntlet. Eight questions, six pillars.",
                                pt: "Um percurso de governança individual. Oito questões, seis pilares." },
  "mode.solo.meta":           { en: "8 questions",                              pt: "8 questões" },
  "mode.multi.label":         { en: "Boardroom",                               pt: "Conselho ao Vivo" },
  "mode.multi.desc":          { en: "Live multiplayer. Seat at a virtual table of four. Speak, vote, defend.",
                                pt: "Multijogador ao vivo. Cadeira em mesa virtual de quatro. Fale, vote, defenda." },
  "mode.multi.meta":          { en: "Coming soon",                              pt: "Em breve" },
  "mode.esg.label":           { en: "ESG Challenge",                           pt: "Desafio ESG" },
  "mode.esg.desc":            { en: "Sustainability-weighted decisions across one fiscal year of pressure.",
                                pt: "Decisões com peso de sustentabilidade ao longo de um ano fiscal sob pressão." },
  "mode.esg.meta":            { en: "Coming soon",                              pt: "Em breve" },
  "mode.crisis.label":        { en: "Board Crisis",                            pt: "Crise no Conselho" },
  "mode.crisis.desc":         { en: "Time-bound scenarios. The clock decides as much as you do.",
                                pt: "Cenários com prazo. O relógio decide tanto quanto você." },
  "mode.crisis.meta":         { en: "6 scenarios",                              pt: "6 cenários" },
  "mode.leader.label":        { en: "Leaderboard",                             pt: "Ranking" },
  "mode.leader.desc":         { en: "The directors' table — global and institutional rankings.",
                                pt: "A mesa dos conselheiros — rankings globais e institucionais." },
  "mode.leader.meta":         { en: "Live",                                     pt: "Ao vivo" },
  "mode.profile.label":       { en: "Director Profile",                        pt: "Dossiê do Conselheiro" },
  "mode.profile.desc":        { en: "Your dossier. Pillar mastery, decision history, certifications.",
                                pt: "Seu dossiê. Domínio dos pilares, histórico de decisões, certificações." },
  "mode.profile.meta":        { en: "Coming soon",                              pt: "Em breve" },

  // ── GAME ──
  "game.lobby":               { en: "← Lobby",                                 pt: "← Lobby" },
  "game.center":              { en: "III — Solo Briefing · {pillar}",          pt: "III — Sessão Individual · {pillar}" },
  "game.round":               { en: "R0{n}/0{total}",                          pt: "R0{n}/0{total}" },
  "game.pillarBadge":         { en: "PILLAR · {p}",                            pt: "PILAR · {p}" },
  "game.qBadge":              { en: "{difficulty} · Q{n}",                     pt: "{difficulty} · Q{n}" },
  "game.time":                { en: "TIME",                                    pt: "TEMPO" },
  "game.commentary":          { en: "COMMENTARY · {citation}",                 pt: "COMENTÁRIO · {citation}" },
  "game.nextMove":            { en: "Next Move →",                             pt: "Próximo Movimento →" },
  "game.viewResults":         { en: "View Results →",                          pt: "Ver Resultados →" },
  "game.telemetry":           { en: "BOARDROOM TELEMETRY",                     pt: "TELEMETRIA DO CONSELHO" },
  "game.boardStanding":       { en: "BOARD STANDING",                          pt: "POSIÇÃO NO CONSELHO" },
  "game.accuracy":            { en: "ACCURACY",                                pt: "PRECISÃO" },
  "game.onPace":              { en: "On pace for distinction. The independent chair watches with interest.",
                                pt: "No ritmo da distinção. O conselheiro independente observa com interesse." },
  "game.notOnPace":           { en: "The chamber expects sharper judgment. The pillar count is being kept.",
                                pt: "A câmara espera julgamento mais afiado. A contagem dos pilares está em curso." },
  "game.movesRemaining":      { en: "◆ MOVES REMAINING",                       pt: "◆ MOVIMENTOS RESTANTES" },

  "meter.esgIndex":           { en: "ESG Index",                               pt: "Índice ESG" },
  "meter.reputation":         { en: "Reputation",                              pt: "Reputação" },
  "meter.risk":               { en: "Risk",                                    pt: "Risco" },
  "meter.transparency":       { en: "Transparency",                            pt: "Transparência" },

  "diff.easy":                { en: "EASY",                                    pt: "FÁCIL" },
  "diff.medium":              { en: "MEDIUM",                                  pt: "MÉDIO" },
  "diff.hard":                { en: "HARD",                                    pt: "DIFÍCIL" },

  "opt.select":               { en: "SELECT",                                  pt: "SELECIONAR" },
  "opt.selected":             { en: "SELECTED",                                pt: "SELECIONADA" },
  "opt.correct":              { en: "✓ CORRECT",                               pt: "✓ CORRETA" },
  "opt.incorrect":            { en: "✗ INCORRECT",                             pt: "✗ INCORRETA" },

  // ── SCENARIO ──
  "scen.live":                { en: "● LIVE · CRISIS",                         pt: "● AO VIVO · CRISE" },
  "scen.center":              { en: "IV — Board Crisis · {code}",              pt: "IV — Crise no Conselho · {code}" },
  "scen.scenarioFile":        { en: "Scenario File · {code}",                  pt: "Arquivo do Cenário · {code}" },
  "scen.yourMove":            { en: "YOUR MOVE · {state}",                     pt: "SEU LANCE · {state}" },
  "scen.recorded":            { en: "RECORDED",                                pt: "REGISTRADO" },
  "scen.oneOfOne":            { en: "1 OF 1",                                  pt: "1 DE 1" },
  "scen.chooseNext":          { en: "Choose the board's",                      pt: "Escolha o próximo" },
  "scen.chooseNext2":         { en: "next move.",                              pt: "lance do conselho." },
  "scen.window":              { en: "WINDOW",                                  pt: "JANELA" },
  "scen.prudent":             { en: "PRUDENT",                                 pt: "PRUDENTE" },
  "scen.risk":                { en: "RISK",                                    pt: "RISCO" },
  "scen.decisionRecorded":    { en: "DECISION RECORDED · MINUTES UPDATED",     pt: "DECISÃO REGISTRADA · ATAS ATUALIZADAS" },
  "scen.awaiting":            { en: "AWAITING RESOLUTION · {n} OPTIONS",       pt: "AGUARDANDO RESOLUÇÃO · {n} OPÇÕES" },
  "scen.nextCrisis":          { en: "Next Crisis →",                           pt: "Próxima Crise →" },
  "scen.adjournResults":      { en: "Adjourn → Results",                       pt: "Encerrar → Resultados" },
  "scen.hesitation":          { en: "\"Hesitation, in a board, is a decision.\"",
                                pt: "\"Hesitação, no conselho, é uma decisão.\"" },
  "scen.dossierBy":           { en: "Dossier prepared by Board Secretariat",   pt: "Dossiê preparado pela Secretaria do Conselho" },

  // ── RESULTS ──
  "res.sessionConcluded":     { en: "SESSION CONCLUDED",                       pt: "SESSÃO ENCERRADA" },
  "res.center":               { en: "V — Board Minutes · Final",               pt: "V — Atas do Conselho · Final" },
  "res.replay":               { en: "Replay →",                                pt: "Reiniciar →" },
  "res.editionClosed":        { en: "Result · Edition Closed",                 pt: "Resultado · Edição Encerrada" },
  "res.minutesRecord":        { en: "The minutes record —",                    pt: "As atas registram —" },
  "res.tier":                 { en: "TIER · {tier}",                           pt: "NÍVEL · {tier}" },
  "tier.distinguished":       { en: "Distinguished",                           pt: "Distinto" },
  "tier.independent":         { en: "Independent",                             pt: "Independente" },
  "tier.qualified":           { en: "Qualified",                               pt: "Qualificado" },
  "tier.provisional":         { en: "Provisional",                             pt: "Provisório" },
  "tier.censured":            { en: "Censured",                                pt: "Censurado" },
  "arch.steward":             { en: "Steward",                                 pt: "Guardião" },
  "arch.agent":               { en: "Opportunistic Agent",                     pt: "Agente Oportunista" },
  "arch.stakeholder":         { en: "Stakeholder Champion",                    pt: "Defensor de Stakeholders" },
  "arch.monitor":             { en: "Independent Monitor",                     pt: "Monitor Independente" },
  "arch.connector":           { en: "Strategic Connector",                     pt: "Conector Estratégico" },
  "arch.indDirector":         { en: "Independent Director",                    pt: "Conselheiro Independente" },
  "arch.balanced":            { en: "Balanced Director",                       pt: "Conselheiro Equilibrado" },
  "arch.steward.theory":      { en: "Stewardship Theory · Davis, Schoorman & Donaldson (1997)",                                   pt: "Teoria do Stewardship · Davis, Schoorman & Donaldson (1997)" },
  "arch.agent.theory":        { en: "Agency Theory · Jensen & Meckling (1976)",                                                   pt: "Teoria da Agência · Jensen & Meckling (1976)" },
  "arch.stakeholder.theory":  { en: "Stakeholder Theory · Freeman (1984); Donaldson & Preston (1995)",                            pt: "Teoria dos Stakeholders · Freeman (1984); Donaldson & Preston (1995)" },
  "arch.monitor.theory":      { en: "Compliance & Audit · Cadbury (1992); SOX (2002)",                                            pt: "Compliance e Auditoria · Cadbury (1992); SOX (2002)" },
  "arch.connector.theory":    { en: "Resource Dependence Theory · Pfeffer & Salancik (1978)",                                     pt: "Teoria da Dependência de Recursos · Pfeffer & Salancik (1978)" },
  "arch.balanced.theory":     { en: "No dominant pattern — a balanced reading across the five schools.",                          pt: "Nenhum padrão dominante — leitura equilibrada entre as cinco escolas." },
  "arch.steward.desc":        { en: "Intrinsic alignment with the firm. Long-term horizon. Decisions prioritize collective good over personal gain.",                  pt: "Alinhamento intrínseco com a firma. Horizonte longo. Decisões priorizam o bem coletivo sobre ganho pessoal." },
  "arch.agent.desc":          { en: "Self-interest as decision driver. Short-term profit focus. Weak alignment with stakeholder outcomes.",                              pt: "Interesse próprio como motor de decisão. Foco em lucro de curto prazo. Alinhamento fraco com stakeholders." },
  "arch.stakeholder.desc":    { en: "Multi-stakeholder balance. ESG-forward. Recognizes obligations beyond shareholders.",                                                pt: "Equilíbrio multi-stakeholder. ESG no centro. Reconhece obrigações além dos acionistas." },
  "arch.monitor.desc":        { en: "Procedural rigor. Audit-forward. Strong on internal controls, disclosure, and compliance.",                                          pt: "Rigor procedural. Foco em auditoria. Forte em controles internos, divulgação e compliance." },
  "arch.connector.desc":      { en: "Networks, external ties, pragmatic dealmaking. Reduces uncertainty through relationships and access.",                              pt: "Redes, vínculos externos, pragmatismo na construção de acordos. Reduz incerteza por relações e acesso." },
  "arch.balanced.desc":       { en: "No single school dominates your decisions. The reading suggests a director who weighs multiple frames before committing.",          pt: "Nenhuma escola domina suas decisões. A leitura sugere uma conselheira que pesa múltiplos referenciais antes de se comprometer." },
  "res.verdict":              { en: "\"{name} navigated the pillars with discernment. The decision pattern reflects a director willing to call the chair when transparency is on the table — and to hold counsel when it is not.\"",
                                pt: "\"{name} navegou pelos pilares com discernimento. O padrão de decisão reflete uma conselheira disposta a desafiar a presidência quando a transparência está em jogo — e a guardar conselho quando não está.\"" },
  "res.auditCommittee":       { en: "— Audit Committee, Independent Review",   pt: "— Comitê de Auditoria, Revisão Independente" },
  "res.objAccuracy":          { en: "OBJECTIVE · ACCURACY",                    pt: "OBJETIVO · PRECISÃO" },
  "res.objDecisions":         { en: "DECISIONS RECORDED",                      pt: "DECISÕES REGISTRADAS" },
  "res.objPillars":           { en: "OBJECTIVE · PILLARS ≥ 30",                pt: "OBJETIVO · PILARES ≥ 30" },
  "res.objInfluence":         { en: "INFLUENCE",                               pt: "INFLUÊNCIA" },
  "res.minLabel":             { en: "min",                                     pt: "mín" },
  "res.ptsLabel":             { en: "pts",                                     pt: "pts" },
  "res.adjournLobby":         { en: "Adjourn → Lobby",                         pt: "Encerrar → Lobby" },
  "res.tryCrisis":            { en: "Try Crisis Mode",                         pt: "Tentar Modo Crise" },
  "res.sectionC":             { en: "SECTION C · BREAKDOWN",                   pt: "SEÇÃO C · DETALHAMENTO" },
  "res.scorecard":            { en: "The scorecard.",                          pt: "A cartilha de pontuação." },
  "bd.composite":             { en: "Governance Composite",                    pt: "Composto de Governança" },
  "bd.esg":                   { en: "ESG Performance",                         pt: "Performance ESG" },
  "bd.transparency":          { en: "Transparency",                            pt: "Transparência" },
  "bd.reputation":            { en: "Reputation Capital",                      pt: "Capital Reputacional" },
  "bd.risk":                  { en: "Risk Exposure",                           pt: "Exposição a Risco" },
  "res.ethical":              { en: "ETHICAL DECISION ANALYSIS",               pt: "ANÁLISE DE DECISÕES ÉTICAS" },
  "eth.disclosed":            { en: "Conflicts disclosed",                     pt: "Conflitos divulgados" },
  "eth.concealment":          { en: "Material concealment",                    pt: "Ocultação material" },
  "eth.procedural":           { en: "Procedural integrity",                    pt: "Integridade procedural" },
  "eth.quorum":               { en: "Quorum integrity",                        pt: "Integridade do quórum" },
  "eth.recorded":             { en: "Recorded",                                pt: "Registrado" },
  "eth.zero":                 { en: "0 instances",                             pt: "0 ocorrências" },
  "eth.detected":             { en: "Detected",                                pt: "Detectada" },
  "eth.maintained":           { en: "Maintained",                              pt: "Mantida" },
  "eth.strained":             { en: "Strained",                                pt: "Comprometida" },
  "res.market":               { en: "CORPORATE REPUTATION · MARKET VIEW",      pt: "REPUTAÇÃO CORPORATIVA · VISÃO DO MERCADO" },
  "res.hostile":              { en: "HOSTILE",                                 pt: "HOSTIL" },
  "res.favorable":            { en: "FAVORABLE",                               pt: "FAVORÁVEL" },
  "res.filed":                { en: "Filed · Boardroom",                       pt: "Arquivado · Conselho" },
  "res.cert":                 { en: "Cert No. GC-2026-{n}",                    pt: "Cert. Nº GC-2026-{n}" },

  // ── TAKEOVER MODAL ──
  "tk.label":                 { en: "HOSTILE TAKEOVER",                        pt: "AQUISIÇÃO HOSTIL" },
  "tk.titleA":                { en: "The",                                     pt: "A" },
  "tk.titleB":                { en: "Wheel of Crises.",                        pt: "Roleta das Crises." },
  "tk.desc":                  { en: "Spend {cost} influence points and surrender control. The board will face whatever the wheel decides.",
                                pt: "Gaste {cost} pontos de influência e abra mão do controle. O conselho enfrentará o que a roleta decidir." },
  "tk.spinCta":               { en: "Spin · Spend {cost} pts →",               pt: "Girar · Gastar {cost} pts →" },
  "tk.spinning":              { en: "SPINNING…",                               pt: "GIRANDO…" },
  "tk.crisisTriggered":       { en: "CRISIS · TRIGGERED",                      pt: "CRISE · DISPARADA" },
  "tk.applyImpact":           { en: "Apply Impact →",                          pt: "Aplicar Impacto →" },

  // ── INFLUENCE / COMMON ──
  "infl.pill":                { en: "◆ {n} INFL",                              pt: "◆ {n} INFL" },

  // ── PROTO NAV ──
  "nav.cover":                { en: "Cover",                                   pt: "Capa" },
  "nav.lobby":                { en: "Lobby",                                   pt: "Lobby" },
  "nav.briefing":             { en: "Briefing",                                pt: "Sessão" },
  "nav.crisis":               { en: "Crisis",                                  pt: "Crise" },
  "nav.minutes":              { en: "Minutes",                                 pt: "Atas" },
  "nav.leader":               { en: "Ranking",                                 pt: "Ranking" },

  // ── AUTH ──
  "auth.gateTitleA":          { en: "Take",                                    pt: "Reserve" },
  "auth.gateTitleB":          { en: "your seat.",                              pt: "seu lugar." },
  "auth.gateBlurb":           { en: "Register or sign in to take part. Your name is recorded; your scores will appear in the cohort leaderboard.",
                                pt: "Cadastre-se ou entre para participar. Seu nome fica registrado; suas pontuações aparecerão no ranking da turma." },
  "auth.tab.register":        { en: "Register",                                pt: "Cadastrar" },
  "auth.tab.login":           { en: "Sign in",                                 pt: "Entrar" },
  "auth.field.fullName":      { en: "Full name",                               pt: "Nome completo" },
  "auth.field.fullName.ph":   { en: "Elena Marés de Almeida",                  pt: "Elena Marés de Almeida" },
  "auth.field.course":        { en: "Course",                                  pt: "Curso" },
  "auth.field.course.ph":     { en: "Business · Law · Economics · …",          pt: "Administração · Direito · Economia · Contabilidade · …" },
  "auth.field.username":      { en: "Username",                                pt: "Nome de usuário" },
  "auth.field.username.ph":   { en: "lowercase, 3–32 chars",                   pt: "minúsculas, 3–32 caracteres" },
  "auth.field.password":      { en: "Password",                                pt: "Senha" },
  "auth.field.password.ph":   { en: "min. 4 characters",                       pt: "mín. 4 caracteres" },
  "auth.cta.register":        { en: "Create account →",                        pt: "Criar conta →" },
  "auth.cta.login":           { en: "Sign in →",                               pt: "Entrar →" },
  "auth.cta.working":         { en: "Working…",                                pt: "Processando…" },
  "auth.cancel":              { en: "Continue browsing",                       pt: "Continuar navegando" },
  "auth.switch.toLogin":      { en: "Already have an account? Sign in.",       pt: "Já tem conta? Entrar." },
  "auth.switch.toRegister":   { en: "New here? Register.",                     pt: "Primeira vez? Cadastrar." },
  "auth.welcome":             { en: "Welcome, {name}",                         pt: "Bem-vinda, {name}" },
  "auth.logout":              { en: "Logout",                                  pt: "Sair" },
  "auth.identity":            { en: "Director · {course}",                     pt: "Conselheira · {course}" },
  "auth.err.invalid_credentials": { en: "Username or password incorrect.",     pt: "Usuário ou senha incorretos." },
  "auth.err.username_taken":      { en: "This username is already taken.",    pt: "Esse nome de usuário já existe." },
  "auth.err.password_too_short":  { en: "Password must be at least 4 characters.", pt: "A senha precisa ter pelo menos 4 caracteres." },
  "auth.err.invalid_username":    { en: "Username: lowercase letters, numbers, dot, hyphen or underscore (3–32).", pt: "Usuário: minúsculas, números, ponto, hífen ou underline (3–32)." },
  "auth.err.invalid_full_name":   { en: "Please enter your full name.",       pt: "Informe seu nome completo." },
  "auth.err.invalid_course":      { en: "Please enter your course.",          pt: "Informe seu curso." },
  "auth.err.network":             { en: "Network error. Try again.",          pt: "Erro de rede. Tente de novo." },
  "auth.err.config_missing":      { en: "Backend not configured. Check config.js.", pt: "Backend não configurado. Verifique config.js." },
  "auth.err.required":            { en: "All fields are required.",           pt: "Todos os campos são obrigatórios." },

  // ── LEADERBOARD ──
  "leader.center":            { en: "VI — The Directors' Table",               pt: "VI — A Mesa dos Conselheiros" },
  "leader.title":             { en: "The directors'",                         pt: "A mesa" },
  "leader.titleItalic":       { en: "table.",                                  pt: "dos conselheiros." },
  "leader.subtitle":          { en: "Best composite score per player.",       pt: "Melhor pontuação composta por jogador." },
  "leader.col.rank":          { en: "Rank",                                    pt: "Rank" },
  "leader.col.player":        { en: "Player",                                  pt: "Jogador" },
  "leader.col.course":        { en: "Course",                                  pt: "Curso" },
  "leader.col.score":         { en: "Best score",                              pt: "Melhor nota" },
  "leader.col.runs":          { en: "Runs",                                    pt: "Partidas" },
  "leader.col.last":          { en: "Last played",                             pt: "Última" },
  "leader.empty":             { en: "No completed sessions yet. Be the first.", pt: "Nenhuma sessão completa ainda. Seja a primeira." },
  "leader.loading":           { en: "Loading…",                                pt: "Carregando…" },
  "leader.refresh":           { en: "Refresh",                                 pt: "Atualizar" },
  "leader.you":               { en: "you",                                     pt: "você" },
  "leader.error":             { en: "Could not reach the boardroom registry.", pt: "Não foi possível alcançar o registro do conselho." },
  "leader.notConfigured":     { en: "Leaderboard requires Supabase. See config.js.", pt: "Ranking requer Supabase. Veja config.js." },

  // ── SAVE INDICATOR ──
  "save.saving":              { en: "Saving to registry…",                     pt: "Salvando no registro…" },
  "save.saved":               { en: "Recorded in the registry.",               pt: "Registrado no livro." },
  "save.error":               { en: "Save failed. Score kept locally.",        pt: "Falha ao salvar. Pontuação mantida localmente." },
  "save.notConfigured":       { en: "Backend not configured — score not recorded.", pt: "Backend não configurado — pontuação não registrada." },
  "save.warming":             { en: "Server warming up. Score queued — we'll save it the moment it's back.",
                                pt: "Servidor aquecendo. Pontuação enfileirada — salvaremos assim que voltar." },
  "save.queued":              { en: "Score kept locally. {n} run(s) pending.",
                                pt: "Pontuação mantida localmente. {n} partida(s) pendente(s)." },
  "save.retry":               { en: "Retry save",                                   pt: "Tentar salvar de novo" },
  "save.flushed":             { en: "{n} pending run(s) recorded.",                 pt: "{n} partida(s) pendente(s) registrada(s)." },

  // ── PROFILE / RESULTS ──
  "res.profileBreakdown":     { en: "PROFILE · DISTRIBUTION",                       pt: "PERFIL · DISTRIBUIÇÃO" },
  "res.furtherReading":       { en: "FURTHER READING",                              pt: "LEITURAS ADICIONAIS" },
  "res.sources":              { en: "sources",                                      pt: "fontes" },
  "res.archetypeDesc":        { en: "Your decision pattern aligns most strongly with this school.",
                                pt: "Seu padrão de decisão alinha-se mais fortemente a esta escola." },
  "game.answersRecorded":     { en: "ANSWERS RECORDED",                             pt: "RESPOSTAS REGISTRADAS" },
  "opt.recorded":             { en: "RECORDED",                                     pt: "REGISTRADA" },
  "game.recordedHint":        { en: "Answer recorded. No right or wrong — your pattern is being read.",
                                pt: "Resposta registrada. Sem certo ou errado — seu padrão está sendo lido." },

  // ── TOUR ──
  "tour.next":             { en: "Next →",          pt: "Próximo →" },
  "tour.prev":             { en: "Back",            pt: "Voltar" },
  "tour.skip":             { en: "Skip tour",       pt: "Pular tutorial" },
  "tour.done":             { en: "Take a seat →",   pt: "Tomar assento →" },
  "tour.reopen":           { en: "▶ Tutorial",      pt: "▶ Tutorial" },

  "tour.solo.title":       { en: "Solo Briefing",                                pt: "Sessão Individual" },
  "tour.solo.body":        { en: "Eight governance questions from real boardroom cases — Enron, Sarbanes-Oxley, IBGC, Novo Mercado. Answer each, watch your telemetry react, earn influence.",
                             pt: "Oito questões de governança baseadas em casos reais — Enron, Sarbanes-Oxley, IBGC, Novo Mercado. Responda cada uma, veja a telemetria reagir, acumule pontos de influência." },

  "tour.multi.title":      { en: "Live Boardroom",                               pt: "Conselho ao Vivo" },
  "tour.multi.body":       { en: "Multiplayer table for up to eight directors. Speak, vote, defend in real time. In development — opens on the first cohort.",
                             pt: "Mesa multijogador para até oito conselheiros. Fale, vote, defenda em tempo real. Em desenvolvimento — abre na primeira turma." },

  "tour.esg.title":        { en: "ESG Challenge",                                pt: "Desafio ESG" },
  "tour.esg.body":         { en: "A whole fiscal year of sustainability-weighted decisions. Same questions as Solo Briefing, but with ESG and Transparency pillars carrying double weight on your score.",
                             pt: "Um ano fiscal inteiro de decisões com peso de sustentabilidade. Mesmas questões da Sessão Individual, mas com os pilares de ESG e Transparência valendo o dobro na nota." },

  "tour.crisis.title":     { en: "Board Crisis",                                 pt: "Crise no Conselho" },
  "tour.crisis.body":      { en: "Time-bound scenarios under pressure — the Whistleblower, the Americanas inconsistency, greenwashing, related-party deals. Read the dossier, pick α, β, γ, or δ. The market reacts.",
                             pt: "Cenários com prazo, sob pressão — o Denunciante, a inconsistência Americanas, greenwashing, partes relacionadas. Leia o dossiê, escolha α, β, γ ou δ. O mercado reage." },

  "tour.leader.title":     { en: "The Directors' Table",                        pt: "A Mesa dos Conselheiros" },
  "tour.leader.body":      { en: "Your best composite score across all sessions, ranked against the cohort. Saved automatically after every completed game.",
                             pt: "Sua melhor pontuação composta entre todas as sessões, ranqueada contra a turma. Salvo automaticamente ao final de cada partida." },

  "tour.profile.title":    { en: "Director Profile",                             pt: "Dossiê do Conselheiro" },
  "tour.profile.body":     { en: "Your dossier — pillar mastery, decision history, certification progress. Coming soon. For now, opens your latest session results.",
                             pt: "Seu dossiê — domínio dos pilares, histórico de decisões, progresso de certificação. Em breve. Por enquanto, abre os resultados da última sessão." },

  "tour.takeover.title":   { en: "Hostile Takeover",                             pt: "Aquisição Hostil" },
  "tour.takeover.body":    { en: "Earn influence points by answering correctly and choosing prudent moves. Spend two to spin the wheel — a random external crisis hits your scores. High-risk, high-flavor.",
                             pt: "Ganhe pontos de influência respondendo certo e escolhendo lances prudentes. Gaste dois para girar a roleta — uma crise externa aleatória atinge suas notas. Alto risco, alto sabor." },
};

const t = (key, lang, vars) => {
  const entry = STRINGS[key];
  let s = entry ? (entry[lang] != null ? entry[lang] : entry.en) : key;
  if (typeof s === "string" && vars) {
    Object.entries(vars).forEach(([k, v]) => { s = s.split(`{${k}}`).join(v); });
  }
  return s;
};

const pick = (field, lang) => {
  if (field == null) return field;
  if (typeof field === "string") return field;
  if (typeof field === "object" && (field.en != null || field.pt != null)) {
    return field[lang] != null ? field[lang] : field.en;
  }
  return field;
};

// ============================================================
// DATA — bilingual content
// ============================================================

const QUESTIONS = [
  {
    id: "q1", pillarKey: "ethics", difficultyKey: "easy",
    prompt: {
      en: "What is the primary problem that Corporate Governance is designed to reduce?",
      pt: "Qual é o problema central que a Governança Corporativa busca reduzir?",
    },
    options: [
      { k: "A", correct: false,
        text: { en: "Currency risk in international trade.",                                  pt: "Risco cambial no comércio internacional." },
        note: { en: "FX risk is a treasury concern, not the foundational governance problem.", pt: "Risco cambial é tema de tesouraria, não o problema-base de governança." },
        weights: { steward: 0, agent: 0, stakeholder: 0, monitor: 0, connector: 0 },
      },
      { k: "B", correct: true,
        text: { en: "Conflicts of interest between owners and managers — the agency problem.", pt: "Conflitos de interesse entre proprietários e gestores — o problema da agência." },
        note: { en: "Jensen & Meckling (1976): owners delegate to managers, whose self-interest may diverge from shareholder value.",
                pt: "Jensen & Meckling (1976): proprietários delegam aos gestores, cujo interesse próprio pode divergir do valor dos acionistas." },
        weights: { steward: 2, agent: -1, stakeholder: 0, monitor: 1, connector: 0 },
      },
      { k: "C", correct: false,
        text: { en: "Seasonal sales variations across fiscal quarters.", pt: "Variações sazonais de vendas entre trimestres fiscais." },
        note: { en: "Operational, not a governance problem.",            pt: "Tema operacional, não de governança." },
        weights: { steward: 0, agent: 1, stakeholder: -1, monitor: -1, connector: 0 },
      },
      { k: "D", correct: false,
        text: { en: "The cost of external audits and consultancy.", pt: "O custo de auditorias e consultorias externas." },
        note: { en: "Audit cost is an output of governance, not its target.", pt: "Custo de auditoria é consequência da governança, não seu alvo." },
        weights: { steward: 0, agent: 0, stakeholder: 0, monitor: 2, connector: 0 },
      },
    ],
    citation: { en: "Jensen & Meckling — Theory of the Firm (1976)", pt: "Jensen & Meckling — Theory of the Firm (1976)" },
  },
  {
    id: "q2", pillarKey: "ethics", difficultyKey: "easy",
    prompt: {
      en: "Which IBGC pillar guarantees the fair and impartial treatment of all shareholders, especially minorities?",
      pt: "Qual pilar do IBGC garante o tratamento justo e imparcial de todos os acionistas, especialmente os minoritários?",
    },
    options: [
      { k: "A", correct: false,
        text: { en: "Transparency.",   pt: "Transparência." },
        note: { en: "Transparency governs disclosure, not equitable treatment.", pt: "Transparência rege a divulgação, não o tratamento equitativo." },
        weights: { steward: 0, agent: 0, stakeholder: 0, monitor: 2, connector: 0 },
      },
      { k: "B", correct: true,
        text: { en: "Fairness (Equity).", pt: "Equidade." },
        note: { en: "Equidade is the IBGC pillar protecting minority shareholders from controller abuse.",
                pt: "A Equidade é o pilar do IBGC que protege acionistas minoritários do abuso do controlador." },
        weights: { steward: 1, agent: -1, stakeholder: 3, monitor: 1, connector: 0 },
      },
      { k: "C", correct: false,
        text: { en: "Accountability.", pt: "Prestação de Contas." },
        note: { en: "Accountability concerns the duty to render account, not equity of treatment.",
                pt: "Prestação de contas trata do dever de prestar contas, não da equidade de tratamento." },
        weights: { steward: 1, agent: 0, stakeholder: 0, monitor: 1, connector: 0 },
      },
      { k: "D", correct: false,
        text: { en: "Corporate Responsibility.", pt: "Responsabilidade Corporativa." },
        note: { en: "Responsibility addresses long-term sustainability, not minority rights.",
                pt: "A Responsabilidade trata de sustentabilidade de longo prazo, não de direitos de minoritários." },
        weights: { steward: 2, agent: -1, stakeholder: 1, monitor: 0, connector: 0 },
      },
    ],
    citation: { en: "IBGC — Code of Best Practices, 6th edition", pt: "IBGC — Código das Melhores Práticas, 6ª edição" },
  },
  {
    id: "q3", pillarKey: "disclosure", difficultyKey: "medium",
    prompt: {
      en: "Under B3's Novo Mercado listing segment, what type of shares is a company allowed to issue?",
      pt: "No segmento Novo Mercado da B3, qual tipo de ação a companhia pode emitir?",
    },
    options: [
      { k: "A", correct: false,
        text: { en: "Preferred shares with double dividends.", pt: "Ações preferenciais com dividendo em dobro." },
        note: { en: "Novo Mercado prohibits preferred shares entirely.", pt: "O Novo Mercado proíbe completamente ações preferenciais." },
        weights: { steward: 0, agent: 1, stakeholder: -1, monitor: -1, connector: 0 },
      },
      { k: "B", correct: true,
        text: { en: "Only common voting shares — one share, one vote.", pt: "Apenas ações ordinárias com voto — uma ação, um voto." },
        note: { en: "Novo Mercado is B3's highest tier; voting power tracks economic interest exactly.",
                pt: "O Novo Mercado é o nível máximo da B3; poder de voto acompanha exatamente o interesse econômico." },
        weights: { steward: 1, agent: -2, stakeholder: 3, monitor: 2, connector: 0 },
      },
      { k: "C", correct: false,
        text: { en: "Dual-class shares with super-voting rights for founders.", pt: "Ações de classe dupla com voto qualificado para fundadores." },
        note: { en: "Dual-class structures are explicitly forbidden under Novo Mercado.",
                pt: "Estruturas dual-class são explicitamente vedadas no Novo Mercado." },
        weights: { steward: -1, agent: 2, stakeholder: -2, monitor: -2, connector: 1 },
      },
      { k: "D", correct: false,
        text: { en: "Hybrid debentures convertible at the controller's option.", pt: "Debêntures híbridas conversíveis a critério do controlador." },
        note: { en: "Conversion at controller option would entrench control — incompatible with the segment.",
                pt: "Conversão a critério do controlador entrincheiraria o controle — incompatível com o segmento." },
        weights: { steward: 0, agent: 2, stakeholder: -2, monitor: -1, connector: 0 },
      },
    ],
    citation: { en: "B3 — Regulamento do Novo Mercado, §3.1", pt: "B3 — Regulamento do Novo Mercado, §3.1" },
  },
  {
    id: "q4", pillarKey: "audit", difficultyKey: "medium",
    prompt: {
      en: "The Sarbanes-Oxley Act (SOX) was enacted after Enron and WorldCom. What does Section 302 require?",
      pt: "A Lei Sarbanes-Oxley (SOX) foi promulgada após Enron e WorldCom. O que exige a Seção 302?",
    },
    options: [
      { k: "A", correct: true,
        text: { en: "CEOs and CFOs must personally certify the accuracy of financial reports.",
                pt: "CEOs e CFOs devem certificar pessoalmente a exatidão dos relatórios financeiros." },
        note: { en: "§302 makes officers personally — and criminally — liable for material misstatements.",
                pt: "A §302 torna os executivos pessoal e criminalmente responsáveis por declarações materialmente falsas." },
        weights: { steward: 1, agent: -1, stakeholder: 0, monitor: 3, connector: 0 },
      },
      { k: "B", correct: false,
        text: { en: "Companies must hire the same firm for auditing and consulting.",
                pt: "Companhias devem contratar a mesma firma para auditoria e consultoria." },
        note: { en: "SOX forbids most audit/consulting bundling — §201.",
                pt: "A SOX veda a maior parte da combinação auditoria/consultoria — §201." },
        weights: { steward: -1, agent: 1, stakeholder: 0, monitor: -2, connector: 1 },
      },
      { k: "C", correct: false,
        text: { en: "Shareholders must vote directly on executive pay annually.",
                pt: "Acionistas devem votar diretamente a remuneração executiva todo ano." },
        note: { en: "Say-on-pay arose under Dodd-Frank, not SOX.",
                pt: "O say-on-pay surgiu na Dodd-Frank, não na SOX." },
        weights: { steward: 0, agent: 0, stakeholder: 1, monitor: 0, connector: 0 },
      },
      { k: "D", correct: false,
        text: { en: "Whistleblowers gain anonymity in audit-committee reporting.",
                pt: "Denunciantes ganham anonimato no canal do comitê de auditoria." },
        note: { en: "That's §806 — adjacent, but a different section.",
                pt: "Isso é a §806 — próxima, mas uma seção distinta." },
        weights: { steward: 0, agent: 0, stakeholder: 1, monitor: 1, connector: 0 },
      },
    ],
    citation: { en: "Sarbanes-Oxley Act of 2002, §302", pt: "Sarbanes-Oxley Act de 2002, §302" },
  },
  {
    id: "q5", pillarKey: "risk", difficultyKey: "hard",
    prompt: {
      en: "Per Resource Dependence Theory, what is a primary risk of a board heavily composed of well-connected politicians and creditors?",
      pt: "Segundo a Teoria da Dependência de Recursos, qual o principal risco de um conselho muito composto por políticos bem-relacionados e credores?",
    },
    options: [
      { k: "A", correct: false,
        text: { en: "A measurable decrease in technological innovation rates.",
                pt: "Queda mensurável nas taxas de inovação tecnológica." },
        note: { en: "Possible second-order effect, not the central thesis.",
                pt: "Efeito de segunda ordem possível, mas não a tese central." },
        weights: { steward: 0, agent: 0, stakeholder: 0, monitor: 0, connector: -1 },
      },
      { k: "B", correct: true,
        text: { en: "Board capture by external stakeholders or the State (e.g., Lava Jato).",
                pt: "Captura do conselho por stakeholders externos ou pelo Estado (ex.: Lava Jato)." },
        note: { en: "Pfeffer & Salancik: the same external ties that reduce uncertainty also create capture risk.",
                pt: "Pfeffer & Salancik: os mesmos vínculos externos que reduzem incerteza criam risco de captura." },
        weights: { steward: 1, agent: -1, stakeholder: 1, monitor: 1, connector: 3 },
      },
      { k: "C", correct: false,
        text: { en: "Mandatory elimination of the audit committee.",
                pt: "Eliminação obrigatória do comitê de auditoria." },
        note: { en: "Composition does not affect the audit committee's existence.",
                pt: "Composição não afeta a existência do comitê de auditoria." },
        weights: { steward: 0, agent: 0, stakeholder: 0, monitor: -2, connector: 0 },
      },
      { k: "D", correct: false,
        text: { en: "Increased dividend payout volatility.",
                pt: "Aumento da volatilidade do payout de dividendos." },
        note: { en: "Dividend policy is set independently of board composition.",
                pt: "Política de dividendos é definida independentemente da composição do conselho." },
        weights: { steward: 0, agent: 1, stakeholder: -1, monitor: 0, connector: 0 },
      },
    ],
    citation: { en: "Pfeffer & Salancik — The External Control of Organizations (1978)", pt: "Pfeffer & Salancik — The External Control of Organizations (1978)" },
  },
  {
    id: "q6", pillarKey: "audit", difficultyKey: "hard",
    prompt: {
      en: "In the Enron scandal, the company used Special Purpose Entities (SPEs) primarily to:",
      pt: "No escândalo da Enron, a empresa usou Sociedades de Propósito Específico (SPEs) principalmente para:",
    },
    options: [
      { k: "A", correct: true,
        text: { en: "Hide debts and inflate reported earnings off-balance-sheet.",
                pt: "Esconder dívidas e inflar os lucros reportados fora do balanço." },
        note: { en: "LJM, Raptors, etc. — debt and weak assets parked outside consolidation manufactured paper earnings.",
                pt: "LJM, Raptors etc. — dívida e ativos fracos parqueados fora da consolidação fabricaram lucros de papel." },
        weights: { steward: 1, agent: -2, stakeholder: 0, monitor: 3, connector: 0 },
      },
      { k: "B", correct: false,
        text: { en: "Invest in ethical water-treatment infrastructure projects.", pt: "Investir em projetos éticos de tratamento de água." },
        note: { en: "Enron's SPEs were not ESG vehicles.", pt: "As SPEs da Enron não eram veículos ESG." },
        weights: { steward: 0, agent: 0, stakeholder: 1, monitor: -1, connector: 0 },
      },
      { k: "C", correct: false,
        text: { en: "Pay regular dividends to minority shareholders.", pt: "Pagar dividendos regulares a acionistas minoritários." },
        note: { en: "SPEs were not dividend conduits.", pt: "As SPEs não eram canais de dividendos." },
        weights: { steward: 0, agent: 1, stakeholder: -1, monitor: -1, connector: 0 },
      },
      { k: "D", correct: false,
        text: { en: "Comply with SEC fair-disclosure requirements.", pt: "Cumprir os requisitos de divulgação justa da SEC." },
        note: { en: "They were structured to avoid, not satisfy, disclosure norms.", pt: "Foram estruturadas para evitar, não cumprir, normas de divulgação." },
        weights: { steward: 0, agent: 0, stakeholder: 0, monitor: -1, connector: 0 },
      },
    ],
    citation: { en: "SEC v. Enron — In re Enron Corp. Securities (2003)", pt: "SEC v. Enron — In re Enron Corp. Securities (2003)" },
  },
  {
    id: "q7", pillarKey: "esg", difficultyKey: "medium",
    prompt: {
      en: "Within a double-materiality framework, which item belongs to inward (financial) materiality?",
      pt: "Dentro do conceito de dupla materialidade, qual item pertence à materialidade financeira (inward)?",
    },
    options: [
      { k: "A", correct: false,
        text: { en: "The firm's Scope 3 emissions on regional air quality.", pt: "As emissões Escopo 3 da empresa sobre a qualidade do ar regional." },
        note: { en: "That is impact materiality — outward effect.", pt: "Isso é materialidade de impacto — efeito para fora." },
        weights: { steward: 0, agent: 0, stakeholder: 2, monitor: 0, connector: 0 },
      },
      { k: "B", correct: true,
        text: { en: "Carbon-pricing legislation impacting the firm's cost base.", pt: "Legislação de precificação de carbono que afeta a estrutura de custos da empresa." },
        note: { en: "Inward materiality: how sustainability factors affect the firm's financial performance.",
                pt: "Materialidade inward: como fatores de sustentabilidade afetam o desempenho financeiro da empresa." },
        weights: { steward: 1, agent: 1, stakeholder: 2, monitor: 2, connector: 0 },
      },
      { k: "C", correct: false,
        text: { en: "Community displacement adjacent to a new facility.", pt: "Deslocamento comunitário próximo a uma nova planta." },
        note: { en: "Impact materiality, not inward.", pt: "Materialidade de impacto, não inward." },
        weights: { steward: 1, agent: -1, stakeholder: 2, monitor: 0, connector: 0 },
      },
      { k: "D", correct: false,
        text: { en: "Effluent from operations entering a watershed.", pt: "Efluentes das operações chegando a uma bacia hidrográfica." },
        note: { en: "Impact materiality — externalities on stakeholders.", pt: "Materialidade de impacto — externalidades sobre stakeholders." },
        weights: { steward: 0, agent: -1, stakeholder: 2, monitor: 0, connector: 0 },
      },
    ],
    citation: { en: "EFRAG ESRS 1, §3 — Double materiality", pt: "EFRAG ESRS 1, §3 — Dupla materialidade" },
  },
  {
    id: "q8", pillarKey: "strategy", difficultyKey: "easy",
    prompt: {
      en: "A board member discloses a personal investment in a firm being considered as an acquisition target. What is the appropriate first step?",
      pt: "Um conselheiro divulga um investimento pessoal em empresa cogitada como alvo de aquisição. Qual o primeiro passo adequado?",
    },
    options: [
      { k: "A", correct: false,
        text: { en: "Allow the member to vote, noting the disclosure in the minutes.",
                pt: "Permitir que ele vote, registrando a divulgação em ata." },
        note: { en: "Disclosure alone does not eliminate the conflict.", pt: "Divulgação sozinha não elimina o conflito." },
        weights: { steward: -1, agent: 2, stakeholder: -1, monitor: -2, connector: 1 },
      },
      { k: "B", correct: true,
        text: { en: "Recuse the member from deliberation and the vote.",
                pt: "Afastá-lo da deliberação e da votação (recusa formal)." },
        note: { en: "Recusal is the standard remedy for material conflicts of interest.",
                pt: "A recusa formal é o remédio padrão para conflitos materiais de interesse." },
        weights: { steward: 1, agent: -1, stakeholder: 2, monitor: 3, connector: 0 },
      },
      { k: "C", correct: false,
        text: { en: "Require the member to divest before the next meeting.",
                pt: "Exigir desinvestimento antes da próxima reunião." },
        note: { en: "Divestment may follow, but the immediate remedy is recusal.",
                pt: "Desinvestimento pode vir depois, mas o remédio imediato é a recusa." },
        weights: { steward: 1, agent: 0, stakeholder: 1, monitor: 1, connector: -1 },
      },
      { k: "D", correct: false,
        text: { en: "Refer the matter to the external auditor for review.",
                pt: "Encaminhar o tema ao auditor externo para análise." },
        note: { en: "Auditor review is unrelated to a deliberative conflict.",
                pt: "Análise do auditor não trata de conflito deliberativo." },
        weights: { steward: 0, agent: 0, stakeholder: 0, monitor: 2, connector: 0 },
      },
    ],
    citation: { en: "OECD Principles of Corporate Governance, Principle V.A.4", pt: "Princípios de Governança Corporativa OCDE, Princípio V.A.4" },
  },
];

const SCENARIOS = [
  {
    id: "s_whistle",
    code: "CRISIS — 04",
    title: { en: "The Whistleblower's Letter", pt: "A Carta do Denunciante" },
    titleHtmlA: { en: "The",         pt: "A" },
    titleHtmlItalic: { en: "Whistleblower's", pt: "Carta do" },
    titleHtmlB: { en: "Letter.",     pt: "Denunciante." },
    dateline: {
      en: "21:47 — Wednesday, en route to the quarterly earnings call",
      pt: "21:47 — Quarta-feira, a caminho do call trimestral de resultados",
    },
    body: {
      en: "Forty-six minutes before market open, an anonymous letter from inside the finance organization arrives at the audit committee chair's residence. It alleges that revenue from three contracts — totalling 4.2% of FY guidance — has been recognized prematurely. The CFO, present on the call, was not copied. The board chair has reached you. The street is waiting.",
      pt: "Quarenta e seis minutos antes da abertura do mercado, uma carta anônima vinda de dentro da área financeira chega à residência do presidente do comitê de auditoria. Ela alega que receita de três contratos — totalizando 4,2% do guidance anual — foi reconhecida prematuramente. O CFO, presente na call, não foi copiado. O presidente do conselho ligou para você. O mercado aguarda.",
    },
    meta: [
      { label: { en: "Reporting window",  pt: "Janela de divulgação" }, value: { en: "46 min",            pt: "46 min" } },
      { label: { en: "Material exposure", pt: "Exposição material" },   value: { en: "4.2% FY",           pt: "4,2% do ano" } },
      { label: { en: "Audit committee",   pt: "Comitê de auditoria" },  value: { en: "3 of 4 reachable", pt: "3 de 4 acessíveis" } },
      { label: { en: "Disclosure status", pt: "Status da divulgação" }, value: { en: "Pending",           pt: "Pendente" } },
    ],
    decisions: [
      {
        id: "d1", tone: "negative",
        title: { en: "Proceed with guidance as planned.",                                pt: "Seguir com o guidance como planejado." },
        sub:   { en: "Do not delay the call. Investigate the allegation discreetly post-close.", pt: "Não adiar a call. Investigar a denúncia discretamente após o fechamento." },
        verdict: { en: "Concealment risk", pt: "Risco de ocultação" },
        impacts: { reputation: -22, esg: -8,  board: -18, transparency: -34 },
        weights: { steward: -2, agent: 3, stakeholder: -2, monitor: -3, connector: 1 },
      },
      {
        id: "d2", tone: "positive",
        title: { en: "Issue a brief market notice; postpone guidance.", pt: "Emitir comunicado breve ao mercado; adiar o guidance." },
        sub:   { en: "Disclose the inquiry without specifics. Reconvene the audit committee within 24 hours.", pt: "Divulgar a apuração sem entrar em detalhes. Reconvocar o comitê de auditoria em 24 horas." },
        verdict: { en: "Measured disclosure", pt: "Divulgação ponderada" },
        impacts: { reputation: -6,  esg: +2,  board: +12, transparency: +18 },
        weights: { steward: 1, agent: -1, stakeholder: 1, monitor: 2, connector: 0 },
      },
      {
        id: "d3", tone: "positive",
        title: { en: "Halt trading; convene full board within 90 minutes.", pt: "Suspender negociação; reunir o conselho pleno em 90 minutos." },
        sub:   { en: "Engage external counsel, formal review, full transparency before any guidance.", pt: "Engajar assessoria externa, revisão formal, total transparência antes de qualquer guidance." },
        verdict: { en: "Highest fiduciary standard", pt: "Padrão fiduciário máximo" },
        impacts: { reputation: -2,  esg: +4,  board: +20, transparency: +28 },
        weights: { steward: 3, agent: -3, stakeholder: 2, monitor: 3, connector: -1 },
      },
      {
        id: "d4", tone: "negative",
        title: { en: "Confront the CFO before the call begins.", pt: "Confrontar o CFO antes da call começar." },
        sub:   { en: "Direct, off-the-record. Decide collectively whether to proceed.", pt: "Direto, fora dos autos. Decidir coletivamente se prossegue." },
        verdict: { en: "Procedural deviation", pt: "Desvio procedural" },
        impacts: { reputation: -10, esg: -2,  board: -8,  transparency: -4  },
        weights: { steward: 0, agent: 1, stakeholder: -1, monitor: -2, connector: 2 },
      },
    ],
  },
  {
    id: "s_americanas",
    code: "CRISIS — 07",
    title: { en: "The Americanas Inconsistency", pt: "A Inconsistência Americanas" },
    titleHtmlA: { en: "The",          pt: "A" },
    titleHtmlItalic: { en: "Americanas", pt: "Inconsistência" },
    titleHtmlB: { en: "Inconsistency.", pt: "Americanas." },
    dateline: {
      en: "06:14 — São Paulo, before the opening bell",
      pt: "06:14 — São Paulo, antes do pregão",
    },
    body: {
      en: "Your CFO calls a 6 a.m. meeting. A R$ 20 billion accounting inconsistency tied to supplier financing — risco sacado — has just surfaced. The market does not yet know. Auditors will ask in fourteen days. Three independent directors are awaiting your call.",
      pt: "Seu CFO convoca uma reunião às 6h. Uma inconsistência contábil de R$ 20 bilhões ligada ao risco sacado acaba de aparecer. O mercado ainda não sabe. Os auditores vão perguntar em catorze dias. Três conselheiros independentes aguardam sua ligação.",
    },
    meta: [
      { label: { en: "Exposure",     pt: "Exposição" },     value: { en: "R$ 20 bn",      pt: "R$ 20 bi" } },
      { label: { en: "Audit window", pt: "Janela auditoria" }, value: { en: "14 days",     pt: "14 dias" } },
      { label: { en: "Counsel",      pt: "Assessoria" },    value: { en: "Engaged",       pt: "Engajada" } },
      { label: { en: "Status",       pt: "Status" },        value: { en: "Pre-disclosure", pt: "Pré-divulgação" } },
    ],
    decisions: [
      {
        id: "d1", tone: "positive",
        title: { en: "Release a Material Fact (Fato Relevante) immediately.", pt: "Divulgar Fato Relevante imediatamente." },
        sub:   { en: "Comply with CVM Resolution 44 — disclose now, take the hit, preserve credibility.", pt: "Cumprir a Res. CVM 44 — divulgar já, absorver o impacto, preservar credibilidade." },
        verdict: { en: "Comply now", pt: "Cumprir agora" },
        impacts: { reputation: -20, esg: +6, board: +18, transparency: +30 },
        weights: { steward: 2, agent: -2, stakeholder: 2, monitor: 3, connector: -1 },
      },
      {
        id: "d2", tone: "negative",
        title: { en: "Reclassify it as cooperative advertising pending audit.", pt: "Reclassificar como propaganda cooperada até a auditoria." },
        sub:   { en: "Buy time. Hope a strong quarter offsets the gap before anyone digs.", pt: "Ganhar tempo. Torcer para um trimestre forte cobrir o buraco antes que cavem." },
        verdict: { en: "Concealment risk", pt: "Risco de ocultação" },
        impacts: { reputation: +8, esg: -22, board: -28, transparency: -42 },
        weights: { steward: -2, agent: 3, stakeholder: -2, monitor: -3, connector: 1 },
      },
      {
        id: "d3", tone: "negative",
        title: { en: "Brief major shareholders under NDA before disclosure.", pt: "Avisar grandes acionistas sob NDA antes da divulgação." },
        sub:   { en: "Selective preview to anchor investors; full statement at close.", pt: "Prévia seletiva para investidores-âncora; comunicado completo no fechamento." },
        verdict: { en: "Selective disclosure", pt: "Divulgação seletiva" },
        impacts: { reputation: -8, esg: -4, board: -10, transparency: -18 },
        weights: { steward: -1, agent: 1, stakeholder: -2, monitor: -2, connector: 2 },
      },
      {
        id: "d4", tone: "positive",
        title: { en: "Convene independent investigation; CEO and CFO step aside.", pt: "Convocar investigação independente; CEO e CFO se afastam." },
        sub:   { en: "Ring-fence governance. External counsel leads. Disclosure within 48h.", pt: "Cercar a governança. Assessoria externa lidera. Divulgação em 48h." },
        verdict: { en: "Highest standard", pt: "Padrão máximo" },
        impacts: { reputation: -12, esg: +10, board: +22, transparency: +24 },
        weights: { steward: 3, agent: -3, stakeholder: 2, monitor: 3, connector: -1 },
      },
    ],
  },
  {
    id: "s_green",
    code: "CRISIS — 11",
    title: { en: "The Greenwashing Trap", pt: "A Armadilha do Greenwashing" },
    titleHtmlA: { en: "The",         pt: "A Armadilha" },
    titleHtmlItalic: { en: "Greenwashing", pt: "do" },
    titleHtmlB: { en: "Trap.",       pt: "Greenwashing." },
    dateline: {
      en: "14:02 — Wednesday, two weeks to Black Friday",
      pt: "14:02 — Quarta-feira, duas semanas até a Black Friday",
    },
    body: {
      en: "Marketing wants to launch a 100% Carbon Neutral campaign tied to the holiday peak. The ESG Committee warns that Scope 3 supply-chain data is unverified — an audit is mid-flight. The CMO has reserved prime media for tomorrow morning. The Board chair asks for your call.",
      pt: "Marketing quer lançar uma campanha 100% Carbono Neutro atrelada ao pico de fim de ano. O Comitê ESG alerta que os dados Escopo 3 da cadeia ainda não estão verificados — uma auditoria está em andamento. A CMO já reservou mídia premium para amanhã de manhã. O presidente do conselho pede sua decisão.",
    },
    meta: [
      { label: { en: "Audit",          pt: "Auditoria" },      value: { en: "Mid-flight",     pt: "Em andamento" } },
      { label: { en: "Media booked",   pt: "Mídia contratada" }, value: { en: "Tomorrow 06:00", pt: "Amanhã 06:00" } },
      { label: { en: "Scope 3 status", pt: "Status Escopo 3" }, value: { en: "Unverified",     pt: "Não verificado" } },
      { label: { en: "Board mood",     pt: "Clima no conselho" }, value: { en: "Split 4-3",     pt: "Dividido 4-3" } },
    ],
    decisions: [
      {
        id: "d1", tone: "negative",
        title: { en: "Launch the full campaign as drafted.", pt: "Lançar a campanha completa como está." },
        sub:   { en: "Stakeholders want good news. Reconcile the data later if questioned.", pt: "Stakeholders querem boas notícias. Reconciliar dados depois, se cobrarem." },
        verdict: { en: "Marketing-led", pt: "Liderada por marketing" },
        impacts: { reputation: +6, esg: -32, board: -16, transparency: -22 },
        weights: { steward: -1, agent: 3, stakeholder: -3, monitor: -2, connector: 1 },
      },
      {
        id: "d2", tone: "positive",
        title: { en: "Delay until Internal Audit verifies the supply chain.", pt: "Adiar até a Auditoria Interna verificar a cadeia." },
        sub:   { en: "Smaller campaign with claims you can defend in court.", pt: "Campanha menor com alegações defensáveis em juízo." },
        verdict: { en: "Audit-aligned", pt: "Alinhada à auditoria" },
        impacts: { reputation: -4, esg: +18, board: +14, transparency: +20 },
        weights: { steward: 1, agent: -2, stakeholder: 2, monitor: 3, connector: -1 },
      },
      {
        id: "d3", tone: "negative",
        title: { en: "Soft-launch with hedged language.", pt: "Lançar suavemente com linguagem dúbia." },
        sub:   { en: "Ambiguity protects everyone — for now.", pt: "Ambiguidade protege a todos — por ora." },
        verdict: { en: "Procedural drift", pt: "Desvio procedural" },
        impacts: { reputation: +2, esg: -8, board: -6, transparency: -10 },
        weights: { steward: 0, agent: 1, stakeholder: -1, monitor: -1, connector: 2 },
      },
      {
        id: "d4", tone: "positive",
        title: { en: "Announce a verified roadmap to neutrality by 2030.", pt: "Anunciar um roadmap verificado para neutralidade até 2030." },
        sub:   { en: "Substitute aspiration for false claim. Bind the firm to a credible plan.", pt: "Substituir alegação falsa por aspiração. Comprometer a empresa com plano crível." },
        verdict: { en: "Credible commitment", pt: "Compromisso crível" },
        impacts: { reputation: +4, esg: +14, board: +10, transparency: +12 },
        weights: { steward: 2, agent: -1, stakeholder: 3, monitor: 1, connector: 0 },
      },
    ],
  },
  {
    id: "s_ceo",
    code: "CRISIS — 02",
    title: { en: "CEO Compensation Package", pt: "Pacote de Remuneração do CEO" },
    titleHtmlA: { en: "The",        pt: "O" },
    titleHtmlItalic: { en: "Compensation", pt: "Pacote de" },
    titleHtmlB: { en: "Package.",   pt: "Remuneração." },
    dateline: {
      en: "10:30 — Compensation Committee, off-cycle",
      pt: "10:30 — Comitê de Remuneração, fora do ciclo",
    },
    body: {
      en: "The CEO requests a stock-option package worth four times last year's grant, with a low strike price and one-year vesting. Performance has been mediocre. The Compensation Committee is split. Proxy advisors will review the proposal before the AGM.",
      pt: "O CEO solicita um pacote de stock options no valor de quatro vezes a outorga do ano passado, com strike baixo e vesting de um ano. O desempenho tem sido mediano. O Comitê de Remuneração está dividido. Conselheiros de voto (proxy advisors) revisarão a proposta antes da AGM.",
    },
    meta: [
      { label: { en: "Pay multiple",  pt: "Múltiplo de pgto" }, value: { en: "4× prior",  pt: "4× anterior" } },
      { label: { en: "Vesting",       pt: "Vesting" },          value: { en: "1 year",    pt: "1 ano" } },
      { label: { en: "Performance",   pt: "Desempenho" },       value: { en: "Median",    pt: "Mediano" } },
      { label: { en: "Committee",     pt: "Comitê" },           value: { en: "Split 2-2", pt: "Dividido 2-2" } },
    ],
    decisions: [
      {
        id: "d1", tone: "negative",
        title: { en: "Approve as-is to retain the CEO.", pt: "Aprovar como está para reter o CEO." },
        sub:   { en: "Avoid the disruption of a leadership change.", pt: "Evitar a disrupção de uma troca de liderança." },
        verdict: { en: "Agency cost incurred", pt: "Custo de agência incorrido" },
        impacts: { reputation: -14, esg: -6, board: -16, transparency: -10 },
        weights: { steward: -2, agent: 3, stakeholder: -1, monitor: -2, connector: 1 },
      },
      {
        id: "d2", tone: "positive",
        title: { en: "Tie vesting to long-term ESG and EPS over 5 years.", pt: "Atrelar vesting a metas ESG e LPA de longo prazo por 5 anos." },
        sub:   { en: "Align pay with sustained value creation.", pt: "Alinhar remuneração à criação de valor sustentada." },
        verdict: { en: "Alignment achieved", pt: "Alinhamento alcançado" },
        impacts: { reputation: +10, esg: +14, board: +18, transparency: +12 },
        weights: { steward: 3, agent: -1, stakeholder: 2, monitor: 2, connector: 0 },
      },
      {
        id: "d3", tone: "positive",
        title: { en: "Reject and open a CEO succession process.", pt: "Rejeitar e abrir processo de sucessão do CEO." },
        sub:   { en: "Costly, risky, but signals discipline.", pt: "Custoso, arriscado, mas sinaliza disciplina." },
        verdict: { en: "Disciplined Board", pt: "Conselho disciplinado" },
        impacts: { reputation: +4, esg: +6, board: +12, transparency: +14 },
        weights: { steward: 1, agent: -1, stakeholder: 1, monitor: 2, connector: -1 },
      },
      {
        id: "d4", tone: "positive",
        title: { en: "Defer to next cycle and commission an external benchmark.", pt: "Adiar para próximo ciclo e contratar benchmark externo." },
        sub:   { en: "Buy time. Let an independent firm establish the band.", pt: "Ganhar tempo. Deixar firma independente estabelecer a faixa." },
        verdict: { en: "Procedural delay", pt: "Adiamento procedural" },
        impacts: { reputation: -2, esg: 0, board: +4, transparency: +6 },
        weights: { steward: 0, agent: 0, stakeholder: 0, monitor: 1, connector: 2 },
      },
    ],
  },
  {
    id: "s_spe",
    code: "CRISIS — 09",
    title: { en: "The Off-Balance-Sheet SPE", pt: "A SPE Fora do Balanço" },
    titleHtmlA: { en: "The",                 pt: "A SPE" },
    titleHtmlItalic: { en: "Off-Balance-Sheet", pt: "Fora do" },
    titleHtmlB: { en: "Vehicle.",            pt: "Balanço." },
    dateline: {
      en: "17:48 — Tuesday, Treasury & Big-4",
      pt: "17:48 — Terça-feira, Tesouraria & Big-4",
    },
    body: {
      en: "Treasury proposes routing a USD 300 million underperforming asset through a non-consolidated SPE. The Big-4 auditor calls the structure technically defensible. Your General Counsel is uneasy. Two analysts have already noted Enron-like complexity in their last report.",
      pt: "A Tesouraria propõe canalizar um ativo de baixo desempenho de USD 300 milhões por uma SPE não consolidada. O auditor Big-4 chama a estrutura de tecnicamente defensável. O Diretor Jurídico está desconfortável. Dois analistas já apontaram complexidade ao estilo Enron no último relatório.",
    },
    meta: [
      { label: { en: "Asset",      pt: "Ativo" },      value: { en: "$300M",                pt: "US$ 300M" } },
      { label: { en: "Structure",  pt: "Estrutura" },  value: { en: "Non-consolidated SPE", pt: "SPE não consolidada" } },
      { label: { en: "Auditor",    pt: "Auditor" },    value: { en: "Defensible",           pt: "Defensável" } },
      { label: { en: "GC posture", pt: "Postura do Jurídico" }, value: { en: "Cautious",   pt: "Cauteloso" } },
    ],
    decisions: [
      {
        id: "d1", tone: "negative",
        title: { en: "Approve. The structure is legal and improves ratios.", pt: "Aprovar. A estrutura é legal e melhora os indicadores." },
        sub:   { en: "Q4 numbers look much better with this off the books.", pt: "Os números do 4T ficam muito melhores com isso fora do balanço." },
        verdict: { en: "Echoes of Enron", pt: "Ecos de Enron" },
        impacts: { reputation: -18, esg: -10, board: -22, transparency: -34 },
        weights: { steward: -2, agent: 3, stakeholder: -1, monitor: -3, connector: 1 },
      },
      {
        id: "d2", tone: "positive",
        title: { en: "Reject. Recognize the impairment on-balance-sheet.", pt: "Rejeitar. Reconhecer o impairment no balanço." },
        sub:   { en: "Take the hit. Keep the financials honest.", pt: "Absorver o impacto. Manter os números honestos." },
        verdict: { en: "Conservative integrity", pt: "Integridade conservadora" },
        impacts: { reputation: +12, esg: +6, board: +20, transparency: +28 },
        weights: { steward: 2, agent: -2, stakeholder: 1, monitor: 3, connector: -1 },
      },
      {
        id: "d3", tone: "negative",
        title: { en: "Approve with full footnote disclosure of the structure.", pt: "Aprovar com divulgação completa em nota explicativa." },
        sub:   { en: "Use the vehicle but expose its mechanics in the 20-F.", pt: "Usar o veículo mas explicitar a mecânica no 20-F." },
        verdict: { en: "Disclosed but fragile", pt: "Divulgado mas frágil" },
        impacts: { reputation: -4, esg: -2, board: -2, transparency: +4 },
        weights: { steward: -1, agent: 1, stakeholder: -1, monitor: 1, connector: 1 },
      },
      {
        id: "d4", tone: "positive",
        title: { en: "Restructure the asset internally; abandon the SPE.", pt: "Reestruturar o ativo internamente; abandonar a SPE." },
        sub:   { en: "Operational fix instead of accounting fix.", pt: "Solução operacional ao invés de solução contábil." },
        verdict: { en: "Substance over form", pt: "Essência sobre forma" },
        impacts: { reputation: +6, esg: +8, board: +14, transparency: +16 },
        weights: { steward: 2, agent: -1, stakeholder: 1, monitor: 2, connector: -1 },
      },
    ],
  },
  {
    id: "s_related",
    code: "CRISIS — 13",
    title: { en: "The Related-Party Transaction", pt: "A Operação com Parte Relacionada" },
    titleHtmlA: { en: "The",        pt: "A Operação" },
    titleHtmlItalic: { en: "Related-Party", pt: "com Parte" },
    titleHtmlB: { en: "Transaction.", pt: "Relacionada." },
    dateline: {
      en: "09:12 — Special Board meeting, controller present",
      pt: "09:12 — Reunião especial do conselho, controlador presente",
    },
    body: {
      en: "The controlling shareholder proposes selling a logistics company they personally own to your firm at fair market value — a price the family's consultant set. Independent directors were not briefed in advance. Minority shareholders representing 18% have written to the chair.",
      pt: "O controlador propõe vender uma empresa de logística que ele detém pessoalmente para sua firma a valor de mercado — preço definido pelo consultor da família. Os conselheiros independentes não foram informados previamente. Minoritários representando 18% escreveram ao presidente do conselho.",
    },
    meta: [
      { label: { en: "Counterparty", pt: "Contraparte" },           value: { en: "Controller",            pt: "Controlador" } },
      { label: { en: "Briefing",     pt: "Briefing" },              value: { en: "Independents excluded", pt: "Independentes excluídos" } },
      { label: { en: "Minority",     pt: "Minoritários" },          value: { en: "18% written",           pt: "18% escreveram" } },
      { label: { en: "Valuation",   pt: "Avaliação" },              value: { en: "Family advisor",        pt: "Consultor da família" } },
    ],
    decisions: [
      {
        id: "d1", tone: "positive",
        title: { en: "Demand a fairness opinion from an independent bank.", pt: "Exigir fairness opinion de banco independente." },
        sub:   { en: "Suspend the vote. Call a special meeting per Novo Mercado rules.", pt: "Suspender a votação. Convocar reunião especial conforme regras do Novo Mercado." },
        verdict: { en: "Fairness pillar honored", pt: "Pilar de equidade honrado" },
        impacts: { reputation: +12, esg: +6, board: +22, transparency: +20 },
        weights: { steward: 1, agent: -2, stakeholder: 2, monitor: 3, connector: -1 },
      },
      {
        id: "d2", tone: "negative",
        title: { en: "Approve at the proposed price to preserve relationships.", pt: "Aprovar pelo preço proposto para preservar a relação." },
        sub:   { en: "The controller will remember this loyalty.", pt: "O controlador vai se lembrar dessa lealdade." },
        verdict: { en: "Minority abuse", pt: "Abuso de minoritário" },
        impacts: { reputation: -16, esg: -8, board: -22, transparency: -28 },
        weights: { steward: -2, agent: 2, stakeholder: -3, monitor: -3, connector: 3 },
      },
      {
        id: "d3", tone: "negative",
        title: { en: "Negotiate a 15% discount and proceed without delay.", pt: "Negociar desconto de 15% e prosseguir sem demora." },
        sub:   { en: "Compromise. Avoid the public process.", pt: "Acordar. Evitar o processo público." },
        verdict: { en: "Half-measure", pt: "Meio-caminho" },
        impacts: { reputation: -4, esg: -2, board: -8, transparency: -10 },
        weights: { steward: 0, agent: 1, stakeholder: -1, monitor: -1, connector: 2 },
      },
      {
        id: "d4", tone: "positive",
        title: { en: "Refer to the Special Independent Committee per CVM Op. 35.", pt: "Encaminhar ao Comitê Especial Independente (Parecer CVM 35)." },
        sub:   { en: "Procedural rigor; full record for minorities and regulators.", pt: "Rigor procedural; registro completo para minoritários e regulador." },
        verdict: { en: "Procedural integrity", pt: "Integridade procedural" },
        impacts: { reputation: +8, esg: +4, board: +18, transparency: +24 },
        weights: { steward: 1, agent: -1, stakeholder: 2, monitor: 3, connector: -1 },
      },
    ],
  },
];

const TAKEOVER_CRISES = [
  {
    id: "t1",
    label:  { en: "Activist 13D",    pt: "Ativista 13D" },
    flavor: { en: "A New York fund discloses a 6.2% stake and demands two seats.",
              pt: "Um fundo de Nova York divulga participação de 6,2% e exige duas cadeiras." },
    impacts: { reputation: -8,  esg: -2,  board: -14, transparency: -4  },
  },
  {
    id: "t2",
    label:  { en: "Class Action",    pt: "Ação Coletiva" },
    flavor: { en: "Minority shareholders file suit alleging dilution.",
              pt: "Minoritários ajuízam ação alegando diluição." },
    impacts: { reputation: -14, esg: -2,  board: -10, transparency: -8  },
  },
  {
    id: "t3",
    label:  { en: "MSCI Downgrade",  pt: "Downgrade MSCI" },
    flavor: { en: "Two notches lower. Three ESG funds will trim positions.",
              pt: "Dois entalhes abaixo. Três fundos ESG reduzirão posição." },
    impacts: { reputation: -6,  esg: -22, board: -4,  transparency: -2  },
  },
  {
    id: "t4",
    label:  { en: "WSJ Exposé",      pt: "Reportagem WSJ" },
    flavor: { en: "A 4,000-word investigation drops Sunday morning.",
              pt: "Uma investigação de 4 mil palavras sai no domingo de manhã." },
    impacts: { reputation: -16, esg: -4,  board: -12, transparency: -10 },
  },
  {
    id: "t5",
    label:  { en: "CVM Penalty",     pt: "Multa CVM" },
    flavor: { en: "A R$ 18M fine and a public reprimand for late disclosure.",
              pt: "Multa de R$ 18M e censura pública por divulgação tardia." },
    impacts: { reputation: -12, esg: -2,  board: -8,  transparency: -16 },
  },
  {
    id: "t6",
    label:  { en: "Cyber Breach",    pt: "Vazamento Cibernético" },
    flavor: { en: "4.1M records leaked. ANPD opens an LGPD investigation.",
              pt: "4,1 milhões de registros vazados. ANPD abre apuração LGPD." },
    impacts: { reputation: -10, esg: -10, board: -8,  transparency: -6  },
  },
];

const ARCHETYPES = ["steward", "agent", "stakeholder", "monitor", "connector"];

const PROFILE = {
  name: "Elena Marés",
  initials: "EM",
};

const HOSTILE_TAKEOVER_COST = 2;

// ============================================================
// HOOKS / HELPERS
// ============================================================

function useViewport() {
  const get = () => (typeof window !== "undefined" ? window.innerWidth : 1280);
  const [w, setW] = useState(get);
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setW(window.innerWidth));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { w, isMobile: w < 768, isTablet: w >= 768 && w < 1024, isDesktop: w >= 1024 };
}

function useLang() {
  const initial = (() => {
    if (typeof localStorage === "undefined") return "en";
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "en" || stored === "pt") return stored;
    if (typeof navigator !== "undefined" && navigator.language && navigator.language.toLowerCase().startsWith("pt")) return "pt";
    return "en";
  })();
  const [lang, setLangRaw] = useState(initial);
  const setLang = useCallback((l) => {
    setLangRaw(l);
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
  }, []);
  return [lang, setLang];
}

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

const EMPTY_PROFILE = () => ({ steward: 0, agent: 0, stakeholder: 0, monitor: 0, connector: 0 });

function addWeights(profile, weights) {
  if (!weights) return profile;
  const out = { ...profile };
  for (const a of ARCHETYPES) out[a] = (out[a] || 0) + (weights[a] || 0);
  return out;
}

// Telemetry bars react to the weight vector — agent-aligned answers raise risk,
// monitor/stakeholder-aligned answers strengthen transparency/ESG, steward strengthens reputation.
// No right/wrong booleans drive scores anymore.
function applyAnswerTelemetry(s, weights) {
  const w = weights || {};
  const agentPos = Math.max(0, w.agent || 0);
  return {
    ...s,
    esg:          clamp(s.esg          + 2 * (w.stakeholder || 0) + 1 * (w.steward || 0)),
    reputation:   clamp(s.reputation   + 2 * (w.steward || 0)     + 1 * (w.monitor || 0)     - 2 * agentPos),
    risk:         clamp(s.risk         + 3 * agentPos             - 1 * (w.monitor || 0)),
    transparency: clamp(s.transparency + 2 * (w.monitor || 0)     + 1 * (w.stakeholder || 0) - 2 * agentPos),
    influence:    s.influence + 1,
  };
}

// ============================================================
// SUPABASE CLIENT + AUTH HELPERS
// ============================================================

const SB = (() => {
  const cfg = (typeof window !== "undefined" && window.GC_CONFIG) || {};
  if (!cfg.SUPABASE_URL || cfg.SUPABASE_URL.indexOf("YOUR-") === 0) return null;
  if (typeof window === "undefined" || !window.supabase) return null;
  try { return window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY); }
  catch (e) { return null; }
})();

const SESSION_KEY = "gc_session";
const PENDING_RUNS_KEY = "gc_pending_runs";

const Auth = {
  load() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },
  save(session) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {} },
  clear() { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} },
  async register({ username, password, full_name, course }) {
    if (!SB) return { error: "config_missing" };
    try {
      const { data, error } = await SB.rpc("register_user", {
        p_username: username, p_password: password,
        p_full_name: full_name, p_course: course,
      });
      if (error) {
        console.error("[register_user] supabase error:", error);
        return { error: "network", details: `${error.code || ""} ${error.message || error}`.trim() };
      }
      if (data && data.error) return { error: data.error };
      return { ok: true, session: data };
    } catch (e) {
      console.error("[register_user] exception:", e);
      return { error: "network", details: String(e && e.message || e) };
    }
  },
  async login({ username, password }) {
    if (!SB) return { error: "config_missing" };
    try {
      const { data, error } = await SB.rpc("login_user", { p_username: username, p_password: password });
      if (error) {
        console.error("[login_user] supabase error:", error);
        return { error: "network", details: `${error.code || ""} ${error.message || error}`.trim() };
      }
      if (data && data.error) return { error: data.error };
      return { ok: true, session: data };
    } catch (e) {
      console.error("[login_user] exception:", e);
      return { error: "network", details: String(e && e.message || e) };
    }
  },
  async logout(token) {
    if (!SB || !token) return;
    try { await SB.rpc("logout", { p_token: token }); } catch (e) {}
  },
  async saveRun(token, payload) {
    if (!SB) return { error: "config_missing" };
    try {
      const { data, error } = await SB.rpc("save_run", {
        p_token: token,
        p_composite:    payload.composite,
        p_esg:          payload.esg,
        p_reputation:   payload.reputation,
        p_transparency: payload.transparency,
        p_risk:         payload.risk,
        p_influence:    payload.influence,
        p_accuracy_pct: payload.accuracy_pct,
        p_archetype:    payload.archetype,
        p_tier:         payload.tier,
        p_lang:         payload.lang,
        p_profile:      payload.profile || null,
      });
      if (error) {
        console.error("[save_run] supabase error:", error);
        const msg = String(error.message || "").toLowerCase();
        if (msg.includes("failed to fetch") || msg.includes("networkerror") ||
            msg.includes("503") || msg.includes("coming up") || msg.includes("timeout")) {
          return { error: "warming", details: msg };
        }
        return { error: "network", details: msg };
      }
      if (data && data.error) return { error: data.error };
      return { ok: true };
    } catch (e) {
      console.error("[save_run] exception:", e);
      return { error: "warming", details: String(e && e.message || e) };
    }
  },
  async leaderboard(limit = 100) {
    if (!SB) return { error: "config_missing" };
    const { data, error } = await SB.rpc("leaderboard", { p_limit: limit });
    if (error) return { error: "network" };
    return { ok: true, rows: data || [] };
  },
};

// ============================================================
// SAVE QUEUE — offline / cold-start resilience
// ============================================================
// Runs that fail to save (because Supabase is warming up or the device
// is offline) are queued in localStorage and retried later — on next App
// mount, next Menu visit, or when navigator goes online.

const MAX_PENDING_RUNS = 20;
const MAX_ATTEMPTS_PER_RUN = 20;

const SaveQueue = {
  read() {
    try {
      const raw = localStorage.getItem(PENDING_RUNS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  },
  write(arr) {
    try { localStorage.setItem(PENDING_RUNS_KEY, JSON.stringify(arr)); } catch (e) {}
  },
  count() { return SaveQueue.read().length; },
  enqueue(token, payload, errKind) {
    const arr = SaveQueue.read();
    if (arr.length >= MAX_PENDING_RUNS) arr.shift();  // drop oldest to cap memory
    arr.push({
      id: "run_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      token, payload,
      enqueued_at: new Date().toISOString(),
      attempts: 0,
      last_error: errKind || null,
    });
    SaveQueue.write(arr);
  },
  async flush() {
    if (!SB) return { flushed: 0, remaining: SaveQueue.count() };
    const arr = SaveQueue.read();
    if (arr.length === 0) return { flushed: 0, remaining: 0 };
    const remaining = [];
    let flushed = 0;
    for (const entry of arr) {
      entry.attempts = (entry.attempts || 0) + 1;
      const res = await Auth.saveRun(entry.token, entry.payload);
      if (res.ok) { flushed++; continue; }
      if (res.error === "invalid_session") continue;  // can't re-attribute — drop
      entry.last_error = res.error || "network";
      if (entry.attempts < MAX_ATTEMPTS_PER_RUN) remaining.push(entry);
    }
    SaveQueue.write(remaining);
    return { flushed, remaining: remaining.length };
  },
};

// ============================================================
// PRIMITIVES
// ============================================================

const Cross = ({ s = 8, c = "var(--silver)" }) => (
  <svg width={s} height={s} viewBox="0 0 8 8" style={{ display: "block" }}>
    <path d="M4 0 V8 M0 4 H8" stroke={c} strokeWidth="0.6" />
  </svg>
);

const Rule = ({ vertical = false, color = "var(--rule)", style = {} }) => (
  <div style={{
    background: color,
    width: vertical ? 1 : "100%",
    height: vertical ? "100%" : 1,
    flexShrink: 0,
    ...style,
  }} />
);

function LangToggle({ lang, setLang, dark = false }) {
  const fg = dark ? "var(--paper)" : "var(--ink)";
  const muted = dark ? "var(--silver)" : "var(--silver-2)";
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      border: `1px solid ${dark ? "#2a2925" : "var(--ink)"}`,
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: 2,
      lineHeight: 1,
      userSelect: "none",
    }}>
      {["en", "pt"].map((l, i) => {
        const active = lang === l;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: "5px 9px",
              background: active ? (dark ? "var(--paper)" : "var(--ink)") : "transparent",
              color: active ? (dark ? "var(--ink)" : "var(--paper)") : muted,
              borderLeft: i === 0 ? "none" : `1px solid ${dark ? "#2a2925" : "var(--ink)"}`,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 160ms ease, color 160ms ease",
            }}
            aria-pressed={active}
            aria-label={l === "en" ? "English" : "Português"}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

const ChessPlate = ({ tone = "dark", piece = "king", className = "", style = {} }) => {
  const dark = tone === "dark";
  const bg  = dark ? "#0b0b0b" : "#f6f4ef";
  const sqA = dark ? "#0e0e0e" : "#f1efe9";
  const sqB = dark ? "#161614" : "#e6e3da";
  const fg  = dark ? "#f6f4ef" : "#0b0b0b";
  return (
    <svg viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice" className={className} style={{ display: "block", ...style }}>
      <rect width="200" height="280" fill={bg} />
      <g transform="translate(0,140)">
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 8 }).map((_, c) => (
            <rect key={`${r}-${c}`} x={c * 25} y={r * 17.5} width="25" height="17.5" fill={(r + c) % 2 ? sqA : sqB} />
          ))
        )}
      </g>
      <g transform="translate(100,90)" fill={fg}>
        <rect x="-2" y="-58" width="4" height="10" />
        <rect x="-7" y="-54" width="14" height="3" />
        <path d="M -16 -42 Q 0 -50 16 -42 L 14 -22 Q 0 -16 -14 -22 Z" />
        <rect x="-18" y="-22" width="36" height="6" />
        <path d="M -22 -10 Q 0 -2 22 -10 L 26 18 L -26 18 Z" />
        <rect x="-30" y="18" width="60" height="8" />
      </g>
      <rect x="0.5" y="0.5" width="199" height="279" fill="none" stroke={dark ? "#2a2925" : "#d9d6cd"} strokeWidth="1" />
    </svg>
  );
};

const Meter = ({ label, value, code, max = 100, tone = "ink", suffix = "" }) => {
  const pct = clamp((value / max) * 100);
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "baseline", minWidth: 0 }}>
          {code && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--silver-2)", letterSpacing: 1 }}>{code}</span>}
          <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</span>
        </div>
        <span style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, letterSpacing: -0.5 }}>
          {Math.round(value)}{suffix}
        </span>
      </div>
      <div style={{ position: "relative", height: 2, background: "var(--rule)" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: `${pct}%`,
          background: tone === "warning" ? "var(--warning)" : "var(--ink)",
          transition: "width 800ms cubic-bezier(.2,.7,.2,1)",
        }} />
        {[25, 50, 75].map(t => (
          <div key={t} style={{ position: "absolute", left: `${t}%`, top: -3, width: 1, height: 8, background: "var(--rule)" }} />
        ))}
      </div>
    </div>
  );
};

const TopFrame = ({ left, right, center, isMobile, lang, setLang, session, onLogin, onLogout }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr auto" : "1fr auto 1fr",
    alignItems: "center",
    padding: isMobile ? "14px 18px" : "22px 40px",
    gap: isMobile ? 12 : 24,
    borderBottom: "1px solid var(--rule)",
    background: "var(--paper)",
  }}>
    <div style={{ display: "flex", gap: isMobile ? 10 : 16, alignItems: "center", minWidth: 0 }}>{left}</div>
    {!isMobile && (
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--silver-2)", letterSpacing: 2, textTransform: "uppercase", whiteSpace: "nowrap" }}>{center}</div>
    )}
    <div style={{ display: "flex", gap: isMobile ? 8 : 14, alignItems: "center", justifyContent: "flex-end", flexWrap: isMobile ? "nowrap" : "wrap" }}>
      {right}
      {(session !== undefined && (onLogin || onLogout)) && (
        <UserBadge session={session} onLogin={onLogin} onLogout={onLogout} lang={lang} isMobile={isMobile} />
      )}
      {setLang && <LangToggle lang={lang} setLang={setLang} />}
    </div>
  </div>
);

const Logomark = ({ size = 22, color = "currentColor", compact = false }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "center", color, minWidth: 0 }}>
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" style={{ display: "block", flexShrink: 0 }}>
      <rect x="18" y="2" width="4" height="6" fill={color} />
      <rect x="14" y="4" width="12" height="2" fill={color} />
      <path d="M 8 14 Q 20 8 32 14 L 30 24 Q 20 28 10 24 Z" fill={color} />
      <rect x="6" y="24" width="28" height="3" fill={color} />
      <path d="M 4 30 Q 20 36 36 30 L 38 44 L 2 44 Z" fill={color} />
    </svg>
    {!compact && (
      <div style={{
        fontFamily: "var(--serif)",
        fontSize: 17, fontWeight: 600, letterSpacing: 0.5,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        Governance Challenge
      </div>
    )}
  </div>
);

const PillButton = ({ children, onClick, kind = "ink", style = {}, small = false, disabled = false }) => {
  const inkStyle   = { background: "var(--ink)", color: "var(--paper)" };
  const ghostStyle = { background: "transparent", color: "var(--ink)", border: "1px solid var(--ink)" };
  const styles = kind === "ghost" ? ghostStyle : inkStyle;
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        padding: small ? "10px 18px" : "16px 28px",
        fontFamily: "var(--sans)",
        fontSize: small ? 11 : 12,
        fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
        transition: "transform 200ms ease, background 200ms ease, color 200ms ease, opacity 200ms ease",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...styles, ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {children}
    </button>
  );
};

const Stat = ({ label, value, hint }) => (
  <div>
    <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--silver-2)", textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, letterSpacing: -0.3, marginTop: 2 }}>{value}</div>
    {hint && <div style={{ fontFamily: "var(--sans)", fontSize: 10, color: "var(--silver-2)", marginTop: 2 }}>{hint}</div>}
  </div>
);

const InfluencePill = ({ value, isMobile, lang }) => (
  <div style={{
    padding: isMobile ? "4px 10px" : "5px 12px",
    border: "1px solid var(--ink)",
    fontFamily: "var(--mono)",
    fontSize: isMobile ? 10 : 11,
    letterSpacing: 1.5,
    whiteSpace: "nowrap",
  }}>
    {t("infl.pill", lang, { n: value })}
  </div>
);

// ============================================================
// LANDING
// ============================================================

function Landing({ go, isMobile, lang, setLang, session, onLogin, onLogout }) {
  const italicLine = t("landing.titleItalicLine", lang);
  const lines = [
    t("landing.titleLine1", lang),
    t("landing.titleLine2", lang),
    t("landing.titleLine3", lang),
  ];
  const renderHeroLine = (text, idx) => {
    const isItalic = (idx + 1) === italicLine;
    if (isItalic) {
      return (
        <div key={idx} style={{ fontStyle: "italic", fontWeight: 400, paddingLeft: idx === 1 ? "1.2em" : 0 }}>
          {text}
        </div>
      );
    }
    if (idx === 2) {
      return (
        <div key={idx}>
          {text}
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.18em", verticalAlign: "top", marginLeft: 8, letterSpacing: 2 }}>°</span>
        </div>
      );
    }
    return <div key={idx}>{text}</div>;
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1.05fr 1fr",
      minHeight: "100%",
      background: "var(--paper)",
    }}>
      <div style={{
        position: "relative",
        padding: isMobile ? "26px 22px 32px" : "40px 56px",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Logomark compact={isMobile} />
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 16 }}>
            {!isMobile && !session && (
              <div style={{ display: "flex", gap: 22, fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink-2)" }}>
                <span>{t("landing.nav.curriculum", lang)}</span>
                <span>{t("landing.nav.institutions", lang)}</span>
                <span>{t("landing.nav.about", lang)}</span>
              </div>
            )}
            <UserBadge session={session} onLogin={onLogin} onLogout={onLogout} lang={lang} isMobile={isMobile} />
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>

        <div className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginTop: isMobile ? 28 : 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: isMobile ? 18 : 28, color: "var(--silver-2)" }}>
            <Rule style={{ width: isMobile ? 36 : 56 }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>{t("landing.vol", lang)}</span>
          </div>

          <h1 style={{
            margin: 0,
            fontFamily: "var(--serif)",
            fontWeight: 500,
            fontSize: isMobile ? "clamp(56px, 18vw, 96px)" : "clamp(72px, 10.2vw, 156px)",
            lineHeight: 0.86,
            letterSpacing: isMobile ? -2 : -3,
            color: "var(--ink)",
          }}>
            {lines.map(renderHeroLine)}
          </h1>

          <div style={{
            marginTop: isMobile ? 22 : 36,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: isMobile ? 18 : 32,
            alignItems: "start",
            maxWidth: 640,
          }}>
            <div style={{ width: 1, background: "var(--ink)", height: isMobile ? 64 : 88 }} />
            <p style={{
              margin: 0,
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: isMobile ? 17 : 22,
              lineHeight: 1.35, fontWeight: 400,
              color: "var(--ink-2)", textWrap: "pretty",
            }}>
              {t("landing.blurb", lang)}
            </p>
          </div>

          <div style={{
            marginTop: isMobile ? 28 : 56,
            display: "flex", gap: isMobile ? 14 : 20,
            alignItems: "center", flexWrap: "wrap",
          }}>
            <PillButton onClick={() => go("menu")}>{t("landing.cta", lang)}</PillButton>
            <button
              onClick={() => go("game")}
              style={{
                fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, letterSpacing: 2,
                textTransform: "uppercase", color: "var(--ink-2)",
                borderBottom: "1px solid var(--ink)", padding: "6px 0",
              }}
            >
              {t("landing.sample", lang)}
            </button>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: isMobile ? 14 : 24,
          marginTop: isMobile ? 28 : 32,
          paddingTop: isMobile ? 16 : 20,
          borderTop: "1px solid var(--rule)",
        }}>
          {[
            ["landing.footer.a", "landing.footer.aText"],
            ["landing.footer.b", "landing.footer.bText"],
            ["landing.footer.c", "landing.footer.cText"],
            ["landing.footer.d", "landing.footer.dText"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "grid", gap: 6 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", textTransform: "uppercase" }}>{t(k, lang)}</span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>{t(v, lang)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: "relative", overflow: "hidden",
        background: "var(--ink)",
        minHeight: isMobile ? 360 : "auto",
      }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <ChessPlate tone="dark" piece="king" style={{ width: "100%", height: "100%" }} />
        </div>

        {!isMobile && (
          <div style={{
            position: "absolute", left: 28, top: 40, bottom: 40,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            color: "var(--silver)", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
            writingMode: "vertical-rl", transform: "rotate(180deg)",
          }}>
            <span>{t("landing.plate.left", lang)}</span>
            <span>{t("landing.plate.right", lang)}</span>
          </div>
        )}

        <div style={{
          position: "absolute",
          right: isMobile ? 16 : 40,
          top: isMobile ? 24 : 56,
          width: isMobile ? "min(220px, 60%)" : 240,
          background: "var(--paper)", color: "var(--ink)",
          padding: "20px 22px",
          fontFamily: "var(--sans)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--silver-2)" }}>{t("landing.tile.live", lang)}</span>
            <Cross s={8} c="var(--ink)" />
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 500, lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 8 }}>
            {t("landing.tile.crisisHead", lang)}<br /><span style={{ fontStyle: "italic" }}>{t("landing.tile.crisisTitle", lang)}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.5 }}>
            {t("landing.tile.crisisBody", lang)}
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--rule)", display: "flex", justifyContent: "flex-end", fontSize: 10, fontFamily: "var(--mono)", letterSpacing: 1.5, color: "var(--silver-2)" }}>
            <span>{t("landing.tile.open", lang)}</span>
          </div>
        </div>

        <div style={{
          position: "absolute",
          right: isMobile ? 16 : 40,
          bottom: isMobile ? 36 : 40,
          width: isMobile ? "min(280px, 78%)" : 280,
          color: "var(--paper)", fontFamily: "var(--sans)",
        }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, color: "var(--silver)", marginBottom: 12 }}>
            {t("landing.bottomKicker", lang)}
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: isMobile ? 24 : 30, lineHeight: 1.05, fontWeight: 500, letterSpacing: -0.5 }}>
            {t("landing.bottomTitle1", lang)}<br /><em>{t("landing.bottomTitle2", lang)}</em>
          </div>
        </div>

        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          padding: "10px 22px",
          display: "flex", justifyContent: "space-between",
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2,
          color: "var(--silver-2)", borderTop: "1px solid #2a2925",
        }}>
          <span>{t("landing.ticker.est", lang)}</span>
          <span>· · ·</span>
          <span>{t("landing.ticker.edition", lang)}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MENU
// ============================================================

const TOUR_FLAG_KEY = "gc_tour_seen";

function Menu({ go, identity, scores, isMobile, isTablet, onTakeover, lang, setLang, session, onLogin, onLogout }) {
  const profile = identity;  // alias: Menu only uses .name and .initials of the user, never the archetype profile
  const [showTour, setShowTour] = useState(false);

  // Auto-open tour on first visit (per user, persisted in localStorage)
  useEffect(() => {
    if (!session) return;
    try {
      if (localStorage.getItem(TOUR_FLAG_KEY) === "1") return;
    } catch (e) { return; }
    const id = setTimeout(() => setShowTour(true), 650);
    return () => clearTimeout(id);
  }, [session]);

  // Catch-up flush of any runs saved offline / during cold start
  const [pendingFlushedCount, setPendingFlushedCount] = useState(0);
  useEffect(() => {
    SaveQueue.flush().then(r => { if (r.flushed > 0) setPendingFlushedCount(r.flushed); });
  }, []);

  const closeTour = (reason) => {
    setShowTour(false);
    if (reason === "done" || reason === "skip") {
      try { localStorage.setItem(TOUR_FLAG_KEY, "1"); } catch (e) {}
    }
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <TopFrame
        isMobile={isMobile} lang={lang} setLang={setLang}
        session={session} onLogin={onLogin} onLogout={onLogout}
        left={<Logomark compact={isMobile} />}
        center={t("menu.center", lang)}
        right={
          <button onClick={() => go("landing")} style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>{t("menu.cover", lang)}</button>
        }
      />

      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
        overflow: isMobile ? "visible" : "hidden",
      }}>
        <aside style={{
          borderRight: isMobile ? "none" : "1px solid var(--rule)",
          borderBottom: isMobile ? "1px solid var(--rule)" : "none",
          padding: isMobile ? "22px 22px" : "32px 28px",
          display: "flex", flexDirection: "column", gap: 22,
          overflow: "auto",
        }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", marginBottom: 10 }}>{t("menu.dossier", lang)}</div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 56, height: 56, background: "var(--ink)", color: "var(--paper)", display: "grid", placeItems: "center", fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500 }}>
                {profile.initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, letterSpacing: -0.3, lineHeight: 1.05 }}>{profile.name}</div>
                {session && session.user && (
                  <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--silver-2)", marginTop: 4, letterSpacing: 0.5 }}>{session.user.course}</div>
                )}
              </div>
            </div>
          </div>

          <div data-tour="takeover" style={{ border: "1px solid var(--ink)", padding: "14px 16px", display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--silver-2)" }}>{t("menu.tactical.label", lang)}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500 }}>{scores.influence} {t("res.ptsLabel", lang)}</div>
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}>
              <em style={{ fontWeight: 400 }}>{t("menu.tactical.titleA", lang)}</em> {t("menu.tactical.titleB", lang)}
            </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--ink-2)", lineHeight: 1.45 }}>
              {t("menu.tactical.desc", lang, { cost: HOSTILE_TAKEOVER_COST })}
            </div>
            <PillButton small kind="ghost" onClick={onTakeover} disabled={scores.influence < HOSTILE_TAKEOVER_COST}>
              {t("menu.tactical.cta", lang)}
            </PillButton>
          </div>
        </aside>

        <main style={{ padding: isMobile ? "26px 22px" : "32px 40px", overflow: "auto" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "flex-end",
            marginBottom: isMobile ? 22 : 28,
            gap: 18,
            flexDirection: isMobile ? "column" : "row",
          }}>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", marginBottom: 8 }}>{t("menu.section", lang)}</div>
              <h2 style={{
                margin: 0,
                fontFamily: "var(--serif)",
                fontSize: isMobile ? "clamp(36px, 10vw, 56px)" : 56,
                fontWeight: 500, letterSpacing: -1.5, lineHeight: 1,
              }}>
                {t("menu.takeYourSeatA", lang)} <em style={{ fontWeight: 400 }}>{t("menu.takeYourSeatB", lang)}</em>
              </h2>
            </div>
            <button
              onClick={() => setShowTour(true)}
              style={{
                fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                color: "var(--ink)",
                borderBottom: "1px solid var(--ink)", padding: "2px 0",
                cursor: "pointer",
                alignSelf: isMobile ? "flex-start" : "flex-end",
              }}
            >
              {t("tour.reopen", lang)}
            </button>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: 1, background: "var(--rule)", border: "1px solid var(--rule)",
          }}>
            {[
              { id: "solo",    no: "I"   },
              { id: "multi",   no: "II"  },
              { id: "esg",     no: "III" },
              { id: "crisis",  no: "IV"  },
              { id: "leader",  no: "V"   },
              { id: "profile", no: "VI"  },
            ].map((m, i) => {
              const targets = { solo: "game", crisis: "scenario", esg: "game", multi: "game", leader: "leader", profile: "results" };
              const target = targets[m.id];
              const dark = i === 0 || i === 4;
              return (
                <button
                  key={m.id}
                  data-tour={`mode-${m.id}`}
                  onClick={() => target && go(target)}
                  style={{
                    background: dark ? "var(--ink)" : "var(--paper)",
                    color: dark ? "var(--paper)" : "var(--ink)",
                    padding: isMobile ? "20px 20px" : "26px 24px",
                    minHeight: isMobile ? 180 : 230,
                    textAlign: "left",
                    display: "flex", flexDirection: "column",
                    transition: "background 250ms ease, color 250ms ease",
                    cursor: target ? "pointer" : "default",
                    position: "relative",
                  }}
                  onMouseOver={e => { if (!dark) { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--paper)"; } }}
                  onMouseOut={e =>  { if (!dark) { e.currentTarget.style.background = "var(--paper)"; e.currentTarget.style.color = "var(--ink)"; } }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3 }}>{m.no}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, opacity: 0.6 }}>{t(`mode.${m.id}.meta`, lang)}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "var(--serif)",
                      fontSize: isMobile ? 26 : 32,
                      fontWeight: 500, letterSpacing: -0.5, lineHeight: 1, marginBottom: 12,
                    }}>
                      {t(`mode.${m.id}.label`, lang)}
                    </div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 13, lineHeight: 1.5, opacity: 0.78, maxWidth: 280 }}>
                      {t(`mode.${m.id}.desc`, lang)}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 14, borderTop: `1px solid ${dark ? "#2a2925" : "var(--rule)"}` }}>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>{t("menu.enter", lang)}</span>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 22 }}>→</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{
            marginTop: 24,
            display: isMobile ? "block" : "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 24, alignItems: "center", padding: "16px 0",
          }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-2)", marginBottom: isMobile ? 10 : 0 }}>
              <em style={{ fontFamily: "var(--serif)", fontSize: 16 }}>{t("menu.boardSet", lang)}</em>
            </div>
            {!isMobile && <Rule style={{ width: 80 }} />}
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", textAlign: isMobile ? "left" : "right" }}>
              {t("menu.sectionEnd", lang)}
            </div>
          </div>
        </main>
      </div>

      {showTour && (
        <TourOverlay
          steps={MENU_TOUR_STEPS}
          onClose={closeTour}
          lang={lang}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

// ============================================================
// GAME / QUIZ
// ============================================================

function Game({ go, scores, setScores, isMobile, isTablet, lang, setLang, session, onLogin, onLogout,
                 profile, setProfile, questionsAnswered, setQuestionsAnswered, resetRun }) {
  // Fresh run on entering Game — clears profile, scores, and answer log
  useEffect(() => { if (resetRun) resetRun(); /* eslint-disable-next-line */ }, []);

  const [qIdx, setQIdx] = useState(0);
  const q = QUESTIONS[qIdx % QUESTIONS.length];
  const [picked, setPicked] = useState(null);
  const [time, setTime] = useState(30);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return;
    if (time <= 0) { setRevealed(true); return; }
    const tt = setTimeout(() => setTime(s => s - 1), 1000);
    return () => clearTimeout(tt);
  }, [time, revealed]);

  const onPick = (k) => {
    if (revealed) return;
    setPicked(k);
    setRevealed(true);
    const opt = q.options.find(o => o.k === k);
    // Silent profile accumulation + tone-neutral telemetry shift
    setProfile(p => addWeights(p, opt.weights));
    setScores(s => applyAnswerTelemetry(s, opt.weights));
    setQuestionsAnswered(arr => [...arr, { qId: q.id, optionK: k, weights: opt.weights }]);
  };

  const next = () => {
    if (qIdx >= QUESTIONS.length - 1) { go("results"); return; }
    setQIdx(i => i + 1);
    setPicked(null);
    setRevealed(false);
    setTime(30);
  };

  const timePct = (time / 30) * 100;
  const answeredCount = (questionsAnswered || []).length;

  return (
    <div style={{ background: "var(--paper)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <TopFrame
        isMobile={isMobile} lang={lang} setLang={setLang}
        session={session} onLogin={onLogin} onLogout={onLogout}
        left={
          <>
            <button onClick={() => go("menu")} style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>{t("game.lobby", lang)}</button>
            <Rule vertical style={{ height: 18 }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)" }}>
              {t("game.round", lang, { n: qIdx + 1, total: QUESTIONS.length })}
            </span>
          </>
        }
        center={t("game.center", lang, { pillar: t(`pillar.${q.pillarKey}`, lang) })}
        right={
          <InfluencePill value={scores.influence} isMobile={isMobile} lang={lang} />
        }
      />

      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 280px" : "1fr 360px",
        overflow: isMobile ? "visible" : "hidden",
      }}>
        <main className="slide-up" style={{
          padding: isMobile ? "22px 22px" : "36px 56px",
          display: "flex", flexDirection: "column",
          overflow: isMobile ? "visible" : "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, padding: "5px 10px", border: "1px solid var(--ink)" }}>
                {t("game.pillarBadge", lang, { p: t(`pillar.${q.pillarKey}`, lang).toUpperCase() })}
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)" }}>
                {t("game.qBadge", lang, { difficulty: t(`diff.${q.difficultyKey}`, lang), n: qIdx + 1 })}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)" }}>{t("game.time", lang)}</span>
              <span style={{ fontFamily: "var(--serif)", fontSize: isMobile ? 24 : 30, fontWeight: 500, letterSpacing: -0.5, color: time <= 5 && !revealed ? "var(--warning)" : "var(--ink)" }}>
                0:{String(time).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div style={{ height: 1, background: "var(--rule)", position: "relative", marginBottom: isMobile ? 24 : 36 }}>
            <div style={{
              position: "absolute", left: 0, top: 0, height: 2, marginTop: -0.5,
              width: `${timePct}%`,
              background: time <= 5 && !revealed ? "var(--warning)" : "var(--ink)",
              transition: "width 1s linear",
            }} />
          </div>

          <div style={{ display: "flex", gap: isMobile ? 16 : 32, alignItems: "flex-start", marginBottom: isMobile ? 22 : 32 }}>
            <span style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: isMobile ? 40 : 64,
              fontWeight: 400, color: "var(--silver)", lineHeight: 1, letterSpacing: -2,
              flexShrink: 0,
            }}>
              {String(qIdx + 1).padStart(2, "0")}
            </span>
            <h1 style={{
              margin: 0,
              fontFamily: "var(--serif)",
              fontSize: isMobile ? "clamp(22px, 6vw, 30px)" : 38,
              fontWeight: 500, lineHeight: 1.2, letterSpacing: -0.5,
              textWrap: "balance",
              color: "var(--ink)", maxWidth: 760,
            }}>
              {pick(q.prompt, lang)}
            </h1>
          </div>

          <div style={{ display: "grid", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)", marginBottom: 20 }}>
            {q.options.map((o) => {
              const isPicked = picked === o.k;
              const dim = revealed && !isPicked;
              const baseBg = isPicked ? "var(--ink)" : "var(--paper)";
              const baseFg = isPicked ? "var(--paper)" : "var(--ink)";
              return (
                <button
                  key={o.k}
                  onClick={() => onPick(o.k)}
                  disabled={revealed}
                  style={{
                    background: baseBg, color: baseFg,
                    opacity: dim ? 0.45 : 1,
                    padding: isMobile ? "16px 18px" : "20px 24px",
                    textAlign: "left",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "32px 1fr" : "44px 1fr auto",
                    gap: isMobile ? 14 : 18, alignItems: "center",
                    cursor: revealed ? "default" : "pointer",
                    transition: "background 200ms ease, color 200ms ease, opacity 280ms ease",
                  }}
                  onMouseOver={e => { if (!revealed) { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--paper)"; } }}
                  onMouseOut={e =>  { if (!revealed) { e.currentTarget.style.background = baseBg; e.currentTarget.style.color = baseFg; } }}
                >
                  <span style={{
                    fontFamily: "var(--serif)",
                    fontSize: isMobile ? 22 : 26,
                    fontWeight: 500, fontStyle: "italic", letterSpacing: -0.5,
                  }}>{o.k}</span>
                  <span style={{
                    fontFamily: "var(--sans)",
                    fontSize: isMobile ? 14 : 15,
                    lineHeight: 1.45, fontWeight: 400,
                  }}>{pick(o.text, lang)}</span>
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, opacity: 0.55 }}>
                      {isPicked ? t("opt.recorded", lang) : t("opt.select", lang)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="fade-in" style={{
              border: "1px solid var(--ink)",
              padding: isMobile ? "16px 18px" : "20px 24px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
              gap: isMobile ? 14 : 24, alignItems: "center",
              background: "var(--paper-2)",
            }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: isMobile ? 15 : 17, lineHeight: 1.4, fontStyle: "italic", color: "var(--ink-2)" }}>
                {t("game.recordedHint", lang)}
              </div>
              <PillButton onClick={next}>
                {qIdx >= QUESTIONS.length - 1 ? t("game.viewResults", lang) : t("game.nextMove", lang)}
              </PillButton>
            </div>
          )}
        </main>

        <aside style={{
          borderLeft: isMobile ? "none" : "1px solid var(--rule)",
          borderTop: isMobile ? "1px solid var(--rule)" : "none",
          background: "var(--paper-2)",
          padding: isMobile ? "22px 22px" : "32px 28px",
          display: "flex", flexDirection: "column",
          gap: 24,
          overflow: isMobile ? "visible" : "auto",
        }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", marginBottom: 14 }}>{t("game.telemetry", lang)}</div>
            <div style={{ display: "grid", gap: 22 }}>
              <Meter code="01" label={t("meter.esgIndex", lang)}    value={scores.esg} />
              <Meter code="02" label={t("meter.reputation", lang)}  value={scores.reputation} />
              <Meter code="03" label={t("meter.risk", lang)}        value={scores.risk} tone="warning" />
              <Meter code="04" label={t("meter.transparency", lang)} value={scores.transparency} />
            </div>
          </div>

          <Rule />

          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", marginBottom: 12 }}>{t("game.answersRecorded", lang)}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 44, fontWeight: 500, letterSpacing: -1.5, lineHeight: 1 }}>
                {answeredCount}<span style={{ color: "var(--silver)" }}>/</span>{QUESTIONS.length}
              </span>
            </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, fontStyle: "italic" }}>
              {t("game.recordedHint", lang)}
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--silver-2)" }}>{t("game.movesRemaining", lang)}</div>
            <div style={{ display: "flex", gap: 6 }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 22,
                  background: i < qIdx ? "var(--ink)" : i === qIdx ? "var(--paper)" : "var(--rule)",
                  border: i === qIdx ? "1px solid var(--ink)" : "none",
                }} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ============================================================
// SCENARIO / CRISIS
// ============================================================

function Scenario({ go, scores, setScores, isMobile, isTablet, lang, setLang, session, onLogin, onLogout,
                     profile, setProfile, questionsAnswered, setQuestionsAnswered, resetRun }) {
  // Fresh run on entering Scenario — clears profile, scores, and answer log
  useEffect(() => { if (resetRun) resetRun(); /* eslint-disable-next-line */ }, []);

  const [crisisIdx, setCrisisIdx] = useState(0);
  const sc = SCENARIOS[crisisIdx % SCENARIOS.length];
  const [chosen, setChosen] = useState(null);
  const [hover, setHover] = useState(null);

  useEffect(() => { setChosen(null); }, [sc.id]);

  const decide = (id) => {
    if (chosen) return;
    setChosen(id);
    const d = sc.decisions.find(x => x.id === id);
    setScores(s => ({
      ...s,
      reputation:   clamp(s.reputation   + d.impacts.reputation),
      esg:          clamp(s.esg          + d.impacts.esg),
      transparency: clamp(s.transparency + d.impacts.transparency),
      risk:         clamp(s.risk         - d.impacts.board / 2),
      influence:    s.influence + (d.tone === "positive" ? 1 : 0),
    }));
    // Silent profile accumulation from the decision's weight vector
    if (setProfile)         setProfile(p => addWeights(p, d.weights));
    if (setQuestionsAnswered) setQuestionsAnswered(arr => [...arr, { qId: sc.id, optionK: d.id, weights: d.weights }]);
  };

  const advance = () => {
    if (crisisIdx >= SCENARIOS.length - 1) { go("results"); return; }
    setCrisisIdx(i => i + 1);
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <TopFrame
        isMobile={isMobile} lang={lang} setLang={setLang}
        session={session} onLogin={onLogin} onLogout={onLogout}
        left={
          <>
            <button onClick={() => go("menu")} style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>{t("game.lobby", lang)}</button>
            <Rule vertical style={{ height: 18 }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--warning)" }}>{t("scen.live", lang)}</span>
          </>
        }
        center={t("scen.center", lang, { code: sc.code })}
        right={
          <InfluencePill value={scores.influence} isMobile={isMobile} lang={lang} />
        }
      />

      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr",
        overflow: isMobile ? "visible" : "hidden",
      }}>
        <section style={{
          padding: isMobile ? "26px 22px" : "44px 56px 28px",
          display: "flex", flexDirection: "column",
          overflow: isMobile ? "visible" : "auto",
          borderRight: isMobile ? "none" : "1px solid var(--rule)",
          borderBottom: isMobile ? "1px solid var(--rule)" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22, color: "var(--silver-2)" }}>
            <Rule style={{ width: isMobile ? 36 : 64 }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>
              {t("scen.scenarioFile", lang, { code: sc.code })}
            </span>
          </div>

          <h1 style={{
            margin: 0, fontFamily: "var(--serif)", fontWeight: 500,
            fontSize: isMobile ? "clamp(40px, 11vw, 60px)" : 78,
            letterSpacing: isMobile ? -1 : -2,
            lineHeight: 0.95,
          }}>
            {pick(sc.titleHtmlA, lang)} <em style={{ fontWeight: 400 }}>{pick(sc.titleHtmlItalic, lang)}</em><br />{pick(sc.titleHtmlB, lang)}
          </h1>

          <div style={{ marginTop: 14, fontFamily: "var(--mono)", fontSize: 11, color: "var(--silver-2)", letterSpacing: 1, textTransform: "uppercase" }}>
            {pick(sc.dateline, lang)}
          </div>

          <p className="dropcap" style={{
            marginTop: isMobile ? 22 : 32, marginBottom: 0,
            fontFamily: "var(--serif)",
            fontSize: isMobile ? 17 : 19,
            lineHeight: 1.55,
            color: "var(--ink-2)", textWrap: "pretty", maxWidth: 580,
          }}>
            {pick(sc.body, lang)}
          </p>

          <div style={{
            marginTop: isMobile ? 22 : 32,
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: 0, border: "1px solid var(--rule)",
          }}>
            {sc.meta.map((m, i) => (
              <div key={i} style={{
                padding: "14px 16px",
                borderRight: isMobile
                  ? (i % 2 === 0 ? "1px solid var(--rule)" : "none")
                  : (i < 3 ? "1px solid var(--rule)" : "none"),
                borderBottom: isMobile && i < 2 ? "1px solid var(--rule)" : "none",
              }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--silver-2)", textTransform: "uppercase" }}>{pick(m.label, lang)}</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: isMobile ? 18 : 22, fontWeight: 500, marginTop: 4, letterSpacing: -0.3 }}>{pick(m.value, lang)}</div>
              </div>
            ))}
          </div>

          {!isMobile && (
            <div style={{ marginTop: "auto", paddingTop: 28, fontFamily: "var(--sans)", fontSize: 11, color: "var(--silver-2)", letterSpacing: 1.5, textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
              <span>{t("scen.dossierBy", lang)}</span>
              <span>{crisisIdx + 1} / {SCENARIOS.length}</span>
            </div>
          )}
        </section>

        <section style={{
          display: "flex", flexDirection: "column",
          overflow: isMobile ? "visible" : "hidden",
          background: "var(--ink)", color: "var(--paper)",
        }}>
          <div style={{
            padding: isMobile ? "22px 22px 14px" : "30px 40px 18px",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", gap: 12, flexWrap: "wrap",
            borderBottom: "1px solid var(--ink-3)",
          }}>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, color: "var(--silver)" }}>
                {t("scen.yourMove", lang, { state: chosen ? t("scen.recorded", lang) : t("scen.oneOfOne", lang) })}
              </div>
              <div style={{ fontFamily: "var(--serif)", fontSize: isMobile ? 22 : 28, fontWeight: 500, marginTop: 4, letterSpacing: -0.5 }}>
                {t("scen.chooseNext", lang)} <em>{t("scen.chooseNext2", lang)}</em>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver)" }}>{t("scen.window", lang)}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: isMobile ? 28 : 36, fontWeight: 500, letterSpacing: -1, color: "var(--paper)" }}>
                {sc.id === "s_whistle" ? "46:00" : sc.id === "s_americanas" ? "14d" : "—:—"}
              </div>
            </div>
          </div>

          <div style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gridTemplateRows: isMobile ? "auto" : "1fr 1fr",
            gap: 1, background: "var(--ink-3)",
            overflow: isMobile ? "visible" : "hidden",
          }}>
            {sc.decisions.map((d, i) => {
              const active = chosen === d.id;
              const dim = chosen && !active;
              const isHover = hover === d.id && !chosen;
              return (
                <button
                  key={d.id}
                  onMouseEnter={() => setHover(d.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => decide(d.id)}
                  disabled={!!chosen}
                  style={{
                    background: active ? "var(--paper)" : isHover ? "#1a1917" : "var(--ink)",
                    color: active ? "var(--ink)" : "var(--paper)",
                    opacity: dim ? 0.35 : 1,
                    padding: isMobile ? "20px 22px" : "22px 26px",
                    minHeight: isMobile ? 220 : "auto",
                    textAlign: "left",
                    cursor: chosen ? "default" : "pointer",
                    transition: "all 280ms ease",
                    display: "flex", flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isMobile ? 14 : 18 }}>
                    <span style={{
                      fontFamily: "var(--serif)", fontStyle: "italic",
                      fontSize: isMobile ? 30 : 38,
                      fontWeight: 400, lineHeight: 0.9,
                    }}>
                      {String.fromCharCode(945 + i)}
                    </span>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2,
                      padding: "3px 8px",
                      border: `1px solid ${active ? "var(--ink)" : "var(--silver-2)"}`,
                      color: active ? "var(--ink)" : "var(--silver)",
                    }}>
                      {d.tone === "positive" ? t("scen.prudent", lang) : t("scen.risk", lang)}
                    </span>
                  </div>

                  <div style={{
                    fontFamily: "var(--serif)",
                    fontSize: isMobile ? 18 : 22,
                    fontWeight: 500, lineHeight: 1.15, letterSpacing: -0.3,
                    marginBottom: 8, textWrap: "balance",
                  }}>
                    {pick(d.title, lang)}
                  </div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 12, lineHeight: 1.5, opacity: 0.78, marginBottom: 14 }}>
                    {pick(d.sub, lang)}
                  </div>

                  <div style={{
                    marginTop: "auto",
                    display: "flex", gap: 14, flexWrap: "wrap",
                    opacity: (isHover || active) ? 1 : 0.45,
                    transition: "opacity 200ms",
                  }}>
                    {[
                      ["REP", d.impacts.reputation],
                      ["ESG", d.impacts.esg],
                      ["BRD", d.impacts.board],
                      ["TRN", d.impacts.transparency],
                    ].map(([k, v]) => (
                      <div key={k} style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5 }}>
                        <span style={{ opacity: 0.55 }}>{k} </span>
                        <span style={{ color: v > 0 ? (active ? "var(--positive)" : "#9bdcb1") : v < 0 ? (active ? "var(--warning)" : "#e89d92") : "inherit" }}>
                          {v > 0 ? "+" : ""}{v}
                        </span>
                      </div>
                    ))}
                  </div>

                  {active && (
                    <div style={{ position: "absolute", top: isMobile ? 18 : 22, right: isMobile ? 70 : 80, fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--ink)" }}>
                      ✓ {pick(d.verdict, lang).toUpperCase()}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{
            padding: isMobile ? "16px 22px" : "20px 40px",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", gap: 14, flexWrap: "wrap",
            borderTop: "1px solid var(--ink-3)",
          }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver)" }}>
              {chosen ? t("scen.decisionRecorded", lang) : t("scen.awaiting", lang, { n: sc.decisions.length })}
            </div>
            {chosen ? (
              <PillButton onClick={advance} kind="ghost" style={{ background: "var(--paper)", color: "var(--ink)", border: "none" }}>
                {crisisIdx >= SCENARIOS.length - 1 ? t("scen.adjournResults", lang) : t("scen.nextCrisis", lang)}
              </PillButton>
            ) : (
              <span style={{ fontFamily: "var(--serif)", fontSize: 14, fontStyle: "italic", color: "var(--silver)" }}>
                {t("scen.hesitation", lang)}
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// RESULTS
// ============================================================

function Results({ go, scores, identity, profile, questionsAnswered, accuracy, isMobile, lang, setLang, session, onLogin, onLogout, resetRun }) {
  const composite = Math.round((scores.esg + scores.reputation + scores.transparency + (100 - scores.risk)) / 4);
  const tierKey =
    composite >= 88 ? "tier.distinguished" :
    composite >= 75 ? "tier.independent" :
    composite >= 60 ? "tier.qualified" :
    composite >= 45 ? "tier.provisional" :
    "tier.censured";

  // Archetype now derived from the silent weight profile, not from scores.
  // Tie-breaker: if winner − runner-up < 2 points, return "balanced".
  const { archetypeKey, profileEntries, profileDelta } = useMemo(() => {
    const safeProfile = profile || EMPTY_PROFILE();
    const entries = ARCHETYPES.map(a => [a, safeProfile[a] || 0]);
    entries.sort((a, b) => b[1] - a[1]);
    const winner = entries[0];
    const runnerUp = entries[1] || [null, 0];
    const delta = winner[1] - runnerUp[1];
    const key = (winner[1] <= 0 || delta < 2) ? "arch.balanced" : `arch.${winner[0]}`;
    return { archetypeKey: key, profileEntries: entries, profileDelta: delta };
  }, [profile]);

  // Save run on mount, once. On warming/network error, enqueue for later retry.
  const [saveStatus, setSaveStatus] = useState(SB ? "saving" : "notConfigured");
  const [pendingCount, setPendingCount] = useState(SaveQueue.count());
  const savedRef = useRef(false);
  const lastPayloadRef = useRef(null);

  const buildPayload = useCallback(() => {
    const accuracyPct = accuracy != null ? Math.round(accuracy * 100) : null;
    return {
      composite,
      esg:          Math.round(scores.esg),
      reputation:   Math.round(scores.reputation),
      transparency: Math.round(scores.transparency),
      risk:         Math.round(scores.risk),
      influence:    scores.influence,
      accuracy_pct: accuracyPct,
      archetype:    t(archetypeKey, "en"),
      tier:         t(tierKey, "en"),
      lang,
      profile:      profile || EMPTY_PROFILE(),
    };
  }, [composite, scores, accuracy, archetypeKey, tierKey, lang, profile]);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    if (!SB || !session || !session.token) {
      setSaveStatus(SB ? null : "notConfigured");
      return;
    }
    const payload = buildPayload();
    lastPayloadRef.current = payload;
    setSaveStatus("saving");
    Auth.saveRun(session.token, payload).then(res => {
      if (res.ok) {
        setSaveStatus("saved");
        // opportunistic catch-up of any other pending runs
        SaveQueue.flush().then(r => setPendingCount(r.remaining));
      } else if (res.error === "warming" || res.error === "network") {
        SaveQueue.enqueue(session.token, payload, res.error);
        setPendingCount(SaveQueue.count());
        setSaveStatus(res.error);
      } else {
        // invalid_session, config_missing, etc.
        setSaveStatus("error");
      }
    });
  }, []);

  const retrySave = useCallback(async () => {
    if (!session || !session.token) return;
    setSaveStatus("saving");
    // Ensure the current run is in the queue
    if (lastPayloadRef.current && SaveQueue.count() === 0) {
      SaveQueue.enqueue(session.token, lastPayloadRef.current, "manual");
    }
    const r = await SaveQueue.flush();
    setPendingCount(r.remaining);
    setSaveStatus(r.remaining === 0 ? "saved" : "warming");
  }, [session]);

  const breakdown = [
    { code: "01", labelKey: "bd.composite",    value: composite,           max: 100 },
    { code: "02", labelKey: "bd.esg",          value: scores.esg,          max: 100 },
    { code: "03", labelKey: "bd.transparency", value: scores.transparency, max: 100 },
    { code: "04", labelKey: "bd.reputation",   value: scores.reputation,   max: 100 },
    { code: "05", labelKey: "bd.risk",         value: scores.risk,         max: 100, tone: "warning" },
  ];

  const accuracyVal = accuracy != null ? Math.round(accuracy * 100) : null;
  const certNum = useMemo(() => Math.floor(Math.random() * 9000 + 1000), []);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <TopFrame
        isMobile={isMobile} lang={lang} setLang={setLang}
        session={session} onLogin={onLogin} onLogout={onLogout}
        left={
          <>
            <button onClick={() => go("menu")} style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>{t("game.lobby", lang)}</button>
            <Rule vertical style={{ height: 18 }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)" }}>{t("res.sessionConcluded", lang)}</span>
          </>
        }
        center={t("res.center", lang)}
        right={<button onClick={() => go("game")} style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>{t("res.replay", lang)}</button>}
      />

      {saveStatus && (
        <div style={{
          padding: isMobile ? "8px 18px" : "10px 40px",
          borderBottom: "1px solid var(--rule)",
          background: saveStatus === "saved" ? "#eaf1ec"
                    : (saveStatus === "warming") ? "#fff8e1"
                    : (saveStatus === "error" || saveStatus === "notConfigured") ? "#f6e9e6"
                    : "var(--paper-2)",
          fontFamily: "var(--mono)",
          fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
          color:    saveStatus === "saved" ? "var(--positive)"
                  : saveStatus === "warming" ? "#7a5a00"
                  : (saveStatus === "error" || saveStatus === "notConfigured") ? "var(--warning)"
                  : "var(--silver-2)",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap",
        }}>
          <span style={{ flex: 1, minWidth: 0 }}>
            {saveStatus === "saving"        && `◇ ${t("save.saving", lang)}`}
            {saveStatus === "saved"         && `✓ ${t("save.saved", lang)}${pendingCount > 0 ? ` · ${t("save.queued", lang, { n: pendingCount })}` : ""}`}
            {saveStatus === "warming"       && `△ ${t("save.warming", lang)}${pendingCount > 0 ? ` · ${t("save.queued", lang, { n: pendingCount })}` : ""}`}
            {saveStatus === "error"         && `△ ${t("save.error", lang)}`}
            {saveStatus === "notConfigured" && `△ ${t("save.notConfigured", lang)}`}
          </span>
          {(saveStatus === "warming" || saveStatus === "error") && (
            <button onClick={retrySave} style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
              color: "inherit", textDecoration: "underline", cursor: "pointer",
            }}>
              ↻ {t("save.retry", lang)}
            </button>
          )}
          {saveStatus === "saved" && (
            <button onClick={() => go("leader")} style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--positive)", textDecoration: "underline" }}>
              → {t("nav.leader", lang)}
            </button>
          )}
        </div>
      )}

      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1.15fr 1fr",
        overflow: isMobile ? "visible" : "hidden",
      }}>
        <section style={{
          padding: isMobile ? "26px 22px" : "44px 56px",
          display: "flex", flexDirection: "column",
          overflow: isMobile ? "visible" : "auto",
        }}>
          <div className="fade-in" style={{ display: "flex", gap: 18, alignItems: "center", color: "var(--silver-2)", marginBottom: 22 }}>
            <Rule style={{ width: isMobile ? 36 : 56 }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>{t("res.editionClosed", lang)}</span>
          </div>

          <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: isMobile ? 18 : 24, color: "var(--silver-2)", marginBottom: 8, fontWeight: 400 }}>
            {t("res.minutesRecord", lang)}
          </div>
          <h1 className="slide-up" style={{
            margin: 0, fontFamily: "var(--serif)",
            fontSize: isMobile ? "clamp(76px, 22vw, 120px)" : 116,
            fontWeight: 500, letterSpacing: -3.5, lineHeight: 0.92, color: "var(--ink)",
          }}>
            {composite}<span style={{ fontFamily: "var(--mono)", fontSize: isMobile ? 22 : 28, fontWeight: 400, color: "var(--silver)", letterSpacing: 0 }}>/100</span>
          </h1>

          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ padding: "5px 12px", border: "1px solid var(--ink)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2 }}>
              {t("res.tier", lang, { tier: t(tierKey, lang).toUpperCase() })}
            </span>
            <span style={{ padding: "5px 12px", border: "1px solid var(--ink)", background: "var(--ink)", color: "var(--paper)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2 }}>
              {t(archetypeKey, lang).toUpperCase()}
            </span>
          </div>

          <div style={{ marginTop: 12, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", textTransform: "uppercase" }}>
            {t(`${archetypeKey}.theory`, lang)}
          </div>
          <p style={{
            marginTop: 8, marginBottom: 0,
            fontFamily: "var(--sans)",
            fontSize: 13, lineHeight: 1.55,
            color: "var(--ink-2)", maxWidth: 540,
          }}>
            {t(`${archetypeKey}.desc`, lang)}
          </p>

          <p style={{
            marginTop: isMobile ? 22 : 28, marginBottom: 0,
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: isMobile ? 18 : 22, lineHeight: 1.4,
            color: "var(--ink-2)", maxWidth: 540, textWrap: "pretty",
          }}>
            {t("res.verdict", lang, { name: identity.name.split(" ")[0] })}
          </p>
          <div style={{ marginTop: 16, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", textTransform: "uppercase" }}>
            {t("res.auditCommittee", lang)}
          </div>

          <div style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 0, border: "1px solid var(--rule)",
          }}>
            <div style={{ padding: "14px 18px", borderRight: !isMobile ? "1px solid var(--rule)" : "none", borderBottom: isMobile ? "1px solid var(--rule)" : "none" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--silver-2)" }}>{t("res.objDecisions", lang)}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, marginTop: 4 }}>
                {(questionsAnswered || []).length}
              </div>
            </div>
            <div style={{ padding: "14px 18px", borderRight: !isMobile ? "1px solid var(--rule)" : "none", borderBottom: isMobile ? "1px solid var(--rule)" : "none" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--silver-2)" }}>{t("res.objPillars", lang)}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, marginTop: 4 }}>
                {Math.min(scores.esg, scores.reputation, scores.transparency, 100 - scores.risk)}<span style={{ color: "var(--silver)", fontSize: 14 }}> {t("res.minLabel", lang)}</span>
              </div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--silver-2)" }}>{t("res.objInfluence", lang)}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, marginTop: 4 }}>
                {scores.influence}<span style={{ color: "var(--silver)", fontSize: 14 }}> {t("res.ptsLabel", lang)}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "auto", paddingTop: 28, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <PillButton onClick={() => go("menu")}>{t("res.adjournLobby", lang)}</PillButton>
            <PillButton onClick={() => go("scenario")} kind="ghost">{t("res.tryCrisis", lang)}</PillButton>
          </div>
        </section>

        <section style={{
          background: "var(--paper-2)",
          borderLeft: isMobile ? "none" : "1px solid var(--rule)",
          borderTop: isMobile ? "1px solid var(--rule)" : "none",
          padding: isMobile ? "26px 22px" : "44px 48px",
          display: "flex", flexDirection: "column",
          gap: 24,
          overflow: isMobile ? "visible" : "auto",
        }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", marginBottom: 8 }}>{t("res.sectionC", lang)}</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: isMobile ? 26 : 32, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.1 }}>
              {t("res.scorecard", lang)}
            </div>
          </div>

          <div style={{ display: "grid", gap: 22 }}>
            {breakdown.map(b => <Meter key={b.code} code={b.code} label={t(b.labelKey, lang)} value={b.value} max={b.max} tone={b.tone} />)}
          </div>

          <Rule />

          {/* PROFILE DISTRIBUTION — 5-archetype bars, positive/negative from center */}
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", marginBottom: 14 }}>{t("res.profileBreakdown", lang)}</div>
            <div style={{ display: "grid", gap: 10 }}>
              {(() => {
                const maxAbs = Math.max(1, ...ARCHETYPES.map(a => Math.abs((profile || {})[a] || 0)));
                const winnerKey = archetypeKey.replace("arch.", "");
                return ARCHETYPES.map(a => {
                  const v = (profile || {})[a] || 0;
                  const pct = (Math.abs(v) / maxAbs) * 50;
                  const isWinner = a === winnerKey;
                  return (
                    <div key={a} style={{ display: "grid", gridTemplateColumns: isMobile ? "100px 1fr 36px" : "130px 1fr 40px", gap: 10, alignItems: "center" }}>
                      <span style={{
                        fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 0.4,
                        fontWeight: isWinner ? 700 : 400,
                        color: isWinner ? "var(--ink)" : "var(--ink-2)",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {t(`arch.${a}`, lang)}
                      </span>
                      <div style={{ position: "relative", height: 4, background: "var(--rule)" }}>
                        <div style={{ position: "absolute", left: "50%", top: -3, bottom: -3, width: 1, background: "var(--silver-2)" }} />
                        <div style={{
                          position: "absolute",
                          left: v >= 0 ? "50%" : `${50 - pct}%`,
                          width: `${pct}%`, height: "100%",
                          background: isWinner ? "var(--ink)" : v < 0 ? "var(--warning)" : "var(--silver-2)",
                          transition: "left 600ms cubic-bezier(.2,.7,.2,1), width 600ms cubic-bezier(.2,.7,.2,1)",
                        }} />
                      </div>
                      <span style={{
                        fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 0.5,
                        textAlign: "right",
                        color: v < 0 ? "var(--warning)" : isWinner ? "var(--ink)" : "var(--silver-2)",
                        fontWeight: isWinner ? 600 : 400,
                      }}>
                        {v > 0 ? "+" : ""}{v}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <Rule />

          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", marginBottom: 14 }}>{t("res.ethical", lang)}</div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                ["eth.disclosed", "eth.recorded", scores.transparency >= 50],
                ["eth.concealment", scores.transparency >= 60 ? "eth.zero" : "eth.detected", scores.transparency >= 60],
                ["eth.procedural", scores.risk < 50 ? "eth.maintained" : "eth.strained", scores.risk < 50],
                ["eth.quorum", "eth.maintained", true],
              ].map(([k, v, ok]) => (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)" }}>{t(k, lang)}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--silver-2)", letterSpacing: 1 }}>{t(v, lang)}</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 500, color: ok ? "var(--positive)" : "var(--warning)" }}>
                    {ok ? "✓" : "△"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Rule />

          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", marginBottom: 14 }}>{t("res.market", lang)}</div>
            <div style={{ position: "relative", height: 80, background: "var(--paper)", border: "1px solid var(--rule)" }}>
              <div style={{ position: "absolute", left: 12, right: 12, top: "50%", height: 1, background: "var(--rule)" }} />
              {Array.from({ length: 21 }).map((_, i) => (
                <div key={i} style={{
                  position: "absolute", left: `calc(${(i / 20) * 100}% - 0.5px)`,
                  top: i % 5 === 0 ? "30%" : "40%", bottom: i % 5 === 0 ? "30%" : "40%",
                  width: 1, background: i % 5 === 0 ? "var(--ink)" : "var(--silver)",
                }} />
              ))}
              <div style={{
                position: "absolute", left: `calc(${scores.reputation}% - 8px)`, top: "50%",
                transform: "translateY(-50%)",
                width: 16, height: 16, background: "var(--ink)",
                transition: "left 600ms cubic-bezier(.2,.7,.2,1)",
              }} />
              <div style={{
                position: "absolute", left: `${scores.reputation}%`, bottom: 4,
                transform: "translateX(-50%)",
                fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1,
              }}>
                {scores.reputation}
              </div>
              <div style={{ position: "absolute", left: 8, top: 6, fontFamily: "var(--mono)", fontSize: 9, color: "var(--silver-2)", letterSpacing: 1 }}>{t("res.hostile", lang)}</div>
              <div style={{ position: "absolute", right: 8, top: 6, fontFamily: "var(--mono)", fontSize: 9, color: "var(--silver-2)", letterSpacing: 1 }}>{t("res.favorable", lang)}</div>
            </div>
          </div>

          <Rule />

          {/* FURTHER READING — five archetype anchors */}
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", marginBottom: 14 }}>
              {t("res.furtherReading", lang)}
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {ARCHETYPES.map(a => {
                const winnerKey = archetypeKey.replace("arch.", "");
                const isWinner = a === winnerKey;
                return (
                  <div key={a} style={{
                    paddingLeft: 14,
                    borderLeft: `2px solid ${isWinner ? "var(--ink)" : "var(--rule)"}`,
                  }}>
                    <div style={{
                      fontFamily: "var(--serif)",
                      fontSize: 16, fontWeight: 500, letterSpacing: -0.2,
                      color: isWinner ? "var(--ink)" : "var(--ink-2)",
                      fontStyle: isWinner ? "normal" : "italic",
                    }}>
                      {t(`arch.${a}`, lang)}
                    </div>
                    <div style={{
                      fontFamily: "var(--sans)",
                      fontSize: 11, lineHeight: 1.5,
                      color: "var(--silver-2)",
                      marginTop: 2,
                    }}>
                      {t(`arch.${a}.theory`, lang)}
                    </div>
                  </div>
                );
              })}
            </div>
            {(questionsAnswered && questionsAnswered.length > 0) && (
              <details style={{ marginTop: 18 }}>
                <summary style={{
                  fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2,
                  color: "var(--silver-2)", textTransform: "uppercase",
                  cursor: "pointer", padding: "4px 0",
                }}>
                  {t("res.sources", lang)} · {questionsAnswered.length}
                </summary>
                <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                  {questionsAnswered.map((qa, i) => {
                    // Look up citation for this question
                    const q = QUESTIONS.find(x => x.id === qa.qId);
                    const sc = SCENARIOS.find(x => x.id === qa.qId);
                    const cite = q ? pick(q.citation, lang) : sc ? pick(sc.title, lang) : qa.qId;
                    return (
                      <div key={i} style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--ink-2)", lineHeight: 1.5 }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--silver-2)", marginRight: 6 }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {cite}
                      </div>
                    );
                  })}
                </div>
              </details>
            )}
          </div>

          <div style={{ marginTop: "auto", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)", textTransform: "uppercase", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span>{t("res.filed", lang)}</span>
            <span>{t("res.cert", lang, { n: certNum })}</span>
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// HOSTILE TAKEOVER MODAL
// ============================================================

function TakeoverModal({ onResolve, onCancel, isMobile, lang }) {
  const [phase, setPhase] = useState("idle");
  const [angle, setAngle] = useState(0);
  const [crisis, setCrisis] = useState(null);
  const slices = TAKEOVER_CRISES;
  const sliceAngle = 360 / slices.length;

  const spin = () => {
    if (phase !== "idle") return;
    const idx = Math.floor(Math.random() * slices.length);
    const target = 360 * 6 + (360 - idx * sliceAngle - sliceAngle / 2);
    setAngle(target);
    setPhase("spinning");
    setTimeout(() => { setCrisis(slices[idx]); setPhase("resolved"); }, 4600);
  };

  const wheelSize = isMobile ? 240 : 280;

  return (
    <div className="fade-in" style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: isMobile ? 16 : 24,
      background: "rgba(11,11,11,0.78)",
      backdropFilter: "blur(4px)",
    }}>
      <div onClick={phase !== "spinning" ? onCancel : undefined} style={{ position: "absolute", inset: 0 }} />
      <div className="pop-in" style={{
        position: "relative",
        background: "var(--paper)",
        border: "1px solid var(--ink)",
        width: "min(100%, 480px)",
        padding: isMobile ? "22px 20px" : "30px 32px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, color: "var(--silver-2)" }}>{t("tk.label", lang)}</span>
          <button onClick={onCancel} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--silver-2)" }}>×</button>
        </div>
        <h2 style={{
          margin: 0, fontFamily: "var(--serif)",
          fontSize: isMobile ? 28 : 36,
          fontWeight: 500, letterSpacing: -0.8, lineHeight: 1.05,
          marginBottom: 10,
        }}>
          {t("tk.titleA", lang)} <em>{t("tk.titleB", lang)}</em>
        </h2>
        <p style={{ margin: 0, fontFamily: "var(--sans)", fontSize: 12, lineHeight: 1.5, color: "var(--ink-2)", marginBottom: 18 }}>
          {t("tk.desc", lang, { cost: HOSTILE_TAKEOVER_COST })}
        </p>

        <div style={{ position: "relative", width: wheelSize, height: wheelSize, margin: "0 auto 18px" }}>
          <div style={{
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            top: -2, width: 0, height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: "14px solid var(--ink)",
            zIndex: 2,
          }} />
          <div className="roulette" style={{
            position: "absolute", inset: 0,
            transform: `rotate(${angle}deg)`,
            border: "2px solid var(--ink)",
            borderRadius: "50%",
            overflow: "hidden",
            background: "var(--paper)",
          }}>
            <svg viewBox="-100 -100 200 200" style={{ width: "100%", height: "100%", display: "block" }}>
              {slices.map((s, i) => {
                const a0 = (i * sliceAngle - 90) * Math.PI / 180;
                const a1 = ((i + 1) * sliceAngle - 90) * Math.PI / 180;
                const x0 = Math.cos(a0) * 100, y0 = Math.sin(a0) * 100;
                const x1 = Math.cos(a1) * 100, y1 = Math.sin(a1) * 100;
                const path = `M0,0 L${x0},${y0} A100,100 0 0 1 ${x1},${y1} Z`;
                const fillDark = i % 2 === 0;
                const mid = (i * sliceAngle + sliceAngle / 2 - 90) * Math.PI / 180;
                const tx = Math.cos(mid) * 64;
                const ty = Math.sin(mid) * 64;
                return (
                  <g key={s.id}>
                    <path d={path} fill={fillDark ? "#0b0b0b" : "#f6f4ef"} stroke="#0b0b0b" strokeWidth="0.6" />
                    <text
                      x={tx} y={ty}
                      fill={fillDark ? "#f6f4ef" : "#0b0b0b"}
                      fontSize="6.5"
                      fontFamily="JetBrains Mono, monospace"
                      letterSpacing="1"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${(i * sliceAngle + sliceAngle / 2)} ${tx} ${ty})`}
                    >
                      {pick(s.label, lang).toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div style={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--ink)", color: "var(--paper)",
            display: "grid", placeItems: "center",
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22,
            border: "2px solid var(--paper)",
          }}>
            ◆
          </div>
        </div>

        {phase === "idle" && (
          <PillButton onClick={spin} style={{ width: "100%", justifyContent: "center", textAlign: "center" }}>
            {t("tk.spinCta", lang, { cost: HOSTILE_TAKEOVER_COST })}
          </PillButton>
        )}
        {phase === "spinning" && (
          <div style={{ textAlign: "center", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2, color: "var(--silver-2)", padding: "12px 0" }}>
            {t("tk.spinning", lang)}
          </div>
        )}
        {phase === "resolved" && crisis && (
          <div className="fade-in" style={{ display: "grid", gap: 12 }}>
            <div style={{ border: "1px solid var(--warning)", padding: "14px 16px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--warning)", marginBottom: 6 }}>{t("tk.crisisTriggered", lang)}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, lineHeight: 1.1, marginBottom: 6 }}>
                {pick(crisis.label, lang)}
              </div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 12, lineHeight: 1.5, color: "var(--ink-2)", marginBottom: 10 }}>
                {pick(crisis.flavor, lang)}
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {[
                  ["REP", crisis.impacts.reputation],
                  ["ESG", crisis.impacts.esg],
                  ["BRD", crisis.impacts.board],
                  ["TRN", crisis.impacts.transparency],
                ].map(([k, v]) => (
                  <span key={k} style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5 }}>
                    <span style={{ opacity: 0.55 }}>{k} </span>
                    <span style={{ color: v < 0 ? "var(--warning)" : "var(--positive)" }}>{v > 0 ? "+" : ""}{v}</span>
                  </span>
                ))}
              </div>
            </div>
            <PillButton onClick={() => onResolve(crisis)} style={{ width: "100%", justifyContent: "center", textAlign: "center" }}>
              {t("tk.applyImpact", lang)}
            </PillButton>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// AUTH MODAL
// ============================================================

function AuthModal({ onClose, onSuccess, lang, isMobile }) {
  const [tab, setTab] = useState("register"); // register | login
  const [fullName, setFullName] = useState("");
  const [course, setCourse]   = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const [errDetails, setErrDetails] = useState(null);
  const errorText = err ? t(`auth.err.${err}`, lang) : null;

  const submit = async (e) => {
    e && e.preventDefault();
    if (busy) return;
    setErr(null); setErrDetails(null);

    if (tab === "register") {
      if (!fullName.trim() || !course.trim() || !username.trim() || !password) {
        setErr("required"); return;
      }
    } else {
      if (!username.trim() || !password) { setErr("required"); return; }
    }

    setBusy(true);
    const res = tab === "register"
      ? await Auth.register({ username: username.trim(), password, full_name: fullName.trim(), course: course.trim() })
      : await Auth.login({ username: username.trim(), password });
    setBusy(false);

    if (res.error) { setErr(res.error); setErrDetails(res.details || null); return; }
    Auth.save(res.session);
    onSuccess(res.session);
  };

  return (
    <div className="fade-in" style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: isMobile ? 14 : 24,
      background: "rgba(11,11,11,0.78)",
      backdropFilter: "blur(4px)",
      overflowY: "auto",
    }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0 }} />
      <form onSubmit={submit} className="pop-in" style={{
        position: "relative",
        background: "var(--paper)",
        border: "1px solid var(--ink)",
        width: "min(100%, 480px)",
        padding: isMobile ? "22px 20px" : "32px 36px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, color: "var(--silver-2)" }}>
            BOARDROOM · ACCESS
          </span>
          <button type="button" onClick={onClose} aria-label="Close"
            style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--silver-2)" }}>×</button>
        </div>

        <h2 style={{
          margin: 0,
          fontFamily: "var(--serif)",
          fontSize: isMobile ? 32 : 44,
          fontWeight: 500, letterSpacing: -1, lineHeight: 1.02,
          marginBottom: 8,
        }}>
          {t("auth.gateTitleA", lang)} <em>{t("auth.gateTitleB", lang)}</em>
        </h2>
        <p style={{ margin: 0, fontFamily: "var(--sans)", fontSize: 12, lineHeight: 1.5, color: "var(--ink-2)", marginBottom: 20 }}>
          {t("auth.gateBlurb", lang)}
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--rule)", marginBottom: 18 }}>
          {["register", "login"].map((kind) => {
            const active = tab === kind;
            return (
              <button
                key={kind}
                type="button"
                onClick={() => { setTab(kind); setErr(null); }}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  background: active ? "var(--ink)" : "transparent",
                  color: active ? "var(--paper)" : "var(--ink-2)",
                  fontFamily: "var(--sans)",
                  fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
                  borderRight: kind === "register" ? "1px solid var(--rule)" : "none",
                  cursor: "pointer",
                  transition: "background 160ms ease, color 160ms ease",
                }}
              >
                {kind === "register" ? t("auth.tab.register", lang) : t("auth.tab.login", lang)}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {tab === "register" && (
            <>
              <Field
                label={t("auth.field.fullName", lang)}
                placeholder={t("auth.field.fullName.ph", lang)}
                value={fullName}
                onChange={setFullName}
                autoComplete="name"
              />
              <Field
                label={t("auth.field.course", lang)}
                placeholder={t("auth.field.course.ph", lang)}
                value={course}
                onChange={setCourse}
                autoComplete="organization"
              />
            </>
          )}
          <Field
            label={t("auth.field.username", lang)}
            placeholder={t("auth.field.username.ph", lang)}
            value={username}
            onChange={(v) => setUsername(v.toLowerCase())}
            autoComplete={tab === "register" ? "username" : "username"}
            mono
          />
          <Field
            label={t("auth.field.password", lang)}
            placeholder={t("auth.field.password.ph", lang)}
            value={password}
            onChange={setPassword}
            type="password"
            autoComplete={tab === "register" ? "new-password" : "current-password"}
          />
        </div>

        {errorText && (
          <div style={{
            marginTop: 14,
            padding: "10px 12px",
            background: "#f6e9e6",
            border: "1px solid var(--warning)",
            color: "var(--warning)",
            fontFamily: "var(--sans)",
            fontSize: 12, lineHeight: 1.4,
          }}>
            <div>{errorText}</div>
            {errDetails && (
              <div style={{ marginTop: 6, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 0.5, opacity: 0.85, wordBreak: "break-all" }}>
                {errDetails}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <PillButton onClick={submit} disabled={busy} style={{ width: "100%", justifyContent: "center", textAlign: "center" }}>
            {busy ? t("auth.cta.working", lang) : (tab === "register" ? t("auth.cta.register", lang) : t("auth.cta.login", lang))}
          </PillButton>
          <button
            type="button"
            onClick={() => { setTab(tab === "register" ? "login" : "register"); setErr(null); }}
            style={{
              fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, letterSpacing: 2,
              textTransform: "uppercase", color: "var(--ink-2)",
              padding: "8px 0",
            }}
          >
            {tab === "register" ? t("auth.switch.toLogin", lang) : t("auth.switch.toRegister", lang)}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontFamily: "var(--sans)", fontSize: 10, letterSpacing: 1.5,
              textTransform: "uppercase", color: "var(--silver-2)",
              padding: "4px 0",
            }}
          >
            {t("auth.cancel", lang)}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, type = "text", autoComplete, mono = false }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, color: "var(--silver-2)", textTransform: "uppercase" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "10px 12px",
          border: "1px solid var(--rule)",
          background: "var(--paper)",
          fontFamily: mono ? "var(--mono)" : "var(--sans)",
          fontSize: mono ? 13 : 14,
          color: "var(--ink)",
          outline: "none",
          borderRadius: 0,
          transition: "border-color 160ms ease",
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = "var(--ink)"}
        onBlur={(e) => e.currentTarget.style.borderColor = "var(--rule)"}
      />
    </label>
  );
}

// ============================================================
// USER BADGE (TopFrame right-slot)
// ============================================================

function UserBadge({ session, onLogout, onLogin, lang, isMobile }) {
  if (!session) {
    return (
      <button
        onClick={onLogin}
        style={{
          padding: isMobile ? "5px 10px" : "6px 14px",
          border: "1px solid var(--ink)",
          background: "var(--ink)", color: "var(--paper)",
          fontFamily: "var(--mono)",
          fontSize: isMobile ? 10 : 11,
          letterSpacing: 2, textTransform: "uppercase",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {t("auth.tab.login", lang).toUpperCase()}
      </button>
    );
  }
  const initials = session.user.full_name.split(/\s+/).map(s => s[0]).slice(0, 2).join("").toUpperCase() || "?";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {!isMobile && (
        <div style={{ textAlign: "right", lineHeight: 1.2, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
            {session.user.full_name.split(" ").slice(0, 2).join(" ")}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: "var(--silver-2)", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
            {session.user.course}
          </div>
        </div>
      )}
      <div style={{
        width: isMobile ? 28 : 32, height: isMobile ? 28 : 32,
        background: "var(--ink)", color: "var(--paper)",
        display: "grid", placeItems: "center",
        fontFamily: "var(--serif)", fontSize: isMobile ? 12 : 14, fontWeight: 500,
        flexShrink: 0,
      }}>
        {initials}
      </div>
      <button
        onClick={onLogout}
        title={t("auth.logout", lang)}
        style={{
          padding: "5px 8px",
          border: "1px solid var(--rule)",
          background: "transparent",
          fontFamily: "var(--mono)",
          fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
          color: "var(--silver-2)",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ============================================================
// LEADERBOARD
// ============================================================

function Leaderboard({ go, session, lang, setLang, isMobile }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    const res = await Auth.leaderboard(100);
    setLoading(false);
    if (res.error) {
      setErr(res.error === "config_missing" ? "notConfigured" : "error");
      setRows([]);
      return;
    }
    setRows(res.rows);
  }, []);

  useEffect(() => { load(); }, [load]);

  const fmt = (ts) => {
    if (!ts) return "—";
    try {
      const d = new Date(ts);
      return d.toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", { month: "short", day: "numeric" });
    } catch (e) { return "—"; }
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <TopFrame
        isMobile={isMobile} lang={lang} setLang={setLang}
        left={
          <>
            <button onClick={() => go("menu")} style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>{t("game.lobby", lang)}</button>
            <Rule vertical style={{ height: 18 }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: "var(--silver-2)" }}>
              {t("nav.leader", lang).toUpperCase()}
            </span>
          </>
        }
        center={t("leader.center", lang)}
        right={<button onClick={load} style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>↻ {t("leader.refresh", lang)}</button>}
      />

      <main style={{
        flex: 1,
        padding: isMobile ? "26px 22px" : "44px 56px",
        overflow: "auto",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22, color: "var(--silver-2)" }}>
          <Rule style={{ width: isMobile ? 36 : 56 }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>
            {t("leader.subtitle", lang)}
          </span>
        </div>

        <h1 style={{
          margin: 0, fontFamily: "var(--serif)", fontWeight: 500,
          fontSize: isMobile ? "clamp(40px, 11vw, 60px)" : 78,
          letterSpacing: isMobile ? -1 : -2,
          lineHeight: 0.95,
          marginBottom: isMobile ? 22 : 32,
        }}>
          {t("leader.title", lang)} <em style={{ fontWeight: 400 }}>{t("leader.titleItalic", lang)}</em>
        </h1>

        {loading && (
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2, color: "var(--silver-2)" }}>
            {t("leader.loading", lang)}
          </div>
        )}

        {!loading && err && (
          <div style={{ border: "1px solid var(--warning)", padding: "16px 18px", background: "#f6e9e6", color: "var(--warning)", fontFamily: "var(--sans)", fontSize: 13 }}>
            {t(`leader.${err}`, lang)}
          </div>
        )}

        {!loading && !err && rows && rows.length === 0 && (
          <div style={{ border: "1px solid var(--rule)", padding: "20px 22px", background: "var(--paper-2)", fontFamily: "var(--serif)", fontSize: 17, fontStyle: "italic", color: "var(--silver-2)" }}>
            {t("leader.empty", lang)}
          </div>
        )}

        {!loading && rows && rows.length > 0 && (
          <div style={{ border: "1px solid var(--rule)", overflow: "auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "44px 1fr 70px" : "60px 1.4fr 1fr 100px 70px 90px",
              padding: "12px 16px",
              background: "var(--paper-2)",
              borderBottom: "1px solid var(--rule)",
              fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--silver-2)",
              gap: 12,
            }}>
              <span>{t("leader.col.rank", lang)}</span>
              <span>{t("leader.col.player", lang)}</span>
              {!isMobile && <span>{t("leader.col.course", lang)}</span>}
              {!isMobile && <span style={{ textAlign: "right" }}>{t("leader.col.score", lang)}</span>}
              {!isMobile && <span style={{ textAlign: "right" }}>{t("leader.col.runs", lang)}</span>}
              <span style={{ textAlign: "right" }}>{isMobile ? t("leader.col.score", lang) : t("leader.col.last", lang)}</span>
            </div>
            {rows.map((r, i) => {
              const isMe = session && session.user && session.user.username === r.username;
              return (
                <div key={r.username + i} style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "44px 1fr 70px" : "60px 1.4fr 1fr 100px 70px 90px",
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--rule)",
                  background: isMe ? "var(--ink)" : "var(--paper)",
                  color: isMe ? "var(--paper)" : "var(--ink)",
                  alignItems: "center",
                  gap: 12,
                }}>
                  <span style={{
                    fontFamily: "var(--serif)", fontStyle: "italic",
                    fontSize: 22, fontWeight: 500, letterSpacing: -0.5,
                    color: isMe ? "var(--paper)" : (Number(r.rank) <= 3 ? "var(--ink)" : "var(--silver-2)"),
                  }}>
                    {String(r.rank).padStart(2, "0")}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: isMobile ? 16 : 19, fontWeight: 500, letterSpacing: -0.3, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.full_name}
                      {isMe && <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, marginLeft: 8, opacity: 0.75 }}>· {t("leader.you", lang).toUpperCase()}</span>}
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1, color: isMe ? "var(--silver)" : "var(--silver-2)", marginTop: 2 }}>
                      @{r.username}{isMobile ? ` · ${r.course}` : ""}
                    </div>
                  </div>
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: isMe ? "var(--silver)" : "var(--ink-2)" }}>
                      {r.course}
                    </span>
                  )}
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, letterSpacing: -0.5, textAlign: "right", tabularNums: "all" }}>
                      {r.best_score}
                    </span>
                  )}
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: isMe ? "var(--silver)" : "var(--silver-2)", textAlign: "right" }}>
                      {r.runs_count}
                    </span>
                  )}
                  <span style={{ fontFamily: isMobile ? "var(--serif)" : "var(--mono)", fontSize: isMobile ? 20 : 11, fontWeight: 500, letterSpacing: isMobile ? -0.3 : 1, color: isMe ? "var(--paper)" : "var(--ink)", textAlign: "right" }}>
                    {isMobile ? r.best_score : fmt(r.last_played)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================================
// GUIDED TOUR
// ============================================================

const MENU_TOUR_STEPS = [
  { selector: '[data-tour="mode-solo"]',    titleKey: "tour.solo.title",     bodyKey: "tour.solo.body"     },
  { selector: '[data-tour="mode-multi"]',   titleKey: "tour.multi.title",    bodyKey: "tour.multi.body"    },
  { selector: '[data-tour="mode-esg"]',     titleKey: "tour.esg.title",      bodyKey: "tour.esg.body"      },
  { selector: '[data-tour="mode-crisis"]',  titleKey: "tour.crisis.title",   bodyKey: "tour.crisis.body"   },
  { selector: '[data-tour="mode-leader"]',  titleKey: "tour.leader.title",   bodyKey: "tour.leader.body"   },
  { selector: '[data-tour="mode-profile"]', titleKey: "tour.profile.title",  bodyKey: "tour.profile.body"  },
  { selector: '[data-tour="takeover"]',     titleKey: "tour.takeover.title", bodyKey: "tour.takeover.body" },
];

function TourOverlay({ steps, onClose, lang, isMobile }) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState(null);
  const [tip, setTip] = useState({ top: 0, left: 0, width: 360, ready: false });

  const step = steps[idx];

  // Measure target on each step + on resize / scroll
  useEffect(() => {
    let raf = 0;
    let scrollTimeout = 0;

    const measure = () => {
      const el = document.querySelector(step.selector);
      if (!el) { setRect(null); return; }

      const r = el.getBoundingClientRect();
      const pad = 8;
      setRect({
        top: r.top - pad,
        left: r.left - pad,
        width: r.width + pad * 2,
        height: r.height + pad * 2,
      });

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const tooltipW = Math.min(380, vw - 32);
      const tooltipH = 230; // rough; ok for placement decisions

      let top, left;
      if (r.bottom + 24 + tooltipH <= vh - 16) {
        top = r.bottom + 24;
      } else if (r.top - 24 - tooltipH >= 16) {
        top = r.top - 24 - tooltipH;
      } else {
        top = Math.max(16, (vh - tooltipH) / 2);
      }
      const targetCenter = r.left + r.width / 2;
      left = Math.max(16, Math.min(vw - tooltipW - 16, targetCenter - tooltipW / 2));
      setTip({ top, left, width: tooltipW, ready: true });
    };

    const el = document.querySelector(step.selector);
    if (el) {
      try { el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }); } catch (e) {}
    }
    // Run an initial measure, then re-measure after the smooth scroll completes
    raf = requestAnimationFrame(measure);
    scrollTimeout = setTimeout(measure, 420);

    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(scrollTimeout);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [step]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape")     { e.preventDefault(); onClose("skip"); }
      else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (idx === steps.length - 1) onClose("done"); else setIdx(idx + 1);
      } else if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault(); setIdx(idx - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, steps.length, onClose]);

  if (!rect || !tip.ready) {
    // Render a plain backdrop while target is being located
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(11,11,11,0.72)",
        pointerEvents: "auto",
      }} />
    );
  }

  const x1 = rect.left, x2 = rect.left + rect.width;
  const y1 = rect.top,  y2 = rect.top  + rect.height;
  const clipPath = `polygon(0 0, 0 100%, ${x1}px 100%, ${x1}px ${y1}px, ${x2}px ${y1}px, ${x2}px ${y2}px, ${x1}px ${y2}px, ${x1}px 100%, 100% 100%, 100% 0)`;

  const isLast  = idx === steps.length - 1;
  const isFirst = idx === 0;

  return (
    <>
      {/* Dimmed backdrop with animated cutout */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(11,11,11,0.72)",
        clipPath, WebkitClipPath: clipPath,
        transition: "clip-path 480ms cubic-bezier(.2,.7,.2,1), -webkit-clip-path 480ms cubic-bezier(.2,.7,.2,1)",
        pointerEvents: "auto",
      }} onClick={(e) => e.stopPropagation()} />

      {/* Spotlight border + corner ticks */}
      <div style={{
        position: "fixed",
        top: rect.top, left: rect.left, width: rect.width, height: rect.height,
        border: "1.5px solid var(--paper)",
        boxShadow: "0 0 0 1px rgba(11,11,11,0.6), 0 0 40px rgba(246,244,239,0.18)",
        zIndex: 1001,
        pointerEvents: "none",
        transition: "top 480ms cubic-bezier(.2,.7,.2,1), left 480ms cubic-bezier(.2,.7,.2,1), width 480ms cubic-bezier(.2,.7,.2,1), height 480ms cubic-bezier(.2,.7,.2,1)",
      }}>
        {/* corner ornaments */}
        {[[0,0],[1,0],[0,1],[1,1]].map(([cx, cy], i) => (
          <span key={i} style={{
            position: "absolute",
            width: 10, height: 10,
            left:   cx ? "auto" : -1, right: cx ? -1 : "auto",
            top:    cy ? "auto" : -1, bottom: cy ? -1 : "auto",
            borderTop:    !cy ? "1.5px solid var(--paper)" : "none",
            borderBottom: cy  ? "1.5px solid var(--paper)" : "none",
            borderLeft:   !cx ? "1.5px solid var(--paper)" : "none",
            borderRight:  cx  ? "1.5px solid var(--paper)" : "none",
            transform: cx
              ? (cy ? "translate(2px, 2px)" : "translate(2px, -2px)")
              : (cy ? "translate(-2px, 2px)" : "translate(-2px, -2px)"),
          }} />
        ))}
      </div>

      {/* Tooltip */}
      <div className="pop-in" style={{
        position: "fixed",
        top: tip.top, left: tip.left, width: tip.width,
        background: "var(--paper)",
        border: "1px solid var(--ink)",
        padding: isMobile ? "18px 18px" : "22px 24px",
        zIndex: 1002,
        boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
        transition: "top 380ms cubic-bezier(.2,.7,.2,1), left 380ms cubic-bezier(.2,.7,.2,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, color: "var(--silver-2)" }}>
            {String(idx + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
          <button onClick={() => onClose("skip")}
            style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
              color: "var(--silver-2)", padding: "2px 4px",
            }}>
            {t("tour.skip", lang)}
          </button>
        </div>

        <h3 style={{
          margin: 0,
          fontFamily: "var(--serif)",
          fontSize: isMobile ? 24 : 28,
          fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.05,
          marginBottom: 8,
        }}>
          {t(step.titleKey, lang)}
        </h3>
        <p style={{
          margin: 0,
          fontFamily: "var(--sans)",
          fontSize: 13, lineHeight: 1.55,
          color: "var(--ink-2)",
          marginBottom: 18,
        }}>
          {t(step.bodyKey, lang)}
        </p>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 2,
              background: i <= idx ? "var(--ink)" : "var(--rule)",
              transition: "background 280ms ease",
            }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => !isFirst && setIdx(idx - 1)}
            disabled={isFirst}
            style={{
              fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
              fontWeight: 600,
              color: isFirst ? "var(--silver)" : "var(--ink-2)",
              padding: "8px 2px",
              cursor: isFirst ? "default" : "pointer",
              opacity: isFirst ? 0.5 : 1,
            }}
          >
            ← {t("tour.prev", lang)}
          </button>
          <PillButton small onClick={() => isLast ? onClose("done") : setIdx(idx + 1)}>
            {isLast ? t("tour.done", lang) : t("tour.next", lang)}
          </PillButton>
        </div>
      </div>
    </>
  );
}

// ============================================================
// PROTO NAV / APP
// ============================================================

function ProtoNav({ screen, go, isMobile, lang, session }) {
  const items = [
    { id: "landing",  n: "I",   k: "nav.cover"    },
    { id: "menu",     n: "II",  k: "nav.lobby",    locked: !session },
    { id: "game",     n: "III", k: "nav.briefing", locked: !session },
    { id: "scenario", n: "IV",  k: "nav.crisis",   locked: !session },
    { id: "results",  n: "V",   k: "nav.minutes",  locked: !session },
    { id: "leader",   n: "VI",  k: "nav.leader",   locked: !session },
  ];
  return (
    <div style={{
      position: "fixed",
      bottom: isMobile ? 10 : 18,
      left: "50%", transform: "translateX(-50%)",
      background: "var(--ink)", color: "var(--paper)",
      display: "flex", alignItems: "center",
      padding: 4,
      boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
      fontFamily: "var(--sans)",
      zIndex: 50,
      maxWidth: "calc(100vw - 32px)",
      overflowX: "auto",
    }}>
      {items.map((it) => {
        const active = screen === it.id;
        return (
          <button key={it.id} onClick={() => go(it.id)} style={{
            padding: isMobile ? "8px 12px" : "10px 18px",
            background: active ? "var(--paper)" : "transparent",
            color: active ? "var(--ink)" : (it.locked ? "#5a5853" : "var(--silver)"),
            display: "flex", alignItems: "center", gap: 8,
            transition: "all 180ms ease",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }} title={it.locked ? "Sign in" : undefined}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, opacity: 0.65 }}>{it.n}</span>
            {!isMobile && <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{t(it.k, lang)}{it.locked && " ⌁"}</span>}
          </button>
        );
      })}
    </div>
  );
}

const PROTECTED_SCREENS = new Set(["menu", "game", "scenario", "results", "leader"]);

const INITIAL_SCORES = { esg: 64, reputation: 72, transparency: 58, risk: 36, influence: 0 };

function App() {
  const [screen, setScreen] = useState("landing");
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [profile, setProfile] = useState(EMPTY_PROFILE());
  const [questionsAnswered, setQuestionsAnswered] = useState([]);  // [{ qId, optionK, weights }] in order — used for Further Reading
  const [accuracy, setAccuracy] = useState(null);
  const [showTakeover, setShowTakeover] = useState(false);
  const [lang, setLang] = useLang();
  const [session, setSession] = useState(() => Auth.load());
  const [showAuth, setShowAuth] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);

  const vp = useViewport();

  const resetRun = useCallback(() => {
    setScores(INITIAL_SCORES);
    setProfile(EMPTY_PROFILE());
    setQuestionsAnswered([]);
    setAccuracy(null);
  }, []);

  const go = useCallback((s, p = null) => {
    if (PROTECTED_SCREENS.has(s) && !session) {
      setPendingNav({ s, p });
      setShowAuth(true);
      return;
    }
    if (p && p.accuracy != null) setAccuracy(p.accuracy);
    setScreen(s);
  }, [session]);

  const onAuthSuccess = (newSession) => {
    setSession(newSession);
    setShowAuth(false);
    if (pendingNav) {
      const { s, p } = pendingNav;
      if (p && p.accuracy != null) setAccuracy(p.accuracy);
      setScreen(s);
      setPendingNav(null);
    }
  };

  const onLogin = () => setShowAuth(true);

  const onLogout = () => {
    if (session && session.token) Auth.logout(session.token);
    Auth.clear();
    setSession(null);
    setScreen("landing");
  };

  const onTakeover = () => {
    if (scores.influence < HOSTILE_TAKEOVER_COST) return;
    setShowTakeover(true);
  };

  const resolveTakeover = (crisis) => {
    setScores(s => ({
      ...s,
      reputation:   clamp(s.reputation   + crisis.impacts.reputation),
      esg:          clamp(s.esg          + crisis.impacts.esg),
      transparency: clamp(s.transparency + crisis.impacts.transparency),
      risk:         clamp(s.risk         - crisis.impacts.board / 2),
      influence:    s.influence - HOSTILE_TAKEOVER_COST,
    }));
    setShowTakeover(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === "1") setScreen("landing");
      if (e.key === "2") session && setScreen("menu");
      if (e.key === "3") session && setScreen("game");
      if (e.key === "4") session && setScreen("scenario");
      if (e.key === "5") session && setScreen("results");
      if (e.key === "6") session && setScreen("leader");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [session]);

  // Flush pending runs on app mount + when the browser reconnects
  useEffect(() => {
    SaveQueue.flush();
    const onOnline = () => SaveQueue.flush();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  const identity = useMemo(() => {
    if (!session) return PROFILE;
    const full = session.user.full_name;
    return {
      name: full,
      initials: full.split(/\s+/).map(s => s[0]).slice(0, 2).join("").toUpperCase(),
    };
  }, [session]);

  const screenProps = {
    go, isMobile: vp.isMobile, isTablet: vp.isTablet, lang, setLang,
    session, onLogin, onLogout,
    profile, setProfile,
    questionsAnswered, setQuestionsAnswered,
    resetRun,
  };

  return (
    <div style={{ minHeight: "100%", position: "relative" }} lang={lang}>
      <div style={{ minHeight: "100%" }}>
        {screen === "landing"  && <Landing  {...screenProps} />}
        {screen === "menu"     && <Menu     {...screenProps} identity={identity} scores={scores} onTakeover={onTakeover} />}
        {screen === "game"     && <Game     {...screenProps} scores={scores} setScores={setScores} />}
        {screen === "scenario" && <Scenario {...screenProps} scores={scores} setScores={setScores} />}
        {screen === "results"  && <Results  {...screenProps} scores={scores} identity={identity} accuracy={accuracy} />}
        {screen === "leader"   && <Leaderboard {...screenProps} />}
      </div>

      <ProtoNav screen={screen} go={go} isMobile={vp.isMobile} lang={lang} session={session} />

      {showTakeover && (
        <TakeoverModal
          onResolve={resolveTakeover}
          onCancel={() => setShowTakeover(false)}
          isMobile={vp.isMobile}
          lang={lang}
        />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => { setShowAuth(false); setPendingNav(null); }}
          onSuccess={onAuthSuccess}
          lang={lang}
          isMobile={vp.isMobile}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
