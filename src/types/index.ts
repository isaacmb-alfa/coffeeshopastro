import { z } from "astro:content";

const imageSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});
const featureImagesSchema = z.object({
  thumbnail: imageSchema,
  medium: imageSchema,
  medium_large: imageSchema,
  large: imageSchema,
  full: imageSchema,
});
export const BaseWPSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({
    rendered: z.string(),
  }),
  content: z.object({
    rendered: z.string(),
  }),
  feature_images: featureImagesSchema,
  acf: z.object({
    subtitle: z.string(),
  }),
});

const processItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
});

export const ProcessPageSchema = BaseWPSchema.extend({
  acf: z.object({
    subtitle: z.string(),
    process: z.array(processItemSchema), // Array de procesos en el campo "process"
  }),
});

const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  link: z.string(),
});

const CategorysSchema = z.array(CategorySchema);

export const BlogSchemaPost = BaseWPSchema.omit({
  acf: true,
}).extend({
  date: z.string(),
  category_details: CategorysSchema
});



export const BlogsSchemaPosts = z.array(BlogSchemaPost);

export type Post = z.infer<typeof BlogSchemaPost>;
