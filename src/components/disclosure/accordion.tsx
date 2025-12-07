"use client"
import { AnimatePresence, motion } from "framer-motion"
import {
  createContext,
  Dispatch,
  HTMLAttributes,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useId,
  useState,
} from "react"

interface AccordionContextProps {
  expanded: false | number
  setExpanded: Dispatch<SetStateAction<false | number>>
}

const AccordionContext = createContext<AccordionContextProps>({
  expanded: false,
  setExpanded: () => {},
})

interface AccordionProps extends PropsWithChildren {}

export function Accordion({ children }: AccordionProps) {
  const [expanded, setExpanded] = useState<false | number>(false)

  return (
    <AccordionContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  index: number
  label: string
}

export function AccordionItem({
  children,
  index,
  label,
  ...rest
}: AccordionItemProps) {
  const labelId = useId()
  const panelId = useId()

  const { expanded, setExpanded } = useContext(AccordionContext)

  const isOpen = index === expanded

  return (
    <section {...rest}>
      <motion.h2 initial={false}>
        <button
          aria-controls={panelId}
          aria-expanded={isOpen}
          id={labelId}
          onClick={() => setExpanded(isOpen ? false : index)}
        >
          {label}
        </button>
      </motion.h2>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            animate="open"
            aria-labelledby={labelId}
            exit="collapsed"
            id={panelId}
            initial="collapsed"
            key="content"
            role="region"
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
            variants={{
              collapsed: { height: 0, opacity: 0 },
              open: { height: "auto", opacity: 1 },
            }}
          >
            {children}
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  )
}
