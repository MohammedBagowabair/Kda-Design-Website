import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { asset, useI18n } from './i18n'
import { useActiveSection, useDialogFlag, useMenu } from './hooks'
import { nowInKL } from './hours'
import { Reveal } from './Reveal'
import { BIZ, FLOORS, type Content } from './content'

const PITCH_WA = 'https://wa.me/601151198497'
const wa = (t: string) => `https://wa.me/${BIZ.wa}?text=${encodeURIComponent(t)}`
const FLOOR_IDS = FLOORS.map((f) => f.id)

function WaIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  )
}

function Eyebrow({ children, dark = false, floor }: { children: ReactNode; dark?: boolean; floor?: string }) {
  return (
    <p className={`eyebrow ${dark ? 'text-lilac' : 'text-lilac-ink'}`}>
      {floor && <span className={`grid h-7 min-w-7 place-items-center rounded-full border px-1.5 font-display text-[11px] font-bold tracking-normal ${dark ? 'border-amber/60 text-amber' : 'border-lilac-ink/40 text-lilac-ink'}`} aria-hidden>{floor}</span>}
      {children}
    </p>
  )
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className="flex items-baseline gap-2 text-mist">
      <span className={`font-display font-extrabold lowercase leading-none tracking-[-0.04em] ${small ? 'text-[24px]' : 'text-[30px]'}`}>kda</span>
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-mist/80">Design</span>
    </span>
  )
}

/** Lift-style display of the current floor (header). */
function FloorDisplay({ active }: { active: string }) {
  const { c } = useI18n<Content>()
  const f = FLOORS.find((x) => x.id === (active || 'top')) || FLOORS[0]
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-mist/15 bg-black/30 px-2.5" aria-live="polite">
      <span className="sr-only">{c.a11y.current}</span>
      <span className="text-[10px] text-amber" aria-hidden>▲</span>
      <span key={f.floor} className="floor-tick min-w-[2.2ch] font-display text-[15px] font-bold tabular-nums text-amber">{f.floor}</span>
      <span className="hidden text-[12px] font-medium text-mist/80 sm:inline">{c.floorNames[f.id]}</span>
    </span>
  )
}

