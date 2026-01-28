

export function getPrompt(transcriptText) {
    return `You are an advanced knowledge analysis system acting like NotebookLM.

Input: A full video TRANSCRIPT as plain text.
(The video has already been converted into text. You do NOT need to access or watch the video.)

Task:
Analyze the provided transcript end-to-end and extract detailed, structured, presentation-ready notes that can be directly converted into an editable PowerPoint (PPT) using the Gemini Canvas API.

Instructions:
1. Read and understand the entire transcript carefully.
2. Identify the main topic and all subtopics discussed.
3. Split the content into logical sections, where each section represents EXACTLY ONE PPT slide.
4. Ignore filler speech, pauses, repeated phrases, greetings, jokes, and irrelevant conversation.
5. Infer slide boundaries based on topic transitions, explanations, or teaching flow.
6. For each section, generate:
   - A clear and concise slide title (infer if not explicitly stated)
   - Clean, meaningful bullet points suitable for slides
   - Detailed NotebookLM-style notes explaining the concept clearly and accurately
   - Speaker notes written as if presenting the slide to an audience
7. Include definitions, steps, formulas, examples, processes, or key explanations if present in the transcript.
8. Maintain correct logical flow, educational accuracy, and clarity.

CRITICAL JSON RULES (MUST FOLLOW):
- Output MUST be valid JSON
- Use ONLY double quotes (")
- Do NOT include markdown or code blocks
- Do NOT include line breaks inside string values
- Escape all internal quotes using backslash (\")
- Do NOT include trailing commas
- Validate JSON before responding

Output Format:
Return ONLY a valid JSON array in the following exact structure:

[
  {
    "slideIndex": 1,
    "title": "Slide title",
    "bulletPoints": [
      "Bullet point one",
      "Bullet point two",
      "Bullet point three"
    ],
    "detailedNotes": "Single-line NotebookLM-style explanation of this slide content.",
    "speakerNotes": "Single-line presenter notes explaining how to speak about this slide."
    "relatedImage": "Image URL for discribing the slide content."
  }
]

Rules:
- Output ONLY JSON
- Do NOT include any text outside the JSON array
- Each JSON object MUST represent exactly one PPT slide
- Ensure content is clean, structured, and reusable for PPT generation
- If the transcript contains no meaningful instructional content, return an empty array []

The JSON output will be sent directly to the Gemini Canvas API to generate an editable PPT.
TRANSCRIPT :
  ${transcriptText}
`
}