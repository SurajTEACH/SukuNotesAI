import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Zap,
  BookOpen,
  Mic,
  MessageSquare,
  Brain,
  Layers,
  Star,
  Sparkles,
  Rocket,
  GraduationCap,
  BarChart2,
  Clock,
  ShieldCheck,
  FileText,
  Users,
  Infinity as InfinityIcon,   // ✅ Fix: renamed to avoid shadowing global
  CheckCircle2,
} from 'lucide-react'

// ─── Plans Data ───────────────────────────────────────────────────────────────
const plans = [
  {
    id: 'starter',
    title: 'Starter',
    subtitle: 'Begin your learning journey',
    price: '₹10',
    amount: 10,
    credits: '1500 Credits',
    badge: null,
    gradient: 'from-sky-400 to-blue-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    Icon: BookOpen,
    description:
      'Ideal for students just starting out who want to explore AI-powered study tools.',
    features: [
      { icon: FileText,      text: 'Generate Smart AI Notes' },
      { icon: Brain,         text: 'Concept Mind Maps' },
      { icon: MessageSquare, text: 'Chat with your Documents' },
      { icon: Mic,           text: '2 Mock Interview Sessions' },
      { icon: Zap,           text: 'Standard Generation Speed' },
      { icon: ShieldCheck,   text: 'Basic Feature Access' },
    ],
  },
  {
    id: 'popular',
    title: 'Standard',
    subtitle: 'Most loved by students',
    price: '₹50',
    amount: 50,
    credits: '2500 Credits',
    badge: '🔥 Most Popular',
    gradient: 'from-violet-500 to-indigo-700',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    Icon: Sparkles,
    description:
      'The sweet spot for regular learners who want full AI-powered study assistance.',
    features: [
      { icon: FileText,      text: 'Advanced AI Notes & Summaries' },
      { icon: Layers,        text: 'Diagrams & Visual Charts' },
      { icon: MessageSquare, text: 'Unlimited Document Chat' },
      { icon: Mic,           text: 'Unlimited Mock Interviews' },
      { icon: Users,         text: 'Communication Skill Trainer' },
      { icon: Zap,           text: 'Fast Generation Speed' },
    ],
  },
  {
    id: 'pro',
    title: 'Pro Learner',
    subtitle: 'For the serious achiever',
    price: '₹100',
    amount: 100,
    credits: '3500 Credits',
    badge: null,
    gradient: 'from-rose-500 to-pink-700',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    Icon: GraduationCap,
    description:
      'Built for power users, exam warriors, and anyone who refuses to stop at average.',
    features: [
      { icon: Brain,         text: 'Deep Research AI Assistance' },
      { icon: BarChart2,     text: 'Performance Analytics Dashboard' },
      { icon: Star,          text: 'Priority AI Response Queue' },
      { icon: Rocket,        text: 'Blazing Fast Generation' },
      { icon: Clock,         text: 'Timed Practice Test Engine' },
      { icon: InfinityIcon,  text: 'Full Lifetime Feature Access' }, 
    ],
  },
]

