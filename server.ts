import { ZypherAgent } from "@corespeed/zypher";

const agent = new ZypherAgent({
  name: "JobSearchAgentGUI",
  systemPrompt: "You are an AI job search assistant who helps users analyze job postings, generate insights, and support job applications.",
});

Deno.serve(async (req) => {
  if (req.method === "POST") {
    const { message } = await req.json();

    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!openAIKey && !anthropicKey) {
      return new Response(JSON.stringify({ reply: "(mock) No model provider configured. Try 'show me entry-level jobs in Vancouver'" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = Deno.env.get("DEFAULT_MODEL") || (openAIKey ? "openai/gpt-4o-mini" : "anthropic/claude-2");

    try {
      const observable = agent.runTask(message, model);
      const replyParts: string[] = [];

      await new Promise<void>((resolve, reject) => {
        const sub = observable.subscribe({
          next: (ev) => {
            try {
              if (!ev) return;
              // Most events include a `message` property with `text`
              if (ev.message && typeof ev.message.text === "string") {
                replyParts.push(ev.message.text);
              }
            } catch (e) {
              console.error("Error processing event:", e);
            }
          },
          error: (err) => {
            sub.unsubscribe();
            reject(err);
          },
          complete: () => {
            sub.unsubscribe();
            resolve();
          },
        });
      });

      const reply = replyParts.join("").trim() || "(no reply)";
      return new Response(JSON.stringify({ reply }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("runTask error:", err);
      return new Response(JSON.stringify({ reply: `(error) ${err?.message ?? String(err)}` }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(await Deno.readTextFile("index.html"), {
    headers: { "Content-Type": "text/html" },
  });
});
