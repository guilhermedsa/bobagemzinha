const { useState, useEffect, useMemo } = React;

/* ============================================================
   Ícones (SVG inline — sem depender de lucide-react)
============================================================ */
function svgProps(size, color) {
  return { width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round', style: color ? { color } : undefined };
}
function Sun({ size=18, color }) { return (<svg {...svgProps(size,color)}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>); }
function Moon({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>); }
function Bell({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>); }
function Plus({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M12 5v14M5 12h14"/></svg>); }
function X({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M18 6 6 18M6 6l12 12"/></svg>); }
function Pencil({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>); }
function Trash2({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16ZM10 11v6M14 11v6"/></svg>); }
function ChevronLeft({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M15 18l-6-6 6-6"/></svg>); }
function ChevronRight({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M9 18l6-6-6-6"/></svg>); }
function Check({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M20 6 9 17l-5-5"/></svg>); }
function Eye({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M1 12s4-7.5 11-7.5S23 12 23 12s-4 7.5-11 7.5S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/></svg>); }
function EyeOff({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19.5C5 19.5 1 12 1 12a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4.5c7 0 11 7.5 11 7.5a20.3 20.3 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>); }
function Calendar({ size=18, color }) { return (<svg {...svgProps(size,color)}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>); }
function Menu({ size=18, color }) { return (<svg {...svgProps(size,color)}><path d="M4 6h16M4 12h16M4 18h16"/></svg>); }

/* ============================================================
   Constantes
============================================================ */

const PALETA = ['#CDB5DF', '#BBA3CD', '#A992BA', '#9680A8', '#846E95'];

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DIAS_SEMANA_CURTO = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const DIAS_SEMANA_REGEX = 'SEG|TER|QUA|QUI|SEX|S[ÁA]B|DOM';
const ATIVIDADES_CONHECIDAS = ['Prova de Substituição','Evento Acadêmico','Trabalho','Prova','Aula'];

const CATEGORIA_SEM_COR = '#9AA0A6';
const STORAGE_KEY = 'agenda-academica-v1';

const categoriasIniciais = [
  { id: 'cat-aula', nome: 'Aula', cor: '#CDB5DF' },
  { id: 'cat-trabalho', nome: 'Trabalho', cor: '#BBA3CD' },
  { id: 'cat-evento', nome: 'Evento Acadêmico', cor: '#A992BA' },
  { id: 'cat-prova', nome: 'Prova', cor: '#9680A8' },
  { id: 'cat-substituicao', nome: 'Prova de Substituição', cor: '#846E95' },
];

const cronogramaInicial = { id: 'cron-ia', nome: 'Inteligência Artificial', visivel: true, criadoEm: 1 };

const eventosIniciais = [
  ['Apresentação da disciplina','2026-08-04','cat-aula'],
  ['Unidade 1: visão geral de IA','2026-08-06','cat-aula'],
  ['Unidade 2: solução de problemas, agentes e ambientes, busca não-informada','2026-08-11','cat-aula'],
  ['Busca informada e heurísticas','2026-08-13','cat-aula'],
  ['Busca informada e heurísticas — exercícios','2026-08-18','cat-aula'],
  ['Busca local','2026-08-20','cat-aula'],
  ['Exercícios - A*','2026-08-25','cat-aula'],
  ['Busca local','2026-08-27','cat-aula'],
  ['Busca adversária, teoria dos jogos','2026-09-01','cat-aula'],
  ['Busca adversária','2026-09-03','cat-aula'],
  ['Exercício 1','2026-09-08','cat-trabalho'],
  ['Unidade 3: agentes em lógica, representação e inferência','2026-09-10','cat-aula'],
  ['Planejamento clássico','2026-09-15','cat-aula'],
  ['Planejamento clássico — outras áreas','2026-09-17','cat-aula'],
  ['Exercício 2','2026-09-22','cat-trabalho'],
  ['Dúvidas para a P1','2026-09-24','cat-aula'],
  ['P1','2026-09-29','cat-prova'],
  ['Correção P1. Introdução a Machine Learning','2026-10-01','cat-aula'],
  ['Unidade 4: raciocínio sob incerteza, aprendizado Bayesiano','2026-10-06','cat-aula'],
  ['Aprendizado Bayesiano','2026-10-08','cat-aula'],
  ['Feriado','2026-10-13','cat-aula'],
  ['Aprendizado baseado em instâncias. Similaridade e KNN','2026-10-15','cat-aula'],
  ['Semana Acadêmica','2026-10-20','cat-evento'],
  ['Semana Acadêmica','2026-10-22','cat-evento'],
  ['Exercício 3','2026-10-27','cat-trabalho'],
  ['Árvores de decisão, regressão linear e logística','2026-10-29','cat-aula'],
  ['Avaliação de desempenho de modelos','2026-11-03','cat-aula'],
  ['Redes neurais','2026-11-05','cat-aula'],
  ['Redes neurais','2026-11-10','cat-aula'],
  ['Aprendizado por reforço','2026-11-12','cat-aula'],
  ['Aprendizado não supervisionado','2026-11-17','cat-aula'],
  ['Exercício 4','2026-11-19','cat-trabalho'],
  ['Exercícios e dúvidas para P2','2026-11-24','cat-aula'],
  ['P2','2026-11-26','cat-prova'],
  ['PS — Prova de Substituição','2026-12-01','cat-substituicao'],
  ['Atendimento e dúvidas G2','2026-12-03','cat-aula'],
  ['Aula','2026-12-08','cat-aula'],
  ['Aula','2026-12-10','cat-aula'],
].map(([titulo, data, categoriaId], i) => ({
  id: `e${i+1}`, titulo, data, horaInicio: '21:00', horaFim: '22:30',
  categoriaId, cronogramaId: 'cron-ia', notas: '',
}));

const temas = {
  claro: {
    fundoGradiente: 'linear-gradient(180deg, #FBF9FD 0%, #F3EDF7 100%)',
    painel: '#FFFFFF', painelAlt: '#F5F0F9', borda: '#E4DCEC',
    texto: '#2B2233', textoSuave: '#6E6079', textoFraco: '#9A8FA3',
    destaque: '#846E95', sombraCor: 'rgba(132,110,149,0.20)',
  },
  escuro: {
    fundoGradiente: 'linear-gradient(180deg, #1B1522 0%, #15101B 100%)',
    painel: '#231C2C', painelAlt: '#2A2233', borda: '#372C42',
    texto: '#F2EDF7', textoSuave: '#C1B3CB', textoFraco: '#8C7F97',
    destaque: '#CDB5DF', sombraCor: 'rgba(0,0,0,0.45)',
  },
};

/* ============================================================
   Helpers
============================================================ */

function gerarId() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
}
function parseDataLocal(dataStr) {
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}
function formatarDataISO(date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth()+1).padStart(2,'0');
  const dia = String(date.getDate()).padStart(2,'0');
  return `${ano}-${mes}-${dia}`;
}
function formatarDataBR(dataStr) {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}
function diasRestantes(dataStr) {
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const alvo = parseDataLocal(dataStr); alvo.setHours(0,0,0,0);
  return Math.round((alvo - hoje) / 86400000);
}
function textoContraDias(dias) {
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Amanhã';
  if (dias < 0) return 'Já passou';
  return `Faltam ${dias} dias`;
}
function corTextoContraste(hex) {
  if (!hex) return '#ffffff';
  const c = hex.replace('#','');
  const r = parseInt(c.substring(0,2),16), g = parseInt(c.substring(2,4),16), b = parseInt(c.substring(4,6),16);
  const yiq = (r*299 + g*587 + b*114) / 1000;
  return yiq >= 150 ? '#2B2233' : '#FFFFFF';
}
function analisarTextoColado(texto) {
  const limpo = texto.replace(/\s+/g, ' ').trim();
  if (!limpo) return [];
  const atividadesEsc = ATIVIDADES_CONHECIDAS.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(
    `(?:\\d+\\s+)?(?:${DIAS_SEMANA_REGEX})\\s+(\\d{2}\\/\\d{2}\\/\\d{4})\\s+(?:NP\\s+)?(\\d{2}:\\d{2})\\s*-\\s*(\\d{2}:\\d{2})\\s+([\\s\\S]*?)\\s+(${atividadesEsc})(?=\\s+(?:\\d+\\s+)?(?:${DIAS_SEMANA_REGEX})\\s+\\d{2}\\/\\d{2}\\/\\d{4}|\\s*$)`,
    'g'
  );
  const resultados = [];
  let m;
  while ((m = regex.exec(limpo)) !== null) {
    const [, dataStr, horaIni, horaFim, desc, atividade] = m;
    const [dd, mm, yyyy] = dataStr.split('/');
    const tituloLimpo = desc.trim().replace(/^\d+\s+/, '');
    resultados.push({
      id: gerarId(), titulo: tituloLimpo || atividade, data: `${yyyy}-${mm}-${dd}`,
      horaInicio: horaIni, horaFim: horaFim, atividadeDetectada: atividade,
    });
  }
  return resultados;
}
function nomeDoCronogramaSugerido(texto) {
  const m = texto.match(/\d[\d.\-]*\s*-?\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]{2,60}?)\s*\(\d+\)/);
  return m ? m[1].trim() : '';
}

/* ============================================================
   Componentes auxiliares
============================================================ */

function Overlay({ children, onFechar }) {
  return (
    <div onClick={onFechar} style={{ position:'fixed', inset:0, background:'rgba(20,15,25,0.55)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, zIndex:50 }}>
      {children}
    </div>
  );
}

function RotuloSecao({ t, children, acao }) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: t.textoSuave }}>{children}</span>
      {acao}
    </div>
  );
}

function BotaoIcone({ t, onClick, children, ativo, title }) {
  return (
    <button onClick={onClick} title={title} aria-label={title}
      style={{ background: ativo ? t.destaque : t.painelAlt, border: `1px solid ${ativo ? t.destaque : t.borda}`, borderRadius: 8, width: 22, height: 22, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: ativo ? '#fff' : t.texto, flexShrink: 0 }}>
      {children}
    </button>
  );
}

/* ============================================================
   Cabeçalho
============================================================ */

function Cabecalho({ t, tema, setTema, avisos, sinoAberto, setSinoAberto, onClickEvento, getCategoria, onNovoEvento, sidebarAberta, setSidebarAberta }) {
  return (
    <header style={{ borderBottom: `1px solid ${t.borda}`, background: t.painel, position:'sticky', top:0, zIndex:30 }}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6" style={{ maxWidth: 1400, margin:'0 auto' }}>
        <div className="flex items-center gap-2.5">
          <button className="md:hidden" onClick={() => setSidebarAberta(!sidebarAberta)} aria-label="Abrir menu"
            style={{ color: t.texto, background:'none', border:'none', padding:6, cursor:'pointer', display:'flex' }}>
            <Menu size={20} />
          </button>
          <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg, ${PALETA[0]}, ${PALETA[4]})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Calendar size={17} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16.5, color: t.texto }}>Agenda Acadêmica</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onNovoEvento} className="hidden sm:flex items-center gap-1.5"
            style={{ background: t.destaque, color:'#fff', border:'none', borderRadius:10, padding:'8px 13px', fontSize:13.5, fontWeight:700, cursor:'pointer' }}>
            <Plus size={15} /> Novo evento
          </button>

          <div style={{ position:'relative' }}>
            <button onClick={() => setSinoAberto(!sinoAberto)} aria-label="Avisos"
              style={{ position:'relative', background: t.painelAlt, border:`1px solid ${t.borda}`, borderRadius:10, padding:8, cursor:'pointer', color:t.texto, display:'flex' }}>
              <Bell size={17} />
              {avisos.length > 0 && (
                <span style={{ position:'absolute', top:-4, right:-4, background:'#D9534F', color:'#fff', borderRadius:999, fontSize:10, minWidth:16, height:16, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px', fontWeight:700 }}>
                  {avisos.length}
                </span>
              )}
            </button>
            {sinoAberto && (
              <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', width:300, maxHeight:360, overflowY:'auto', background:t.painel, border:`1px solid ${t.borda}`, borderRadius:14, boxShadow:`0 14px 30px ${t.sombraCor}`, zIndex:40 }}>
                <div style={{ padding:'11px 14px', borderBottom:`1px solid ${t.borda}`, fontSize:12.5, fontWeight:700, color:t.textoSuave }}>Próximos eventos</div>
                {avisos.length === 0 ? (
                  <div style={{ padding:16, fontSize:13, color:t.textoFraco }}>Nada se aproximando por enquanto.</div>
                ) : avisos.map(ev => {
                  const cat = getCategoria(ev.categoriaId);
                  return (
                    <button key={ev.id} onClick={() => onClickEvento(ev)}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', textAlign:'left', padding:'10px 14px', background:'none', border:'none', borderBottom:`1px solid ${t.borda}`, cursor:'pointer' }}>
                      <span style={{ width:8, height:8, borderRadius:999, background:cat.cor, flexShrink:0 }} />
                      <span style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, color:t.texto, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ev.titulo}</div>
                        <div style={{ fontSize:11.5, color:t.textoFraco }}>{formatarDataBR(ev.data)}</div>
                      </span>
                      <span style={{ fontSize:11, fontWeight:700, color: ev.dias<=2 ? '#D9534F' : t.destaque, whiteSpace:'nowrap' }}>{textoContraDias(ev.dias)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button onClick={() => setTema(tema === 'claro' ? 'escuro' : 'claro')} aria-label="Alternar tema"
            style={{ background:t.painelAlt, border:`1px solid ${t.borda}`, borderRadius:10, padding:8, cursor:'pointer', color:t.texto, display:'flex' }}>
            {tema === 'claro' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   Barra lateral
============================================================ */

function BarraLateral({ t, cronogramas, categorias, onAlternarVisibilidade, onRenomearCronograma, onExcluirCronograma, onAbrirImportar, onSalvarCategoria, onExcluirCategoria, proximos, onClickProximo, diasAviso, setDiasAviso, aberta }) {
  const [editandoCronId, setEditandoCronId] = useState(null);
  const [nomeEdicao, setNomeEdicao] = useState('');
  const [confirmarExclusaoCron, setConfirmarExclusaoCron] = useState(null);
  const [mostrarNovaCategoria, setMostrarNovaCategoria] = useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] = useState('');
  const [novaCategoriaCor, setNovaCategoriaCor] = useState(PALETA[2]);
  const [confirmarExclusaoCat, setConfirmarExclusaoCat] = useState(null);

  function confirmarNovaCategoriaSidebar() {
    if (!novaCategoriaNome.trim()) return;
    onSalvarCategoria({ nome: novaCategoriaNome.trim(), cor: novaCategoriaCor });
    setNovaCategoriaNome(''); setMostrarNovaCategoria(false);
  }

  return (
    <aside className={`${aberta ? 'block' : 'hidden'} md:block`} style={{ width:'100%', maxWidth:296, borderRight:`1px solid ${t.borda}`, padding:18, flexShrink:0 }}>
      <div style={{ marginBottom:24 }}>
        <RotuloSecao t={t} acao={<BotaoIcone t={t} onClick={onAbrirImportar} title="Adicionar cronograma" ativo><Plus size={14} /></BotaoIcone>}>Cronogramas</RotuloSecao>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {cronogramas.length === 0 && <div style={{ fontSize:12.5, color:t.textoFraco, padding:'6px 2px' }}>Nenhum cronograma ainda — adicione o primeiro.</div>}
          {cronogramas.map(c => {
            const visivel = c.visivel !== false;
            return (
              <div key={c.id} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 8px', borderRadius:10, background:t.painelAlt }}>
                <button onClick={() => onAlternarVisibilidade(c.id)} aria-label={visivel ? 'Ocultar' : 'Mostrar'}
                  style={{ background:'none', border:'none', cursor:'pointer', color: visivel ? t.destaque : t.textoFraco, padding:2, display:'flex', flexShrink:0 }}>
                  {visivel ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                {editandoCronId === c.id ? (
                  <input autoFocus value={nomeEdicao} onChange={e => setNomeEdicao(e.target.value)}
                    onKeyDown={e => { if (e.key==='Enter') { onRenomearCronograma(c.id, nomeEdicao.trim()||c.nome); setEditandoCronId(null);} if (e.key==='Escape') setEditandoCronId(null); }}
                    onBlur={() => { onRenomearCronograma(c.id, nomeEdicao.trim()||c.nome); setEditandoCronId(null); }}
                    style={{ flex:1, fontSize:13, padding:'2px 6px', borderRadius:6, border:`1px solid ${t.borda}`, background:t.painel, color:t.texto, minWidth:0 }} />
                ) : (
                  <span style={{ flex:1, fontSize:13, color: visivel ? t.texto : t.textoFraco, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.nome}</span>
                )}
                <button onClick={() => { setEditandoCronId(c.id); setNomeEdicao(c.nome); }} aria-label="Renomear"
                  style={{ background:'none', border:'none', cursor:'pointer', color:t.textoFraco, padding:2, display:'flex', flexShrink:0 }}>
                  <Pencil size={13} />
                </button>
                {confirmarExclusaoCron === c.id ? (
                  <button onClick={() => { onExcluirCronograma(c.id); setConfirmarExclusaoCron(null); }}
                    style={{ fontSize:11, background:'#D9534F', color:'#fff', border:'none', borderRadius:6, padding:'3px 6px', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                    Excluir?
                  </button>
                ) : (
                  <button onClick={() => setConfirmarExclusaoCron(c.id)}
                    aria-label="Excluir" style={{ background:'none', border:'none', cursor:'pointer', color:t.textoFraco, padding:2, display:'flex', flexShrink:0 }}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom:24 }}>
        <RotuloSecao t={t} acao={<BotaoIcone t={t} onClick={() => setMostrarNovaCategoria(v=>!v)} title="Nova categoria" ativo><Plus size={14} /></BotaoIcone>}>Categorias</RotuloSecao>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {categorias.map(cat => (
            <div key={cat.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 4px' }}>
              <input type="color" value={cat.cor} onChange={e => onSalvarCategoria({ ...cat, cor: e.target.value })}
                style={{ width:18, height:18, padding:0, border:'none', borderRadius:5, cursor:'pointer', background:'none', flexShrink:0 }} />
              <input value={cat.nome} onChange={e => onSalvarCategoria({ ...cat, nome: e.target.value })}
                style={{ flex:1, fontSize:13, color:t.texto, background:'none', border:'none', padding:'4px 4px', minWidth:0, borderRadius:5 }} />
              {confirmarExclusaoCat === cat.id ? (
                <button onClick={() => { onExcluirCategoria(cat.id); setConfirmarExclusaoCat(null); }}
                  style={{ fontSize:11, background:'#D9534F', color:'#fff', border:'none', borderRadius:6, padding:'3px 6px', cursor:'pointer', flexShrink:0 }}>Excluir?</button>
              ) : (
                <button onClick={() => setConfirmarExclusaoCat(cat.id)} aria-label="Excluir categoria"
                  style={{ background:'none', border:'none', cursor:'pointer', color:t.textoFraco, padding:2, display:'flex', flexShrink:0 }}>
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
          {mostrarNovaCategoria && (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 8px', background:t.painelAlt, borderRadius:10, marginTop:4 }}>
              <input type="color" value={novaCategoriaCor} onChange={e=>setNovaCategoriaCor(e.target.value)}
                style={{ width:18, height:18, padding:0, border:'none', borderRadius:5, cursor:'pointer', flexShrink:0 }} />
              <input autoFocus placeholder="Nome da categoria" value={novaCategoriaNome} onChange={e=>setNovaCategoriaNome(e.target.value)}
                onKeyDown={e=>{ if (e.key==='Enter') confirmarNovaCategoriaSidebar(); }}
                style={{ flex:1, fontSize:12.5, padding:'4px 6px', borderRadius:6, border:`1px solid ${t.borda}`, background:t.painel, color:t.texto, minWidth:0 }} />
              <button onClick={confirmarNovaCategoriaSidebar}
                style={{ background:t.destaque, border:'none', borderRadius:6, color:'#fff', padding:4, display:'flex', cursor:'pointer', flexShrink:0 }}>
                <Check size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom:24 }}>
        <span style={{ fontSize:12.5, fontWeight:700, color:t.textoSuave }}>Avisar com antecedência</span>
        <div className="flex items-center gap-2" style={{ marginTop:8 }}>
          <input type="number" min={1} max={60} value={diasAviso}
            onChange={e => setDiasAviso(Math.max(1, Math.min(60, Number(e.target.value)||1)))}
            style={{ width:56, fontSize:13, padding:'5px 7px', borderRadius:8, border:`1px solid ${t.borda}`, background:t.painel, color:t.texto }} />
          <span style={{ fontSize:12.5, color:t.textoSuave }}>dias</span>
        </div>
      </div>

      <div>
        <span style={{ fontSize:12.5, fontWeight:700, color:t.textoSuave }}>Próximos eventos</span>
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
          {proximos.length === 0 && <div style={{ fontSize:12.5, color:t.textoFraco }}>Nada por vir nos próximos dias.</div>}
          {proximos.map(ev => (
            <button key={ev.id} onClick={() => onClickProximo(ev)}
              style={{ textAlign:'left', display:'flex', alignItems:'center', gap:8, background:t.painelAlt, border:'none', borderRadius:9, padding:'7px 9px', cursor:'pointer' }}>
              <span style={{ fontSize:12.5, color:t.texto, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.titulo}</span>
              <span style={{ fontSize:10.5, fontWeight:700, color: ev.dias<=2 ? '#D9534F' : t.destaque, whiteSpace:'nowrap', flexShrink:0 }}>{textoContraDias(ev.dias)}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ============================================================
   Navegação + grade do calendário
============================================================ */

function NavegacaoCalendario({ t, mesAtual, anoAtual, onAnterior, onProximo, onHoje, onNovoEvento }) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom:16 }}>
      <div className="flex items-center gap-2">
        <button onClick={onAnterior} aria-label="Mês anterior" style={{ background:t.painel, border:`1px solid ${t.borda}`, borderRadius:9, padding:6, cursor:'pointer', color:t.texto, display:'flex' }}><ChevronLeft size={17} /></button>
        <div style={{ fontSize:18, fontWeight:800, minWidth:160, textAlign:'center', color:t.texto }}>
          {MESES[mesAtual]} <span style={{ color:t.textoFraco, fontWeight:500 }}>{anoAtual}</span>
        </div>
        <button onClick={onProximo} aria-label="Próximo mês" style={{ background:t.painel, border:`1px solid ${t.borda}`, borderRadius:9, padding:6, cursor:'pointer', color:t.texto, display:'flex' }}><ChevronRight size={17} /></button>
        <button onClick={onHoje} style={{ fontSize:12.5, fontWeight:600, background:t.painelAlt, border:`1px solid ${t.borda}`, borderRadius:9, padding:'6px 11px', cursor:'pointer', color:t.texto, marginLeft:4 }}>Hoje</button>
      </div>
      <button onClick={onNovoEvento} className="sm:hidden flex items-center gap-1"
        style={{ background:t.destaque, color:'#fff', border:'none', borderRadius:9, padding:'7px 11px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
        <Plus size={14} /> Evento
      </button>
    </div>
  );
}

function GradeCalendario({ t, mesAtual, anoAtual, eventosPorDia, getCategoria, onClickDia, onClickEvento }) {
  const hojeStr = formatarDataISO(new Date());
  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
  const totalDiasMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

  const celulas = [];
  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    const d = new Date(anoAtual, mesAtual, -i);
    celulas.push({ dia: d.getDate(), mes: d.getMonth(), ano: d.getFullYear(), foraDoMes: true });
  }
  for (let dia = 1; dia <= totalDiasMes; dia++) {
    celulas.push({ dia, mes: mesAtual, ano: anoAtual, foraDoMes: false });
  }
  let prox = 1;
  while (celulas.length < 42) {
    const d = new Date(anoAtual, mesAtual + 1, prox);
    celulas.push({ dia: d.getDate(), mes: d.getMonth(), ano: d.getFullYear(), foraDoMes: true });
    prox++;
  }

  return (
    <div style={{ background:t.painel, border:`1px solid ${t.borda}`, borderRadius:16, overflow:'hidden' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', borderBottom:`1px solid ${t.borda}` }}>
        {DIAS_SEMANA_CURTO.map(d => (
          <div key={d} style={{ padding:'10px 4px', textAlign:'center', fontSize:11.5, fontWeight:700, color:t.textoFraco }}>{d}</div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)' }}>
        {celulas.map((c, idx) => {
          const dataStr = `${c.ano}-${String(c.mes+1).padStart(2,'0')}-${String(c.dia).padStart(2,'0')}`;
          const eventosDia = eventosPorDia[dataStr] || [];
          const ehHoje = dataStr === hojeStr;
          const visiveis = eventosDia.slice(0, 3);
          const extras = eventosDia.length - visiveis.length;
          return (
            <div key={idx} onClick={() => onClickDia(dataStr)}
              style={{
                minHeight:92, padding:6, borderRight: (idx%7!==6) ? `1px solid ${t.borda}` : 'none',
                borderBottom:`1px solid ${t.borda}`, cursor:'pointer',
                opacity: c.foraDoMes ? 0.4 : 1, background: ehHoje ? t.painelAlt : 'transparent',
                display:'flex', flexDirection:'column', gap:3,
              }}>
              <span style={{
                fontSize:12, fontWeight: ehHoje ? 800 : 600, color: ehHoje ? t.destaque : t.texto,
                width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center',
                borderRadius:999, border: ehHoje ? `1.5px solid ${t.destaque}` : 'none',
              }}>{c.dia}</span>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {visiveis.map(ev => {
                  const cat = getCategoria(ev.categoriaId);
                  return (
                    <div key={ev.id} onClick={(e) => { e.stopPropagation(); onClickEvento(ev); }} title={ev.titulo}
                      style={{ fontSize:10.5, fontWeight:600, padding:'2px 5px', borderRadius:5, background:cat.cor, color:corTextoContraste(cat.cor), whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {ev.titulo}
                    </div>
                  );
                })}
                {extras > 0 && <div style={{ fontSize:10, color:t.textoFraco, paddingLeft:4, fontWeight:600 }}>+{extras} mais</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Modal: detalhe do dia
============================================================ */

function ModalDia({ t, dataStr, eventos, getCategoria, getCronograma, onFechar, onClickEvento, onNovoEvento }) {
  const data = parseDataLocal(dataStr);
  const ordenados = [...eventos].sort((a,b) => (a.horaInicio||'').localeCompare(b.horaInicio||''));
  return (
    <Overlay onFechar={onFechar}>
      <div className="modal-anim" style={{ background:t.painel, borderRadius:16, width:'100%', maxWidth:420, maxHeight:'80vh', display:'flex', flexDirection:'column', overflow:'hidden' }} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between" style={{ padding:'16px 18px', borderBottom:`1px solid ${t.borda}` }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:t.texto }}>{DIAS_SEMANA_CURTO[data.getDay()]}, {data.getDate()} de {MESES[data.getMonth()]}</div>
            <div style={{ fontSize:12, color:t.textoFraco }}>{ordenados.length} evento(s)</div>
          </div>
          <button onClick={onFechar} style={{ background:'none', border:'none', cursor:'pointer', color:t.textoFraco, display:'flex' }}><X size={18} /></button>
        </div>
        <div style={{ overflowY:'auto', padding:12, display:'flex', flexDirection:'column', gap:8 }}>
          {ordenados.map(ev => {
            const cat = getCategoria(ev.categoriaId);
            const cron = getCronograma(ev.cronogramaId);
            return (
              <button key={ev.id} onClick={() => onClickEvento(ev)}
                style={{ textAlign:'left', display:'flex', flexDirection:'column', gap:5, background:t.painelAlt, border:'none', borderRadius:11, padding:11, cursor:'pointer', width:'100%' }}>
                <div style={{ fontSize:13.5, fontWeight:600, color:t.texto }}>{ev.titulo}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {ev.horaInicio && <span style={{ fontSize:11.5, color:t.textoFraco }}>{ev.horaInicio}{ev.horaFim ? `–${ev.horaFim}` : ''}</span>}
                  <span style={{ fontSize:10, fontWeight:700, color:corTextoContraste(cat.cor), background:cat.cor, padding:'2px 8px', borderRadius:999 }}>{cat.nome}</span>
                  {cron && <span style={{ fontSize:11.5, color:t.textoFraco }}>{cron.nome}</span>}
                </div>
              </button>
            );
          })}
          {ordenados.length === 0 && <div style={{ fontSize:13, color:t.textoFraco, padding:'20px 8px', textAlign:'center' }}>Nenhum evento neste dia.</div>}
        </div>
        <div style={{ padding:12, borderTop:`1px solid ${t.borda}` }}>
          <button onClick={onNovoEvento} className="flex items-center justify-center gap-1.5"
            style={{ width:'100%', background:t.destaque, color:'#fff', border:'none', borderRadius:11, padding:'10px', fontSize:13.5, fontWeight:700, cursor:'pointer' }}>
            <Plus size={15} /> Novo evento neste dia
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ============================================================
   Modal: criar/editar evento
============================================================ */

function ModalEvento({ t, dados, categorias, cronogramas, onSalvar, onExcluir, onFechar, onSalvarCategoria }) {
  const [form, setForm] = useState(dados);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [criandoCategoria, setCriandoCategoria] = useState(false);
  const [novaCatNome, setNovaCatNome] = useState('');
  const [novaCatCor, setNovaCatCor] = useState(PALETA[2]);

  const ehNovo = form.novo || !form.id;
  function atualizar(campo, valor) { setForm(f => ({ ...f, [campo]: valor })); }

  function confirmarNovaCategoria() {
    if (!novaCatNome.trim()) return;
    const nova = { id: gerarId(), nome: novaCatNome.trim(), cor: novaCatCor };
    onSalvarCategoria(nova);
    atualizar('categoriaId', nova.id);
    setCriandoCategoria(false); setNovaCatNome('');
  }
  function handleSalvar() {
    if (!form.titulo.trim() || !form.data) return;
    onSalvar({ ...form, titulo: form.titulo.trim() });
  }

  const inputStyle = { width:'100%', fontSize:13.5, padding:'9px 10px', borderRadius:9, border:`1px solid ${t.borda}`, background:t.painelAlt, color:t.texto, boxSizing:'border-box' };
  const labelStyle = { fontSize:11.5, fontWeight:700, color:t.textoSuave, display:'block', marginBottom:5 };

  return (
    <Overlay onFechar={onFechar}>
      <div className="modal-anim" style={{ background:t.painel, borderRadius:16, width:'100%', maxWidth:440, maxHeight:'88vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between" style={{ padding:'16px 18px', borderBottom:`1px solid ${t.borda}` }}>
          <div style={{ fontSize:15, fontWeight:700, color:t.texto }}>{ehNovo ? 'Novo evento' : 'Editar evento'}</div>
          <button onClick={onFechar} style={{ background:'none', border:'none', cursor:'pointer', color:t.textoFraco, display:'flex' }}><X size={18} /></button>
        </div>

        <div style={{ padding:18, display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={labelStyle}>Título</label>
            <input style={inputStyle} value={form.titulo} onChange={e=>atualizar('titulo', e.target.value)} placeholder="Ex: Prova P1" autoFocus />
          </div>
          <div>
            <label style={labelStyle}>Data</label>
            <input type="date" style={inputStyle} value={form.data} onChange={e=>atualizar('data', e.target.value)} />
          </div>
          <div className="flex gap-3">
            <div style={{ flex:1 }}>
              <label style={labelStyle}>Início</label>
              <input type="time" style={inputStyle} value={form.horaInicio||''} onChange={e=>atualizar('horaInicio', e.target.value)} />
            </div>
            <div style={{ flex:1 }}>
              <label style={labelStyle}>Fim</label>
              <input type="time" style={inputStyle} value={form.horaFim||''} onChange={e=>atualizar('horaFim', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Cronograma</label>
            <select style={inputStyle} value={form.cronogramaId} onChange={e=>atualizar('cronogramaId', e.target.value)}>
              {cronogramas.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Categoria (grupo)</label>
            {!criandoCategoria ? (
              <div className="flex gap-2">
                <select style={inputStyle} value={form.categoriaId} onChange={e=>atualizar('categoriaId', e.target.value)}>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
                <button onClick={()=>setCriandoCategoria(true)} type="button" title="Nova categoria"
                  style={{ flexShrink:0, background:t.painelAlt, border:`1px solid ${t.borda}`, borderRadius:9, padding:'0 12px', cursor:'pointer', color:t.texto, display:'flex', alignItems:'center' }}>
                  <Plus size={15} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2" style={{ alignItems:'center' }}>
                <input type="color" value={novaCatCor} onChange={e=>setNovaCatCor(e.target.value)} style={{ width:34, height:34, padding:0, border:'none', borderRadius:8, cursor:'pointer', flexShrink:0 }} />
                <input style={{...inputStyle, flex:1}} placeholder="Nome do novo grupo" value={novaCatNome} onChange={e=>setNovaCatNome(e.target.value)} autoFocus
                  onKeyDown={e=>{ if (e.key==='Enter') confirmarNovaCategoria(); }} />
                <button type="button" onClick={confirmarNovaCategoria} style={{ background:t.destaque, border:'none', borderRadius:9, color:'#fff', padding:'9px 10px', cursor:'pointer', flexShrink:0, display:'flex' }}><Check size={15}/></button>
                <button type="button" onClick={()=>setCriandoCategoria(false)} style={{ background:'none', border:'none', color:t.textoFraco, cursor:'pointer', flexShrink:0, display:'flex' }}><X size={15}/></button>
              </div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Notas (opcional)</label>
            <textarea style={{...inputStyle, minHeight:64, resize:'vertical', fontFamily:'inherit'}} value={form.notas||''} onChange={e=>atualizar('notas', e.target.value)} placeholder="Alguma observação..." />
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ padding:'14px 18px', borderTop:`1px solid ${t.borda}` }}>
          {!ehNovo ? (
            confirmarExclusao ? (
              <button onClick={() => onExcluir(form.id)} style={{ fontSize:13, fontWeight:700, color:'#fff', background:'#D9534F', border:'none', borderRadius:9, padding:'9px 12px', cursor:'pointer' }}>Confirmar exclusão</button>
            ) : (
              <button onClick={() => setConfirmarExclusao(true)} className="flex items-center gap-1.5" style={{ fontSize:13, fontWeight:600, color:'#D9534F', background:'none', border:'none', cursor:'pointer', padding:'9px 4px' }}>
                <Trash2 size={15}/> Excluir
              </button>
            )
          ) : <span />}
          <button onClick={handleSalvar} disabled={!form.titulo.trim() || !form.data}
            style={{ fontSize:13.5, fontWeight:700, color:'#fff', background: (!form.titulo.trim()||!form.data) ? t.textoFraco : t.destaque, border:'none', borderRadius:10, padding:'10px 18px', cursor: (!form.titulo.trim()||!form.data) ? 'not-allowed' : 'pointer' }}>
            Salvar
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ============================================================
   Modal: importar cronograma
============================================================ */

function ModalImportar({ t, categorias, onFechar, onConfirmar }) {
  const [etapa, setEtapa] = useState('colar');
  const [nomeCronograma, setNomeCronograma] = useState('');
  const [textoColado, setTextoColado] = useState('');
  const [linhas, setLinhas] = useState([]);

  function analisar() {
    const encontrados = analisarTextoColado(textoColado);
    const sugestaoNome = nomeDoCronogramaSugerido(textoColado);
    if (sugestaoNome && !nomeCronograma) setNomeCronograma(sugestaoNome);
    const comCategoria = encontrados.map(ev => {
      const catCorrespondente = categorias.find(c => c.nome.toLowerCase() === ev.atividadeDetectada.toLowerCase());
      return { ...ev, categoriaId: catCorrespondente ? catCorrespondente.id : (categorias[0]?.id || '') };
    });
    setLinhas(comCategoria);
    setEtapa('revisar');
  }
  function irParaManual() {
    setLinhas([{ id: gerarId(), titulo:'', data: formatarDataISO(new Date()), horaInicio:'', horaFim:'', categoriaId: categorias[0]?.id || '' }]);
    setEtapa('revisar');
  }
  function atualizarLinha(id, campo, valor) { setLinhas(prev => prev.map(l => l.id === id ? { ...l, [campo]: valor } : l)); }
  function removerLinha(id) { setLinhas(prev => prev.filter(l => l.id !== id)); }
  function adicionarLinhaVazia() { setLinhas(prev => [...prev, { id: gerarId(), titulo:'', data: formatarDataISO(new Date()), horaInicio:'', horaFim:'', categoriaId: categorias[0]?.id || '' }]); }
  function confirmar() {
    const validas = linhas.filter(l => l.titulo.trim() && l.data);
    if (validas.length === 0) return;
    onConfirmar(nomeCronograma.trim() || 'Novo cronograma', validas);
  }

  const validasCount = linhas.filter(l=>l.titulo.trim() && l.data).length;
  const inputStyle = { fontSize:12.5, padding:'6px 8px', borderRadius:7, border:`1px solid ${t.borda}`, background:t.painel, color:t.texto, boxSizing:'border-box' };

  return (
    <Overlay onFechar={onFechar}>
      <div className="modal-anim" style={{ background:t.painel, borderRadius:16, width:'100%', maxWidth:640, maxHeight:'88vh', display:'flex', flexDirection:'column' }} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between" style={{ padding:'16px 18px', borderBottom:`1px solid ${t.borda}` }}>
          <div style={{ fontSize:15, fontWeight:700, color:t.texto }}>Adicionar cronograma</div>
          <button onClick={onFechar} style={{ background:'none', border:'none', cursor:'pointer', color:t.textoFraco, display:'flex' }}><X size={18} /></button>
        </div>

        {etapa === 'colar' && (
          <div style={{ padding:18, display:'flex', flexDirection:'column', gap:14, overflowY:'auto' }}>
            <div>
              <label style={{ fontSize:11.5, fontWeight:700, color:t.textoSuave, display:'block', marginBottom:5 }}>Nome do cronograma</label>
              <input style={{...inputStyle, width:'100%', fontSize:13.5, padding:'9px 10px'}} value={nomeCronograma} onChange={e=>setNomeCronograma(e.target.value)} placeholder="Ex: Cálculo II" />
            </div>
            <div>
              <label style={{ fontSize:11.5, fontWeight:700, color:t.textoSuave, display:'block', marginBottom:5 }}>Cole aqui o texto do PDF (selecione tudo no seu leitor e copie)</label>
              <textarea value={textoColado} onChange={e=>setTextoColado(e.target.value)} placeholder="Ex: 1 TER 04/08/2026 NP 21:00 - 22:30 Apresentação da disciplina Aula ..."
                style={{...inputStyle, width:'100%', minHeight:160, fontFamily:'inherit', resize:'vertical'}} />
              <div style={{ fontSize:11.5, color:t.textoFraco, marginTop:6 }}>Reconheço linhas com dia, data, horário e o tipo de atividade (Aula, Prova, Trabalho, Evento Acadêmico...). Você revisa tudo antes de confirmar.</div>
            </div>
            <div className="flex items-center gap-2" style={{ marginTop:4 }}>
              <button onClick={analisar} disabled={!textoColado.trim()}
                style={{ background: !textoColado.trim() ? t.textoFraco : t.destaque, color:'#fff', border:'none', borderRadius:10, padding:'10px 16px', fontSize:13.5, fontWeight:700, cursor: !textoColado.trim() ? 'not-allowed' : 'pointer' }}>
                Analisar texto
              </button>
              <button onClick={irParaManual} style={{ background:'none', border:`1px solid ${t.borda}`, color:t.texto, borderRadius:10, padding:'10px 16px', fontSize:13.5, fontWeight:600, cursor:'pointer' }}>
                Adicionar manualmente
              </button>
            </div>
          </div>
        )}

        {etapa === 'revisar' && (
          <>
            <div style={{ padding:'14px 18px 0' }}>
              <label style={{ fontSize:11.5, fontWeight:700, color:t.textoSuave, display:'block', marginBottom:5 }}>Nome do cronograma</label>
              <input style={{...inputStyle, width:'100%', fontSize:13.5, padding:'9px 10px'}} value={nomeCronograma} onChange={e=>setNomeCronograma(e.target.value)} placeholder="Ex: Cálculo II" />
              <div style={{ fontSize:12, color:t.textoFraco, margin:'10px 0 4px' }}>
                {linhas.length === 0 ? 'Nenhum evento reconhecido — adicione manualmente abaixo.' : `${linhas.length} evento(s) encontrados. Revise antes de importar:`}
              </div>
            </div>
            <div style={{ overflowY:'auto', padding:'4px 18px', flex:1, display:'flex', flexDirection:'column', gap:6 }}>
              {linhas.map(linha => (
                <div key={linha.id} className="flex items-center gap-1.5" style={{ background:t.painelAlt, borderRadius:9, padding:7 }}>
                  <input style={{...inputStyle, flex:1, minWidth:0}} value={linha.titulo} onChange={e=>atualizarLinha(linha.id,'titulo',e.target.value)} placeholder="Título" />
                  <input type="date" style={{...inputStyle, width:132, flexShrink:0}} value={linha.data} onChange={e=>atualizarLinha(linha.id,'data',e.target.value)} />
                  <select style={{...inputStyle, width:118, flexShrink:0}} value={linha.categoriaId} onChange={e=>atualizarLinha(linha.id,'categoriaId',e.target.value)}>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                  <button onClick={()=>removerLinha(linha.id)} aria-label="Remover" style={{ background:'none', border:'none', color:t.textoFraco, cursor:'pointer', flexShrink:0, display:'flex' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={adicionarLinhaVazia} className="flex items-center gap-1.5"
                style={{ alignSelf:'flex-start', background:'none', border:`1px dashed ${t.borda}`, color:t.textoSuave, borderRadius:9, padding:'7px 12px', fontSize:12.5, fontWeight:600, cursor:'pointer', marginTop:2, marginBottom:8 }}>
                <Plus size={13} /> Adicionar linha
              </button>
            </div>
            <div className="flex items-center justify-between" style={{ padding:'14px 18px', borderTop:`1px solid ${t.borda}` }}>
              <button onClick={()=>setEtapa('colar')} style={{ background:'none', border:'none', color:t.textoSuave, fontSize:13, fontWeight:600, cursor:'pointer' }}>Voltar</button>
              <button onClick={confirmar} disabled={validasCount===0}
                style={{ background: validasCount===0 ? t.textoFraco : t.destaque, color:'#fff', border:'none', borderRadius:10, padding:'10px 18px', fontSize:13.5, fontWeight:700, cursor: validasCount===0 ? 'not-allowed' : 'pointer' }}>
                Confirmar e importar
              </button>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
}

/* ============================================================
   Componente principal
============================================================ */

function AgendaAcademica() {
  const [carregando, setCarregando] = useState(true);
  const [cronogramas, setCronogramas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tema, setTema] = useState('claro');
  const [diasAviso, setDiasAviso] = useState(7);

  const agora = new Date();
  const [mesAtual, setMesAtual] = useState(agora.getMonth());
  const [anoAtual, setAnoAtual] = useState(agora.getFullYear());

  const [modalEvento, setModalEvento] = useState(null);
  const [modalImportar, setModalImportar] = useState(false);
  const [modalDia, setModalDia] = useState(null);
  const [sinoAberto, setSinoAberto] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const dados = JSON.parse(raw);
        setCronogramas(dados.cronogramas?.length ? dados.cronogramas : [cronogramaInicial]);
        setEventos(dados.eventos?.length ? dados.eventos : eventosIniciais);
        setCategorias(dados.categorias?.length ? dados.categorias : categoriasIniciais);
        setTema(dados.tema || 'claro');
        setDiasAviso(typeof dados.diasAviso === 'number' ? dados.diasAviso : 7);
      } else {
        setCronogramas([cronogramaInicial]); setEventos(eventosIniciais); setCategorias(categoriasIniciais);
      }
    } catch (e) {
      setCronogramas([cronogramaInicial]); setEventos(eventosIniciais); setCategorias(categoriasIniciais);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (carregando) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cronogramas, eventos, categorias, tema, diasAviso }));
    } catch (e) { console.error('Falha ao salvar', e); }
  }, [cronogramas, eventos, categorias, tema, diasAviso, carregando]);

  const t = temas[tema];

  function getCategoria(id) { return categorias.find(c => c.id === id) || { id:'sem', nome:'Sem categoria', cor: CATEGORIA_SEM_COR }; }
  function getCronograma(id) { return cronogramas.find(c => c.id === id); }

  const eventosVisiveis = useMemo(() => {
    const idsVisiveis = new Set(cronogramas.filter(c => c.visivel !== false).map(c => c.id));
    return eventos.filter(e => idsVisiveis.has(e.cronogramaId));
  }, [eventos, cronogramas]);

  const proximosEventos = useMemo(() => {
    return eventosVisiveis.map(e => ({ ...e, dias: diasRestantes(e.data) })).filter(e => e.dias >= 0).sort((a,b) => a.dias - b.dias);
  }, [eventosVisiveis]);

  const avisos = proximosEventos.filter(e => e.dias <= diasAviso);

  const eventosPorDia = useMemo(() => {
    const mapa = {};
    for (const ev of eventosVisiveis) { (mapa[ev.data] ||= []).push(ev); }
    return mapa;
  }, [eventosVisiveis]);

  function abrirNovoEvento(dataPadrao) {
    setModalEvento({ novo:true, id:null, titulo:'', data: dataPadrao || formatarDataISO(new Date()), horaInicio:'', horaFim:'', categoriaId: categorias[0]?.id||'', cronogramaId: cronogramas[0]?.id||'', notas:'' });
  }
  function abrirEdicaoEvento(evento) { setModalEvento({ ...evento, novo:false }); }
  function salvarEvento(dadosEvento) {
    const limpo = { ...dadosEvento }; delete limpo.novo; delete limpo.dias;
    if (dadosEvento.novo || !dadosEvento.id) {
      setEventos(prev => [...prev, { ...limpo, id: gerarId() }]);
    } else {
      setEventos(prev => prev.map(e => e.id === limpo.id ? limpo : e));
    }
    setModalEvento(null);
  }
  function excluirEvento(id) { setEventos(prev => prev.filter(e => e.id !== id)); setModalEvento(null); }

  function alternarVisibilidadeCronograma(id) { setCronogramas(prev => prev.map(c => c.id === id ? { ...c, visivel: c.visivel === false ? true : false } : c)); }
  function renomearCronograma(id, novoNome) { setCronogramas(prev => prev.map(c => c.id === id ? { ...c, nome: novoNome } : c)); }
  function excluirCronograma(id) {
    if (cronogramas.length <= 1) return;
    setCronogramas(prev => prev.filter(c => c.id !== id));
    setEventos(prev => prev.filter(e => e.cronogramaId !== id));
  }
  function adicionarCronogramaComEventos(nome, eventosNovos) {
    const novoCron = { id: gerarId(), nome: nome || 'Novo cronograma', visivel:true, criadoEm: Date.now() };
    const comCronograma = eventosNovos.map(ev => ({
      id: gerarId(), titulo: ev.titulo, data: ev.data, horaInicio: ev.horaInicio||'', horaFim: ev.horaFim||'',
      categoriaId: ev.categoriaId, cronogramaId: novoCron.id, notas:'',
    }));
    setCronogramas(prev => [...prev, novoCron]);
    setEventos(prev => [...prev, ...comCronograma]);
    setModalImportar(false);
  }

  function salvarCategoria(categoria) {
    setCategorias(prev => {
      const idx = prev.findIndex(c => c.id === categoria.id);
      if (idx === -1) {
        const nova = categoria.id ? categoria : { ...categoria, id: gerarId() };
        return [...prev, nova];
      }
      return prev.map(c => c.id === categoria.id ? categoria : c);
    });
  }
  function excluirCategoria(id) { if (categorias.length <= 1) return; setCategorias(prev => prev.filter(c => c.id !== id)); }

  function mesAnterior() { if (mesAtual === 0) { setMesAtual(11); setAnoAtual(a=>a-1); } else setMesAtual(m=>m-1); }
  function proximoMes() { if (mesAtual === 11) { setMesAtual(0); setAnoAtual(a=>a+1); } else setMesAtual(m=>m+1); }
  function irParaHoje() { const h = new Date(); setMesAtual(h.getMonth()); setAnoAtual(h.getFullYear()); }

  if (carregando) {
    return (
      <div style={{ minHeight:'100vh', background: temas.claro.fundoGradiente, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ color: temas.claro.textoSuave, fontSize:14 }}>Carregando agenda…</div>
      </div>
    );
  }

  return (
    <div style={{ background:t.fundoGradiente, color:t.texto, minHeight:'100vh', fontFamily:"'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        input[type="date"], input[type="time"], input[type="number"] { color-scheme: ${tema === 'escuro' ? 'dark' : 'light'}; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 5px; }
        @media (prefers-reduced-motion: no-preference) {
          .modal-anim { animation: modalIn 0.16s ease-out; }
        }
        @keyframes modalIn { from { opacity:0; transform: scale(0.97) translateY(6px); } to { opacity:1; transform: scale(1) translateY(0); } }
      `}</style>
      <div style={{ height:4, background:`linear-gradient(90deg, ${PALETA.join(', ')})` }} />
      <Cabecalho
        t={t} tema={tema} setTema={setTema} avisos={avisos} sinoAberto={sinoAberto} setSinoAberto={setSinoAberto}
        onClickEvento={(ev)=>{ setSinoAberto(false); abrirEdicaoEvento(ev); }} getCategoria={getCategoria}
        onNovoEvento={()=>abrirNovoEvento()} sidebarAberta={sidebarAberta} setSidebarAberta={setSidebarAberta}
      />
      <div className="flex flex-col md:flex-row" style={{ maxWidth:1400, margin:'0 auto' }}>
        <BarraLateral
          t={t} cronogramas={cronogramas} categorias={categorias}
          onAlternarVisibilidade={alternarVisibilidadeCronograma} onRenomearCronograma={renomearCronograma}
          onExcluirCronograma={excluirCronograma} onAbrirImportar={()=>setModalImportar(true)}
          onSalvarCategoria={salvarCategoria} onExcluirCategoria={excluirCategoria}
          proximos={proximosEventos.slice(0,8)} onClickProximo={abrirEdicaoEvento}
          diasAviso={diasAviso} setDiasAviso={setDiasAviso} aberta={sidebarAberta}
        />
        <main className="flex-1 min-w-0" style={{ padding: '20px 18px' }}>
          <NavegacaoCalendario t={t} mesAtual={mesAtual} anoAtual={anoAtual} onAnterior={mesAnterior} onProximo={proximoMes} onHoje={irParaHoje} onNovoEvento={()=>abrirNovoEvento()} />
          <GradeCalendario t={t} mesAtual={mesAtual} anoAtual={anoAtual} eventosPorDia={eventosPorDia} getCategoria={getCategoria} onClickDia={(d)=>setModalDia(d)} onClickEvento={abrirEdicaoEvento} />
        </main>
      </div>

      {modalEvento && (
        <ModalEvento t={t} dados={modalEvento} categorias={categorias} cronogramas={cronogramas} onSalvar={salvarEvento} onExcluir={excluirEvento} onFechar={()=>setModalEvento(null)} onSalvarCategoria={salvarCategoria} />
      )}
      {modalImportar && (
        <ModalImportar t={t} categorias={categorias} onFechar={()=>setModalImportar(false)} onConfirmar={adicionarCronogramaComEventos} />
      )}
      {modalDia && (
        <ModalDia t={t} dataStr={modalDia} eventos={eventosPorDia[modalDia]||[]} getCategoria={getCategoria} getCronograma={getCronograma}
          onFechar={()=>setModalDia(null)} onClickEvento={(ev)=>{ setModalDia(null); abrirEdicaoEvento(ev); }} onNovoEvento={()=>{ const d=modalDia; setModalDia(null); abrirNovoEvento(d); }} />
      )}
    </div>
  );
}

const raizApp = ReactDOM.createRoot(document.getElementById('root'));
raizApp.render(<AgendaAcademica />);
