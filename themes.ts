import { Theme } from "./types";

export const THEMES: Theme[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    description: "Clean, minimalist, and corporate.",
    colors: ["#0F172A", "#4F46E5", "#E2E8F0"],
    html: `<div class="w-full h-full bg-slate-100 flex items-center justify-center p-8">
             <div class="w-2/3 bg-white shadow-lg rounded-xl p-6">
               <div class="w-1/3 h-4 bg-slate-800 rounded-full mb-4"></div>
               <div class="w-full h-2 bg-slate-200 rounded-full mb-2"></div>
               <div class="w-full h-2 bg-slate-200 rounded-full mb-2"></div>
               <div class="w-3/4 h-2 bg-slate-200 rounded-full"></div>
             </div>
           </div>`,
    prompt:
      "Construct a polished and trustworthy interface that prioritizes clarity and order. Utilize a crisp, professional palette of deep navy, steel grays, and pure whites. Emphasize legibility with generous whitespace, strictly aligned elements, and gentle, seamless contours to convey a sense of corporate stability and efficiency.",
    example: {
      slides: [
        {
          title: "RAD Closure Summary by Domain",
          content: `<div class="relative w-[1920px] h-[1080px] bg-[#F4F7F9] overflow-hidden font-['Poppins']">

  <!-- Header Section -->
  <div class="absolute top-[80px] left-[100px] w-[1720px] z-10">
    <h1 class="text-[48px] text-[#0D1E40] font-bold">RAD Closure Summary by Domain</h1>
    <p class="text-[24px] text-gray-500 mt-2">Analysis of Cancelled, Closed, and Low Risk statuses. Total RADs accounted for: 106.</p>
  </div>

  <!-- Chart Area - Left Column -->
  <div class="absolute top-[200px] left-[100px] w-[900px] h-[750px] bg-white rounded-xl shadow-xl p-10 border border-[#E0E4E7]">
    <h2 class="text-[32px] text-[#0D1E40] font-semibold mb-6">Status Distribution Across Domains</h2>
    <quickchart config="{'type': 'bar', 'data': {'labels': ['App Ops', 'Infra Ops', 'LDRN Tracking', 'Security'], 'datasets': [{'label': 'Closed (66)', 'data': [47, 15, 4, 0], 'backgroundColor': '#3A86FF', 'stack': 'stack1'}, {'label': 'Low Risk (35)', 'data': [10, 10, 5, 10], 'backgroundColor': '#0D1E40', 'stack': 'stack1'}, {'label': 'Cancelled (5)', 'data': [5, 0, 0, 0], 'backgroundColor': '#C0C4C7', 'stack': 'stack1'}]}, 'options': {'responsive': true, 'scales': {'x': {'stacked': true}, 'y': {'stacked': true}}, 'plugins': {'legend': {'position': 'bottom', 'labels': {'font': {'size': 22, 'family': 'Inter'}}}}}}" class="w-[800px] h-[600px] object-contain" alt="RAD Closure Summary Chart"></quickchart>
  </div>

  <!-- Key Metrics & Insights - Right Column -->
  <div class="absolute top-[200px] left-[1050px] w-[770px]" id="el-8ed091d3-4e08-483d-8f67-5e1fb7cab893">
    
    <div class="bg-[#0D1E40] p-8 rounded-xl shadow-xl mb-8">
      <p class="text-[26px] text-[#3A86FF] font-semibold flex items-center">
        <ion-icon name="lock-closed-outline" class="text-[36px] mr-3 md hydrated" role="img"></ion-icon>
        Highest Closure Volume
      </p>
      <h3 class="text-[48px] text-white font-bold mt-2">Application Operations</h3>
      <p class="text-[28px] text-white opacity-90 mt-1">47 RADs successfully Closed in this domain.</p>
    </div>

    <div class="flex flex-wrap gap-8">
      
      <!-- Metric Card 1: Grand Total -->
      <div class="w-[360px] h-[250px] bg-white rounded-xl shadow-md p-6 border-l-4 border-l-[#0D1E40]">
        <p class="text-[22px] text-gray-500">Grand Total RADs</p>
        <h3 class="text-[60px] text-[#0D1E40] font-bold mt-1">106</h3>
        <p class="text-[22px] mt-2">5 Cancelled, 66 Closed, 35 Low Risk</p>
      </div>
      
      <!-- Metric Card 2: Closed % -->
      <div class="w-[360px] h-[250px] bg-white rounded-xl shadow-md p-6 border-l-4 border-l-[#3A86FF]">
        <p class="text-[22px] text-gray-500">Overall Closure Rate</p>
        <h3 class="text-[60px] text-[#3A86FF] font-bold mt-1">62.3%</h3>
        <p class="text-[22px] mt-2">66 Closed items out of 106 tracked.</p>
      </div>

      <!-- Insight Card -->
      <div class="w-full bg-white rounded-xl shadow-md p-6 mt-4 border border-[#E0E4E7]">
        <p class="text-[24px] text-[#0D1E40] flex items-start">
          <ion-icon name="bulb-outline" class="text-[30px] text-[#3A86FF] mr-3 mt-1 md hydrated" role="img"></ion-icon>
          Focus on transitioning the 35 Low Risk items into final closure status.
        </p>
      </div>
      
    </div>
    
  </div>

</div>`,
        },
        {
          title: "Executive Summary Dashboard",
          content: `
          <div class="relative w-[1920px] h-[1080px] bg-[#0D1E40] overflow-hidden font-['Poppins']">

  <!-- Visual Background Element -->
  <img src="https://image.pollinations.ai/prompt/corporate_risk_dashboard_security_abstract_digital_navy_blue" class="absolute top-0 left-0 h-full w-full object-cover opacity-10" id="el-cd56d2b3-ca48-439b-ade1-b68bbbcff275">

  <!-- Header -->
  <div class="absolute top-[80px] left-[100px] w-[1720px] z-10" id="el-2e6ee345-9b4f-4492-bc33-6df5686c2e0c">
    <h1 class="text-[48px] text-white font-bold">Executive Summary Dashboard</h1>
    <p class="text-[24px] text-[#AABBDD] mt-2">Snapshot of current risk profile and governance status.</p>
  </div>

  <!-- Metrics Row 1 -->
  <div class="absolute top-[220px] left-[100px] right-[100px] flex justify-between" id="el-1f126d78-3d53-4193-8760-a44a60410a43" style="left: 100px; top: 216.923px; transform: translate(0px, 0px);">
    
    <div class="w-[550px] bg-[#3A86FF] p-8 rounded-xl shadow-xl flex flex-col justify-center text-center">
      <p class="text-[24px] text-white opacity-80">Total Open RADs</p>
      <h2 class="text-[90px] text-white font-extrabold">27</h2>
    </div>
    
    <div class="w-[550px] bg-white p-8 rounded-xl shadow-xl flex flex-col justify-center text-center">
      <p class="text-[24px] text-gray-600">High Volume EOL/EOS Assets (Umbrella)</p>
      <h2 class="text-[90px] text-[#0D1E40] font-extrabold">1,766</h2>
    </div>
    
    <div class="w-[550px] bg-white p-8 rounded-xl shadow-xl flex flex-col justify-center text-center">
      <p class="text-[24px] text-gray-600">Closed RADs This Period (66 Total)</p>
      <h2 class="text-[90px] text-[#3A86FF] font-extrabold">47</h2>
      <p class="text-[22px] text-gray-500">From Application Operations</p>
    </div>
  </div>

  <!-- Metrics Row 2: Overdue Focus & SIEM Gaps -->
  <div class="absolute top-[550px] left-[100px] w-[1720px] flex justify-between" id="el-03c2ae85-0158-4b8b-8777-5a5f09965442" style="left: 103.077px; top: 505.385px; transform: translate(0px, 0px);">
    
    <!-- Critical Overdue Count -->
    <div class="w-[400px] bg-white p-8 rounded-xl shadow-xl border-l-8 border-l-[#D94040]">
      <ion-icon name="warning-outline" class="text-[48px] text-[#D94040] md hydrated" role="img"></ion-icon>
      <p class="text-[24px] text-gray-600 mt-4">Critical Overdue Sign-Offs</p>
      <h3 class="text-[60px] text-[#D94040] font-extrabold mt-1">3</h3>
      <p class="text-[20px] text-gray-500 mt-2">Require immediate executive intervention.</p>
    </div>

    <!-- Asset at Risk (Largest Item) -->
    <div class="w-[400px] bg-white p-8 rounded-xl shadow-xl border-l-8 border-l-[#0D1E40]">
      <ion-icon name="stats-chart-outline" class="text-[48px] text-[#0D1E40] md hydrated" role="img"></ion-icon>
      <p class="text-[24px] text-gray-600 mt-4">Largest Single Risk Item Asset Scope</p>
      <h3 class="text-[60px] text-[#0D1E40] font-extrabold mt-1">1,294</h3>
      <p class="text-[20px] text-gray-500 mt-2">Unix OS EOL/EOS servers (Kyndryl).</p>
    </div>
    
    <!-- SIEM Gaps -->
    <div class="w-[800px] bg-white p-8 rounded-xl shadow-xl border-l-8 border-l-[#3A86FF]">
      <ion-icon name="eye-off-outline" class="text-[48px] text-[#3A86FF] md hydrated" role="img"></ion-icon>
      <p class="text-[24px] text-gray-600 mt-4">Annexure Focus: SIEM/Log Integration Deficiencies</p>
      <div class="flex justify-between items-center mt-4">
        <p class="text-[36px] text-[#0D1E40] font-bold">EBPP Application Logs Gap:</p>
        <p class="text-[48px] text-[#3A86FF] font-extrabold">52</p>
      </div>
      <p class="text-[20px] text-gray-500 mt-2">Requires dedicated remediation effort to restore security controls.</p>
    </div>

  </div>

  <!-- Footer Conclusion -->
  <div class="absolute bottom-[50px] left-[100px] w-[1720px] p-6 bg-white rounded-xl shadow-inner border-t border-[#E0E4E7]" id="el-81a9a121-341d-4460-8ed9-6251d4616df4">
    <p class="text-[26px] text-[#0D1E40] font-semibold flex items-center">
      <ion-icon name="checkbox-outline" class="text-[36px] text-green-600 mr-3 md hydrated" role="img"></ion-icon>
      Recommendation: Initiate immediate senior management contact for overdue item resolution and validate Kyndryl's migration progress.
    </p>
  </div>

</div>`,
        },
      ],
    },
  },
  {
    id: "elegant-corporate",
    name: "Elegant Corporate",
    description: "Sophisticated, refined, and premium.",
    colors: ["#334155", "#D1D5DB", "#FBBF24"],
    html: `<div class="w-full h-full bg-slate-600 flex items-center justify-center p-8">
            <div class="w-2/3 bg-white/90 rounded-lg p-6 backdrop-blur-sm border border-white/20">
                <div class="w-1/2 h-5 bg-amber-400 rounded-full mb-4 opacity-80"></div>
                <div class="w-full h-2 bg-slate-500 rounded-full mb-2"></div>
                <div class="w-3/4 h-2 bg-slate-500 rounded-full"></div>
            </div>
           </div>`,
    prompt:
      "Curate a luxurious and upscale aesthetic reminiscent of high-end editorial design. Blend muted earth tones with tasteful metallic gold accents. Prioritize classic serif typography and balanced symmetrical layouts to evoke a sense of heritage, prestige, and timeless sophistication.",
    example: {
      slides: [
        {
          title:
            "The Dawn of Decarbonization: Charting the Future of Renewable Energy",
          content: `
      <!-- slide container with a captivating background -->
      <div class="relative w-[1920px] h-[1080px] bg-white overflow-hidden font-['Poppins']">

        <!-- Mesmerizing background image: futuristic renewable energy landscape -->
        <img
          src="https://image.pollinations.ai/prompt/futuristic_clean_energy_landscape,_massive_solar_arrays,_wind_turbines,_deep_navy_and_cyan_palette,_professional_design"
          class="absolute inset-0 w-full h-full object-cover brightness-75 contrast-125 blur-sm"
          alt="Futuristic renewable energy landscape"
          id="el-e0840821-1ef5-4c62-b23e-1cb32dd606f4"
        >

        <!-- Dark semi-transparent overlay to enhance text readability -->
        <div
          class="absolute inset-0 bg-slate-900 opacity-60"
          id="el-112eef7e-4c2e-41e7-9f08-b492d2546f72"
          style="left: 0px; top: 0px; transform: translate(0px, 0px); width: 1920px; height: 1077px;"
        ></div>

        <!-- Content container: title, subtitle, divider, and key elements -->
        <div class="absolute left-[150px] top-[250px] w-[1500px] text-white" id="el-14e2a32a-a94c-4e97-8752-98c73bbf7304">

          <!-- Astonishing title: Dawn of Decarbonization -->
          <h1 class="text-[60px] font-extrabold leading-tight tracking-tight mb-6">The Dawn of Decarbonization:</h1>

          <!-- Impactful subtitle: Charting the Future of Renewable Energy -->
          <h2 class="text-[48px] font-light leading-snug text-cyan-400">Charting the Future of Renewable Energy</h2>

          <!-- Elegant horizontal divider line -->
          <div class="w-[700px] h-[4px] bg-white/20 my-10"></div>

          <!-- Key elements: Innovation, Scale, Grid Integration, represented as icons -->
          <div class="flex space-x-12 text-[26px] font-medium text-slate-200 mt-16">
            <!-- Innovation element -->
            <div class="flex items-center space-x-3">
              <ion-icon name="bulb-outline" class="text-cyan-400 text-[36px] md hydrated" role="img"></ion-icon>
              <span>Innovation</span>
            </div>

            <!-- Scale element -->
            <div class="flex items-center space-x-3">
              <ion-icon name="layers-outline" class="text-cyan-400 text-[36px] md hydrated" role="img"></ion-icon>
              <span>Scale</span>
            </div>

            <!-- Grid Integration element -->
            <div class="flex items-center space-x-3">
              <ion-icon name="grid-outline" class="text-cyan-400 text-[36px] md hydrated" role="img"></ion-icon>
              <span>Grid Integration</span>
            </div>
          </div>
        </div>

        <!-- Footer: A Vision for the Next Decade of Energy Transformation -->
        <div class="absolute bottom-[40px] right-[100px] text-[24px] text-slate-400 font-light">
          A Vision for the Next Decade of Energy Transformation
        </div>
      </div>
    `,
        },
        {
          title:
            "The Global Imperative: Why Renewables Must Lead the Energy Transition",
          content: `
      <!-- Visually striking slide container with a split layout -->
      <div class="relative w-[1920px] h-[1080px] bg-slate-50 overflow-hidden font-['Poppins']">

        <!-- Left section: Dark background with a rising green line graphic -->
        <div class="absolute left-0 top-0 w-[1100px] h-full bg-slate-900">

          <!-- Mesmerizing abstract graphic of rising energy transition -->
          <img
            src="https://image.pollinations.ai/prompt/abstract_graphic_of_a_rising_green_line_on_a_dark_blue_background_representing_energy_transition_minimalist_high_tech"
            class="absolute inset-0 w-full h-full object-cover opacity-30"
            alt="Rising green line graph"
          >

          <!-- Content container: Headline, paragraph, and target -->
          <div class="absolute top-[120px] left-[100px] text-white">

            <!-- Astonishing headline: The Global Imperative -->
            <h2 class="text-[48px] font-bold text-cyan-400 mb-4">The Global Imperative</h2>

            <!-- Informative paragraph -->
            <p class="text-[28px] font-light text-slate-300 w-[800px]">
              The transition is no longer optional. It is the core strategic driver for global stability, security, and economic growth.
            </p>

            <!-- Impressive Critical Target card -->
            <div class="mt-16 bg-white/5 p-8 rounded-xl w-[450px] border border-cyan-500/30">
              <p class="text-[24px] text-slate-300 uppercase tracking-widest mb-1">Critical Target</p>
              <span class="text-[80px] font-extrabold text-white leading-none">1.5°C</span>
              <p class="text-[22px] text-slate-400 mt-2">The narrowing window for climate alignment.</p>
            </div>
          </div>
        </div>

        <!-- Right section: White background with reasons why Renewables Must Lead -->
        <div class="absolute right-0 top-0 w-[820px] h-full p-[100px]">

          <!-- Section title: Why Renewables Must Lead -->
          <h3 class="text-[36px] font-semibold text-slate-800 mb-12">Why Renewables Must Lead</h3>

          <!-- Container for reasons presented as cards -->
          <div class="space-y-8">

            <!-- Climate Targets card -->
            <div class="p-8 bg-white rounded-xl shadow-lg border-t-4 border-cyan-500">
              <div class="flex items-start space-x-4">
                <ion-icon name="alert-circle-outline" class="text-cyan-600 text-[40px] md hydrated" role="img"></ion-icon>
                <div>
                  <p class="text-[28px] font-semibold text-slate-900">Climate Targets</p>
                  <p class="text-[22px] text-slate-600 mt-1">Urgent alignment with the 1.5°C goal requires aggressive deployment and policy shifts.</p>
                </div>
              </div>
            </div>

            <!-- Energy Security card -->
            <div class="p-8 bg-white rounded-xl shadow-lg border-t-4 border-indigo-500">
              <div class="flex items-start space-x-4">
                <ion-icon name="shield-checkmark-outline" class="text-indigo-600 text-[40px] md hydrated" role="img"></ion-icon>
                <div>
                  <p class="text-[28px] font-semibold text-slate-900">Energy Security</p>
                  <p class="text-[22px] text-slate-600 mt-1">Reducing geopolitical dependency by leveraging abundant, domestic, clean resources.</p>
                </div>
              </div>
            </div>

            <!-- Economic Driver card -->
            <div class="p-8 bg-white rounded-xl shadow-lg border-t-4 border-green-500">
              <div class="flex items-start space-x-4">
                <ion-icon name="trending-up-outline" class="text-green-600 text-[40px] md hydrated" role="img"></ion-icon>
                <div>
                  <p class="text-[28px] font-semibold text-slate-900">Economic Driver</p>
                  <p class="text-[22px] text-slate-600 mt-1">Renewables are consistently becoming the lowest-cost source of new power generation globally.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
        },
      ],
    },
  },
  {
    id: "vibrant-creative",
    name: "Vibrant Creative",
    description: "Bold, expressive, and engaging.",
    colors: ["#8B5CF6", "#EC4899", "#F59E0B"],
    html: `<div class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-8">
            <div class="w-2/3 bg-white/80 rounded-2xl p-6 backdrop-blur-lg shadow-2xl">
                <div class="w-1/3 h-5 bg-yellow-400 rounded-full mb-4"></div>
                <div class="w-full h-2.5 bg-white rounded-full mb-2"></div>
                <div class="w-3/4 h-2.5 bg-white rounded-full"></div>
            </div>
           </div>`,
    prompt:
      "Unleash a high-energy visual experience driven by fluid gradients and electric colors. Combine distinct, playful shapes with expressive typography to create a sense of movement and joy. The design should feel spontaneous and artistic, utilizing translucent layers and bright accents to capture imagination.",
  },
  {
    id: "dark-mode-sleek",
    name: "Dark Mode Sleek",
    description: "Modern, deep, and focused.",
    colors: ["#1E293B", "#4ADE80", "#94A3B8"],
    html: `<div class="w-full h-full bg-slate-900 flex items-center justify-center p-8">
            <div class="w-2/3 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div class="w-1/2 h-4 bg-green-400 rounded-full mb-4"></div>
                <div class="w-full h-2 bg-slate-600 rounded-full mb-2"></div>
                <div class="w-3/4 h-2 bg-slate-600 rounded-full"></div>
            </div>
           </div>`,
    prompt:
      "Forge a futuristic, immersive environment using a midnight-dark canvas. Use high-contrast neon accents to guide the user's eye against charcoal backgrounds. Incorporate subtle glows and depth-defying layers to create a sleek, technical feel that is easy on the eyes but visually striking.",
  },
  {
    id: "neo-brutalism",
    name: "Neo-Brutalism",
    description: "Raw, unpolished, and trendy.",
    colors: ["#FEF08A", "#000000", "#FF6B6B"],
    html: `<div class="w-full h-full bg-yellow-200 flex items-center justify-center p-8">
            <div class="w-2/3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
                <div class="w-1/2 h-4 bg-red-400 border border-black mb-4"></div>
                <div class="w-full h-2 bg-black mb-2"></div>
                <div class="w-3/4 h-2 bg-black"></div>
            </div>
           </div>`,
    prompt:
      "Embrace a raw, anti-design aesthetic that breaks traditional rules. Use stark black outlines, hard unsoftened shadows, and clashing high-saturation colors. The layout should feel bold and assertive with mono-spaced typography and visible structural grids, rejecting softness in favor of impact.",
  },
  {
    id: "soft-pastel",
    name: "Soft Pastel",
    description: "Calm, dreamy, and airy.",
    colors: ["#F0F9FF", "#FDA4AF", "#C4B5FD"],
    html: `<div class="w-full h-full bg-sky-50 flex items-center justify-center p-8">
            <div class="w-2/3 bg-white rounded-3xl p-6 shadow-sm border border-purple-100">
                <div class="w-1/3 h-4 bg-pink-300 rounded-full mb-4 opacity-50"></div>
                <div class="w-full h-2 bg-violet-100 rounded-full mb-2"></div>
                <div class="w-3/4 h-2 bg-violet-100 rounded-full"></div>
            </div>
           </div>`,
    prompt:
      "Create a gentle, marshmallow-soft atmosphere using a palette of washed-out pastels. Eliminate harsh lines in favor of billowing curves and fluffy transitions. The design should feel airy, approachable, and comforting, evoking feelings of serenity and kindness.",
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon",
    description: "High-tech, glowing, and glitchy.",
    colors: ["#09090B", "#06B6D4", "#D946EF"],
    html: `<div class="w-full h-full bg-black flex items-center justify-center p-8">
            <div class="w-2/3 bg-zinc-900/80 border border-cyan-500/50 rounded-lg p-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <div class="w-1/2 h-4 bg-fuchsia-500 rounded-sm mb-4"></div>
                <div class="w-full h-2 bg-zinc-700 rounded-sm mb-2"></div>
                <div class="w-3/4 h-2 bg-zinc-700 rounded-sm"></div>
            </div>
           </div>`,
    prompt:
      "Design a dystopian high-tech interface straight from a sci-fi metropolis. Utilize a pitch-black background illuminated by piercing cyan and magenta neon light. Introduce elements of digital noise, grid patterns, and sharp angular geometry to convey a hacking terminal or futuristic dashboard vibe.",
  },
  {
    id: "swiss-minimalism",
    name: "Swiss Minimalism",
    description: "Structured, typographic, and bold.",
    colors: ["#FFFFFF", "#DC2626", "#000000"],
    html: `<div class="w-full h-full bg-stone-100 flex items-center justify-center p-8">
            <div class="w-2/3 bg-white p-6 border-l-4 border-red-600">
                <div class="w-1/4 h-8 bg-black mb-4"></div>
                <div class="w-full h-2 bg-gray-300 mb-2"></div>
                <div class="w-full h-2 bg-gray-300 mb-2"></div>
                <div class="w-2/3 h-2 bg-gray-300"></div>
            </div>
           </div>`,
    prompt:
      "Apply the principles of International Typographic Style. Focus on an absolute mathematical grid, asymmetric layouts, and the heavy use of negative space. Use large, bold sans-serif typography as the primary visual element, accented only by stark primary colors like signal red to guide attention.",
  },
  {
    id: "nature-eco",
    name: "Nature Eco",
    description: "Organic, fresh, and sustainable.",
    colors: ["#ECFCCB", "#166534", "#78350F"],
    html: `<div class="w-full h-full bg-[#FAFBF6] flex items-center justify-center p-8">
            <div class="w-2/3 bg-white rounded-tr-3xl rounded-bl-3xl p-6 shadow-md border-b-4 border-green-700">
                <div class="w-1/2 h-4 bg-green-800 rounded-full mb-4"></div>
                <div class="w-full h-2 bg-stone-200 rounded-full mb-2"></div>
                <div class="w-3/4 h-2 bg-stone-200 rounded-full"></div>
            </div>
           </div>`,
    prompt:
      "Cultivate an organic and grounded aesthetic inspired by the outdoors. Utilize a palette of forest greens, bark browns, and unbleached cotton tones. Incorporate leaf-like curves and natural textures to create a user interface that feels sustainable, fresh, and harmoniously connected to nature.",
    example: {
      slides: [
        {
          title: "The Renewable Revolution",
          content: `<div class="relative w-[1920px] h-[1080px] bg-[#F8F7F3] overflow-hidden font-['Inter']">
    <!-- Nature Texture Image -->
    <img src="https://image.pollinations.ai/prompt/abstract_green_forest_texture_energy_flow" class="absolute inset-0 w-full h-full object-cover opacity-80">

    <!-- Organic Background Shape Overlay (Subtle earth tone) -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#1E4D3E] to-[#6AA56A] opacity-80"></div>
    
    <!-- Title Card Area -->
    <div class="absolute top-[180px] left-[150px] w-[1620px] h-[720px] flex flex-col justify-center items-center text-center">
        
        <h1 class="text-[60px] font-['Lora'] font-extrabold text-[#F8F7F3] leading-tight mb-8 drop-shadow-lg">
            THE RENEWABLE REVOLUTION
        </h1>
        <p class="text-[48px] font-['Poppins'] font-light text-[#F8F7F3] mb-12 border-b-4 border-[#A88F7B] pb-4">
            Charting the Future of Energy
        </p>

        <!-- Key Focus Points -->
        <div class="flex space-x-20 mt-10">
            <div class="flex flex-col items-center max-w-[300px]">
                <ion-icon name="leaf-outline" class="text-[48px] text-[#A88F7B] mb-3 md hydrated" role="img"></ion-icon>
                <p class="text-[24px] text-white/90 font-medium">Decarbonization</p>
            </div>
            <div class="flex flex-col items-center max-w-[300px]">
                <ion-icon name="shield-checkmark-outline" class="text-[48px] text-[#A88F7B] mb-3 md hydrated" role="img"></ion-icon>
                <p class="text-[24px] text-white/90 font-medium">Energy Security</p>
            </div>
            <div class="flex flex-col items-center max-w-[300px]">
                <ion-icon name="cash-outline" class="text-[48px] text-[#A88F7B] mb-3 md hydrated" role="img"></ion-icon>
                <p class="text-[24px] text-white/90 font-medium">Economic Opportunity</p>
            </div>
        </div>

        <p class="text-[26px] text-white/70 mt-[100px] font-['PT Sans'] italic">
            Why Now is the Tipping Point for Global Transition
        </p>
    </div>
</div>`,
        },
        {
          title: "The Current Landscape: Exponential Growth",
          content: `<div class="relative w-[1920px] h-[1080px] bg-[#F8F7F3] overflow-hidden font-['Inter']">
    
    <!-- Left Visual Area (Chart) -->
    <div class="absolute left-0 top-0 w-[1100px] h-full bg-white shadow-2xl" id="el-7d796ab0-e852-447b-bdcf-023ed785eb7b">
        <h2 class="text-[36px] font-['Poppins'] font-bold text-[#1E4D3E] pt-16 pl-20">
            The Current Landscape: Exponential Growth
        </h2>
        <p class="text-[24px] text-[#6AA56A] pl-20 mt-2">
            Solar PV and Wind are now cost-competitive globally.
        </p>

        <!-- QuickChart: Symbolic representation of growth -->
        <quickchart config="{'type':'line','data':{'labels':[2015,2017,2019,2021,2023,2025],'datasets':[{'label':'Renewable Capacity (GW)','data':[200,350,550,800,1200,1600],'borderColor':'rgba(30, 77, 62, 1)','backgroundColor':'rgba(30, 77, 62, 0.2)','fill':true,'tension':0.4},{'label':'Fossil Fuel Capacity (GW)','data':[1100,1080,1060,1050,1040,1030],'borderColor':'rgba(168, 143, 123, 1)','backgroundColor':'rgba(168, 143, 123, 0.1)','fill':false}]},'options':{'plugins':{'legend':{'display':true,'position':'bottom'},'title':{'display':false}},'scales':{'y':{'stacked':false,'beginAtZero':false},'x':{'grid':{'display':false}}}}}" width="900" height="600" class="mt-10 ml-10"></quickchart>&nbsp;
        <div class="absolute bottom-10 left-20 text-[22px] text-[#A88F7B] font-['PT Sans']">
            Source: Estimated Global Capacity Trajectories (Symbolic)
        </div>
    </div>
    
    <!-- Right Content Area -->
    <div class="absolute right-0 top-0 w-[820px] h-full p-20 flex flex-col justify-center" id="el-d8d7c11a-945b-4287-a807-9636224cb2b7">
        
        <div class="text-[#1E4D3E] mb-12">
            <ion-icon name="analytics-outline" class="text-[60px] mb-4 md hydrated" role="img"></ion-icon>
            <h3 class="text-[32px] font-bold mb-4 font-['Lora']">Global Drivers</h3>
            <p class="text-[24px] text-[#2D3748]">
                Renewables have crossed the cost-parity threshold, driven by scale and policy mandates.
            </p>
        </div>

        <div class="space-y-8">
            <!-- Card 1 -->
            <div class="p-6 bg-white rounded-xl shadow-lg border-l-4 border-[#6AA56A] flex items-start space-x-4">
                <ion-icon name="sunny-outline" class="text-[36px] text-[#1E4D3E] mt-1 md hydrated" role="img"></ion-icon>
                <div>
                    <p class="text-[26px] font-semibold text-[#1E4D3E]">Cost Advantage</p>
                    <p class="text-[22px] text-[#2D3748]">Solar PV &amp; Wind are now cheaper than most new fossil fuel plants globally.</p>
                </div>
            </div>
            
            <!-- Card 2 -->
            <div class="p-6 bg-white rounded-xl shadow-lg border-l-4 border-[#A88F7B] flex items-start space-x-4">
                <ion-icon name="trending-up-outline" class="text-[36px] text-[#1E4D3E] mt-1 md hydrated" role="img"></ion-icon>
                <div>
                    <p class="text-[26px] font-semibold text-[#1E4D3E]">Policy Acceleration</p>
                    <p class="text-[22px] text-[#2D3748]">Net-zero commitments and global climate agreements solidify long-term investment signals.</p>
                </div>
            </div>

            <!-- Card 3 -->
            <div class="p-6 bg-white rounded-xl shadow-lg border-l-4 border-[#1E4D3E] flex items-start space-x-4">
                <ion-icon name="earth-outline" class="text-[36px] text-[#1E4D3E] mt-1 md hydrated" role="img"></ion-icon>
                <div>
                    <p class="text-[26px] font-semibold text-[#1E4D3E]">Capacity Scale</p>
                    <p class="text-[22px] text-[#2D3748]">Massive deployment across Asia, Europe, and North America drives learning curve benefits.</p>
                </div>
            </div>
        </div>
    </div>
</div>`,
        },
        {
          title: "Frontier Technology 1: Advanced Solar Innovations",
          content: `<div class="relative w-[1920px] h-[1080px] bg-[#F8F7F3] overflow-hidden font-['Inter']">
    <!-- Subtle Background Image: Abstract crystalline structure or solar cell grid -->
    <img src="https://image.pollinations.ai/prompt/perovskite_solar_cell_crystal_technology_abstract_green_blue" class="absolute inset-0 w-full h-full object-cover opacity-10">

    <!-- Header Block -->
    <div class="absolute top-[80px] left-[100px] w-[1720px]">
        <h2 class="text-[48px] font-['Poppins'] font-bold text-[#1E4D3E]">
            Frontier Technology 1: Advanced Solar Innovations
        </h2>
        <p class="text-[26px] text-[#A88F7B] mt-2 font-['Lora']">
            Pushing efficiency boundaries and integrating energy generation into our environment.
        </p>
    </div>

    <!-- Content Cards (3 Columns) -->
    <div class="absolute top-[250px] left-[100px] w-[1720px] flex justify-between space-x-12">
        
        <!-- Card 1: Perovskite Solar Cells -->
        <div class="w-1/3 p-10 bg-white rounded-[30px] shadow-2xl border-t-8 border-[#6AA56A]">
            <div class="flex items-center space-x-4 mb-4">
                <ion-icon name="flask-outline" class="text-[48px] text-[#1E4D3E] md hydrated" role="img"></ion-icon>
                <h3 class="text-[32px] font-bold text-[#1E4D3E] font-['Lora']">Perovskite Breakthroughs</h3>
            </div>
            
            <p class="text-[24px] text-[#2D3748] mb-6">
                A non-silicon material promising revolutionary efficiency improvements and low manufacturing costs (printing/coating).
            </p>
            <ul class="space-y-3 text-[22px] text-[#2D3748] list-none pl-0">
                <li class="flex items-center"><span class="w-2 h-2 rounded-full bg-[#A88F7B] mr-3"></span> Higher Power Conversion Rates</li>
                <li class="flex items-center"><span class="w-2 h-2 rounded-full bg-[#A88F7B] mr-3"></span> Flexible and Lightweight Applications</li>
            </ul>
        </div>

        <!-- Card 2: Integrated Solar (BIPV & Agrivoltaics) -->
        <div class="w-1/3 p-10 bg-white rounded-[30px] shadow-2xl border-t-8 border-[#A88F7B]">
            <div class="flex items-center space-x-4 mb-4">
                <ion-icon name="home-outline" class="text-[48px] text-[#1E4D3E] md hydrated" role="img"></ion-icon>
                <h3 class="text-[32px] font-bold text-[#1E4D3E] font-['Lora']">Seamless Integration</h3>
            </div>
            
            <p class="text-[24px] text-[#2D3748] mb-6">
                Moving beyond panels to integrate energy generation into buildings (BIPV) and optimizing land use (Agrivoltaics).
            </p>
             <ul class="space-y-3 text-[22px] text-[#2D3748] list-none pl-0">
                <li class="flex items-center"><span class="w-2 h-2 rounded-full bg-[#6AA56A] mr-3"></span> Aesthetic and Functional Building Materials</li>
                <li class="flex items-center"><span class="w-2 h-2 rounded-full bg-[#6AA56A] mr-3"></span> Dual-use land for farming and energy</li>
            </ul>
        </div>

        <!-- Card 3: Quantum Dot and Thin-Film -->
        <div class="w-1/3 p-10 bg-white rounded-[30px] shadow-2xl border-t-8 border-[#1E4D3E]">
            <div class="flex items-center space-x-4 mb-4">
                <ion-icon name="layers-outline" class="text-[48px] text-[#1E4D3E] md hydrated" role="img"></ion-icon>
                <h3 class="text-[32px] font-bold text-[#1E4D3E] font-['Lora']">Beyond Silicon Limits</h3>
            </div>
            
            <p class="text-[24px] text-[#2D3748] mb-6">
                Utilizing novel materials and nanotechnology to capture broader light spectra and maximize material utilization.
            </p>
            <ul class="space-y-3 text-[22px] text-[#2D3748] list-none pl-0">
                <li class="flex items-center"><span class="w-2 h-2 rounded-full bg-[#A88F7B] mr-3"></span> Ultra-lightweight and flexible sheets</li>
                <li class="flex items-center"><span class="w-2 h-2 rounded-full bg-[#A88F7B] mr-3"></span> Reduced material requirements (CdTe, CIGS)</li>
            </ul>
        </div>
    </div>
    
    <!-- Large, stylized quote/callout -->
    <div class="absolute bottom-[80px] left-[100px] w-[1720px] text-right">
        <p class="text-[36px] font-['Poppins'] italic font-light text-[#1E4D3E]/70">
            "Every surface becomes a potential power source."
        </p>
    </div>

</div>`,
        },
      ],
    },
  },
  {
    id: "retro-pop",
    name: "90s Retro Pop",
    description: "Nostalgic, pixelated, and fun.",
    colors: ["#3B82F6", "#FACC15", "#EF4444"],
    html: `<div class="w-full h-full bg-blue-600 flex items-center justify-center p-8">
            <div class="w-2/3 bg-gray-200 border-t-4 border-l-4 border-white border-b-4 border-r-4 border-gray-600 p-1">
                <div class="bg-blue-800 text-white px-2 py-1 mb-4 font-bold text-xs flex justify-between"><span>TITLE</span><span>X</span></div>
                <div class="p-4">
                     <div class="w-full h-2 bg-gray-400 mb-2"></div>
                     <div class="w-3/4 h-2 bg-gray-400"></div>
                </div>
            </div>
           </div>`,
    prompt:
      "Channel the playful energy of the early 1990s desktop computing era. Use bevelled buttons, heavy gray backgrounds, and dithering patterns. Incorporate vibrant primary colors and pixel-art inspired iconography to evoke a sense of digital nostalgia and arcade-style fun.",
  },
  {
    id: "luxury-noir",
    name: "Luxury Noir",
    description: "Dark, gold, and exclusive.",
    colors: ["#000000", "#D4AF37", "#171717"],
    html: `<div class="w-full h-full bg-neutral-900 flex items-center justify-center p-8">
            <div class="w-2/3 bg-black border border-yellow-600/50 p-8 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <div class="w-1/2 h-0.5 bg-yellow-600 mb-6"></div>
                <div class="w-full h-2 bg-neutral-800 mb-3"></div>
                <div class="w-2/3 h-2 bg-neutral-800"></div>
            </div>
           </div>`,
    prompt:
      "Craft a visual identity of exclusivity and high fashion. Use a dominant matte black palette accented by thin, elegant lines of metallic gold or bronze. The layout should be spacious and moody, relying on dramatic lighting effects and minimalist composition to convey premium quality and mystery.",
    example: {
      slides: [
        {
          title: "The Renewable Revolution",
          content: `<div class="relative w-[1920px] h-[1080px] bg-[#1A1A1A] overflow-hidden">
    <!-- Background Image -->
    <img src="https://image.pollinations.ai/prompt/Elegant_visual_of_solar_panel_array_meeting_stylized_wind_turbine_against_a_dark_sky,_minimalist,_sophisticated_design" class="absolute inset-0 w-full h-full object-cover opacity-60" alt="Future Energy Landscape">
    
    <!-- Dark Overlay for Contrast -->
    <div class="absolute inset-0 bg-[#1A1A1A] opacity-70"></div>

    <!-- Main Content Box -->
    <div class="absolute top-[200px] left-[180px] w-[1560px] text-white">
        
        <!-- Title -->
        <h1 class="font-['Playfair_Display'] text-[80px] font-bold tracking-tight leading-[90px] text-white">
            The Renewable Revolution
        </h1>
        <h2 class="font-['Playfair_Display'] text-[60px] font-light mt-4 text-[#C6A47E]">
            Charting the Future of Energy
        </h2>

        <!-- Sub-points Grid -->
        <div class="grid grid-cols-3 gap-16 mt-[120px]">
            
            <!-- Point 1: Shifting -->
            <div class="p-8 border-l-4 border-[#C6A47E] bg-white bg-opacity-5 rounded-lg">
                <ion-icon name="flash-outline" class="text-[50px] text-[#C6A47E] md hydrated" role="img"></ion-icon>
                <h3 class="font-['Inter'] text-[28px] font-semibold mt-4 mb-2 text-white">
                    Sustainable Power Shift
                </h3>
                <p class="font-['Inter'] text-[24px] text-gray-300">
                    Moving decisively from centralized fossil fuels toward diversified, sustainable generation sources.
                </p>
            </div>

            <!-- Point 2: Objective -->
            <div class="p-8 border-l-4 border-[#C6A47E] bg-white bg-opacity-5 rounded-lg">
                <ion-icon name="map-outline" class="text-[50px] text-[#C6A47E] md hydrated" role="img"></ion-icon>
                <h3 class="font-['Inter'] text-[28px] font-semibold mt-4 mb-2 text-white">
                    Mapping Key Trends
                </h3>
                <p class="font-['Inter'] text-[24px] text-gray-300">
                    Analyzing key technological innovations and crucial policy frameworks accelerating this transformation.
                </p>
            </div>

            <!-- Point 3: Urgency -->
            <div class="p-8 border-l-4 border-[#C6A47E] bg-white bg-opacity-5 rounded-lg">
                <ion-icon name="planet-outline" class="text-[50px] text-[#C6A47E] md hydrated" role="img"></ion-icon>
                <h3 class="font-['Inter'] text-[28px] font-semibold mt-4 mb-2 text-white">
                    The Climate Imperative
                </h3>
                <p class="font-['Inter'] text-[24px] text-gray-300">
                    A global urgency driven by climate goals mandates rapid, strategic adoption of clean energy systems.
                </p>
            </div>
        </div>

    </div>
    
    <!-- Footer Logo/Branding -->
    <div class="absolute bottom-[40px] right-[80px] text-white opacity-50 font-['Playfair_Display'] text-[22px]">
        Future Energy Summit 2024
    </div>
</div>`,
        },
        {
          title: "Solar Power: Beyond the Civilization",
          content: `<div class="relative w-[1920px] h-[1080px] bg-[#1E293B] overflow-hidden">
    
    <!-- Background Image - Subtle Grid/Abstract Solar Cell -->
    <img src="https://image.pollinations.ai/prompt/Abstract_geometric_pattern_representing_solar_cell_microstructure,_dark_blue_and_gold_tones,_minimal_background" class="absolute inset-0 w-full h-full object-cover opacity-10" alt="Solar Microstructure">

    <!-- Title Header -->
    <div class="absolute top-[80px] left-[100px] w-[1720px]">
        <h1 class="font-['Playfair_Display'] text-[60px] font-bold text-white">
            Solar Power: <span class="text-[#C6A47E]">Beyond the Silicon</span>
        </h1>
        <p class="font-['Inter'] text-[28px] mt-4 text-gray-300">
            Next-generation technologies drastically boosting efficiency and deployment flexibility.
        </p>
    </div>

    <!-- Three Featured Breakthroughs -->
    <div class="absolute top-[280px] left-[100px] grid grid-cols-3 gap-16 w-[1720px]">
        
        <!-- Card 1: Perovskite -->
        <div class="bg-[#2C3E50] p-10 rounded-xl shadow-2xl border-t-8 border-[#C6A47E]">
            <div class="flex items-center space-x-4">
                <ion-icon name="flask-outline" class="text-[70px] text-[#C6A47E] md hydrated" role="img"></ion-icon>
                <h3 class="font-['Playfair_Display'] text-[36px] font-semibold text-white">
                    Perovskite Breakthroughs
                </h3>
            </div>
            <p class="font-['Inter'] text-[24px] mt-6 text-gray-300 leading-relaxed">
                Revolutionary materials promising significantly higher energy conversion efficiencies (over 30%) and drastically lower manufacturing costs via printing techniques.
            </p>
            <div class="mt-8">
                <span class="inline-block px-4 py-1 text-[20px] font-medium text-[#C6A47E] border border-[#C6A47E] rounded-full">
                    High Efficiency
                </span>
                <span class="inline-block ml-4 px-4 py-1 text-[20px] font-medium text-white bg-[#37475A] rounded-full">
                    Low Cost
                </span>
            </div>
        </div>

        <!-- Card 2: Floatovoltaics & Agrivoltaics -->
        <div class="bg-[#2C3E50] p-10 rounded-xl shadow-2xl border-t-8 border-[#C6A47E]">
            <div class="flex items-center space-x-4">
                <ion-icon name="leaf-outline" class="text-[70px] text-[#C6A47E] md hydrated" role="img"></ion-icon>
                <h3 class="font-['Playfair_Display'] text-[36px] font-semibold text-white">
                    Integrated Deployment
                </h3>
            </div>
            <p class="font-['Inter'] text-[24px] mt-6 text-gray-300 leading-relaxed">
                Utilizing non-land resources: Floating solar (Floatovoltaics) on reservoirs and Agrivoltaics optimizing land use for simultaneous farming and energy generation.
            </p>
             <div class="mt-8">
                <span class="inline-block px-4 py-1 text-[20px] font-medium text-[#C6A47E] border border-[#C6A47E] rounded-full">
                    Dual Use
                </span>
                <span class="inline-block ml-4 px-4 py-1 text-[20px] font-medium text-white bg-[#37475A] rounded-full">
                    Water Savings
                </span>
            </div>
        </div>

        <!-- Card 3: Concentrated Solar Power (CSP) -->
        <div class="bg-[#2C3E50] p-10 rounded-xl shadow-2xl border-t-8 border-[#C6A47E]">
            <div class="flex items-center space-x-4">
                <ion-icon name="thermometer-outline" class="text-[70px] text-[#C6A47E] md hydrated" role="img"></ion-icon>
                <h3 class="font-['Playfair_Display'] text-[36px] font-semibold text-white">
                    Dispatchable CSP
                </h3>
            </div>
            <p class="font-['Inter'] text-[24px] mt-6 text-gray-300 leading-relaxed">
                Advanced CSP systems integrate thermal storage, allowing solar energy to be reliably dispatched to the grid even hours after sunset, providing crucial stability.
            </p>
            <div class="mt-8">
                <span class="inline-block px-4 py-1 text-[20px] font-medium text-[#C6A47E] border border-[#C6A47E] rounded-full">
                    24/7 Energy
                </span>
                <span class="inline-block ml-4 px-4 py-1 text-[20px] font-medium text-white bg-[#37475A] rounded-full">
                    Grid Stability
                </span>
            </div>
        </div>
        
    </div>
    
    <!-- Footer/Source Note -->
    <div class="absolute bottom-[60px] left-[100px] w-[1720px] text-gray-500">
        <div class="h-px w-full bg-gray-700 mb-4"></div>
        <p class="font-['Inter'] text-[20px]">Innovation drives the grid: efficiency, integration, and reliability.</p>
    </div>
</div>`,
        },
        {
          title: "GeoPolitical Shifts",
          content: `<div class="relative w-[1920px] h-[1080px] bg-[#FAF9F6] overflow-hidden">
    
    <!-- Imagery: Subtle Map/Globe background pattern -->
    <div class="absolute inset-0 opacity-10" style="background-image: url('https://image.pollinations.ai/prompt/Stylized_world_map_grid_pattern_with_subtle_gold_lines_on_beige_background'); background-size: cover;" id="el-04f6036c-4747-41a2-b125-3279e394c23b"></div>

    <!-- Title Header -->
    <div class="absolute top-[80px] left-[100px] w-[1720px]">
        <h1 class="font-['Playfair_Display'] text-[60px] font-bold text-[#1E293B]">
            Geopolitical Shifts
        </h1>
        <h2 class="font-['Playfair_Display'] text-[48px] font-light text-[#C6A47E] mt-2">
            Independence and Supply Chains
        </h2>
    </div>

    <!-- Content Split: Security vs. Manufacturing Race -->
    <div class="absolute top-[280px] left-[100px] w-[1720px] grid grid-cols-2 gap-20">
        
        <!-- Pillar 1: Energy Independence and Security -->
        <div class="p-10 bg-white shadow-2xl rounded-xl border-l-8 border-[#1E293B]">
            <ion-icon name="shield-checkmark-outline" class="text-[80px] text-[#C6A47E] md hydrated" role="img"></ion-icon>
            <h3 class="font-['Playfair_Display'] text-[40px] font-bold text-[#1E293B] mt-4">
                Enhanced National Security
            </h3>
            <p class="font-['Inter'] text-[26px] mt-4 text-gray-700 leading-relaxed">
                Shifting power generation away from geographically centralized fuel sources dramatically enhances national energy independence and resilience against global volatility.
            </p>
            
            <div class="mt-8 space-y-4">
                 <div class="flex items-center">
                    <ion-icon name="location-outline" class="text-[30px] text-green-700 mr-3 md hydrated" role="img"></ion-icon>
                    <p class="font-['Inter'] text-[24px] font-medium text-[#1E293B]">Decentralization reduces single points of failure.</p>
                </div>
                <div class="flex items-center">
                    <ion-icon name="lock-closed-outline" class="text-[30px] text-green-700 mr-3 md hydrated" role="img"></ion-icon>
                    <p class="font-['Inter'] text-[24px] font-medium text-[#1E293B]">Insulation from global fossil fuel price shocks.</p>
                </div>
            </div>
        </div>

        <!-- Pillar 2: Supply Chain and Manufacturing -->
        <div class="p-10 bg-white shadow-2xl rounded-xl border-l-8 border-[#1E293B]">
            <ion-icon name="trending-up-outline" class="text-[80px] text-[#C6A47E] md hydrated" role="img"></ion-icon>
            <h3 class="font-['Playfair_Display'] text-[40px] font-bold text-[#1E293B] mt-4">
                The Manufacturing Race
            </h3>
            <p class="font-['Inter'] text-[26px] mt-4 text-gray-700 leading-relaxed">
                Global competition is heating up for supremacy in manufacturing key components like solar cells, electrolyzers, and critical mineral processing.
            </p>
            
            <div class="mt-8 space-y-4">
                <div class="flex items-center">
                    <ion-icon name="swap-horizontal-outline" class="text-[30px] text-green-700 mr-3 md hydrated" role="img"></ion-icon>
                    <p class="font-['Inter'] text-[24px] font-medium text-[#1E293B]">Sourcing and recycling strategies for battery components.</p>
                </div>
                <div class="flex items-center">
                    <ion-icon name="factory-outline" class="text-[30px] text-green-700 mr-3 md hydrated" role="img"></ion-icon>
                    <p class="font-['Inter'] text-[24px] font-medium text-[#1E293B]">Domestic production incentives driving industrial capacity.</p>
                </div>
            </div>
        </div>
        
    </div>
    
    <!-- Footer/Concluding thought -->
    <div class="absolute bottom-[60px] left-[100px] w-[1720px] text-center">
        <h3 class="font-['Playfair_Display'] text-[36px] italic text-[#1E293B]">
            The energy transition is fundamentally reshaping global economic power structures.
        </h3>
    </div>
</div>`,
        },
      ],
    },
  },
  {
    id: "industrial-utilitarian",
    name: "Industrial Utilitarian",
    description: "Functional, monochromatic, and sturdy.",
    colors: ["#475569", "#94A3B8", "#F97316"],
    html: `<div class="w-full h-full bg-slate-200 flex items-center justify-center p-8">
            <div class="w-2/3 bg-slate-300 border-2 border-slate-500 p-4">
                <div class="w-full flex gap-2 mb-4">
                    <div class="w-3 h-3 bg-slate-500 rounded-full"></div>
                    <div class="w-3 h-3 bg-slate-500 rounded-full"></div>
                </div>
                <div class="w-full h-6 bg-slate-100 border border-slate-400 mb-2"></div>
                <div class="w-full h-12 bg-slate-100 border border-slate-400"></div>
            </div>
           </div>`,
    prompt:
      "Prioritize function over form with a design inspired by technical blueprints and machinery. Use a monochromatic scale of concrete greys, interrupted only by safety-orange alerts. Emphasize modular layouts, visible containment boxes, and monospace typography to create a sturdy, tool-like interface.",
  },
  {
    id: "warm-sunset",
    name: "Warm Sunset",
    description: "Inviting, gradient, and cozy.",
    colors: ["#FFF7ED", "#F97316", "#BE123C"],
    html: `<div class="w-full h-full bg-gradient-to-b from-orange-100 to-rose-100 flex items-center justify-center p-8">
            <div class="w-2/3 bg-white/60 rounded-2xl p-6 shadow-xl border border-orange-100">
                <div class="w-12 h-12 bg-gradient-to-tr from-orange-400 to-rose-500 rounded-full mb-4"></div>
                <div class="w-full h-2 bg-rose-200/50 rounded-full mb-2"></div>
                <div class="w-3/4 h-2 bg-rose-200/50 rounded-full"></div>
            </div>
           </div>`,
    prompt:
      "Evoke the feeling of a golden hour evening. Blend smooth gradients of peach, tangerine, and warm rose across the canvas. Use soft, rounded geometry and warm-tinted white overlays to create an interface that feels inviting, hospitable, and full of positive energy.",
  },
  {
    id: "academic-journal",
    name: "Academic Journal",
    description: "Textured, serif, and authoritative.",
    colors: ["#F5F5F4", "#1C1917", "#78350F"],
    html: `<div class="w-full h-full bg-[#F2EFE9] flex items-center justify-center p-8">
            <div class="w-2/3 bg-white shadow-sm p-8 border-t-4 border-stone-800">
                <div class="w-3/4 h-4 bg-stone-900 mb-4"></div>
                <div class="flex gap-2 mb-2">
                    <div class="w-full h-1.5 bg-stone-400"></div>
                    <div class="w-full h-1.5 bg-stone-400"></div>
                </div>
                <div class="w-full h-1.5 bg-stone-400 mb-1"></div>
                <div class="w-2/3 h-1.5 bg-stone-400"></div>
            </div>
           </div>`,
    prompt:
      "Mimic the authority and texture of a printed academic journal or a classic newspaper. Use an off-white, paper-like background paired with ink-black serif typography. The layout should be structured, utilizing ruled lines and multi-column text to convey knowledge and seriousness.",
    example: {
      slides: [
  {
    title: "The Renewable Revolution: Powering the Future",
    content: `
      <!-- Grand and aesthetically pleasing slide container with a subtle parchment texture -->
      <div class="relative w-[1920px] h-[1080px] bg-[#f8f5ed] overflow-hidden font-['Playfair_Display']">

        <!-- Academic Paper Texture Visual (Subtle lines/pattern via image) -->
        <div class="absolute inset-0 opacity-10">
          <img
            src="https://image.pollinations.ai/prompt/subtle_parchment_paper_texture_background"
            alt="Paper texture"
            class="w-full h-full object-cover"
          >
        </div>

        <!-- Header section: Title, subtitle, and rules, all centered -->
        <div class="absolute top-[100px] left-[150px] right-[150px] flex flex-col items-center">

          <!-- Header Rule - A substantial dark line -->
          <div class="w-[700px] h-[3px] bg-[#1a1a1a] mb-8"></div>

          <!-- Subtitle: Journal of Advanced Energy Studies -->
          <p class="text-[32px] text-[#6b463a] tracking-[0.3em] uppercase mb-4 font-['Lora']">Journal of Advanced Energy Studies</p>

          <!-- Astonishing Title: The Renewable Revolution: Powering the Future -->
          <h1 class="text-[96px] text-[#1a1a1a] font-bold leading-[1.1] text-center max-w-[1000px] mb-12">The Renewable Revolution: Powering the Future</h1>

          <!-- Footer Rule -  substantial dark line -->
          <div class="w-[700px] h-[3px] bg-[#1a1a1a] mt-8 mb-16"></div>
        </div>

        <!-- Featured Image section: Abstract Energy Flow -->
        <div class="absolute bottom-[100px] left-[150px] w-[500px] h-[300px] bg-[#eae4db] border border-[#1a1a1a] p-4 shadow-xl">
          <img
            src="https://image.pollinations.ai/prompt/abstract_clean_minimalist_visual_of_energy_flow_grid_and_sunlight_serene_academic_style"
            alt="Energy flow"
            class="w-full h-full object-cover"
          >
        </div>

        <!-- Content Sections in Columns (Academic Abstract style) -->
        <div class="absolute bottom-[100px] right-[150px] w-[900px] font-['Lora'] text-[#1a1a1a] grid grid-cols-3 gap-8 text-[22px]">

          <!-- Column 1: Imperative -->
          <div class="col-span-1">
            <h3 class="text-[26px] font-bold mb-3 uppercase tracking-wider text-[#6b463a]">I. Imperative</h3>
            <p class="leading-[1.4]">Defining the Global Energy Transition Imperative. A critical pivot from conventional systems towards net-zero infrastructure.</p>
          </div>

          <!-- Column 2: Urgency -->
          <div class="col-span-1 border-l border-[#1a1a1a] pl-6">
            <h3 class="text-[26px] font-bold mb-3 uppercase tracking-wider text-[#6b463a]">II. Urgency</h3>
            <p class="leading-[1.4]">Addressing Climate Goals and Energy Security through decentralized, resilient power networks.</p>
          </div>

          <!-- Column 3: Roadmap -->
          <div class="col-span-1 border-l border-[#1a1a1a] pl-6">
            <h3 class="text-[26px] font-bold mb-3 uppercase tracking-wider text-[#6b463a]">III. Roadmap</h3>
            <p class="leading-[1.4]">Overview of 10 Key Stages required to transition global power generation and consumption profiles.</p>
          </div>
        </div>

        <!-- Footer/Page Number -->
        <div class="absolute bottom-[30px] right-[50px] text-[20px] font-['Lora'] text-[#1a1a1a]/70">Volume XI, Issue 4 | September 2024</div>
      </div>
    `,
  },
  {
    title: "Current Landscape: Where We Stand Today",
    content: `
      <!-- Elegant slide container styled to resemble an academic paper -->
      <div class="relative w-[1920px] h-[1080px] bg-[#f8f5ed] overflow-hidden font-['Lora'] text-[#1a1a1a]">

        <!-- Header/Title Block -->
        <div class="absolute top-[80px] left-[100px] right-[100px]">
          <!-- Astonishing Title: Current Landscape: Where We Stand Today -->
          <h2 class="text-[48px] font-['Playfair Display'] font-bold mb-2 leading-tight">Current Landscape: Where We Stand Today</h2>
          <div class="w-full h-[2px] bg-[#6b463a] mb-6"></div>
        </div>

        <!-- Left Column: Data Visualization (Capacity Growth) -->
        <div class="absolute top-[200px] left-[100px] w-[800px] h-[750px] border-r border-[#1a1a1a]/50 pr-10">
          <h3 class="text-[32px] font-bold mb-6 text-[#6b463a] font-['Playfair Display']">Global Renewable Capacity Growth (2015-2024)</h3>

          <!-- QuickChart Placeholder: Line chart showing exponential growth of Solar (yellow/orange) and Wind (blue/teal) -->
          <div class="bg-white p-6 border border-[#1a1a1a]/10 shadow-lg mb-8">
            <quickchart
              config="{'type':'line','data':{'labels':[2015,2017,2019,2021,2023,2025],'datasets':[{'label':'Solar PV (GW)','data':[220,380,650,1000,1600,2200],'borderColor':'#ffaa00','borderWidth':3,'fill':false},{'label':'Wind (GW)','data':[400,500,650,850,1100,1400],'borderColor':'#009999','borderWidth':3,'fill':false}]},'options':{'scales':{'y':{'title':{'display':true,'text':'Installed Capacity (GW)'}}},'plugins':{'legend':{'position':'bottom'}}}}"
              alt="Capacity Growth Chart"
              class="w-[750px] h-[400px] object-contain"
            >
            </quickchart>
          </div>

          <p class="text-[24px] mt-4 leading-relaxed italic text-[#1a1a1a]/80">
            Solar PV now dominates capacity additions globally, achieving unprecedented scale faster than predicted, followed closely by terrestrial and offshore wind.
          </p>
        </div>

        <!-- Right Column: Analysis and Barriers -->
        <div class="absolute top-[200px] right-[100px] w-[900px] flex flex-col justify-start">
          <h3 class="text-[32px] font-bold mb-6 text-[#6b463a] font-['Playfair Display']">Persistent Reliance and Key Barriers</h3>
          <div class="grid grid-cols-2 gap-8">

            <!-- Box 1: Energy Mix Challenge -->
            <div class="col-span-1 bg-white p-6 border border-[#1a1a1a] shadow-md">
              <div class="flex items-center mb-3">
                <ion-icon name="flash-off-outline" class="text-[40px] text-[#6b463a] mr-3 md hydrated" role="img"></ion-icon>
                <h4 class="text-[28px] font-bold font-['Playfair Display']">The Energy Mix Reality</h4>
              </div>
              <p class="text-[24px] leading-relaxed mb-4">
                Fossil fuels, particularly gas and coal, remain embedded in the baseload supply, accounting for over 60% of primary energy globally. The transition of existing infrastructure is the primary challenge.
              </p>
              <div class="w-full h-[1px] bg-[#1a1a1a]/30"></div>
            </div>

            <!-- Box 2: Intermittency and Grid Needs -->
            <div class="col-span-1 bg-white p-6 border border-[#1a1a1a] shadow-md">
              <div class="flex items-center mb-3">
                <ion-icon name="sync-outline" class="text-[40px] text-[#6b463a] mr-3 md hydrated" role="img"></ion-icon>
                <h4 class="text-[28px] font-bold font-['Playfair Display']">Grid Modernization</h4>
              </div>
              <ul class="list-none space-y-3 text-[24px] leading-relaxed pl-0">
                <li class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-[#1a1a1a] mr-3"></span> Intermittency requires massive storage scaling.
                </li>
                <li class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-[#1a1a1a] mr-3"></span> Aging transmission lines cannot handle two-way flow (DERs).
                </li>
                <li class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-[#1a1a1a] mr-3"></span> Need for AI-driven predictive asset management.
                </li>
              </ul>
              <div class="w-full h-[1px] bg-[#1a1a1a]/30"></div>
            </div>
          </div>

          <!-- Large Quote/Callout -->
          <div class="mt-8 bg-[#eae4db] p-8 border border-[#6b463a]/50 shadow-inner">
            <ion-icon name="quote" class="text-[50px] text-[#6b463a]/50 float-left mr-4 md hydrated" role="img"></ion-icon>
            <p class="text-[36px] font-['Playfair Display'] italic leading-snug">
              "The primary obstacle is not generation capacity, but the structural rigidity of the legacy power delivery system."
            </p>
          </div>
        </div>
      </div>
    `,
  },
  {
    title: "Wind Energy: Offshore and Airborne Innovations",
    content: `
      <!-- Visually captivating slide container focusing on wind energy innovations -->
      <div class="relative w-[1920px] h-[1080px] bg-[#f8f5ed] overflow-hidden font-['Lora'] text-[#1a1a1a]">

        <!-- Title and Secondary Rule -->
        <div class="absolute top-[80px] left-[100px] right-[100px]">
          <!-- Mesmerizing Title: Wind Energy: Offshore and Airborne Innovations -->
          <h2 class="text-[48px] font-['Playfair Display'] font-bold mb-2 leading-tight">Wind Energy: Offshore and Airborne Innovations</h2>
          <div class="w-full h-[1px] bg-[#1a1a1a] opacity-50 mb-8"></div>
        </div>

        <!-- Main Content Grid 1x3 -->
        <div
          class="absolute top-[180px] left-[100px] w-[1720px] grid grid-cols-3 gap-10"
          id="el-194e7833-feac-47f1-80bc-74e1d56e5ab1"
          style="left: 101.538px; top: 164.615px; transform: translate(0px, 0px);"
        >

          <!-- Column 1: Floating Offshore Wind (Visual Focus) -->
          <div class="col-span-1 bg-white p-6 border border-[#1a1a1a] shadow-lg">
            <h3 class="text-[32px] font-['Playfair Display'] font-bold text-[#6b463a] mb-4 border-b pb-2">Floating Offshore Wind (FOW)</h3>
            <div class="h-[350px] mb-4 border border-[#1a1a1a]/30">
              <img
                src="https://image.pollinations.ai/prompt/floating_offshore_wind_turbine_in_deep_blue_ocean_minimalist_diagram_academic_style"
                alt="Floating Wind Turbine"
                class="w-full h-full object-cover"
              >
            </div>
            <p class="text-[24px] leading-relaxed"><span class="font-bold">Unlocking Deeper Waters:</span> Traditional fixed-bottom wind farms are limited to shallow coastal areas. FOW technology, utilizing semi-submersible or spar buoy platforms, opens up high-wind resource zones previously unreachable.</p>
            <div class="mt-4 text-[22px] font-bold text-[#1a1a1a]"><ion-icon name="pin-outline" class="mr-2 md hydrated" role="img"></ion-icon> Accesses 80% of global offshore wind potential.</div>
          </div>

          <!-- Column 2: Ultra-Large Turbines (Scale Focus) -->
          <div class="col-span-1 bg-white p-6 border border-[#1a1a1a] shadow-lg">
            <h3 class="text-[32px] font-['Playfair Display'] font-bold text-[#6b463a] mb-4 border-b pb-2">Scaling Capacity: The 15MW+ Units</h3>
            <div class="h-[350px] mb-4 border border-[#1a1a1a]/30 flex items-center justify-center">
              <img
                src="https://image.pollinations.ai/prompt/massive_industrial_wind_turbine_blade_beside_a_small_person_showing_scale_hyperrealistic"
                alt="Large Turbine Scale"
                class="h-full w-full object-cover"
              >
            </div>
            <p class="text-[24px] leading-relaxed">Turbine size continues to grow exponentially. Units exceeding 15MW dramatically improve efficiency, reduce operational costs (O&amp;M) per MWh, and decrease the necessary physical footprint for large-scale projects.</p>
            <div class="mt-4 text-[22px] font-bold text-[#1a1a1a]"><ion-icon name="layers-outline" class="mr-2 md hydrated" role="img"></ion-icon> Single turbine output equivalent to small coal plant.</div>
          </div>

          <!-- Column 3: Airborne Wind (Future Focus) -->
          <div class="col-span-1 bg-white p-6 border border-[#1a1a1a] shadow-lg">
            <h3 class="text-[32px] font-['Playfair Display'] font-bold text-[#6b463a] mb-4 border-b pb-2">High-Altitude Wind Energy (AWE)</h3>
            <div class="h-[350px] mb-4 border border-[#1a1a1a]/30">
              <img
                src="https://image.pollinations.ai/prompt/conceptual_diagram_of_airborne_wind_harnessing_system_kite_or_drone_connected_to_ground_station_minimalist_technical"
                alt="Airborne Wind System"
                class="w-full h-full object-cover"
              >
            </div>
            <p class="text-[24px] leading-relaxed">Harnessing the strong, consistent jet streams at 300m-1000m using tethered systems (kites or autonomous drones). AWE promises lower material usage and access to energy densities far greater than ground-level wind.</p>
            <div class="mt-4 text-[22px] font-bold text-[#1a1a1a]"><ion-icon name="arrow-up-circle-outline" class="mr-2 md hydrated" role="img"></ion-icon> Access to highly persistent, stable wind resources.</div>
          </div>
        </div>

        <!-- Footer Rule -->
        <div class="absolute bottom-[50px] left-[100px] w-[1720px] h-[1px] bg-[#1a1a1a]/30"></div>

        <!-- Footer: Chapter Title -->
        <div
          class="absolute bottom-[30px] right-[100px] text-[20px] font-['Lora'] text-[#1a1a1a]/70"
          id="el-912dc188-298f-41c4-9ac6-07a8f1180768"
          style="left: 1447.86px; top: 1027.69px; transform: translate(0px, 0px); width: 383px; height: 22px;"
        >Chapter 4: Expanding the Resource Base</div>
      </div>
    `,
  },
]
    },
  },
];
