# Agent Guidelines: Corporate Record Integrity & Content Standards

This document establishes non-negotiable operational rules for all AI agents working within this repository. This codebase contains legally sensitive corporate data, statutory compliance records, and tender-facing materials for **Makhaswa Holdings (Pty) Ltd**.

---

## 1. Zero Invention & Tender Sensitivity
* **Strict Factual Adherence:** Never invent, infer, assume, or extrapolate corporate facts, project values, dates, client references, CIDB grades, or statutory appointments.
* **Tender Compliance:** All corporate information is used directly in formal public and private sector tenders (e.g., JRA, SANRAL, RAL, DRT, municipalities). Submitting false, embellished, or fabricated data can lead to tender disqualification, blacklisting, or legal liability.
* **Single Sources of Truth:** Rely strictly on verified information documented in `_archives/sourceoftruth.txt` and `_archives/sourceoftruthv2.txt`. If information is missing or ambiguous, ask for user clarification rather than guessing.

---

## 2. Strict Removals (No Unsolicited Reassignment or Expansion)
* **Remove Means Remove:** When instructed to remove a person, position, or credential, **strictly delete that specific record**.
* **Do Not Reassign Roles:** Never assume another employee inherits the duties, titles, or statutory references (e.g., CR 16.2, CR 8.1, CR 8.7) of a removed individual unless explicitly instructed by the user.
* **Do Not Expand Existing Titles:** Never modify or elevate the designation of remaining personnel (e.g., changing "Contracts Mgr" to "Project & Contracts Manager") based on an agent's assumption.
* **No Invented Statuses:** Never invent artificial resolution logs (e.g., declaring someone "confirmed" or "promoted") in the source of truth or profile documents.

---

## 3. Natural Integration (No Over-Embellishment or AI Spotlight)
* **Natural Placement:** When adding new capabilities, civil engineering keywords, or equipment (e.g., traffic signals, asphalt inlays/overlays, gabions):
  * Slot them seamlessly into existing technical lists, bulleted checklists, or descriptive paragraphs where they logically belong.
  * Match the exact terminology and phrasing used in South African civil engineering and municipal specifications.
* **Avoid Artificial Spotlights:** Never build exaggerated promotional banners, oversized badges, or hyped marketing callouts around newly introduced items unless explicitly requested.
* **Aesthetic & Style Consistency:**
  * **Website:** Use existing Lucide icon styles (`<i data-lucide="..."></i>`), existing utility classes, and standard layout containers.
  * **LaTeX Profiles:** Maintain exact spacing, FontAwesome icons, `\servicecard` macro structures, and alternating table row shading (`\rowcolor{mhbluelight}`). Do not break page layouts or push content onto extra pages.

---

## 4. Multi-Platform Consistency
When updates are made to company capabilities, personnel, or services, maintain synchronized consistency across all three mediums:
1. **Source of Truth Documents:** `_archives/sourceoftruth.txt` and `_archives/sourceoftruthv2.txt`.
2. **Website:** `index.html`, `services.html`, `about.html`, `projects.html`, and relevant JSON data files.
3. **LaTeX Company Profiles:** `company-profile/makhaswa_company_profile_v1.tex` and `company-profile/makhaswa_company_profile_v2.tex`.

---

## 5. Anti-Embellishment & AI Editing Charter
All agents must strictly read and adhere to `AI_EDITING_STANDARDS.md` ("There is no shame in where we are — do not try to always make more"). Never add artificial '+' to CIDB thresholds, never claim proprietary ownership of specialized plant/testing gear without logbooks, and never overwrite office landlines with unverified numbers.
