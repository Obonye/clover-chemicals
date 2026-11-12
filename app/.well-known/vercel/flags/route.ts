import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";

import * as flags from "@/flags";

// Lets the Vercel Toolbar's Flags Explorer see the code-defined flags, so a
// team member can override `product-catalog` for themselves in production.
// The endpoint checks the request against FLAGS_SECRET.
export const GET = createFlagsDiscoveryEndpoint(async () => getProviderData(flags));
