import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { asset, useI18n } from './i18n'
import { useActiveSection, useDialogFlag, useMenu } from './hooks'
import { nowInKL } from './hours'
import { BIZ, type Content } from './content'

const PITCH_WA = 'https://wa.me/601151198497'
const wa = (t: string) => `https://wa.me/${BIZ.wa}?text=${encodeURIComponent(t)}`
const pad = (n: number) => String(n).padStart(2, '0')
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function WaIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  )
}
function Arrow({ className = 'h-4 w-4', dir = 'right' }: { className?: string; dir?: 'right' | 'left' | 'up' }) {
  const r = dir === 'left' ? 180 : dir === 'up' ? -90 : 0
  return <svg viewBox="0 0 20 20" className={className} style={{ transform: `rotate(${r}deg)` }} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3.5 10h13M11.5 5l5 5-5 5" /></svg>
}

function Kicker({ n, children, dark = false }: { n: number; children: ReactNode; dark?: boolean }) {
  return (
    <p className={`kicker ${dark ? 'text-lilac' : 'text-lilac-ink'}`}>
      <span className="serif text-[18px] italic normal-case tracking-normal">{pad(n)}</span><span className={`h-px w-10 ${dark ? 'bg-lilac/50' : 'bg-lilac-ink/40'}`} aria-hidden />{children}
    </p>
  )
}

function Logo() {
  return (
    <span className="flex items-baseline gap-2 text-linen">
      <span className="serif text-[32px] font-semibold lowercase leading-none tracking-[-0.03em]">kda</span>
      <span className="text-[10.5px] font-medium uppercase tracking-[0.34em] text-linen/80">Design</span>
    </span>
  )
}

