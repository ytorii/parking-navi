export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function geocode(query: string): Promise<GeocodingResult> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
    countrycodes: 'jp',
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      'Accept-Language': 'ja',
      'User-Agent': 'parking-navi/1.0',
    },
  });

  if (!res.ok) {
    throw new Error(`Nominatim request failed: ${res.status}`);
  }

  const data: NominatimResult[] = await res.json();

  if (data.length === 0) {
    throw new Error(`「${query}」の住所が見つかりませんでした`);
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}
