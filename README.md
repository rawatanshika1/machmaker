# ⭐ Starlit: Matchmaker Algo & Dashboard MVP

Starlit is an internal matchmaker dashboard and intelligence platform designed to help the TDC team manage client profiles, compute complex compatibility ratings, leverage an AI Co-Pilot search engine, and streamline matches.

---

## 🔑 Sample Login Credentials

To explore the application, use the default matchmaker credentials:
* **Username:** `matchmaker`
* **Password:** `secret123`

---

## 🚀 Key Features

* **Matchmaker Login Screen:** Seamless authentication flow for internal matchmakers.
* **Intelligent Dashboard:** 
  * Comprehensive table of assigned customers detailing name, age, city, marital status, and progress tag.
  * Real-time metrics showing total active profiles.
  * Powerful filtering options by **Status** and **City**, plus an instant keyword-based directory search.
* **Detailed Profile View (Full Biodata):**
  * complete personal background: DOB, Marital Status, Country, Languages, Family Type, and Diet.
  * Professional insights: College, Degree, Designation, Company, and Income.
  * Culturally relevant details: Religion, Caste, Siblings, and Manglik Status.
* **Meeting & Call Notes:** Capture real-time updates and preferences during customer check-ins.
* **Compatibility Scoring Algorithm:** Dynamic calculation of matching scores displayed as star ratings and percentage breakdowns.
* **AI Co-Pilot (Smart Search):** Natural language search engine enabling matchmakers to query profile characteristics (e.g., relocation, city, religion) dynamically.
* **"Send Match" Action:** Trigger email draft confirmations through mock templates containing key match information.

---

## 🛠️ Technical Write-Up

### 1. Technology Choices
* **Framework:** **Next.js (App Router)** & **React 18** for a high-performance, SEO-friendly, server-rendered application structure.
* **Styling:** **Tailwind CSS** with a customized design system providing glassmorphism interfaces, curated gradients, card-hover transitions, and clean typography.
* **Language:** **TypeScript** to enforce type safety across customer models and matching parameters.
* **Icons:** **Lucide React** for modern, crisp vector iconography.
* **Data Storage:** A local structured JSON pool (`src/data/customers.json`) simulating a real-world production database of over 100 diverse profiles.

### 2. Matching Logic
The application employs a multi-dimensional weighted algorithm (`src/lib/matching.ts`) tailored specifically to Indian matchmaking nuances:
* **Values (30% Weight):** Validates religious and caste preferences to respect family backgrounds.
* **Lifestyle (25% Weight):** Checks relocation options, willingness to have pets, dietary preferences, family structure type (nuclear/joint), and overlapping hobbies.
* **Career (25% Weight):** Assesses professional alignment including designation similarity and income parity (prioritizing matches within ₹150,000 variance).
* **Family Goals (20% Weight):** Evaluates mutual views on having children alongside cultural factors.

*Insight explainability:* Every suggested candidate profile shows a detailed percentage progress tracker for Values, Lifestyle, Career, and Family Goals, helping matchmakers understand exactly why a match is ranked high.

### 3. How AI is Integrated
* **Smart Co-Pilot:** The Search Chat box utilizes a keyword parsing and token matching search engine (`src/lib/openai.ts`) which can easily interface with the **OpenAI API / LLMs** to translate natural language queries (e.g., *"Find vegetarian profiles open to relocating"*) into ranked compatibility search queries.
* **Email Generator Ready:** The "Send Match" modal features templates designed to be customized using LLMs to compile automatic, personalized introductory email outreach.

### 4. Key Assumptions Made
* **Opposite-Gender Matching:** The current matching recommendations automatically filter candidates of the opposite gender from the customer.
* **Culturally Grounded Matching:** The criteria are heavily optimized around Indian marriage and matrimonial preferences (family structures, dietary constraints, horoscopes, caste, and manglik details) as requested in the specification.
* **Verification Status:** All active customer profiles listed in the dashboard database are assumed to have passed manual verification.

---

## 💻 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

### 3. Build for Production
```bash
npm run build
npm run start
```
