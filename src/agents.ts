import 'dotenv/config';
import { Groq } from 'groq-sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Sandbox } from 'e2b';
import { WarRoomMissionContext } from './types';
import { generateMissionMandate } from './mandate';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- HELPER: xAI TOOL ---
async function searchSocial(query: string) {
  console.log(`   [WORKER] 🐦 XAI Query: "${query}"`);
  try {
    const res = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-fast",
        input: [{ role: "user", content: `Analyze sentiment/discussions: ${query}` }],
        tools: [{ type: "x_search" }]
      })
    });
    const data = await res.json();
    // @ts-ignore
    const txt = data.output?.[0]?.content?.[0]?.text;
    console.log(`   [WORKER] 🐦 Result: ${txt?.substring(0, 100)}...`);
    return txt || "No signal found.";
  } catch (e) { return `xAI Error: ${e}`; }
}

export async function executeWarRoom(missionId: string, context: WarRoomMissionContext) {
  console.log(`\n======================================================`);
  console.log(`[MISSION START] ${missionId}`);
  console.log(`======================================================`);

  console.log("🔌 Booting Sandbox...");
  const sbx = await Sandbox.create('signl-v1', {
    mcp: {
      exa: { apiKey: process.env.EXA_API_KEY! },
      perplexityAsk: { perplexityApiKey: process.env.PERPLEXITY_API_KEY! },
      resend: { 
        apiKey: process.env.RESEND_API_KEY!,
        sender: process.env.SENDER_EMAIL || "onboarding@resend.dev", 
        replyTo: context.identity.email
      }
    }
  });

  const client = new Client({ name: 'Signl-Director', version: '2.0.0' }, { capabilities: {} });
  await client.connect(new StreamableHTTPClientTransport(
    new URL(sbx.getMcpUrl()), 
    { requestInit: { headers: { 'Authorization': `Bearer ${await sbx.getMcpToken()}` } } }
  ));

  // --- CRITICAL FIX: TOOL SANITIZATION ---
  const mcpToolsRaw = await client.listTools();
  
  const allowedMcpTools = mcpToolsRaw.tools
    .filter(t => t.name !== 'perplexity_ask') 
    .map(t => {
      // IF IT IS THE EMAIL TOOL, STRIP THE OPTIONAL PARAMS
      // This prevents the LLM from asking "Do you want to BCC anyone?"
      if (t.name.includes('send-email') || t.name.includes('send_email')) {
        // Create a deep copy of the schema to modify it
        const cleanSchema = JSON.parse(JSON.stringify(t.inputSchema));
        
        if (cleanSchema.properties) {
            delete cleanSchema.properties.bcc;
            delete cleanSchema.properties.cc;
            delete cleanSchema.properties.scheduledAt;
        }
        
        return {
            type: 'function' as const,
            function: {
                name: t.name,
                // Forceful description
                description: "SEND THE EMAIL IMMEDIATELY. Required: to, subject, html.",
                parameters: cleanSchema
            }
        };
      }
      
      return {
        type: 'function' as const,
        function: { name: t.name, description: t.description, parameters: t.inputSchema }
      };
    });

  const tools = [
    ...allowedMcpTools,
    {
      type: 'function' as const,
      function: {
        name: 'analyze_social_sentiment',
        description: 'Use xAI (Grok) to find real-time user complaints on X/Twitter.',
        parameters: { type: 'object', properties: { topic: { type: 'string' } }, required: ['topic'] }
      }
    }
  ];

  // --- EXECUTION ---
  const strategicMandate = generateMissionMandate(context);
  const messages: any[] = [
    { role: 'system', content: strategicMandate },
    { role: 'user', content: `Begin analysis. Target: ${context.targets.competitorNames.join(", ")}` }
  ];

  let step = 0;
  let missionComplete = false;

  while (!missionComplete && step < 20) { 
    step++;
    console.log(`\n[STEP ${step}] 🤔 Thinking...`);

    try {
      const response = await groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: messages,
        tools: tools,
        tool_choice: 'auto'
      });

      const msg = response.choices[0].message;
      messages.push(msg);

      if (msg.tool_calls && msg.tool_calls.length > 0) {
        console.log(`[STEP ${step}] 🛠️  Calling ${msg.tool_calls.length} tools:`);
        
        for (const toolCall of msg.tool_calls) {
          let result = "";
          const args = JSON.parse(toolCall.function.arguments);
          console.log(`   > Tool: ${toolCall.function.name}`);

          // EXIT CONDITION
          if (toolCall.function.name.includes('send-email') || toolCall.function.name.includes('send_email')) {
             console.log(`   💌 AGENT TRIGGERED EMAIL SEND.`);
             missionComplete = true;
          }

          if (toolCall.function.name === 'analyze_social_sentiment') {
            result = await searchSocial(args.topic);
          } else {
            try {
              const mcpRes = await client.callTool({
                name: toolCall.function.name,
                arguments: args
              });
              result = JSON.stringify(mcpRes);
            } catch (e) { 
                result = `Error: ${e}`; 
                console.error(`     ❌ Tool Error: ${e}`);
            }
          }

          console.log(`     ✅ Result: ${result.substring(0, 60)}...`);
          if (result.length > 8000) result = result.substring(0, 8000) + "...[truncated]";
          messages.push({ role: 'tool', tool_call_id: toolCall.id, content: result });
        }
      } else {
        console.log(`[STEP ${step}] 🗣️  Agent says: "${msg.content?.substring(0, 100)}..."`);
      }

    } catch (err) {
      console.error(`[STEP ${step}] 💥 Error:`, err);
      break;
    }
  }

  await sbx.kill();
  console.log(`\n======================================================`);
  console.log(`[MISSION END] Final Status: ${missionComplete ? "SUCCESS" : "TIMEOUT/FAIL"}`);
  console.log(`======================================================`);
}