// ─── Floating Blob ────────────────────────────────────────────────────────────
function Blob({ className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    />
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function Pricing() {
  const navigate = useNavigate()
  const [selectedPrice, setSelectedPrice] = useState(null)
  const [paying, setPaying]               = useState(false)
  const [payingAmount, setPayingAmount]   = useState(null)

  const handlePaying = (amount) => {
    setPayingAmount(amount)
    setPaying(true)
    
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0f1a] text-white px-4 py-12">

      {/* ── Background Blobs ── */}
  
      <Blob className="w-96 h-96 bg-indigo-600 -top-20 -left-15" />
      <Blob className="w-80 h-80 bg-violet-700 -bottom-15 -right-10" />
      <Blob className="w-64 h-64 bg-pink-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* ── Back Button ── */}
      <Motion.button
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition font-medium"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Motion.button>

      {/* ── Header ── */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-14"
      >
        <Motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm"
        >
          <Sparkles size={14} className="text-yellow-400" />
          Simple, Transparent Pricing
        </Motion.span>

        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight
                     bg-linear-to-r from-white via-indigo-200 to-violet-300
                     bg-clip-text text-transparent"
        
        >
          Fuel Your Learning
        </h1>
        <p className="text-gray-400 mt-3 text-base md:text-lg max-w-xl mx-auto">
          Buy credits once, use them at your own pace. No subscriptions. No surprises.
        </p>
      </Motion.div>

      {/* ── Cards Grid ── */}
      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
      >
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />
        ))}
      </Motion.div>

      {/* ── Footer Note ── */}
      <Motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-gray-500 text-sm mt-12"
      >
        🔒 Secure payments &nbsp;·&nbsp; Credits never expire &nbsp;·&nbsp; Instant activation
      </Motion.p>
    </div>
  )
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────
function PricingCard({
  plan,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount,
}) {
  const {
    title, subtitle, price, amount, credits,
    badge, gradient, iconBg, iconColor,
    Icon, description, features,
  } = plan

  const isSelected       = selectedPrice === amount
  const isPopular        = !!badge
  const isPayingThisCard = paying && payingAmount === amount

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <Motion.div
      variants={cardVariants}
      onClick={() => setSelectedPrice(amount)}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className={`
        relative cursor-pointer rounded-2xl p-6 flex flex-col
        backdrop-blur-md border transition-all duration-300
        ${isSelected
          ? 'bg-white/15 border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.1)]'
          : isPopular
          ? 'bg-white/10 border-indigo-400/60 shadow-[0_0_30px_rgba(99,102,241,0.2)]'
          : 'bg-white/6 border-white/10 hover:border-white/25'
  
        }
      `}
    >
      {/* ── Badge ── */}
      <AnimatePresence>
        {(badge || isSelected) && (
          <Motion.span
            key={isSelected ? 'selected' : 'badge'}
            initial={{ opacity: 0, scale: 0.7, y: -4 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{ opacity: 0, scale: 0.7 }}
            className={`
              absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full
              ${isSelected
                ? 'bg-white text-black'
                : 'bg-linear-to-r from-violet-600 to-indigo-500 text-white'
                
              }
            `}
          >
            {isSelected ? '✓ Selected' : badge}
          </Motion.span>
        )}
      </AnimatePresence>

      {/* ── Plan Icon ── */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        <Icon size={24} className={iconColor} />
      </div>

      {/* ── Title ── */}
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>

      {/* ── Price ── */}
      <div className="mt-5 mb-1">
        <span
          className={`text-4xl font-extrabold bg-linear-to-r ${gradient} bg-clip-text text-transparent`}
          
        >
          {price}
        </span>
        <span className="text-gray-500 text-sm ml-2">one-time</span>
      </div>
      <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-4">
        🎯 {credits}
      </p>

      {/* ── Divider ── */}
      <div className="border-t border-white/10 mb-4" />

      {/* ── Description ── */}
      <p className="text-sm text-gray-300 leading-relaxed mb-5">{description}</p>

      {/* ── Buy Button ── */}
      <Motion.button
        disabled={isPayingThisCard}
        whileTap={{ scale: 0.97 }}
        onClick={(e) => { e.stopPropagation(); onBuy(amount) }}
        className={`
          w-full py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200
          ${isPayingThisCard
            ? 'bg-gray-600 cursor-not-allowed text-gray-400'
            : `bg-linear-to-r ${gradient} text-white hover:opacity-90 shadow-lg`
            
          }
        `}
      >
        {isPayingThisCard ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Redirecting...
          </span>
        ) : (
          `Get ${credits} →`
        )}
      </Motion.button>

      {/* ── Features List ── */}
      <ul className="mt-6 space-y-3 flex-1">
        {features.map((feature, i) => {
          const FIcon = feature.icon  
          return (
            <Motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              className="flex items-center gap-3 text-sm text-gray-300"
            >
              <span
                className={`shrink-0 w-6 h-6 rounded-full ${iconBg} flex items-center justify-center`}
              >
                <FIcon size={12} className={iconColor} />
              </span>
              {feature.text}
            </Motion.li>
          )
        })}
      </ul>
    </Motion.div>
  )
}

export default Pricing
