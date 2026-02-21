import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import emailjs from "@emailjs/browser";

const supabase = createClient(
  "https://odyovlemiubcdatwyhpk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9keW92bGVtaXViY2RhdHd5aHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MzM2NTksImV4cCI6MjA4NzIwOTY1OX0.yna87uzRwmz1eLUTCZLy5DztMdqsH_SHOTLwzlotfqw"
);
const EMAILJS_SERVICE  = "service_o7pk8t4";
const EMAILJS_TEMPLATE = "template_07ijv0f";
const EMAILJS_KEY      = "iYdC5C2QCpeWOMWf0";
emailjs.init(EMAILJS_KEY);

const REMIND_DAYS = { "1 day":1, "3 days":3, "1 week":7, "2 weeks":14 };
const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── Milestone ages with unique colours ────────────────────────────────────
const MILESTONES = {
  1:   { label:"1st Birthday!",     color:"#FFD700", emoji:"🌟" },
  5:   { label:"Fab Five!",         color:"#A855F7", emoji:"🎠" },
  10:  { label:"Double Digits!",    color:"#3B82F6", emoji:"💎" },
  13:  { label:"Teenager!",         color:"#06B6D4", emoji:"🌀" },
  16:  { label:"Sweet 16!",         color:"#F97316", emoji:"🚗" },
  18:  { label:"Now an Adult!",     color:"#22C55E", emoji:"🎓" },
  21:  { label:"Fabulous 21!",      color:"#EAB308", emoji:"🍾" },
  25:  { label:"Quarter Century!",  color:"#94A3B8", emoji:"💫" },
  30:  { label:"Dirty Thirty!",     color:"#EF4444", emoji:"🔥" },
  40:  { label:"Fabulous Forty!",   color:"#8B5CF6", emoji:"💜" },
  50:  { label:"Golden Fifty!",     color:"#F59E0B", emoji:"👑" },
  60:  { label:"Diamond 60!",       color:"#EC4899", emoji:"💎" },
  70:  { label:"Platinum 70!",      color:"#0EA5E9", emoji:"🌊" },
  80:  { label:"Legendary 80!",     color:"#B45309", emoji:"🎖️" },
  90:  { label:"Magnificent 90!",   color:"#7C3AED", emoji:"🌙" },
  100: { label:"CENTENARIAN! 🎆",   color:"#FF4081", emoji:"🎆" },
};

function getMilestone(year) {
  if (!year) return null;
  const age = new Date().getFullYear() - year;
  return MILESTONES[age] || null;
}

// ── Font Options ──────────────────────────────────────────────────────────
const FONT_OPTIONS = [
  { id:"cabinet",  label:"Cabinet Grotesk", family:"'Cabinet Grotesk', sans-serif",  preview:"Modern & Bold"    },
  { id:"poppins",  label:"Poppins",         family:"'Poppins', sans-serif",           preview:"Clean & Rounded"  },
  { id:"inter",    label:"Inter",           family:"'Inter', sans-serif",             preview:"Minimal & Sharp"  },
  { id:"nunito",   label:"Nunito",          family:"'Nunito', sans-serif",            preview:"Soft & Friendly"  },
  { id:"sora",     label:"Sora",            family:"'Sora', sans-serif",              preview:"Geometric & Cool" },
  { id:"playfair", label:"Playfair Display",family:"'Playfair Display', serif",       preview:"Elegant & Classic"},
];

const LANG_OPTIONS = [
  { id:"en", label:"English",  flag:"🇬🇧" },
  { id:"sw", label:"Swahili",  flag:"🇰🇪" },
  { id:"fr", label:"Français", flag:"🇫🇷" },
  { id:"es", label:"Español",  flag:"🇪🇸" },
  { id:"ar", label:"العربية",  flag:"🇸🇦" },
];

