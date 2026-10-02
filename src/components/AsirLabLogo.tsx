import React from 'react';

interface AsirLabLogoProps {
  className?: string;
  size?: number;
}

/**
 * Official Emblem of the Asir Central Laboratory for Drinking Water and Environmental Services
 * (@cen_lab / Ministry of Environment, Water and Agriculture - General Directorate of Water Services in Asir)
 * 
 * Features:
 * - Circular green emblem with dual golden border
 * - Golden date palm tree with water droplet in trunk
 * - Vertical wheat ear stalk representing agriculture & water sustainability
 * - Crossed Arabian curved swords (scimitars) at base
 */
export default function AsirLabLogo({ className = 'w-40 h-40', size }: AsirLabLogoProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="شعار المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة عسير"
    >
      <defs>
        {/* Outer Gold Border Gradient */}
        <linearGradient id="asirGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E28B" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#AA820A" />
          <stop offset="100%" stopColor="#E6C86E" />
        </linearGradient>

        {/* Inner Gold Elements Gradient */}
        <linearGradient id="asirGoldEmblem" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="30%" stopColor="#E6C665" />
          <stop offset="70%" stopColor="#C49B28" />
          <stop offset="100%" stopColor="#9E7610" />
        </linearGradient>

        {/* Deep Green Background Gradient */}
        <radialGradient id="asirGreenBg" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#0F663C" />
          <stop offset="65%" stopColor="#094A2A" />
          <stop offset="100%" stopColor="#05331C" />
        </radialGradient>

        {/* Drop Shadow for Gold Emblem */}
        <filter id="asirEmblemShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer Golden Ring */}
      <circle cx="200" cy="200" r="192" fill="url(#asirGoldBorder)" stroke="#8C6809" strokeWidth="2" />

      {/* Inner Thin White/Gold Rim */}
      <circle cx="200" cy="200" r="177" fill="#8C6809" />
      <circle cx="200" cy="200" r="174" fill="url(#asirGreenBg)" stroke="url(#asirGoldBorder)" strokeWidth="3" />

      {/* Center Golden Elements with subtle shadow */}
      <g filter="url(#asirEmblemShadow)" fill="url(#asirGoldEmblem)">
        {/* ============================================================
            1. PALM TREE FRONDS (Date Palm Crown)
        ============================================================= */}
        {/* Central Top Frond */}
        <path d="M200 52 C204 70 203 100 200 125 C197 100 196 70 200 52 Z" />

        {/* Upper Left & Right Fronds */}
        <path d="M198 120 C185 85 160 62 135 62 C155 78 175 105 188 126 Z" />
        <path d="M202 120 C215 85 240 62 265 62 C245 78 225 105 212 126 Z" />

        {/* Mid-Upper Fronds */}
        <path d="M195 125 C170 95 130 82 105 92 C132 105 160 125 185 133 Z" />
        <path d="M205 125 C230 95 270 82 295 92 C268 105 240 125 215 133 Z" />

        {/* Mid-Lower Outer Arching Fronds */}
        <path d="M192 133 C160 115 110 118 95 138 C120 142 155 142 182 139 Z" />
        <path d="M208 133 C240 115 290 118 305 138 C280 142 245 142 218 139 Z" />

        {/* Lowest Cascading Fronds */}
        <path d="M190 142 C165 140 130 152 118 172 C138 165 165 158 185 148 Z" />
        <path d="M210 142 C235 140 270 152 282 172 C262 165 235 158 215 148 Z" />

        {/* ============================================================
            2. CENTRAL WATER DROPLET (Drinking Water Purity)
        ============================================================= */}
        <path d="M200 126 C190 145 184 158 184 168 C184 178 191 185 200 185 C209 185 216 178 216 168 C216 158 210 145 200 126 Z" />

        {/* ============================================================
            3. WHEAT EARS / AGRICULTURAL STEM (4 tiers of leaves)
        ============================================================= */}
        {/* Tier 1 (top below droplet) */}
        <path d="M180 188 C165 190 158 200 168 208 C178 206 188 198 192 192 Z" />
        <path d="M220 188 C235 190 242 200 232 208 C222 206 212 198 208 192 Z" />

        {/* Tier 2 */}
        <path d="M174 208 C155 212 148 225 160 235 C172 232 184 220 188 212 Z" />
        <path d="M226 208 C245 212 252 225 240 235 C228 232 216 220 212 212 Z" />

        {/* Tier 3 */}
        <path d="M170 230 C148 236 142 252 156 264 C170 258 182 245 186 235 Z" />
        <path d="M230 230 C252 236 258 252 244 264 C230 258 218 245 214 235 Z" />

        {/* Tier 4 (lower wide curved leaves) */}
        <path d="M165 255 C135 264 130 286 148 298 C166 290 180 274 185 260 Z" />
        <path d="M235 255 C265 264 270 286 252 298 C234 290 220 274 215 260 Z" />

        {/* Central stem connecting leaves */}
        <path d="M198 190 L198 300 C198 302 202 302 202 300 L202 190 Z" />

        {/* ============================================================
            4. CROSSED SAUDI SCIMITARS (Traditional Curved Swords)
        ============================================================= */}
        {/* Sword 1: Top-Left to Bottom-Right */}
        <g>
          {/* Blade */}
          <path d="M95 284 C135 282 175 292 205 310 C235 328 268 346 295 344 C272 340 245 322 218 306 C190 288 145 276 100 276 C94 276 92 284 95 284 Z" />
          {/* Hilt, Guard & Pommel */}
          <rect x="290" y="337" width="6" height="18" rx="2" transform="rotate(-30 290 337)" />
          <path d="M304 340 C306 345 304 352 298 355 C293 358 288 355 286 350 C292 350 298 348 304 340 Z" />
          {/* Pommel Ring/Tassel */}
          <circle cx="295" cy="354" r="3.5" />
        </g>

        {/* Sword 2: Top-Right to Bottom-Left */}
        <g>
          {/* Blade */}
          <path d="M305 284 C265 282 225 292 195 310 C165 328 132 346 105 344 C128 340 155 322 182 306 C210 288 255 276 300 276 C306 276 308 284 305 284 Z" />
          {/* Hilt, Guard & Pommel */}
          <rect x="104" y="334" width="6" height="18" rx="2" transform="rotate(30 104 334)" />
          <path d="M96 340 C94 345 96 352 102 355 C107 358 112 355 114 350 C108 350 102 348 96 340 Z" />
          {/* Pommel Ring/Tassel */}
          <circle cx="105" cy="354" r="3.5" />
        </g>
      </g>
    </svg>
  );
}
