import { useState, useEffect, useRef, useCallback } from "react";
import { jsPDF } from "jspdf";

// ──────────────────────────────────────────────
// i18n – ENGLISH & ARABIC
// ──────────────────────────────────────────────
const i18n = {
  en: {
    dir: "ltr",
    title: "The 5 Love Languages",
    subtitle: "Everyone has a unique way of feeling loved. This quiz will help you discover yours through 30 simple questions.",
    start: "Start Quiz",
    time: "Takes about 5 minutes",
    credit: "Based on Dr. Gary Chapman's framework",
    questionOf: (n, t) => `Question ${n} of ${t}`,
    answered: (n) => `${n} answered`,
    which: "Which resonates more?",
    previous: "Previous",
    yourResults: "Your Results",
    primaryLang: "Your Primary Love Language",
    bilingual: "You're Bilingual!",
    tiedWith: "Tied with",
    basedOn: "Based on your 30 responses",
    primary: "PRIMARY",
    secondary: "SECONDARY",
    breakdown: "Detailed Breakdown",
    whatMeans: "What This Means",
    examples: "Examples",
    howToLove: "How to Love Someone With This Language",
    whatHurts: "What Hurts Most",
    whatsNext: "What's Next?",
    retake: "Retake Quiz",
    saveAsPDF: "Save as PDF",
    shareImage: "Share as Image",
    nextSteps: [
      { emoji: "\u{1F46B}", title: "Share with your partner", desc: "Have them take this quiz too" },
      { emoji: "\u{1F4AD}", title: "Reflect on patterns", desc: "Notice your top 2\u20133 scores" },
      { emoji: "\u{1F3AF}", title: "Make a plan", desc: "One action this week" },
      { emoji: "\u{1F504}", title: "Practice daily", desc: "Small consistent actions win" },
    ],
    langLabels: {
      words: "Words of Affirmation",
      service: "Acts of Service",
      gifts: "Receiving Gifts",
      time: "Quality Time",
      touch: "Physical Touch",
    },
  },
  ar: {
    dir: "rtl",
    title: "\u0644\u063A\u0627\u062A \u0627\u0644\u062D\u0628 \u0627\u0644\u062E\u0645\u0633",
    subtitle: "\u0644\u0643\u0644 \u0634\u062E\u0635 \u0637\u0631\u064A\u0642\u0629 \u0641\u0631\u064A\u062F\u0629 \u0644\u0644\u0634\u0639\u0648\u0631 \u0628\u0627\u0644\u062D\u0628. \u0647\u0630\u0627 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0633\u064A\u0633\u0627\u0639\u062F\u0643 \u0639\u0644\u0649 \u0627\u0643\u062A\u0634\u0627\u0641 \u0644\u063A\u0629 \u062D\u0628\u0643 \u0645\u0646 \u062E\u0644\u0627\u0644 \u0663\u0660 \u0633\u0624\u0627\u0644\u0627\u064B.",
    start: "\u0627\u0628\u062F\u0623 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631",
    time: "\u064A\u0633\u062A\u063A\u0631\u0642 \u062D\u0648\u0627\u0644\u064A \u0665 \u062F\u0642\u0627\u0626\u0642",
    credit: "\u0645\u0628\u0646\u064A \u0639\u0644\u0649 \u0625\u0637\u0627\u0631 \u062F. \u063A\u0627\u0631\u064A \u062A\u0634\u0627\u0628\u0645\u0627\u0646",
    questionOf: (n, t) => `\u0627\u0644\u0633\u0624\u0627\u0644 ${n} \u0645\u0646 ${t}`,
    answered: (n) => `${n} \u062A\u0645\u062A \u0627\u0644\u0625\u062C\u0627\u0628\u0629`,
    which: "\u0623\u064A\u0651\u0647\u0645\u0627 \u0623\u0642\u0631\u0628 \u0625\u0644\u064A\u0643\u061F",
    previous: "\u0627\u0644\u0633\u0627\u0628\u0642",
    yourResults: "\u0646\u062A\u0627\u0626\u062C\u0643",
    primaryLang: "\u0644\u063A\u0629 \u062D\u0628\u0643 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629",
    bilingual: "\u0644\u062F\u064A\u0643 \u0644\u063A\u062A\u0627 \u062D\u0628!",
    tiedWith: "\u0645\u062A\u0633\u0627\u0648\u064A\u0629 \u0645\u0639",
    basedOn: "\u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0663\u0660 \u0625\u062C\u0627\u0628\u0629",
    primary: "\u0623\u0633\u0627\u0633\u064A\u0629",
    secondary: "\u062B\u0627\u0646\u0648\u064A\u0629",
    breakdown: "\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644",
    whatMeans: "\u0645\u0627\u0630\u0627 \u064A\u0639\u0646\u064A \u0647\u0630\u0627",
    examples: "\u0623\u0645\u062B\u0644\u0629",
    howToLove: "\u0643\u064A\u0641 \u062A\u062D\u0628 \u0634\u062E\u0635\u064B\u0627 \u0628\u0647\u0630\u0647 \u0627\u0644\u0644\u063A\u0629",
    whatHurts: "\u0645\u0627 \u064A\u0624\u0644\u0645 \u0623\u0643\u062B\u0631",
    whatsNext: "\u0645\u0627\u0630\u0627 \u0628\u0639\u062F\u061F",
    retake: "\u0623\u0639\u062F \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631",
    saveAsPDF: "\u062D\u0641\u0638 \u0643\u0640 PDF",
    shareImage: "\u0645\u0634\u0627\u0631\u0643\u0629 \u0643\u0635\u0648\u0631\u0629",
    nextSteps: [
      { emoji: "\u{1F46B}", title: "\u0634\u0627\u0631\u0643 \u0634\u0631\u064A\u0643\u0643", desc: "\u0627\u0637\u0644\u0628 \u0645\u0646\u0647 \u0623\u062E\u0630 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0623\u064A\u0636\u064B\u0627" },
      { emoji: "\u{1F4AD}", title: "\u062A\u0623\u0645\u0644 \u0627\u0644\u0646\u062A\u0627\u0626\u062C", desc: "\u0644\u0627\u062D\u0638 \u0623\u0639\u0644\u0649 \u0662-\u0663 \u0646\u062A\u0627\u0626\u062C" },
      { emoji: "\u{1F3AF}", title: "\u0636\u0639 \u062E\u0637\u0629", desc: "\u0641\u0639\u0644 \u0648\u0627\u062D\u062F \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639" },
      { emoji: "\u{1F504}", title: "\u0645\u0627\u0631\u0633 \u064A\u0648\u0645\u064A\u064B\u0627", desc: "\u0627\u0644\u0623\u0641\u0639\u0627\u0644 \u0627\u0644\u0635\u063A\u064A\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u0645\u0631\u0629 \u062A\u0641\u0648\u0632" },
    ],
    langLabels: {
      words: "\u0643\u0644\u0645\u0627\u062A \u0627\u0644\u062A\u0623\u0643\u064A\u062F",
      service: "\u0623\u0641\u0639\u0627\u0644 \u0627\u0644\u062E\u062F\u0645\u0629",
      gifts: "\u062A\u0644\u0642\u064A \u0627\u0644\u0647\u062F\u0627\u064A\u0627",
      time: "\u0648\u0642\u062A \u0645\u0645\u064A\u0632",
      touch: "\u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u062C\u0633\u062F\u064A",
    },
  },
};

