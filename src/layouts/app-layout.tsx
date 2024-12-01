"use client"
import { Blackhole, Footer } from "@/components/layout"
import { AppProvider, AppProviderProps } from "@/context"
import "@/styles/layout.css"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

export function AppLayout({ children, ...rest }: AppProviderProps) {
  const [loading, setLoading] = useState(true)

  const text = "loading..."

  return (
    <AppProvider {...rest}>
      <div className="stack">
        <Blackhole className="background" isLoaded={() => setLoading(false)} />

        <AnimatePresence>
          {loading ? (
            <motion.div
              aria-hidden
              className="loading"
              exit={{ opacity: 0 }}
              transition={{ delay: 1 }}
            >
              {text.split("").map((char, index) => (
                <motion.p
                  animate="visible"
                  initial="hidden"
                  key={index}
                  variants={{
                    hidden: {
                      opacity: 0,
                    },
                    visible: {
                      opacity: [0, 1, 1, 0],
                      transition: {
                        duration: 3,
                        ease: ["linear", "linear"],
                        repeat: Infinity,
                        repeatDelay: 1,
                        times: [0, 0.04 * index, 0.9, 1],
                      },
                    },
                  }}
                >
                  {char}
                </motion.p>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="container">{children}</div>

        <Footer />
      </div>
    </AppProvider>
  )
}
