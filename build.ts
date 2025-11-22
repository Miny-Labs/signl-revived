import 'dotenv/config';
import { Template, defaultBuildLogger } from 'e2b';
import { template, alias } from './src/template'; // Updated path

async function main() {
  console.log(`🏗️  Building E2B Template: ${alias}...`);
  
  await Template.build(template, {
    alias: alias,
    onBuildLogs: defaultBuildLogger(),
  });

  console.log(`✅ Template "${alias}" ready.`);
}

main().catch(console.error);