import { MetadataRoute } from "next";

const BASE_URL = "https://theausofficial.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL,                      lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/reviews`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/points-shop`,     lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/raffles`,         lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/bonus-hunt`,      lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/giveaways`,       lastModified: new Date(), changeFrequency: "daily",   priority: 0.7 },
  ];
}
