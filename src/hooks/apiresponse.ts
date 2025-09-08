import {
  BaseWPSchema,
  ProcessPageSchema,
  BlogsSchemaPosts,
  CategorySchema,
  GalleryPageSchema,
} from "@/types";

interface ImageData {
  url: string;
  width: number;
  height: number;
}

interface BasePageResponse {
  title: string;
  slug: string;
  subtitle: string;
  thumbnail: ImageData;
  large: ImageData;
  medium_large: ImageData;
  full: ImageData;
  content: string;
  acf: {
    subtitle: string;
  };
}

interface GalleryPageResponse extends BasePageResponse {
  gallery: Array<{
    id: number;
    large: ImageData;
    full: ImageData;
  }>;
}

interface ProcessPageResponse extends BasePageResponse {
  acf: {
    subtitle: string;
    process: Array<{
      title: string;
      description: string;
      image: string;
    }>;
  };
}

interface Categorys {
  id: number;
  name: string;
  slug: string;
  link: string;
}

interface BlogPostResponse {
  id: number;
  slug: string;
  title: string;
  content: string;
  thumbnail: ImageData;
  large: ImageData;
  medium_large: ImageData;
  full: ImageData;
  date: string;
  category_details: Categorys[]; // Array de categorías, no un objeto único
}

type BlogResponse = BlogPostResponse[];

// Function overloads properly typed
export async function pageAPIResponse(
  endpoint: string,
  schemaType: "base"
): Promise<BasePageResponse>;
export async function pageAPIResponse(
  endpoint: string,
  schemaType: "process"
): Promise<ProcessPageResponse>;
export async function pageAPIResponse(
  endpoint: string,
  schemaType: "blogs"
): Promise<BlogResponse>;
export async function pageAPIResponse(
  endpoint: string,
  schemaType: "categories"
): Promise<Categorys>;
export async function pageAPIResponse(
  endpoint: string,
  schemaType: "galeria"
): Promise<GalleryPageResponse>;
export async function pageAPIResponse(
  endpoint: string,
  schemaType: "base" | "process" | "categories" | "galeria" | "blogs" = "base"
): Promise<
  | BasePageResponse
  | ProcessPageResponse
  | BlogResponse
  | Categorys
  | GalleryPageResponse
> {
  try {
    const urlAPI =
      process.env.WORDPRESS_API_URL || "http://localhost:8080/wp-json/wp/v2";

    const res = await fetch(urlAPI + endpoint);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const resJSON = await res.json();

    if (!resJSON || resJSON.length === 0) {
      // Error más específico para el usuario final
      throw new Error(
        `POST_NOT_FOUND: No data found for endpoint: ${endpoint}`
      );
    }

    // Validación adicional del schemaType
    if (
      !["base", "process", "blogs", "categories", "galeria"].includes(
        schemaType
      )
    ) {
      throw new Error(
        `Invalid schema type: ${schemaType}. Must be 'base', 'process', 'blogs', or 'categories' or 'galeria'`
      );
    }

    switch (schemaType) {
      case "base":
      case "process":
        const data =
          schemaType === "base"
            ? BaseWPSchema.parse(resJSON[0])
            : ProcessPageSchema.parse(resJSON[0]);

        const {
          acf,
          slug,
          title: { rendered: title },
          content: { rendered },

          feature_images: { thumbnail, large, medium_large, full },
        } = data;

        return {
          title,
          slug,
          subtitle: acf.subtitle,
          thumbnail,
          large,
          medium_large,
          full,
          content: rendered,
          acf,
        } as BasePageResponse;

      case "blogs":
        const blogData = BlogsSchemaPosts.safeParse(resJSON);
        if (!blogData.success) {
          // Aquí puedes manejar el error de validación
          throw new Error("Invalid blog data format");
        }
        return blogData.data.map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title.rendered,
          content: post.content.rendered,
          thumbnail: post.feature_images.thumbnail,
          large: post.feature_images.large,
          medium_large: post.feature_images.medium_large,
          full: post.feature_images.full,
          date: post.date,
          category_details: post.category_details,
        })) as BlogResponse;

      case "galeria":
        const galleryData = GalleryPageSchema.parse(resJSON[0]);

        const {
          acf: galleryAcf,
          slug: gallerySlug,
          title: { rendered: galleryTitle },
          content: { rendered: galleryContent },
          feature_images: {
            thumbnail: galleryThumbnail,
            large: galleryLarge,
            medium_large: galleryMediumLarge,
            full: galleryFull,
          },
          gallery,
        } = galleryData;

        return {
          title: galleryTitle,
          slug: gallerySlug,
          subtitle: galleryAcf.subtitle,
          thumbnail: galleryThumbnail,
          large: galleryLarge,
          medium_large: galleryMediumLarge,
          full: galleryFull,
          content: galleryContent,
          acf: galleryAcf,
          gallery,
        } as GalleryPageResponse;

      default:
        // Este caso no debería ocurrir ahora con la validación
        throw new Error(`Unknown schema type: ${schemaType}`);
    }
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
}

// Helper functions properly typed
export const getBasePage = (slug: string) =>
  pageAPIResponse(`/pages?slug=${slug}&_embed`, "base");

export const getProcessPage = (slug: string) =>
  pageAPIResponse(`/pages?slug=${slug}&_embed`, "process");

export const getBlogPosts = (limit?: number) => {
  const limitParam = limit ? `&per_page=${limit}` : "";
  return pageAPIResponse(`/posts?_embed${limitParam}`, "blogs");
};
export const getBlogPostBySlug = (slug: string) => {
  return pageAPIResponse(`/posts?slug=${slug}&_embed`, "blogs");
};

export const getCategoryBySlug = (slug: string) => {
  return pageAPIResponse(`/categories?slug=${slug}`, "categories");
};

export const getGalleryPage = (slug: string) => {
  return pageAPIResponse(`/pages?slug=${slug}&_embed`, "galeria");
};