// ──── QUESTIONS (bilingual) ────
const questions = {
  en: [
    { a: { text: "I like to receive compliments and words of appreciation", lang: "words" }, b: { text: "I feel loved when someone helps me with tasks I need to do", lang: "service" } },
    { a: { text: "I know someone cares when they do things for me without being asked", lang: "service" }, b: { text: "I value hearing 'I love you' and other words of affirmation", lang: "words" } },
    { a: { text: "I feel loved when someone tells me they are proud of me", lang: "words" }, b: { text: "I feel loved when a person cooks a meal for me", lang: "service" } },
    { a: { text: "I like it when people listen to me and show genuine interest in what I'm saying", lang: "time" }, b: { text: "I like for people to compliment my achievements", lang: "words" } },
    { a: { text: "I like for people to compliment my appearance", lang: "words" }, b: { text: "I feel loved when people take time to understand my feelings", lang: "time" } },
    { a: { text: "I like being together and doing things with friends and loved ones", lang: "time" }, b: { text: "I like it when kind words are spoken to me", lang: "words" } },
    { a: { text: "Visible symbols of love (gifts) are very important to me", lang: "gifts" }, b: { text: "I feel loved when people affirm me with encouraging words", lang: "words" } },
    { a: { text: "I value praise and try to avoid criticism", lang: "words" }, b: { text: "Several small gifts mean more to me than one large gift", lang: "gifts" } },
    { a: { text: "I like receiving gifts from my loved ones", lang: "gifts" }, b: { text: "I like hearing words of encouragement from my loved ones", lang: "words" } },
    { a: { text: "I like to receive notes of affirmation from people I care about", lang: "words" }, b: { text: "I like it when someone hugs me", lang: "touch" } },
    { a: { text: "I like to sit close to people I enjoy being around", lang: "touch" }, b: { text: "I like it when people tell me I am attractive or beautiful", lang: "words" } },
    { a: { text: "Words of acceptance are important to me", lang: "words" }, b: { text: "I feel loved when someone holds my hand", lang: "touch" } },
    { a: { text: "I like to spend one-on-one time with someone I care about", lang: "time" }, b: { text: "I feel loved when someone gives me practical help", lang: "service" } },
    { a: { text: "I really enjoy the feeling I get when someone gives me undivided attention", lang: "time" }, b: { text: "I really enjoy the feeling I get when someone does an act of service for me", lang: "service" } },
    { a: { text: "I like knowing loved ones are concerned enough to help with my daily tasks", lang: "service" }, b: { text: "I enjoy extended trips with someone who is special to me", lang: "time" } },
    { a: { text: "I feel loved when friends and loved ones help me with jobs or projects", lang: "service" }, b: { text: "I really enjoy receiving gifts from friends and loved ones", lang: "gifts" } },
    { a: { text: "I appreciate the many things that special people do for me", lang: "service" }, b: { text: "I like receiving gifts that special people make for me", lang: "gifts" } },
    { a: { text: "I know a person is thinking of me when they give me a gift", lang: "gifts" }, b: { text: "I feel loved when a person helps with my chores", lang: "service" } },
    { a: { text: "I feel loved when people do things to help me", lang: "service" }, b: { text: "I feel loved when people physically express care through touch", lang: "touch" } },
    { a: { text: "What someone does for me affects me more than what they say", lang: "service" }, b: { text: "Hugs make me feel connected and valued", lang: "touch" } },
    { a: { text: "I feel secure when a special person is touching me", lang: "touch" }, b: { text: "Acts of service make me feel loved", lang: "service" } },
    { a: { text: "I like it when people give me gifts", lang: "gifts" }, b: { text: "I like leisurely visits with friends and loved ones", lang: "time" } },
    { a: { text: "I like to spend time with friends and loved ones", lang: "time" }, b: { text: "I like to receive little gifts from friends and loved ones", lang: "gifts" } },
    { a: { text: "I appreciate it when someone listens patiently and doesn't interrupt me", lang: "time" }, b: { text: "I appreciate it when someone remembers special days with a gift", lang: "gifts" } },
    { a: { text: "I like to go places with friends and loved ones", lang: "time" }, b: { text: "I like to high-five or hold hands with people who are special to me", lang: "touch" } },
    { a: { text: "I feel close to someone when we are talking or doing something together", lang: "time" }, b: { text: "I feel closer to friends and loved ones when they touch me often", lang: "touch" } },
    { a: { text: "I like to be touched as friends and loved ones walk by", lang: "touch" }, b: { text: "I like it when my partner and I spend dedicated time together", lang: "time" } },
    { a: { text: "I feel loved when someone I love puts their arm around me", lang: "touch" }, b: { text: "I feel loved when I receive a gift from someone I love", lang: "gifts" } },
    { a: { text: "I like to kiss or be kissed by people I am close to", lang: "touch" }, b: { text: "I like to receive a gift that has a lot of thought behind it", lang: "gifts" } },
    { a: { text: "I feel loved when a person celebrates my birthday with a gift", lang: "gifts" }, b: { text: "I feel loved when a person gives me a warm embrace on my birthday", lang: "touch" } },
  ],
  ar: [
    { a: { text: "\u0623\u062D\u0628 \u062A\u0644\u0642\u064A \u0627\u0644\u0625\u0637\u0631\u0627\u0621 \u0648\u0643\u0644\u0645\u0627\u062A \u0627\u0644\u062A\u0642\u062F\u064A\u0631", lang: "words" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0633\u0627\u0639\u062F\u0646\u064A \u0623\u062D\u062F \u0641\u064A \u0645\u0647\u0627\u0645\u064A", lang: "service" } },
    { a: { text: "\u0623\u0639\u0631\u0641 \u0623\u0646 \u0634\u062E\u0635\u064B\u0627 \u064A\u0647\u062A\u0645 \u0628\u064A \u0639\u0646\u062F\u0645\u0627 \u064A\u0641\u0639\u0644 \u0623\u0634\u064A\u0627\u0621 \u0644\u064A \u062F\u0648\u0646 \u0623\u0646 \u0623\u0637\u0644\u0628", lang: "service" }, b: { text: "\u0623\u0642\u062F\u0631 \u0633\u0645\u0627\u0639 '\u0623\u062D\u0628\u0643' \u0648\u0643\u0644\u0645\u0627\u062A \u0627\u0644\u062A\u0623\u0643\u064A\u062F", lang: "words" } },
    { a: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0642\u0648\u0644 \u0644\u064A \u0623\u062D\u062F \u0623\u0646\u0647 \u0641\u062E\u0648\u0631 \u0628\u064A", lang: "words" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0637\u0628\u062E \u0644\u064A \u0623\u062D\u062F \u0648\u062C\u0628\u0629", lang: "service" } },
    { a: { text: "\u0623\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0633\u062A\u0645\u0639 \u0627\u0644\u0646\u0627\u0633 \u0644\u064A \u0628\u0627\u0647\u062A\u0645\u0627\u0645 \u062D\u0642\u064A\u0642\u064A", lang: "time" }, b: { text: "\u0623\u062D\u0628 \u0623\u0646 \u064A\u0645\u062F\u062D \u0627\u0644\u0646\u0627\u0633 \u0625\u0646\u062C\u0627\u0632\u0627\u062A\u064A", lang: "words" } },
    { a: { text: "\u0623\u062D\u0628 \u0623\u0646 \u064A\u0645\u062F\u062D \u0627\u0644\u0646\u0627\u0633 \u0645\u0638\u0647\u0631\u064A", lang: "words" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0623\u062E\u0630 \u0627\u0644\u0646\u0627\u0633 \u0648\u0642\u062A\u064B\u0627 \u0644\u0641\u0647\u0645 \u0645\u0634\u0627\u0639\u0631\u064A", lang: "time" } },
    { a: { text: "\u0623\u062D\u0628 \u0627\u0644\u062A\u0648\u0627\u062C\u062F \u0648\u0641\u0639\u0644 \u0627\u0644\u0623\u0634\u064A\u0627\u0621 \u0645\u0639 \u0627\u0644\u0623\u062D\u0628\u0627\u0621", lang: "time" }, b: { text: "\u0623\u062D\u0628 \u0633\u0645\u0627\u0639 \u0627\u0644\u0643\u0644\u0645\u0627\u062A \u0627\u0644\u0644\u0637\u064A\u0641\u0629", lang: "words" } },
    { a: { text: "\u0631\u0645\u0648\u0632 \u0627\u0644\u062D\u0628 \u0627\u0644\u0645\u0631\u0626\u064A\u0629 (\u0627\u0644\u0647\u062F\u0627\u064A\u0627) \u0645\u0647\u0645\u0629 \u062C\u062F\u064B\u0627 \u0644\u064A", lang: "gifts" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0634\u062C\u0639\u0646\u064A \u0627\u0644\u0646\u0627\u0633 \u0628\u0643\u0644\u0645\u0627\u062A\u0647\u0645", lang: "words" } },
    { a: { text: "\u0623\u0642\u062F\u0631 \u0627\u0644\u0645\u062F\u064A\u062D \u0648\u0623\u062D\u0627\u0648\u0644 \u062A\u062C\u0646\u0628 \u0627\u0644\u0627\u0646\u062A\u0642\u0627\u062F", lang: "words" }, b: { text: "\u0639\u062F\u0629 \u0647\u062F\u0627\u064A\u0627 \u0635\u063A\u064A\u0631\u0629 \u0623\u0641\u0636\u0644 \u0645\u0646 \u0647\u062F\u064A\u0629 \u0643\u0628\u064A\u0631\u0629 \u0648\u0627\u062D\u062F\u0629", lang: "gifts" } },
    { a: { text: "\u0623\u062D\u0628 \u062A\u0644\u0642\u064A \u0627\u0644\u0647\u062F\u0627\u064A\u0627 \u0645\u0646 \u0623\u062D\u0628\u0627\u0626\u064A", lang: "gifts" }, b: { text: "\u0623\u062D\u0628 \u0633\u0645\u0627\u0639 \u0643\u0644\u0645\u0627\u062A \u0627\u0644\u062A\u0634\u062C\u064A\u0639 \u0645\u0646 \u0623\u062D\u0628\u0627\u0626\u064A", lang: "words" } },
    { a: { text: "\u0623\u062D\u0628 \u062A\u0644\u0642\u064A \u0631\u0633\u0627\u0626\u0644 \u062A\u0642\u062F\u064A\u0631 \u0645\u0646 \u0627\u0644\u0623\u0634\u062E\u0627\u0635 \u0627\u0644\u0630\u064A\u0646 \u0623\u0647\u062A\u0645 \u0628\u0647\u0645", lang: "words" }, b: { text: "\u0623\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u062D\u0636\u0646\u0646\u064A \u0623\u062D\u062F", lang: "touch" } },
    { a: { text: "\u0623\u062D\u0628 \u0627\u0644\u062C\u0644\u0648\u0633 \u0628\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0627\u0644\u0623\u0634\u062E\u0627\u0635 \u0627\u0644\u0630\u064A\u0646 \u0623\u0633\u062A\u0645\u062A\u0639 \u0628\u0648\u062C\u0648\u062F\u0647\u0645", lang: "touch" }, b: { text: "\u0623\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0642\u0648\u0644 \u0644\u064A \u0627\u0644\u0646\u0627\u0633 \u0623\u0646\u0646\u064A \u062C\u0645\u064A\u0644", lang: "words" } },
    { a: { text: "\u0643\u0644\u0645\u0627\u062A \u0627\u0644\u0642\u0628\u0648\u0644 \u0645\u0647\u0645\u0629 \u0644\u064A", lang: "words" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0645\u0633\u0643 \u0623\u062D\u062F \u0628\u064A\u062F\u064A", lang: "touch" } },
    { a: { text: "\u0623\u062D\u0628 \u0642\u0636\u0627\u0621 \u0648\u0642\u062A \u0641\u0631\u062F\u064A \u0645\u0639 \u0634\u062E\u0635 \u0623\u0647\u062A\u0645 \u0628\u0647", lang: "time" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0642\u062F\u0645 \u0644\u064A \u0623\u062D\u062F \u0645\u0633\u0627\u0639\u062F\u0629 \u0639\u0645\u0644\u064A\u0629", lang: "service" } },
    { a: { text: "\u0623\u0633\u062A\u0645\u062A\u0639 \u062D\u0642\u064B\u0627 \u0639\u0646\u062F\u0645\u0627 \u064A\u0639\u0637\u064A\u0646\u064A \u0623\u062D\u062F \u0627\u0647\u062A\u0645\u0627\u0645\u0647 \u0627\u0644\u0643\u0627\u0645\u0644", lang: "time" }, b: { text: "\u0623\u0633\u062A\u0645\u062A\u0639 \u0639\u0646\u062F\u0645\u0627 \u064A\u0642\u062F\u0645 \u0644\u064A \u0623\u062D\u062F \u062E\u062F\u0645\u0629", lang: "service" } },
    { a: { text: "\u064A\u0633\u0639\u062F\u0646\u064A \u0623\u0646 \u0623\u062D\u0628\u0627\u0626\u064A \u064A\u0647\u062A\u0645\u0648\u0646 \u0628\u0645\u0633\u0627\u0639\u062F\u062A\u064A \u0641\u064A \u0645\u0647\u0627\u0645\u064A \u0627\u0644\u064A\u0648\u0645\u064A\u0629", lang: "service" }, b: { text: "\u0623\u0633\u062A\u0645\u062A\u0639 \u0628\u0627\u0644\u0631\u062D\u0644\u0627\u062A \u0645\u0639 \u0634\u062E\u0635 \u0645\u0645\u064A\u0632", lang: "time" } },
    { a: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0633\u0627\u0639\u062F\u0646\u064A \u0627\u0644\u0623\u062D\u0628\u0627\u0621 \u0641\u064A \u0627\u0644\u0645\u0634\u0627\u0631\u064A\u0639", lang: "service" }, b: { text: "\u0623\u0633\u062A\u0645\u062A\u0639 \u062D\u0642\u064B\u0627 \u0628\u062A\u0644\u0642\u064A \u0627\u0644\u0647\u062F\u0627\u064A\u0627 \u0645\u0646 \u0627\u0644\u0623\u062D\u0628\u0627\u0621", lang: "gifts" } },
    { a: { text: "\u0623\u0642\u062F\u0631 \u0627\u0644\u0623\u0634\u064A\u0627\u0621 \u0627\u0644\u0643\u062B\u064A\u0631\u0629 \u0627\u0644\u062A\u064A \u064A\u0641\u0639\u0644\u0647\u0627 \u0627\u0644\u0623\u0634\u062E\u0627\u0635 \u0627\u0644\u0645\u0645\u064A\u0632\u0648\u0646 \u0644\u064A", lang: "service" }, b: { text: "\u0623\u062D\u0628 \u062A\u0644\u0642\u064A \u0647\u062F\u0627\u064A\u0627 \u0645\u0635\u0646\u0648\u0639\u0629 \u064A\u062F\u0648\u064A\u064B\u0627 \u0645\u0646 \u0623\u0634\u062E\u0627\u0635 \u0645\u0645\u064A\u0632\u064A\u0646", lang: "gifts" } },
    { a: { text: "\u0623\u0639\u0631\u0641 \u0623\u0646 \u0634\u062E\u0635\u064B\u0627 \u064A\u0641\u0643\u0631 \u0628\u064A \u0639\u0646\u062F\u0645\u0627 \u064A\u0642\u062F\u0645 \u0644\u064A \u0647\u062F\u064A\u0629", lang: "gifts" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0633\u0627\u0639\u062F\u0646\u064A \u0623\u062D\u062F \u0641\u064A \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0645\u0646\u0632\u0644\u064A\u0629", lang: "service" } },
    { a: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0641\u0639\u0644 \u0627\u0644\u0646\u0627\u0633 \u0623\u0634\u064A\u0627\u0621 \u0644\u0645\u0633\u0627\u0639\u062F\u062A\u064A", lang: "service" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0639\u0628\u0631 \u0627\u0644\u0646\u0627\u0633 \u0639\u0646 \u0627\u0647\u062A\u0645\u0627\u0645\u0647\u0645 \u0628\u0627\u0644\u0644\u0645\u0633", lang: "touch" } },
    { a: { text: "\u0645\u0627 \u064A\u0641\u0639\u0644\u0647 \u0627\u0644\u0634\u062E\u0635 \u0644\u064A \u064A\u0624\u062B\u0631 \u0628\u064A \u0623\u0643\u062B\u0631 \u0645\u0645\u0627 \u064A\u0642\u0648\u0644", lang: "service" }, b: { text: "\u0627\u0644\u0639\u0646\u0627\u0642 \u064A\u0634\u0639\u0631\u0646\u064A \u0628\u0627\u0644\u062A\u0631\u0627\u0628\u0637 \u0648\u0627\u0644\u062A\u0642\u062F\u064A\u0631", lang: "touch" } },
    { a: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u0623\u0645\u0627\u0646 \u0639\u0646\u062F\u0645\u0627 \u064A\u0644\u0645\u0633\u0646\u064A \u0634\u062E\u0635 \u0645\u0645\u064A\u0632", lang: "touch" }, b: { text: "\u0623\u0641\u0639\u0627\u0644 \u0627\u0644\u062E\u062F\u0645\u0629 \u062A\u0634\u0639\u0631\u0646\u064A \u0628\u0627\u0644\u062D\u0628", lang: "service" } },
    { a: { text: "\u0623\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0642\u062F\u0645 \u0644\u064A \u0627\u0644\u0646\u0627\u0633 \u0647\u062F\u0627\u064A\u0627", lang: "gifts" }, b: { text: "\u0623\u062D\u0628 \u0627\u0644\u0632\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0631\u064A\u062D\u0629 \u0645\u0639 \u0627\u0644\u0623\u062D\u0628\u0627\u0621", lang: "time" } },
    { a: { text: "\u0623\u062D\u0628 \u0642\u0636\u0627\u0621 \u0627\u0644\u0648\u0642\u062A \u0645\u0639 \u0627\u0644\u0623\u0635\u062F\u0642\u0627\u0621 \u0648\u0627\u0644\u0623\u062D\u0628\u0627\u0621", lang: "time" }, b: { text: "\u0623\u062D\u0628 \u062A\u0644\u0642\u064A \u0647\u062F\u0627\u064A\u0627 \u0635\u063A\u064A\u0631\u0629 \u0645\u0646 \u0627\u0644\u0623\u062D\u0628\u0627\u0621", lang: "gifts" } },
    { a: { text: "\u0623\u0642\u062F\u0631 \u0639\u0646\u062F\u0645\u0627 \u064A\u0633\u062A\u0645\u0639 \u0644\u064A \u0623\u062D\u062F \u0628\u0635\u0628\u0631 \u062F\u0648\u0646 \u0645\u0642\u0627\u0637\u0639\u0629", lang: "time" }, b: { text: "\u0623\u0642\u062F\u0631 \u0639\u0646\u062F\u0645\u0627 \u064A\u062A\u0630\u0643\u0631 \u0623\u062D\u062F \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0627\u062A \u0628\u0647\u062F\u064A\u0629", lang: "gifts" } },
    { a: { text: "\u0623\u062D\u0628 \u0627\u0644\u0630\u0647\u0627\u0628 \u0625\u0644\u0649 \u0623\u0645\u0627\u0643\u0646 \u0645\u0639 \u0627\u0644\u0623\u062D\u0628\u0627\u0621", lang: "time" }, b: { text: "\u0623\u062D\u0628 \u0645\u0633\u0643 \u0627\u0644\u0623\u064A\u062F\u064A \u0645\u0639 \u0627\u0644\u0623\u0634\u062E\u0627\u0635 \u0627\u0644\u0645\u0645\u064A\u0632\u064A\u0646", lang: "touch" } },
    { a: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0634\u062E\u0635 \u0639\u0646\u062F\u0645\u0627 \u0646\u062A\u062D\u062F\u062B \u0623\u0648 \u0646\u0641\u0639\u0644 \u0634\u064A\u0626\u064B\u0627 \u0645\u0639\u064B\u0627", lang: "time" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u0642\u0631\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0644\u0645\u0633\u0646\u064A \u0627\u0644\u0623\u062D\u0628\u0627\u0621 \u0643\u062B\u064A\u0631\u064B\u0627", lang: "touch" } },
    { a: { text: "\u0623\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0644\u0645\u0633\u0646\u064A \u0627\u0644\u0623\u062D\u0628\u0627\u0621 \u0639\u0646\u062F \u0645\u0631\u0648\u0631\u0647\u0645", lang: "touch" }, b: { text: "\u0623\u062D\u0628 \u0642\u0636\u0627\u0621 \u0648\u0642\u062A \u0645\u062E\u0635\u0635 \u0645\u0639 \u0634\u0631\u064A\u0643\u064A", lang: "time" } },
    { a: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u0636\u0639 \u0645\u0646 \u0623\u062D\u0628 \u0630\u0631\u0627\u0639\u0647 \u062D\u0648\u0644\u064A", lang: "touch" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u0623\u062A\u0644\u0642\u0649 \u0647\u062F\u064A\u0629 \u0645\u0645\u0646 \u0623\u062D\u0628", lang: "gifts" } },
    { a: { text: "\u0623\u062D\u0628 \u0627\u0644\u062A\u0642\u0628\u064A\u0644 \u0645\u0646 \u0627\u0644\u0623\u0634\u062E\u0627\u0635 \u0627\u0644\u0642\u0631\u064A\u0628\u064A\u0646 \u0645\u0646\u064A", lang: "touch" }, b: { text: "\u0623\u062D\u0628 \u062A\u0644\u0642\u064A \u0647\u062F\u064A\u0629 \u0641\u064A\u0647\u0627 \u0643\u062B\u064A\u0631 \u0645\u0646 \u0627\u0644\u062A\u0641\u0643\u064A\u0631", lang: "gifts" } },
    { a: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u062D\u062A\u0641\u0644 \u0634\u062E\u0635 \u0628\u0639\u064A\u062F \u0645\u064A\u0644\u0627\u062F\u064A \u0628\u0647\u062F\u064A\u0629", lang: "gifts" }, b: { text: "\u0623\u0634\u0639\u0631 \u0628\u0627\u0644\u062D\u0628 \u0639\u0646\u062F\u0645\u0627 \u064A\u062D\u0636\u0646\u0646\u064A \u0634\u062E\u0635 \u0641\u064A \u0639\u064A\u062F \u0645\u064A\u0644\u0627\u062F\u064A", lang: "touch" } },
  ],
};

// ──── LANG DATA (bilingual) ────
const langEmoji = { words: "\u{1F4AC}", service: "\u{1F9E1}", gifts: "\u{1F381}", time: "\u23F3", touch: "\u{1F917}" };
const langColors = {
  words: { primary: "#007AFF", light: "#EBF5FF", gradient: "linear-gradient(135deg, #007AFF, #5AC8FA)" },
  service: { primary: "#FF9500", light: "#FFF8EB", gradient: "linear-gradient(135deg, #FF9500, #FFCC00)" },
  gifts: { primary: "#FF2D55", light: "#FFF0F3", gradient: "linear-gradient(135deg, #FF2D55, #FF6482)" },
  time: { primary: "#34C759", light: "#EDFCF0", gradient: "linear-gradient(135deg, #34C759, #30D158)" },
  touch: { primary: "#AF52DE", light: "#F8F0FE", gradient: "linear-gradient(135deg, #AF52DE, #BF5AF2)" },
};

const langDataEN = {
  words: {
    meaning: "Actions don't always speak louder than words. Unsolicited compliments mean the world to you. Hearing 'I love you' is important \u2014 hearing the reasons behind it sends your spirits skyward.",
    examples: ["\u{1F48C} Saying 'I love you' and explaining why", "\u{1F4F1} Sending thoughtful texts", "\u2728 Verbal compliments", "\u{1F4AA} Words of encouragement", "\u{1F64F} Expressing gratitude out loud"],
    howToLove: ["Tell them specifically what you appreciate", "Send unexpected encouraging messages", "Write heartfelt notes", "Offer genuine, specific compliments", "Use kind words even in disagreements"],
    whatHurts: "Insults, harsh criticism, or forgetting to acknowledge their efforts."
  },
  time: {
    meaning: "Nothing says 'I love you' like full, undivided attention. Really being there \u2014 TV off, phone down \u2014 makes you feel truly special and loved.",
    examples: ["\u{1F5E3}\uFE0F Meaningful conversations", "\u{1F6B6} Activities together", "\u{1F440} Active listening", "\u{1F4C5} Regular date nights", "\u{1F30D} Creating memories"],
    howToLove: ["Put your phone away together", "Schedule regular one-on-one time", "Maintain eye contact", "Plan shared activities", "Be fully present \u2014 mentally too"],
    whatHurts: "Distracted conversations, cancelled plans, or competing with a phone for attention."
  },
  gifts: {
    meaning: "Not materialism \u2014 you thrive on the love and thought behind the gift. The perfect gift shows you are known, cared for, and prized.",
    examples: ["\u{1F3AF} Thoughtful, personal gifts", "\u{1F33A} Small 'just because' surprises", "\u{1F3A8} Handmade or personalized items", "\u{1F91D} Being present during tough times", "\u{1F382} Remembering special occasions"],
    howToLove: ["Keep a list of things they mention wanting", "Surprise them with small gifts randomly", "Put effort into presentation", "Give the gift of presence", "It's about thought, not price"],
    whatHurts: "Forgotten birthdays, generic last-minute gifts, or no tangible expressions of thoughtfulness."
  },
  service: {
    meaning: "Can vacuuming be love? Absolutely! Anything you do to ease their burden speaks volumes. The words they want most: 'Let me do that for you.'",
    examples: ["\u{1F3E0} Helping without being asked", "\u{1F373} Cooking a meal", "\u{1F527} Fixing something", "\u{1F4CB} Taking care of stressful tasks", "\u{1F680} Practical help during busy times"],
    howToLove: ["Ask 'What can I help with today?'", "Notice stress and act before they ask", "Follow through \u2014 reliability matters deeply", "Do tasks cheerfully", "Anticipate needs proactively"],
    whatHurts: "Broken promises, laziness, creating more work, or dismissing requests for help."
  },
  touch: {
    meaning: "Hugs, holding hands, thoughtful touches \u2014 all ways to show excitement, care, and love. Physical presence and accessibility are crucial.",
    examples: ["\u{1F91D} Holding hands", "\u{1FAC2} Hugs hello and goodbye", "\u{1F590}\uFE0F Comforting shoulder touch", "\u{1F6CB}\uFE0F Sitting close together", "\u{1F48B} Gentle touch in passing"],
    howToLove: ["Reach for their hand when walking", "Greet and part with a hug or kiss", "Offer physical comfort in tough moments", "Initiate casual affectionate contact", "Be intentional about non-sexual touch"],
    whatHurts: "Physical neglect, long periods without affection, or recoiling from their touch."
  },
};

const langDataAR = {
  words: {
    meaning: "\u0627\u0644\u0623\u0641\u0639\u0627\u0644 \u0644\u0627 \u062A\u062A\u062D\u062F\u062B \u062F\u0627\u0626\u0645\u064B\u0627 \u0628\u0635\u0648\u062A \u0623\u0639\u0644\u0649 \u0645\u0646 \u0627\u0644\u0643\u0644\u0645\u0627\u062A. \u0627\u0644\u0625\u0637\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0639\u0641\u0648\u064A\u0629 \u062A\u0639\u0646\u064A \u0644\u0643 \u0627\u0644\u0639\u0627\u0644\u0645. \u0633\u0645\u0627\u0639 '\u0623\u062D\u0628\u0643' \u0645\u0647\u0645 \u2014 \u0648\u0645\u0639\u0631\u0641\u0629 \u0627\u0644\u0633\u0628\u0628 \u064A\u0631\u0641\u0639 \u0645\u0639\u0646\u0648\u064A\u0627\u062A\u0643.",
    examples: ["\u{1F48C} \u0642\u0648\u0644 '\u0623\u062D\u0628\u0643' \u0645\u0639 \u0627\u0644\u0633\u0628\u0628", "\u{1F4F1} \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0626\u0644 \u0645\u062F\u0631\u0648\u0633\u0629", "\u2728 \u0625\u0637\u0631\u0627\u0621 \u0644\u0641\u0638\u064A", "\u{1F4AA} \u0643\u0644\u0645\u0627\u062A \u062A\u0634\u062C\u064A\u0639", "\u{1F64F} \u0627\u0644\u062A\u0639\u0628\u064A\u0631 \u0639\u0646 \u0627\u0644\u0627\u0645\u062A\u0646\u0627\u0646"],
    howToLove: ["\u0623\u062E\u0628\u0631\u0647\u0645 \u0628\u0627\u0644\u062A\u062D\u062F\u064A\u062F \u0645\u0627 \u062A\u0642\u062F\u0631\u0647 \u0641\u064A\u0647\u0645", "\u0623\u0631\u0633\u0644 \u0631\u0633\u0627\u0626\u0644 \u062A\u0634\u062C\u064A\u0639 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639\u0629", "\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0626\u0644 \u0635\u0627\u062F\u0642\u0629", "\u0642\u062F\u0645 \u0625\u0637\u0631\u0627\u0621 \u062D\u0642\u064A\u0642\u064A \u0648\u0645\u062D\u062F\u062F", "\u0627\u0633\u062A\u062E\u062F\u0645 \u0643\u0644\u0645\u0627\u062A \u0644\u0637\u064A\u0641\u0629 \u062D\u062A\u0649 \u0641\u064A \u0627\u0644\u062E\u0644\u0627\u0641\u0627\u062A"],
    whatHurts: "\u0627\u0644\u0625\u0647\u0627\u0646\u0629\u060C \u0627\u0644\u0646\u0642\u062F \u0627\u0644\u0642\u0627\u0633\u064A\u060C \u0623\u0648 \u0646\u0633\u064A\u0627\u0646 \u062A\u0642\u062F\u064A\u0631 \u062C\u0647\u0648\u062F\u0647\u0645."
  },
  time: {
    meaning: "\u0644\u0627 \u0634\u064A\u0621 \u064A\u0642\u0648\u0644 '\u0623\u062D\u0628\u0643' \u0645\u062B\u0644 \u0627\u0644\u0627\u0647\u062A\u0645\u0627\u0645 \u0627\u0644\u0643\u0627\u0645\u0644. \u0627\u0644\u062A\u0648\u0627\u062C\u062F \u0627\u0644\u062D\u0642\u064A\u0642\u064A \u2014 \u0628\u062F\u0648\u0646 \u0647\u0627\u062A\u0641 \u0623\u0648 \u062A\u0644\u0641\u0632\u064A\u0648\u0646 \u2014 \u064A\u062C\u0639\u0644\u0643 \u062A\u0634\u0639\u0631 \u0628\u0623\u0646\u0643 \u0645\u0645\u064A\u0632.",
    examples: ["\u{1F5E3}\uFE0F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0639\u0645\u064A\u0642\u0629", "\u{1F6B6} \u0623\u0646\u0634\u0637\u0629 \u0645\u0634\u062A\u0631\u0643\u0629", "\u{1F440} \u0627\u0644\u0627\u0633\u062A\u0645\u0627\u0639 \u0627\u0644\u0641\u0639\u0627\u0644", "\u{1F4C5} \u0645\u0648\u0627\u0639\u064A\u062F \u0645\u0646\u062A\u0638\u0645\u0629", "\u{1F30D} \u0635\u0646\u0639 \u0630\u0643\u0631\u064A\u0627\u062A"],
    howToLove: ["\u0636\u0639 \u0647\u0627\u062A\u0641\u0643 \u062C\u0627\u0646\u0628\u064B\u0627 \u0639\u0646\u062F\u0645\u0627 \u062A\u0643\u0648\u0646\u0648\u0646 \u0645\u0639\u064B\u0627", "\u062E\u0635\u0635 \u0648\u0642\u062A\u064B\u0627 \u0645\u0646\u062A\u0638\u0645\u064B\u0627 \u0628\u062F\u0648\u0646 \u062A\u0634\u062A\u064A\u062A", "\u062D\u0627\u0641\u0638 \u0639\u0644\u0649 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u0628\u0635\u0631\u064A", "\u062E\u0637\u0637 \u0644\u0623\u0646\u0634\u0637\u0629 \u0645\u0634\u062A\u0631\u0643\u0629", "\u0643\u0646 \u062D\u0627\u0636\u0631\u064B\u0627 \u0630\u0647\u0646\u064A\u064B\u0627 \u0623\u064A\u0636\u064B\u0627"],
    whatHurts: "\u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0627\u0644\u0645\u0634\u062A\u062A\u0629\u060C \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062E\u0637\u0637\u060C \u0623\u0648 \u0627\u0644\u062A\u0646\u0627\u0641\u0633 \u0645\u0639 \u0627\u0644\u0647\u0627\u062A\u0641 \u0639\u0644\u0649 \u0627\u0647\u062A\u0645\u0627\u0645\u0643."
  },
  gifts: {
    meaning: "\u0644\u064A\u0633 \u0645\u0627\u062F\u064A\u0629 \u2014 \u0623\u0646\u062A \u062A\u0632\u062F\u0647\u0631 \u0628\u0627\u0644\u062D\u0628 \u0648\u0627\u0644\u062A\u0641\u0643\u064A\u0631 \u0648\u0631\u0627\u0621 \u0627\u0644\u0647\u062F\u064A\u0629. \u0627\u0644\u0647\u062F\u064A\u0629 \u0627\u0644\u0645\u062B\u0627\u0644\u064A\u0629 \u062A\u0638\u0647\u0631 \u0623\u0646\u0643 \u0645\u0639\u0631\u0648\u0641 \u0648\u0645\u0642\u062F\u0631.",
    examples: ["\u{1F3AF} \u0647\u062F\u0627\u064A\u0627 \u0645\u062F\u0631\u0648\u0633\u0629", "\u{1F33A} \u0645\u0641\u0627\u062C\u0622\u062A \u0635\u063A\u064A\u0631\u0629", "\u{1F3A8} \u0647\u062F\u0627\u064A\u0627 \u0645\u0635\u0646\u0648\u0639\u0629 \u064A\u062F\u0648\u064A\u064B\u0627", "\u{1F91D} \u0627\u0644\u062A\u0648\u0627\u062C\u062F \u0641\u064A \u0627\u0644\u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0639\u0628\u0629", "\u{1F382} \u062A\u0630\u0643\u0631 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0627\u062A"],
    howToLove: ["\u0627\u062D\u0641\u0638 \u0642\u0627\u0626\u0645\u0629 \u0628\u0645\u0627 \u064A\u0630\u0643\u0631\u0648\u0646\u0647", "\u0641\u0627\u062C\u0626\u0647\u0645 \u0628\u0647\u062F\u0627\u064A\u0627 \u0635\u063A\u064A\u0631\u0629 \u0639\u0634\u0648\u0627\u0626\u064A\u064B\u0627", "\u0627\u0647\u062A\u0645 \u0628\u0627\u0644\u062A\u063A\u0644\u064A\u0641 \u0648\u0627\u0644\u0628\u0637\u0627\u0642\u0629", "\u0642\u062F\u0645 \u0647\u062F\u064A\u0629 \u062A\u0648\u0627\u062C\u062F\u0643", "\u0627\u0644\u0645\u0647\u0645 \u0627\u0644\u0641\u0643\u0631\u0629 \u0644\u064A\u0633 \u0627\u0644\u0633\u0639\u0631"],
    whatHurts: "\u0646\u0633\u064A\u0627\u0646 \u0623\u0639\u064A\u0627\u062F \u0627\u0644\u0645\u064A\u0644\u0627\u062F\u060C \u0647\u062F\u0627\u064A\u0627 \u0639\u0634\u0648\u0627\u0626\u064A\u0629\u060C \u0623\u0648 \u063A\u064A\u0627\u0628 \u0627\u0644\u062A\u0639\u0628\u064A\u0631\u0627\u062A \u0627\u0644\u0645\u0644\u0645\u0648\u0633\u0629."
  },
  service: {
    meaning: "\u0647\u0644 \u064A\u0645\u0643\u0646 \u0644\u062A\u0646\u0638\u064A\u0641 \u0627\u0644\u0628\u064A\u062A \u0623\u0646 \u064A\u0643\u0648\u0646 \u062A\u0639\u0628\u064A\u0631\u064B\u0627 \u0639\u0646 \u0627\u0644\u062D\u0628\u061F \u0628\u0627\u0644\u062A\u0623\u0643\u064A\u062F! \u0643\u0644 \u0645\u0627 \u062A\u0641\u0639\u0644\u0647 \u0644\u062A\u062E\u0641\u064A\u0641 \u0623\u0639\u0628\u0627\u0626\u0647\u0645 \u064A\u062A\u062D\u062F\u062B \u0628\u0635\u0648\u062A \u0639\u0627\u0644\u064D.",
    examples: ["\u{1F3E0} \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u062F\u0648\u0646 \u0637\u0644\u0628", "\u{1F373} \u0637\u0628\u062E \u0648\u062C\u0628\u0629", "\u{1F527} \u0625\u0635\u0644\u0627\u062D \u0634\u064A\u0621", "\u{1F4CB} \u062A\u0648\u0644\u064A \u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u0631\u0647\u0642\u0629", "\u{1F680} \u0645\u0633\u0627\u0639\u062F\u0629 \u0639\u0645\u0644\u064A\u0629 \u0641\u064A \u0627\u0644\u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0645\u0632\u062D\u0648\u0645\u0629"],
    howToLove: ["\u0627\u0633\u0623\u0644 '\u0643\u064A\u0641 \u0623\u0633\u0627\u0639\u062F\u0643 \u0627\u0644\u064A\u0648\u0645\u061F'", "\u0644\u0627\u062D\u0638 \u0645\u0627 \u064A\u0648\u062A\u0631\u0647\u0645 \u0648\u062A\u0635\u0631\u0641 \u0642\u0628\u0644 \u0627\u0644\u0637\u0644\u0628", "\u0627\u0644\u062A\u0632\u0645 \u0628\u0648\u0639\u0648\u062F\u0643 \u2014 \u0627\u0644\u0645\u0648\u062B\u0648\u0642\u064A\u0629 \u0645\u0647\u0645\u0629 \u062C\u062F\u064B\u0627", "\u0627\u0641\u0639\u0644 \u0627\u0644\u0645\u0647\u0627\u0645 \u0628\u0633\u0639\u0627\u062F\u0629", "\u062A\u0648\u0642\u0639 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u062C\u0627\u062A \u0645\u0633\u0628\u0642\u064B\u0627"],
    whatHurts: "\u0627\u0644\u0648\u0639\u0648\u062F \u0627\u0644\u0645\u0643\u0633\u0648\u0631\u0629\u060C \u0627\u0644\u0643\u0633\u0644\u060C \u0623\u0648 \u0631\u0641\u0636 \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629."
  },
  touch: {
    meaning: "\u0627\u0644\u0639\u0646\u0627\u0642\u060C \u0645\u0633\u0643 \u0627\u0644\u0623\u064A\u062F\u064A\u060C \u0627\u0644\u0644\u0645\u0633\u0627\u062A \u0627\u0644\u0645\u062F\u0631\u0648\u0633\u0629 \u2014 \u0643\u0644\u0647\u0627 \u0637\u0631\u0642 \u0644\u0644\u062A\u0639\u0628\u064A\u0631 \u0639\u0646 \u0627\u0644\u0627\u0647\u062A\u0645\u0627\u0645 \u0648\u0627\u0644\u062D\u0628. \u0627\u0644\u062A\u0648\u0627\u062C\u062F \u0627\u0644\u062C\u0633\u062F\u064A \u0636\u0631\u0648\u0631\u064A.",
    examples: ["\u{1F91D} \u0645\u0633\u0643 \u0627\u0644\u0623\u064A\u062F\u064A", "\u{1FAC2} \u0627\u0644\u0639\u0646\u0627\u0642 \u0639\u0646\u062F \u0627\u0644\u0644\u0642\u0627\u0621 \u0648\u0627\u0644\u0648\u062F\u0627\u0639", "\u{1F590}\uFE0F \u0644\u0645\u0633\u0629 \u0639\u0644\u0649 \u0627\u0644\u0643\u062A\u0641", "\u{1F6CB}\uFE0F \u0627\u0644\u062C\u0644\u0648\u0633 \u0628\u0627\u0644\u0642\u0631\u0628", "\u{1F48B} \u0644\u0645\u0633\u0629 \u0644\u0637\u064A\u0641\u0629 \u0639\u0627\u0628\u0631\u0629"],
    howToLove: ["\u0627\u0645\u0633\u0643 \u064A\u062F\u0647\u0645 \u0639\u0646\u062F \u0627\u0644\u0645\u0634\u064A", "\u0627\u0633\u062A\u0642\u0628\u0644\u0647\u0645 \u0648\u0648\u062F\u0639\u0647\u0645 \u0628\u0639\u0646\u0627\u0642", "\u0642\u062F\u0645 \u0631\u0627\u062D\u0629 \u062C\u0633\u062F\u064A\u0629 \u0641\u064A \u0627\u0644\u0644\u062D\u0638\u0627\u062A \u0627\u0644\u0635\u0639\u0628\u0629", "\u0628\u0627\u062F\u0631 \u0628\u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u0639\u0627\u0637\u0641\u064A", "\u0643\u0646 \u0645\u062A\u0639\u0645\u062F\u064B\u0627 \u0641\u064A \u0627\u0644\u0644\u0645\u0633 \u0627\u0644\u064A\u0648\u0645\u064A"],
    whatHurts: "\u0627\u0644\u0625\u0647\u0645\u0627\u0644 \u0627\u0644\u062C\u0633\u062F\u064A\u060C \u0641\u062A\u0631\u0627\u062A \u0637\u0648\u064A\u0644\u0629 \u0628\u062F\u0648\u0646 \u062D\u0646\u0627\u0646\u060C \u0623\u0648 \u0627\u0644\u0627\u0628\u062A\u0639\u0627\u062F \u0639\u0646 \u0644\u0645\u0633\u062A\u0647\u0645."
  },
};

// ──── COMPONENTS ────
function CircleChart({ scores, sorted, onDark = false, langLabelsMap }) {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const size = 200, cx = 100, cy = 100, r = 80, sw = 20;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const segs = sorted.map(([lang, score]) => {
    const pct = score / total, dash = pct * circ, rot = offset * 360;
    offset += pct;
    return { lang, dash, gap: circ - dash, rot };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={onDark ? "rgba(255,255,255,0.15)" : "#f3f4f6"} strokeWidth={sw} />
      {segs.map(({ lang, dash, gap, rot }) => (
        <circle key={lang} cx={cx} cy={cy} r={r} fill="none"
          stroke={onDark ? "white" : langColors[lang].primary}
          strokeWidth={sw} strokeOpacity={onDark ? (lang === sorted[0][0] ? 1 : 0.35) : 1}
          strokeDasharray={`${dash} ${gap}`} strokeDashoffset={0}
          transform={`rotate(${rot - 90} ${cx} ${cy})`}
          style={{ transition: "all 1s ease" }} />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="32" fontWeight="800" fill={onDark ? "white" : "#1e1b4b"}>
        {Math.round((sorted[0][1] / total) * 100)}%
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="11" fill={onDark ? "rgba(255,255,255,0.7)" : "#6b7280"} fontWeight="600">
        {(langLabelsMap[sorted[0][0]] || "").split(" ")[0]}
      </text>
    </svg>
  );
}

function Confetti() {
  const colors = ["#007AFF", "#FF2D55", "#FF9500", "#34C759", "#AF52DE", "#5AC8FA", "#FFCC00"];
  const p = Array.from({ length: 40 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 2,
    dur: 2 + Math.random() * 2, color: colors[i % colors.length], size: 6 + Math.random() * 6,
  }));
  return (
    <>
      <style>{`@keyframes cFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1000, overflow: "hidden" }}>
        {p.map((x) => <div key={x.id} style={{ position: "absolute", left: `${x.left}%`, top: -20, width: x.size, height: x.size, background: x.color, borderRadius: x.size > 8 ? "50%" : "2px", animation: `cFall ${x.dur}s ease-in ${x.delay}s forwards` }} />)}
      </div>
    </>
  );
}

function ResultCard({ lang, score, total, rank, isOpen, onToggle, t, langD }) {
  const pct = Math.round((score / total) * 100);
  const data = langD[lang];
  const color = langColors[lang];
  const isPrimary = rank === 0, isSecondary = rank === 1;
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: "white", borderRadius: 16, overflow: "hidden",
        boxShadow: isPrimary ? `0 8px 32px ${color.primary}18` : hover ? "0 4px 20px rgba(0,0,0,0.07)" : "0 1px 8px rgba(0,0,0,0.04)",
        border: isPrimary ? `2px solid ${color.primary}` : "1px solid #e5e7eb",
        marginBottom: 14, transition: "all 0.3s ease",
        transform: hover && !isPrimary ? "translateY(-2px)" : "none"
      }}>
      <button onClick={onToggle} style={{ width: "100%", background: "none", border: "none", padding: "18px 20px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 26, flexShrink: 0 }}>{langEmoji[lang]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E" }}>{t.langLabels[lang]}</span>
            {isPrimary && <span style={{ background: color.gradient, color: "white", fontSize: 10, padding: "2px 10px", borderRadius: 99, fontWeight: 700 }}>{t.primary}</span>}
            {isSecondary && <span style={{ background: "#f2f2f7", color: "#8e8e93", fontSize: 10, padding: "2px 10px", borderRadius: 99, fontWeight: 700 }}>{t.secondary}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 6, background: "#f2f2f7", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color.gradient, borderRadius: 99, transition: "width 1s ease" }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: color.primary, minWidth: 38 }}>{pct}%</span>
          </div>
        </div>
        <span style={{ fontSize: 16, color: "#C7C7CC", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} aria-hidden="true">{"\u25BE"}</span>
      </button>
      {isOpen && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f2f2f7" }}>
          <div style={{ paddingTop: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: color.primary, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 8px" }}>{"\u{1F4A1}"} {t.whatMeans}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "#3A3A3C", margin: "0 0 20px" }}>{data.meaning}</p>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: color.primary, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 8px" }}>{"\u2728"} {t.examples}</h3>
            <ul style={{ margin: "0 0 20px", paddingLeft: 4, listStyle: "none" }}>{data.examples.map((e, i) => <li key={i} style={{ fontSize: 14, lineHeight: 2, color: "#48484A" }}>{e}</li>)}</ul>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: color.primary, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 8px" }}>{"\u2764\uFE0F"} {t.howToLove}</h3>
            <ul style={{ margin: "0 0 20px", paddingInlineStart: 20 }}>{data.howToLove.map((tip, i) => <li key={i} style={{ fontSize: 14, lineHeight: 2, color: "#48484A" }}>{tip}</li>)}</ul>
            <div style={{ background: "#FFF0F1", borderRadius: 12, padding: "14px 16px", border: "1px solid #FFD1D5" }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#FF3B30", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>{"\u{1F494}"} {t.whatHurts}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#8B0000", margin: 0 }}>{data.whatHurts}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ──── LANG TOGGLE ────
function LangToggle({ lang, setLang, isRTL, font }) {
  return (
    <button data-no-print onClick={() => setLang(lang === "en" ? "ar" : "en")} aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"} style={{
      position: "fixed", top: 16, [isRTL ? "left" : "right"]: 16, zIndex: 100,
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
      border: "1px solid rgba(0,0,0,0.08)", borderRadius: 99,
      padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
      color: "#1C1C1E", fontFamily: font, boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
    }}>
      {lang === "en" ? "\u{1F1F8}\u{1F1E6} \u0639\u0631\u0628\u064A" : "\u{1F1EC}\u{1F1E7} English"}
    </button>
  );
}

// ──── MAIN APP ────
export default function LoveLanguagesTest() {
  const [lang, setLang] = useState("en");
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [openCards, setOpenCards] = useState({});
  const [animateIn, setAnimateIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const t = i18n[lang];
  const qs = questions[lang];
  const langD = lang === "ar" ? langDataAR : langDataEN;
  const isRTL = lang === "ar";
  const font = "'IBM Plex Sans Arabic', 'SF Pro Display', system-ui, sans-serif";

  useEffect(() => {
    if (showResults) {
      setShowConfetti(true);
      setTimeout(() => setAnimateIn(true), 100);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [showResults]);

  const handleAnswer = (choice) => {
    setAnswers({ ...answers, [currentQ]: choice });
    if (currentQ < qs.length - 1) setTimeout(() => setCurrentQ(currentQ + 1), 300);
    else setTimeout(() => setShowResults(true), 400);
  };

  const getScores = () => {
    const scores = { words: 0, service: 0, gifts: 0, time: 0, touch: 0 };
    Object.entries(answers).forEach(([idx, ch]) => { scores[qs[parseInt(idx)][ch].lang]++; });
    return scores;
  };

  const restart = () => {
    setCurrentQ(0); setAnswers({}); setShowResults(false);
    setOpenCards({}); setAnimateIn(false); setShowConfetti(false); setStarted(true);
  };

  const toggleCard = (l) => setOpenCards((p) => ({ ...p, [l]: !p[l] }));
  const resultsRef = useRef(null);

  const handleSavePDF = useCallback(() => {
    const scores = getScores();
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0][0];
    const langD_ = lang === "ar" ? langDataAR : langDataEN;

    const pw = 595, ph = 842; // A4 in points
    const pdf = new jsPDF({ unit: "pt", format: [pw, ph] });
    const mx = 40; // margin x
    const cw = pw - mx * 2; // content width

    // Helper: rounded rect fill
    const rrect = (x, y, w, h, r, color) => {
      pdf.setFillColor(color);
      pdf.roundedRect(x, y, w, h, r, r, "F");
    };

    // ── Background
    pdf.setFillColor("#F2F2F7");
    pdf.rect(0, 0, pw, ph, "F");

    // ── Hero gradient (simulated with solid color)
    const heroH = 170;
    const pColor = langColors[primary].primary;
    rrect(mx, 28, cw, heroH, 14, pColor);

    // Hero text
    pdf.setTextColor("#FFFFFF");
    pdf.setFontSize(9);
    pdf.setFont(undefined, "bold");
    pdf.text(t.primaryLang.toUpperCase(), pw / 2, 58, { align: "center" });
    pdf.setFontSize(22);
    pdf.text(t.langLabels[primary], pw / 2, 85, { align: "center" });
    pdf.setFontSize(40);
    pdf.text(`${Math.round((sorted[0][1] / total) * 100)}%`, pw / 2, 135, { align: "center" });
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.setTextColor(255, 255, 255, 0.7);
    pdf.text(t.basedOn, pw / 2, 160, { align: "center" });

    // ── Score badges
    let badgeY = heroH + 46;
    const badgeW = (cw - 4 * 8) / 5;
    sorted.forEach(([l, score], i) => {
      const bx = mx + i * (badgeW + 8);
      rrect(bx, badgeY, badgeW, 62, 8, "#FFFFFF");
      const pct = Math.round((score / total) * 100);
      const c = langColors[l].primary;
      pdf.setTextColor(c);
      pdf.setFontSize(16);
      pdf.setFont(undefined, "bold");
      pdf.text(`${pct}%`, bx + badgeW / 2, badgeY + 28, { align: "center" });
      pdf.setTextColor("#8E8E93");
      pdf.setFontSize(7);
      pdf.setFont(undefined, "normal");
      pdf.text(t.langLabels[l].split(" ")[0], bx + badgeW / 2, badgeY + 44, { align: "center" });
      // Bar
      const barW = badgeW - 16, barH = 4;
      rrect(bx + 8, badgeY + 50, barW, barH, 2, "#E5E5EA");
      rrect(bx + 8, badgeY + 50, barW * (pct / 100), barH, 2, c);
    });

    // ── Detailed Breakdown
    let cy = badgeY + 80;
    pdf.setTextColor("#AEAEB2");
    pdf.setFontSize(8);
    pdf.setFont(undefined, "bold");
    pdf.text("DETAILED BREAKDOWN", mx + 4, cy);
    cy += 14;

    sorted.forEach(([l, score], idx) => {
      const pct = Math.round((score / total) * 100);
      const data = langD_[l];
      const c = langColors[l].primary;
      const isPrimary = idx === 0;
      const cardH = isPrimary ? 220 : 44;

      // Card bg
      rrect(mx, cy, cw, cardH, 10, "#FFFFFF");
      if (isPrimary) {
        pdf.setDrawColor(c);
        pdf.setLineWidth(1.5);
        pdf.roundedRect(mx, cy, cw, cardH, 10, 10, "S");
      }

      // Title row
      pdf.setTextColor("#1C1C1E");
      pdf.setFontSize(11);
      pdf.setFont(undefined, "bold");
      pdf.text(t.langLabels[l], mx + 16, cy + 18);

      // Badge
      if (isPrimary) {
        const badgeText = t.primary;
        pdf.setFontSize(7);
        const btw = pdf.getTextWidth(badgeText) + 12;
        rrect(mx + 16 + pdf.getTextWidth(t.langLabels[l]) + 8, cy + 8, btw, 14, 7, c);
        pdf.setTextColor("#FFFFFF");
        pdf.text(badgeText, mx + 16 + pdf.getTextWidth(t.langLabels[l]) + 8 + btw / 2, cy + 18, { align: "center" });
      }

      // Percentage
      pdf.setTextColor(c);
      pdf.setFontSize(11);
      pdf.setFont(undefined, "bold");
      pdf.text(`${pct}%`, mx + cw - 16, cy + 18, { align: "right" });

      // Score bar
      const barY = cy + 26;
      rrect(mx + 16, barY, cw - 32, 4, 2, "#E5E5EA");
      rrect(mx + 16, barY, (cw - 32) * (pct / 100), 4, 2, c);

      // Expanded content for primary
      if (isPrimary) {
        let ty = barY + 20;
        // What this means
        pdf.setTextColor(c);
        pdf.setFontSize(7);
        pdf.setFont(undefined, "bold");
        pdf.text("WHAT THIS MEANS", mx + 16, ty);
        ty += 10;
        pdf.setTextColor("#3A3A3C");
        pdf.setFontSize(8);
        pdf.setFont(undefined, "normal");
        const meaningLines = pdf.splitTextToSize(data.meaning, cw - 40);
        pdf.text(meaningLines, mx + 16, ty);
        ty += meaningLines.length * 10 + 8;

        // How to love
        pdf.setTextColor(c);
        pdf.setFontSize(7);
        pdf.setFont(undefined, "bold");
        pdf.text("HOW TO LOVE SOMEONE WITH THIS LANGUAGE", mx + 16, ty);
        ty += 10;
        pdf.setTextColor("#48484A");
        pdf.setFontSize(8);
        pdf.setFont(undefined, "normal");
        data.howToLove.slice(0, 4).forEach((tip) => {
          pdf.text(`\u2022 ${tip}`, mx + 20, ty);
          ty += 11;
        });
        ty += 4;

        // What hurts
        rrect(mx + 12, ty - 4, cw - 24, 28, 6, "#FFF0F1");
        pdf.setTextColor("#FF3B30");
        pdf.setFontSize(7);
        pdf.setFont(undefined, "bold");
        pdf.text("WHAT HURTS MOST", mx + 20, ty + 6);
        pdf.setTextColor("#8B0000");
        pdf.setFontSize(8);
        pdf.setFont(undefined, "normal");
        pdf.text(data.whatHurts.substring(0, 80), mx + 20, ty + 18);
      }

      cy += cardH + 8;
    });

    // ── Footer
    pdf.setTextColor("#AEAEB2");
    pdf.setFontSize(8);
    pdf.setFont(undefined, "normal");
    pdf.text("The 5 Love Languages Quiz", pw / 2, ph - 24, { align: "center" });

    pdf.save("love-language-results.pdf");
  }, [answers, lang, t]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShareImage = useCallback(() => {
    const scores = getScores();
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0][0];
    const canvas = document.createElement("canvas");
    const w = 600, h = 700;
    canvas.width = w * 2; canvas.height = h * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);

    // Background
    ctx.fillStyle = "#F2F2F7";
    ctx.fillRect(0, 0, w, h);

    // Hero gradient
    const colors = { words: ["#007AFF", "#5AC8FA"], service: ["#FF9500", "#FFCC00"], gifts: ["#FF2D55", "#FF6482"], time: ["#34C759", "#30D158"], touch: ["#AF52DE", "#BF5AF2"] };
    const grad = ctx.createLinearGradient(0, 0, w, 300);
    grad.addColorStop(0, colors[primary][0]);
    grad.addColorStop(1, colors[primary][1]);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(30, 30, w - 60, 280, 20);
    ctx.fill();

    // Hero text
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "600 12px 'IBM Plex Sans Arabic', system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.primaryLang.toUpperCase(), w / 2, 80);
    ctx.fillStyle = "white";
    ctx.font = "800 32px 'IBM Plex Sans Arabic', system-ui";
    ctx.fillText(t.langLabels[primary], w / 2, 125);
    ctx.font = "800 56px system-ui";
    ctx.fillText(`${Math.round((sorted[0][1] / total) * 100)}%`, w / 2, 200);
    ctx.font = "500 14px 'IBM Plex Sans Arabic', system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(t.basedOn, w / 2, 240);

    // Emoji on hero
    ctx.font = "48px system-ui";
    ctx.fillText(langEmoji[primary], w / 2, 285);

    // Score bars
    const barY = 350;
    sorted.forEach(([l, score], i) => {
      const x = 30 + i * ((w - 60) / 5);
      const bw = (w - 60) / 5 - 8;
      const pct = Math.round((score / total) * 100);
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.roundRect(x, barY, bw, 100, 12);
      ctx.fill();
      ctx.font = "28px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(langEmoji[l], x + bw / 2, barY + 36);
      ctx.fillStyle = langColors[l].primary;
      ctx.font = "800 20px system-ui";
      ctx.fillText(`${pct}%`, x + bw / 2, barY + 65);
      ctx.fillStyle = "#8E8E93";
      ctx.font = "600 10px 'IBM Plex Sans Arabic', system-ui";
      ctx.fillText(t.langLabels[l].split(" ")[0], x + bw / 2, barY + 85);
    });

    // All languages detail
    const detailY = 480;
    sorted.forEach(([l, score], i) => {
      const pct = Math.round((score / total) * 100);
      const y = detailY + i * 36;
      ctx.textAlign = isRTL ? "right" : "left";
      ctx.font = "16px system-ui";
      ctx.fillText(langEmoji[l], isRTL ? w - 50 : 50, y);
      ctx.fillStyle = "#1C1C1E";
      ctx.font = "600 14px 'IBM Plex Sans Arabic', system-ui";
      ctx.fillText(t.langLabels[l], isRTL ? w - 80 : 80, y);
      // Bar
      const barStartX = 280, barWidth = 200;
      ctx.fillStyle = "#E5E5EA";
      ctx.beginPath(); ctx.roundRect(barStartX, y - 10, barWidth, 10, 5); ctx.fill();
      ctx.fillStyle = langColors[l].primary;
      ctx.beginPath(); ctx.roundRect(barStartX, y - 10, barWidth * (pct / 100), 10, 5); ctx.fill();
      ctx.textAlign = "right";
      ctx.fillStyle = langColors[l].primary;
      ctx.font = "700 14px system-ui";
      ctx.fillText(`${pct}%`, w - 50, y);
      ctx.textAlign = "center";
    });

    // Footer
    ctx.fillStyle = "#AEAEB2";
    ctx.font = "500 11px 'IBM Plex Sans Arabic', system-ui";
    ctx.textAlign = "center";
    ctx.fillText("The 5 Love Languages Quiz \u2764\uFE0F", w / 2, h - 30);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `love-language-results.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [answers, lang, t, isRTL]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync html lang and dir attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  // Reset quiz state when language changes mid-quiz
  useEffect(() => {
    if (started && !showResults) {
      setCurrentQ(0);
      setAnswers({});
    }
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const pageStyle = {
    minHeight: "100vh", background: "#F2F2F7",
    padding: "24px 16px", fontFamily: font, direction: t.dir
  };

  // ═══════════════ START ═══════════════
  if (!started) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LangToggle lang={lang} setLang={setLang} isRTL={isRTL} font={font} />
        <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>{"\u2764\uFE0F"}</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1C1E", margin: "0 0 12px", letterSpacing: "-0.5px", fontFamily: font }}>{t.title}</h1>
          <p style={{ fontSize: 16, color: "#8E8E93", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 360, marginInline: "auto", fontFamily: font }}>{t.subtitle}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 36 }}>
            {Object.entries(t.langLabels).map(([key, label]) => (
              <div key={key} style={{
                background: langColors[key].light, border: `1px solid ${langColors[key].primary}18`,
                borderRadius: 99, padding: "8px 14px", fontSize: 13, fontWeight: 600,
                color: langColors[key].primary, display: "flex", alignItems: "center", gap: 6, fontFamily: font
              }}>{langEmoji[key]} {label}</div>
            ))}
          </div>
          <button onClick={() => setStarted(true)} style={{
            background: "#007AFF", color: "white", border: "none",
            padding: "16px 48px", borderRadius: 14, fontSize: 17, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 16px rgba(0,122,255,0.25)",
            fontFamily: font
          }}>{t.start} {"\u2728"}</button>
          <p style={{ fontSize: 12, color: "#AEAEB2", marginTop: 20, fontFamily: font }}>
            {t.time} {"\u23F1\uFE0F"} · {t.credit}
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════ RESULTS ═══════════════
  if (showResults) {
    const scores = getScores();
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0][0];
    const isBilingual = sorted[0][1] === sorted[1][1];
    return (
      <div style={{ ...pageStyle, opacity: animateIn ? 1 : 0, transition: "opacity 0.6s ease" }}>
        <LangToggle lang={lang} setLang={setLang} isRTL={isRTL} font={font} />
        {showConfetti && <Confetti />}
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {/* Hero */}
          <div style={{
            background: langColors[primary].gradient, borderRadius: 20,
            padding: "36px 24px 32px", marginBottom: 24, color: "white",
            position: "relative", overflow: "hidden", textAlign: "center"
          }}>
            <div style={{ position: "absolute", top: -50, [isRTL ? "left" : "right"]: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>{langEmoji[primary]}</div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.8, fontWeight: 700, marginBottom: 8, fontFamily: font }}>
                {isBilingual ? t.bilingual : t.primaryLang}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 14px", fontFamily: font }}>{t.langLabels[primary]}</h1>
              {isBilingual && <p style={{ fontSize: 14, opacity: 0.9, margin: "0 0 14px", fontFamily: font }}>{t.tiedWith} {t.langLabels[sorted[1][0]]} {langEmoji[sorted[1][0]]}</p>}
              <CircleChart scores={scores} sorted={sorted} onDark={true} langLabelsMap={t.langLabels} />
            </div>
          </div>
          {/* Quick scores */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {sorted.map(([l, score]) => (
              <div key={l} style={{ background: "white", borderRadius: 14, padding: "10px 8px", textAlign: "center", flex: "1 1 0", minWidth: 60, border: "1px solid #E5E5EA" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{langEmoji[l]}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: langColors[l].primary }}>{Math.round((score / total) * 100)}%</div>
                <div style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, fontFamily: font }}>{t.langLabels[l].split(" ")[0]}</div>
              </div>
            ))}
          </div>
          {/* Breakdown */}
          <h2 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: "#AEAEB2", fontWeight: 700, margin: "0 0 14px 4px", fontFamily: font }}>{"\u{1F4CA}"} {t.breakdown}</h2>
          {sorted.map(([l, score], idx) => (
            <ResultCard key={l} lang={l} score={score} total={total} rank={idx}
              isOpen={openCards[l] ?? (idx === 0)} onToggle={() => toggleCard(l)} t={t} langD={langD} />
          ))}
          {/* Next steps */}
          <div style={{ background: "white", borderRadius: 18, padding: "24px 20px", marginBottom: 20, border: "1px solid #E5E5EA" }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1C1C1E", margin: "0 0 16px", textAlign: "center", fontFamily: font }}>{"\u{1F680}"} {t.whatsNext}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {t.nextSteps.map((item, i) => (
                <div key={i} style={{ background: "#F2F2F7", borderRadius: 14, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{item.emoji}</div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E", margin: "0 0 2px", fontFamily: font }}>{item.title}</h3>
                  <p style={{ fontSize: 11, color: "#8E8E93", lineHeight: 1.4, margin: 0, fontFamily: font }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Export */}
          <div data-no-print style={{ display: "flex", gap: 10, marginBottom: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={handleShareImage} style={{
              background: "white", color: "#007AFF", border: "1px solid #007AFF",
              padding: "12px 24px", borderRadius: 14, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 8
            }}>{"\u{1F4F8}"} {t.shareImage}</button>
            <button onClick={handleSavePDF} style={{
              background: "white", color: "#8E8E93", border: "1px solid #E5E5EA",
              padding: "12px 24px", borderRadius: 14, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 8
            }}>{"\u{1F4C4}"} {t.saveAsPDF}</button>
          </div>
          {/* Retake */}
          <div data-no-print style={{ textAlign: "center", paddingBottom: 32 }}>
            <button onClick={restart} style={{ background: "white", color: "#8E8E93", border: "1px solid #E5E5EA", padding: "14px 36px", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: font }}>
              {"\u{1F504}"} {t.retake}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════ QUIZ ═══════════════
  const q = qs[currentQ];
  const progress = (Object.keys(answers).length / qs.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={pageStyle}>
      <LangToggle lang={lang} setLang={setLang} isRTL={isRTL} font={font} />
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{"\u{1F4AC}\u2764\uFE0F\u{1F381}\u23F3\u{1F917}"}</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1C1C1E", margin: "0 0 4px", fontFamily: font }}>{t.title}</h1>
        </div>
        {/* Progress */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: "#1C1C1E", fontWeight: 700, fontFamily: font }}>{t.questionOf(currentQ + 1, qs.length)}</span>
            <span style={{ fontSize: 12, color: "#007AFF", fontWeight: 600, background: "#EBF5FF", padding: "2px 10px", borderRadius: 99, fontFamily: font }}>{t.answered(answeredCount)}</span>
          </div>
          <div style={{ height: 6, background: "#E5E5EA", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #007AFF, #5AC8FA)", borderRadius: 99, transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1)" }} />
          </div>
        </div>
        {/* Card */}
        <div style={{ background: "white", borderRadius: 20, padding: "28px 20px", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "1px solid #E5E5EA" }}>
          <div style={{ textAlign: "center", marginBottom: 22, padding: "10px 14px", background: "#EBF5FF", borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: "#007AFF", margin: 0, fontWeight: 600, fontFamily: font }}>{"\u{1F914}"} {t.which}</p>
          </div>
          {["a", "b"].map((choice) => {
            const isSel = answers[currentQ] === choice;
            const isHov = hovered === `${currentQ}-${choice}`;
            return (
              <button key={choice} onClick={() => handleAnswer(choice)}
                onMouseEnter={() => setHovered(`${currentQ}-${choice}`)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  width: "100%", padding: "20px 18px", marginBottom: choice === "a" ? 12 : 0,
                  background: isSel ? "#007AFF" : isHov ? "#F2F2F7" : "white",
                  color: isSel ? "white" : "#1C1C1E",
                  border: isSel ? "2px solid #007AFF" : "2px solid #E5E5EA",
                  borderRadius: 14, fontSize: 15, lineHeight: 1.65,
                  cursor: "pointer", textAlign: isRTL ? "right" : "left",
                  transition: "all 0.2s ease", fontWeight: 500,
                  transform: isSel ? "scale(0.985)" : "scale(1)",
                  minHeight: 64, fontFamily: font,
                }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: isSel ? "rgba(255,255,255,0.25)" : "#F2F2F7",
                  color: isSel ? "white" : "#AEAEB2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 12, marginTop: 2
                }}>{choice.toUpperCase()}</div>
                <span>{q[choice].text}</span>
              </button>
            );
          })}
        </div>
        {/* Back */}
        {currentQ > 0 && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={() => setCurrentQ(currentQ - 1)}
              style={{ background: "white", border: "1px solid #E5E5EA", color: "#8E8E93", fontSize: 14, cursor: "pointer", padding: "10px 24px", borderRadius: 12, fontWeight: 600, fontFamily: font }}>
              {isRTL ? "\u2192" : "\u2190"} {t.previous}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}