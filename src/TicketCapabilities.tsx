import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, Search } from 'lucide-react';
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
export function TicketCapabilities() {
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
  return <div className="ticket-page">
    <header className="ticket-topbar"><div className="ticket-shell">
      <Link className="ticket-brand" to="/ticket-capabilities"><span className="ticket-brand-mark">OCR</span><span>票根识别能力查询</span></Link>
      <nav aria-label="页面导航"><Link to="/">返回 OCR 主站</Link><a href="/interface-custom-guide/">模型自训练操作指南</a></nav>
    </div></header>
    <main>
    {code ? ticket ? <>
      <header className="ticket-detail-heading ticket-shell">
        <Link className="ticket-back" to={listUrl} state={{ ticketReturn: true }}><ArrowLeft size={16} />返回票根列表</Link>
        <div className="ticket-eyebrow">票根详情</div><h1>{ticket.name}</h1>
        <p>票根码 <code>{ticket.code}</code><span>·</span>{ticket.fields.length} 个识别字段<span>·</span>{ticket.samples.length} 张样张</p>
      </header>
      <div className="ticket-detail-grid ticket-shell">
        <section className="ticket-samples" aria-label="票根样张">
          <div className="ticket-section-heading"><h2>票根样张</h2><span>点击图片查看原图</span></div>
          <button className="ticket-large-sample" onClick={e => { opener.current = e.currentTarget; setViewer(true); }} aria-label="放大查看原始样张">
            <SampleImage src={ticket.samples[sample]?.src || ticket.samples[0].src} name={`${ticket.name}样张 ${sample + 1}`} />
            <span><Expand size={16} />放大查看原始样张</span>
          </button>
          <div className="ticket-sample-switch" aria-label="切换样张">{ticket.samples.map((s, i) => <button aria-pressed={sample === i} key={s.imageId} onClick={() => setSample(i)}>样张 {i + 1}</button>)}</div>
        </section>
        <section className="ticket-fields">
          <div className="ticket-section-heading"><h2>支持的识别字段</h2><span>{ticket.fields.length} 项</span></div>
          <p>对照样张，查看此票根支持提取的内容。</p>
          <table><thead><tr><th>本票根字段说明</th><th>接口字段名</th></tr></thead><tbody>{ticket.fields.map(f => <tr key={f.sourceCell}><td>{f.description}</td><td><code>{f.name}</code></td></tr>)}</tbody></table>
          <p className="ticket-field-source">字段及说明按原始表格保留，仅展示此票根已列明的识别能力。</p>
        </section>
      </div>
      {viewer && <ImageViewer opener={opener.current} ticket={ticket} initial={sample} close={() => setViewer(false)} />}
    </> : <section className="ticket-shell ticket-empty"><h1>未找到该票根</h1><Link to="/ticket-capabilities">返回票根列表</Link></section> : <>
      <header className="ticket-hero"><div className="ticket-shell">
        <div className="ticket-eyebrow">现有 OCR 能力 · 票根目录</div>
        <h1>票根识别能力查询</h1>
        <p className="ticket-lead">先看样张，再查字段。浏览 22 种已支持的票根，了解现有识别能力。</p>
        <div className="ticket-search">
          <label className="ticket-sr-only" htmlFor="ticket-search-input">检索票根</label>
          <div className="ticket-search-control"><Search size={20} aria-hidden="true" /><input id="ticket-search-input" type="search" placeholder="搜索票根名称、票根码或识别字段" value={query} onChange={e => { const next = new URLSearchParams(); if (e.target.value) next.set('q', e.target.value); setParams(next, { replace: true }); }} />{query && <button onClick={() => setParams({}, { replace: true })}>清空搜索</button>}</div>
          <p>例如：演唱会、湘超、电影、座位</p>
        </div>
      </div></header>
      <section className="ticket-catalog ticket-shell" aria-label="票根目录">
        <div className="ticket-catalog-heading"><div><div className="ticket-section-no">票根样张与识别字段</div><h2>{query ? '搜索结果' : '浏览全部票根'}</h2></div><p aria-live="polite">{query ? `找到 ${results.length} 种票根` : '22 种票根 · 25 张真实样张'}</p></div>
        <div className="ticket-grid">{results.map(t => <article className="ticket-card" key={t.code}>
          <div className="ticket-card-heading"><h3><Link to={`/ticket-capabilities/${t.code}${location.search}`} onClick={rememberScroll}>{t.name}</Link></h3><span>票根码 <code>{t.code}</code></span></div>
          <Link to={`/ticket-capabilities/${t.code}${location.search}`} onClick={rememberScroll} className="ticket-card-image" aria-label={`查看${t.name}`}><SampleImage src={t.samples[0].thumbnail} name={t.name} /></Link>
          <div className="ticket-card-copy"><p>{t.fields.length} 个识别字段<span>{t.samples.length} 张样张</span></p><Link to={`/ticket-capabilities/${t.code}${location.search}`} onClick={rememberScroll}>查看样张与字段<ArrowRight size={16} /></Link></div>
        </article>)}</div>
        {!results.length && <div className="ticket-empty"><h2>没有找到相关票根</h2><p>请尝试其他关键词，或浏览全部已收录票根。</p><button onClick={() => setParams({}, { replace: true })}>清空搜索</button></div>}
      </section>
    </>}
    <aside className="ticket-development"><div className="ticket-shell"><div><span className="ticket-section-no">后续能力</span><h2>在线识别测试</h2><p>正在开发中，未来可上传票根查看识别结果。</p></div><span className="ticket-development-status">开发中</span></div></aside>
    <footer className="ticket-footer ticket-shell"><div><p>本目录仅展示已收录能力，不进行模型适配判断或识别效果评价。</p><small>数据来源：通用票根接口——所支持类型及字段讲解.xlsx</small></div><Link to="/">返回 OCR 主站<ArrowRight size={16} /></Link></footer>
    </main></div>;
}
