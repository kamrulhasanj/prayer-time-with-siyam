// ================= VERSION CONTROL & STORAGE CLEARING =================
const APP_VERSION = 'v4'; 
const STORAGE_KEY_VERSION = 'prayer_app_version';

function checkAppVersion() {
  const storedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
  if (storedVersion !== APP_VERSION) {
    console.log("New version detected. Clearing old cache storage.");
    // Clear old version data but keep dark mode preference if desired
    const theme = localStorage.getItem("color-theme");
    const district = localStorage.getItem("selected-district");
    localStorage.clear();
    if (theme) localStorage.setItem("color-theme", theme);
    if (district) localStorage.setItem("selected-district", district);
    localStorage.setItem(STORAGE_KEY_VERSION, APP_VERSION);
  }
}
checkAppVersion();

// ================= PWA Service Worker Registration =================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`sw.js?v=${APP_VERSION}`)
      .then((reg) => {
        console.log("PWA Service Worker registered:", reg);
      })
      .catch((err) => console.log("SW config error:", err));

    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  });
}

// ================= Disable Right-Click (Context Menu) =================
document.addEventListener("contextmenu", (event) => event.preventDefault());

// ================= Disable common developer tools keyboard shortcuts =================
document.onkeydown = function (e) {
  if (e.keyCode == 123) return false;
  if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) return false;
  if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) return false;
  if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) return false;
  if (e.ctrlKey && e.keyCode == "C".charCodeAt(0)) return false;
};

// ================= SPA NAVIGATION LOGIC =================
function switchTab(tabId, btnElement) {
  document.querySelectorAll(".view-section").forEach((el) => el.classList.remove("active"));
  const targetView = document.getElementById("view-" + tabId);
  if (targetView) targetView.classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("text-green-600", "dark:text-green-500");
    btn.classList.add("text-gray-400");
    const span = btn.querySelector("span");
    if (span) {
      span.classList.remove("font-bold");
      span.classList.add("font-medium");
    }
  });
  if (btnElement) {
    btnElement.classList.remove("text-gray-400");
    btnElement.classList.add("text-green-600", "dark:text-green-500");
    const span = btnElement.querySelector("span");
    if (span) {
      span.classList.remove("font-medium");
      span.classList.add("font-bold");
    }
  }

  const districtContainer = document.getElementById("district-container");
  if (districtContainer) {
    if (tabId === 'home' || tabId === 'schedule' || tabId === 'prayer') {
      districtContainer.style.display = 'flex';
    } else {
      districtContainer.style.display = 'none';
    }
  }

  if (tabId === 'prayer') {
    renderPrayerTab();
  } else if (tabId === 'schedule') {
    generateMonthlySchedule();
  }

  window.scrollTo(0, 0);
}

// ================= DARK MODE LOGIC =================
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIconDark = document.getElementById("theme-icon-dark");
const themeIconLight = document.getElementById("theme-icon-light");
const htmlElement = document.documentElement;

if (localStorage.getItem("color-theme") === "dark" || (!("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  htmlElement.classList.add("dark");
  if (themeIconDark) themeIconDark.classList.add("hidden");
  if (themeIconLight) themeIconLight.classList.remove("hidden");
} else {
  htmlElement.classList.remove("dark");
  if (themeIconLight) themeIconLight.classList.add("hidden");
  if (themeIconDark) themeIconDark.classList.remove("hidden");
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", function () {
    if (themeIconDark) themeIconDark.classList.toggle("hidden");
    if (themeIconLight) themeIconLight.classList.toggle("hidden");
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      htmlElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  });
}

// ================= AMAL TRACKER LOGIC =================
for (let i = 1; i <= 5; i++) {
  let checkbox = document.getElementById("amal-" + i);
  if (checkbox) {
    if (localStorage.getItem("amal-" + i) === "true") checkbox.checked = true;
    checkbox.addEventListener("change", function () {
      localStorage.setItem("amal-" + i, this.checked);
    });
  }
}

// ================= ACCORDION LOGIC =================
const accordionHeaders = document.querySelectorAll(".accordion-header");
accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const icon = header.querySelector(".icon");

    document.querySelectorAll(".accordion-content").forEach((otherContent) => {
      if (otherContent !== content && otherContent.classList.contains("expanded")) {
        otherContent.classList.remove("expanded");
        const otherIcon = otherContent.previousElementSibling ? otherContent.previousElementSibling.querySelector(".icon") : null;
        if (otherIcon) otherIcon.innerText = "+";
      }
    });

    if (content.classList.contains("expanded")) {
      content.classList.remove("expanded");
      if (icon) icon.innerText = "+";
    } else {
      content.classList.add("expanded");
      if (icon) icon.innerText = "-";
    }
  });
});

