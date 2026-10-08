import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { asset, useI18n } from './i18n'
import { useActiveSection, useDialogFlag, useMenu } from './hooks'
import { BIZ, CREDITS, type Content } from './content'

const PITCH_WA = 'https://wa.me/601151198497'
const wa = (t: string) => `https://wa.me/${BIZ.wa}?text=${encodeURIComponent(t)}`
const pad = (n: number) => String(n).padStart(2, '0')

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
          <a href={wa(c.contact.waMsg)} target="_blank" rel="noopener" className="tap hidden items-center gap-2 rounded-full bg-lilac px-4 text-[14px] font-medium text-dusk transition hover:bg-linen sm:inline-flex"><WaIcon className="h-4 w-4" />{c.waCta}</a>
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
        <a href={wa(c.contact.waMsg)} target="_blank" rel="noopener" className="tap inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-lilac px-5 font-medium text-dusk"><WaIcon />{c.hero.cta}</a>
        <div className="grid grid-cols-2 gap-3">
          <a href={`tel:${BIZ.tel}`} className="tap inline-flex items-center justify-center rounded-full border border-linen/25 px-4 font-medium">{c.call}</a>
          <a href={BIZ.directions} target="_blank" rel="noopener" className="tap inline-flex items-center justify-center rounded-full border border-linen/25 px-4 font-medium">{c.directions}</a>
        </div>
        <p className="text-[14px] leading-snug text-linen/70">{BIZ.address}</p>
      </div>
    </div>
  )
}

function Rating({ className = '' }: { className?: string }) {
  const { c } = useI18n<Content>()
  return (
    <a href={BIZ.maps} target="_blank" rel="noopener" className={`inline-flex items-center gap-2 text-[14px] text-linen/80 hover:text-linen ${className}`}>
      <span className="serif text-[22px] leading-none text-linen">{BIZ.rating}</span><span className="text-candle" aria-hidden>★</span><span>{BIZ.reviews} {c.hero.reviewsWord}</span>
    </a>
  )
}

