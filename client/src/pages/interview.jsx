import React, { useRef } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion as Motion, useScroll, useTransform } from 'framer-motion'
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFillPersonFill,
  BsFileEarmark,
  BsArrowRight,
} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ChevronDown, Zap } from 'lucide-react'

import evalImg from '../assets/ai-ans.png'
import hrImg from '../assets/HR.png'
import techImg from '../assets/tech.png'
import confidenceImg from '../assets/confi.png'
import creditImg from '../assets/credit.png'
import resumeImg from '../assets/resume.png'
import pdfImg from '../assets/pdf.png'
import analyticsImg from '../assets/history.png'
import Footer from '../components/Footer'

/* ─── FadeSection ───────────────────────────────────────── */
const FadeSection = ({ children, className = '', delay = 0 }) => (
  <Motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.65, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </Motion.div>
)

/* ─── StepCard ──────────────────────────────────────────── */
const StepCard = ({ icon, step, title, description, index }) => (
  <Motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.55, delay: index * 0.15 }}
    whileHover={{ y: -7, scale: 1.02 }}
    className="relative bg-white rounded-3xl border border-gray-100 p-8 shadow-md
               hover:shadow-2xl transition-all duration-300 flex-1
               min-w-[240px] max-w-[300px] mx-auto md:mx-0"
  >
    {/* dashed connector */}
    {index < 2 && (
      <div
        className="hidden md:block absolute top-1/2 -right-6 w-12 h-px
                   border-t-2 border-dashed border-green-300 z-10"
      />
    )}

    <span className="inline-block bg-green-50 text-green-600 text-xs
                     font-bold px-3 py-1 rounded-full mb-4">
      {step}
    </span>

    <div
      className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600
                 rounded-2xl flex items-center justify-center text-white
                 shadow-lg mb-5"
    >
      {icon}
    </div>

    <h3 className="text-[17px] font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </Motion.div>
)

/* ─── CapabilityCard ────────────────────────────────────── */
const CapabilityCard = ({ image, icon, title, desc, index, reverse }) => (
  <Motion.div
    initial={{ opacity: 0, x: reverse ? 40 : -40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay: index * 0.08 }}
    whileHover={{ y: -4 }}
    className="group bg-white border border-gray-100 rounded-3xl overflow-hidden
               shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
      {/* image panel */}
      <div
        className="md:w-5/12 bg-gradient-to-br from-gray-50 to-green-50
                   flex items-center justify-center p-6 min-h-[190px]"
      >
        <Motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={image}
          alt={title}
          className="w-full max-h-48 object-contain drop-shadow-md"
        />
      </div>

      {/* text panel */}
      <div className="md:w-7/12 p-8 flex flex-col justify-center">
        <div
          className="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-200
                     text-green-600 rounded-xl flex items-center justify-center
                     mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300"
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        <Motion.button
          whileHover={{ x: 4 }}
          className="inline-flex items-center gap-1 text-green-600
                     text-sm font-semibold mt-5 w-fit"
        >
          Learn more <BsArrowRight />
        </Motion.button>
      </div>
    </div>
  </Motion.div>
)

