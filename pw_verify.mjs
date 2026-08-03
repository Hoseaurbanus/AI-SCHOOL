import { chromium } from "playwright"
import { writeFileSync, mkdirSync } from "fs"

const SHOTS = "/tmp/smugflex_shots"
mkdirSync(SHOTS, { recursive: true })

const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  headless: true,
})
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await ctx.newPage()

const shot = async (name) => {
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false })
  console.log(`SHOT: ${name}`)
}

const errors = []
page.on("pageerror", (e) => errors.push(e.message))

// 1. Landing page
await page.goto("http://localhost:8443")
await shot("01_landing")
const heroText = await page.textContent("h1")
console.log("Hero H1:", heroText?.trim().slice(0, 60))

// 2. Nav links render
const navLinks = await page.$$eval("nav button, nav a", (els) =>
  els
    .map((e) => e.textContent?.trim())
    .filter(Boolean)
    .slice(0, 10),
)
console.log("Nav links:", navLinks.join(", "))

// 3. Marketplace
await page.click("text=Courses")
await shot("02_marketplace")
const courseCount = await page.$$eval(".grid > button", (els) => els.length)
console.log("Course cards on marketplace:", courseCount)

// 4. Course details
await page.click(".grid > button:first-child")
await shot("03_course_details")
const detailH1 = await page.textContent("h1")
console.log("Course detail H1:", detailH1?.trim().slice(0, 60))

// 5. Login page
await page.goto("http://localhost:8443")
await page.click("text=Log in")
await shot("04_login")
const loginForm = await page.$("form")
console.log("Login form present:", !!loginForm)

// 6. Register page
await page.click("text=Create one free")
await shot("05_register")

// 7. Onboarding - login as student
await page.click("text=Sign in")
await page.fill('input[type="email"]', "student@test.com")
await page.fill('input[type="password"]', "password123")
await page.click("text=Sign In")
await page.waitForTimeout(1500)
await shot("06_onboarding")
const onboardingH2 = await page.textContent("h2")
console.log("Onboarding:", onboardingH2?.trim().slice(0, 60))

// 8. Complete onboarding - pick options and proceed
const options = await page.$$('button[style*="rgba(59,130,246,0.04)"]')
if (options.length) {
  await options[0].click()
  await page.click("text=Continue")
  await page.waitForTimeout(400)
}
// Step 2
const opts2 = await page.$$('button[style*="rgba(59,130,246,0.04)"]')
if (opts2.length) {
  await opts2[0].click()
  await page.click("text=Continue")
  await page.waitForTimeout(400)
}
// Step 3
const opts3 = await page.$$('button[style*="rgba(59,130,246,0.04)"]')
if (opts3.length) {
  await opts3[0].click()
  await page.click("text=Continue")
  await page.waitForTimeout(400)
}
// Step 4
const opts4 = await page.$$('button[style*="rgba(59,130,246,0.04)"]')
if (opts4.length) {
  await opts4[0].click()
  await page.click("text=Generate My Learning Plan")
  await page.waitForTimeout(400)
}
await shot("07_onboarding_done")

// 9. Go to student dashboard
await page.click("text=Start My Journey")
await page.waitForTimeout(600)
await shot("08_student_dashboard")
const dashH1 = await page.textContent("h1")
console.log("Dashboard H1:", dashH1?.trim().slice(0, 60))

// 10. AI Tutor
await page.click("text=AI Tutor")
await page.waitForTimeout(400)
await shot("09_ai_tutor")

// Type a message
const input = await page.$("textarea")
if (input) {
  await input.fill("Explain recursion with a real example")
  await page.keyboard.press("Enter")
  await page.waitForTimeout(1600)
}
await shot("10_ai_tutor_response")
const msgs = await page.$$eval('[class*="rounded-2xl"]', (els) => els.length)
console.log("Chat message bubbles:", msgs)

// 11. Coding Lab
await page.click("text=Coding Lab")
await page.waitForTimeout(400)
await shot("11_coding_lab")

// Run code
const runBtn = await page.$('button:has-text("Run Code")')
if (runBtn) {
  await runBtn.click()
  await page.waitForTimeout(1500)
}
await shot("12_coding_lab_run")

// 12. My Courses
await page.click("text=My Courses")
await page.waitForTimeout(400)
await shot("13_my_courses")

// 13. Admin flow
await page.goto("http://localhost:8443")
await page.click("text=Log in")
await page.fill('input[type="email"]', "admin@smugflex.ai")
await page.fill('input[type="password"]', "admin123")
await page.click("text=Sign In")
await page.waitForTimeout(1500)
await shot("14_admin_dashboard")
const adminH1 = await page.textContent("h1")
console.log("Admin H1:", adminH1?.trim().slice(0, 60))

// 14. Admin users
await page.click("text=Users")
await page.waitForTimeout(400)
await shot("15_admin_users")
const tableRows = await page.$$eval("tbody tr", (els) => els.length)
console.log("User table rows:", tableRows)

// 15. Admin analytics
await page.click("text=Analytics")
await page.waitForTimeout(400)
await shot("16_admin_analytics")

// 16. 404
await page.goto("http://localhost:8443/#/nonexistent")
await page.waitForTimeout(400)
await shot("17_404_check")

// Check console errors
console.log(
  "\nConsole errors:",
  errors.length === 0 ? "NONE" : errors.slice(0, 3).join("; "),
)

await browser.close()
console.log("\nAll shots saved to:", SHOTS)
