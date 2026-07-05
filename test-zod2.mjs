import { z } from 'zod';
const schema = z.object({ feed: z.number().optional() });
console.log('NaN:', schema.safeParse({ feed: NaN }).success);
console.log('undefined:', schema.safeParse({ feed: undefined }).success);
console.log('0:', schema.safeParse({ feed: 0 }).success);
