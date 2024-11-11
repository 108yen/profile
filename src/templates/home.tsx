import { Accordion, AccordionItem } from "@/components/disclosure"
import { Header } from "@/components/layout"
import {
  CERTIFICATIONS,
  CONTRIBUTING,
  PRODUCTS,
  SKILLS,
  YAMADA_UI,
} from "@/constant"
import "@/styles/home.css"
import Link from "next/link"

export function Home() {
  return (
    <div className="home-container">
      <Header />

      <main>
        <Accordion>
          <AccordionItem className="accordion" index={0} label="OSS">
            <ol>
              <li>
                Maintainer of{" "}
                <Link
                  aria-label={YAMADA_UI.ariaLabel}
                  className="link"
                  href={YAMADA_UI.href}
                  target="_blank"
                >
                  {YAMADA_UI.title}
                </Link>
              </li>

              <li>Contributing</li>

              <ol>
                {CONTRIBUTING.map(({ ariaLabel, href, title }, index) => (
                  <li key={index}>
                    <Link
                      aria-label={ariaLabel}
                      className="link"
                      href={href}
                      target="_blank"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ol>
            </ol>
          </AccordionItem>

          <AccordionItem className="accordion" index={1} label="Skills">
            <ol>
              {SKILLS.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ol>
          </AccordionItem>

          <AccordionItem className="accordion" index={2} label="Products">
            <ol>
              {PRODUCTS.map(({ ariaLabel, href, title }, index) => (
                <li key={index}>
                  <Link
                    aria-label={ariaLabel}
                    className="link"
                    href={href}
                    target="_blank"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ol>
          </AccordionItem>

          <AccordionItem className="accordion" index={3} label="Certifications">
            <ol>
              {CERTIFICATIONS.map(
                ({ ariaLabel, expired, href, title }, index) => (
                  <li key={index}>
                    {href ? (
                      <Link
                        aria-label={ariaLabel}
                        className="link"
                        href={href}
                        target="_blank"
                      >
                        {title}
                      </Link>
                    ) : (
                      title
                    )}

                    {expired ? <span className="tag">Expired</span> : null}
                  </li>
                ),
              )}
            </ol>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  )
}
