export type Place = {
  id: string;
  label: string;
  country: string;
  latitude: number;
  longitude: number;
  timeZone: string;
};

const rawPlaces: Array<[string, string, string, number, number, string]> = [
  ["kolkata", "Kolkata, West Bengal", "India", 22.5726, 88.3639, "Asia/Kolkata"],
  ["delhi", "New Delhi, Delhi", "India", 28.6139, 77.209, "Asia/Kolkata"],
  ["mumbai", "Mumbai, Maharashtra", "India", 19.076, 72.8777, "Asia/Kolkata"],
  ["bengaluru", "Bengaluru, Karnataka", "India", 12.9716, 77.5946, "Asia/Kolkata"],
  ["chennai", "Chennai, Tamil Nadu", "India", 13.0827, 80.2707, "Asia/Kolkata"],
  ["hyderabad", "Hyderabad, Telangana", "India", 17.385, 78.4867, "Asia/Kolkata"],
  ["pune", "Pune, Maharashtra", "India", 18.5204, 73.8567, "Asia/Kolkata"],
  ["ahmedabad", "Ahmedabad, Gujarat", "India", 23.0225, 72.5714, "Asia/Kolkata"],
  ["jaipur", "Jaipur, Rajasthan", "India", 26.9124, 75.7873, "Asia/Kolkata"],
  ["lucknow", "Lucknow, Uttar Pradesh", "India", 26.8467, 80.9462, "Asia/Kolkata"],
  ["varanasi", "Varanasi, Uttar Pradesh", "India", 25.3176, 82.9739, "Asia/Kolkata"],
  ["patna", "Patna, Bihar", "India", 25.5941, 85.1376, "Asia/Kolkata"],
  ["bhubaneswar", "Bhubaneswar, Odisha", "India", 20.2961, 85.8245, "Asia/Kolkata"],
  ["guwahati", "Guwahati, Assam", "India", 26.1445, 91.7362, "Asia/Kolkata"],
  ["chandigarh", "Chandigarh", "India", 30.7333, 76.7794, "Asia/Kolkata"],
  ["dehradun", "Dehradun, Uttarakhand", "India", 30.3165, 78.0322, "Asia/Kolkata"],
  ["shimla", "Shimla, Himachal Pradesh", "India", 31.1048, 77.1734, "Asia/Kolkata"],
  ["srinagar", "Srinagar, Jammu & Kashmir", "India", 34.0837, 74.7973, "Asia/Kolkata"],
  ["indore", "Indore, Madhya Pradesh", "India", 22.7196, 75.8577, "Asia/Kolkata"],
  ["bhopal", "Bhopal, Madhya Pradesh", "India", 23.2599, 77.4126, "Asia/Kolkata"],
  ["raipur", "Raipur, Chhattisgarh", "India", 21.2514, 81.6296, "Asia/Kolkata"],
  ["nagpur", "Nagpur, Maharashtra", "India", 21.1458, 79.0882, "Asia/Kolkata"],
  ["surat", "Surat, Gujarat", "India", 21.1702, 72.8311, "Asia/Kolkata"],
  ["kochi", "Kochi, Kerala", "India", 9.9312, 76.2673, "Asia/Kolkata"],
  ["thiruvananthapuram", "Thiruvananthapuram, Kerala", "India", 8.5241, 76.9366, "Asia/Kolkata"],
  ["coimbatore", "Coimbatore, Tamil Nadu", "India", 11.0168, 76.9558, "Asia/Kolkata"],
  ["madurai", "Madurai, Tamil Nadu", "India", 9.9252, 78.1198, "Asia/Kolkata"],
  ["visakhapatnam", "Visakhapatnam, Andhra Pradesh", "India", 17.6868, 83.2185, "Asia/Kolkata"],
  ["panaji", "Panaji, Goa", "India", 15.4909, 73.8278, "Asia/Kolkata"],
  ["ranchi", "Ranchi, Jharkhand", "India", 23.3441, 85.3096, "Asia/Kolkata"],
  ["amritsar", "Amritsar, Punjab", "India", 31.634, 74.8723, "Asia/Kolkata"],
  ["jodhpur", "Jodhpur, Rajasthan", "India", 26.2389, 73.0243, "Asia/Kolkata"],
  ["mysuru", "Mysuru, Karnataka", "India", 12.2958, 76.6394, "Asia/Kolkata"],
  ["puducherry", "Puducherry", "India", 11.9416, 79.8083, "Asia/Kolkata"],
  ["gangtok", "Gangtok, Sikkim", "India", 27.3389, 88.6065, "Asia/Kolkata"],
  ["imphal", "Imphal, Manipur", "India", 24.817, 93.9368, "Asia/Kolkata"],
  ["shillong", "Shillong, Meghalaya", "India", 25.5788, 91.8933, "Asia/Kolkata"],
  ["agartala", "Agartala, Tripura", "India", 23.8315, 91.2868, "Asia/Kolkata"],
  ["aizawl", "Aizawl, Mizoram", "India", 23.7271, 92.7176, "Asia/Kolkata"],
  ["itanagar", "Itanagar, Arunachal Pradesh", "India", 27.0844, 93.6053, "Asia/Kolkata"],
  ["kathmandu", "Kathmandu", "Nepal", 27.7172, 85.324, "Asia/Kathmandu"],
  ["dhaka", "Dhaka", "Bangladesh", 23.8103, 90.4125, "Asia/Dhaka"],
  ["colombo", "Colombo", "Sri Lanka", 6.9271, 79.8612, "Asia/Colombo"],
  ["karachi", "Karachi", "Pakistan", 24.8607, 67.0011, "Asia/Karachi"],
  ["lahore", "Lahore", "Pakistan", 31.5204, 74.3587, "Asia/Karachi"],
  ["thimphu", "Thimphu", "Bhutan", 27.4728, 89.639, "Asia/Thimphu"],
  ["london", "London", "United Kingdom", 51.5072, -0.1276, "Europe/London"],
  ["paris", "Paris", "France", 48.8566, 2.3522, "Europe/Paris"],
  ["berlin", "Berlin", "Germany", 52.52, 13.405, "Europe/Berlin"],
  ["moscow", "Moscow", "Russia", 55.7558, 37.6173, "Europe/Moscow"],
  ["dubai", "Dubai", "United Arab Emirates", 25.2048, 55.2708, "Asia/Dubai"],
  ["singapore", "Singapore", "Singapore", 1.3521, 103.8198, "Asia/Singapore"],
  ["bangkok", "Bangkok", "Thailand", 13.7563, 100.5018, "Asia/Bangkok"],
  ["jakarta", "Jakarta", "Indonesia", -6.2088, 106.8456, "Asia/Jakarta"],
  ["beijing", "Beijing", "China", 39.9042, 116.4074, "Asia/Shanghai"],
  ["tokyo", "Tokyo", "Japan", 35.6762, 139.6503, "Asia/Tokyo"],
  ["seoul", "Seoul", "South Korea", 37.5665, 126.978, "Asia/Seoul"],
  ["sydney", "Sydney", "Australia", -33.8688, 151.2093, "Australia/Sydney"],
  ["melbourne", "Melbourne", "Australia", -37.8136, 144.9631, "Australia/Melbourne"],
  ["new-york", "New York", "United States", 40.7128, -74.006, "America/New_York"],
  ["los-angeles", "Los Angeles", "United States", 34.0522, -118.2437, "America/Los_Angeles"],
  ["chicago", "Chicago", "United States", 41.8781, -87.6298, "America/Chicago"],
  ["toronto", "Toronto", "Canada", 43.6532, -79.3832, "America/Toronto"],
  ["vancouver", "Vancouver", "Canada", 49.2827, -123.1207, "America/Vancouver"],
  ["mexico-city", "Mexico City", "Mexico", 19.4326, -99.1332, "America/Mexico_City"],
  ["sao-paulo", "São Paulo", "Brazil", -23.5505, -46.6333, "America/Sao_Paulo"],
  ["buenos-aires", "Buenos Aires", "Argentina", -34.6037, -58.3816, "America/Argentina/Buenos_Aires"],
  ["cairo", "Cairo", "Egypt", 30.0444, 31.2357, "Africa/Cairo"],
  ["nairobi", "Nairobi", "Kenya", -1.2921, 36.8219, "Africa/Nairobi"],
  ["cape-town", "Cape Town", "South Africa", -33.9249, 18.4241, "Africa/Johannesburg"],
];

export const places: Place[] = rawPlaces.map(
  ([id, label, country, latitude, longitude, timeZone]) => ({
    id,
    label,
    country,
    latitude,
    longitude,
    timeZone,
  }),
);

export function findPlace(id: string) {
  return places.find((place) => place.id === id);
}

export function searchPlaces(query: string, limit = 12) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return places.slice(0, limit);
  return places
    .filter((place) => `${place.label} ${place.country}`.toLocaleLowerCase().includes(normalized))
    .slice(0, limit);
}

export function localDateTimeToUtc(date: string, time: string, timeZone: string, fallbackOffsetMinutes = 0) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  if (!timeZone) return new Date(localAsUtc - fallbackOffsetMinutes * 60_000);

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(localAsUtc)).map((part) => [part.type, part.value]),
  );
  const represented = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
  );
  return new Date(localAsUtc - (represented - localAsUtc));
}
