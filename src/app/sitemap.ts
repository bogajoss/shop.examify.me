import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shop.examify.me';

  // Fetch all live courses for sitemap
  const { data: courses } = await supabase
    .from('batches')
    .select('id, updated_at')
    .eq('status', 'live');

  const courseUrls = (courses || []).map((course) => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: course.updated_at || new Error().toISOString(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...courseUrls,
  ];
}
