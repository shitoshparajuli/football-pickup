import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

// export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  status: statusEnum('status').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  availableAt: timestamp('available_at').notNull()
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {

  const constantProducts: SelectProduct[] = [
    {
      id: 1,
      imageUrl: '',
      name: 'Product 1',
      status: 'active',
      price: 19.99,
      stock: 100,
      availableAt: new Date('2023-01-01T00:00:00Z'),
    },
    {
      id: 2,
      imageUrl: '',
      name: 'Product 2',
      status: 'inactive',
      price: 29.99,
      stock: 50,
      availableAt: new Date('2023-02-01T00:00:00Z'),
    }
  ];

  // Always search the full table, not per page
  // if (search) {
  //   return {
  //     products: await db
  //       .select()
  //       .from(products)
  //       .where(ilike(products.name, `%${search}%`))
  //       .limit(1000),
  //     newOffset: null,
  //     totalProducts: 0
  //   };
  // }

  // if (offset === null) {
  //   return { products: [], newOffset: null, totalProducts: 0 };
  // }

  // let totalProducts = await db.select({ count: count() }).from(products);
  // let moreProducts = await db.select().from(products).limit(5).offset(offset);
  // let newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: constantProducts,
    newOffset: null,
    totalProducts: 2
  };
}

export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}
