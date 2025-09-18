import { GlitchText } from '@/components/GlitchText';
import { motion } from 'framer-motion';

export default function ComingSoon() {
  return (
    <section className="min-h-screen bg-card text-foreground flex flex-col items-center justify-center px-6 py-16">
      {/* Glitchy 404 background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <GlitchText 
          theme="orange" 
          text="404" 
          className="opacity-20 text-[8rem] sm:text-[12rem] md:text-[15rem] lg:text-[20rem] font-display"
        />
      </div>

      {/* Main content with fade-in */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center space-y-6 text-center"
      >
        <h1 className="text-6xl font-semibold">Coming Soon</h1>
        <p className="max-w-md text-lg text-foreground/80">
          We’re working hard to launch this page. Stay tuned for something amazing!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <a href="/" className="px-6 py-3 rounded-md bg-gold text-background font-medium hover:opacity-90 transition">
            Return Home
          </a>
          <a href="/contact" className="px-6 py-3 rounded-md border border-gold text-gold bg-card font-medium hover:bg-gold hover:text-background transition">
            Request Feature
          </a>
        </div>
      </motion.div>
    </section>
  );
}
