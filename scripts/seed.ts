/**
 * Seed script for ORTHOSTEP database
 * 
 * Usage:
 * npx ts-node scripts/seed.ts
 * 
 * Make sure to set these environment variables before running:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false }
});

async function seedProducts() {
  console.log("📦 Seeding products...");
  
  const productsPath = path.join(__dirname, "../data/products.json");
  const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  const { error } = await supabase
    .from("products")
    .insert(productsData);

  if (error) {
    console.error("❌ Error seeding products:", error.message);
  } else {
    console.log(`✅ Seeded ${productsData.length} products`);
  }
}

async function seedDeliveryZones() {
  console.log("🚚 Seeding delivery zones...");
  
  const deliveryPath = path.join(__dirname, "../data/algeria-delivery.json");
  const deliveryData = JSON.parse(fs.readFileSync(deliveryPath, "utf-8"));

  const { error } = await supabase
    .from("delivery_zones")
    .insert(deliveryData);

  if (error) {
    console.error("❌ Error seeding delivery zones:", error.message);
  } else {
    console.log(`✅ Seeded ${deliveryData.length} delivery zones`);
  }
}

async function main() {
  console.log("\n🌱 Starting database seed...\n");
  
  try {
    await seedProducts();
    await seedDeliveryZones();
    
    console.log("\n✨ Database seeding complete!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