// ── Full Translations ─────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    upcoming:"Upcoming", all:"All", addNew:"Add New", alerts:"Alerts", settings:"Settings",
    upcomingBirthdays:"Upcoming Birthdays", allBirthdays:"All Birthdays",
    addBirthday:"Add a Birthday", alertsIntegrations:"Alerts & Integrations",
    birthdaysTracked:"birthdays tracked", noBirthdaysYet:"No birthdays yet!",
    addFirstHint:"Click \"Add New\" to get started", noResults:"No results found.",
    search:"Search\u2026", addDesc:"Add a birthday and we\u2019ll make sure you never forget it.",
    pickAvatar:"Pick an avatar", name:"Name", namePlaceholder:"e.g. Mom, Jake, Grandma\u2026",
    birthdayLabel:"Birthday", month:"Month", day:"Day", year:"Year (optional)",
    note:"Note (optional)", notePlaceholder:"e.g. Loves sunflowers\u2026",
    remindMe:"Remind me", saving:"Saving\u2026", addBirthdayBtn:"Add Birthday",
    signOut:"Sign Out", lightMode:"Light Mode", darkMode:"Dark Mode",
    themeDesc:"Toggle between day and night",
    notifications:"Notifications", emailReminders:"Email reminders",
    pushNotifications:"Push notifications", inAppAlerts:"In-app alerts",
    deleteAll:"Delete All My Birthdays", fontStyle:"Font Style", language:"Language",
    nextBirthday:"Next birthday", allUpcoming:"All upcoming",
    today:"TODAY \uD83C\uDF89", tomorrow:"Tomorrow", synced:"Synced",
    profile:"Profile", appearance:"Appearance", displayName:"Display Name", gender:"Gender",
    male:"\uD83D\uDC68 Male", female:"\uD83D\uDC69 Female", other:"\uD83E\uDDD1 Other",
    session:"Session", dangerZone:"Danger Zone",
    didYouReach:"Did you reach out to", yes:"Yes! \uD83C\uDF89", notYet:"Not yet", skip:"Skip",
    birthdayPassed:"Birthday passed!", reachedOut:"You reached out \u2714",
    recapTitle:"Your Year in Birthdays \uD83C\uDF81", recapShare:"Share Wrapped",
    celebrated:"Birthdays celebrated", reachedOutCount:"People you reached out to",
    missedCount:"Missed outreach", upcomingSoon:"Coming up in 30 days",
    busiestMonth:"Busiest month", milestoneCount:"Milestone birthdays",
    widgetTitle:"Coming Up", milestone:"milestone",
    recap:"Recap", viewRecap:"View Recap",
    turns:"turns",
  },
  sw: {
    upcoming:"Zinakuja", all:"Zote", addNew:"Ongeza", alerts:"Arifa", settings:"Mipangilio",
    upcomingBirthdays:"Siku za Kuzaliwa Zinazokuja", allBirthdays:"Siku Zote za Kuzaliwa",
    addBirthday:"Ongeza Siku ya Kuzaliwa", alertsIntegrations:"Arifa & Muunganisho",
    birthdaysTracked:"zinafuatiliwa", noBirthdaysYet:"Hakuna siku za kuzaliwa bado!",
    addFirstHint:"Bonyeza \"Ongeza\" kuanza", noResults:"Hakuna matokeo.",
    search:"Tafuta\u2026", addDesc:"Ongeza siku ya kuzaliwa na hatutakusahaulisha.",
    pickAvatar:"Chagua picha", name:"Jina", namePlaceholder:"mfano. Mama, Jake, Bibi\u2026",
    birthdayLabel:"Siku ya Kuzaliwa", month:"Mwezi", day:"Siku", year:"Mwaka (hiari)",
    note:"Kumbuka (hiari)", notePlaceholder:"mfano. Anapenda alizeti\u2026",
    remindMe:"Nikumbushe", saving:"Inahifadhi\u2026", addBirthdayBtn:"Ongeza Siku ya Kuzaliwa",
    signOut:"Toka", lightMode:"Mwanga", darkMode:"Giza", themeDesc:"Badilisha mwanga na giza",
    notifications:"Arifa", emailReminders:"Arifa za barua pepe",
    pushNotifications:"Arifa za kusukuma", inAppAlerts:"Arifa za programu",
    deleteAll:"Futa Siku Zote za Kuzaliwa", fontStyle:"Fonti", language:"Lugha",
    nextBirthday:"Inayofuata", allUpcoming:"Zote zinazokuja",
    today:"LEO \uD83C\uDF89", tomorrow:"Kesho", synced:"Imesawazishwa",
    profile:"Wasifu", appearance:"Muonekano", displayName:"Jina la Kuonyesha", gender:"Jinsia",
    male:"\uD83D\uDC68 Mme", female:"\uD83D\uDC69 Mke", other:"\uD83E\uDDD1 Nyingine",
    session:"Kikao", dangerZone:"Eneo Hatari",
    didYouReach:"Je, uliwasiliana na", yes:"Ndiyo! \uD83C\uDF89", notYet:"Bado", skip:"Ruka",
    birthdayPassed:"Siku ya kuzaliwa imepita!", reachedOut:"Uliwasiliana \u2714",
    recapTitle:"Mwaka Wako wa Siku za Kuzaliwa \uD83C\uDF81", recapShare:"Shiriki",
    celebrated:"Siku za kuzaliwa zilizoadhimishwa", reachedOutCount:"Uliwasiliana na",
    missedCount:"Hukuwasiliana", upcomingSoon:"Zinazokuja siku 30",
    busiestMonth:"Mwezi wenye shughuli nyingi", milestoneCount:"Siku za kipekee",
    widgetTitle:"Zinazokuja", milestone:"kipekee",
    recap:"Muhtasari", viewRecap:"Angalia Muhtasari",
    turns:"anakuwa",
  },
  fr: {
    upcoming:"\u00C0 venir", all:"Toutes", addNew:"Ajouter", alerts:"Alertes", settings:"Param\u00E8tres",
    upcomingBirthdays:"Anniversaires \u00E0 Venir", allBirthdays:"Tous les Anniversaires",
    addBirthday:"Ajouter un Anniversaire", alertsIntegrations:"Alertes & Int\u00E9grations",
    birthdaysTracked:"suivis", noBirthdaysYet:"Aucun anniversaire encore!",
    addFirstHint:"Cliquez \"Ajouter\" pour commencer", noResults:"Aucun r\u00E9sultat.",
    search:"Rechercher\u2026", addDesc:"Ajoutez un anniversaire et nous vous rappellerons.",
    pickAvatar:"Choisir un avatar", name:"Nom", namePlaceholder:"ex. Maman, Jake, Grand-m\u00E8re\u2026",
    birthdayLabel:"Anniversaire", month:"Mois", day:"Jour", year:"Ann\u00E9e (optionnel)",
    note:"Note (optionnel)", notePlaceholder:"ex. Aime les tournesols\u2026",
    remindMe:"Me rappeler", saving:"Enregistrement\u2026", addBirthdayBtn:"Ajouter l'Anniversaire",
    signOut:"Se d\u00E9connecter", lightMode:"Mode Clair", darkMode:"Mode Sombre",
    themeDesc:"Basculer entre clair et sombre",
    notifications:"Notifications", emailReminders:"Rappels par email",
    pushNotifications:"Notifications push", inAppAlerts:"Alertes dans l'appli",
    deleteAll:"Supprimer Tous les Anniversaires", fontStyle:"Police", language:"Langue",
    nextBirthday:"Prochain anniversaire", allUpcoming:"Tous \u00E0 venir",
    today:"AUJOURD'HUI \uD83C\uDF89", tomorrow:"Demain", synced:"Synchronis\u00E9",
    profile:"Profil", appearance:"Apparence", displayName:"Nom d'affichage", gender:"Genre",
    male:"\uD83D\uDC68 Homme", female:"\uD83D\uDC69 Femme", other:"\uD83E\uDDD1 Autre",
    session:"Session", dangerZone:"Zone Dangereuse",
    didYouReach:"Avez-vous contact\u00E9", yes:"Oui! \uD83C\uDF89", notYet:"Pas encore", skip:"Passer",
    birthdayPassed:"L\u2019anniversaire est pass\u00E9!", reachedOut:"Vous avez contact\u00E9 \u2714",
    recapTitle:"Votre Ann\u00E9e en Anniversaires \uD83C\uDF81", recapShare:"Partager",
    celebrated:"Anniversaires c\u00E9l\u00E9br\u00E9s", reachedOutCount:"Personnes contact\u00E9es",
    missedCount:"Contact manqu\u00E9", upcomingSoon:"Dans les 30 prochains jours",
    busiestMonth:"Mois le plus charg\u00E9", milestoneCount:"Anniversaires marquants",
    widgetTitle:"Prochains", milestone:"marquant",
    recap:"Bilan", viewRecap:"Voir le Bilan",
    turns:"f\u00EAte ses",
  },
  es: {
    upcoming:"Pr\u00F3ximos", all:"Todos", addNew:"Agregar", alerts:"Alertas", settings:"Ajustes",
    upcomingBirthdays:"Pr\u00F3ximos Cumplea\u00F1os", allBirthdays:"Todos los Cumplea\u00F1os",
    addBirthday:"Agregar Cumplea\u00F1os", alertsIntegrations:"Alertas e Integraciones",
    birthdaysTracked:"rastreados", noBirthdaysYet:"\u00A1Sin cumplea\u00F1os a\u00FAn!",
    addFirstHint:"Haz clic en \"Agregar\" para empezar", noResults:"No se encontraron resultados.",
    search:"Buscar\u2026", addDesc:"Agrega un cumplea\u00F1os y nunca lo olvidar\u00E1s.",
    pickAvatar:"Elige un avatar", name:"Nombre", namePlaceholder:"ej. Mam\u00E1, Jake, Abuela\u2026",
    birthdayLabel:"Cumplea\u00F1os", month:"Mes", day:"D\u00EDa", year:"A\u00F1o (opcional)",
    note:"Nota (opcional)", notePlaceholder:"ej. Le encantan los girasoles\u2026",
    remindMe:"Recordarme", saving:"Guardando\u2026", addBirthdayBtn:"Agregar Cumplea\u00F1os",
    signOut:"Cerrar sesi\u00F3n", lightMode:"Modo Claro", darkMode:"Modo Oscuro",
    themeDesc:"Alternar entre claro y oscuro",
    notifications:"Notificaciones", emailReminders:"Recordatorios por email",
    pushNotifications:"Notificaciones push", inAppAlerts:"Alertas en la app",
    deleteAll:"Eliminar Todos los Cumplea\u00F1os", fontStyle:"Fuente", language:"Idioma",
    nextBirthday:"Pr\u00F3ximo cumplea\u00F1os", allUpcoming:"Todos los pr\u00F3ximos",
    today:"HOY \uD83C\uDF89", tomorrow:"Ma\u00F1ana", synced:"Sincronizado",
    profile:"Perfil", appearance:"Apariencia", displayName:"Nombre visible", gender:"G\u00E9nero",
    male:"\uD83D\uDC68 Hombre", female:"\uD83D\uDC69 Mujer", other:"\uD83E\uDDD1 Otro",
    session:"Sesi\u00F3n", dangerZone:"Zona Peligrosa",
    didYouReach:"\u00BFContactaste a", yes:"\u00A1S\u00ED! \uD83C\uDF89", notYet:"Todav\u00EDa no", skip:"Omitir",
    birthdayPassed:"\u00A1El cumplea\u00F1os pas\u00F3!", reachedOut:"Contactaste \u2714",
    recapTitle:"Tu A\u00F1o en Cumplea\u00F1os \uD83C\uDF81", recapShare:"Compartir",
    celebrated:"Cumplea\u00F1os celebrados", reachedOutCount:"Personas contactadas",
    missedCount:"Contacto perdido", upcomingSoon:"En los pr\u00F3ximos 30 d\u00EDas",
    busiestMonth:"Mes m\u00E1s activo", milestoneCount:"Cumplea\u00F1os especiales",
    widgetTitle:"Pr\u00F3ximos", milestone:"especial",
    recap:"Resumen", viewRecap:"Ver Resumen",
    turns:"cumple",
  },
  ar: {
    upcoming:"\u0627\u0644\u0642\u0627\u062F\u0645\u0629", all:"\u0627\u0644\u0643\u0644", addNew:"\u0625\u0636\u0627\u0641\u0629", alerts:"\u062A\u0646\u0628\u064A\u0647\u0627\u062A", settings:"\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A",
    upcomingBirthdays:"\u0623\u0639\u064A\u0627\u062F \u0627\u0644\u0645\u064A\u0644\u0627\u062F \u0627\u0644\u0642\u0627\u062F\u0645\u0629", allBirthdays:"\u062C\u0645\u064A\u0639 \u0623\u0639\u064A\u0627\u062F \u0627\u0644\u0645\u064A\u0644\u0627\u062F",
    addBirthday:"\u0625\u0636\u0627\u0641\u0629 \u0639\u064A\u062F \u0645\u064A\u0644\u0627\u062F", alertsIntegrations:"\u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0648\u0627\u0644\u062A\u0643\u0627\u0645\u0644\u0627\u062A",
    birthdaysTracked:"\u0645\u062A\u062A\u0628\u0639\u0629", noBirthdaysYet:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0639\u064A\u0627\u062F \u0645\u064A\u0644\u0627\u062F \u0628\u0639\u062F!",
    addFirstHint:"\u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \"\u0625\u0636\u0627\u0641\u0629\" \u0644\u0644\u0628\u062F\u0621", noResults:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C.",
    search:"\u0628\u062D\u062B\u2026", addDesc:"\u0623\u0636\u0641 \u0639\u064A\u062F \u0645\u064A\u0644\u0627\u062F \u0648\u0644\u0646 \u062A\u0646\u0633\u0627\u0647 \u0623\u0628\u062F\u0627\u064B.",
    pickAvatar:"\u0627\u062E\u062A\u0631 \u0635\u0648\u0631\u0629", name:"\u0627\u0644\u0627\u0633\u0645", namePlaceholder:"\u0645\u062B\u0627\u0644: \u0623\u0645\u064A\u060C \u062C\u064A\u0643\u060C \u062C\u062F\u062A\u064A\u2026",
    birthdayLabel:"\u0639\u064A\u062F \u0627\u0644\u0645\u064A\u0644\u0627\u062F", month:"\u0627\u0644\u0634\u0647\u0631", day:"\u0627\u0644\u064A\u0648\u0645", year:"\u0627\u0644\u0633\u0646\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)",
    note:"\u0645\u0644\u0627\u062D\u0638\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)", notePlaceholder:"\u0645\u062B\u0627\u0644: \u064A\u062D\u0628 \u062F\u0648\u0627\u0631 \u0627\u0644\u0634\u0645\u0633\u2026",
    remindMe:"\u0630\u0643\u0651\u0631\u0646\u064A", saving:"\u062C\u0627\u0631\u0650 \u0627\u0644\u062D\u0641\u0638\u2026", addBirthdayBtn:"\u0625\u0636\u0627\u0641\u0629 \u0639\u064A\u062F \u0627\u0644\u0645\u064A\u0644\u0627\u062F",
    signOut:"\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C", lightMode:"\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0641\u0627\u062A\u062D", darkMode:"\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062F\u0627\u0643\u0646",
    themeDesc:"\u0627\u0644\u062A\u0628\u062F\u064A\u0644 \u0628\u064A\u0646 \u0627\u0644\u0641\u0627\u062A\u062D \u0648\u0627\u0644\u062F\u0627\u0643\u0646",
    notifications:"\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A", emailReminders:"\u062A\u0630\u0643\u064A\u0631\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
    pushNotifications:"\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u062F\u0641\u0639", inAppAlerts:"\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u062A\u0637\u0628\u064A\u0642",
    deleteAll:"\u062D\u0630\u0641 \u062C\u0645\u064A\u0639 \u0623\u0639\u064A\u0627\u062F \u0627\u0644\u0645\u064A\u0644\u0627\u062F", fontStyle:"\u0627\u0644\u062E\u0637", language:"\u0627\u0644\u0644\u063A\u0629",
    nextBirthday:"\u0639\u064A\u062F \u0627\u0644\u0645\u064A\u0644\u0627\u062F \u0627\u0644\u0642\u0627\u062F\u0645", allUpcoming:"\u062C\u0645\u064A\u0639 \u0627\u0644\u0642\u0627\u062F\u0645\u0629",
    today:"\u0627\u0644\u064A\u0648\u0645 \uD83C\uDF89", tomorrow:"\u063A\u062F\u0627\u064B", synced:"\u0645\u062A\u0632\u0627\u0645\u0646",
    profile:"\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A", appearance:"\u0627\u0644\u0645\u0638\u0647\u0631", displayName:"\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0631\u0648\u0636", gender:"\u0627\u0644\u062C\u0646\u0633",
    male:"\u0630\u0643\u0631", female:"\u0623\u0646\u062B\u0649", other:"\u0622\u062E\u0631",
    session:"\u0627\u0644\u062C\u0644\u0633\u0629", dangerZone:"\u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u062E\u0637\u0631\u0629",
    didYouReach:"\u0647\u0644 \u062A\u0648\u0627\u0635\u0644\u062A \u0645\u0639", yes:"\u0646\u0639\u0645! \uD83C\uDF89", notYet:"\u0644\u064A\u0633 \u0628\u0639\u062F", skip:"\u062A\u062E\u0637\u064A",
    birthdayPassed:"\u0645\u0631 \u0639\u064A\u062F \u0627\u0644\u0645\u064A\u0644\u0627\u062F!", reachedOut:"\u062A\u0648\u0627\u0635\u0644\u062A \u2714",
    recapTitle:"\u0639\u0627\u0645\u0643 \u0641\u064A \u0623\u0639\u064A\u0627\u062F \u0627\u0644\u0645\u064A\u0644\u0627\u062F \uD83C\uDF81", recapShare:"\u0645\u0634\u0627\u0631\u0643\u0629",
    celebrated:"\u0623\u0639\u064A\u0627\u062F \u062A\u0645 \u0627\u0644\u0627\u062D\u062A\u0641\u0627\u0644 \u0628\u0647\u0627", reachedOutCount:"\u0645\u0631\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644",
    missedCount:"\u062A\u0648\u0627\u0635\u0644 \u0641\u0627\u0626\u062A", upcomingSoon:"\u062E\u0644\u0627\u0644 30 \u064A\u0648\u0645\u0627\u064B",
    busiestMonth:"\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0623\u0643\u062B\u0631 \u0646\u0634\u0627\u0637\u0627\u064B", milestoneCount:"\u0623\u0639\u064A\u0627\u062F \u0645\u0645\u064A\u0632\u0629",
    widgetTitle:"\u0642\u0627\u062F\u0645\u0627\u064B", milestone:"\u0645\u0645\u064A\u0632",
    recap:"\u0645\u0644\u062E\u0635", viewRecap:"\u0639\u0631\u0636 \u0627\u0644\u0645\u0644\u062E\u0635",
    turns:"\u064A\u0628\u0644\u063A",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────
function useT(lang) { return TRANSLATIONS[lang] || TRANSLATIONS.en; }

function daysUntil(month, day) {
  const now  = new Date();
  const next = new Date(now.getFullYear(), month - 1, day);
  if (next <= now) next.setFullYear(now.getFullYear() + 1);
  return Math.round((next - now) / 86400000);
}

function daysSince(month, day) {
  const now  = new Date();
  const last = new Date(now.getFullYear(), month - 1, day);
  if (last > now) last.setFullYear(now.getFullYear() - 1);
  return Math.round((now - last) / 86400000);
}

function urgencyColor(d) {
  if (d <= 1)  return "#FF4D6D";
  if (d <= 7)  return "#FF4D6D";
  if (d <= 21) return "#FF9000";
  return "#00C9A7";
}

function urgencyLabel(d, t) {
  if (d === 0) return t.today;
  if (d === 1) return t.tomorrow;
  if (d <= 7)  return `${d}d away`;
  return `${d} days`;
}

function isNight() { const h = new Date().getHours(); return h >= 19 || h < 6; }

function launchConfetti() {
  const colors = ["#FF4D6D","#FF9000","#00C9A7","#4A9EF0","#FFD700","#FF8FA3"];
  for (let i = 0; i < 100; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.cssText = `left:${Math.random()*100}vw;background:${colors[~~(Math.random()*colors.length)]};width:${Math.random()*8+6}px;height:${Math.random()*8+6}px;border-radius:${Math.random()>.5?"50%":"2px"};animation-duration:${Math.random()*2+1.5}s;animation-delay:${Math.random()*.5}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

async function sendBirthdayReminder(toEmail, person, daysUntilBday) {
  try {
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
      to_email:toEmail, name:person.name, days:daysUntilBday,
      date:`${MONTHS_FULL[person.month-1]} ${person.day}`,
      age:person.year?new Date().getFullYear()-person.year:"?",
      note:person.note||"No note added",
    });
    return true;
  } catch(e) { console.error("EmailJS:",e); return false; }
}

// ── CSS ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap');
@import url('https://use.fontawesome.com/releases/v6.5.1/css/all.css');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%}
body{font-family:'Cabinet Grotesk',system-ui,sans-serif;overflow:hidden}

/* Night stars */
@keyframes twinkle{0%,100%{opacity:0.1}50%{opacity:var(--op,0.8)}}
.star{position:absolute;border-radius:50%;background:#fff;animation:twinkle var(--d,3s) ease-in-out infinite;animation-delay:var(--dl,0s)}
/* Comet */
@keyframes comet{0%{opacity:0;transform:translateX(0) translateY(0) rotate(-20deg)}8%{opacity:1}92%{opacity:0.7}100%{opacity:0;transform:translateX(-110vw) translateY(30px) rotate(-20deg)}}
.comet{position:absolute;height:2px;background:linear-gradient(to left,transparent,rgba(255,255,255,0.9),white);border-radius:99px;filter:drop-shadow(0 0 4px #fff);animation:comet var(--d,8s) linear infinite;animation-delay:var(--dl,0s);opacity:0}
/* Birds */
@keyframes birdfly{0%{opacity:0;transform:translateX(-80px) translateY(0)}5%{opacity:1}50%{transform:translateX(45vw) translateY(var(--vy,-20px))}95%{opacity:0.9}100%{opacity:0;transform:translateX(110vw) translateY(0)}}
@keyframes wingflap{0%{transform:scaleY(1) rotate(-5deg)}100%{transform:scaleY(0.4) rotate(5deg)}}
.bird{position:absolute;font-size:var(--sz,18px);animation:birdfly var(--d,10s) linear infinite;animation-delay:var(--dl,0s);opacity:0;display:inline-block;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2))}
.wing{display:inline-block;animation:wingflap 0.3s ease-in-out infinite alternate}

/* Auth */
@property --a{syntax:'<angle>';inherits:false;initial-value:0deg}
.auth-page{min-height:100vh;width:100vw;background:#25252b;display:flex;flex-direction:column;justify-content:flex-start;align-items:center;padding:40px 20px 20px;gap:20px;position:relative;overflow-y:auto;overflow-x:hidden}
.auth-blob-1{position:absolute;top:-80px;left:-80px;width:500px;height:500px;background:radial-gradient(circle,rgba(255,39,112,0.1),transparent 70%);filter:blur(60px);animation:float 18s ease-in-out infinite alternate;pointer-events:none}
.auth-blob-2{position:absolute;bottom:0;right:-60px;width:400px;height:400px;background:radial-gradient(circle,rgba(69,243,255,0.07),transparent 70%);filter:blur(60px);animation:float 22s ease-in-out infinite alternate-reverse;pointer-events:none}
.auth-logo{position:relative;z-index:10;text-align:center;animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both}
.auth-logo-icon{font-size:42px;margin-bottom:4px;display:block}
.auth-logo-title{font-family:'Instrument Serif',serif;font-size:34px;background:linear-gradient(135deg,#ff2770,#45f3ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.auth-logo-sub{font-size:12px;color:#666;margin-top:3px;font-family:'DM Mono',monospace;letter-spacing:.05em}
.box{position:relative;width:420px;height:210px;background:repeating-conic-gradient(from var(--a),#ff2770 0%,#ff2770 5%,transparent 5%,transparent 40%,#ff2770 50%);filter:drop-shadow(0 15px 50px #000);border-radius:20px;animation:rotating 4s linear infinite;display:flex;justify-content:center;align-items:center;transition:.5s;z-index:10;cursor:pointer;margin:0 auto}
@keyframes rotating{0%{--a:0deg}100%{--a:360deg}}
.box::before{content:"";position:absolute;width:100%;height:100%;background:repeating-conic-gradient(from var(--a),#45f3ff 0%,#45f3ff 5%,transparent 5%,transparent 40%,#45f3ff 50%);filter:drop-shadow(0 15px 50px #000);border-radius:20px;animation:rotating 4s linear infinite;animation-delay:-1s}
.box::after{content:"";position:absolute;inset:4px;background:#2d2d39;border-radius:15px;border:8px solid #25252b}
.box.expanded{width:460px;height:540px}
.box.expanded .login{inset:40px}
.box.expanded .loginBx{transform:translateY(0)}
.login{position:absolute;inset:60px;display:flex;justify-content:center;align-items:center;flex-direction:column;border-radius:10px;background:rgba(0,0,0,.2);color:#fff;z-index:1000;box-shadow:inset 0 10px 20px rgba(0,0,0,.5);border-bottom:2px solid rgba(255,255,255,.5);transition:.5s;overflow:hidden}
.loginBx{position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;gap:14px;width:78%;transform:translateY(110px);transition:.5s}
.loginBx h2{text-transform:uppercase;font-weight:700;letter-spacing:.15em;font-family:'Poppins',sans-serif;font-size:18px;color:#fff}
.loginBx h2 i{color:#ff2770;text-shadow:0 0 5px #ff2770,0 0 20px #ff2770}
.auth-mode-switch{display:flex;background:rgba(255,255,255,.06);border-radius:30px;padding:3px;width:100%;gap:4px}
.auth-mode-btn{flex:1;padding:8px 0;border-radius:26px;border:none;cursor:pointer;font-family:'Poppins',sans-serif;font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;transition:all .3s;background:transparent;color:#888}
.auth-mode-btn.active{background:linear-gradient(135deg,#ff2770,#ff5a88);color:#fff;box-shadow:0 4px 18px rgba(255,39,112,.4)}
.loginBx input[type="email"],.loginBx input[type="password"]{width:100%;padding:10px 18px;outline:none;border:2px solid rgba(255,255,255,.3);font-size:.9em;color:#fff;background:rgba(0,0,0,.15);border-radius:30px;font-family:'Poppins',sans-serif;transition:border-color .3s,box-shadow .3s}
.loginBx input:focus{border-color:#45f3ff;box-shadow:0 0 12px rgba(69,243,255,.25)}
.loginBx input::placeholder{color:#888}
.auth-submit-btn{width:100%;padding:11px 20px;border:none;font-size:.95em;color:#111;background:#45f3ff;border-radius:30px;font-weight:700;cursor:pointer;transition:.4s;font-family:'Poppins',sans-serif;letter-spacing:.05em;text-transform:uppercase}
.auth-submit-btn:hover{box-shadow:0 0 10px #45f3ff,0 0 40px rgba(69,243,255,.5)}
.auth-submit-btn:disabled{opacity:.6;cursor:not-allowed}
.auth-links{width:100%;display:flex;justify-content:space-between;font-size:12px;font-family:'Poppins',sans-serif}
.auth-links a{color:#fff;text-decoration:none;cursor:pointer}
.auth-links a:last-child{color:#ff2770;font-weight:600}
.auth-hint{font-family:'Poppins',sans-serif;font-size:14px;color:#fff;letter-spacing:.05em;text-transform:uppercase;font-weight:600;text-align:center;background:rgba(255,39,112,.2);border:1px solid rgba(255,39,112,.4);padding:8px 20px;border-radius:30px;animation:pulse-text 1.5s ease-in-out infinite}
@keyframes pulse-text{0%,100%{opacity:.6}50%{opacity:1}}
.auth-msg{width:100%;padding:9px 14px;border-radius:20px;font-size:12px;font-family:'Poppins',sans-serif;line-height:1.4;text-align:center}
.auth-msg.success{background:rgba(0,201,167,.15);border:1px solid rgba(0,201,167,.3);color:#00C9A7}
.auth-msg.error{background:rgba(255,39,112,.12);border:1px solid rgba(255,39,112,.3);color:#ff2770}

/* App */
.app-shell{display:flex;height:100vh;width:100vw;overflow:hidden;transition:background .4s}
.ambient-bg{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.sidebar{width:220px;flex-shrink:0;display:flex;flex-direction:column;padding:24px 14px;border-right:1px solid;transition:background .4s,border-color .4s;z-index:10;position:relative}
.sidebar-logo{display:flex;align-items:center;gap:10px;padding:0 8px;margin-bottom:32px}
.sidebar-logo-icon{font-size:26px}
.sidebar-logo-text{font-family:'Instrument Serif',serif;font-size:22px;background:linear-gradient(135deg,#FF4D6D,#FF8FA3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sidebar-nav{display:flex;flex-direction:column;gap:4px;flex:1}
.nav-btn{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:14px;border:none;cursor:pointer;font-family:inherit;font-size:14px;font-weight:600;transition:all .2s;text-align:left;width:100%;background:transparent}
.nav-btn.active{background:linear-gradient(135deg,rgba(255,77,109,.18),rgba(255,77,109,.08));color:#FF4D6D;box-shadow:inset 0 0 0 1px rgba(255,77,109,.25)}
.nav-btn .nav-icon{font-size:18px;width:22px;text-align:center}
.sidebar-footer{margin-top:auto;padding-top:16px;border-top:1px solid rgba(255,255,255,.06)}
.user-chip{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px}
.user-avatar{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#FF4D6D,#FF9000);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.user-email{font-size:11px;font-family:'DM Mono',monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px}
.main-content{flex:1;min-width:0;width:0;display:flex;flex-direction:column;overflow:hidden;position:relative;z-index:2}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:18px 28px;border-bottom:1px solid;flex-shrink:0;transition:border-color .4s}
.topbar-title{font-family:'Instrument Serif',serif;font-size:26px;background:linear-gradient(135deg,#FF4D6D,#FF8FA3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.topbar-count{font-size:12px;font-family:'DM Mono',monospace;margin-top:2px}
.content-area{flex:1;overflow-y:auto;padding:24px 28px 28px;width:100%;box-sizing:border-box}
.content-area::-webkit-scrollbar{width:4px}
.content-area::-webkit-scrollbar-track{background:transparent}
.content-area::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:99px}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;width:100%}

/* Mobile */
.mobile-nav{display:none}
@media(max-width:768px){
  .app-shell{flex-direction:column}
  .sidebar{display:none}
  .main-content{flex:1;width:100%;min-width:0}
  .topbar{padding:12px 16px}
  .topbar-title{font-size:20px}
  .content-area{padding:14px 12px 110px}
  .cards-grid{grid-template-columns:1fr}
  .mobile-nav{display:flex;position:fixed;bottom:0;left:0;right:0;height:68px;background:rgba(13,13,26,.97);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.06);align-items:center;justify-content:space-around;padding:0 4px 8px;z-index:100}
  .mobile-nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;border:none;background:transparent;padding:6px 10px;flex:1}
  .mobile-nav-icon{font-size:20px;opacity:.4;transition:opacity .2s}
  .mobile-nav-label{font-size:9px;font-weight:700;letter-spacing:.06em;color:#444;font-family:'DM Mono',monospace;text-transform:uppercase}
  .mobile-nav-btn.active .mobile-nav-icon{opacity:1}
  .mobile-nav-btn.active .mobile-nav-label{color:#FF4D6D}
  .mobile-nav-dot{width:16px;height:2px;border-radius:99px;background:#FF4D6D;box-shadow:0 0 8px rgba(255,77,109,.6);margin-top:1px}
  .box{width:92vw;max-width:360px}
  .box.expanded{width:92vw;max-width:400px;height:520px}
  .countdown-widget{display:none}
}

/* Glowy button */
:root{--gx:200;--gy:400;--gxp:.5;--gsize:130px}
.glowy-btn{--hue:calc(340 + (var(--gxp)*60));--glow:radial-gradient(50% 50% at center,hsl(var(--hue) 90% 75%),hsl(var(--hue) 80% 60%),transparent) calc(var(--gx)*1px - var(--gsize)*.5) calc(var(--gy)*1px - var(--gsize)*.5)/var(--gsize) var(--gsize) no-repeat fixed;--btn-bg:#0f0f1a;width:100%;padding:15px;border-radius:14px;border:3px solid transparent;background:linear-gradient(var(--btn-bg),var(--btn-bg)) padding-box,var(--glow),linear-gradient(#000,#000) border-box;box-shadow:0 1px rgba(255,255,255,.1) inset;cursor:pointer;position:relative;font-family:inherit;font-size:15px;font-weight:800;letter-spacing:.03em;transition:background-size .2s}
.glowy-btn::before{content:"";position:absolute;inset:0;background:var(--btn-bg);z-index:2;border-radius:12px;box-shadow:0 1px rgba(255,255,255,.1) inset}
.glowy-btn::after{content:"";position:absolute;inset:-3px;filter:blur(18px);border:3px solid transparent;background:var(--glow);border-radius:14px}
.glowy-btn span{background:var(--glow),white;background-clip:text;-webkit-background-clip:text;color:transparent;position:relative;z-index:3}
.glowy-btn:active{--gsize:280px}
.glowy-btn:disabled{opacity:.6;cursor:not-allowed}

/* BB8 Toggle - condensed */
.bb8-toggle{--toggle-size:11px;--toggle-width:10.625em;--toggle-height:5.625em;--toggle-offset:calc((var(--toggle-height) - var(--bb8-diameter))/2);--toggle-bg:linear-gradient(#2c4770,#070e2b 35%,#628cac 50% 70%,#a6c5d4) no-repeat;--bb8-diameter:4.375em;--radius:99em;--transition:.4s;--accent:#de7d2f;--bb8-bg:#fff;cursor:pointer;font-size:var(--toggle-size);display:inline-block}
.bb8-toggle,.bb8-toggle *,.bb8-toggle *::before,.bb8-toggle *::after{box-sizing:border-box}
.bb8-toggle__checkbox{appearance:none;display:none}
.bb8-toggle__container{width:var(--toggle-width);height:var(--toggle-height);background:var(--toggle-bg);background-size:100% 11.25em;background-position-y:-5.625em;border-radius:var(--radius);position:relative;transition:var(--transition)}
.bb8{display:flex;flex-direction:column;align-items:center;position:absolute;top:calc(var(--toggle-offset) - 1.688em + .188em);left:var(--toggle-offset);transition:var(--transition);z-index:2}
.bb8__head-container{position:relative;transition:var(--transition);z-index:2;transform-origin:1.25em 3.75em}
.bb8__head{overflow:hidden;margin-bottom:-.188em;width:2.5em;height:1.688em;background:linear-gradient(transparent .063em,dimgray .063em .313em,transparent .313em .375em,var(--accent) .375em .5em,transparent .5em 1.313em,silver 1.313em 1.438em,transparent 1.438em),linear-gradient(45deg,transparent .188em,var(--bb8-bg) .188em 1.25em,transparent 1.25em),linear-gradient(-45deg,transparent .188em,var(--bb8-bg) .188em 1.25em,transparent 1.25em),linear-gradient(var(--bb8-bg) 1.25em,transparent 1.25em);border-radius:var(--radius) var(--radius) 0 0;position:relative;z-index:1;filter:drop-shadow(0 .063em .125em gray)}
.bb8__head::before{content:"";position:absolute;width:.563em;height:.563em;background:radial-gradient(.125em circle at .25em .375em,red,transparent),radial-gradient(.063em circle at .375em .188em,var(--bb8-bg) 50%,transparent 100%),linear-gradient(45deg,#000 .188em,dimgray .313em .375em,#000 .5em);border-radius:var(--radius);top:.413em;left:50%;transform:translate(-50%);box-shadow:0 0 0 .089em lightgray,.563em .281em 0 -.148em,.563em .281em 0 -.1em var(--bb8-bg),.563em .281em 0 -.063em;z-index:1;transition:var(--transition)}
.bb8__head::after{content:"";position:absolute;bottom:.375em;left:0;width:100%;height:.188em;background:linear-gradient(to right,var(--accent) .125em,transparent .125em .188em,var(--accent) .188em .313em,transparent .313em .375em,var(--accent) .375em .938em,transparent .938em 1em,var(--accent) 1em 1.125em,transparent 1.125em 1.875em,var(--accent) 1.875em 2em,transparent 2em 2.063em,var(--accent) 2.063em 2.25em,transparent 2.25em 2.313em,var(--accent) 2.313em 2.375em,transparent 2.375em 2.438em,var(--accent));transition:var(--transition)}
.bb8__antenna{position:absolute;transform:translateY(-90%);width:.059em;border-radius:var(--radius) var(--radius) 0 0;transition:var(--transition)}
.bb8__antenna:nth-child(1){height:.938em;right:.938em;background:linear-gradient(#000 .188em,silver .188em)}
.bb8__antenna:nth-child(2){height:.375em;left:50%;transform:translate(-50%,-90%);background:silver}
.bb8__body{width:4.375em;height:4.375em;border-radius:var(--radius);position:relative;overflow:hidden;transition:var(--transition);z-index:1;transform:rotate(45deg);background:linear-gradient(-90deg,var(--bb8-bg) 4%,var(--accent) 4% 10%,transparent 10% 90%,var(--accent) 90% 96%,var(--bb8-bg) 96%),linear-gradient(var(--bb8-bg) 4%,var(--accent) 4% 10%,transparent 10% 90%,var(--accent) 90% 96%,var(--bb8-bg) 96%),linear-gradient(to right,transparent 2.156em,silver 2.156em 2.219em,transparent 2.188em),linear-gradient(transparent 2.156em,silver 2.156em 2.219em,transparent 2.188em);background-color:var(--bb8-bg)}
.bb8__body::after{content:"";bottom:1.5em;left:.563em;position:absolute;width:.188em;height:.188em;background:rgb(236,236,236);border-radius:50%;box-shadow:.875em .938em,0 -1.25em,.875em -2.125em,2.125em -2.125em,3.063em -1.25em,3.063em 0,2.125em .938em}
.bb8__body::before{content:"";width:2.625em;height:2.625em;position:absolute;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);border:.313em solid var(--accent);background:radial-gradient(1em circle at center,rgb(236,236,236) 50%,transparent 51%),radial-gradient(1.25em circle at center,var(--bb8-bg) 50%,transparent 51%),linear-gradient(-90deg,transparent 42%,var(--accent) 42% 58%,transparent 58%),linear-gradient(var(--bb8-bg) 42%,var(--accent) 42% 58%,var(--bb8-bg) 58%)}
.artificial__hidden{position:absolute;border-radius:inherit;inset:0;pointer-events:none;overflow:hidden}
.bb8__shadow{width:var(--bb8-diameter);height:20%;border-radius:50%;background:#3a271c;opacity:.25;position:absolute;bottom:0;left:calc(var(--toggle-offset) - .938em);transition:var(--transition);transform:skew(-70deg);z-index:1}
.bb8-toggle__scenery{width:100%;height:100%;pointer-events:none;overflow:hidden;position:relative;border-radius:inherit}
.bb8-toggle__scenery::before{content:"";position:absolute;width:100%;height:30%;bottom:0;background:#b18d71;z-index:1}
.bb8-toggle__cloud{z-index:1;position:absolute;border-radius:50%}
.bb8-toggle__cloud:nth-last-child(1){width:.875em;height:.625em;filter:blur(.125em) drop-shadow(.313em .313em #ffffffae) drop-shadow(-.625em 0 #fff) drop-shadow(-.938em -.125em #fff);right:1.875em;top:2.813em;background:linear-gradient(to top right,#ffffffae,#ffffffae);transition:var(--transition)}
.bb8-toggle__cloud:nth-last-child(2){top:.625em;right:4.375em;width:.875em;height:.375em;background:#dfdedeae;filter:blur(.125em) drop-shadow(-.313em -.188em #e0dfdfae);transition:.6s}
.bb8-toggle__cloud:nth-last-child(3){top:1.25em;right:.938em;width:.875em;height:.375em;background:#ffffffae;filter:blur(.125em) drop-shadow(.438em .188em #ffffffae);transition:.8s}
.gomrassen,.hermes,.chenini{position:absolute;border-radius:var(--radius);background:linear-gradient(#fff,#6e8ea2);top:100%}
.gomrassen{left:.938em;width:1.875em;height:1.875em;transition:var(--transition)}
.gomrassen::before,.gomrassen::after{content:"";position:absolute;border-radius:inherit;background:rgb(184,196,200)}
.gomrassen::before{left:.313em;top:.313em;width:.438em;height:.438em}
.gomrassen::after{width:.25em;height:.25em;left:1.25em;top:.75em}
.hermes{left:3.438em;width:.625em;height:.625em;transition:.6s}
.chenini{left:4.375em;width:.5em;height:.5em;transition:.8s}
.tatto-1,.tatto-2{position:absolute;width:1.25em;height:1.25em;border-radius:var(--radius)}
.tatto-1{background:#fefefe;right:3.125em;top:.625em;transition:var(--transition)}
.tatto-2{background:linear-gradient(#e6ac5c,#d75449);right:1.25em;top:2.188em;transition:.7s}
.bb8-toggle__star{position:absolute;width:.063em;height:.063em;background:#fff;border-radius:var(--radius);top:100%}
.bb8-toggle__star:nth-child(1){left:3.75em;box-shadow:1.25em .938em,-1.25em 2.5em,0 1.25em,1.875em .625em,-3.125em 1.875em,1.25em 2.813em;transition:.2s}
.bb8-toggle__star:nth-child(2){left:4.688em;box-shadow:.625em 0,0 .625em,-.625em -.625em,.625em .938em,-3.125em 1.25em,1.25em -1.563em;transition:.3s}
.bb8-toggle__star:nth-child(3){left:5.313em;box-shadow:-.625em -.625em,-2.188em 1.25em,-2.188em 0,-3.75em -.625em,-3.125em -.625em,-2.5em -.313em,.75em -.625em;transition:var(--transition)}
.bb8-toggle__star:nth-child(4){left:1.875em;width:.125em;height:.125em;transition:.5s}
.bb8-toggle__star:nth-child(5){left:5em;width:.125em;height:.125em;transition:.6s}
.bb8-toggle__star:nth-child(6){left:2.5em;width:.125em;height:.125em;transition:.7s}
.bb8-toggle__star:nth-child(7){left:3.438em;width:.125em;height:.125em;transition:.8s}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(1){top:.625em}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(2){top:1.875em}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(3){top:1.25em}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(4){top:3.438em}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(5){top:3.438em}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(6){top:.313em}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(7){top:1.875em}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__cloud{right:-100%}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .gomrassen{top:.938em}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .hermes{top:2.5em}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .chenini{top:2.75em}
.bb8-toggle__checkbox:checked+.bb8-toggle__container{background-position-y:0}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .tatto-1{top:100%}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .tatto-2{top:100%}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8{left:calc(100% - var(--bb8-diameter) - var(--toggle-offset))}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8__shadow{left:calc(100% - var(--bb8-diameter) - var(--toggle-offset) + .938em);transform:skew(70deg)}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8__body{transform:rotate(225deg)}
.bb8-toggle__checkbox:hover+.bb8-toggle__container .bb8__head::before{left:100%}
.bb8-toggle__checkbox:not(:checked):hover+.bb8-toggle__container .bb8__antenna:nth-child(1){right:1.5em}
.bb8-toggle__checkbox:hover+.bb8-toggle__container .bb8__antenna:nth-child(2){left:.938em}
.bb8-toggle__checkbox:checked:hover+.bb8-toggle__container .bb8__head::before{left:0}
.bb8-toggle__checkbox:checked:hover+.bb8-toggle__container .bb8__antenna:nth-child(2){left:calc(100% - .938em)}
.bb8-toggle__checkbox:active+.bb8-toggle__container .bb8__head-container{transform:rotate(25deg)}
.bb8-toggle__checkbox:checked:active+.bb8-toggle__container .bb8__head-container{transform:rotate(-25deg)}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes toastIn{from{opacity:0;transform:translate(-50%,16px) scale(.95)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(255,77,109,.4)}70%{box-shadow:0 0 0 10px rgba(255,77,109,0)}100%{box-shadow:0 0 0 0 rgba(255,77,109,0)}}
@keyframes confetti-fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
.confetti-piece{position:fixed;top:0;animation:confetti-fall linear forwards;z-index:9999;pointer-events:none}
.bday-card{transition:transform .18s ease,box-shadow .18s ease}
.bday-card:hover{transform:translateY(-3px)}
.delete-btn{opacity:0;transition:opacity .2s}
.bday-card:hover .delete-btn{opacity:1}
.ring-fill{transition:stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)}
.bp-input:focus{outline:none;border-color:rgba(255,77,109,.5)!important;box-shadow:0 0 0 3px rgba(255,77,109,.12)}
.remind-chip{transition:all .15s}
.remind-chip.active-chip{border-color:#FF4D6D!important;background:rgba(255,77,109,.15)!important;color:#FF4D6D!important}
.bp-toggle{width:38px;height:22px;border-radius:99px;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0}
.bp-toggle-knob{position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.3)}
.reset-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:99999;animation:fadeUp .2s ease both;padding:20px}
.reset-modal{background:#1a1a2e;border:1px solid rgba(255,39,112,.3);border-radius:24px;padding:36px 32px;width:100%;max-width:400px;box-shadow:0 24px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.04)}
.reset-modal h3{font-family:'Instrument Serif',serif;font-size:26px;background:linear-gradient(135deg,#ff2770,#45f3ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px}
.reset-modal p{font-size:13px;color:#666;margin-bottom:22px;font-family:'Poppins',sans-serif;line-height:1.5}
.reset-input{width:100%;padding:13px 18px;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.12);border-radius:14px;color:#fff;font-size:14px;font-family:'Poppins',sans-serif;outline:none;margin-bottom:12px;transition:border-color .2s,box-shadow .2s}
.reset-input:focus{border-color:#45f3ff;box-shadow:0 0 0 3px rgba(69,243,255,.12)}
.reset-input::placeholder{color:#555}
.reset-btn-primary{width:100%;padding:13px;background:linear-gradient(135deg,#ff2770,#ff5a88);border:none;border-radius:14px;color:#fff;font-size:14px;font-weight:700;font-family:'Poppins',sans-serif;cursor:pointer;transition:.3s;letter-spacing:.04em;margin-bottom:10px}
.reset-btn-primary:hover{box-shadow:0 0 20px rgba(255,39,112,.4)}
.reset-btn-primary:disabled{opacity:.6;cursor:not-allowed}
.reset-btn-ghost{width:100%;padding:11px;background:transparent;border:1px solid rgba(255,255,255,.1);border-radius:14px;color:#666;font-size:13px;font-family:'Poppins',sans-serif;cursor:pointer;transition:.2s}
.reset-btn-ghost:hover{border-color:rgba(255,255,255,.2);color:#aaa}
.strength-bar{height:4px;border-radius:99px;background:rgba(255,255,255,.08);margin-bottom:12px;overflow:hidden}
.strength-fill{height:100%;border-radius:99px;transition:width .3s,background .3s}

/* Quick Log */
.quicklog-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:8000;padding:20px;animation:fadeUp .25s ease both}
.quicklog-box{background:linear-gradient(135deg,#0d0d1a,#1a1228);border:1px solid rgba(0,201,167,.25);border-radius:24px;padding:32px;width:100%;max-width:360px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.5)}

/* Recap Modal */
.recap-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;z-index:8000;padding:20px;animation:fadeUp .3s ease both}
.recap-box{background:linear-gradient(135deg,#080810,#180a20);border:1px solid rgba(255,77,109,.2);border-radius:28px;padding:36px 28px;width:100%;max-width:430px;text-align:center;box-shadow:0 32px 80px rgba(0,0,0,.6);overflow-y:auto;max-height:90vh}
.recap-stat{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:14px 16px;margin-bottom:10px;text-align:left;animation:fadeUp .4s ease both}

/* Countdown Widget */
.countdown-widget{position:fixed;bottom:24px;right:24px;width:210px;background:rgba(10,10,22,.96);border:1px solid rgba(255,77,109,.2);border-radius:18px;padding:14px 16px;box-shadow:0 8px 32px rgba(0,0,0,.5);backdrop-filter:blur(20px);z-index:40;animation:fadeUp .4s ease both}
.widget-row{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.widget-row:last-child{border-bottom:none}

/* Milestone badge */
.ms-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:99px;font-size:10px;font-weight:700;font-family:'DM Mono',monospace;margin-top:3px}
`;

// ══════════════════════════════════════════════════════════════
// ── AMBIENT SCENE (Stars/Comets at night, Birds during day) ──
// ══════════════════════════════════════════════════════════════
function AmbientScene({ light }) {
  const night = isNight() && !light;

  const stars = useMemo(() => Array.from({length:50}, (_,i) => ({
    id:i, x:Math.random()*100, y:Math.random()*80,
    w: Math.random()*2.5+0.5,
    d:(Math.random()*3+1.5).toFixed(1)+"s",
    dl:(Math.random()*5).toFixed(1)+"s",
    op:(Math.random()*0.7+0.3).toFixed(2),
  })), []);

  const comets = useMemo(() => Array.from({length:5}, (_,i) => ({
    id:i, top:10+Math.random()*40,
    width: 80+Math.random()*120,
    d:(Math.random()*7+5).toFixed(1)+"s",
    dl:(Math.random()*20+i*6).toFixed(1)+"s",
    right:Math.random()*50+10,
  })), []);

  const birds = useMemo(() => Array.from({length:8}, (_,i) => ({
    id:i, top:5+Math.random()*40,
    sz:(14+Math.random()*10).toFixed(0)+"px",
    d:(8+Math.random()*10).toFixed(1)+"s",
    dl:(Math.random()*25+i*4).toFixed(1)+"s",
    vy:(-(Math.random()*40+5)).toFixed(0)+"px",
  })), []);

  return (
    <div className="ambient-bg">
      {/* Glowing blobs */}
      <div style={{position:"absolute",top:-100,left:-100,width:500,height:500,background:"radial-gradient(circle,rgba(255,77,109,0.06),transparent 70%)",filter:"blur(60px)",animation:"float 18s ease-in-out infinite alternate"}}/>
      <div style={{position:"absolute",bottom:-60,right:-60,width:400,height:400,background:"radial-gradient(circle,rgba(255,144,0,0.05),transparent 70%)",filter:"blur(60px)",animation:"float 22s ease-in-out infinite alternate-reverse"}}/>

      {night ? (
        <>
          {stars.map(s=>(
            <div key={s.id} className="star" style={{left:`${s.x}%`,top:`${s.y}%`,width:s.w,height:s.w,"--d":s.d,"--dl":s.dl,"--op":s.op}}/>
          ))}
          {comets.map(c=>(
            <div key={c.id} className="comet" style={{top:`${c.top}%`,right:`${c.right}%`,width:c.width,"--d":c.d,"--dl":c.dl}}/>
          ))}
        </>
      ) : (
        <>
          {birds.map(b=>(
            <div key={b.id} className="bird" style={{top:`${b.top}%`,"--sz":b.sz,"--d":b.d,"--dl":b.dl,"--vy":b.vy}}>
              <span className="wing">🐦</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── Basic Components ──────────────────────────────────────────────────────
function Spinner() {
  return <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:"80px 0"}}><div style={{width:40,height:40,border:"3px solid rgba(255,77,109,0.2)",borderTop:"3px solid #FF4D6D",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/></div>;
}

function BB8Toggle({ checked, onChange }) {
  return (
    <label className="bb8-toggle">
      <input className="bb8-toggle__checkbox" type="checkbox" checked={checked} onChange={onChange}/>
      <div className="bb8-toggle__container">
        <div className="bb8-toggle__scenery">
          {[...Array(7)].map((_,i)=><div key={i} className="bb8-toggle__star"/>)}
          <div className="tatto-1"/><div className="tatto-2"/>
          <div className="gomrassen"/><div className="hermes"/><div className="chenini"/>
          <div className="bb8-toggle__cloud"/><div className="bb8-toggle__cloud"/><div className="bb8-toggle__cloud"/>
        </div>
        <div className="bb8"><div className="bb8__head-container"><div className="bb8__antenna"/><div className="bb8__antenna"/><div className="bb8__head"/></div><div className="bb8__body"/></div>
        <div className="artificial__hidden"><div className="bb8__shadow"/></div>
      </div>
    </label>
  );
}

function ToggleSwitch({ on, onToggle, color="#FF4D6D" }) {
  return <div className="bp-toggle" onClick={onToggle} style={{background:on?color:"rgba(255,255,255,0.12)"}}><div className="bp-toggle-knob" style={{left:on?19:3}}/></div>;
}

function GlowyButton({ onClick, children, disabled }) {
  useEffect(()=>{
    const fn=e=>{document.documentElement.style.setProperty("--gx",e.clientX);document.documentElement.style.setProperty("--gy",e.clientY);document.documentElement.style.setProperty("--gxp",(e.clientX/window.innerWidth).toFixed(2));};
    window.addEventListener("pointermove",fn); return()=>window.removeEventListener("pointermove",fn);
  },[]);
  return <button className="glowy-btn" onClick={onClick} disabled={disabled}><span>{children}</span></button>;
}

// ── Reset Password Modal ──────────────────────────────────────────────────
function ResetPasswordModal({ onClose, onSuccess, forceMode }) {
  const [step,setStep]=useState(forceMode||"request");
  const [email,setEmail]=useState(""); const [pw,setPw]=useState(""); const [pw2,setPw2]=useState("");
  const [loading,setLoading]=useState(false); const [msg,setMsg]=useState(""); const [mt,setMt]=useState("error");

  useEffect(()=>{
    if(forceMode) return;
    const {data:{subscription}}=supabase.auth.onAuthStateChange((ev)=>{if(ev==="PASSWORD_RECOVERY") setStep("update");});
    return()=>subscription.unsubscribe();
  },[]);

  const str=p=>{let s=0;if(p.length>=8)s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return s;};
  const sc=["#FF4D6D","#FF9000","#FFD700","#00C9A7"],sl=["Too short","Weak","Good","Strong"],s=str(pw);
  const ms={padding:"10px 14px",borderRadius:12,marginBottom:12,fontSize:13,fontFamily:"'Poppins',sans-serif",lineHeight:1.4,
    background:mt==="success"?"rgba(0,201,167,0.12)":"rgba(255,39,112,0.12)",
    border:`1px solid ${mt==="success"?"rgba(0,201,167,0.3)":"rgba(255,39,112,0.3)"}`,
    color:mt==="success"?"#00C9A7":"#ff2770"};

  const handleReq=async()=>{if(!email){setMsg("Please enter your email.");setMt("error");return;}setLoading(true);setMsg("");const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});if(error){setMsg("❌ "+error.message);setMt("error");}else{setMsg("✅ Check your inbox! Click the link then come back here.");setMt("success");}setLoading(false);};
  const handleUpd=async()=>{if(pw.length<6){setMsg("Password must be at least 6 characters.");setMt("error");return;}if(pw!==pw2){setMsg("Passwords do not match.");setMt("error");return;}setLoading(true);setMsg("");const{error}=await supabase.auth.updateUser({password:pw});if(error){setMsg("❌ "+error.message);setMt("error");}else{setMsg("✅ Password updated! Logging you in…");setMt("success");setTimeout(()=>{if(onSuccess)onSuccess();else onClose();},1800);}setLoading(false);};

  return (
    <div className="reset-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="reset-modal">
        <div style={{fontSize:36,marginBottom:8}}>{step==="request"?"🔐":"🔑"}</div>
        <h3>{step==="request"?"Forgot Password":"Set New Password"}</h3>
        <p>{step==="request"?"Enter your email and we'll send a reset link.":"Choose a strong new password."}</p>
        {step==="request"?(
          <><input className="reset-input" type="email" placeholder="✉ Your email address" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleReq()}/>{msg&&<div style={ms}>{msg}</div>}<button className="reset-btn-primary" onClick={handleReq} disabled={loading}>{loading?"Sending…":"📧 Send Reset Link"}</button><button className="reset-btn-ghost" onClick={onClose}>← Back to Login</button></>
        ):(
          <><input className="reset-input" type="password" placeholder="🔒 New password" value={pw} onChange={e=>setPw(e.target.value)}/>{pw.length>0&&(<><div className="strength-bar"><div className="strength-fill" style={{width:`${s*25}%`,background:sc[s-1]||"#333"}}/></div><div style={{fontSize:11,color:sc[s-1]||"#555",fontFamily:"'DM Mono',monospace",marginBottom:12,marginTop:-8}}>{sl[s-1]||"Type a password"}</div></>)}<input className="reset-input" type="password" placeholder="🔒 Confirm new password" value={pw2} onChange={e=>setPw2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleUpd()}/>{msg&&<div style={ms}>{msg}</div>}<button className="reset-btn-primary" onClick={handleUpd} disabled={loading}>{loading?"Updating…":"✅ Update Password"}</button><button className="reset-btn-ghost" onClick={onClose}>{forceMode?"🚪 Sign out instead":"Cancel"}</button></>
        )}
      </div>
    </div>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────────────
function AuthScreen() {
  const [expanded,setExpanded]=useState(false);const [mode,setMode]=useState("login");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [loading,setLoading]=useState(false);const [msg,setMsg]=useState("");const [showReset,setShowReset]=useState(false);
  const handleSubmit=async()=>{setMsg("");setLoading(true);try{if(mode==="signup"){const{error}=await supabase.auth.signUp({email,password});if(error)throw error;setMsg("✅ Check your email to confirm!");}else{const{error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;}}catch(e){setMsg("❌ "+e.message);}setLoading(false);};
  return (
    <div className="auth-page">
      <style>{CSS}</style>
      <div className="auth-blob-1"/><div className="auth-blob-2"/>
      <div className="auth-logo"><span className="auth-logo-icon">🎂</span><div className="auth-logo-title">BirthdayPal</div><div className="auth-logo-sub">Never miss a birthday again</div></div>
      {!expanded&&<div style={{position:"relative",zIndex:10,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><div className="auth-hint">✨ Tap the box below to log in ✨</div><div style={{fontSize:26,color:"#ff2770",animation:"float 1.2s ease-in-out infinite"}}>↓</div></div>}
      <div className={`box${expanded?" expanded":""}`} onClick={()=>!expanded&&setExpanded(true)}>
        <div className="login"><div className="loginBx">
          <h2><i className="fa-solid fa-cake-candles" style={{marginRight:8}}/>{mode==="login"?"Log In":"Sign Up"}<i className="fa-solid fa-heart" style={{marginLeft:8}}/></h2>
          {expanded&&<div className="auth-mode-switch">{["login","signup"].map(m=><button key={m} className={`auth-mode-btn${mode===m?" active":""}`} onClick={e=>{e.stopPropagation();setMode(m);setMsg("")}}>{m==="login"?"Log In":"Sign Up"}</button>)}</div>}
          {!expanded&&<div style={{fontSize:13,color:"#aaa",fontFamily:"'Poppins',sans-serif",letterSpacing:".05em"}}>Tap to expand</div>}
          {expanded&&<><input type="email" placeholder="✉ Email" value={email} onChange={e=>setEmail(e.target.value)} onClick={e=>e.stopPropagation()}/><input type="password" placeholder="🔒 Password" value={password} onChange={e=>setPassword(e.target.value)} onClick={e=>e.stopPropagation()} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>{msg&&<div className={`auth-msg ${msg.startsWith("✅")?"success":"error"}`}>{msg}</div>}<button className="auth-submit-btn" disabled={loading} onClick={e=>{e.stopPropagation();handleSubmit();}}>{loading?"Please wait…":mode==="login"?"🚀 LOG IN":"🎉 CREATE ACCOUNT"}</button><div className="auth-links" onClick={e=>e.stopPropagation()}><a onClick={e=>{e.stopPropagation();setShowReset(true);}}>Forgot Password?</a><a onClick={()=>{setMode(mode==="login"?"signup":"login");setMsg("");}}>{mode==="login"?"Sign up free →":"← Back to login"}</a></div></>}
        </div></div>
      </div>
      {expanded&&<div onClick={()=>{setExpanded(false);setMsg("");}} style={{position:"relative",zIndex:10,fontSize:12,color:"#555",cursor:"pointer",fontFamily:"'Poppins',sans-serif"}} onMouseEnter={e=>e.target.style.color="#ff2770"} onMouseLeave={e=>e.target.style.color="#555"}>↑ Collapse</div>}
      {showReset&&<ResetPasswordModal onClose={()=>setShowReset(false)}/>}
    </div>
  );
}

// ── Countdown Ring ────────────────────────────────────────────────────────
function CountdownRing({ days, name, avatar, color, light, t }) {
  const r=44,circ=2*Math.PI*r,pct=Math.max(0,Math.min(1,1-days/365));
  return (
    <div style={{background:light?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.05)",border:`1px solid ${light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.08)"}`,borderRadius:20,padding:"20px 22px",display:"flex",alignItems:"center",gap:18,boxShadow:light?"0 2px 20px rgba(0,0,0,0.07)":"none",animation:"fadeUp .5s ease both",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:`radial-gradient(circle,${color}22,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"relative",width:100,height:100,flexShrink:0}}>
        <svg width="100" height="100" style={{transform:"rotate(-90deg)"}}>
          <circle cx="50" cy="50" r={r} fill="none" stroke={light?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.06)"} strokeWidth="6"/>
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} className="ring-fill" style={{filter:`drop-shadow(0 0 6px ${color}88)`}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:28,lineHeight:1}}>{avatar}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:light?"#777":"#aaa",marginTop:2}}>{days===0?t.today:`${days}d`}</span>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color,marginBottom:4}}>{t.nextBirthday}</div>
        <div style={{fontFamily:"'Instrument Serif',serif",fontSize:22,color:light?"#111":"#F0ECF8",lineHeight:1.2,marginBottom:8}}>{name}</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${color}18`,border:`1px solid ${color}33`,borderRadius:99,padding:"4px 12px"}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:color,animation:days<=7?"pulse-ring 1.5s infinite":"none",display:"inline-block"}}/>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color,fontWeight:500}}>{urgencyLabel(days,t)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Quick Log Modal ───────────────────────────────────────────────────────
function QuickLogModal({ person, t, onLog, onDismiss }) {
  return (
    <div className="quicklog-overlay" onClick={e=>e.target===e.currentTarget&&onDismiss()}>
      <div className="quicklog-box">
        <div style={{fontSize:48,marginBottom:10}}>🎂</div>
        <div style={{fontFamily:"'Instrument Serif',serif",fontSize:22,color:"#F0ECF8",marginBottom:6}}>{t.birthdayPassed}</div>
        <div style={{fontSize:14,color:"#aaa",marginBottom:22,lineHeight:1.6}}>
          {t.didYouReach} <strong style={{color:"#F0ECF8"}}>{person.name}</strong>?
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>onLog(true)} style={{padding:"12px 22px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#00C9A7,#00a589)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t.yes}</button>
          <button onClick={()=>onLog(false)} style={{padding:"12px 22px",borderRadius:14,border:"1px solid rgba(255,255,255,0.12)",background:"transparent",color:"#aaa",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>{t.notYet}</button>
          <button onClick={onDismiss} style={{padding:"12px 20px",borderRadius:14,border:"1px solid rgba(255,255,255,0.06)",background:"transparent",color:"#555",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{t.skip}</button>
        </div>
      </div>
    </div>
  );
}

// ── Annual Recap Modal ────────────────────────────────────────────────────
function RecapModal({ people, t, onClose }) {
  const year = new Date().getFullYear();
  const logs = JSON.parse(localStorage.getItem("quickLogs")||"{}");
  const reached = Object.entries(logs).filter(([k,v])=>k.endsWith(`_${year}`)&&v===true).length;
  const missed  = Object.entries(logs).filter(([k,v])=>k.endsWith(`_${year}`)&&v===false).length;
  const upcoming30 = people.filter(p=>{ const d=daysUntil(p.month,p.day); return d>=0&&d<=30; }).length;
  const msByMonth = Array(12).fill(0); people.forEach(p=>msByMonth[p.month-1]++);
  const topMonthIdx = msByMonth.indexOf(Math.max(...msByMonth));
  const topMonth = MONTHS_FULL[topMonthIdx]||"—";
  const milestones = people.filter(p=>getMilestone(p.year)).length;

  const share = () => {
    const txt = `🎂 My ${year} BirthdayPal Wrapped!\n✅ ${people.length} birthdays tracked\n💬 Reached out to ${reached} people\n🌟 ${milestones} milestone birthdays\n📅 Busiest month: ${topMonth}\n\n#BirthdayPal`;
    if(navigator.share){ navigator.share({title:"BirthdayPal Wrapped",text:txt}); }
    else { navigator.clipboard?.writeText(txt).then(()=>alert("Copied to clipboard!")); }
  };

  const stats = [
    {icon:"🎂",label:t.celebrated,       val:people.length, color:"#FF4D6D"},
    {icon:"💬",label:t.reachedOutCount,   val:reached,       color:"#00C9A7"},
    {icon:"😶",label:t.missedCount,       val:missed,        color:"#FF9000"},
    {icon:"⭐",label:t.milestoneCount,    val:milestones,    color:"#FFD700"},
    {icon:"📅",label:t.upcomingSoon,      val:upcoming30,    color:"#4A9EF0"},
    {icon:"🗓",label:t.busiestMonth,      val:topMonth,      color:"#A855F7"},
  ];

  return (
    <div className="recap-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="recap-box">
        <div style={{fontSize:52,marginBottom:10}}>🎁</div>
        <div style={{fontFamily:"'Instrument Serif',serif",fontSize:26,background:"linear-gradient(135deg,#FF4D6D,#FF9000)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginBottom:4}}>{t.recapTitle}</div>
        <div style={{fontSize:11,color:"#555",marginBottom:24,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em"}}>{year} · BirthdayPal</div>
        {stats.map((s,i)=>(
          <div key={i} className="recap-stat" style={{animationDelay:`${i*70}ms`}}>
            <div style={{width:44,height:44,borderRadius:14,background:`${s.color}18`,border:`1.5px solid ${s.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontSize:22,fontWeight:800,color:s.color,fontFamily:"'DM Mono',monospace",lineHeight:1}}>{s.val}</div>
              <div style={{fontSize:12,color:"#666",marginTop:2}}>{s.label}</div>
            </div>
          </div>
        ))}
        <button onClick={share} style={{width:"100%",marginTop:16,padding:"14px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#FF4D6D,#FF9000)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.03em"}}>🔗 {t.recapShare}</button>
        <button onClick={onClose} style={{width:"100%",marginTop:10,padding:"12px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#666",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
      </div>
    </div>
  );
}

// ── Countdown Widget ──────────────────────────────────────────────────────
function CountdownWidget({ people, light, t }) {
  const top3 = [...people].map(p=>({...p,d:daysUntil(p.month,p.day)})).sort((a,b)=>a.d-b.d).slice(0,3);
  if(!top3.length) return null;
  return (
    <div className="countdown-widget">
      <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",fontWeight:700,color:"#FF4D6D",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>📅 {t.widgetTitle}</div>
      {top3.map(p=>{
        const col=urgencyColor(p.d);
        const ms=getMilestone(p.year);
        return(
          <div key={p.id} className="widget-row">
            <span style={{fontSize:18,flexShrink:0}}>{p.avatar}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,color:"#F0ECF8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
              {ms&&<div style={{fontSize:9,color:ms.color,marginTop:1}}>{ms.emoji} {ms.label}</div>}
            </div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,color:col,flexShrink:0,marginLeft:6}}>
              {p.d===0?t.today:p.d===1?t.tomorrow:`${p.d}d`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Birthday Card ─────────────────────────────────────────────────────────
function BirthdayCard({ person, light, delay=0, onDelete, onQuickLog, t }) {
  const d = daysUntil(person.month, person.day);
  const since = daysSince(person.month, person.day);
  const justPassed = since >= 0 && since <= 3; // passed 0-3 days ago
  const ms = getMilestone(person.year);
  const cardColor = ms ? ms.color : urgencyColor(d);
  const age = person.year ? new Date().getFullYear() - person.year : null;
  const logs = JSON.parse(localStorage.getItem("quickLogs")||"{}");
  const logKey = `${person.id}_${new Date().getFullYear()}`;
  const logged = logs[logKey];

  return (
    <div className="bday-card" style={{background:light?"rgba(255,255,255,0.92)":"rgba(255,255,255,0.04)",border:`1.5px solid ${ms?ms.color+"44":light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.06)"}`,borderRadius:18,padding:"16px 18px",boxShadow:ms?`0 0 0 1px ${ms.color}22,${light?"0 2px 20px rgba(0,0,0,0.08)":"none"}`:light?"0 2px 14px rgba(0,0,0,0.06)":"none",animation:`slideIn 0.35s ease both`,animationDelay:`${delay}ms`,position:"relative"}}>
      <div style={{position:"absolute",left:0,top:16,bottom:16,width:3,background:cardColor,borderRadius:"0 4px 4px 0",opacity:0.9}}/>
      <div style={{display:"flex",alignItems:"center",gap:14,paddingLeft:8}}>
        <div style={{width:52,height:52,borderRadius:16,flexShrink:0,background:`linear-gradient(135deg,${cardColor}22,${cardColor}10)`,border:`1.5px solid ${cardColor}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>
          {person.avatar}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
            <span style={{fontFamily:"'Instrument Serif',serif",fontSize:18,color:light?"#111":"#F0ECF8"}}>
              {person.name}
              {age?<span style={{fontSize:12,color:ms?ms.color:light?"#bbb":"#666",marginLeft:7,fontWeight:ms?700:400}}>{t.turns} {age}</span>:null}
            </span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:500,color:cardColor,background:`${cardColor}15`,padding:"3px 10px",borderRadius:99,border:`1px solid ${cardColor}30`}}>{justPassed?`${since}d ago`:urgencyLabel(d,t)}</span>
              <button className="delete-btn" onClick={()=>onDelete(person.id)} style={{background:"rgba(255,77,109,0.12)",border:"1px solid rgba(255,77,109,0.25)",borderRadius:8,color:"#FF4D6D",fontSize:13,cursor:"pointer",padding:"3px 8px"}}>🗑</button>
            </div>
          </div>
          <div style={{fontSize:12,color:light?"#aaa":"#666",marginBottom:4}}>🎂 {MONTHS_FULL[person.month-1]} {person.day}</div>
          {/* Milestone badge */}
          {ms&&<div className="ms-badge" style={{background:ms.color+"18",border:`1px solid ${ms.color}33`,color:ms.color}}>{ms.emoji} {ms.label}</div>}
          {person.note&&<div style={{fontSize:12,color:light?"#bbb":"#555",fontStyle:"italic",fontFamily:"'Instrument Serif',serif",marginTop:4}}>"{person.note}"</div>}
          {/* Quick log prompt */}
          {justPassed&&logged===undefined&&(
            <div style={{marginTop:8,display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:light?"#aaa":"#666"}}>{t.didYouReach} {person.name}?</span>
              <button onClick={()=>onQuickLog(person.id,true)} style={{fontSize:11,padding:"3px 10px",borderRadius:99,border:"1px solid #00C9A722",background:"rgba(0,201,167,0.1)",color:"#00C9A7",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>{t.yes}</button>
              <button onClick={()=>onQuickLog(person.id,false)} style={{fontSize:11,padding:"3px 9px",borderRadius:99,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:light?"#999":"#555",cursor:"pointer",fontFamily:"inherit"}}>{t.notYet}</button>
            </div>
          )}
          {justPassed&&logged===true&&<div style={{marginTop:6,fontSize:11,color:"#00C9A7"}}>✅ {t.reachedOut}</div>}
          {justPassed&&logged===false&&<div style={{marginTop:6,fontSize:11,color:"#FF9000"}}>⏳ {t.notYet}</div>}
        </div>
      </div>
    </div>
  );
}

// ── Add Form ──────────────────────────────────────────────────────────────
function AddForm({ onAdd, light, t }) {
  const [name,setName]=useState("");const [month,setMonth]=useState("");const [day,setDay]=useState("");
  const [year,setYear]=useState("");const [note,setNote]=useState("");const [remind,setRemind]=useState("1 week");
  const [avatar,setAvatar]=useState("🎂");const [saving,setSaving]=useState(false);
  const avatarOptions=["🎂","👩","🧑","👨","👧","👦","👴","👵","🌟","💫","🎉","🎊"];
  const inp={width:"100%",padding:"12px 16px",background:light?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)",border:`1px solid ${light?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.09)"}`,borderRadius:12,color:light?"#111":"#F0ECF8",fontSize:14,fontFamily:"inherit",marginBottom:12,display:"block"};
  const lbl={fontSize:10,color:light?"#aaa":"#666",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5,display:"block",fontFamily:"'DM Mono',monospace",fontWeight:500};
  const currentYear=new Date().getFullYear();
  const handleSubmit=async()=>{
    if(!name||!month||!day){alert("Please fill in name, month and day!");return;}
    const y=year?Number(year):null;
    if(y&&(y<1900||y>currentYear)){alert(`Year must be between 1900 and ${currentYear}`);return;}
    setSaving(true);
    await onAdd(name,Number(month),Number(day),y,note,avatar,remind);
    setName("");setMonth("");setDay("");setYear("");setNote("");setAvatar("🎂");setRemind("1 week");
    setSaving(false);
  };
  return (
    <div style={{maxWidth:560,animation:"fadeUp .3s ease both"}}>
      <p style={{color:light?"#999":"#666",fontSize:14,marginBottom:24,lineHeight:1.6}}>{t.addDesc}</p>
      <label style={lbl}>{t.pickAvatar}</label>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {avatarOptions.map(a=><button key={a} onClick={()=>setAvatar(a)} style={{width:42,height:42,borderRadius:12,fontSize:20,background:avatar===a?"rgba(255,77,109,0.15)":light?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)",border:`1.5px solid ${avatar===a?"#FF4D6D":light?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)"}`,cursor:"pointer",transition:"all .15s",transform:avatar===a?"scale(1.12)":"scale(1)"}}>{a}</button>)}
      </div>
      <label style={lbl}>{t.name}</label>
      <input className="bp-input" style={inp} placeholder={t.namePlaceholder} value={name} onChange={e=>setName(e.target.value)}/>
      <label style={lbl}>{t.birthdayLabel}</label>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
        <select className="bp-input" value={month} onChange={e=>setMonth(e.target.value)} style={{...inp,marginBottom:0}}>
          <option value="">{t.month}</option>
          {MONTHS_FULL.map((m,i)=><option key={m} value={i+1}>{m}</option>)}
        </select>
        <input className="bp-input" style={{...inp,marginBottom:0}} type="number" placeholder={t.day} min={1} max={31} value={day} onChange={e=>setDay(e.target.value)}/>
        <input className="bp-input" style={{...inp,marginBottom:0}} type="number" placeholder={t.year} min={1900} max={currentYear} value={year} onChange={e=>setYear(e.target.value)}/>
      </div>
      <label style={lbl}>{t.note}</label>
      <input className="bp-input" style={inp} placeholder={t.notePlaceholder} value={note} onChange={e=>setNote(e.target.value)}/>
      <label style={lbl}>{t.remindMe}</label>
      <div style={{display:"flex",gap:6,marginBottom:24}}>
        {["1 day","3 days","1 week","2 weeks"].map(o=><button key={o} className={`remind-chip ${remind===o?"active-chip":""}`} onClick={()=>setRemind(o)} style={{flex:1,padding:"8px 4px",borderRadius:10,cursor:"pointer",border:`1px solid ${remind===o?"#FF4D6D":light?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.08)"}`,background:remind===o?"rgba(255,77,109,0.12)":light?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.04)",color:remind===o?"#FF4D6D":light?"#888":"#666",fontSize:12,fontFamily:"'DM Mono',monospace",fontWeight:500}}>{o}</button>)}
      </div>
      <div style={{maxWidth:300}}><GlowyButton onClick={handleSubmit} disabled={saving}>{saving?t.saving:`🎉 ${t.addBirthdayBtn}`}</GlowyButton></div>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────
function SettingsTab({ light, onToggle, user, onSignOut, onClearAll, font, onFontChange, lang, onLangChange, profile, onProfileChange, t }) {
  const [notifs,setNotifs]=useState({email:true,push:true,inapp:true});
  const [editName,setEditName]=useState(profile?.name||"");
  const [editGender,setEditGender]=useState(profile?.gender||"");
  const [imgPreview,setImgPreview]=useState(profile?.image||"");
  const [nameSaved,setNameSaved]=useState(false);
  const card={background:light?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.04)",border:`1px solid ${light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)"}`,borderRadius:20,padding:"20px 22px",marginBottom:14,boxShadow:light?"0 2px 14px rgba(0,0,0,0.06)":"none"};
  const lbl={fontSize:10,color:light?"#bbb":"#555",textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'DM Mono',monospace",fontWeight:500,marginBottom:14};
  const inp={width:"100%",padding:"11px 14px",background:light?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.06)",border:`1px solid ${light?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)"}`,borderRadius:12,color:light?"#111":"#F0ECF8",fontSize:14,fontFamily:"inherit",outline:"none"};
  const gA={male:"👨",female:"👩",other:"🧑"};
  const isEmoji=!imgPreview;
  const profileAvatar=imgPreview||gA[editGender]||"👤";

  const handleImg=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setImgPreview(ev.target.result);onProfileChange({name:editName,gender:editGender,image:ev.target.result});};r.readAsDataURL(f);};
  const saveProfile=()=>{onProfileChange({name:editName,gender:editGender,image:imgPreview});setNameSaved(true);setTimeout(()=>setNameSaved(false),2000);};
  const changeGender=g=>{setEditGender(g);if(!imgPreview)onProfileChange({name:editName,gender:g,image:""});};

  return (
    <div style={{maxWidth:600,animation:"fadeUp .3s ease both"}}>

      {/* Profile */}
      <div style={card}>
        <div style={lbl}>👤 {t.profile}</div>
        <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:20}}>
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#FF4D6D22,#FF900022)",border:"2px solid #FF4D6D44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:isEmoji?36:0,overflow:"hidden"}}>
              {isEmoji?profileAvatar:<img src={imgPreview} alt="profile" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
            </div>
            <label style={{position:"absolute",bottom:-6,right:-6,width:24,height:24,borderRadius:"50%",background:"#FF4D6D",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,boxShadow:"0 2px 8px rgba(255,77,109,0.5)"}}>
              📷<input type="file" accept="image/*" onChange={handleImg} style={{display:"none"}}/>
            </label>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:light?"#111":"#F0ECF8",marginBottom:2}}>{editName||"Add your name"}</div>
            <div style={{fontSize:11,color:"#00C9A7",marginBottom:6}}>✅ {user?.email}</div>
            {imgPreview&&<button onClick={()=>{setImgPreview("");onProfileChange({name:editName,gender:editGender,image:""}); }} style={{fontSize:10,color:"#FF4D6D",background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"inherit"}}>✕ Remove photo</button>}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,color:light?"#aaa":"#666",marginBottom:6,fontFamily:"'DM Mono',monospace"}}>{t.displayName.toUpperCase()}</div>
          <div style={{display:"flex",gap:8}}>
            <input style={inp} value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Your name…" onKeyDown={e=>e.key==="Enter"&&saveProfile()}/>
            <button onClick={saveProfile} style={{padding:"11px 16px",borderRadius:12,border:"none",background:nameSaved?"#00C9A7":"#FF4D6D",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,transition:"background .3s",whiteSpace:"nowrap",fontFamily:"inherit"}}>{nameSaved?"✅ Saved":"Save"}</button>
          </div>
        </div>
        <div>
          <div style={{fontSize:11,color:light?"#aaa":"#666",marginBottom:8,fontFamily:"'DM Mono',monospace"}}>{t.gender.toUpperCase()}</div>
          <div style={{display:"flex",gap:8}}>
            {[["male",t.male,"#4A9EF0"],["female",t.female,"#FF4D6D"],["other",t.other,"#00C9A7"]].map(([g,label,col])=>(
              <button key={g} onClick={()=>changeGender(g)} style={{flex:1,padding:"10px 4px",borderRadius:12,border:`1.5px solid ${editGender===g?col:light?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.08)"}`,background:editGender===g?col+"18":"transparent",color:editGender===g?col:light?"#888":"#666",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .2s",fontFamily:"inherit"}}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div style={card}>
        <div style={lbl}>🎨 {t.appearance}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,paddingBottom:18,borderBottom:`1px solid ${light?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.06)"}`}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:light?"#222":"#ddd"}}>{light?`☀️ ${t.lightMode}`:`🌙 ${t.darkMode}`}</div>
            <div style={{fontSize:12,color:light?"#aaa":"#666",marginTop:2}}>{t.themeDesc}</div>
          </div>
          <BB8Toggle checked={!light} onChange={onToggle}/>
        </div>
        <div>
          <div style={{fontSize:11,color:light?"#aaa":"#666",marginBottom:10,fontFamily:"'DM Mono',monospace"}}>{t.fontStyle.toUpperCase()}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {FONT_OPTIONS.map(f=>(
              <button key={f.id} onClick={()=>onFontChange(f.id)} style={{padding:"12px 14px",borderRadius:12,border:`1.5px solid ${font===f.id?"#FF4D6D":light?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)"}`,background:font===f.id?"rgba(255,77,109,0.1)":light?"rgba(0,0,0,0.03)":"rgba(255,255,255,0.03)",cursor:"pointer",textAlign:"left",transition:"all .2s",fontFamily:f.family}}>
                <div style={{fontSize:14,fontWeight:700,color:font===f.id?"#FF4D6D":light?"#222":"#ddd"}}>{f.label}</div>
                <div style={{fontSize:11,color:font===f.id?"#FF4D6D88":light?"#bbb":"#555",marginTop:2}}>{f.preview}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Language */}
      <div style={card}>
        <div style={lbl}>🌍 {t.language}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {LANG_OPTIONS.map(l=>(
            <button key={l.id} onClick={()=>onLangChange(l.id)} style={{padding:"12px 14px",borderRadius:12,border:`1.5px solid ${lang===l.id?"#FF4D6D":light?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)"}`,background:lang===l.id?"rgba(255,77,109,0.1)":light?"rgba(0,0,0,0.03)":"rgba(255,255,255,0.03)",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .2s"}}>
              <span style={{fontSize:20}}>{l.flag}</span>
              <span style={{fontSize:13,fontWeight:600,color:lang===l.id?"#FF4D6D":light?"#333":"#ccc"}}>{l.label}</span>
              {lang===l.id&&<span style={{marginLeft:"auto",fontSize:10,color:"#FF4D6D"}}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div style={card}>
        <div style={lbl}>🔔 {t.notifications}</div>
        {[["\u2709\uFE0F",t.emailReminders,"email","#4A9EF0"],["🔔",t.pushNotifications,"push","#FF4D6D"],["📱",t.inAppAlerts,"inapp","#00C9A7"]].map(([ic,lb,key,col])=>(
          <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:14,fontWeight:500,color:light?"#333":"#ccc"}}>{ic} {lb}</div>
            <ToggleSwitch on={notifs[key]} color={col} onToggle={()=>setNotifs(p=>({...p,[key]:!p[key]}))}/>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <div style={card}>
        <div style={lbl}>🚪 {t.session}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:light?"#333":"#ccc"}}>Sign out of BirthdayPal</div>
            <div style={{fontSize:12,color:light?"#aaa":"#666",marginTop:2}}>You can always log back in</div>
          </div>
          <button onClick={onSignOut} style={{padding:"10px 20px",borderRadius:10,border:"1px solid rgba(255,77,109,0.3)",background:"rgba(255,77,109,0.08)",color:"#FF4D6D",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>🚪 {t.signOut}</button>
        </div>
      </div>

      {/* Danger zone */}
      <div style={card}>
        <div style={lbl}>⚠️ {t.dangerZone}</div>
        <button onClick={onClearAll} style={{padding:"11px 22px",borderRadius:10,border:"1px solid rgba(255,77,109,0.3)",background:"rgba(255,77,109,0.08)",color:"#FF4D6D",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🗑 {t.deleteAll}</button>
      </div>
    </div>
  );
}

// ── Alerts Tab ────────────────────────────────────────────────────────────
function AlertsTab({ light, t }) {
  const card={background:light?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.04)",border:`1px solid ${light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)"}`,borderRadius:20,padding:"18px 22px",marginBottom:12,boxShadow:light?"0 2px 14px rgba(0,0,0,0.06)":"none"};
  const integrations=[
    {icon:"📧",name:"EmailJS",desc:"Sends real email reminders to your Gmail",color:"#4A9EF0",status:"Connected ✅"},
    {icon:"🔔",name:"Push Notifications",desc:"Browser alerts when app is open",color:"#FF4D6D",status:"Enabled"},
    {icon:"📅",name:"Google Calendar",desc:"Export birthdays as recurring events",color:"#00C9A7",status:"Coming soon"},
    {icon:"🤖",name:"Claude AI",desc:"Generate personalised birthday messages",color:"#FF9000",status:"Coming soon"},
  ];
  return (
    <div style={{maxWidth:600}}>
      <p style={{color:light?"#999":"#666",fontSize:14,marginBottom:24,lineHeight:1.6}}>{t.alertsIntegrations}</p>
      {integrations.map((intg,i)=>(
        <div key={intg.name} style={{...card,animation:`slideIn .35s ease both`,animationDelay:`${i*60}ms`}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:52,height:52,borderRadius:16,flexShrink:0,background:`${intg.color}18`,border:`1.5px solid ${intg.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{intg.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:700,color:light?"#111":"#F0ECF8",marginBottom:3}}>{intg.name}</div>
              <div style={{fontSize:13,color:light?"#aaa":"#666"}}>{intg.desc}</div>
            </div>
            <span style={{fontSize:10,fontFamily:"'DM Mono',monospace",padding:"4px 12px",borderRadius:99,fontWeight:600,flexShrink:0,background:["Not connected","Coming soon"].includes(intg.status)?"rgba(255,255,255,0.05)":`${intg.color}18`,border:`1px solid ${["Not connected","Coming soon"].includes(intg.status)?"rgba(255,255,255,0.08)":`${intg.color}35`}`,color:["Not connected","Coming soon"].includes(intg.status)?light?"#aaa":"#555":intg.color}}>{intg.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────
function buildNav(t) {
  return [
    { id:"Upcoming", icon:"🎂" },
    { id:"All",      icon:"📋" },
    { id:"Add",      icon:"➕" },
    { id:"Alerts",   icon:"🔔" },
    { id:"Settings", icon:"⚙️" },
  ];
}

// ════════════════════════════════════════════════════════════
// ── MAIN APP ─────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════
export default function App() {
  const [session,   setSession]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [people,    setPeople]    = useState([]);
  const [tab,       setTab]       = useState("Upcoming");
  const [light,     setLight]     = useState(()=>localStorage.getItem("theme")==="light");
  const [toast,     setToast]     = useState(null);
  const [fetching,  setFetching]  = useState(false);
  const [search,    setSearch]    = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [font,      setFont]      = useState(()=>localStorage.getItem("font")||"cabinet");
  const [lang,      setLang]      = useState(()=>localStorage.getItem("lang")||"en");
  const [profile,   setProfile]   = useState(()=>{try{return JSON.parse(localStorage.getItem("profile")||"{}");}catch{return {};}});
  const [quickLogPerson, setQuickLogPerson] = useState(null);
  const [showRecap, setShowRecap] = useState(false);

  const t = useT(lang);

  // Persist preferences
  useEffect(()=>{ localStorage.setItem("theme",light?"light":"dark"); },[light]);
  useEffect(()=>{ localStorage.setItem("font",font); const f=FONT_OPTIONS.find(o=>o.id===font); if(f) document.body.style.fontFamily=f.family; },[font]);
  useEffect(()=>{ localStorage.setItem("lang",lang); document.documentElement.dir=lang==="ar"?"rtl":"ltr"; },[lang]);
  useEffect(()=>{ localStorage.setItem("profile",JSON.stringify(profile)); },[profile]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setLoading(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(event==="PASSWORD_RECOVERY"){setSession(session);setResetMode(true);setLoading(false);}
      else setSession(session);
    });
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{ if(!session){setPeople([]);return;} loadBirthdays(); },[session]);

  // Check for just-passed birthdays → show quick log prompt
  useEffect(()=>{
    if(!people.length) return;
    const logs=JSON.parse(localStorage.getItem("quickLogs")||"{}");
    const year=new Date().getFullYear();
    for(const p of people){
      const since=daysSince(p.month,p.day);
      const key=`${p.id}_${year}`;
      if(since>=0&&since<=2&&logs[key]===undefined){
        setQuickLogPerson(p);
        break;
      }
    }
  },[people]);

  async function loadBirthdays(){
    setFetching(true);
    const {data,error}=await supabase.from("birthdays").select("*").order("month",{ascending:true});
    if(!error){
      const remindMap=JSON.parse(localStorage.getItem("remindMap")||"{}");
      const merged=(data||[]).map(p=>({...p,remind:remindMap[p.id]||p.remind||"1 week"}));
      setPeople(merged);
      checkReminders(merged,session.user.email);
    }
    setFetching(false);
  }

  async function checkReminders(birthdays,userEmail){
    const today=new Date().toDateString();
    if(localStorage.getItem("lastReminderCheck")===today) return;
    const remindMap=JSON.parse(localStorage.getItem("remindMap")||"{}");
    for(const person of birthdays){
      const days=daysUntil(person.month,person.day);
      const pref=remindMap[person.id]||person.remind||"1 week";
      if(days===REMIND_DAYS[pref]||days===1||days===0) await sendBirthdayReminder(userEmail,{...person,remind:pref},days);
    }
    localStorage.setItem("lastReminderCheck",today);
  }

  const sorted=[...people].map(p=>({...p,days:daysUntil(p.month,p.day)})).sort((a,b)=>a.days-b.days);
  const filtered=sorted.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd=async(name,month,day,year,note,avatar,remind)=>{
    const {data,error}=await supabase.from("birthdays").insert([{name,month,day,year,note,avatar,user_id:session.user.id}]).select();
    if(error){showToast("❌ "+error.message);return;}
    if(data?.[0]?.id){const map=JSON.parse(localStorage.getItem("remindMap")||"{}");map[data[0].id]=remind||"1 week";localStorage.setItem("remindMap",JSON.stringify(map));data[0].remind=remind||"1 week";}
    setPeople(p=>[...p,...data]);launchConfetti();showToast(`🎉 ${name}'s birthday saved!`);setTab("All");
  };

  const handleDelete=async(id)=>{
    const {error}=await supabase.from("birthdays").delete().eq("id",id);
    if(error){showToast("❌ Error deleting");return;}
    setPeople(p=>p.filter(b=>b.id!==id));showToast("🗑 Removed.");
  };

  const handleClearAll=async()=>{
    if(!window.confirm("Delete ALL birthdays? This cannot be undone.")) return;
    await supabase.from("birthdays").delete().eq("user_id",session.user.id);
    setPeople([]);showToast("All birthdays deleted.");
  };

  const handleQuickLog=(id,reached)=>{
    const year=new Date().getFullYear();
    const logs=JSON.parse(localStorage.getItem("quickLogs")||"{}");
    logs[`${id}_${year}`]=reached;
    localStorage.setItem("quickLogs",JSON.stringify(logs));
    setQuickLogPerson(null);
    setPeople(p=>[...p]); // force re-render
    showToast(reached?"✅ Logged! Great job reaching out 💬":"📝 Logged. There's still time!");
  };

  const handleSignOut=async()=>{ await supabase.auth.signOut();setPeople([]);setTab("Upcoming");showToast("👋 Signed out!"); };
  const showToast=(msg)=>{ setToast(msg);setTimeout(()=>setToast(null),3500); };

  // Tab titles from translations
  const TAB_TITLES={
    Upcoming:t.upcomingBirthdays, All:t.allBirthdays,
    Add:t.addBirthday, Alerts:t.alertsIntegrations, Settings:t.settings,
  };

  const bg=light?"#f4f1fc":"#080810";
  const sidebarBg=light?"#ffffff":"#0d0d1a";
  const borderCol=light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.06)";
  const textMain=light?"#111":"#F0ECF8";
  const textSub=light?"#aaa":"#555";
  const navColor=light?"#666":"#555";
  const navLabels={Upcoming:t.upcoming,All:t.all,Add:t.addNew,Alerts:t.alerts,Settings:t.settings};

  if(loading) return <div style={{minHeight:"100vh",background:"#080810",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{CSS}</style><Spinner/></div>;
  if(!session) return <AuthScreen/>;

  if(resetMode) return (
    <div style={{minHeight:"100vh",background:"#080810",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{CSS}</style>
      <ResetPasswordModal forceMode="update" onClose={async()=>{await supabase.auth.signOut();setResetMode(false);setSession(null);}} onSuccess={()=>setResetMode(false)}/>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <AmbientScene light={light}/>

      <div className="app-shell" style={{background:bg}}>

        {/* ── Sidebar ── */}
        <div className="sidebar" style={{background:sidebarBg,borderColor:borderCol}}>
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🎂</span>
            <span className="sidebar-logo-text">BirthdayPal</span>
          </div>
          <nav className="sidebar-nav">
            {buildNav(t).map(item=>(
              <button key={item.id} className={`nav-btn${tab===item.id?" active":""}`} onClick={()=>setTab(item.id)} style={{color:tab===item.id?"#FF4D6D":navColor}}>
                <span className="nav-icon">{item.icon}</span>
                {navLabels[item.id]}
              </button>
            ))}
            {/* Recap button */}
            <button className="nav-btn" onClick={()=>setShowRecap(true)} style={{color:navColor}}>
              <span className="nav-icon">🎁</span>{t.recap}
            </button>
          </nav>

          {/* Sidebar footer */}
          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="user-avatar" style={{overflow:"hidden",fontSize:profile?.image?0:18}}>
                {profile?.image?<img src={profile.image} alt="me" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:profile?.gender==="male"?"👨":profile?.gender==="female"?"👩":"👤"}
              </div>
              <div style={{minWidth:0}}>
                <div className="user-email" style={{color:textMain,fontWeight:600,fontSize:12}}>{profile?.name||session?.user?.email}</div>
                <div style={{fontSize:10,color:"#00C9A7",marginTop:2}}>● {t.synced}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="main-content">
          {/* Topbar */}
          <div className="topbar" style={{borderColor:borderCol,background:light?"rgba(255,255,255,0.7)":"rgba(13,13,26,0.8)",backdropFilter:"blur(20px)"}}>
            <div>
              <div className="topbar-title">{TAB_TITLES[tab]||t.settings}</div>
              <div className="topbar-count" style={{color:textSub}}>{people.length} {t.birthdaysTracked}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {tab==="All"&&(
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",opacity:.4}}>🔍</span>
                  <input className="bp-input" value={search} onChange={e=>setSearch(e.target.value)} style={{padding:"9px 14px 9px 36px",background:light?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)",border:`1px solid ${borderCol}`,borderRadius:12,color:textMain,fontSize:14,fontFamily:"inherit",width:200}} placeholder={t.search}/>
                </div>
              )}
              <button onClick={()=>setShowRecap(true)} style={{padding:"8px 14px",borderRadius:10,border:`1px solid ${borderCol}`,background:light?"rgba(255,77,109,0.06)":"rgba(255,77,109,0.08)",color:"#FF4D6D",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>🎁 {t.recap}</button>
            </div>
          </div>

          {/* Content */}
          <div className="content-area">
            {fetching?<Spinner/>:<>
              {tab==="Upcoming"&&(
                <div>
                  {sorted[0]&&<div style={{marginBottom:28}}><CountdownRing days={sorted[0].days} name={sorted[0].name} avatar={sorted[0].avatar} color={urgencyColor(sorted[0].days)} light={light} t={t}/></div>}
                  {sorted.length===0
                    ?<div style={{textAlign:"center",padding:"80px 0"}}>
                        <div style={{fontSize:64,marginBottom:16}}>🎂</div>
                        <div style={{fontSize:18,color:textSub,marginBottom:8}}>{t.noBirthdaysYet}</div>
                        <div style={{fontSize:14,color:light?"#ccc":"#444"}}>{t.addFirstHint}</div>
                      </div>
                    :<><div style={{fontSize:10,fontFamily:"'DM Mono',monospace",fontWeight:600,color:light?"#ccc":"#444",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14}}>{t.allUpcoming}</div>
                      <div className="cards-grid">
                        {sorted.map((p,i)=><BirthdayCard key={p.id} person={p} light={light} delay={i*40} onDelete={handleDelete} onQuickLog={handleQuickLog} t={t}/>)}
                      </div></>
                  }
                </div>
              )}
              {tab==="All"&&(
                <div className="cards-grid">
                  {filtered.length===0
                    ?<div style={{color:textSub,fontSize:14,padding:"40px 0"}}>{t.noResults}</div>
                    :filtered.map((p,i)=><BirthdayCard key={p.id} person={p} light={light} delay={i*30} onDelete={handleDelete} onQuickLog={handleQuickLog} t={t}/>)
                  }
                </div>
              )}
              {tab==="Add"      && <AddForm onAdd={handleAdd} light={light} t={t}/>}
              {tab==="Alerts"   && <AlertsTab light={light} t={t}/>}
              {tab==="Settings" && <SettingsTab light={light} onToggle={()=>setLight(v=>!v)} user={session?.user} onSignOut={handleSignOut} onClearAll={handleClearAll} font={font} onFontChange={setFont} lang={lang} onLangChange={setLang} profile={profile} onProfileChange={setProfile} t={t}/>}
            </>}
          </div>
        </div>
      </div>

      {/* Countdown Widget (desktop bottom-right) */}
      <CountdownWidget people={people} light={light} t={t}/>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav">
        {[...buildNav(t),{id:"Recap",icon:"🎁"}].map(item=>(
          <button key={item.id} className={`mobile-nav-btn${tab===item.id?" active":""}`} onClick={()=>item.id==="Recap"?setShowRecap(true):setTab(item.id)}>
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.id==="Recap"?t.recap:navLabels[item.id]}</span>
            {tab===item.id&&<div className="mobile-nav-dot"/>}
          </button>
        ))}
      </div>

      {/* Quick Log Modal */}
      {quickLogPerson&&<QuickLogModal person={quickLogPerson} t={t} onLog={handleQuickLog} onDismiss={()=>setQuickLogPerson(null)}/>}

      {/* Annual Recap Modal */}
      {showRecap&&<RecapModal people={people} t={t} onClose={()=>setShowRecap(false)}/>}

      {/* Toast */}
      {toast&&<div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#FF4D6D,#FF1744)",color:"#fff",padding:"13px 24px",borderRadius:14,fontSize:14,fontWeight:700,boxShadow:"0 8px 32px rgba(255,77,109,0.45)",fontFamily:"inherit",zIndex:9999,animation:"toastIn .35s cubic-bezier(.16,1,.3,1) both",whiteSpace:"nowrap"}}>{toast}</div>}
    </>
  );
}