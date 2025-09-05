import { BaseWPSchema } from "@/types";

interface PageAPIOptions {
  includeEmbedded?: boolean;
  fields?: string[];
}

export const pageAPIResponse = async (
  endpoint: string, 
  options: PageAPIOptions = {}
) => {
  try {
    const urlAPI =
      process.env.WORDPRESS_API_URL || "http://localhost:8080/wp-json/wp/v2";
    
    let apiUrl = urlAPI + endpoint;
    
    // Agregar _embed si es necesario
    if (options.includeEmbedded) {
      apiUrl += (endpoint.includes('?') ? '&' : '?') + '_embed';
    }
    
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const resJSON = await res.json();
    
    if (!resJSON || resJSON.length === 0) {
      throw new Error(`No data found for endpoint: ${endpoint}`);
    }
    
    const data = BaseWPSchema.parse(resJSON[0]);
    const {
      acf: { subtitle },
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
      subtitle,
      thumbnail,
      large,
      medium_large,
      full: { url, width, height },
      content: rendered,
      rawData: data, // Por si necesitas acceso completo
    };
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};