function Header({ active, onMenu, menuOpen, btnRef }: { active: string; onMenu: () => void; menuOpen: boolean; btnRef: React.RefObject<HTMLButtonElement | null> }) {
  const { c, lang, setLang } = useI18n<Content>()
  return (
    <header className="sticky top-0 z-40 border-b border-mist/10 bg-night">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <a href="#top" className="tap flex items-center rounded-lg"><Logo small /></a>
        <nav aria-label={c.a11y.main} className="hidden items-center gap-7 lg:flex">
          {c.nav.map(([id, l]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={`nav-link py-2 text-[14px] font-medium transition hover:text-amber ${active === id ? 'text-amber' : 'text-mist/85'}`}>{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <FloorDisplay active={active} />
          <button data-lang-toggle onClick={() => setLang(lang === 'en' ? 'ms' : 'en')} aria-label={c.langAria} className="tap rounded-full border border-mist/20 px-3 text-xs font-bold tracking-wider text-mist transition hover:border-amber hover:text-amber">{c.langLabel}</button>
          <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" className="tap hidden items-center gap-2 rounded-full bg-amber px-4 text-sm font-semibold text-night transition hover:bg-mist md:inline-flex"><WaIcon className="h-4 w-4" />{c.waCta}</a>
          <button ref={btnRef} onClick={onMenu} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? c.a11y.menuClose : c.a11y.menuOpen} className="tap grid place-items-center rounded-full border border-mist/20 lg:hidden">
            <span className="relative block h-3 w-5" aria-hidden>
              <span className={`absolute left-0 h-[2px] w-5 bg-mist transition ${menuOpen ? 'top-[5px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-[5px] h-[2px] w-5 bg-mist transition ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-[2px] w-5 bg-mist transition ${menuOpen ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileMenu({ close, active }: { close: () => void; active: string }) {
  const { c } = useI18n<Content>()
  useDialogFlag()
  const floors = [...FLOORS].reverse()
  return (
    <div id="mobile-menu" role="dialog" aria-modal="true" aria-label={c.a11y.mobile} className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-night px-5 pb-10 pt-6 text-mist lg:hidden">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-lilac">{c.a11y.lift}</p>
      <nav aria-label={c.a11y.mobile} className="mt-4 grid grid-cols-2 gap-3">
        {floors.map((f) => (
          <a key={f.id} href={`#${f.id}`} onClick={close} aria-current={active === f.id ? 'true' : undefined} className={`flex min-h-[72px] items-center gap-3 rounded-2xl border px-4 transition ${active === f.id ? 'border-amber bg-amber/10' : 'border-mist/15 active:bg-mist/5'}`}>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border font-display text-[13px] font-bold ${active === f.id ? 'border-amber text-amber' : 'border-mist/30 text-mist'}`}>{f.floor}</span>
            <span className="font-display text-[17px] font-semibold">{c.floorNames[f.id]}</span>
          </a>
        ))}
      </nav>
      <div className="mt-8 flex flex-col gap-3">
        <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" className="tap inline-flex items-center justify-center gap-2 rounded-full bg-amber px-5 font-semibold text-night"><WaIcon />{c.waCta}</a>
        <a href={`tel:${BIZ.tel}`} className="tap inline-flex items-center justify-center rounded-full border border-mist/25 px-5 font-semibold">{c.studio.call} {BIZ.phone}</a>
      </div>
    </div>
  )
}

/** Desktop lift panel: one button per floor, current floor lit. */
function LiftPanel({ active }: { active: string }) {
  const { c } = useI18n<Content>()
  return (
    <nav aria-label={c.a11y.lift} className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 min-[1400px]:block">
      <ol className="flex flex-col-reverse gap-2 rounded-full border border-night/10 bg-mist/85 p-2 shadow-[0_18px_40px_-18px_rgba(25,26,51,.45)] backdrop-blur">
        {FLOORS.map((f) => {
          const on = (active || 'top') === f.id
          return (
            <li key={f.id}>
              <a href={`#${f.id}`} aria-current={on ? 'true' : undefined} title={c.floorNames[f.id]} className={`lift-btn grid h-11 w-11 place-items-center rounded-full border font-display text-[12px] font-bold transition ${on ? 'border-amber bg-night text-amber shadow-[0_0_0_3px_rgba(233,168,79,.25)]' : 'border-night/15 bg-mist text-night hover:border-night'}`}>
                <span aria-hidden>{f.floor}</span><span className="sr-only">{c.a11y.floor} {f.floor}, {c.floorNames[f.id]}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function Hero() {
  const { c, lang } = useI18n<Content>()
  return (
    <section id="top" className="relative isolate overflow-hidden bg-night text-mist">
      <picture>
        <source media="(max-width: 767px)" srcSet={asset('images/hero-m-640.webp')} width={640} height={854} />
        <img src={asset('images/hero-1400.webp')} srcSet={`${asset('images/hero-1400.webp')} 1400w, ${asset('images/hero-2000.webp')} 2000w`} sizes="100vw" width={2000} height={1334} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover object-[60%_center] opacity-90" />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/55 to-night/10" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/70 to-transparent md:from-night/80" aria-hidden />
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-end px-5 pb-12 pt-28 sm:px-8 lg:min-h-[640px] lg:pb-20">
        <Eyebrow dark floor="G">{c.hero.eyebrow}</Eyebrow>
        <h1 className={`mt-6 max-w-4xl font-display font-bold leading-[0.98] tracking-[-0.035em] ${lang === 'ms' ? 'text-[clamp(2.25rem,7.4vw,5.2rem)]' : 'text-[clamp(2.5rem,8vw,5.8rem)]'}`}>
          {c.hero.h1a} <span className="text-lilac">{c.hero.h1b}</span>
        </h1>
        <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-mist/85 sm:text-[17.5px]">{c.hero.sub}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#visit" className="tap inline-flex items-center justify-center gap-2 rounded-full bg-amber px-6 text-[15px] font-semibold text-night transition hover:bg-mist">{c.hero.cta}<span aria-hidden>↑</span></a>
          <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" className="tap inline-flex items-center justify-center gap-2 rounded-full border border-mist/30 px-6 text-[15px] font-semibold text-mist transition hover:border-mist"><WaIcon className="h-[18px] w-[18px]" />{c.hero.cta2}</a>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-mist/15 pt-5 text-[13px] text-mist/80">
          <a href={BIZ.maps} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg"><span className="font-display text-base font-bold text-mist">{BIZ.rating}</span><span className="text-amber" aria-hidden>★</span>{c.hero.rating} · {BIZ.reviews} {c.hero.reviewsWord}</a>
          <span>{c.hero.photo}</span>
        </div>
      </div>
    </section>
  )
}

const PlanIcon = ({ i }: { i: number }) => {
  const paths = [
    'M6 6h52v40H6z M6 26h22 M28 6v40 M40 26h18 M40 26v20',
    'M10 22L32 6l22 16v26H10z M10 30h44 M26 48V36h12v12',
    'M6 10h52v36H6z M14 18h14v8H14z M36 18h14v8H36z M14 34h14v6H14z M36 34h14v6H36z',
    'M8 14h48v28H8z M8 26h48 M20 14v28 M44 14v28 M14 42v6 M50 42v6',
  ]
  return <svg viewBox="0 0 64 52" className="h-12 w-14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden><path d={paths[i]} /></svg>
}

function Spaces() {
  const { c } = useI18n<Content>()
  return (
    <section id="spaces" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7"><Eyebrow floor="08">{c.spaces.eyebrow}</Eyebrow><h2 className="h2 mt-5">{c.spaces.title}</h2></div>
        <p className="text-[15.5px] leading-relaxed text-muted lg:col-span-4 lg:col-start-9">{c.spaces.note}</p>
      </div>
      <div className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-night/10 bg-night/10 sm:grid-cols-2 lg:grid-cols-4">
        {c.spaces.items.map(([t, d], i) => (
          <Reveal key={t} delay={i * 70} className="h-full">
            <article className="flex h-full flex-col bg-mist p-7 transition hover:bg-white/60">
              <span className="text-lilac-ink"><PlanIcon i={i} /></span>
              <h3 className="mt-8 font-display text-[21px] font-bold tracking-tight text-night">{t}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{d}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Views() {
  const { c } = useI18n<Content>()
  return (
    <section id="views" className="bg-mist-2">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><Eyebrow floor="16">{c.views.eyebrow}</Eyebrow><h2 className="h2 mt-5">{c.views.title}</h2></div>
          <p className="text-[15.5px] leading-relaxed text-muted lg:col-span-4 lg:col-start-9">{c.views.sub}</p>
        </div>
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {c.views.items.map((v, i) => (
            <Reveal key={v.img} delay={(i % 3) * 80} className="mb-5 break-inside-avoid">
              <figure className="group overflow-hidden rounded-[20px] bg-night">
                <div className="overflow-hidden">
                  <img src={asset(`images/${v.img}-560.webp`)} srcSet={`${asset(`images/${v.img}-560.webp`)} 560w, ${asset(`images/${v.img}-${v.w}.webp`)} ${v.w}w`} sizes="(min-width:1024px) 30vw, (min-width:640px) 46vw, 92vw" width={v.w} height={v.h} loading="lazy" decoding="async" alt={v.alt} className="w-full transition duration-700 group-hover:scale-[1.03]" />
                </div>
                <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-[13.5px] text-mist">
                  <span className="font-medium">{v.cap}</span>
                  <span className="shrink-0 rounded-full border border-mist/25 px-2 py-0.5 text-[11px] text-mist/80">{c.hero.photo}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  const { c } = useI18n<Content>()
  return (
    <section id="process" className="relative overflow-hidden bg-night text-mist">
      <div className="pointer-events-none absolute inset-0 shaft" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <Eyebrow dark floor="24">{c.process.eyebrow}</Eyebrow>
        <h2 className="h2 mt-5 max-w-3xl text-mist">{c.process.title}</h2>
        <ol className="mt-14 grid gap-4 lg:grid-cols-5 lg:items-end">
          {c.process.steps.map(([lv, t, d], i) => (
            <li key={lv} className="rounded-[20px] border border-mist/12 bg-night-2 p-6 lg:min-h-[var(--h)]" style={{ ['--h' as string]: `${220 + i * 46}px` }}>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-amber/70 font-display text-[13px] font-bold text-amber">{lv}</span>
              <h3 className="mt-6 font-display text-[19px] font-bold">{t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-dark">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[13px] text-muted-dark">{c.process.note}</p>
      </div>
    </section>
  )
}

function nextDays(lang: string) {
  const { day } = nowInKL()
  const base = new Date()
  const fmt = new Intl.DateTimeFormat(lang === 'ms' ? 'ms-MY' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kuala_Lumpur' })
  const fmtLong = new Intl.DateTimeFormat(lang === 'ms' ? 'ms-MY' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kuala_Lumpur' })
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base.getTime() + (i + 1) * 864e5)
    return { key: i, label: fmt.format(d), long: fmtLong.format(d), dow: (day + i + 1) % 7 }
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
    bring.length ? `${V.msgBring}: ${bring.sort().map((b) => V.brings[b]).join(', ')}` : '',
    '', V.msgEnd,
  ].filter((l, i, a) => l !== '' || (i > 0 && a[i - 1] !== '')).join('\n')
  const pill = (on: boolean) => `tap inline-flex items-center justify-center rounded-full border px-4 text-[14px] font-medium transition ${on ? 'border-night bg-night text-mist' : 'border-night/20 bg-white/50 text-night hover:border-night'}`
  return (
    <section id="visit" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
      <div className="max-w-2xl"><Eyebrow floor="30">{V.eyebrow}</Eyebrow><h2 className="h2 mt-5">{V.title}</h2><p className="mt-4 text-[16px] leading-relaxed text-muted">{V.sub}</p></div>
      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <div className="space-y-9 lg:col-span-7">
          <fieldset>
            <legend className="step">{V.day}</legend>
            <div className="mt-3 flex min-h-[48px] flex-wrap gap-2">
              {days.map((d) => (
                <label key={d.key} className={`radio ${pill(day === d.key)}`}>
                  <input type="radio" name="day" className="sr-only" checked={day === d.key} onChange={() => setDay(d.key)} />{d.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-9 sm:grid-cols-2">
            <fieldset>
              <legend className="step">{V.time}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {V.times.map((t, i) => (
                  <label key={t} className={`radio ${pill(time === i)}`}><input type="radio" name="time" className="sr-only" checked={time === i} onChange={() => setTime(i)} />{t}</label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="step">{V.bring}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {V.brings.map((t, i) => {
                  const on = bring.includes(i)
                  return <label key={t} className={`radio ${pill(on)}`}><input type="checkbox" className="sr-only" checked={on} onChange={() => setBring((b) => (on ? b.filter((x) => x !== i) : [...b, i]))} />{on ? '✓ ' : ''}{t}</label>
                })}
              </div>
            </fieldset>
          </div>
          <fieldset>
            <legend className="step">{V.type}</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {V.types.map((t, i) => (
                <label key={t} className={`radio ${pill(type === i)} justify-start`}><input type="radio" name="type" className="sr-only" checked={type === i} onChange={() => setType(i)} />{t}</label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-[24px] bg-night p-5 text-mist sm:p-6 lg:sticky lg:top-24">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-lilac">{V.preview}</p>
            <div className="mt-4 rounded-2xl rounded-tr-md bg-[#DCF8C6] p-4 text-[14.5px] leading-relaxed text-[#111B21] shadow-sm" aria-live="polite">
              <p className="whitespace-pre-line">{msg}</p>
            </div>
            <a href={wa(msg)} target="_blank" rel="noopener" className="tap mt-5 flex items-center justify-center gap-2 rounded-full bg-amber px-5 text-[15px] font-semibold text-night transition hover:bg-mist"><WaIcon />{V.send}</a>
            <p className="mt-3 text-center text-[12.5px] leading-snug text-muted-dark">{V.hint}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const { c } = useI18n<Content>()
  return (
    <section id="faq" className="border-t border-night/10 bg-mist-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-4"><Eyebrow floor="32">{c.faq.eyebrow}</Eyebrow><h2 className="h2 mt-5">{c.faq.title}</h2></div>
        <div className="divide-y divide-night/10 border-y border-night/10 lg:col-span-8">
          {c.faq.items.map(([q, a]) => (
            <details key={q} className="group">
              <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 py-4 font-display text-[17px] font-bold text-night sm:text-[18.5px]">
                {q}
                <span className="faq-i grid h-9 w-9 shrink-0 place-items-center rounded-full border border-night/20 text-lg transition" aria-hidden>+</span>
              </summary>
              <p className="max-w-2xl pb-6 text-[15.5px] leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Studio() {
  const { c } = useI18n<Content>()
  return (
    <section id="studio" className="relative overflow-hidden bg-night text-mist">
      <span className="pointer-events-none absolute -right-6 top-6 select-none font-display text-[clamp(9rem,30vw,22rem)] font-extrabold leading-none tracking-[-0.06em] text-mist/[0.05]" aria-hidden>33A</span>
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-6">
          <Eyebrow dark floor="33A">{c.studio.eyebrow}</Eyebrow>
          <h2 className="h2 mt-5 text-mist">{c.studio.title}</h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" className="tap inline-flex items-center justify-center gap-2 rounded-full bg-amber px-6 text-[15px] font-semibold text-night transition hover:bg-mist"><WaIcon />WhatsApp</a>
            <a href={`tel:${BIZ.tel}`} className="tap inline-flex items-center justify-center rounded-full border border-mist/30 px-6 text-[15px] font-semibold transition hover:border-mist">{c.studio.call} {BIZ.phone}</a>
          </div>
          <dl className="mt-12 grid gap-8 sm:grid-cols-2">
            <div><dt className="dt">{c.studio.address}</dt><dd className="mt-2 text-[15px] leading-relaxed">{BIZ.address}</dd></div>
            <div><dt className="dt">{c.studio.hours}</dt><dd className="mt-2 text-[15px] leading-relaxed">{c.studio.hoursText}</dd></div>
            <div className="sm:col-span-2"><dt className="dt">{c.studio.getting}</dt><dd className="mt-2 max-w-lg text-[15px] leading-relaxed text-mist/85">{c.studio.gettingText}</dd></div>
          </dl>
        </div>
        <div className="lg:col-span-6 lg:pt-10">
          <a href={BIZ.maps} target="_blank" rel="noopener" className="group block overflow-hidden rounded-[24px] border border-mist/12 bg-night-2">
            <svg viewBox="0 0 520 360" className="h-auto w-full" aria-hidden>
              <rect width="520" height="360" fill="#22244A" />
              <g stroke="#2E3160" strokeWidth="16" fill="none" strokeLinecap="round"><path d="M-10 300 L530 230" /><path d="M120 -10 L200 370" /><path d="M-10 120 C150 140 300 90 530 110" /></g>
              <g stroke="#B9B3DC" strokeWidth="3" fill="none" opacity=".55"><path d="M-10 196 L530 176" /><path d="M-10 206 L530 186" strokeDasharray="10 8" /></g>
              <text x="24" y="168" fill="#B9B3DC" fontSize="13" fontFamily="Albert Sans, sans-serif" opacity=".9">KL Sentral</text>
              <rect x="300" y="70" width="46" height="120" rx="6" fill="#191A33" stroke="#E9A84F" strokeWidth="2" />
              {[0, 1, 2, 3, 4, 5, 6].map((r) => <rect key={r} x="308" y={80 + r * 15} width="30" height="7" rx="2" fill={r === 0 ? '#E9A84F' : '#2E3160'} />)}
              <circle cx="323" cy="56" r="10" fill="#E9A84F" />
            </svg>
            <div className="flex items-center justify-between gap-4 p-5">
              <div><p className="font-display text-lg font-bold">Suasana Sentral Loft</p><p className="text-[13px] text-muted-dark">Jalan Stesen Sentral 5 · 50470 KL</p></div>
              <span className="shrink-0 rounded-full bg-amber px-3 py-1.5 text-[13px] font-semibold text-night transition group-hover:bg-mist">{c.studio.maps} ↗</span>
            </div>
          </a>
          <a href={BIZ.directions} target="_blank" rel="noopener" className="mt-4 inline-flex min-h-[44px] items-center text-[14.5px] font-semibold text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber">{c.studio.directions} ↗</a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { c } = useI18n<Content>()
  return (
    <footer className="bg-[#111226] text-mist">
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-14 sm:px-8 sm:pb-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div><Logo /><p className="mt-4 text-[14px] text-mist/75">{c.footer.tagline}</p></div>
          <ul className="grid gap-x-10 gap-y-2 text-[14.5px] sm:grid-cols-2">
            <li><a href={`tel:${BIZ.tel}`} className="inline-flex min-h-[44px] items-center hover:text-amber">{BIZ.phone}</a></li>
            <li><a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center gap-2 hover:text-amber"><WaIcon className="h-4 w-4" />WhatsApp</a></li>
            <li className="sm:col-span-2"><a href={BIZ.maps} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center hover:text-amber">{BIZ.address} ↗</a></li>
          </ul>
          <a href="#top" className="tap inline-flex items-center gap-2 self-start rounded-full border border-mist/20 px-5 text-sm font-semibold transition hover:border-amber hover:text-amber">{c.footer.toTop} <span aria-hidden>↑</span></a>
        </div>
        <p className="mt-12 text-[12.5px] text-mist/70">{c.footer.photos}</p>
        <div className="mt-6 flex flex-col gap-3 border-t border-mist/10 pt-6 text-[13px] text-mist/75 sm:flex-row sm:items-center sm:justify-between">
          <p>{c.footer.pitch}</p>
          <a href={PITCH_WA} target="_blank" rel="noopener" className="tap inline-flex shrink-0 items-center gap-2 font-semibold text-amber hover:text-mist"><WaIcon className="h-4 w-4" />{c.footer.pitchLink}</a>
        </div>
        <p className="mt-4 text-[12px] text-mist/60">© {new Date().getFullYear()} {BIZ.name}. {c.footer.rights}</p>
      </div>
    </footer>
  )
}

function Fab() {
  const { c } = useI18n<Content>()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.9)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <a href={wa(c.studio.waMsg)} target="_blank" rel="noopener" aria-label={c.a11y.fab} aria-hidden={!show} tabIndex={show ? 0 : -1} data-fab
      className={`fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-amber text-night shadow-[0_12px_30px_rgba(25,26,51,.4)] transition duration-300 md:hidden ${show ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}>
      <WaIcon className="h-6 w-6" />
    </a>
  )
}

export default function App() {
  const { c } = useI18n<Content>()
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const closeMenu = useCallback(() => setOpen(false), [])
  useMenu(open, closeMenu, btnRef)
  const ids = useMemo(() => FLOOR_IDS, [])
  const active = useActiveSection(ids)
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:text-night">{c.a11y.skip}</a>
      <Header active={active} onMenu={() => setOpen((o) => !o)} menuOpen={open} btnRef={btnRef} />
      {open && <MobileMenu close={closeMenu} active={active} />}
      <LiftPanel active={active} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Spaces />
        <Views />
        <Process />
        <Visit />
        <Faq />
        <Studio />
      </main>
      <Footer />
      <Fab />
    </>
  )
}