function Header({ onMenu, menuOpen, btnRef }: { onMenu: () => void; menuOpen: boolean; btnRef: React.RefObject<HTMLButtonElement | null> }) {
  const { c, lang, setLang } = useI18n<Content>()
  const active = useActiveSection(c.nav.map(([id]) => id))
  return (
    <header className="on-dark sticky top-0 z-40 border-b border-linen/10 bg-dusk">
      <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between gap-3 px-5 sm:px-8 lg:h-[68px]">
        <a href="#top" className="tap flex items-center rounded-md"><Logo /></a>
        <nav aria-label={c.a11y.main} className="hidden items-center gap-8 lg:flex">
          {c.nav.map(([id, l]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={`nav-link py-3 text-[14.5px] transition hover:text-lilac ${active === id ? 'text-lilac' : 'text-linen/85'}`}>{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button data-lang-toggle onClick={() => setLang(lang === 'en' ? 'ms' : 'en')} aria-label={c.langAria} className="tap rounded-full px-2 text-[13px] font-semibold tracking-[0.12em] text-linen transition hover:text-lilac">{c.langLabel}</button>
          <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" className="tap hidden items-center gap-2 rounded-full bg-lilac px-4 text-[14px] font-medium text-dusk transition hover:bg-linen sm:inline-flex"><WaIcon className="h-4 w-4" />{c.waCta}</a>
          <button ref={btnRef} onClick={onMenu} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? c.a11y.menuClose : c.a11y.menuOpen} className="tap -mr-2 grid place-items-center rounded-full lg:hidden">
            <span className="relative block h-3 w-6" aria-hidden>
              <span className={`absolute left-0 h-px w-6 bg-linen transition ${menuOpen ? 'top-[6px] rotate-45' : 'top-0.5'}`} />
              <span className={`absolute right-0 h-px bg-linen transition-all ${menuOpen ? 'top-[6px] w-6 -rotate-45' : 'top-[10px] w-4'}`} />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileMenu({ close }: { close: () => void }) {
  const { c } = useI18n<Content>()
  useDialogFlag()
  return (
    <div id="mobile-menu" role="dialog" aria-modal="true" aria-label={c.a11y.mobile} className="on-dark fixed inset-x-0 bottom-0 top-14 z-30 flex flex-col overflow-y-auto bg-dusk px-5 pb-8 pt-4 text-linen lg:hidden">
      <nav aria-label={c.a11y.mobile}>
        {c.nav.map(([id, l], i) => (
          <a key={id} href={`#${id}`} onClick={close} className="flex min-h-[64px] items-baseline gap-4 border-b border-linen/10 py-3 active:text-lilac">
            <span className="serif w-7 text-[17px] italic text-lilac">{pad(i + 1)}</span>
            <span className="serif text-[36px] leading-none">{l}</span>
          </a>
        ))}
      </nav>
      <div className="mt-auto grid gap-3 pt-8">
        <a href="#visit" onClick={close} className="tap inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-lilac px-5 font-medium text-dusk">{c.hero.cta}<Arrow /></a>
        <div className="grid grid-cols-2 gap-3">
          <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" className="tap inline-flex items-center justify-center gap-2 rounded-full border border-linen/25 px-4 font-medium"><WaIcon />{c.waCta}</a>
          <a href={`tel:${BIZ.tel}`} className="tap inline-flex items-center justify-center rounded-full border border-linen/25 px-4 font-medium">{c.studio.call}</a>
        </div>
      </div>
    </div>
  )
}

function Rating({ className = '' }: { className?: string }) {
  const { c } = useI18n<Content>()
  return (
    <a href={BIZ.maps} target="_blank" rel="noopener" className={`inline-flex items-center gap-2 text-[14px] text-linen/80 hover:text-linen ${className}`}>
      <span className="serif text-[22px] leading-none text-linen">{BIZ.rating}</span><span className="text-candle" aria-hidden>★</span>{BIZ.reviews} {c.hero.reviewsWord}
    </a>
  )
}

function Hero() {
  const { c, lang } = useI18n<Content>()
  const ms = lang === 'ms'
  return (
    <section id="top" className="on-dark relative bg-dusk text-linen">
      <div className="relative h-[min(60svh,520px)] min-h-[400px] overflow-hidden lg:h-[min(900px,calc(100svh-68px))] lg:min-h-[640px]">
        <picture>
          <source media="(min-width: 768px)" srcSet={`${asset('images/hero-1400.webp')} 1400w, ${asset('images/hero-2000.webp')} 2000w`} sizes="100vw" />
          <img src={asset('images/hero-m-560.webp')} srcSet={`${asset('images/hero-m-560.webp')} 560w, ${asset('images/hero-m-720.webp')} 720w`} sizes="100vw" width={800} height={962} alt="Living room with a green sofa beside floor-to-ceiling windows and city towers" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[60%_center] md:object-center" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/35 to-transparent lg:bg-[linear-gradient(to_top,#17151F_0%,rgba(23,21,31,.55)_38%,rgba(23,21,31,0)_70%),linear-gradient(to_right,rgba(23,21,31,.55),rgba(23,21,31,0)_60%)]" aria-hidden />
        <p className="absolute right-4 top-4 rounded-full bg-dusk/60 px-3 py-1 text-[12px] text-linen/90 backdrop-blur-sm">{c.hero.photo}</p>
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto grid max-w-[1320px] items-end gap-10 px-5 pb-6 sm:px-8 lg:grid-cols-12 lg:pb-16">
            <div className="lg:col-span-8">
              <p className="kicker text-lilac"><span className="h-px w-8 bg-lilac/60" aria-hidden />{c.hero.eyebrow}</p>
              <h1 className={`serif mt-4 leading-[.94] ${ms ? 'text-[clamp(2.5rem,10.4vw,3.8rem)] lg:text-[clamp(4.2rem,6.2vw,6.6rem)]' : 'text-[clamp(2.8rem,12vw,4.2rem)] lg:text-[clamp(4.6rem,7vw,7.4rem)]'}`}>
                {c.hero.h1a} <em className="text-lilac">{c.hero.h1b}</em>
              </h1>
              <p className="mt-6 hidden max-w-[34rem] text-[18px] leading-relaxed text-linen/85 lg:block">{c.hero.sub}</p>
              <div className="mt-9 hidden items-center gap-6 lg:flex">
                <a href="#visit" className="group tap inline-flex h-[54px] items-center gap-3 rounded-full bg-lilac px-7 text-[16px] font-medium text-dusk transition hover:bg-linen">{c.hero.cta}<Arrow className="h-4 w-4 transition group-hover:translate-x-1" /></a>
                <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center gap-2 text-[15.5px] text-linen underline decoration-linen/35 underline-offset-[6px] hover:decoration-lilac"><WaIcon className="h-[18px] w-[18px]" />{c.hero.cta2}</a>
              </div>
            </div>
            <div className="hidden lg:col-span-4 lg:block lg:justify-self-end">
              <div className="w-[260px] rounded-2xl border border-linen/20 bg-dusk/55 p-6 backdrop-blur-md">
                <p className="text-[11.5px] font-medium uppercase tracking-[0.3em] text-lilac">{ms ? 'Aras' : 'Level'}</p>
                <p className="serif mt-1 text-[96px] leading-[.85]">33A</p>
                <p className="mt-4 border-t border-linen/15 pt-4 text-[14px] leading-snug text-linen/85">{c.hero.plaque}<br />Jalan Stesen Sentral 5, KL</p>
                <Rating className="mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 pb-9 pt-1 sm:px-8 lg:hidden">
        <p className="max-w-xl text-[16.5px] leading-relaxed text-linen/85">{c.hero.sub}</p>
        <a href="#visit" className="tap mt-6 flex h-[54px] items-center justify-center gap-3 rounded-full bg-lilac px-7 text-[16px] font-medium text-dusk sm:inline-flex">{c.hero.cta}<Arrow /></a>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center gap-2 text-[15px] text-linen underline decoration-linen/35 underline-offset-[6px]"><WaIcon className="h-[18px] w-[18px]" />{c.hero.cta2}</a>
          <Rating />
        </div>
      </div>
    </section>
  )
}

function Spaces() {
  const { c } = useI18n<Content>()
  return (
    <section id="spaces" className="mx-auto grid max-w-[1320px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:py-28">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <Kicker n={1}>{c.spaces.kicker}</Kicker>
          <h2 className="h2 mt-5">{c.spaces.title}</h2>
          <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-ink-soft">{c.spaces.note}</p>
          <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-[15.5px] font-medium text-lilac-ink underline decoration-lilac-ink/35 underline-offset-[6px] hover:decoration-lilac-ink"><WaIcon className="h-[18px] w-[18px]" />{c.hero.cta2}</a>
        </div>
      </div>
      <ol className="border-t border-ink/15 lg:col-span-7">
        {c.spaces.items.map(([t, d], i) => (
          <li key={t} className="group grid grid-cols-[48px_1fr] gap-3 border-b border-ink/15 py-6 transition sm:grid-cols-[80px_1fr] sm:py-8">
            <span className="serif text-[26px] italic leading-none text-lilac-ink sm:text-[34px]">{pad(i + 1)}</span>
            <div className="transition duration-500 group-hover:translate-x-1.5">
              <h3 className="serif text-[30px] leading-[1.05] sm:text-[38px]">{t}</h3>
              <p className="mt-2 max-w-lg text-[16px] leading-relaxed text-ink-soft">{d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Mood() {
  const { c } = useI18n<Content>()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<'start' | 'mid' | 'end'>('start')
  const onScroll = () => { const el = ref.current; if (!el) return; setPos(el.scrollLeft < 8 ? 'start' : el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 ? 'end' : 'mid') }
  const go = (d: number) => { const el = ref.current; if (el) el.scrollBy({ left: d * Math.min(el.clientWidth * 0.7, 640), behavior: reduced() ? 'auto' : 'smooth' }) }
  const btn = 'tap grid h-12 w-12 place-items-center rounded-full border border-linen/25 text-linen transition hover:bg-linen hover:text-dusk disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-linen'
  return (
    <section id="moodboard" className="on-dark overflow-hidden bg-dusk py-16 text-linen lg:py-28">
      <div className="mx-auto grid max-w-[1320px] gap-6 px-5 sm:px-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7"><Kicker n={2} dark>{c.mood.kicker}</Kicker><h2 className="h2 mt-5">{c.mood.title}</h2></div>
        <div className="flex items-end justify-between gap-6 lg:col-span-5">
          <p className="max-w-sm text-[15.5px] leading-relaxed text-dusk-soft">{c.mood.sub}</p>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button type="button" onClick={() => go(-1)} disabled={pos === 'start'} aria-label={c.a11y.prev} className={btn}><Arrow dir="left" /></button>
            <button type="button" onClick={() => go(1)} disabled={pos === 'end'} aria-label={c.a11y.next} className={btn}><Arrow /></button>
          </div>
        </div>
      </div>
      <div ref={ref} onScroll={onScroll} role="region" aria-label={c.a11y.gallery} tabIndex={0} className="rail bleed mt-10 overflow-x-auto lg:mt-14">
        <ul className="flex gap-4 lg:gap-6">
          {c.mood.items.map((m) => (
            <li key={m.img} className="shrink-0">
              <figure className="frame">
                <div className="overflow-hidden rounded-lg bg-dusk-2">
                  <img src={asset(`images/${m.img}-h420.webp`)} srcSet={`${asset(`images/${m.img}-h420.webp`)} ${Math.round(m.w * 420 / 760)}w, ${asset(`images/${m.img}-h760.webp`)} ${m.w}w`} sizes={`(min-width:1024px) ${Math.round(m.w * 520 / 760)}px, ${Math.round(m.w * 380 / 760)}px`} width={m.w} height={m.h} loading="lazy" decoding="async" alt={m.alt} className="h-[380px] w-auto max-w-none object-cover lg:h-[520px]" />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-[13px] text-dusk-soft"><span className="serif text-[20px] italic text-linen">{m.cap}</span>{c.hero.photo}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Process() {
  const { c } = useI18n<Content>()
  return (
    <section id="process" className="bg-linen-2">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8"><Kicker n={3}>{c.process.kicker}</Kicker><h2 className="h2 mt-5 max-w-[16ch]">{c.process.title}</h2></div>
          <p className="max-w-sm text-[15.5px] leading-relaxed text-ink-soft lg:col-span-4 lg:justify-self-end">{c.process.note}</p>
        </div>
        <ol className="mt-12 grid lg:mt-16 lg:grid-cols-5 lg:gap-8">
          {c.process.steps.map(([t, d], i) => (
            <li key={t} className="group grid grid-cols-[56px_1fr] gap-3 border-t border-ink/15 py-5 lg:block lg:border-t-0 lg:py-0">
              <div className="lg:flex lg:items-center lg:gap-3">
                <span className="serif text-[34px] italic leading-none text-lilac-ink lg:text-[64px]">{pad(i + 1)}</span>
                <span className="hidden h-px flex-1 bg-ink/15 transition-colors duration-500 group-hover:bg-lilac-ink lg:block" aria-hidden />
              </div>
              <div className="lg:mt-6">
                <h3 className="serif text-[26px] leading-[1.05] lg:text-[28px]">{t}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function nextDays(lang: string) {
  const { day } = nowInKL()
  const base = new Date()
  const loc = lang === 'ms' ? 'ms-MY' : 'en-GB'
  const wd = new Intl.DateTimeFormat(loc, { weekday: 'short', timeZone: 'Asia/Kuala_Lumpur' })
  const dm = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'short', timeZone: 'Asia/Kuala_Lumpur' })
  const fmtLong = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kuala_Lumpur' })
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base.getTime() + (i + 1) * 864e5)
    return { key: i, wd: wd.format(d), dm: dm.format(d), long: fmtLong.format(d), dow: (day + i + 1) % 7 }
  })
}

function Visit() {
  const { c, lang } = useI18n<Content>()
  const V = c.visit
  const [days, setDays] = useState<ReturnType<typeof nextDays>>([])
  useEffect(() => { setDays(nextDays(lang)) }, [lang])
  const [day, setDay] = useState(-1)
  const [time, setTime] = useState(-1)
  const [type, setType] = useState(-1)
  const [bring, setBring] = useState<number[]>([0])
  const msg = [
    V.msgHi, '',
    `${V.msgDay}: ${day >= 0 && days[day] ? days[day].long : V.any}`,
    `${V.msgTime}: ${time >= 0 ? V.times[time] : V.any}`,
    type >= 0 ? `${V.msgType}: ${V.types[type]}` : '',
    bring.length ? `${V.msgBring}: ${[...bring].sort().map((b) => V.brings[b]).join(', ')}` : '',
    '', V.msgEnd,
  ].filter((l, i, a) => l !== '' || (i > 0 && a[i - 1] !== '')).join('\n')
  const pill = (on: boolean) => `radio tap inline-flex items-center justify-center rounded-full border px-4 text-[14.5px] transition ${on ? 'border-lilac bg-lilac text-dusk' : 'border-linen/25 text-linen hover:border-linen/60'}`
  const legend = 'text-[12.5px] font-medium uppercase tracking-[0.2em] text-lilac'
  return (
    <section id="visit" className="on-dark relative overflow-hidden bg-dusk text-linen">
      <img src={asset('images/sky-900.webp')} srcSet={`${asset('images/sky-900.webp')} 900w, ${asset('images/sky-1600.webp')} 1600w`} sizes="100vw" width={1600} height={800} loading="lazy" decoding="async" alt="" className="absolute inset-x-0 top-0 h-[520px] w-full object-cover opacity-60 lg:h-[680px]" />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-dusk/40 via-dusk/70 to-dusk lg:h-[680px]" aria-hidden />
      <div className="relative mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <Kicker n={4} dark>{V.kicker}</Kicker>
            <h2 className="h2 mt-5">{V.title}</h2>
            <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-linen/80">{V.sub}</p>
            <div className="mt-10 space-y-8">
              <fieldset>
                <legend className={legend}>{V.day}</legend>
                <div role="region" aria-label={V.days} tabIndex={0} className="rail -mx-5 mt-3 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0">
                  <ul className="flex min-h-[64px] gap-2 sm:flex-wrap">
                    {days.map((d) => (
                      <li key={d.key} className="shrink-0">
                        <label className={`radio flex h-16 w-[76px] cursor-pointer flex-col items-center justify-center rounded-xl border transition ${day === d.key ? 'border-lilac bg-lilac text-dusk' : 'border-linen/25 hover:border-linen/60'}`}>
                          <input type="radio" name="day" className="sr-only" checked={day === d.key} onChange={() => setDay(d.key)} />
                          <span className="text-[12.5px] uppercase tracking-[0.12em]">{d.wd}</span><span className="serif text-[21px] leading-tight">{d.dm}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </fieldset>
              <div className="grid gap-8 sm:grid-cols-2">
                <fieldset>
                  <legend className={legend}>{V.time}</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {V.times.map((t, i) => <label key={t} className={pill(time === i)}><input type="radio" name="time" className="sr-only" checked={time === i} onChange={() => setTime(i)} />{t}</label>)}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className={legend}>{V.bring}</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {V.brings.map((t, i) => {
                      const on = bring.includes(i)
                      return <label key={t} className={pill(on)}><input type="checkbox" className="sr-only" checked={on} onChange={() => setBring((b) => (on ? b.filter((x) => x !== i) : [...b, i]))} />{on ? '✓ ' : ''}{t}</label>
                    })}
                  </div>
                </fieldset>
              </div>
              <fieldset>
                <legend className={legend}>{V.type}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {V.types.map((t, i) => <label key={t} className={pill(type === i)}><input type="radio" name="type" className="sr-only" checked={type === i} onChange={() => setType(i)} />{t}</label>)}
                </div>
              </fieldset>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-5 lg:pt-24">
            <div className="rounded-2xl border border-linen/15 bg-dusk-2/85 p-5 backdrop-blur-md sm:p-7 lg:sticky lg:top-24">
              <p className="flex items-center gap-2 text-[12.5px] font-medium uppercase tracking-[0.2em] text-lilac"><WaIcon className="h-4 w-4" />{V.preview}</p>
              <div className="mt-4 rounded-2xl rounded-tl-sm bg-linen p-5 text-[15px] leading-relaxed text-ink" aria-live="polite">
                <p className="whitespace-pre-line">{msg}</p>
              </div>
              <a href={wa(msg)} target="_blank" rel="noopener" className="tap mt-5 flex h-[52px] items-center justify-center gap-2 rounded-full bg-lilac px-5 text-[15.5px] font-medium text-dusk transition hover:bg-linen"><WaIcon />{V.send}</a>
              <p className="mt-3 text-center text-[13px] leading-snug text-dusk-soft">{V.hint}</p>
            </div>
          </div>
        </div>
        <Studio />
      </div>
    </section>
  )
}

function Studio() {
  const { c, lang } = useI18n<Content>()
  const S = c.studio
  const dt = 'text-[12.5px] font-medium uppercase tracking-[0.2em] text-lilac'
  return (
    <div id="studio" className="mt-20 grid gap-10 border-t border-linen/15 pt-12 lg:mt-28 lg:grid-cols-12 lg:pt-16">
      <div className="lg:col-span-4">
        <p className="text-[12.5px] font-medium uppercase tracking-[0.3em] text-lilac">{lang === 'ms' ? 'Aras' : 'Level'}</p>
        <p className="serif text-[120px] leading-[.82] lg:text-[160px]">33A</p>
        <h2 className="serif mt-4 text-[34px] leading-none">{S.title}</h2>
      </div>
      <dl className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:pt-4">
        <div><dt className={dt}>{S.address}</dt><dd className="mt-2 text-[16px] leading-relaxed text-linen/90">{BIZ.address}
          <span className="mt-2 flex flex-wrap gap-x-5">
            <a href={BIZ.maps} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center text-[15px] text-lilac underline decoration-lilac/40 underline-offset-4 hover:decoration-lilac">{S.maps} ↗</a>
            <a href={BIZ.directions} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center text-[15px] text-lilac underline decoration-lilac/40 underline-offset-4 hover:decoration-lilac">{S.directions} ↗</a>
          </span></dd></div>
        <div><dt className={dt}>{S.phone}</dt><dd className="mt-2"><a href={`tel:${BIZ.tel}`} className="serif text-[34px] leading-none text-linen hover:text-lilac">{BIZ.phone}</a>
          <a href={wa(S.waMsg)} target="_blank" rel="noopener" className="mt-2 flex min-h-[44px] w-fit items-center gap-2 text-[15px] text-lilac underline decoration-lilac/40 underline-offset-4 hover:decoration-lilac"><WaIcon className="h-4 w-4" />{c.waCta}</a></dd></div>
        <div><dt className={dt}>{S.hours}</dt><dd className="mt-2 text-[16px] leading-relaxed text-linen/90">{S.hoursText}</dd></div>
        <div><dt className={dt}>{S.getting}</dt><dd className="mt-2 text-[16px] leading-relaxed text-linen/90">{S.gettingText}</dd></div>
      </dl>
    </div>
  )
}

function Faq() {
  const { c } = useI18n<Content>()
  return (
    <section id="faq" className="mx-auto grid max-w-[1320px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:py-28">
      <div className="lg:col-span-4"><Kicker n={5}>{c.faq.kicker}</Kicker><h2 className="h2 mt-5">{c.faq.title}</h2></div>
      <div className="border-t border-ink/15 lg:col-span-8">
        {c.faq.items.map(([q, a]) => (
          <details key={q} className="border-b border-ink/15">
            <summary className="serif flex min-h-[68px] cursor-pointer items-center justify-between gap-6 py-4 text-[23px] leading-tight transition hover:text-lilac-ink sm:text-[27px]">
              {q}
              <span className="faq-i grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/20 font-sans text-xl font-light transition" aria-hidden>+</span>
            </summary>
            <p className="max-w-2xl pb-7 text-[16.5px] leading-relaxed text-ink-soft">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  const { c } = useI18n<Content>()
  return (
    <footer className="on-dark bg-dusk text-linen">
      <div className="mx-auto max-w-[1320px] px-5 pb-28 pt-14 sm:px-8 lg:pb-12">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div><Logo /><p className="mt-4 text-[14.5px] text-linen/75">{c.footer.tagline}</p></div>
          <a href="#top" className="tap inline-flex items-center gap-2 self-start rounded-full border border-linen/25 px-5 text-[14px] transition hover:border-lilac hover:text-lilac sm:self-auto">{c.footer.toTop}<Arrow dir="up" /></a>
        </div>
        <p className="mt-10 text-[13px] text-linen/65">{c.footer.photos}</p>
        <div className="mt-5 flex flex-col gap-3 border-t border-linen/10 pt-5 text-[13.5px] text-linen/75 sm:flex-row sm:items-center sm:justify-between">
          <p>{c.footer.pitch}</p>
          <a href={PITCH_WA} target="_blank" rel="noopener" className="tap inline-flex shrink-0 items-center gap-2 text-lilac hover:text-linen"><WaIcon className="h-4 w-4" />{c.footer.pitchLink}</a>
        </div>
        <p className="mt-3 text-[12.5px] text-linen/60">© {new Date().getFullYear()} {BIZ.name}. {c.footer.rights}</p>
      </div>
    </footer>
  )
}

function MobileBar() {
  const { c } = useI18n<Content>()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.7)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <nav aria-label={c.a11y.bar} aria-hidden={!show} data-fab
      className={`on-dark fixed inset-x-0 bottom-0 z-30 border-t border-linen/10 bg-dusk/95 px-3 pb-[max(.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur transition duration-300 lg:hidden ${show ? '' : 'pointer-events-none translate-y-full opacity-0'}`}>
      <div className="mx-auto grid max-w-md grid-cols-[1fr_auto] gap-2">
        <a href="#visit" tabIndex={show ? 0 : -1} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-lilac text-[15.5px] font-medium text-dusk">{c.hero.cta}<Arrow /></a>
        <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" tabIndex={show ? 0 : -1} aria-label={c.waCta} className="grid h-12 w-12 place-items-center rounded-full border border-linen/25 text-linen"><WaIcon /></a>
      </div>
    </nav>
  )
}

export default function App() {
  const { c } = useI18n<Content>()
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const closeMenu = useCallback(() => setOpen(false), [])
  useMenu(open, closeMenu, btnRef)
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-lilac focus:px-4 focus:py-2 focus:text-dusk">{c.a11y.skip}</a>
      <Header onMenu={() => setOpen((o) => !o)} menuOpen={open} btnRef={btnRef} />
      {open && <MobileMenu close={closeMenu} />}
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Spaces />
        <Mood />
        <Process />
        <Visit />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