function Hero() {
  const { c, lang } = useI18n<Content>()
  const ms = lang === 'ms'
  return (
    <section id="top" className="on-dark relative bg-dusk text-linen">
      <div className="relative h-[min(58svh,500px)] min-h-[380px] overflow-hidden lg:h-[min(860px,calc(100svh-68px))] lg:min-h-[620px]">
        <picture>
          <source media="(min-width: 768px)" srcSet={`${asset('images/hero-1400.webp')} 1400w, ${asset('images/hero-1920.webp')} 1920w`} sizes="100vw" />
          <img src={asset('images/hero-m-560.webp')} srcSet={`${asset('images/hero-m-560.webp')} 560w, ${asset('images/hero-m-720.webp')} 720w`} sizes="100vw" width={720} height={900} alt={c.hero.photo} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/45 to-transparent lg:bg-[linear-gradient(to_top,#17151F_0%,rgba(23,21,31,.62)_38%,rgba(23,21,31,0)_66%),linear-gradient(to_right,rgba(23,21,31,.6),rgba(23,21,31,0)_58%)]" aria-hidden />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto grid max-w-[1320px] items-end gap-10 px-5 pb-6 sm:px-8 lg:grid-cols-12 lg:pb-14">
            <div className="lg:col-span-8">
              <p className="kicker text-linen [text-shadow:0_1px_10px_rgba(0,0,0,.75)]"><span className="h-px w-8 bg-lilac" aria-hidden />{c.hero.eyebrow}</p>
              <h1 className={`serif mt-4 leading-[.95] ${ms ? 'text-[clamp(2.4rem,10vw,3.6rem)] lg:text-[clamp(4rem,5.8vw,6.2rem)]' : 'text-[clamp(2.6rem,11vw,4rem)] lg:text-[clamp(4.4rem,6.6vw,7rem)]'}`}>
                {c.hero.h1a} <em className="text-lilac">{c.hero.h1b}</em>
              </h1>
              <p className="mt-6 hidden max-w-[36rem] text-[18px] leading-relaxed text-linen/85 lg:block">{c.hero.sub}</p>
              <div className="mt-8 hidden flex-wrap items-center gap-x-6 gap-y-3 lg:flex">
                <a href={wa(c.contact.waMsg)} target="_blank" rel="noopener" className="tap inline-flex h-[54px] items-center gap-3 rounded-full bg-lilac px-7 text-[16px] font-medium text-dusk transition hover:bg-linen"><WaIcon className="h-[18px] w-[18px]" />{c.hero.cta}</a>
                <a href={`tel:${BIZ.tel}`} className="inline-flex min-h-[44px] items-center text-[16px] text-linen underline decoration-linen/35 underline-offset-[6px] hover:decoration-lilac">{c.call} {BIZ.phone}</a>
              </div>
            </div>
            <div className="hidden lg:col-span-4 lg:block lg:justify-self-end">
              <div className="w-[270px] rounded-2xl border border-linen/20 bg-dusk/60 p-6 backdrop-blur-md">
                <p className="text-[11.5px] font-medium uppercase tracking-[0.3em] text-lilac">{ms ? 'Aras' : 'Level'}</p>
                <p className="serif mt-1 text-[88px] leading-[.85]">33A</p>
                <p className="mt-4 border-t border-linen/15 pt-4 text-[14px] leading-snug text-linen/85">Suasana Sentral Loft<br />Jalan Stesen Sentral 5<br />50470 Kuala Lumpur</p>
                <Rating className="mt-4" />
                <p className="mt-1 text-[13.5px] text-linen/70">{c.hero.appt}</p>
              </div>
            </div>
          </div>
        </div>
        <p className="absolute right-3 top-3 hidden max-w-[22rem] rounded-full bg-dusk/60 px-3 py-1 text-[11.5px] text-linen/85 backdrop-blur-sm lg:block"><a href={CREDITS.hero.url} target="_blank" rel="noopener" className="hover:text-lilac">{c.hero.credit}</a></p>
      </div>
      <div className="px-5 pb-9 pt-1 sm:px-8 lg:hidden">
        <p className="max-w-xl text-[16.5px] leading-relaxed text-linen/85">{c.hero.sub}</p>
        <div className="mt-6 grid gap-3 sm:flex">
          <a href={wa(c.contact.waMsg)} target="_blank" rel="noopener" className="tap flex h-[54px] items-center justify-center gap-3 rounded-full bg-lilac px-7 text-[16px] font-medium text-dusk"><WaIcon className="h-[18px] w-[18px]" />{c.hero.cta}</a>
          <a href={`tel:${BIZ.tel}`} className="tap flex h-[54px] items-center justify-center rounded-full border border-linen/25 px-7 text-[16px] font-medium">{c.call} {BIZ.phone}</a>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <Rating />
          <span className="text-[14px] text-linen/70">{c.hero.appt}</span>
        </div>
        <p className="mt-5 text-[12px] text-linen/60"><a href={CREDITS.hero.url} target="_blank" rel="noopener" className="underline decoration-linen/25 underline-offset-2">{c.hero.photo}. {c.hero.credit}</a></p>
      </div>
    </section>
  )
}

function Kicker({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={`kicker ${dark ? 'text-lilac' : 'text-lilac-ink'}`}><span className={`h-px w-10 ${dark ? 'bg-lilac/50' : 'bg-lilac-ink/40'}`} aria-hidden />{children}</p>
}

function Services() {
  const { c } = useI18n<Content>()
  const S = c.services
  return (
    <section id="services" className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Kicker>{S.kicker}</Kicker>
          <h2 className="h2 mt-5">{S.title}</h2>
          <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-ink-soft">{S.intro}</p>
          <ul className="mt-8 border-t border-ink/15">
            {S.items.map(([t, d]) => (
              <li key={t} className="border-b border-ink/15 py-5">
                <h3 className="serif text-[27px] leading-[1.1] sm:text-[30px]">{t}</h3>
                <p className="mt-1.5 text-[16px] leading-relaxed text-ink-soft">{d}</p>
              </li>
            ))}
          </ul>
          <a href={wa(c.contact.waMsg)} target="_blank" rel="noopener" className="mt-7 inline-flex min-h-[44px] items-center gap-2 text-[15.5px] font-medium text-lilac-ink underline decoration-lilac-ink/35 underline-offset-[6px] hover:decoration-lilac-ink"><WaIcon className="h-[18px] w-[18px]" />{c.hero.cta}</a>
        </div>
        <figure className="self-start lg:sticky lg:top-24 lg:col-span-7">
          <div className="grid grid-cols-5 items-start gap-3 sm:gap-5">
            <img src={asset('images/il-sofa-640.webp')} srcSet={`${asset('images/il-sofa-640.webp')} 640w, ${asset('images/il-sofa-1000.webp')} 1000w`} sizes="(min-width:1320px) 440px, (min-width:1024px) 34vw, 58vw" width={1000} height={667} loading="lazy" decoding="async" alt={S.sofaAlt} className="col-span-3 aspect-[4/5] w-full rounded-lg object-cover" />
            <img src={asset('images/il-dining-520.webp')} srcSet={`${asset('images/il-dining-520.webp')} 347w, ${asset('images/il-dining-760.webp')} 507w`} sizes="(min-width:1320px) 290px, (min-width:1024px) 22vw, 38vw" width={507} height={760} loading="lazy" decoding="async" alt={S.diningAlt} className="col-span-2 mt-10 aspect-[2/3] w-full rounded-lg object-cover sm:mt-24" />
          </div>
          <figcaption className="mt-3 text-[12.5px] text-ink-soft">{S.illus}</figcaption>
        </figure>
      </div>
    </section>
  )
}

function Approach() {
  const { c } = useI18n<Content>()
  const A = c.approach
  return (
    <section id="approach" className="bg-linen-2">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8"><Kicker>{A.kicker}</Kicker><h2 className="h2 mt-5 max-w-[16ch]">{A.title}</h2></div>
          <p className="max-w-sm text-[15.5px] leading-relaxed text-ink-soft lg:col-span-4 lg:justify-self-end">{A.note}</p>
        </div>
        <ol className="mt-12 grid lg:mt-16 lg:grid-cols-5 lg:gap-8">
          {A.steps.map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[56px_1fr] gap-3 border-t border-ink/15 py-5 lg:block lg:border-t-0 lg:py-0">
              <div className="lg:flex lg:items-center lg:gap-3">
                <span className="serif text-[34px] italic leading-none text-lilac-ink lg:text-[60px]">{pad(i + 1)}</span>
                <span className="hidden h-px flex-1 bg-ink/15 lg:block" aria-hidden />
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

function Faq() {
  const { c } = useI18n<Content>()
  return (
    <section id="faq" className="mx-auto grid max-w-[1320px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:py-28">
      <div className="lg:col-span-4"><Kicker>{c.faq.kicker}</Kicker><h2 className="h2 mt-5">{c.faq.title}</h2></div>
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

function Contact() {
  const { c } = useI18n<Content>()
  const C = c.contact
  const dt = 'text-[12.5px] font-medium uppercase tracking-[0.2em] text-lilac'
  const link = 'inline-flex min-h-[44px] items-center text-[15px] text-lilac underline decoration-lilac/40 underline-offset-4 hover:decoration-lilac'
  return (
    <section id="contact" className="on-dark bg-dusk text-linen">
      <figure className="relative">
        <img src={asset('images/view-800.webp')} srcSet={`${asset('images/view-800.webp')} 800w, ${asset('images/view-1400.webp')} 1400w`} sizes="100vw" width={1400} height={933} loading="lazy" decoding="async" alt={C.view} className="h-[240px] w-full object-cover sm:h-[340px] lg:h-[440px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-dusk/10 via-transparent to-dusk" aria-hidden />
        <figcaption className="mx-auto max-w-[1320px] px-5 pt-3 text-[12px] text-linen/60 sm:px-8"><a href={CREDITS.view.url} target="_blank" rel="noopener" className="hover:text-lilac">{C.view}. {C.viewCredit}</a></figcaption>
      </figure>
      <div className="mx-auto max-w-[1320px] px-5 pb-16 pt-10 sm:px-8 lg:pb-28 lg:pt-14">
        <Kicker dark>{C.kicker}</Kicker>
        <h2 className="h2 mt-5">{C.title}</h2>
        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12">
          <dl className="grid content-start gap-8 sm:grid-cols-2 lg:col-span-6">
            <div><dt className={dt}>{C.address}</dt><dd className="mt-2 text-[16px] leading-relaxed text-linen/90">{BIZ.addr.map((l) => <span key={l} className="block">{l}</span>)}
              <span className="mt-1 flex flex-wrap gap-x-5"><a href={BIZ.maps} target="_blank" rel="noopener" className={link}>{C.maps} ↗</a></span></dd></div>
            <div><dt className={dt}>{C.phone}</dt><dd className="mt-2"><a href={`tel:${BIZ.tel}`} className="serif text-[32px] leading-none text-linen hover:text-lilac">{BIZ.phone}</a>
              <span className="mt-4 flex flex-wrap gap-2">
                <a href={wa(C.waMsg)} target="_blank" rel="noopener" className="tap inline-flex items-center gap-2 rounded-full bg-lilac px-5 text-[15px] font-medium text-dusk transition hover:bg-linen"><WaIcon className="h-4 w-4" />{c.waCta}</a>
                <a href={`tel:${BIZ.tel}`} className="tap inline-flex items-center rounded-full border border-linen/25 px-5 text-[15px] transition hover:border-lilac">{c.call}</a>
              </span></dd></div>
            <div><dt className={dt}>{C.hours}</dt><dd className="mt-2 text-[16px] leading-relaxed text-linen/90">{C.hoursText}</dd></div>
            <div><dt className={dt}>{C.reviews}</dt><dd className="mt-2 text-[16px] leading-relaxed text-linen/90"><span className="serif text-[32px] leading-none">{BIZ.rating}</span> <span className="text-candle" aria-hidden>★</span> {C.reviewsText}
              <span className="block"><a href={BIZ.maps} target="_blank" rel="noopener" className={link}>{C.readReviews} ↗</a></span></dd></div>
            <div className="sm:col-span-2"><dt className={dt}>{C.getting}</dt><dd className="mt-2 max-w-xl text-[16px] leading-relaxed text-linen/90">{C.gettingText}</dd></div>
          </dl>
          <figure className="lg:col-span-6">
            <a href={BIZ.directions} target="_blank" rel="noopener" className="group relative block overflow-hidden rounded-xl border border-linen/15">
              <img src={asset('images/map-600.webp')} srcSet={`${asset('images/map-600.webp')} 600w, ${asset('images/map-900.webp')} 900w`} sizes="(min-width:1320px) 610px, (min-width:1024px) 46vw, 92vw" width={900} height={600} loading="lazy" decoding="async" alt={C.mapAlt} className="aspect-[3/2] w-full object-cover" />
              <svg viewBox="0 0 32 44" className="absolute left-1/2 top-1/2 h-11 w-8 -translate-x-1/2 -translate-y-full drop-shadow" role="img" aria-label={c.a11y.pin}><path d="M16 0C7.2 0 0 7 0 15.7 0 27.5 16 44 16 44s16-16.5 16-28.3C32 7 24.8 0 16 0z" fill="#17151F" /><circle cx="16" cy="15.5" r="6" fill="#C3B9F0" /></svg>
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-dusk/90 px-4 py-2 text-[14px] text-linen transition group-hover:bg-lilac group-hover:text-dusk">{c.directions} <Arrow className="h-4 w-4" /></span>
            </a>
            <figcaption className="mt-2 text-[12px] text-linen/60"><a href={CREDITS.osm} target="_blank" rel="noopener" className="hover:text-lilac">{C.mapCredit}</a></figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { c } = useI18n<Content>()
  const F = c.footer
  const h = 'text-[12px] font-medium uppercase tracking-[0.22em] text-lilac'
  const a = 'inline-flex min-h-[40px] items-center text-[15px] text-linen/85 hover:text-lilac'
  return (
    <footer className="on-dark border-t border-linen/10 bg-dusk-2 text-linen">
      <div className="mx-auto max-w-[1320px] px-5 pb-28 pt-14 sm:px-8 lg:pb-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-5">
            <Logo />
            <p className="mt-4 text-[15px] font-medium text-linen">{BIZ.name}</p>
            <p className="mt-1 max-w-xs text-[14.5px] leading-relaxed text-linen/75">{BIZ.address}</p>
            <a href={BIZ.maps} target="_blank" rel="noopener" className="mt-1 inline-flex min-h-[40px] items-center text-[14.5px] text-lilac underline decoration-lilac/40 underline-offset-4">{c.contact.maps} ↗</a>
          </div>
          <nav aria-label={F.explore} className="lg:col-span-3">
            <p className={h}>{F.explore}</p>
            <ul className="mt-3">{c.nav.map(([id, l]) => <li key={id}><a href={`#${id}`} className={a}>{l}</a></li>)}</ul>
          </nav>
          <div className="lg:col-span-4">
            <p className={h}>{F.reach}</p>
            <ul className="mt-3">
              <li><a href={`tel:${BIZ.tel}`} className={a}>{BIZ.phone}</a></li>
              <li><a href={wa(c.contact.waMsg)} target="_blank" rel="noopener" className={`${a} gap-2`}><WaIcon className="h-4 w-4" />WhatsApp</a></li>
              <li className="py-2 text-[15px] text-linen/75">{F.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-linen/10 pt-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-[13px] text-linen/70">© {new Date().getFullYear()} {BIZ.name}. {F.rights}</p>
          <a href="#top" className="inline-flex min-h-[40px] items-center gap-2 self-start text-[13.5px] text-linen/80 hover:text-lilac">{F.toTop}<Arrow dir="up" className="h-3.5 w-3.5" /></a>
        </div>
        <p className="mt-3 max-w-3xl text-[12px] leading-relaxed text-linen/60">{F.photos}</p>
        <p className="mt-3 text-[12px] leading-relaxed text-linen/60">{F.pitch} <a href={PITCH_WA} target="_blank" rel="noopener" className="inline-flex min-h-[24px] items-center underline decoration-linen/30 underline-offset-2 hover:text-lilac">{F.pitchLink}</a></p>
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
  const b = 'inline-flex h-12 items-center justify-center gap-2 rounded-full text-[15px] font-medium'
  return (
    <nav aria-label={c.a11y.bar} aria-hidden={!show} data-fab
      className={`on-dark fixed inset-x-0 bottom-0 z-30 border-t border-linen/10 bg-dusk/95 px-3 pb-[max(.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur transition duration-300 lg:hidden ${show ? '' : 'pointer-events-none translate-y-full opacity-0'}`}>
      <div className="mx-auto grid max-w-md grid-cols-[1.3fr_1fr_1fr] gap-2">
        <a href={wa(c.contact.waMsg)} target="_blank" rel="noopener" tabIndex={show ? 0 : -1} className={`${b} bg-lilac text-dusk`}><WaIcon className="h-[18px] w-[18px]" />{c.waCta}</a>
        <a href={`tel:${BIZ.tel}`} tabIndex={show ? 0 : -1} className={`${b} border border-linen/25 text-linen`}>{c.call}</a>
        <a href={BIZ.directions} target="_blank" rel="noopener" tabIndex={show ? 0 : -1} className={`${b} border border-linen/25 text-linen`}>{c.directions}</a>
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
        <Services />
        <Approach />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
