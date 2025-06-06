import Link from "next/link"
import { ComponentType } from "react"
import { Accordion, AccordionItem } from "@/components/disclosure"
import { Header } from "@/components/layout"
import "@/styles/home.css"
import {
  ESLintIcon,
  FlutterIcon,
  GithubActionsIcon,
  GoogleAnalyticsIcon,
  GoogleCloudIcon,
  JavaIcon,
  NextjsIcon,
  ReactIcon,
  SpringBootIcon,
  TypescriptIcon,
  VercelIcon,
  W3CIcon,
  YamadaUIIcon,
} from "@/components/media-and-icons"
import {
  CERTIFICATIONS,
  CONTRIBUTING,
  PRODUCTS,
  SKILLS,
  YAMADA_UI,
} from "@/constant"

type IconMapProps = Record<string, ComponentType<any>>

const IconMap: IconMapProps = {
  ESLint: ESLintIcon,
  Flutter: FlutterIcon,
  "Github Actions": GithubActionsIcon,
  "Google Analytics": GoogleAnalyticsIcon,
  "Google Cloud": GoogleCloudIcon,
  Java: JavaIcon,
  "Next.js": NextjsIcon,
  React: ReactIcon,
  "Spring Boot": SpringBootIcon,
  Typescript: TypescriptIcon,
  Vercel: VercelIcon,
  "Web Accessibility": W3CIcon,
}

export function Home() {
  return (
    <div className="home-container">
      <Header />

      <main>
        <Accordion>
          <AccordionItem className="accordion" index={0} label="OSS">
            <ol>
              <li>
                Maintainer of
                <Link
                  aria-label={YAMADA_UI.ariaLabel}
                  className="link inline-link with-icon"
                  href={YAMADA_UI.href}
                  target="_blank"
                >
                  <YamadaUIIcon className="skill-icon" />
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
              {SKILLS.map((value, index) => {
                const Icon = IconMap[value] || "div"

                return (
                  <li key={index}>
                    <div className="with-icon">
                      <Icon className="skill-icon" />
                      {value}
                    </div>
                  </li>
                )
              })}
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
