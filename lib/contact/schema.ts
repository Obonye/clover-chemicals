import { z } from "zod";

import { enquiryTypeIds } from "@/config/enquiry-routing";
import { identityShape } from "@/lib/forms/identity";

export const ContactSchema = z.object({
  // Name, company, email and phone: the same rules as the RFQ (CI-85).
  ...identityShape,
  /** One of config/enquiry-routing.ts `enquiryTypes`. Decides who receives it. */
  enquiryType: z.enum(enquiryTypeIds, "Choose the nature of your enquiry"),
  message: z.string().trim().min(5).max(4000),
});

export type ContactMessage = z.infer<typeof ContactSchema>;
