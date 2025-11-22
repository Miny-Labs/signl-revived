import { serve } from '@hono/node-server';
import { Hono, Context, Next } from 'hono'; // Added Context and Next imports
import { cors } from 'hono/cors';
import { v4 as uuidv4 } from 'uuid';
import { executeWarRoom } from './agents'; // FIX: Changed import name
import { WarRoomMissionContext } from './types';
import { JobManager } from './cron/storage';
import { startScheduler } from './cron/scheduler';

// Define the environment variables for type safety
type Bindings = {
  Variables: {
    userId: string;
  };
};

// Initialize app with typed variables
const app = new Hono<Bindings>();

app.use('/*', cors());

startScheduler();

// Typed Middleware
const authMiddleware = async (c: Context<Bindings>, next: Next) => {
  const userId = c.req.header('X-User-ID') || 'default_user';
  c.set('userId', userId);
  await next();
};

app.get('/', (c: Context) => c.text('Signl Core API Online 🟢'));

app.post('/api/mission/trigger', async (c: Context) => {
  try {
    const body = await c.req.json() as WarRoomMissionContext;
    
    if (!body.identity?.email || !body.company?.name) {
      return c.json({ error: "Missing critical identity fields." }, 400);
    }

    const missionId = uuidv4();
    
    // FIX: Use the correct function name
    executeWarRoom(missionId, body).catch((e: any) => console.error(`Mission ${missionId} Failed:`, e)); 

    return c.json({ 
      success: true, 
      missionId, 
      message: "Signl deployed. Briefing arriving shortly." 
    });

  } catch (e) {
    return c.json({ error: `Server Error: ${e}` }, 500);
  }
});

// Explicitly type 'c' as Context<Bindings> for these routes
app.get('/api/jobs', authMiddleware, (c: Context<Bindings>) => {
  const userId = c.get('userId');
  const jobs = JobManager.listUserJobs(userId);
  return c.json({ jobs });
});

app.post('/api/jobs', authMiddleware, async (c: Context<Bindings>) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  
  if (!body.targetName || !body.templateId || !body.userEmail) {
    return c.json({ error: "Missing required job fields" }, 400);
  }

  const id = JobManager.createJob({
    ...body,
    userId,
    targetUrl: body.targetUrl || "https://google.com", 
    frequency: body.frequency || 'DAILY_MORNING'
  });

  return c.json({ success: true, jobId: id });
});

app.delete('/api/jobs/:id', authMiddleware, (c: Context<Bindings>) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  JobManager.deleteJob(id, userId);
  return c.json({ success: true });
});

const port = 4000;
console.log(`Server running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});