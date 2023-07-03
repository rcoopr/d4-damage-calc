import { z } from 'zod';
import { isWornItem } from './utils';

export type Stats = z.infer<typeof statsSchema>;
export type Build = z.infer<typeof buildSchema>;
export type BuildStorage = z.infer<typeof buildStorageSchema>;

export const statsSchema = z.object({
  weaponDps: z.coerce
    .number()
    .min(0)
    .transform((n) => Math.max(0, n)),
  mainStat: z.coerce
    .number()
    .min(0)
    .transform((n) => Math.max(0, n)),
  additive: z.coerce
    .number()
    .min(0)
    .transform((n) => Math.max(0, n)),
  vulnerable: z.coerce
    .number()
    .min(0)
    .transform((n) => Math.max(0, n)),
  critDamage: z.coerce
    .number()
    .min(0)
    .transform((n) => Math.max(0, n)),
  critChance: z.coerce
    .number()
    .min(0)
    .transform((n) => Math.max(0, n)),
});

export const buildSchema = z.object({
  char: statsSchema,
  item1: statsSchema,
  item2: statsSchema,
  wornItem: z.string().transform((s) => (isWornItem(s) ? s : null)),
});

export const buildStorageSchema = z.record(z.string(), buildSchema);
