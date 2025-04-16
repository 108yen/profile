import { expect, test } from "@playwright/test"

test("has title", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveTitle(/Kazuki Shirai/)
})

test.describe("media links", () => {
  const links = {
    bluesky: "https://bsky.app/profile/108yen.bsky.social",
    github: "https://github.com/108yen",
    x: "https://x.com/108yen___",
    zenn: "https://zenn.dev/108yen",
  }

  Object.entries(links).forEach(([key, value]) =>
    test(`has ${key} link`, async ({ context, page }) => {
      await page.goto("/")

      const pagePromise = context.waitForEvent("page")

      await page
        .getByRole("link", { name: new RegExp(key + " link", "i") })
        .click()

      const newPage = await pagePromise

      await expect(newPage).toHaveURL(value)
    }),
  )
})

test.describe("accordion works correctly", () => {
  test("open and close on click", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("button", { name: /oss/i }).click()

    await expect(page.getByText(/yamada ui/i)).toBeVisible()
    await expect(page.getByText(/recharts/i)).toBeVisible()

    await page.getByRole("button", { name: /oss/i }).click()

    await expect(page.getByText(/yamada ui/i)).toBeHidden()
    await expect(page.getByText(/recharts/i)).toBeHidden()
  })

  test("close on click other item", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("button", { name: /oss/i }).click()

    await expect(page.getByText(/yamada ui/i)).toBeVisible()
    await expect(page.getByText(/recharts/i)).toBeVisible()

    await page.getByRole("button", { name: /skills/i }).click()

    await expect(page.getByText(/yamada ui/i)).toBeHidden()
    await expect(page.getByText(/recharts/i)).toBeHidden()
  })
})
