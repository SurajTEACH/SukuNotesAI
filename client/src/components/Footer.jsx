import React from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin, FaArrowRight, FaPaperPlane } from "react-icons/fa";

function Footer() {
  const navigate = useNavigate();

  const footerLinks = [
    { name: "Notes", path: "/notes-page" },
    { name: "History", path: "/history" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "AI Playground", path: "/ai-tools" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative w-full px-4 sm:px-6 lg:px-8 pb-6 pt-20 overflow-hidden bg-black">
      {/* Background Glows - Adjusted for Mobile */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-orange-500/5 rounded-full blur-[120px] -z-10" />
      
      <Motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl p-6 md:p-12 shadow-2xl"
      >
        {/* Animated Top Border Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Section - Takes 4 cols on Desktop */}
          <div className="lg:col-span-4 space-y-6">
            <Motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-2xl border border-white/20 shadow-xl">
                  🎓
                </div>
              </div>
              <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent tracking-tighter">
                SukuAI
              </span>
            </Motion.div>
            
            <p className="text-gray-400 leading-relaxed text-base md:text-lg max-w-sm">
              Making study sessions <span className="text-orange-400 italic">insanely smarter</span>. 
              High-quality notes and visuals, powered by AI.
            </p>

            <div className="flex gap-3">
              {[FaGithub, FaTwitter, FaLinkedin].map((Icon, i) => (
                <Motion.a
                  key={i}
                  whileHover={{ y: -5, backgroundColor: "rgba(249, 115, 22, 0.2)" }}
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
                >
                  <Icon size={20} />
                </Motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Links - Takes 3 cols on Desktop */}
          <div className="lg:col-span-3 lg:pl-10">
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs mb-6">Explore</h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {footerLinks.map((link) => (
                <Motion.li 
                  key={link.name}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  onClick={() => navigate(link.path)}
                  className="text-gray-400 hover:text-orange-400 cursor-pointer flex items-center gap-2 transition-colors text-sm md:text-base font-medium"
                >
                  <span className="w-1 h-1 rounded-full bg-orange-500" />
                  {link.name}
                </Motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section - Takes 5 cols on Desktop */}
          <div className="lg:col-span-5">
            <div className="relative p-6 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all" />
              
              <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <FaPaperPlane className="text-orange-500 text-sm" /> Join the Elite
              </h4>
              <p className="text-sm text-gray-400 mb-6">Get the latest study hacks & AI updates.</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Future topper email..." 
                  className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all text-sm"
                />
                <button className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)] active:scale-95 text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Responsive alignment */}
        <div className="mt-12 md:mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs md:text-sm text-center">
            © 2026 <span className="text-gray-300 font-bold">PrepAi</span>. Crafted for the ambitious.
          </p>
          <div className="flex gap-6 md:gap-10 text-xs md:text-sm">
            {["Privacy", "Terms", "Cookies"].map((text) => (
              <span key={text} className="text-gray-500 hover:text-white cursor-pointer transition-colors font-medium">
                {text}
              </span>
            ))}
          </div>
        </div>
      </Motion.div>
    </footer>
  );
}

export default Footer;