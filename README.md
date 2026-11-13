# 🕌 Prayer Time With Siyam (নামাজ ও সিয়াম সময়সূচি)

A lightweight, blazing-fast, and fully responsive Single-Page Application (SPA) designed to help users track daily **5 Waqt Salah (নামাজ)** schedules for any year, **Ramadan & Sunnah Siyam (সিয়াম/রোজা)** routines, financial obligations, and spiritual activities. 

Built with Vanilla JavaScript, Adhan.js, and Tailwind CSS, this app operates entirely on the client side. It functions as an **Offline-First PWA (Progressive Web App)**, ensuring seamless performance and data persistence without requiring an active internet connection.

## ✨ Key Features

### ⏱️ Core Timings & Dynamic Calculations (Powered by Adhan.js)
* **365-Day Universal Prayer Calculation:** Calculates accurate daily 5 Waqt prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) + Sunrise, Tahajjud, Ishraq, and Forbidden prayer times for **any date and any year** using high-precision astronomical algorithms (Islamic Foundation Bangladesh / Karachi Hanafi standard).
* **Live Home Countdown:** Real-time countdown timer to the next Sehri or Iftar, with today's Sehri end and Iftar start cards preserved in classic layout.
* **Smart Islamic Date System:** Automatically advances to the next Islamic date after Maghrib (sunset), keeping in sync with the lunar Hijri calendar.
* **Dedicated "নামাজ" Tab:**
  * Displays today's running waqt with live countdown to the next prayer.
  * Interactive date browser (`<` / `>` buttons, Today jump, and Custom Date Picker) to check prayer times for any past or future day/year.
  * Clean cards for all 5 daily prayers with start and end times.
  * Sunnah times (Tahajjud, Ishraq/Chasht) and the 3 prohibited prayer times (সূর্যোদয়, দ্বিপ্রহর, সূর্যাস্ত).
* **Monthly Schedule & PDF Export:**
  * Select any month and year to view a complete monthly timetable.
  * Auto-highlights the current day's row.
  * Single-click high-resolution A4 PDF download of the monthly schedule (powered by `html2pdf.js`).
* **Multi-District Coverage:** Precise coordinates for major districts in Bangladesh (Dhaka, Jamalpur, Sherpur, Tangail, Manikganj, Chittagong, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, Mymensingh, Comilla, etc.).

### 🧮 Islamic Calculators & Tools
* **Financial Calculators:** Highly accurate, built-in calculators for **Zakat** (2.5%), **Khums** (20%), **Fitra**, and **Fidiya**. Features intelligent decimal formatting.
* **Digital Tasbih:** Clickable counter with haptic vibration feedback and persistent storage.
* **Daily Amal Tracker:** Interactive checkboxes to track daily 5 prayers, Tahajjud, Quran recitation, Dhikr, and Charity (persisted in LocalStorage).

### 📖 Knowledge & Articles (Zero-Reload SPA)
* **Master-Detail Blog System:** Seamless article reader with zero page reload.
* **Duas & Masala:** Quranic verses on Siyam, Sehri niyat, Iftar dua, and common questions & answers.
* **Health Guidelines:** Curated health tips for hydration and balanced eating during fasting.

### ⚙️ Technical & Offline Capabilities
* **Offline-First PWA:** Service Worker cache enables full offline functionality anytime, anywhere.
* **Zero Backend / Serverless:** 100% client-side computation with bundled `adhan.umd.min.js`.
* **Dark / Light Mode:** Automatic system preference detection with manual toggle button.

## 🛠️ Technologies Used

* **HTML5 / CSS3**
* **Tailwind CSS** (for clean, responsive styling)
* **Vanilla JavaScript** (No heavy frameworks, maximum speed)
* **Adhan.js** (Astronomical high-precision prayer calculation engine)
* **Service Workers & Cache API** (For 100% offline PWA capabilities)
* **FontAwesome** (Vector icons)
* **html2pdf.js** (Client-side PDF rendering)

## 🚀 Local Development

Since this project requires no build step or backend:
1. Clone this repository:
   ```bash
   git clone https://github.com/kamrulhasanj/prayer-time-with-siyam.git
   ```
2. Open the directory.
3. Double-click `index.html` to run it directly in your browser.

---
*Design & Developed with ❤️ by [Kamrul Hasan](https://facebook.com/uikamrul)*
