import type { z } from "zod";
import type {
  RfqCategoryLineSchema,
  RfqContactSchema,
  RfqLineItemSchema,
  RfqProductLineSchema,
  RfqSubmissionSchema,
} from "./schema";

export type RfqProductLine = z.infer<typeof RfqProductLineSchema>;
export type RfqCategoryLine = z.infer<typeof RfqCategoryLineSchema>;
export type RfqLineItem = z.infer<typeof RfqLineItemSchema>;

export const isProductLine = (line: RfqLineItem): line is RfqProductLine => line.type === "product";
export const isCategoryLine = (line: RfqLineItem): line is RfqCategoryLine => line.type === "category";
export type RfqContact = z.infer<typeof RfqContactSchema>;
export type RfqSubmission = z.infer<typeof RfqSubmissionSchema>;
