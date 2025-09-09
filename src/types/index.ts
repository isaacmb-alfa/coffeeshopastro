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

const gallerySchema = z.object({
    id: z.number(),
    large: imageSchema,
    full: imageSchema,
});

export const GalleryPageSchema = BaseWPSchema.extend({
  gallery: z.array(gallerySchema), // Array de galería en el campo "gallery"
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

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  link: z.string(),
});

export const CategoriesSlugSchema = z.array(CategorySchema.pick({
  slug: true,
}));

const CategoriesSchema = z.array(CategorySchema);

export const BlogSchemaPost = BaseWPSchema.omit({
  acf: true,
}).extend({
  date: z.string(),
  category_details: CategoriesSchema
});

export const MenuItemSchema = z.object({
  id: z.number(),
  title: z.object({
    rendered: z.string()
  }),
  feature_images: z.object({
    thumbnail: z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
    }),
    medium: z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
    }),
    medium_large: z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
    }),
    large: z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
    }),
    full: z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
    }),
  }),
  acf: z.object({
    description: z.string(),
    price: z.string(), 
  })
})

// Tipo específico para el item de menú procesado
export const MenuItemTransformed = z.object({
  id: z.number(),
  title: z.string(),
  medium: z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  full: z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  acf: z.object({
    description: z.string(),
    price: z.coerce.number(),
  })
});

export type MenuItemType = z.infer<typeof MenuItemTransformed>;

// Tipo simplificado para la respuesta del menú
export const MenuResponseSchema = z.object({
  items: z.array(MenuItemTransformed)
})

export type MenuResponse = z.infer<typeof MenuResponseSchema>;

export const BlogsSchemaPosts = z.array(BlogSchemaPost);

export type Post = z.infer<typeof BlogSchemaPost>;

export type FeatureImages = z.infer<typeof featureImagesSchema>;

// En types/index.ts, cambiar Gallery a:
export type Gallery = Array<{
  id: number;
  large: {
    url: string;
    width: number;
    height: number;
  };
  full: {
    url: string;
    width: number;
    height: number;
  };
}>;
