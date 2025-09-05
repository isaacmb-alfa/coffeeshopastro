import { BaseWPSchema, ProcessPageSchema } from "@/types";

export const pageAPIResponse = async (endpoint: string, schemaType: 'base' | 'process' = 'base') => {
  try {
    const urlAPI =
      process.env.WORDPRESS_API_URL || "http://localhost:8080/wp-json/wp/v2";
    
    const res = await fetch(urlAPI + endpoint);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const resJSON = await res.json();
    
    if (!resJSON || resJSON.length === 0) {
      throw new Error(`No data found for endpoint: ${endpoint}`);
    }
    
    // Usar el schema según el tipo
    const data = schemaType === 'base' 
      ? BaseWPSchema.parse(resJSON[0])
      : ProcessPageSchema.parse(resJSON[0]);
    
    const {
      acf,
      title: { rendered: title },
      content: { rendered },
      feature_images: {
        thumbnail,
        large,
        medium_large,
        full: { url, width, height },
      },
    } = data;

    return {
      title,
      subtitle: acf.subtitle,
      thumbnail,
      large,
      medium_large,
      full: { url, width, height },
      content: rendered,
      acf, // ACF completo para acceder a campos adicionales
    };
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Helper functions simples
export const getPageBySlug = (slug: string, schemaType: 'base' | 'process' = 'base') => 
  pageAPIResponse(`/pages?slug=${slug}&_embed`, schemaType);
