import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigationType, useParams, useSearchParams } from 'react-router-dom';
import tickets from './data/ticketCapabilities.json';
import './ticket-capabilities.css';

type Ticket = typeof tickets[number];
function SampleImage({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return failed ? <span className="ticket-image-error" role="status">样张加载失败，请刷新后重试</span> : <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />;
}
function ImageViewer({ ticket, initial, close, opener }: { ticket: Ticket; initial: number; close: () => void; opener: HTMLElement | null }) {
  const [index, setIndex] = useState(initial);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = opener;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  function move(delta: number) { setIndex(i => (i + delta + ticket.samples.length) % ticket.samples.length); setZoom(1); }
  return <dialog className="ticket-viewer" ref={dialog} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }} onKeyDown={e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); move(e.key === 'ArrowLeft' ? -1 : 1); }
  }}>
    <div className="ticket-viewer-toolbar"><strong>{ticket.name} · 样张 {index + 1}/{ticket.samples.length}</strong><div>
      <button onClick={() => move(-1)} disabled={ticket.samples.length === 1}>上一张</button>
      <button onClick={() => move(1)} disabled={ticket.samples.length === 1}>下一张</button>
      <button aria-label="缩小" disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, z - .5))}>−</button>
      <button onClick={() => setZoom(1)}>{Math.round(zoom * 100)}% · 重置</button>
      <button aria-label="放大" disabled={zoom >= 4} onClick={() => setZoom(z => Math.min(4, z + .5))}>＋</button>
      <button autoFocus onClick={close}>关闭</button>
    </div></div>
    <div className="ticket-viewer-scroll"><div className="ticket-viewer-image" style={{ width: `${zoom * 100}%` }}><SampleImage src={ticket.samples[index].src} name={`${ticket.name}原始样张 ${index + 1}`} /></div></div>
  </dialog>;
}
export function TicketCapabilities({ header }: { header: React.ReactNode }) {
  const { code } = useParams();
  const location = useLocation();
  const navigationType = useNavigationType();
  const opener = useRef<HTMLElement | null>(null);
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const [sample, setSample] = useState(0);
  const [viewer, setViewer] = useState(false);
  useEffect(() => { setSample(0); setViewer(false); }, [code]);
  useEffect(() => { document.title = code ? `${tickets.find(t => t.code === code)?.name || '票根未找到'} · OCR 票根能力` : '票根识别能力查询 · OCR'; }, [code]);
  const ticket = tickets.find(t => t.code === code);
  const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = tickets.filter(t => { const text = [t.name, t.code, ...t.fields.flatMap(f => [f.name, f.description])].join(' ').toLowerCase(); return keywords.every(k => text.includes(k)); });
  const listUrl = `/ticket-capabilities${location.search}`;
  function rememberScroll() { sessionStorage.setItem(`ticket-list-scroll:${location.search}`, String(window.scrollY)); }
  useEffect(() => {
    if (!code && (navigationType === "POP" || (location.state as { ticketReturn?: boolean } | null)?.ticketReturn)) {
      const y = Number(sessionStorage.getItem(`ticket-list-scroll:${location.search}`) || 0);
      const timer = window.setTimeout(() => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior }), 100);
      return () => clearTimeout(timer);
    }
  }, [code, location.key, location.search, location.state, navigationType]);
  return <div className="ticket-page">{header}<main className="ticket-main">
    <nav className="ticket-breadcrumb" aria-label="当前位置"><Link to="/">OCR 主站</Link><span>/</span>{code ? <Link to={listUrl} state={{ ticketReturn: true }}>票根识别能力查询</Link> : <span>票根识别能力查询</span>}</nav>
    {code ? ticket ? <>
      <header className="ticket-heading"><Link to={listUrl} state={{ ticketReturn: true }}>← 返回票根列表</Link><h1>{ticket.name}</h1><p>票根码 <code>{ticket.code}</code> · 支持 {ticket.fields.length} 个识别字段 · {ticket.samples.length} 张样张</p></header>
      <div className="ticket-detail-grid"><section className="ticket-paper ticket-samples" aria-label="票根样张"><h2>票根样张</h2><button className="ticket-large-sample" onClick={e => { opener.current = e.currentTarget; setViewer(true); }} aria-label="放大查看原始样张"><SampleImage src={ticket.samples[sample]?.src || ticket.samples[0].src} name={`${ticket.name}样张 ${sample + 1}`} /><span>放大查看原始样张 ↗</span></button><div className="ticket-sample-switch">{ticket.samples.map((s, i) => <button aria-pressed={sample === i} key={s.imageId} onClick={() => setSample(i)}>样张 {i + 1}</button>)}</div></section>
      <section className="ticket-paper ticket-fields"><h2>支持的识别字段</h2><p>以下为此票根在原始表格中列明的字段及说明。</p><table><thead><tr><th>接口字段名</th><th>本票根字段说明</th></tr></thead><tbody>{ticket.fields.map(f => <tr key={f.sourceCell}><td><code>{f.name}</code></td><td>{f.description}</td></tr>)}</tbody></table></section></div>
      {viewer && <ImageViewer opener={opener.current} ticket={ticket} initial={sample} close={() => setViewer(false)} />}
    </> : <section className="ticket-paper"><h1>未找到该票根</h1><Link to="/ticket-capabilities">返回票根列表</Link></section> : <>
      <header className="ticket-heading"><h1>票根识别能力查询</h1><p>浏览已支持的票根样张与识别字段，了解现有 OCR 票根能力。</p><p className="ticket-scope">本目录仅展示已收录能力，不进行模型适配判断或识别效果评价。</p></header>
      <section className="ticket-paper ticket-search"><label htmlFor="ticket-search-input">检索票根</label><div><input id="ticket-search-input" type="search" placeholder="输入票根名称、票根码或字段关键词" value={query} onChange={e => { const next = new URLSearchParams(); if (e.target.value) next.set('q', e.target.value); setParams(next, { replace: true }); }} />{query && <button onClick={() => setParams({}, { replace: true })}>清空搜索</button>}</div><p aria-live="polite">共收录 22 种票根{query ? `，找到 ${results.length} 种` : '，默认展示全部票根'}</p></section>
      <div className="ticket-grid">{results.map(t => <article className="ticket-paper ticket-card" key={t.code}><Link to={`/ticket-capabilities/${t.code}${location.search}`} onClick={rememberScroll} className="ticket-card-image" aria-label={`查看${t.name}`}><SampleImage src={t.samples[0].thumbnail} name={t.name} /></Link><div className="ticket-card-copy"><h2><Link to={`/ticket-capabilities/${t.code}${location.search}`} onClick={rememberScroll}>{t.name}</Link></h2><p>票根码 <code>{t.code}</code><span>{t.samples.length} 张样张</span></p><p>{t.fields.length} 个识别字段</p></div></article>)}</div>
      {!results.length && <section className="ticket-paper ticket-empty"><h2>没有找到相关票根</h2><p>请尝试其他关键词，或浏览全部已收录票根。</p><button onClick={() => setParams({}, { replace: true })}>清空搜索</button></section>}
    </>}
    <footer className="ticket-footer"><p>在线识别测试正在开发中</p><small>数据来源：通用票根接口——所支持类型及字段讲解.xlsx</small><Link to="/">返回 OCR 主站</Link></footer>
  </main></div>;
}
