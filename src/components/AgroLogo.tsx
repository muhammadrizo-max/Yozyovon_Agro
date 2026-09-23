import React from 'react';

interface AgroLogoProps {
  className?: string;
  size?: number;
}

/**
 * Yozyovon Agro Rasmiy Logotipi (1-rasm asosida)
 * Sariq quyosh, yashil ekin jo'yaklari, 3 ta barg, ko'k geo-lokatsiya (pin) va texnologik tarmoq yoyi
 */
export const AgroLogo: React.FC<AgroLogoProps> = ({ className = 'w-8 h-8', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={style}
    >
      <defs>
        {/* Quyosh gradienti */}
        <radialGradient id="sunGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EA580C" />
        </radialGradient>

        {/* Ekin jo'yaklari yashil gradienti */}
        <linearGradient id="fieldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Barglar yashil gradienti */}
        <linearGradient id="leafGrad" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#15803D" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#86EFAC" />
        </linearGradient>

        {/* Geo-lokatsiya va texnologik tarmoq ko'k gradienti */}
        <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Tarmoq yoyi gradienti */}
        <linearGradient id="arcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* 1. SARIQ QUYOSH (Yuqori chap burchak) */}
      <circle cx="58" cy="82" r="38" fill="url(#sunGrad)" />

      {/* 2. YASHIL JO'YAKLI DALALAR (Pastki chap jo'yaklar) */}
      <g>
        {/* Eng pastki jo'yak qavati */}
        <path
          d="M 38 152 C 48 168 64 178 84 182 C 60 170 46 150 38 152 Z"
          fill="#065F46"
        />
        {/* 1-jo'yak */}
        <path
          d="M 30 134 C 42 165 72 181 98 181 C 120 181 125 174 125 174 C 95 174 65 158 50 135 C 38 116 30 134 30 134 Z"
          fill="url(#fieldGrad)"
        />
        {/* 2-jo'yak */}
        <path
          d="M 27 114 C 40 148 76 166 115 160 C 130 157 140 150 140 150 C 105 155 70 142 50 118 C 36 102 27 114 27 114 Z"
          fill="url(#fieldGrad)"
        />
        {/* 3-jo'yak */}
        <path
          d="M 28 94 C 44 128 85 145 130 134 C 145 129 152 122 152 122 C 115 131 75 120 54 98 C 40 84 28 94 28 94 Z"
          fill="url(#fieldGrad)"
        />
        {/* 4-jo'yak (quyosh ostidagi chegara) */}
        <path
          d="M 35 77 C 50 102 85 116 128 106 C 134 104 140 101 144 98 C 104 106 68 95 48 78 C 40 70 35 77 35 77 Z"
          fill="#059669"
        />
      </g>

      {/* 3. UCHTA YASHIL BARG / NIHOL (Markazdan unib chiqqan barglar) */}
      <g>
        {/* Orqa / chap yon barg */}
        <path
          d="M 64 68 C 64 68 60 42 78 30 C 92 48 84 72 84 72 C 84 72 72 74 64 68 Z"
          fill="url(#leafGrad)"
        />
        {/* O'rta / baland asosiy barg */}
        <path
          d="M 82 85 C 80 50 96 18 102 14 C 108 18 124 50 122 85 C 114 92 90 92 82 85 Z"
          fill="url(#leafGrad)"
        />
        {/* Bargning o'rta tomiri */}
        <path
          d="M 102 18 Q 102 52 102 85"
          stroke="#15803D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* O'ng yon barg */}
        <path
          d="M 120 72 C 120 72 112 48 126 30 C 144 42 140 68 140 68 C 132 74 120 72 120 72 Z"
          fill="url(#leafGrad)"
        />
      </g>

      {/* 4. KO'K GEO-LOKATSIYA BELGISI (Location Pin) */}
      <g filter="drop-shadow(0 2px 4px rgba(2,132,199,0.3))">
        {/* Pin korpusi */}
        <path
          d="M 148 62 C 135 62 124 73 124 86 C 124 104 148 128 148 128 C 148 128 172 104 172 86 C 172 73 161 62 148 62 Z"
          fill="url(#pinGrad)"
        />
        {/* Pin ichidagi aylana teshikcha */}
        <circle cx="148" cy="85" r="7.5" fill="#0F172A" className="dark:fill-slate-900" />
      </g>

      {/* 5. KO'K TEXNOLOGIK TARMOQ YOYI VA NUQTALAR (Circuit Arc & Nodes) */}
      <g>
        {/* Pastki aylanma yoy */}
        <path
          d="M 72 186 C 112 196 156 182 176 148 C 182 136 185 124 186 112"
          stroke="url(#arcGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tarmoq ulanish liniyasi */}
        <path
          d="M 94 176 C 124 172 152 152 163 124"
          stroke="#0EA5E9"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* 1-texnologik nuqta (node) */}
        <circle cx="126" cy="163" r="5" fill="#38BDF8" />
        <circle cx="126" cy="163" r="2" fill="#FFFFFF" />

        {/* 2-texnologik nuqta (node) */}
        <circle cx="152" cy="132" r="5" fill="#38BDF8" />
        <circle cx="152" cy="132" r="2" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
