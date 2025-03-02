import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_KEY");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupStorage() {
  try {
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) throw listError;

    // Setup processed bucket
    const processedBucketExists = buckets?.some(
      (bucket) => bucket.name === "processed"
    );
    if (!processedBucketExists) {
      const { error: createError } = await supabase.storage.createBucket(
        "processed",
        {
          public: true, // Allow public access to processed files
          allowedMimeTypes: ["audio/wav", "audio/x-wav"],
        }
      );

      if (createError) throw createError;
      console.log("✅ Created processed bucket successfully");
    } else {
      console.log("ℹ️ Processed bucket already exists");
    }
  } catch (error) {
    console.error("Error setting up storage:", error);
    process.exit(1);
  }
}

setupStorage();
