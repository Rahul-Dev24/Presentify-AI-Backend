// export function getPrompt(transcriptText) {
//   return `
// You are an advanced knowledge analysis system like NotebookLM.

// INPUT:
// Full video TRANSCRIPT as plain text.

// LANGUAGE:
// Auto-detect the transcript language. Always respond in clear, simple English.

// TASK:
// Convert the transcript into structured, presentation-ready content for an editable PPT using the Gemini Canvas API.

// RULES:
// - Read the full transcript
// - Identify main topic and subtopics
// - Split content into logical sections
// - EACH section = EXACTLY ONE slide
// - Ignore fillers (greetings, jokes, repetition, irrelevant talk)
// - Infer slide breaks from topic flow

// FOR EACH SLIDE:
// - Clear inferred title
// - Slide-friendly bullet points
// - Detailed explanation
// - Speaker notes
// - Include definitions, steps, formulas, examples if present

// JSON (STRICT):
// - Output ONLY a valid JSON array
// - Use ONLY double quotes (")
// - Escape quotes with \\\"
// - No markdown, no trailing commas, no extra text

// HTML:
// - "htmlContent" must be a single-line string
// - No real line breaks (use \\n if needed)
// - Use only: div, h1, h2, p, ul, li
// - Must be designMode editable

// SLIDES:
// - Rotate layouts: Hero, Bullets, Two-column, Grid/Cards, Quote, Step-by-step
// - Use ONE consistent theme across ALL slides
// - Modern AI look, Flexbox/Grid, vw-based fonts
// - Use standard PowerPoint Widescreen (16:9)

// SVG & ANIMATION:
// - 1–3 inline SVGs per slide
// - Include <style> with at least one @keyframes
// - Apply animation: 0.8s ease-out forwards

// OUTPUT FORMAT:
// [
//   {
//     "slideIndex": 1,
//     "title": "Internal Title",
//     "htmlContent": "<div><style>@keyframes fade{...}</style><svg>...</svg><h1>Title</h1><p>Content</p></div>",
//     "detailedNotes": "Explanation",
//     "speakerNotes": "Presenter script"
//   }
// ]

// TRANSCRIPT:
// ${transcriptText}
// `;
// }


export function getPrompt(transcriptText) {
   return `
You are an expert presentation designer, UI designer, and front-end developer.

Your task is to convert a raw dataset into visually stunning presentation slides.

INPUT DATA:
You will receive a JSON dataset containing slide_index, title and bullets.

The text may contain grammar errors and messy sentences.

INPUT:
You will receive a JSON dataset containing:
[
   {
      "slide_index": 1,
      "title": "WEB DEVELOPMENT",
      "bullets": [
         "JavaScript modern day web development possible.",
         "Next up we have constant next up we have bad just demand buy time initial forming stages.",
         "Modern day js flight or consp update so you shouldn't use bar that much Next data type js may total art data types primitive just may number string boolean undefined null big int or symbol or non primitive conditionals and loops programming languages JS maybe if else switch case else ladder for while do while etc syntax."
         ]
   }
]

Your job:
1. Fix grammar and wording.
2. Convert text into clear presentation bullet points.
3. Keep the original meaning.
4. Keep 2–4 bullets maximum per slide.

--------------------------------
SLIDE CANVAS REQUIREMENTS
--------------------------------

Each slide MUST fit inside a PowerPoint widescreen slide.

Exact size:
Width: 1280px
Height: 720px
Aspect ratio: 16:9

The root container MUST be:

<div class="slide">

CSS rules for root slide:

.slide{
box-sizing:border-box;
display:flex;
flex-direction:column;
justify-content:center;
overflow:hidden;
position:relative;
font-family:Inter,Arial,sans-serif;
}

--------------------------------
VISUAL DESIGN RULES
--------------------------------

Create a modern AI-tech style presentation.

Include:

• Gradient backgrounds
• Floating SVG shapes
• Subtle glow effects
• Modern typography
• Card style bullet sections
• Animated icons

Color palette example:
#0f172a
#1e293b
#3b82f6
#22c55e
#e2e8f0

Background should include animated gradients or floating shapes.

--------------------------------
LAYOUT VARIATION
--------------------------------

Rotate layouts between slides:

1. Hero layout
2. Left text + right visual
3. Two column layout
4. Card grid layout
5. Quote highlight
6. Step-by-step flow

--------------------------------
ANIMATION REQUIREMENTS
--------------------------------

Add subtle animations.

Include a <style> tag inside htmlContent with at least one keyframe.

Examples:

@keyframes fadeUp
@keyframes float
@keyframes glow
@keyframes slideIn

Animation duration:
0.6s – 1s ease-out

Elements should animate on load.

--------------------------------
SVG REQUIREMENTS
--------------------------------

Each slide must include 1–3 inline SVG icons related to the topic.

Examples:
• coding icons
• browser icons
• DOM nodes
• developer symbols

SVGs should also animate slightly (float / rotate / scale).

--------------------------------
HTML RESTRICTIONS
--------------------------------

Only use these tags:

div
h1
h2
p
ul
li
svg
style

NO external libraries.
NO images.
NO scripts.

Everything must be inline HTML + CSS + SVG.

--------------------------------
CONTENT STRUCTURE
--------------------------------

Each slide must contain:

Large title (h1)

Bullet list (ul/li)

Supporting SVG visuals

Decorative background elements

--------------------------------
OUTPUT FORMAT
--------------------------------

Return ONLY this JSON structure:

[
{
"slideIndex": 1,
"title": "Improved Title",
"htmlContent": "<div class=\\"slide\\">FULL HTML + CSS + SVG</div>",
"detailedNotes": "Detailed explanation of the slide topic in 4-6 sentences.",
"speakerNotes": "Short script the presenter can say while presenting this slide."
}
]

--------------------------------
STRICT OUTPUT RULES
--------------------------------

• Output ONLY valid JSON
• Do NOT include markdown
• Do NOT add explanations
• Use ONLY double quotes
• Escape quotes like \\\"
• htmlContent must be ONE LINE string
• Do NOT add line breaks
• Maintain slide order

--------------------------------
CONTENT RULES
--------------------------------

• Read the full transcript
• Identify main topics
• Split logically into slides
• Ignore filler words
• Each logical topic = one slide

--------------------------------
IMPORTANT
--------------------------------

Design must look like a modern tech conference presentation (Apple / Stripe / Vercel style).

Slides must look visually rich with gradients, floating SVG shapes and subtle animation.

--------------------------------

Here is the dataset:

${JSON.stringify(transcriptText, null, 2)}

`;
}