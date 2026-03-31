import { useState, useEffect, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #060810;
    --surface: #0d1117;
    --surface2: #131b26;
    --border: rgba(0,200,255,0.12);
    --cyan: #00d4ff;
    --cyan2: #00ffe0;
    --orange: #ff6b35;
    --green: #39ff14;
    --red: #ff2d55;
    --gold: #ffd60a;
    --text: #e8edf5;
    --muted: #5a6b80;
    --font-display: 'Bebas Neue', cursive;
    --font-body: 'Rajdhani', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 16px;
    min-height: 100vh;
    overflow-x: hidden;
  }
  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
  }
  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--cyan); border-radius: 2px; }
  
  /* Nav */
  .nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 28px;
    background: rgba(6,8,16,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 26px;
    letter-spacing: 2px;
    color: var(--cyan);
    text-shadow: 0 0 20px rgba(0,212,255,0.5);
    cursor: pointer;
  }
  .nav-logo span { color: var(--orange); }
  .nav-tabs {
    display: flex; gap: 4px;
  }
  .nav-tab {
    padding: 7px 18px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--muted);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .nav-tab:hover { color: var(--text); }
  .nav-tab.active {
    background: rgba(0,212,255,0.1);
    color: var(--cyan);
    border: 1px solid rgba(0,212,255,0.2);
  }
  .nav-user {
    display: flex; align-items: center; gap: 12px;
  }
  .balance {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--gold);
    background: rgba(255,214,10,0.08);
    border: 1px solid rgba(255,214,10,0.2);
    padding: 6px 14px;
    border-radius: 20px;
  }
  .btn {
    padding: 8px 20px;
    border-radius: 6px;
    border: none;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-primary {
    background: var(--cyan);
    color: #000;
  }
  .btn-primary:hover {
    background: var(--cyan2);
    box-shadow: 0 0 20px rgba(0,212,255,0.4);
    transform: translateY(-1px);
  }
  .btn-outline {
    background: transparent;
    color: var(--cyan);
    border: 1px solid rgba(0,212,255,0.4);
  }
  .btn-outline:hover {
    background: rgba(0,212,255,0.08);
    border-color: var(--cyan);
  }
  .btn-orange {
    background: var(--orange);
    color: #fff;
  }
  .btn-orange:hover {
    box-shadow: 0 0 20px rgba(255,107,53,0.5);
    transform: translateY(-1px);
  }
  .btn-sm { padding: 6px 14px; font-size: 12px; }
  .btn-lg { padding: 14px 36px; font-size: 16px; }

  /* Hero */
  .hero {
    position: relative;
    text-align: center;
    padding: 80px 20px 60px;
    overflow: hidden;
  }
  .hero-glow {
    position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
    width: 700px; height: 400px;
    background: radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 16px;
    border-radius: 20px;
    background: rgba(57,255,20,0.08);
    border: 1px solid rgba(57,255,20,0.25);
    color: var(--green);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green);
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(57,255,20,0.4); }
    50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(57,255,20,0); }
  }
  .hero h1 {
    font-family: var(--font-display);
    font-size: clamp(52px, 8vw, 96px);
    line-height: 0.95;
    letter-spacing: 4px;
    color: var(--text);
    margin-bottom: 16px;
  }
  .hero h1 .accent { color: var(--cyan); text-shadow: 0 0 40px rgba(0,212,255,0.4); }
  .hero h1 .accent2 { color: var(--orange); }
  .hero-sub {
    font-size: 18px;
    color: var(--muted);
    max-width: 520px;
    margin: 0 auto 36px;
    line-height: 1.6;
    font-weight: 500;
  }
  .hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .hero-stats {
    display: flex; justify-content: center; gap: 40px;
    margin-top: 56px; flex-wrap: wrap;
  }
  .stat-item { text-align: center; }
  .stat-num {
    font-family: var(--font-display);
    font-size: 36px;
    color: var(--cyan);
    display: block;
  }
  .stat-label {
    font-size: 12px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  /* Section */
  .section { padding: 20px 16px 40px; max-width: 1100px; margin: 0 auto; }
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .section-title {
    font-family: var(--font-display);
    font-size: 28px;
    letter-spacing: 2px;
    color: var(--text);
  }
  .section-title span { color: var(--cyan); }
  .tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .tag-live { background: rgba(57,255,20,0.12); color: var(--green); border: 1px solid rgba(57,255,20,0.25); }
  .tag-soon { background: rgba(255,107,53,0.12); color: var(--orange); border: 1px solid rgba(255,107,53,0.25); }
  .tag-done { background: rgba(90,107,128,0.2); color: var(--muted); border: 1px solid rgba(90,107,128,0.2); }

  /* Match Card */
  .matches-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
  }
  .match-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
  }
  .match-card:hover {
    border-color: rgba(0,212,255,0.3);
    box-shadow: 0 0 30px rgba(0,212,255,0.06), 0 8px 32px rgba(0,0,0,0.4);
    transform: translateY(-2px);
  }
  .match-card.selected {
    border-color: rgba(0,212,255,0.5);
    box-shadow: 0 0 40px rgba(0,212,255,0.1);
  }
  .card-top {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px 0;
  }
  .card-game {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted);
  }
  .game-icon { font-size: 16px; }
  .prize-pool {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--gold);
  }
  .vs-section {
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: center; gap: 0;
    padding: 16px;
  }
  .player-side { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .player-side.right { }
  .avatar {
    width: 56px; height: 56px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    border: 2px solid transparent;
    transition: all 0.2s;
  }
  .avatar-left { background: rgba(0,212,255,0.1); border-color: rgba(0,212,255,0.3); }
  .avatar-right { background: rgba(255,107,53,0.1); border-color: rgba(255,107,53,0.3); }
  .player-name {
    font-weight: 700; font-size: 15px; text-align: center;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;
  }
  .player-odds {
    font-family: var(--font-mono); font-size: 11px; color: var(--muted);
  }
  .vs-badge {
    font-family: var(--font-display); font-size: 28px; letter-spacing: 2px;
    color: var(--muted); text-align: center; padding: 0 8px;
  }
  /* Progress bar */
  .progress-wrap { padding: 0 16px 4px; }
  .progress-labels {
    display: flex; justify-content: space-between;
    font-family: var(--font-mono); font-size: 11px;
    color: var(--muted); margin-bottom: 6px;
  }
  .progress-bar-bg {
    height: 6px; border-radius: 3px;
    background: rgba(255,255,255,0.05);
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--cyan), var(--orange));
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    margin-top: 8px;
  }
  .betters-count { font-size: 12px; color: var(--muted); }
  .betters-count span { color: var(--text); font-weight: 700; }

  /* Match Detail */
  .match-detail {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .detail-header {
    padding: 20px 24px;
    background: linear-gradient(135deg, rgba(0,212,255,0.05), rgba(255,107,53,0.05));
    border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
  }
  .stream-embed {
    background: #000;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 16/9;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border);
    position: relative;
    margin: 0 24px 24px;
  }
  .stream-placeholder {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    color: var(--muted);
  }
  .stream-icon { font-size: 48px; }
  .stream-link-badge {
    position: absolute; top: 12px; right: 12px;
    background: rgba(0,0,0,0.7);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    font-size: 12px; font-weight: 600;
    padding: 4px 12px; border-radius: 4px;
    display: flex; align-items: center; gap: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .stream-link-badge:hover { background: rgba(255,255,255,0.1); }
  
  /* Prediction Panel */
  .prediction-panel {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    padding: 0 24px 24px;
  }
  .pred-side {
    border-radius: 10px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;
  }
  .pred-side::before {
    content: '';
    position: absolute; inset: 0;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .pred-left { background: rgba(0,212,255,0.05); }
  .pred-left::before { background: rgba(0,212,255,0.08); }
  .pred-left:hover::before, .pred-left.chosen::before { opacity: 1; }
  .pred-left:hover, .pred-left.chosen { border-color: var(--cyan); }
  .pred-right { background: rgba(255,107,53,0.05); }
  .pred-right::before { background: rgba(255,107,53,0.08); }
  .pred-right:hover::before, .pred-right.chosen::before { opacity: 1; }
  .pred-right:hover, .pred-right.chosen { border-color: var(--orange); }
  .pred-side.chosen { transform: scale(1.01); }
  .pred-name {
    font-family: var(--font-display); font-size: 20px; letter-spacing: 1px;
    margin-bottom: 4px; position: relative;
  }
  .pred-left .pred-name { color: var(--cyan); }
  .pred-right .pred-name { color: var(--orange); }
  .pred-stat { font-size: 12px; color: var(--muted); margin-bottom: 2px; position: relative; }
  .pred-pct {
    font-family: var(--font-mono); font-size: 22px; font-weight: 700;
    margin-top: 8px; position: relative;
  }
  .pred-left .pred-pct { color: var(--cyan); }
  .pred-right .pred-pct { color: var(--orange); }
  .check-badge {
    position: absolute; top: 10px; right: 10px;
    width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    opacity: 0; transition: opacity 0.2s;
  }
  .pred-left .check-badge { background: var(--cyan); color: #000; }
  .pred-right .check-badge { background: var(--orange); color: #fff; }
  .pred-side.chosen .check-badge { opacity: 1; }

  /* Amount selector */
  .amount-section {
    padding: 0 24px 24px;
  }
  .amount-label {
    font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted); margin-bottom: 12px; display: block;
  }
  .amounts-grid {
    display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;
  }
  .amount-chip {
    padding: 8px 18px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: var(--surface2);
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .amount-chip:hover { border-color: var(--cyan); color: var(--cyan); }
  .amount-chip.active {
    border-color: var(--cyan);
    background: rgba(0,212,255,0.1);
    color: var(--cyan);
  }
  .custom-amount {
    display: flex; gap: 12px; align-items: center;
  }
  .amount-input {
    flex: 1;
    background: var(--surface2);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 15px;
    padding: 10px 16px;
    outline: none;
    transition: border-color 0.2s;
  }
  .amount-input:focus { border-color: var(--cyan); }
  .potential-win {
    font-size: 13px; color: var(--muted); margin-top: 10px;
    font-family: var(--font-mono);
  }
  .potential-win span { color: var(--green); font-weight: 700; }

  /* Admin Panel */
  .admin-panel {
    background: var(--surface);
    border: 1px solid rgba(255,214,10,0.15);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .admin-header {
    padding: 16px 20px;
    background: rgba(255,214,10,0.05);
    border-bottom: 1px solid rgba(255,214,10,0.12);
    display: flex; align-items: center; gap: 10px;
  }
  .admin-title {
    font-family: var(--font-display); font-size: 20px; letter-spacing: 2px;
    color: var(--gold);
  }
  .admin-body { padding: 20px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
  .form-input {
    background: var(--surface2);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: var(--text);
    font-family: var(--font-body); font-size: 14px;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus { border-color: rgba(255,214,10,0.4); }
  .form-select {
    background: var(--surface2);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: var(--text);
    font-family: var(--font-body); font-size: 14px;
    padding: 10px 14px;
    outline: none;
    cursor: pointer;
  }
  .admin-actions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
  .btn-green { background: var(--green); color: #000; }
  .btn-green:hover { box-shadow: 0 0 20px rgba(57,255,20,0.4); transform: translateY(-1px); }
  .btn-red { background: var(--red); color: #fff; }
  .btn-red:hover { box-shadow: 0 0 20px rgba(255,45,85,0.4); transform: translateY(-1px); }
  .btn-gold { background: var(--gold); color: #000; }
  .btn-gold:hover { box-shadow: 0 0 20px rgba(255,214,10,0.4); transform: translateY(-1px); }

  /* Activity Feed */
  .activity-feed {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }
  .feed-header {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    font-family: var(--font-display); font-size: 18px; letter-spacing: 2px;
    color: var(--text);
  }
  .feed-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    font-size: 13px;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .feed-avatar { font-size: 18px; }
  .feed-text { flex: 1; color: var(--muted); }
  .feed-text strong { color: var(--text); }
  .feed-text .cyan { color: var(--cyan); }
  .feed-text .orange { color: var(--orange); }
  .feed-amount { font-family: var(--font-mono); font-size: 12px; color: var(--gold); white-space: nowrap; }
  .feed-time { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }

  /* Divider */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 40px 0 20px;
  }
  
  /* Toast */
  .toast-container {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    display: flex; flex-direction: column; gap: 10px;
  }
  .toast {
    padding: 12px 20px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    font-size: 14px; font-weight: 600;
    color: var(--text);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
    display: flex; align-items: center; gap: 10px;
    min-width: 260px;
  }
  .toast-success { border-color: rgba(57,255,20,0.3); }
  .toast-icon { font-size: 20px; }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes toastOut {
    to { opacity: 0; transform: translateX(20px); }
  }

  /* Scrolling notification overlay */
  .overlay-ticker {
    background: rgba(6,8,16,0.92);
    border-top: 1px solid var(--border);
    padding: 8px 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .ticker-inner {
    display: inline-flex; gap: 48px;
    animation: ticker 20s linear infinite;
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .ticker-item { font-size: 13px; color: var(--muted); }
  .ticker-item strong { color: var(--cyan); }
  .ticker-item .won { color: var(--green); }
  .ticker-sep { color: rgba(255,255,255,0.1); }

  /* Mobile */
  @media (max-width: 640px) {
    .nav { padding: 12px 16px; }
    .nav-tabs { display: none; }
    .hero { padding: 40px 16px; }
    .hero h1 { font-size: 52px; }
    .prediction-panel { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .hero-stats { gap: 24px; }
    .stream-embed { margin: 0 16px 16px; }
    .prediction-panel { padding: 0 16px 16px; }
    .amount-section { padding: 0 16px 16px; }
    .detail-header { padding: 14px 16px; }
    .admin-body { padding: 14px; }
  }
`;

const GAMES = [
  { id: "cs2", name: "CS2", icon: "🎮" },
  { id: "brawl", name: "Brawl Stars", icon: "⭐" },
  { id: "valorant", name: "Valorant", icon: "🔺" },
  { id: "dota2", name: "Dota 2", icon: "🛡️" },
  { id: "other", name: "Другое", icon: "🕹️" },
];

const INITIAL_MATCHES = [
  {
    id: 1,
    game: "CS2",
    gameIcon: "🎮",
    p1: { name: "Артём", emoji: "🐍", bets: 7200 },
    p2: { name: "Пашка", emoji: "🦊", bets: 3800 },
    status: "live",
    total: 11000,
    betters: 34,
    streamUrl: "https://twitch.tv/artempro",
  },
  {
    id: 2,
    game: "Brawl Stars",
    gameIcon: "⭐",
    p1: { name: "Влад", emoji: "🐯", bets: 2100 },
    p2: { name: "Дима", emoji: "🦅", bets: 5400 },
    status: "live",
    total: 7500,
    betters: 21,
    streamUrl: "https://twitch.tv/vladshow",
  },
  {
    id: 3,
    game: "Valorant",
    gameIcon: "🔺",
    p1: { name: "Кира", emoji: "🌙", bets: 4800 },
    p2: { name: "Саша", emoji: "⚡", bets: 4900 },
    status: "soon",
    total: 0,
    betters: 0,
    streamUrl: "",
  },
];

const FEED_POOL = [
  (m) => ({ user: "🐉 Максим", text: "поставил на", player: m.p1.name, amt: 500, color: "cyan" }),
  (m) => ({ user: "🌊 Никита", text: "поставил на", player: m.p2.name, amt: 200, color: "orange" }),
  (m) => ({ user: "🔥 Алина", text: "поставил на", player: m.p1.name, amt: 1000, color: "cyan" }),
  (m) => ({ user: "💫 Рома", text: "поставил на", player: m.p2.name, amt: 300, color: "orange" }),
  (m) => ({ user: "🎯 Юля", text: "поставил на", player: m.p1.name, amt: 150, color: "cyan" }),
];

function timeAgo(sec) {
  if (sec < 60) return `${sec}с`;
  return `${Math.floor(sec / 60)}м`;
}

export default function App() {
  const [page, setPage] = useState("home");
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [chosen, setChosen] = useState(null); // "p1" | "p2"
  const [amount, setAmount] = useState(500);
  const [customAmt, setCustomAmt] = useState("");
  const [balance, setBalance] = useState(5000);
  const [toasts, setToasts] = useState([]);
  const [feed, setFeed] = useState([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [newMatch, setNewMatch] = useState({ p1: "", p2: "", game: "cs2", stream: "", question: "" });
  const [myBets, setMyBets] = useState([]);
  const feedTimer = useRef(null);
  const toastTimer = useRef(null);

  const addToast = (text, icon = "✅") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, text, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  // Auto feed simulation
  useEffect(() => {
    if (!selectedMatch) return;
    const m = selectedMatch;
    let i = 0;
    feedTimer.current = setInterval(() => {
      const fn = FEED_POOL[i % FEED_POOL.length];
      const item = fn(m);
      const secs = Math.floor(Math.random() * 8) + 1;
      setFeed((f) => [{ ...item, id: Date.now(), time: secs }, ...f].slice(0, 12));
      // Update match totals
      const inc = item.amt;
      setMatches((prev) =>
        prev.map((x) => {
          if (x.id !== m.id) return x;
          return {
            ...x,
            p1: item.color === "cyan" ? { ...x.p1, bets: x.p1.bets + inc } : x.p1,
            p2: item.color === "orange" ? { ...x.p2, bets: x.p2.bets + inc } : x.p2,
            total: x.total + inc,
            betters: x.betters + 1,
          };
        })
      );
      i++;
    }, 2500);
    return () => clearInterval(feedTimer.current);
  }, [selectedMatch?.id]);

  const openMatch = (m) => {
    setSelectedMatch(m);
    setChosen(null);
    setFeed([]);
    setPage("match");
  };

  const placeBet = () => {
    const amt = customAmt ? parseInt(customAmt) : amount;
    if (!chosen) return addToast("Выбери участника!", "⚠️");
    if (amt > balance) return addToast("Недостаточно средств!", "❌");
    if (amt < 50) return addToast("Минимальная ставка 50₽", "⚠️");
    const player = chosen === "p1" ? selectedMatch.p1.name : selectedMatch.p2.name;
    setBalance((b) => b - amt);
    setMyBets((b) => [...b, { match: selectedMatch.id, player, amt, time: new Date() }]);
    addToast(`Прогноз на ${player} — ${amt}₽ принят!`, "🎯");
    setChosen(null);
    setCustomAmt("");
  };

  const createMatch = () => {
    if (!newMatch.p1 || !newMatch.p2) return addToast("Заполни имена участников!", "⚠️");
    const game = GAMES.find((g) => g.id === newMatch.game);
    const m = {
      id: Date.now(),
      game: game.name, gameIcon: game.icon,
      p1: { name: newMatch.p1, emoji: "🎮", bets: 0 },
      p2: { name: newMatch.p2, emoji: "🕹️", bets: 0 },
      status: "live", total: 0, betters: 0,
      streamUrl: newMatch.stream,
    };
    setMatches((prev) => [m, ...prev]);
    setNewMatch({ p1: "", p2: "", game: "cs2", stream: "", question: "" });
    setAdminOpen(false);
    addToast("Матч создан! Ссылка скопирована 🔗", "🎉");
    setPage("home");
  };

  const liveMatch = selectedMatch && matches.find((m) => m.id === selectedMatch.id);
  const p1pct = liveMatch ? Math.round((liveMatch.p1.bets / (liveMatch.p1.bets + liveMatch.p2.bets || 1)) * 100) : 50;
  const p2pct = 100 - p1pct;
  const effectiveAmt = customAmt ? parseInt(customAmt) || 0 : amount;
  const potentialWin = chosen && liveMatch
    ? Math.round(effectiveAmt * ((liveMatch.p1.bets + liveMatch.p2.bets + effectiveAmt) / ((chosen === "p1" ? liveMatch.p1.bets : liveMatch.p2.bets) + effectiveAmt)) * 0.9)
    : 0;

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="noise" />

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => setPage("home")}>
          DUEL<span>BET</span>
        </div>
        <div className="nav-tabs">
          {[["home", "🏠 Матчи"], ["history", "📊 Мои ставки"], ["admin", "🔧 Организатор"]].map(([id, label]) => (
            <button key={id} className={`nav-tab ${page === id ? "active" : ""}`} onClick={() => setPage(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="nav-user">
          <div className="balance">💰 {balance.toLocaleString("ru")} ₽</div>
          <button className="btn btn-primary btn-sm">Войти</button>
        </div>
      </nav>

      {/* Ticker */}
      {page === "home" && (
        <div className="overlay-ticker">
          <div className="ticker-inner">
            {[...Array(2)].map((_, i) => (
              <span key={i} style={{ display: "inline-flex", gap: 48 }}>
                <span className="ticker-item"><strong>Максим</strong> выиграл <span className="won">+2 400₽</span> на Артём vs Пашка</span>
                <span className="ticker-sep">|</span>
                <span className="ticker-item"><strong>Алина</strong> поставила 500₽ на <span style={{color:"var(--orange)"}}>Влада</span></span>
                <span className="ticker-sep">|</span>
                <span className="ticker-item">Новый матч: <strong>Кира vs Саша</strong> в Valorant — скоро!</span>
                <span className="ticker-sep">|</span>
                <span className="ticker-item"><strong>Рома</strong> выиграл <span className="won">+1 800₽</span> на Dima</span>
                <span className="ticker-sep">|</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* HOME PAGE */}
      {page === "home" && (
        <>
          <div className="hero">
            <div className="hero-glow" />
            <div className="hero-badge">
              <div className="live-dot" /> 3 матча идут прямо сейчас
            </div>
            <h1>
              СТАВЬ<br />
              <span className="accent">НА СВОИХ.</span><br />
              <span className="accent2">ВЫИГРЫВАЙ.</span>
            </h1>
            <p className="hero-sub">
              Платформа для интерактивных прогнозов на стримерские дуэли. CS2, Brawl Stars, Valorant — выбирай матч и поддержи своего фаворита.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => setPage("admin")}>🔧 Создать матч</button>
              <button className="btn btn-outline btn-lg" onClick={() => {
                document.querySelector(".section")?.scrollIntoView({ behavior: "smooth" });
              }}>📺 Смотреть дуэли</button>
            </div>
            <div className="hero-stats">
              {[["147K", "Участников"], ["₽ 2.4M", "Призовых"], ["98%", "Выплат"], ["1.2K", "Матчей"]].map(([n, l]) => (
                <div className="stat-item" key={l}>
                  <span className="stat-num">{n}</span>
                  <span className="stat-label">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <div className="section-title">🔴 <span>LIVE</span> МАТЧИ</div>
              <div className="tag tag-live">● Прямо сейчас</div>
            </div>
            <div className="matches-grid">
              {matches.map((m) => {
                const p1p = Math.round((m.p1.bets / (m.p1.bets + m.p2.bets || 1)) * 100);
                return (
                  <div key={m.id} className="match-card" onClick={() => openMatch(m)}>
                    <div className="card-top">
                      <div className="card-game">
                        <span className="game-icon">{m.gameIcon}</span>
                        {m.game}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className={`tag tag-${m.status}`}>
                          {m.status === "live" ? "● LIVE" : m.status === "soon" ? "СКОРО" : "ЗАВЕРШЁН"}
                        </span>
                        {m.total > 0 && <div className="prize-pool">💰 {m.total.toLocaleString("ru")}₽</div>}
                      </div>
                    </div>
                    <div className="vs-section">
                      <div className="player-side">
                        <div className="avatar avatar-left">{m.p1.emoji}</div>
                        <div className="player-name">{m.p1.name}</div>
                        <div className="player-odds">{p1p}%</div>
                      </div>
                      <div className="vs-badge">VS</div>
                      <div className="player-side right">
                        <div className="avatar avatar-right">{m.p2.emoji}</div>
                        <div className="player-name">{m.p2.name}</div>
                        <div className="player-odds">{100 - p1p}%</div>
                      </div>
                    </div>
                    {m.total > 0 && (
                      <div className="progress-wrap">
                        <div className="progress-labels">
                          <span style={{ color: "var(--cyan)" }}>{m.p1.bets.toLocaleString("ru")}₽</span>
                          <span style={{ color: "var(--orange)" }}>{m.p2.bets.toLocaleString("ru")}₽</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${p1p}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="card-footer">
                      <div className="betters-count"><span>{m.betters}</span> участников</div>
                      <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); openMatch(m); }}>
                        {m.status === "live" ? "Сделать прогноз →" : "Подробнее →"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* MATCH PAGE */}
      {page === "match" && liveMatch && (
        <div className="section">
          <button className="btn btn-outline btn-sm" style={{ marginBottom: 16 }} onClick={() => setPage("home")}>
            ← Все матчи
          </button>

          <div className="match-detail">
            <div className="detail-header">
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <span className={`tag tag-${liveMatch.status}`}>
                    {liveMatch.status === "live" ? "● LIVE" : "СКОРО"}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{liveMatch.gameIcon} {liveMatch.game}</span>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 2 }}>
                  <span style={{ color: "var(--cyan)" }}>{liveMatch.p1.name}</span>
                  <span style={{ color: "var(--muted)", margin: "0 12px" }}>VS</span>
                  <span style={{ color: "var(--orange)" }}>{liveMatch.p2.name}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--gold)" }}>
                  💰 {liveMatch.total.toLocaleString("ru")}₽
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>призовой фонд</div>
              </div>
            </div>

            {/* Stream embed */}
            <div className="stream-embed">
              <div className="stream-placeholder">
                <div className="stream-icon">📺</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 2 }}>СТРИМ</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  {liveMatch.streamUrl || "Ссылка не указана"}
                </div>
                {liveMatch.streamUrl && (
                  <button className="btn btn-primary btn-sm" onClick={() => window.open(liveMatch.streamUrl, "_blank")}>
                    Открыть стрим →
                  </button>
                )}
              </div>
              {liveMatch.streamUrl && (
                <div className="stream-link-badge" onClick={() => window.open(liveMatch.streamUrl, "_blank")}>
                  🎥 Twitch
                </div>
              )}
            </div>

            {/* Progress */}
            <div style={{ padding: "0 24px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "var(--cyan)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{liveMatch.p1.name}: {liveMatch.p1.bets.toLocaleString("ru")}₽ ({p1pct}%)</span>
                <span style={{ color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{liveMatch.p2.name}: {liveMatch.p2.bets.toLocaleString("ru")}₽ ({p2pct}%)</span>
              </div>
              <div className="progress-bar-bg" style={{ height: 10 }}>
                <div className="progress-bar-fill" style={{ width: `${p1pct}%` }} />
              </div>
            </div>

            {/* Choose side */}
            <div style={{ padding: "0 24px 12px", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)" }}>
              Кто победит?
            </div>
            <div className="prediction-panel">
              <div className={`pred-side pred-left ${chosen === "p1" ? "chosen" : ""}`} onClick={() => setChosen("p1")}>
                <div className="check-badge">✓</div>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{liveMatch.p1.emoji}</div>
                <div className="pred-name">{liveMatch.p1.name}</div>
                <div className="pred-stat">Поставили: {liveMatch.p1.bets.toLocaleString("ru")}₽</div>
                <div className="pred-pct">{p1pct}%</div>
              </div>
              <div className={`pred-side pred-right ${chosen === "p2" ? "chosen" : ""}`} onClick={() => setChosen("p2")}>
                <div className="check-badge">✓</div>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{liveMatch.p2.emoji}</div>
                <div className="pred-name">{liveMatch.p2.name}</div>
                <div className="pred-stat">Поставили: {liveMatch.p2.bets.toLocaleString("ru")}₽</div>
                <div className="pred-pct">{p2pct}%</div>
              </div>
            </div>

            {/* Amount */}
            <div className="amount-section">
              <span className="amount-label">Сумма прогноза</span>
              <div className="amounts-grid">
                {[100, 200, 500, 1000, 2000].map((a) => (
                  <button key={a} className={`amount-chip ${!customAmt && amount === a ? "active" : ""}`}
                    onClick={() => { setAmount(a); setCustomAmt(""); }}>
                    {a}₽
                  </button>
                ))}
              </div>
              <div className="custom-amount">
                <input className="amount-input" type="number" placeholder="Своя сумма..." value={customAmt}
                  onChange={(e) => setCustomAmt(e.target.value)} min="50" max={balance} />
                <button className="btn btn-primary" onClick={placeBet} disabled={!chosen}>
                  {liveMatch.status === "soon" ? "Записаться" : "Поставить →"}
                </button>
              </div>
              {chosen && effectiveAmt > 0 && (
                <div className="potential-win">
                  Потенциальный выигрыш: <span>~{potentialWin.toLocaleString("ru")}₽</span>
                  <span style={{ color: "var(--muted)", marginLeft: 8 }}>(комиссия платформы 10%)</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity feed */}
          <div className="activity-feed">
            <div className="feed-header">⚡ Активность</div>
            {feed.length === 0 && (
              <div style={{ padding: "20px 18px", color: "var(--muted)", fontSize: 13 }}>
                Ставки появятся здесь в реальном времени...
              </div>
            )}
            {feed.map((item) => (
              <div key={item.id} className="feed-item">
                <div className="feed-avatar">{item.user.split(" ")[0]}</div>
                <div className="feed-text">
                  <strong>{item.user.split(" ").slice(1).join(" ")}</strong> {item.text}{" "}
                  <span className={item.color}>{item.player}</span>
                </div>
                <div className="feed-amount">+{item.amt}₽</div>
                <div className="feed-time">{timeAgo(item.time)}н</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN PAGE */}
      {page === "admin" && (
        <div className="section">
          <div className="admin-panel">
            <div className="admin-header">
              <span>👑</span>
              <div className="admin-title">ПАНЕЛЬ ОРГАНИЗАТОРА</div>
              <div style={{ marginLeft: "auto" }}>
                <span className="tag" style={{ background: "rgba(255,214,10,0.1)", color: "var(--gold)", border: "1px solid rgba(255,214,10,0.2)" }}>
                  PRO аккаунт
                </span>
              </div>
            </div>
            <div className="admin-body">
              <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20, lineHeight: 1.6 }}>
                Создай матч — получи уникальную ссылку для зрителей. Они смогут голосовать прямо из TikTok или Telegram.
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Участник 1</label>
                  <input className="form-input" placeholder="Имя / ник" value={newMatch.p1}
                    onChange={(e) => setNewMatch({ ...newMatch, p1: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Участник 2</label>
                  <input className="form-input" placeholder="Имя / ник" value={newMatch.p2}
                    onChange={(e) => setNewMatch({ ...newMatch, p2: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Игра</label>
                  <select className="form-select" value={newMatch.game}
                    onChange={(e) => setNewMatch({ ...newMatch, game: e.target.value })}>
                    {GAMES.map((g) => (
                      <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ссылка на стрим</label>
                  <input className="form-input" placeholder="twitch.tv/..." value={newMatch.stream}
                    onChange={(e) => setNewMatch({ ...newMatch, stream: e.target.value })} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Вопрос (опционально)</label>
                <input className="form-input" placeholder="Кто победит? / Выиграю ли я этот раунд?" value={newMatch.question}
                  onChange={(e) => setNewMatch({ ...newMatch, question: e.target.value })} />
              </div>
              <div className="admin-actions">
                <button className="btn btn-gold" onClick={createMatch}>✨ Создать матч + ссылка</button>
                <button className="btn btn-outline" onClick={() => setNewMatch({ p1: "", p2: "", game: "cs2", stream: "", question: "" })}>
                  Сбросить
                </button>
              </div>
            </div>
          </div>

          {/* Active matches management */}
          <div className="admin-panel">
            <div className="admin-header">
              <span>🎮</span>
              <div className="admin-title">МОИ МАТЧИ</div>
            </div>
            <div style={{ padding: "12px 20px" }}>
              {matches.filter((m) => m.status === "live").map((m) => (
                <div key={m.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                  borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 12
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      <span style={{ color: "var(--cyan)" }}>{m.p1.name}</span>
                      <span style={{ color: "var(--muted)", margin: "0 8px" }}>vs</span>
                      <span style={{ color: "var(--orange)" }}>{m.p2.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                      {m.gameIcon} {m.game} · {m.betters} участников · {m.total.toLocaleString("ru")}₽
                    </div>
                  </div>
                  <button className="btn btn-green btn-sm" onClick={() => {
                    addToast(`${m.p1.name} объявлен победителем! Выплаты начислены`, "🏆");
                    setMatches((prev) => prev.map((x) => x.id === m.id ? { ...x, status: "done" } : x));
                  }}>🏆 {m.p1.name}</button>
                  <button className="btn btn-orange btn-sm" onClick={() => {
                    addToast(`${m.p2.name} объявлен победителем! Выплаты начислены`, "🏆");
                    setMatches((prev) => prev.map((x) => x.id === m.id ? { ...x, status: "done" } : x));
                  }}>🏆 {m.p2.name}</button>
                  <button className="btn btn-red btn-sm" onClick={() => {
                    addToast("Матч остановлен, ставки возвращены", "🔴");
                    setMatches((prev) => prev.map((x) => x.id === m.id ? { ...x, status: "done" } : x));
                  }}>⏹ Стоп</button>
                </div>
              ))}
              {matches.filter((m) => m.status === "live").length === 0 && (
                <div style={{ padding: "20px 0", color: "var(--muted)", fontSize: 13 }}>
                  Нет активных матчей. Создай первый выше 👆
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HISTORY PAGE */}
      {page === "history" && (
        <div className="section">
          <div style={{ marginBottom: 24 }}>
            <div className="section-title" style={{ marginBottom: 4 }}>📊 МОИ ПРОГНОЗЫ</div>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>Баланс: <span style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}>{balance.toLocaleString("ru")}₽</span></div>
          </div>
          <div className="activity-feed">
            <div className="feed-header">История ставок</div>
            {myBets.length === 0 && (
              <div style={{ padding: "32px 18px", color: "var(--muted)", fontSize: 13, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
                Ты ещё не делал прогнозов.<br />
                <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={() => setPage("home")}>
                  Найти матч →
                </button>
              </div>
            )}
            {myBets.map((b, i) => (
              <div key={i} className="feed-item">
                <div className="feed-avatar">🎯</div>
                <div className="feed-text">
                  Матч #{b.match} · На <span className="cyan">{b.player}</span>
                </div>
                <div className="feed-amount">-{b.amt}₽</div>
                <div className="feed-time">ожидание</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast toast-success">
            <span className="toast-icon">{t.icon}</span>
            {t.text}
          </div>
        ))}
      </div>
    </>
  );
}
