import 'dotenv/config';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Sandbox } from 'e2b';

async function testEmailSystem() {
  console.log("📧 STARTING EMAIL SYSTEM CHECK...");
  console.log(`   Sender: ${process.env.SENDER_EMAIL || 'onboarding@resend.dev'}`);
  console.log(`   API Key: ${process.env.RESEND_API_KEY ? 'Loaded' : 'MISSING'}`);

  // 1. Boot Sandbox
  const sbx = await Sandbox.create('signl-v1', {
    mcp: {
      resend: { 
        apiKey: process.env.RESEND_API_KEY!,
        sender: process.env.SENDER_EMAIL || "onboarding@resend.dev",
        replyTo: "test@greep.ai"
      }
    }
  });

  console.log("   ✅ Sandbox Booted. Connecting to MCP...");

  // 2. Connect Client
  const client = new Client({ name: 'Email-Tester', version: '1.0.0' }, { capabilities: {} });
  await client.connect(new StreamableHTTPClientTransport(
    new URL(sbx.getMcpUrl()), 
    { requestInit: { headers: { 'Authorization': `Bearer ${await sbx.getMcpToken()}` } } }
  ));

  // 3. List Tools (To verify the tool name)
  const tools = await client.listTools();
  const emailTool = tools.tools.find(t => t.name.includes('send-email') || t.name.includes('send_email'));

  if (!emailTool) {
    console.error("   ❌ CRITICAL ERROR: 'send-email' tool not found in sandbox.");
    console.log("   Available tools:", tools.tools.map(t => t.name).join(', '));
    await sbx.kill();
    return;
  }

  console.log(`   ✅ Found Tool: ${emailTool.name}`);

  // 4. Fire Email
  console.log("   🚀 Attempting to send test email...");
  
  try {
    const result = await client.callTool({
      name: emailTool.name,
      arguments: {
        to: "thatspacebiker@gmail.com", // Your target email
        subject: "Signl System Check: ✅ Operational",
        html: "<h1>System Status: Online</h1><p>If you are reading this, the Resend MCP integration is working perfectly.</p>",
        text: "System Status: Online. The Resend MCP integration is working."
      }
    });

    console.log("\n   🎉 SUCCESS! Result from Resend:");
    console.log(JSON.stringify(result, null, 2));

  } catch (e: any) {
    console.error("\n   ❌ SEND FAILED:");
    console.error(e);
  }

  await sbx.kill();
}

testEmailSystem();