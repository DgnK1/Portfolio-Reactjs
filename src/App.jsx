import { useEffect, useRef, useState } from 'react'
import heroImage from './assets/profile-picture.png'
import githubImage from './assets/github.png'
import projectCode from './assets/kpc-store.png'
import projectHome from './assets/ttv-web.png'
import projectPortrait from './assets/soaris-mobile-app.png'

function App() {
  const [isIdleVisible, setIsIdleVisible] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [formStatus, setFormStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isIdleVisibleRef = useRef(false)

  useEffect(() => {
    isIdleVisibleRef.current = isIdleVisible
  }, [isIdleVisible])

  useEffect(() => {
    let idleTimer

    const scheduleIdle = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => setIsIdleVisible(true), 5000)
    }

    const handleActivity = () => {
      if (!isIdleVisibleRef.current) {
        scheduleIdle()
      }
    }

    const updateScrollState = () => {
      const scrolled = window.innerHeight + window.scrollY
      const maxScroll = document.documentElement.scrollHeight
      setIsAtBottom(scrolled >= maxScroll - 4)
    }

    const handleScroll = () => {
      handleActivity()
      updateScrollState()
    }

    scheduleIdle()
    updateScrollState()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('touchstart', handleActivity)

    return () => {
      clearTimeout(idleTimer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
    }
  }, [])

  const handleScrollIndicator = () => {
    setIsIdleVisible(false)
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.scrollTo({ top: window.scrollY + window.innerHeight, behavior: 'smooth' })
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const honeypot = formData.get('website')
    if (honeypot) {
      return
    }

    const secret = import.meta.env.VITE_CONTACT_SECRET

    if (!secret) {
      setFormStatus({ type: 'error', message: 'Missing secret key configuration.' })
      return
    }

    const payload = {
      name: formData.get('name')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      message: formData.get('message')?.toString().trim(),
      secret,
    }

    if (!payload.name || !payload.email || !payload.message) {
      setFormStatus({ type: 'error', message: 'Please fill in all fields before sending.' })
      return
    }

    setIsSubmitting(true)
    setFormStatus(null)

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbybTAKDzwJP1AcdlqxV-sK6dhcTVx5iCeLqQPyK1oWCF8XSYPoLV-yOSMG4PrxHOypN9Q/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(payload),
        }
      )

      if (response.type === 'opaque') {
        form.reset()
        setFormStatus({ type: 'success', message: 'Message sent! I will get back to you soon.' })
        return
      }

      const responseText = await response.text()
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        result = null
      }

      if (!response.ok) {
        throw new Error(result?.message || `Request failed (${response.status}).`)
      }

      if (result?.status !== 'success') {
        throw new Error(result?.message || 'Failed to send message.')
      }

      form.reset()
      setFormStatus({ type: 'success', message: 'Message sent! I will get back to you soon.' })
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollIndicatorClass = `fixed bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-xl transition ${
    isIdleVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
  } animate-float`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center px-4 py-4">
          <div className="flex items-center gap-3">
            <a
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              href="https://www.linkedin.com/in/kyle-sabatin/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.41c0-1.29-.03-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85v5.51H9.47V9h3.41v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.34 2.41 4.34 5.54v6.2zM5.44 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.22 20.45H3.66V9h3.56v11.45z" />
              </svg>
            </a>
            <a
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              href="https://github.com/dgnk1"
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.47 2 2 6.58 2 12.24c0 4.54 2.87 8.39 6.84 9.75.5.09.68-.22.68-.48 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.12-1.5-1.12-1.5-.91-.64.07-.62.07-.62 1.01.07 1.54 1.06 1.54 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.64-1.36-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.2 9.2 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.58.69.48 3.96-1.36 6.83-5.21 6.83-9.75C22 6.58 17.52 2 12 2z" />
              </svg>
            </a>
          </div>
          <nav className="hidden items-center justify-center gap-12 text-sm font-medium text-slate-700 md:flex">
            <a className="hover:text-slate-900" href="#about">About</a>
            <a className="hover:text-slate-900" href="#skills">Skills</a>
            <a className="hover:text-slate-900" href="#projects">Projects</a>
            <a className="hover:text-slate-900" href="#contact">Contact</a>
          </nav>
          <div className="hidden md:block" />
        </div>
      </header>

      <main>
        <section className="bg-slate-50 py-16 lg:py-24" id="home">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Hello, I&apos;m</span>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">Kyle Sabatin</h1>
              <h2 className="mt-2 text-lg font-semibold text-slate-800">Software Developer</h2>
              <p className="mt-4 max-w-md text-sm text-slate-600">
                I create beautiful, functional, and user-friendly digital experiences that bring ideas to life.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
                  href="#projects"
                >
                  View My Work
                </a>
                <a
                  className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900"
                  href="#contact"
                >
                  Contact Me
                </a>
              </div>
            </div>
            <div>
              <img className="w-full rounded-2xl object-cover shadow-2xl" src={heroImage} alt="Kyle Sabatin" />
            </div>
          </div>
        </section>

        <section className="bg-white py-16" id="about">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">About Me</h3>
              <p className="mt-4 text-sm text-slate-600">
                I&apos;m Kyle Sabatin, a software developer focused on crafting clean, reliable, and user-centered digital
                experiences. I specialize in turning complex problems into simple, intuitive interfaces that feel effortless to use.
              </p>
              <p className="mt-4 text-sm text-slate-600">
                When I&apos;m not coding, you&apos;ll find me exploring new design trends, refining UI details, or building side
                projects that sharpen my skills.
              </p>
              <p className="mt-4 text-sm text-slate-600">
                My approach blends technical precision with a strong eye for detail so every build looks polished, performs well,
                and delivers real value to users.
              </p>
              <div className="mt-6 text-sm font-semibold text-slate-800">
                My Projects On Github:{' '}
                <a className="text-slate-900 underline" href="https://github.com/dgnk1" target="_blank" rel="noreferrer">
                  github.com/dgnk1
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img className="w-full max-w-md rounded-2xl shadow-lg" src={githubImage} alt="GitHub profile" />
            </div>
          </div>
        </section>

        <section className="py-16" id="skills">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900">Skills &amp; Expertise</h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
                A comprehensive set of technical skills and creative abilities to bring your projects to life
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: '</>', title: 'Programming', text: 'Python, Java, C, C++, Dart, JavaScript' },
                { icon: '🧩', title: 'Frameworks & Libraries', text: 'Flutter, React.js, Django' },
                { icon: '🌐', title: 'Web Technologies', text: 'HTML, CSS' },
                { icon: '📱', title: 'Responsive Design', text: 'Mobile-first approach, Cross-browser compatibility' },
                { icon: '🛠️', title: 'Tools & Technologies', text: 'Git, UI/UX Design Tools, Basic Computer Hardware Assembly & Troubleshooting' },
                { icon: '🎯', title: 'Specializations', text: 'Mobile Application Development, Front-End Web Development' },
              ].map((skill) => (
                <div key={skill.title} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                  <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                    {skill.icon}
                  </span>
                  <h4 className="text-base font-semibold text-slate-900">{skill.title}</h4>
                  <p className="mt-2 text-xs text-slate-500">{skill.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20" id="projects">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900">Featured Projects</h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
                A selection of my recent work and passion projects
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'KPC Store',
                  image: projectCode,
                  text: 'A clean storefront layout with intuitive navigation, product highlights, and a streamlined shopping experience.',
                  tags: ['HTML', 'CSS', 'JavaScript'],
                  code: 'https://github.com/DgnK1/KPC-Store',
                  demo: 'https://kpc-store.vercel.app/',
                },
                {
                  title: 'TTV Web',
                  image: projectHome,
                  text: 'A blog website for Main Battle Tank news across the world, with interactive pages and readable blogs.',
                  tags: ['HTML', 'CSS', 'JavaScript'],
                  code: 'https://github.com/DgnK1/TTV',
                  demo: 'https://ttv-kappa.vercel.app/',
                },
                {
                  title: 'Soaris Mobile App',
                  image: projectPortrait,
                  text: 'A mobile-first product experience designed for drone-assisted agricultural monitoring.',
                  tags: ['Flutter', 'Dart'],
                  code: 'https://github.com/DgnK1/autonomousuav',
                },
              ].map((project) => (
                <article key={project.title} className="flex h-full flex-col overflow-hidden rounded-2xl bg-slate-50 shadow-lg">
                  <img className="h-44 w-full object-cover" src={project.image} alt={project.title} />
                  <div className="flex h-full flex-col p-5">
                    <h4 className="text-base font-semibold text-slate-900">{project.title}</h4>
                    <p className="mt-2 text-xs text-slate-500">{project.text}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-900">
                      <a href={project.code} target="_blank" rel="noreferrer">&#128187; Code</a>
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noreferrer">&#128279; Live Demo</a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" id="contact">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900">Get In Touch</h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
                Have a project in mind? Let&apos;s work together to create something amazing
              </p>
            </div>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Contact Information</h4>
                <div className="mt-6 space-y-4">
                  {[
                    { icon: '✉', label: 'Email', value: 'kylesabatin9999@gmail.com' },
                    { icon: '☎', label: 'Phone', value: '+63 (947) 245-4652' },
                    { icon: '📍', label: 'Location', value: 'Jugan, Consolacion, Cebu' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm text-white">
                        {item.icon}
                      </span>
                      <div>
                        <strong className="block text-xs font-semibold text-slate-900">{item.label}</strong>
                        <p className="text-xs text-slate-500">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <h5 className="text-sm font-semibold text-slate-900">Follow Me</h5>
                  <div className="flex items-center gap-3">
                  <a
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                    href="https://www.linkedin.com/in/kyle-sabatin/"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path d="M20.45 20.45h-3.55v-5.41c0-1.29-.03-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85v5.51H9.47V9h3.41v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.34 2.41 4.34 5.54v6.2zM5.44 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.22 20.45H3.66V9h3.56v11.45z" />
                    </svg>
                  </a>
                  <a
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                    href="https://github.com/dgnk1"
                    aria-label="GitHub"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C6.47 2 2 6.58 2 12.24c0 4.54 2.87 8.39 6.84 9.75.5.09.68-.22.68-.48 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.12-1.5-1.12-1.5-.91-.64.07-.62.07-.62 1.01.07 1.54 1.06 1.54 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.64-1.36-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.2 9.2 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.58.69.48 3.96-1.36 6.83-5.21 6.83-9.75C22 6.58 17.52 2 12 2z" />
                    </svg>
                  </a>
                </div>
                </div>
              </div>

              <form className="grid gap-4 rounded-2xl bg-white p-6 shadow-xl" onSubmit={handleContactSubmit}>
                <label className="grid gap-2 text-xs font-semibold text-slate-900">
                  Name
                  <input
                    className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                    type="text"
                    placeholder="Your name"
                    name="name"
                    required
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold text-slate-900">
                  Email
                  <input
                    className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                    type="email"
                    placeholder="your@email.com"
                    name="email"
                    required
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold text-slate-900">
                  Message
                  <textarea
                    className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                    rows="5"
                    placeholder="Your message..."
                    name="message"
                    required
                  ></textarea>
                </label>
                <input className="hidden" type="text" name="website" tabIndex="-1" autoComplete="off" />
                {formStatus && (
                  <p
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                      formStatus.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {formStatus.message}
                  </p>
                )}
                <button
                  className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-12 text-slate-200">
        <div className="mx-auto grid w-full max-w-6xl gap-10 border-b border-white/10 px-4 pb-8 md:grid-cols-3">
          <div>
            <h4 className="text-lg font-semibold">Portfolio</h4>
            <p className="mt-2 text-sm text-slate-300">Creating beautiful digital experiences that make a difference.</p>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Quick Links</h5>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><a className="hover:text-white" href="#about">About</a></li>
              <li><a className="hover:text-white" href="#skills">Skills</a></li>
              <li><a className="hover:text-white" href="#projects">Projects</a></li>
              <li><a className="hover:text-white" href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-slate-400">© 2026 Kyle Sabatin. All rights reserved.</div>
      </footer>

      <button
        className={scrollIndicatorClass}
        type="button"
        aria-label={isAtBottom ? 'Scroll to top' : 'Scroll down'}
        onClick={handleScrollIndicator}
      >
        {isAtBottom ? '↑' : '↓'}
      </button>
    </div>
  )
}

export default App