/* ─── ModeCard ──────────────────────────────────────────── */
const ModeCard = ({ image, title, desc, index, accent }) => (
  <Motion.div
    initial={{ opacity: 0, scale: 0.93 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.48, delay: index * 0.1 }}
    whileHover={{ y: -6 }}
    className="group relative bg-white rounded-3xl overflow-hidden border
               border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300"
  >
    <div
      className={`h-48 bg-gradient-to-br ${accent}
                  flex items-center justify-center overflow-hidden`}
    >
      <Motion.img
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.35 }}
        src={image}
        alt={title}
        className="h-36 object-contain drop-shadow-xl"
      />
    </div>

    <div className="p-6">
      <h3 className="text-[17px] font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>

    {/* bottom accent bar */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[3px]
                 bg-gradient-to-r from-green-400 to-emerald-500
                 scale-x-0 group-hover:scale-x-100
                 transition-transform duration-300 origin-left"
    />
  </Motion.div>
)

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
function Interview() {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  /* ─── data ─── */
  const steps = [
    {
      icon: <BsRobot size={22} />,
      step: 'STEP 01',
      title: 'Role & Experience Selection',
      description: 'AI adjusts difficulty based on your selected role and experience level.',
    },
    {
      icon: <BsMic size={22} />,
      step: 'STEP 02',
      title: 'Smart Voice Interview',
      description: 'Dynamic follow-up questions that adapt to every answer you give.',
    },
    {
      icon: <BsClock size={22} />,
      step: 'STEP 03',
      title: 'Timer Based Practice',
      description: 'Real interview pressure with live countdown timer tracking.',
    },
  ]

  const capabilities = [
    {
      image: evalImg,
      icon: <BsBarChart size={18} />,
      title: 'AI Answer Evaluation',
      desc: 'Scores communication clarity, technical accuracy and confidence in real time.',
      reverse: false,
    },
    {
      image: resumeImg,
      icon: <BsFillPersonFill size={18} />,
      title: 'Resume Based Interview',
      desc: 'AI crafts personalised questions from your resume and work experience.',
      reverse: true,
    },
    {
      image: pdfImg,
      icon: <BsFileEarmark size={18} />,
      title: 'Downloadable PDF Report',
      desc: 'Detailed breakdown of strengths, weaknesses and step-by-step improvements.',
      reverse: false,
    },
    {
      image: analyticsImg,
      icon: <BsBarChart size={18} />,
      title: 'History & Analytics',
      desc: 'Track progress over time with performance graphs and deep analysis.',
      reverse: true,
    },
  ]

  const modes = [
    {
      image: hrImg,
      title: 'HR Interview Mode',
      desc: 'Behavioral and communication-based evaluation for soft skills.',
      accent: 'from-blue-50 to-indigo-100',
    },
    {
      image: techImg,
      title: 'Technical Interview Mode',
      desc: 'Deep technical questions tailored to your selected role.',
      accent: 'from-purple-50 to-violet-100',
    },
    {
      image: confidenceImg,
      title: 'Confidence Detection',
      desc: 'Real-time tone and voice analysis with actionable insights.',
      accent: 'from-orange-50 to-amber-100',
    },
    {
      image: creditImg,
      title: 'Credits System',
      desc: 'Unlock premium interview sessions quickly and easily.',
      accent: 'from-green-50 to-emerald-100',
    },
  ]

  return (
    <>
      {/* ── Global scrollbar hide ── */}
      <style>{`
        html, body {
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* ── FIXED NAVBAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* ── PAGE WRAPPER ──
          pt matches navbar height (64px = h-16).
          Change to pt-[56px] / pt-[72px] if your Navbar is different height.
      ── */}
      <div className="min-h-screen bg-[#f8fafc] pt-[64px]">

        {/* ════════════════════════════════════════
            HERO — white bg, no coloured blobs
        ════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative flex flex-col items-center justify-center
                     min-h-[calc(100vh-64px)] overflow-hidden bg-white
                     px-6 md:px-10 py-16"
        >
          {/* subtle dot texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* soft top glow — neutral, no colour */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                       rounded-full bg-gradient-to-b from-gray-100 to-transparent
                       blur-3xl pointer-events-none opacity-60"
          />

          <Motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 text-center w-full max-w-4xl mx-auto"
          >
            {/* badge */}
            <Motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-green-50 border border-green-200
                         text-green-700 rounded-full px-5 py-2 text-sm font-semibold
                         mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-green-500" />
              AI-Powered Interview Platform
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            </Motion.div>

            {/* headline */}
            <Motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold
                         leading-tight tracking-tight text-gray-900 mb-6"
            >
              Practice Interview with{' '}
              <span className="relative inline-block">
                <span
                  className="relative z-10 text-transparent bg-clip-text
                             bg-gradient-to-r from-green-500 to-emerald-400"
                >
                  AI Intelligence
                </span>
                <Motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.9 }}
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-green-100
                             rounded-full -z-0 origin-left"
                />
              </span>
            </Motion.h1>

            {/* sub */}
            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto
                         leading-relaxed mb-10"
            >
              Role-based mock interviews with smart follow-ups, adaptive difficulty and
              real-time performance feedback — all powered by AI.
            </Motion.p>

            {/* buttons */}
            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 18px 36px -10px rgba(16,185,129,0.45)',
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/interview-page')}
                className="inline-flex items-center gap-2 bg-gradient-to-r
                           from-green-500 to-emerald-500 text-white px-9 py-[14px]
                           rounded-full font-semibold text-[15px] shadow-md
                           transition-all cursor-pointer"
              >
                <Zap className="w-[15px] h-[15px]" />
                Start Interview
              </Motion.button>

              <Motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/interview-history')}
                className="inline-flex items-center gap-2 bg-white border-2
                           border-gray-200 text-gray-700 px-9 py-[14px] rounded-full
                           font-semibold text-[15px] hover:border-green-400
                           hover:text-green-600 transition-all cursor-pointer"
              >
                <BsBarChart />
                View History
              </Motion.button>
            </Motion.div>
          </Motion.div>

          {/* scroll hint */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2
                       flex flex-col items-center gap-1 text-gray-400 text-xs"
          >
            <span>Scroll to explore</span>
            <Motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              <ChevronDown size={18} />
            </Motion.div>
          </Motion.div>
        </section>

        {/* ════════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════════ */}
        <section className="bg-[#f8fafc] px-6 md:px-10 py-24">
          <div className="max-w-5xl mx-auto">
            <FadeSection className="text-center mb-14">
              <p className="text-green-600 font-bold text-xs uppercase
                            tracking-widest mb-3">
                How It Works
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
                Three Steps to{' '}
                <span
                  className="text-transparent bg-clip-text
                             bg-gradient-to-r from-green-500 to-emerald-400"
                >
                  Interview Ready
                </span>
              </h2>
            </FadeSection>

            <div className="flex flex-col md:flex-row justify-center
                            items-stretch gap-6 md:gap-10">
              {steps.map((item, i) => (
                <StepCard key={i} {...item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            AI CAPABILITIES
        ════════════════════════════════════════ */}
        <section className="bg-white px-6 md:px-10 py-24">
          <div className="max-w-5xl mx-auto">
            <FadeSection className="text-center mb-14">
              <p className="text-green-600 font-bold text-xs uppercase
                            tracking-widest mb-3">
                Capabilities
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
                Advanced AI{' '}
                <span
                  className="text-transparent bg-clip-text
                             bg-gradient-to-r from-green-500 to-emerald-400"
                >
                  Capabilities
                </span>
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base">
                Cutting-edge features that give you an unfair advantage in every interview.
              </p>
            </FadeSection>

            <div className="flex flex-col gap-6">
              {capabilities.map((item, i) => (
                <CapabilityCard key={i} {...item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            INTERVIEW MODES
        ════════════════════════════════════════ */}
        <section className="bg-[#f8fafc] px-6 md:px-10 py-24">
          <div className="max-w-5xl mx-auto">
            <FadeSection className="text-center mb-14">
              <p className="text-green-600 font-bold text-xs uppercase
                            tracking-widest mb-3">
                Modes
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
                Multiple Interview{' '}
                <span
                  className="text-transparent bg-clip-text
                             bg-gradient-to-r from-green-500 to-emerald-400"
                >
                  Modes
                </span>
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base">
                Choose the mode that matches your preparation goal.
              </p>
            </FadeSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {modes.map((item, i) => (
                <ModeCard key={i} {...item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════ */}
        <Footer />
      </div>
    </>
  )
}

export default Interview
