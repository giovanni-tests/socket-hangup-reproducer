import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createClient } from "@libsql/client";

const turso = createClient({
  url: "libsql://socket-hangup-reproducer-giovannibenussi.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTg3MjA4ODQsImlkIjoiMDY1YzAxZGYtZGNlNi00YTc5LTk3M2YtOTEwZDJkODAwZDk1In0.mXxszRlTkeTJ3gS9WEEIB1Xi-B04aGQcG3uu1UoT1mzB5P09jJ8XkPYDwBIgrnn4E541VB3HajAAhe52vfEHAg",
});

const app = new Hono();

app.get("/", async (c) => {
  const promises = [];
  for (let i = 0; i < 1000; i++) {
    promises.push(turso.execute("SELECT 1"));
  }

  return c.json({ data: await Promise.all(promises) });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