// ================= NUMBER & TIME UTILITIES =================
function bnDigit(str) {
  if (str === null || str === undefined) return "";
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str.toString().replace(/\d/g, (d) => bnDigits[d]);
}

function enDigit(str) {
  if (!str) return '';
  const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return str.replace(/[০-৯]/g, d => bnDigits.indexOf(d));
}

function formatTime12(date) {
  if (!date || isNaN(date.getTime())) return "--:--";
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

function formatTimeBengali(date) {
  return bnDigit(formatTime12(date));
}

// Bengali Day Names
const banglaDays = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
const banglaMonths = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

function getHijriDate(date) {
  try {
    const fmt = new Intl.DateTimeFormat('bn-BD-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return fmt.format(date).replace(/যুগ/g, 'হিজরী');
  } catch (e) {
    return "";
  }
}

// ================= DISTRICT COORDINATES =================
const districtCoordinates = {
  "ঢাকা": { lat: 23.8103, lng: 90.4125 },
  "জামালপুর": { lat: 24.9375, lng: 89.9377 },
  "শেরপুর": { lat: 25.0205, lng: 90.0153 },
  "টাংগাইল": { lat: 24.2513, lng: 89.9167 },
  "মানিকগঞ্জ": { lat: 23.8617, lng: 90.0003 },
  "চট্টগ্রাম": { lat: 22.3569, lng: 91.7832 },
  "সিলেট": { lat: 24.8949, lng: 91.8687 },
  "রাজশাহী": { lat: 24.3636, lng: 88.6241 },
  "খুলনা": { lat: 22.8456, lng: 89.5403 },
  "বরিশাল": { lat: 22.7010, lng: 90.3535 },
  "রংপুর": { lat: 25.7439, lng: 89.2752 },
  "ময়মনসিংহ": { lat: 24.7471, lng: 90.4203 },
  "কুমিল্লা": { lat: 23.4682, lng: 91.1788 },
  "বগুড়া": { lat: 24.8465, lng: 89.3777 },
  "নোয়াখালী": { lat: 22.8696, lng: 91.0997 },
  "কক্সবাজার": { lat: 21.4272, lng: 92.0058 },
  "যশোর": { lat: 23.1664, lng: 89.2081 },
  "কুষ্টিয়া": { lat: 23.9013, lng: 89.1205 },
  "পাবনা": { lat: 24.0064, lng: 89.2372 },
  "দিনাজপুর": { lat: 25.6217, lng: 88.6355 },
  "গাজীপুর": { lat: 23.9999, lng: 90.4203 },
  "নারায়ণগঞ্জ": { lat: 23.6238, lng: 90.5000 },
  "ফরিদপুর": { lat: 23.6071, lng: 89.8429 },
  "সিরাজগঞ্জ": { lat: 24.4534, lng: 89.7008 },
  "নেত্রকোণা": { lat: 24.8770, lng: 90.7279 },
  "কিশোরগঞ্জ": { lat: 24.4449, lng: 90.7766 }
};

const districtSelect = document.getElementById("district-select");
let currentDistrict = localStorage.getItem("selected-district") || "জামালপুর";
if (districtSelect) {
  districtSelect.value = currentDistrict;
  districtSelect.addEventListener("change", function (e) {
    currentDistrict = e.target.value;
    localStorage.setItem("selected-district", currentDistrict);
    updateHomeTimer();
    renderPrayerTab();
    generateMonthlySchedule();
  });
}

// ================= ADHAN.JS PRAYER CALCULATION ENGINE =================
function getDistrictCoords(districtName) {
  return districtCoordinates[districtName] || districtCoordinates["ঢাকা"];
}

function getAdhanCalculationParams() {
  // Islamic Foundation Bangladesh standard: Karachi method + Hanafi Asr
  const params = adhan.CalculationMethod.Karachi();
  params.madhab = adhan.Madhab.Hanafi;
  return params;
}

function calculatePrayerTimes(date, districtName) {
  const coords = getDistrictCoords(districtName);
  const adhanCoords = new adhan.Coordinates(coords.lat, coords.lng);
  const params = getAdhanCalculationParams();
  const pt = new adhan.PrayerTimes(adhanCoords, date, params);

  // সেহরি শেষ (সুবহে সাদেকের পূর্বে)
  const sehriEnd = new Date(pt.fajr.getTime() - 2 * 60 * 1000);

  // মূল অ্যাপের কুরআনভিত্তিক ফর্মুলা (সূরা বাকারা ১৮৭: "ثُمَّ أَتِمُّوا الصِّيَامَ إِلَى اللَّيْلِ" - রাত্রি অবধি সিয়াম পূর্ণ করো):
  // সোবহে সাদেক থেকে সূর্যোদয়ের সময়ের ব্যবধান (gapMs) সূর্যাস্তের (মাগরিবের) সাথে যোগ করে রাত (এশার ওয়াক্ত) পর্যন্ত ইফতার
  const gapMs = pt.sunrise.getTime() - sehriEnd.getTime();
  const iftarStart = new Date(pt.maghrib.getTime() + gapMs);

  // Tahajjud start: around midnight to sehri
  const tahajjudStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

  // Ishraq: 15 mins after Sunrise
  const ishraqTime = new Date(pt.sunrise.getTime() + 15 * 60 * 1000);

  // Prohibited times:
  // 1. Sunrise: from sunrise to 15 mins after sunrise
  // 2. Mid-day Zawal: 10 mins before Dhuhr until Dhuhr
  // 3. Sunset: 12 mins before Maghrib until Maghrib
  const zawalStart = new Date(pt.dhuhr.getTime() - 10 * 60 * 1000);
  const sunsetProhibitedStart = new Date(pt.maghrib.getTime() - 12 * 60 * 1000);

  return {
    sehri: sehriEnd,
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    ishraq: ishraqTime,
    zawal: zawalStart,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    sunsetProhibited: sunsetProhibitedStart,
    maghrib: pt.maghrib,
    iftar: iftarStart,
    isha: pt.isha,
    tahajjud: tahajjudStart,
    rawAdhan: pt
  };
}

// ================= 1. HOME TAB DYNAMIC LOGIC =================
function updateHomeTimer() {
  const now = new Date();
  const district = currentDistrict;
  
  const todayTimes = calculatePrayerTimes(now, district);
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = calculatePrayerTimes(tomorrow, district);

  let targetTime;
  let labelText = "";
  let displaySehri, displayIftar;
  let isAfterIftar = false;

  if (now < todayTimes.sehri) {
    // Before today's Sehri
    targetTime = todayTimes.sehri;
    labelText = "সেহরির বাকি আছে";
    displaySehri = todayTimes.sehri;
    displayIftar = todayTimes.iftar;
  } else if (now >= todayTimes.sehri && now < todayTimes.iftar) {
    // Between Sehri and Iftar
    targetTime = todayTimes.iftar;
    labelText = "ইফতারের বাকি আছে";
    displaySehri = todayTimes.sehri;
    displayIftar = todayTimes.iftar;
  } else {
    // After Iftar -> Countdown to tomorrow's Sehri!
    targetTime = tomorrowTimes.sehri;
    labelText = "আগামীকালের সেহরির বাকি";
    displaySehri = tomorrowTimes.sehri;
    displayIftar = tomorrowTimes.iftar;
    isAfterIftar = true;
  }

  // Update Sehri & Iftar display cards
  const sehriEl = document.getElementById("sehri-time");
  const iftarEl = document.getElementById("iftar-time");
  if (sehriEl) sehriEl.innerText = formatTimeBengali(displaySehri);
  if (iftarEl) iftarEl.innerText = formatTimeBengali(displayIftar);

  // Update Label
  const labelEl = document.getElementById("countdown-label");
  if (labelEl) labelEl.innerText = labelText;

  // Countdown timer
  let diff = targetTime.getTime() - now.getTime();
  if (diff <= 0) diff = 0;

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  const timerStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  const cdEl = document.getElementById("countdown");
  if (cdEl) cdEl.innerText = bnDigit(timerStr);

  // Dynamic Date Badge
  const currentEngDateStr = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  // In Islamic calendar, a new day starts after Maghrib
  const hijriBaseDate = isAfterIftar ? tomorrow : now;
  const hijriDateStr = getHijriDate(hijriBaseDate);

  const dateBadgeEl = document.getElementById("current-date-display");
  if (dateBadgeEl) {
    if (hijriDateStr) {
      dateBadgeEl.innerText = `আজ ${hijriDateStr} (${bnDigit(currentEngDateStr)})`;
    } else {
      dateBadgeEl.innerText = `আজ ${bnDigit(currentEngDateStr)}`;
    }
  }
}

// ================= 2. NEW PRAYER TAB LOGIC =================
let prayerSelectedDate = new Date();

function changePrayerDate(delta) {
  prayerSelectedDate.setDate(prayerSelectedDate.getDate() + delta);
  renderPrayerTab();
}

function setPrayerDateToToday() {
  prayerSelectedDate = new Date();
  renderPrayerTab();
}

function onCustomPrayerDatePicked(dateStr) {
  if (!dateStr) return;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    prayerSelectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    renderPrayerTab();
  }
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

function renderPrayerTab() {
  const now = new Date();
  const isSelectedToday = isSameDay(prayerSelectedDate, now);
  const pt = calculatePrayerTimes(prayerSelectedDate, currentDistrict);

  // 1. Header Date Display
  const dateStrEl = document.getElementById("prayer-view-date-str");
  const hijriStrEl = document.getElementById("prayer-view-hijri-str");
  const customDateInput = document.getElementById("prayer-custom-date");

  if (dateStrEl) {
    const dayName = banglaDays[prayerSelectedDate.getDay()];
    const dateNum = bnDigit(prayerSelectedDate.getDate());
    const monthName = banglaMonths[prayerSelectedDate.getMonth()];
    const yearNum = bnDigit(prayerSelectedDate.getFullYear());
    dateStrEl.innerText = `${dayName}, ${dateNum} ${monthName} ${yearNum}`;
  }

  if (hijriStrEl) {
    const hijri = getHijriDate(prayerSelectedDate);
    hijriStrEl.innerText = hijri || "";
  }

  if (customDateInput) {
    const yyyy = prayerSelectedDate.getFullYear();
    const mm = String(prayerSelectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(prayerSelectedDate.getDate()).padStart(2, '0');
    customDateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // 2. Active Waqt Calculation & Live Countdown
  const currentWaqtEl = document.getElementById("prayer-current-waqt");
  const nextWaqtLabelEl = document.getElementById("prayer-next-waqt-label");
  const nextWaqtCountdownEl = document.getElementById("prayer-next-waqt-countdown");

  let activeWaqtKey = "";
  let nextWaqtName = "";
  let nextWaqtTarget = null;

  if (isSelectedToday) {
    // Determine active waqt and next waqt
    if (now < pt.fajr) {
      activeWaqtKey = "tahajjud";
      if (currentWaqtEl) currentWaqtEl.innerText = "তাহাজ্জুদ / সাহরি";
      nextWaqtName = "ফজর শুরু";
      nextWaqtTarget = pt.fajr;
    } else if (now >= pt.fajr && now < pt.sunrise) {
      activeWaqtKey = "fajr";
      if (currentWaqtEl) currentWaqtEl.innerText = "ফজর ওয়াক্ত";
      nextWaqtName = "সূর্যোদয়";
      nextWaqtTarget = pt.sunrise;
    } else if (now >= pt.sunrise && now < pt.ishraq) {
      activeWaqtKey = "sunrise_prohibited";
      if (currentWaqtEl) currentWaqtEl.innerText = "সূর্যোদয় (নামাজ নিষেধ)";
      nextWaqtName = "ইশরাক শুরু";
      nextWaqtTarget = pt.ishraq;
    } else if (now >= pt.ishraq && now < pt.zawal) {
      activeWaqtKey = "ishraq";
      if (currentWaqtEl) currentWaqtEl.innerText = "ইশরাক ও চাশত";
      nextWaqtName = "যোহর শুরু";
      nextWaqtTarget = pt.dhuhr;
    } else if (now >= pt.zawal && now < pt.dhuhr) {
      activeWaqtKey = "zawal_prohibited";
      if (currentWaqtEl) currentWaqtEl.innerText = "দ্বিপ্রহর (নামাজ নিষেধ)";
      nextWaqtName = "যোহর শুরু";
      nextWaqtTarget = pt.dhuhr;
    } else if (now >= pt.dhuhr && now < pt.asr) {
      activeWaqtKey = "dhuhr";
      if (currentWaqtEl) currentWaqtEl.innerText = "যোহর ওয়াক্ত";
      nextWaqtName = "আসর শুরু";
      nextWaqtTarget = pt.asr;
    } else if (now >= pt.asr && now < pt.maghrib) {
      activeWaqtKey = "asr";
      if (currentWaqtEl) currentWaqtEl.innerText = "আসর ওয়াক্ত";
      nextWaqtName = "মাগরিব শুরু";
      nextWaqtTarget = pt.maghrib;
    } else if (now >= pt.maghrib && now < pt.iftar) {
      activeWaqtKey = "maghrib";
      if (currentWaqtEl) currentWaqtEl.innerText = "মাগরিব ওয়াক্ত (সিয়াম চলমান)";
      nextWaqtName = "রাত্রির ইফতার";
      nextWaqtTarget = pt.iftar;
    } else {
      activeWaqtKey = "isha";
      if (currentWaqtEl) currentWaqtEl.innerText = "এশা ও রাত (ইফতারের সময়)";
      // Next is tomorrow's Fajr
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowPt = calculatePrayerTimes(tomorrow, currentDistrict);
      nextWaqtName = "আগামীকাল ফজর";
      nextWaqtTarget = tomorrowPt.fajr;
    }

    if (nextWaqtLabelEl) nextWaqtLabelEl.innerText = `${nextWaqtName} হতে বাকি`;

    if (nextWaqtTarget && nextWaqtCountdownEl) {
      let diff = nextWaqtTarget.getTime() - now.getTime();
      if (diff <= 0) diff = 0;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      nextWaqtCountdownEl.innerText = bnDigit(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }
  } else {
    if (currentWaqtEl) currentWaqtEl.innerText = "৫ ওয়াক্তের সূচি";
    if (nextWaqtLabelEl) nextWaqtLabelEl.innerText = "নির্বাচিত তারিখ";
    if (nextWaqtCountdownEl) nextWaqtCountdownEl.innerText = bnDigit(prayerSelectedDate.toLocaleDateString("en-GB"));
  }

  // 3. Render 5 Main Waqt Cards
  const cardsContainer = document.getElementById("prayer-cards-container");
  if (cardsContainer) {
    const prayersList = [
      {
        id: "fajr",
        name: "ফজর",
        arabic: "الفجر",
        icon: "fa-cloud-moon",
        iconColor: "text-indigo-500",
        start: pt.fajr,
        end: pt.sunrise,
        note: `সেহরি শেষ: ${formatTimeBengali(pt.sehri)}`
      },
      {
        id: "sunrise",
        name: "সূর্যোদয়",
        arabic: "الشروق",
        icon: "fa-sun",
        iconColor: "text-amber-500",
        start: pt.sunrise,
        end: null,
        note: "সূর্যোদয়ের ১৫ মি. পর ইশরাক শুরু"
      },
      {
        id: "dhuhr",
        name: "যোহর",
        arabic: "الظهر",
        icon: "fa-sun",
        iconColor: "text-yellow-500",
        start: pt.dhuhr,
        end: pt.asr,
        note: `জাওয়াল শেষ: ${formatTimeBengali(pt.dhuhr)}`
      },
      {
        id: "asr",
        name: "আসর (হানাফী)",
        arabic: "العصر",
        icon: "fa-cloud-sun",
        iconColor: "text-orange-500",
        start: pt.asr,
        end: pt.maghrib,
        note: "সূর্যাস্তের পূর্ব পর্যন্ত"
      },
      {
        id: "maghrib",
        name: "মাগরিব",
        arabic: "المغرب",
        icon: "fa-mountain-sun",
        iconColor: "text-rose-500",
        start: pt.maghrib,
        end: pt.isha,
        note: "দিবসের দ্বিতীয় প্রান্ত (সিয়াম চলমান)"
      },
      {
        id: "isha",
        name: "এশা ও রাত",
        arabic: "العشاء والليل",
        icon: "fa-moon",
        iconColor: "text-blue-500",
        start: pt.isha,
        end: pt.fajr,
        note: `রাত শুরু ও ইফতার: ${formatTimeBengali(pt.iftar)}`
      }
    ];

    cardsContainer.innerHTML = prayersList.map((item) => {
      const isActive = isSelectedToday && (item.id === activeWaqtKey);
      const activeBorder = isActive 
        ? "border-green-500 bg-green-50/70 dark:bg-green-950/40 shadow-md ring-2 ring-green-500/20" 
        : "border-gray-100 dark:border-gray-700 hover:bg-gray-50/60 dark:hover:bg-gray-700/40";
      
      const activeBadge = isActive 
        ? `<span class="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">চলমান ওয়াক্ত</span>` 
        : "";

      const timeRangeText = item.end 
        ? `${formatTimeBengali(item.start)} - ${formatTimeBengali(item.end)}` 
        : `${formatTimeBengali(item.start)}`;

      return `
        <div class="flex items-center justify-between p-3.5 rounded-xl border ${activeBorder} transition-all">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center text-lg ${item.iconColor} shadow-sm">
              <i class="fas ${item.icon}"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-800 dark:text-gray-100 text-base">${item.name}</span>
                <span class="text-xs text-gray-400 font-arabic font-medium">${item.arabic}</span>
                ${activeBadge}
              </div>
              <div class="text-[11px] text-gray-500 dark:text-gray-400">${item.note}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-mono font-bold text-gray-800 dark:text-gray-100 text-sm md:text-base">${timeRangeText}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  // 4. Sunnah & Forbidden Times
  const tahajjudEl = document.getElementById("time-tahajjud");
  if (tahajjudEl) tahajjudEl.innerText = `${formatTimeBengali(pt.sehri)} পর্যন্ত`;

  const ishraqEl = document.getElementById("time-ishraq");
  if (ishraqEl) ishraqEl.innerText = formatTimeBengali(pt.ishraq);

  const fSunriseEl = document.getElementById("forbidden-sunrise");
  if (fSunriseEl) fSunriseEl.innerText = `${formatTimeBengali(pt.sunrise)} হতে ${formatTimeBengali(pt.ishraq)}`;

  const fZawalEl = document.getElementById("forbidden-zawal");
  if (fZawalEl) fZawalEl.innerText = `${formatTimeBengali(pt.zawal)} হতে ${formatTimeBengali(pt.dhuhr)}`;

  const fSunsetEl = document.getElementById("forbidden-sunset");
  if (fSunsetEl) fSunsetEl.innerText = `${formatTimeBengali(pt.sunsetProhibited)} হতে ${formatTimeBengali(pt.maghrib)}`;
}

// ================= 3. MONTHLY SCHEDULE & PDF GENERATION =================
let scheduleSelectedMonth = new Date().getMonth();
let scheduleSelectedYear = new Date().getFullYear();
let currentMonthlyScheduleData = [];

// Initialize Month & Year Selects
const scheduleMonthSelect = document.getElementById("schedule-month-select");
const scheduleYearSelect = document.getElementById("schedule-year-select");

if (scheduleMonthSelect) scheduleMonthSelect.value = scheduleSelectedMonth;
if (scheduleYearSelect) scheduleYearSelect.value = scheduleSelectedYear;

function onScheduleMonthYearChange() {
  if (scheduleMonthSelect) scheduleSelectedMonth = parseInt(scheduleMonthSelect.value);
  if (scheduleYearSelect) scheduleSelectedYear = parseInt(scheduleYearSelect.value);
  generateMonthlySchedule();
}

function generateMonthlySchedule() {
  const tbody = document.getElementById("schedule-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  currentMonthlyScheduleData = [];

  const year = scheduleSelectedYear;
  const month = scheduleSelectedMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const pt = calculatePrayerTimes(d, currentDistrict);
    const isTodayRow = isSameDay(d, today);

    const dayData = {
      day: day,
      dateStr: `${bnDigit(day)} ${banglaMonths[month].slice(0, 3)}, ${banglaDays[d.getDay()].slice(0, 3)}`,
      sehri: formatTimeBengali(pt.sehri),
      fajr: formatTimeBengali(pt.fajr),
      sunrise: formatTimeBengali(pt.sunrise),
      dhuhr: formatTimeBengali(pt.dhuhr),
      asr: formatTimeBengali(pt.asr),
      maghrib: formatTimeBengali(pt.maghrib),
      isha: formatTimeBengali(pt.isha),
      iftar: formatTimeBengali(pt.iftar),
      isToday: isTodayRow
    };
    currentMonthlyScheduleData.push(dayData);

    const tr = document.createElement("tr");
    tr.id = `schedule-row-${day}`;
    
    let rowClass = "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b dark:border-gray-700";
    if (isTodayRow) {
      rowClass += " bg-green-100 dark:bg-green-900/60 font-semibold";
    }

    tr.className = rowClass;
    tr.innerHTML = `
      <td class="p-2 font-mono whitespace-nowrap text-gray-800 dark:text-gray-200">${dayData.dateStr}</td>
      <td class="p-2 border-l dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300">${dayData.sehri}</td>
      <td class="p-2 border-l dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300">${dayData.fajr}</td>
      <td class="p-2 border-l dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300">${dayData.sunrise}</td>
      <td class="p-2 border-l dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300">${dayData.dhuhr}</td>
      <td class="p-2 border-l dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300">${dayData.asr}</td>
      <td class="p-2 border-l dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300">${dayData.maghrib}</td>
      <td class="p-2 border-l dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300">${dayData.isha}</td>
      <td class="p-2 border-l dark:border-gray-700 font-mono text-green-700 dark:text-green-400 font-bold bg-green-50/50 dark:bg-green-950/30">${dayData.iftar}</td>
    `;
    tbody.appendChild(tr);
  }
}

function downloadPDF() {
  const element = document.createElement("div");
  element.style.width = "794px";
  element.style.padding = "24px";
  element.style.boxSizing = "border-box";
  element.style.backgroundColor = "white";
  element.style.display = "block";
  element.style.fontFamily = "'Hind Siliguri', sans-serif";

  const monthName = banglaMonths[scheduleSelectedMonth];
  const yearStr = bnDigit(scheduleSelectedYear);

  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 15px;">
      <p dir="rtl" style="font-size: 16px; margin: 0; font-weight: bold; color: #15803d;">أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ</p>
      <h2 style="font-size: 22px; margin: 4px 0; color: #15803d; font-weight: bold;">নামাজ ও সিয়াম সময়সূচি - ${monthName} ${yearStr}</h2>
      <p style="font-size: 13px; margin: 0; color: #374151;">জেলা: <strong>${currentDistrict}</strong> | কুরআনভিত্তিক সিয়াম: রাত থেকে রাত অবধি সিয়াম পূর্ণ করো (সূরা বাকারা: ১৮৭)</p>
    </div>
    
    <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 11px;">
      <thead>
        <tr style="background-color: #15803d; color: white;">
          <th style="border: 1px solid #14532d; padding: 5px;">তারিখ ও বার</th>
          <th style="border: 1px solid #14532d; padding: 5px;">সেহরি শেষ</th>
          <th style="border: 1px solid #14532d; padding: 5px;">ফজর</th>
          <th style="border: 1px solid #14532d; padding: 5px;">সূর্যোদয়</th>
          <th style="border: 1px solid #14532d; padding: 5px;">যোহর</th>
          <th style="border: 1px solid #14532d; padding: 5px;">আসর</th>
          <th style="border: 1px solid #14532d; padding: 5px;">মাগরিব</th>
          <th style="border: 1px solid #14532d; padding: 5px;">এশা</th>
          <th style="border: 1px solid #14532d; padding: 5px; background-color: #14532d;">ইফতার (রাত)</th>
        </tr>
      </thead>
      <tbody>
        ${currentMonthlyScheduleData.map((d, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'}; line-height: 1.2;">
            <td style="border: 1px solid #d1d5db; padding: 4px; font-weight: 500; color: #111827;">${d.dateStr}</td>
            <td style="border: 1px solid #d1d5db; padding: 4px; color: #111827;">${d.sehri}</td>
            <td style="border: 1px solid #d1d5db; padding: 4px; color: #111827;">${d.fajr}</td>
            <td style="border: 1px solid #d1d5db; padding: 4px; color: #111827;">${d.sunrise}</td>
            <td style="border: 1px solid #d1d5db; padding: 4px; color: #111827;">${d.dhuhr}</td>
            <td style="border: 1px solid #d1d5db; padding: 4px; color: #111827;">${d.asr}</td>
            <td style="border: 1px solid #d1d5db; padding: 4px; color: #111827;">${d.maghrib}</td>
            <td style="border: 1px solid #d1d5db; padding: 4px; color: #111827;">${d.isha}</td>
            <td style="border: 1px solid #d1d5db; padding: 4px; font-weight: bold; color: #15803d; background-color: #f0fdf4;">${d.iftar}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    
    <div style="margin-top: 15px; text-align: center; font-size: 10px; color: #6b7280;">
      Prayer Time With Siyam • Design & Developed with ❤️ by Kamrul Hasan
    </div>
  `;

  document.body.appendChild(element);

  const opt = {
    margin: 8,
    filename: `Prayer-Schedule-${scheduleSelectedMonth + 1}-${scheduleSelectedYear}-${currentDistrict}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save().then(() => {
    document.body.removeChild(element);
  });
}

// ================= 4. TOOLS LOGIC =================
let count = parseInt(localStorage.getItem("tasbih-count")) || 0;
const tasbihCounterEl = document.getElementById("tasbih-counter");
if (tasbihCounterEl) tasbihCounterEl.innerText = bnDigit(count);

function incrementTasbih() {
  count++;
  if (tasbihCounterEl) tasbihCounterEl.innerText = bnDigit(count);
  localStorage.setItem("tasbih-count", count);
  if (navigator.vibrate) navigator.vibrate(50);
}

function resetTasbih() {
  count = 0;
  if (tasbihCounterEl) tasbihCounterEl.innerText = bnDigit(count);
  localStorage.setItem("tasbih-count", count);
}

function calculateZakat() {
  let rawInput = document.getElementById("zakat-input").value;
  let amount = parseFloat(enDigit(rawInput));
  const resultElement = document.getElementById("zakat-result");

  if (!isNaN(amount) && amount > 0) {
    const zakat = amount * 0.025;
    let roundedZakat = Math.round(zakat * 100) / 100;
    let displayValue = Number.isInteger(roundedZakat) ? roundedZakat : roundedZakat.toFixed(2);
    resultElement.innerText = bnDigit(displayValue) + "৳";
  } else {
    resultElement.innerText = "০৳";
  }
}

function calculateKhums() {
  let rawInput = document.getElementById("khums-input").value;
  let amount = parseFloat(enDigit(rawInput));
  const resultElement = document.getElementById("khums-result");

  if (!isNaN(amount) && amount > 0) {
    const khums = amount * 0.2;
    let roundedKhums = Math.round(khums * 100) / 100;
    let displayValue = Number.isInteger(roundedKhums) ? roundedKhums : roundedKhums.toFixed(2);
    resultElement.innerText = bnDigit(displayValue) + "৳";
  } else {
    resultElement.innerText = "০৳";
  }
}

function calculateFitra() {
  let rawMembers = document.getElementById("fitra-members").value;
  let members = parseFloat(enDigit(rawMembers));
  let rate = parseFloat(document.getElementById("fitra-rate").value);
  const resultElement = document.getElementById("fitra-result");

  if (!isNaN(members) && members > 0) {
    const fitra = members * rate;
    resultElement.innerText = bnDigit(Math.floor(fitra)) + "৳";
  } else {
    resultElement.innerText = "০৳";
  }
}

function calculateFidiya() {
  let rawDays = document.getElementById("fidiya-days").value;
  let days = parseFloat(enDigit(rawDays));
  let rate = parseFloat(document.getElementById("fidiya-rate").value);
  const resultElement = document.getElementById("fidiya-result");

  if (!isNaN(days) && days > 0) {
    const fidiya = days * rate;
    resultElement.innerText = bnDigit(Math.floor(fidiya)) + "৳";
  } else {
    resultElement.innerText = "০৳";
  }
}

// ================= 5. BLOG / ARTICLE LOGIC =================
function openArticle(articleId) {
  const listContainer = document.getElementById('article-list-container');
  const readerContainer = document.getElementById('article-reader-container');
  if (listContainer) listContainer.style.display = 'none';
  if (readerContainer) readerContainer.style.display = 'block';

  document.querySelectorAll('.blog-content').forEach(el => el.style.display = 'none');
  const activeArticle = document.getElementById(articleId);
  if (activeArticle) activeArticle.style.display = 'block';

  window.scrollTo(0, 0);
}

function closeArticle() {
  const readerContainer = document.getElementById('article-reader-container');
  const listContainer = document.getElementById('article-list-container');
  if (readerContainer) readerContainer.style.display = 'none';
  if (listContainer) listContainer.style.display = 'block';
  window.scrollTo(0, 0);
}

// ================= INITIALIZATION & REAL-TIME TICKER =================
function initApp() {
  updateHomeTimer();
  renderPrayerTab();
  generateMonthlySchedule();

  // Run update timer every second
  setInterval(() => {
    updateHomeTimer();
    // Only re-calculate live countdown on prayer tab if today is selected
    if (isSameDay(prayerSelectedDate, new Date())) {
      renderPrayerTab();
    }
  }, 1000);
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
