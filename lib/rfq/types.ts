import type { z } from "zod";
import type {
  RfqContactSchema,
  RfqLineItemSchema,
  RfqSubmissionSchema,
} from "./schema";

export type RfqLineItem = z.infer<typeof RfqLineItemSchema>;
export type RfqContact = z.infer<typeof RfqContactSchema>;
export type RfqSubmission = z.infer<typeof RfqSubmissionSchema>;
