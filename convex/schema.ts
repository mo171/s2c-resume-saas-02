import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import {v} from "convex/values";



const schema = defineSchema({
  ...authTables,
  // Your other tables will go here later

  subscriptions: defineTable({
    userId: v.id("users"),
    polarCustomerId: v.string(),
    polarSubscriptionId: v.string(),
    productId: v.optional(v.string()), // Optional field to store the product ID from Polar, if needed
    priceId: v.optional(v.string()), // Optional field to store the price ID from Polar, if needed
    planCode: v.optional(v.string()), // Optional field to store the plan code from Polar, if needed
    status: v.string(), // e.g., "active", "canceled", "past_due", etc.
    currentPeriodEnd: v.optional(v.number()), // Timestamp for when the current billing period ends
    trailEndsAt: v.optional(v.number()), // Timestamp for when the trial period ends, if applicable
    cancelAt: v.optional(v.number()), // Timestamp for when the subscription is set to cancel, if applicable
    canceledAt: v.optional(v.number()), // Timestamp for when the subscription was canceled, if applicable
    seats: v.optional(v.number()), // Optional field to store the number of seats if it's a team subscription
    metadata:  v.optional(v.any()), // Optional field to store any additional metadata from Polar related to the subscription
    creditsBalance: v.number(), // Field to track the user's current credits balance, updated based on subscription status and usage
    creditsGrantPerPeriod: v.number(), // Field to define how many credits are granted per billing period based on the subscription plan
    creditsRolloverLimit:  v.number(),
    lastGrantCursor: v.optional(v.number()), // Timestamp to track the last time credits were granted, used for calculating pro-rata grants and rollovers
  }).index("by_userId", ["userId"])
    .index("by_polarSubscriptionId", ["polarSubscriptionId"])
    .index("by_status", ["status"]),
  
  projects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    styleGuide: v.optional(v.string()),
    sketchData:  v.any(), // Store the raw Sketch data as JSON into redux shape mapping
    viewportData: v.any(), // Store the viewport data (zoom, pan) as JSON
    generateDesignData: v.any(), // Store the generated design data (e.g., Figma JSON) as JSON
    thumbnail: v.optional(v.string()), // Store the thumbnail as a base64 string or URL
    moodBoardImages: v.array(v.string()), // Store mood board images as an array of base64 strings or URLs
    inspirationImages: v.optional(v.array(v.string())),
    lastModified: v.number(), // Timestamp for sorting and versioning
    createdAt: v.number(), // Timestamp for record creation
    isPublic: v.optional(v.boolean()), // Optional field to indicate if the project is public or private
    tags: v.optional(v.array(v.string())), // Optional field to store tags for the project
    projectNumber: v.number(), // Sequential project number for the user

  }),


  project_counter: defineTable({
    userId: v.id("users"),
    nextProjectNumber: v.number(),
  }).index("by_userId",["userId"]),

  credits_ledger: defineTable({
    userId: v.id("users"),
    subscriptionId: v.id("subscriptions"),
    amount: v.number(),
    type: v.string(), // e.g., "credit" or "debit"
    reason: v.optional(v.string()), // Optional field to describe the reason for the credit/debit
    idempotencyKey: v.string(), // Unique key to prevent duplicate entries for the same transaction
    meta: v.optional(v.any()), // Optional field to store any additional metadata related to the transaction
  })
    .index("by_subscriptionId", ["subscriptionId"])
    .index("by_userId", ["userId"])
    .index("by_idempotencyKey", ["idempotencyKey"])
});

export default schema;