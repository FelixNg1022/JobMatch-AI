import { ZypherAgent, runAgentInTerminal } from "@corespeed/zypher";

const agent = new ZypherAgent({
  name: "JobSearchAgent",
  systemPrompt:
    "You are an AI agent that helps the user explore software engineering jobs, summarize roles, generate tailored resume bullets, and suggest next actions.",
});

// If no model provider is configured (OPENAI_API_KEY / ANTHROPIC_API_KEY), run a simple mock CLI
const openAIKey = Deno.env.get("OPENAI_API_KEY");
const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
const model = Deno.env.get("DEFAULT_MODEL") || (openAIKey ? "openai/gpt-4o-mini" : anthropicKey ? "anthropic/claude-2" : "mock");

async function run() {
  if (model === "mock") {
    // Minimal mock mode that doesn't require external APIs — useful for local development
    const input = prompt("Ask your Job Search Agent: ");
    console.log("\n🤖 Job Search Agent:");
    if (!input) {
      console.log("(mock) No input provided — try with 'show me entry-level jobs in Vancouver'.");
      return;
    }

    // Basic mock response using heuristics
    console.log(`(mock) For: ${input}`);
    console.log("- Job search suggestions: Junior Software Engineer, Software Engineer I, QA Engineer (entry-level)");
    console.log("- Where to search: LinkedIn, Indeed, Glassdoor, WorkBC");
    console.log("- Example resume bullet: 'Built a React-based feature used by X users; improved load time by Y%'");
    return;
  }

  // Interactive real-mode: run full Zypher CLI
  await runAgentInTerminal(agent, model);
}

await run();
 
