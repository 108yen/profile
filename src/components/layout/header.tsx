import Link from "next/link"

import {
  BlueskyIcon,
  GithubIcon,
  XIcon,
  ZennIcon,
} from "@/components/media-and-icons"
import "@/styles/header.css"

export function Header() {
  return (
    <header>
      <h1 className="title">Kazuki Shirai / 108yen</h1>
      <p className="description">Web engineer, Security specialist</p>

      <nav className="links">
        <ol>
          <li>
            <Link
              aria-label="Github Link"
              href="https://github.com/108yen"
              target="_blank"
            >
              <GithubIcon className="icon" />
            </Link>
          </li>
          <li>
            <Link
              aria-label="Zenn Link"
              href="https://zenn.dev/108yen"
              target="_blank"
            >
              <ZennIcon className="icon" />
            </Link>
          </li>
          <li>
            <Link
              aria-label="X Link"
              href="https://x.com/108yen___"
              target="_blank"
            >
              <XIcon className="icon" />
            </Link>
          </li>
          <li>
            <Link
              aria-label="Bluesky Link"
              href="https://bsky.app/profile/108yen.bsky.social"
              target="_blank"
            >
              <BlueskyIcon className="icon" />
            </Link>
          </li>
        </ol>
      </nav>
    </header>
  )
}
