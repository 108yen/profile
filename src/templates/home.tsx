import { Accordion, AccordionItem } from "@/app/components/disclosure"
import { Header } from "@/app/components/layout"
import "@/styles/home.css"
import Link from "next/link"

export function Home() {
  return (
    <>
      <Header />

      <main>
        <Accordion>
          <AccordionItem className="accordion" index={0} label="OSS">
            <ol>
              <li>
                <p>
                  Maintainer of{" "}
                  <Link
                    aria-label="Yamada UI Link"
                    className="link"
                    href="https://github.com/yamada-ui/yamada-ui"
                    target="_blank"
                  >
                    Yamada UI
                  </Link>
                </p>
              </li>
              <li>Contributing</li>
              <ol>
                <li>
                  <Link
                    aria-label="recharts Link"
                    className="link"
                    href="https://github.com/recharts/recharts"
                    target="_blank"
                  >
                    recharts
                  </Link>
                </li>
              </ol>
            </ol>
          </AccordionItem>

          <AccordionItem className="accordion" index={1} label="Skills">
            <ol>
              <li>Typescript</li>
              <li>React</li>
              <li>Next.js - Pages Router, App Router</li>
              <li>Web Accessibility</li>
              <li>Google Cloud</li>
              <li>Github Actions</li>
            </ol>
          </AccordionItem>

          <AccordionItem className="accordion" index={2} label="Products">
            <ol>
              <li>
                <Link
                  aria-label="Twitch clip ranking Link"
                  className="link"
                  href="https://www.twitchclipsranking.com/"
                  target="_blank"
                >
                  Twitch clip ranking
                </Link>
              </li>

              <li>
                <Link
                  aria-label="Copipe Link"
                  className="link"
                  href="https://www.netcopipe.com/"
                  target="_blank"
                >
                  copipe
                </Link>
              </li>
            </ol>
          </AccordionItem>

          <AccordionItem className="accordion" index={3} label="Certifications">
            <ol>
              <li>
                <Link
                  aria-label="AWS SAA Link"
                  className="link"
                  href="https://www.credly.com/badges/34605602-4be2-47de-8ffe-a85401649b31"
                  target="_blank"
                >
                  AWS Certified Solutions Architect - Associate
                </Link>

                <span className="tag">Expired</span>
              </li>

              <li>
                <Link
                  aria-label="CompTIA Security+ Link"
                  className="link"
                  href="https://www.credly.com/badges/390af6d6-0529-4c1a-b08d-db17d5c3db2f"
                  target="_blank"
                >
                  CompTIA Security+ certification
                </Link>

                <span className="tag">Expired</span>
              </li>

              <li>情報処理安全確保支援士</li>

              <li>
                <Link
                  aria-label="Associate Cloud Engineer Link"
                  className="link"
                  href="https://www.credly.com/badges/13640f30-1c62-4df2-b192-c904ff370f25"
                  target="_blank"
                >
                  Associate Cloud Engineer
                </Link>
              </li>

              <li>
                <Link
                  aria-label="Professional Cloud Architects Link"
                  className="link"
                  href="https://www.credly.com/badges/0f7513ab-4fa4-4c2e-96c7-6d819c50664b"
                  target="_blank"
                >
                  Professional Cloud Architects
                </Link>
              </li>

              <li>
                <Link
                  aria-label="Professional Cloud Developer Link"
                  className="link"
                  href="https://www.credly.com/badges/11953a8e-add0-41dd-99fe-04572dc5eeb4"
                  target="_blank"
                >
                  Professional Cloud Developer
                </Link>
              </li>

              <li>
                <Link
                  aria-label="Professional Cloud DevOps Engineer Link"
                  className="link"
                  href="https://www.credly.com/badges/3319c4ce-d5fb-43f8-81d7-c19eb0e87fa4"
                  target="_blank"
                >
                  Professional Cloud DevOps Engineer
                </Link>
              </li>

              <li>
                <Link
                  aria-label="Professional Cloud Security Engineer Link"
                  className="link"
                  href="https://www.credly.com/badges/1627bd31-8407-4014-912d-dc501a2ce3c2"
                  target="_blank"
                >
                  Professional Cloud Security Engineer
                </Link>
              </li>

              <li>
                <Link
                  aria-label="Professional Cloud Network Engineer Link"
                  className="link"
                  href="https://www.credly.com/badges/f1cf6b62-c7f7-47c8-a554-b30261fde3f2"
                  target="_blank"
                >
                  Professional Cloud Network Engineer
                </Link>
              </li>
            </ol>
          </AccordionItem>
        </Accordion>
      </main>
    </>
  )
}
