import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0A182E" />
      <stop offset="45%" stop-color="#071120" />
      <stop offset="85%" stop-color="#040913" />
      <stop offset="100%" stop-color="#02050A" />
    </radialGradient>

    <!-- Outer Ambient Glow Radial Gradient -->
    <radialGradient id="outerAura" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="#00F0FF" stop-opacity="0" />
      <stop offset="85%" stop-color="#00F0FF" stop-opacity="0.25" />
      <stop offset="92%" stop-color="#00E5FF" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#00F0FF" stop-opacity="0" />
    </radialGradient>

    <!-- Neon Cyan Gradient -->
    <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00FFFF" />
      <stop offset="30%" stop-color="#00E5FF" />
      <stop offset="70%" stop-color="#00B4D8" />
      <stop offset="100%" stop-color="#00FFFF" />
    </linearGradient>

    <!-- Cyber Gold Gradient -->
    <linearGradient id="cyberGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE082" />
      <stop offset="40%" stop-color="#FFCA28" />
      <stop offset="70%" stop-color="#FFA000" />
      <stop offset="100%" stop-color="#FFE082" />
    </linearGradient>

    <!-- Metallic Armor Blue Gradient -->
    <linearGradient id="armorMetal" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#133857" />
      <stop offset="50%" stop-color="#0B2138" />
      <stop offset="100%" stop-color="#071626" />
    </linearGradient>

    <!-- Glowing Cyan Node Drop Filter -->
    <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="1024" height="1024" fill="#030711" />
  <circle cx="512" cy="512" r="480" fill="url(#bgGrad)" />

  <!-- Ambient Outer Glow Ring -->
  <circle cx="512" cy="512" r="440" stroke="#00E5FF" stroke-width="32" stroke-opacity="0.18" fill="none" />
  <circle cx="512" cy="512" r="440" stroke="#00FFFF" stroke-width="16" stroke-opacity="0.4" fill="none" />

  <!-- Primary Outer Glowing Neon Cyan Circle -->
  <circle cx="512" cy="512" r="440" stroke="url(#neonCyan)" stroke-width="12" fill="none" />

  <!-- Inner Gold Precision Border Ring -->
  <circle cx="512" cy="512" r="414" stroke="url(#cyberGold)" stroke-width="6" fill="none" />

  <!-- Soft Secondary Inner Dark Ring -->
  <circle cx="512" cy="512" r="402" stroke="#061A2D" stroke-width="3" fill="none" />

  <!-- ==================== BACKGROUND WATERMARK CIRCUITS ==================== -->
  <g opacity="0.35" stroke="#00B4D8" stroke-width="2" stroke-linecap="round" fill="none">
    <path d="M120 300 L200 300 L260 360 L260 480" />
    <path d="M904 300 L824 300 L764 360 L764 480" />
    <path d="M150 720 L220 720 L280 660 L340 660" />
    <path d="M874 720 L804 720 L744 660 L684 660" />
    <circle cx="120" cy="300" r="4" fill="#00FFFF" />
    <circle cx="904" cy="300" r="4" fill="#00FFFF" />
    <circle cx="150" cy="720" r="4" fill="#FFCA28" />
    <circle cx="874" cy="720" r="4" fill="#FFCA28" />
  </g>

  <!-- ==================== CIRCUIT BOARD PATHWAYS (LEFT) ==================== -->
  <g stroke-linecap="round" fill="none">
    <!-- Cyan Trace Layer -->
    <path d="M260 280 L200 280 L160 330 L160 410" stroke="#00E5FF" stroke-width="5" />
    <path d="M300 400 L210 400 L170 450" stroke="#00E5FF" stroke-width="5" />
    <path d="M320 512 L170 512 L120 560" stroke="#00E5FF" stroke-width="6" />
    <path d="M310 600 L220 600 L180 650" stroke="#00E5FF" stroke-width="5" />
    <path d="M360 660 L280 660 L230 710" stroke="#00E5FF" stroke-width="5" />

    <!-- Gold Accent Trace Layer -->
    <path d="M280 340 L230 340 L180 390 L180 480" stroke="url(#cyberGold)" stroke-width="4.5" />
    <path d="M330 450 L240 450 L200 500" stroke="url(#cyberGold)" stroke-width="4.5" />
    <path d="M290 550 L220 550 L170 600" stroke="url(#cyberGold)" stroke-width="4.5" />

    <!-- Luminous Nodes -->
    <circle cx="160" cy="410" r="7" fill="#00FFFF" filter="url(#cyanGlow)" />
    <circle cx="170" cy="450" r="7" fill="#FFCA28" />
    <circle cx="180" cy="480" r="6" fill="#00FFFF" />
    <circle cx="120" cy="560" r="9" fill="#00FFFF" filter="url(#cyanGlow)" />
    <circle cx="200" cy="500" r="7" fill="#FFCA28" />
    <circle cx="170" cy="600" r="7" fill="#00FFFF" />
    <circle cx="180" cy="650" r="7" fill="#FFCA28" />
    <circle cx="230" cy="710" r="7" fill="#00FFFF" filter="url(#cyanGlow)" />
  </g>

  <!-- ==================== CIRCUIT BOARD PATHWAYS (RIGHT) ==================== -->
  <g stroke-linecap="round" fill="none">
    <!-- Cyan Trace Layer -->
    <path d="M764 280 L824 280 L864 330 L864 410" stroke="#00E5FF" stroke-width="5" />
    <path d="M724 400 L814 400 L854 450" stroke="#00E5FF" stroke-width="5" />
    <path d="M704 512 L854 512 L904 560" stroke="#00E5FF" stroke-width="6" />
    <path d="M714 600 L804 600 L844 650" stroke="#00E5FF" stroke-width="5" />
    <path d="M664 660 L744 660 L794 710" stroke="#00E5FF" stroke-width="5" />

    <!-- Gold Accent Trace Layer -->
    <path d="M744 340 L794 340 L844 390 L844 480" stroke="url(#cyberGold)" stroke-width="4.5" />
    <path d="M694 450 L784 450 L824 500" stroke="url(#cyberGold)" stroke-width="4.5" />
    <path d="M734 550 L804 550 L854 600" stroke="url(#cyberGold)" stroke-width="4.5" />

    <!-- Luminous Nodes -->
    <circle cx="864" cy="410" r="7" fill="#00FFFF" filter="url(#cyanGlow)" />
    <circle cx="854" cy="450" r="7" fill="#FFCA28" />
    <circle cx="844" cy="480" r="6" fill="#00FFFF" />
    <circle cx="904" cy="560" r="9" fill="#00FFFF" filter="url(#cyanGlow)" />
    <circle cx="824" cy="500" r="7" fill="#FFCA28" />
    <circle cx="854" cy="600" r="7" fill="#00FFFF" />
    <circle cx="844" cy="650" r="7" fill="#FFCA28" />
    <circle cx="794" cy="710" r="7" fill="#00FFFF" filter="url(#cyanGlow)" />
  </g>

  <!-- ==================== NEURAL BRAIN CORTEX (TOP) ==================== -->
  <g>
    <!-- Brain Silhouette Outer Background -->
    <path d="M512 165 C478 165 440 180 424 210 C408 238 416 270 428 292 C440 316 470 330 512 330 C554 330 584 316 596 292 C608 270 616 238 600 210 C584 180 546 165 512 165 Z"
          fill="#061E33" stroke="#00E5FF" stroke-width="4.5" />

    <!-- Brain Hemisphere Divider -->
    <path d="M512 168 L512 327" stroke="#00FFFF" stroke-width="4" stroke-linecap="round" />

    <!-- Neural Sulci Pathways Left -->
    <path d="M472 195 C456 210 456 235 476 248 C456 264 456 288 484 300"
          stroke="#00FFFF" stroke-width="4.5" stroke-linecap="round" fill="none" />
    <path d="M490 220 L512 232 L490 244 M490 276 L512 264"
          stroke="#FFCA28" stroke-width="3.5" stroke-linecap="round" fill="none" />

    <!-- Neural Sulci Pathways Right -->
    <path d="M552 195 C568 210 568 235 548 248 C568 264 568 288 540 300"
          stroke="#00FFFF" stroke-width="4.5" stroke-linecap="round" fill="none" />
    <path d="M534 220 L512 232 L534 244 M534 276 L512 264"
          stroke="#FFCA28" stroke-width="3.5" stroke-linecap="round" fill="none" />

    <!-- Synaptic Golden & Cyan Micro Nodes -->
    <circle cx="468" cy="210" r="4.5" fill="#00FFFF" />
    <circle cx="556" cy="210" r="4.5" fill="#00FFFF" />
    <circle cx="512" cy="200" r="4.5" fill="#FFCA28" />
    <circle cx="465" cy="278" r="4.5" fill="#00FFFF" />
    <circle cx="559" cy="278" r="4.5" fill="#00FFFF" />
    <circle cx="512" cy="296" r="4.5" fill="#FFCA28" />
  </g>

  <!-- ==================== DUAL CYBERNETIC HORNS ==================== -->
  <g>
    <!-- Left Horn Outer Cyan Armor -->
    <path d="M390 410 C336 354 288 266 368 178 C400 138 408 186 380 258 C360 306 384 362 416 394 Z"
          fill="url(#armorMetal)" stroke="#00E5FF" stroke-width="7" />
    <!-- Left Horn Inner Gold Inlay Ridge -->
    <path d="M368 178 C384 154 392 194 376 250 C360 290 376 338 396 370 C384 362 368 322 364 274 C360 226 360 194 368 178 Z"
          fill="url(#cyberGold)" />

    <!-- Right Horn Outer Cyan Armor -->
    <path d="M634 410 C688 354 736 266 656 178 C624 138 616 186 644 258 C664 306 640 362 608 394 Z"
          fill="url(#armorMetal)" stroke="#00E5FF" stroke-width="7" />
    <!-- Right Horn Inner Gold Inlay Ridge -->
    <path d="M656 178 C640 154 632 194 648 250 C664 290 648 338 628 370 C640 362 656 322 660 274 C664 226 664 194 656 178 Z"
          fill="url(#cyberGold)" />
  </g>

  <!-- ==================== CYBERNETIC EARS ==================== -->
  <g>
    <!-- Left Ear -->
    <path d="M368 424 L288 448 C280 464 312 496 352 488 L384 456 Z"
          fill="#0B233A" stroke="url(#cyberGold)" stroke-width="5" />
    <path d="M312 456 L352 472 L344 460 Z" fill="#00E5FF" />

    <!-- Right Ear -->
    <path d="M656 424 L736 448 C744 464 712 496 672 488 L640 456 Z"
          fill="#0B233A" stroke="url(#cyberGold)" stroke-width="5" />
    <path d="M712 456 L672 472 L680 460 Z" fill="#00E5FF" />
  </g>

  <!-- ==================== BULL MAIN FACE & CHISELED ARMOR ==================== -->
  <g>
    <!-- Forehead & Face Main Shield -->
    <path d="M408 384 L616 384 L592 552 L560 664 L512 704 L464 664 L432 552 Z"
          fill="url(#armorMetal)" stroke="#00E5FF" stroke-width="7" />

    <!-- Geometric Gold Circuit Accents on Face -->
    <path d="M440 392 L512 456 L584 392 M512 456 L512 568 M456 488 L512 528 L568 488 M456 568 L512 608 L568 568"
          stroke="url(#cyberGold)" stroke-width="5.5" stroke-linecap="round" fill="none" />

    <!-- Hexagonal Center Sensor -->
    <polygon points="512,408 532,420 532,444 512,456 492,444 492,420"
             fill="#041220" stroke="#00FFFF" stroke-width="3" />
    <circle cx="512" cy="432" r="6" fill="#00FFFF" filter="url(#cyanGlow)" />

    <!-- Glowing Cyber Eyes (Left & Right) -->
    <!-- Left Eye -->
    <path d="M440 480 L488 492 L472 512 L432 500 Z" fill="#00FFFF" filter="url(#cyanGlow)" />
    <path d="M432 468 L496 484 L488 476 L436 464 Z" fill="url(#cyberGold)" />
    <!-- Right Eye -->
    <path d="M584 480 L536 492 L552 512 L592 500 Z" fill="#00FFFF" filter="url(#cyanGlow)" />
    <path d="M592 468 L528 484 L536 476 L588 464 Z" fill="url(#cyberGold)" />

    <!-- Snout & Reinforced Muzzle Plate -->
    <path d="M464 584 L560 584 L568 656 L544 688 L480 688 L456 656 Z"
          fill="#0C2F4D" stroke="#00E5FF" stroke-width="6" />

    <!-- Nostrils (Mechanical Oval Pods) -->
    <ellipse cx="480" cy="632" rx="10" ry="16" fill="#020810" stroke="url(#cyberGold)" stroke-width="4.5" />
    <ellipse cx="544" cy="632" rx="10" ry="16" fill="#020810" stroke="url(#cyberGold)" stroke-width="4.5" />
    <circle cx="480" cy="632" r="3" fill="#00FFFF" />
    <circle cx="544" cy="632" r="3" fill="#00FFFF" />

    <!-- Chin Armor & Power Conduits -->
    <path d="M480 688 L544 688 L528 736 L496 736 Z"
          fill="#07192A" stroke="#00E5FF" stroke-width="5" />
    <path d="M424 592 L384 688 L400 768 M600 592 L640 688 L624 768 M456 672 L440 768 M568 672 L584 768"
          stroke="#00B4D8" stroke-width="6" stroke-linecap="round" fill="none" />
    <path d="M408 640 L368 736 M616 640 L656 736 M488 704 L472 776 M536 704 L552 776"
          stroke="url(#cyberGold)" stroke-width="5" stroke-linecap="round" fill="none" />
  </g>

  <!-- ==================== TYPOGRAPHY: NANDI AI ==================== -->
  <!-- NANDI Header in Crisp White -->
  <text x="512" y="800"
        text-anchor="middle"
        fill="#FFFFFF"
        font-family="'Inter', 'Montserrat', -apple-system, sans-serif"
        font-weight="900"
        font-size="94"
        letter-spacing="8">NANDI</text>

  <!-- Left Flanking Gold Divider -->
  <line x1="336" y1="850" x2="456" y2="850" stroke="url(#cyberGold)" stroke-width="5.5" stroke-linecap="round" />

  <!-- AI Subheader in Glowing Cyan -->
  <text x="512" y="864"
        text-anchor="middle"
        fill="#00FFFF"
        font-family="'Inter', 'Montserrat', -apple-system, sans-serif"
        font-weight="800"
        font-size="48"
        letter-spacing="10">AI</text>

  <!-- Right Flanking Gold Divider -->
  <line x1="568" y1="850" x2="688" y2="850" stroke="url(#cyberGold)" stroke-width="5.5" stroke-linecap="round" />
</svg>`;

// Write to public/assets/nandi-logo.png
const resvg = new Resvg(svgContent, {
  fitTo: {
    mode: 'width',
    value: 1024
  }
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

const targetPath = path.join(process.cwd(), 'public/assets/nandi-logo.png');
fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, pngBuffer);

// Also update public/favicon.svg
fs.writeFileSync(path.join(process.cwd(), 'public/favicon.svg'), svgContent);

console.log('✅ Successfully created public/assets/nandi-logo.png (1024x1024 PNG)');
console.log('✅ Updated public/favicon.svg');
