import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Utensils, Languages, Info, ExternalLink } from "lucide-react";

// --- Minimal shadcn/ui shims (works in this environment). In real Next.js add the imports from shadcn/ui ---
const Button = ({ className = "", children, ...props }) => (
  <button
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm border border-black/5 hover:shadow transition active:scale-[.99] ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-4 py-2 rounded-xl border border-black/10 shadow-sm focus:outline-none focus:ring focus:ring-black/10 ${className}`}
    {...props}
  />
);

const Badge = ({ children, className = "" }) => (
  <span className={`px-2 py-1 text-xs rounded-full bg-black/5 ${className}`}>{children}</span>
);

const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl shadow-sm border border-black/10 bg-white overflow-hidden ${className}`}>{children}</div>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// ---------- Data ----------
// NOTE: Replace image URLs with real restaurant photos later.
const ph = (id) => `https://placehold.co/600x400?text=Photo+${id}`;

const HALAL = [
  { dish: "Chicken Rice Balls", description: "Sticky rice balls with poached chicken and chili sauce—Melaka’s signature.", place: "Chung Wah Chicken Rice (RM8-12)", address: "18, Jalan Hang Jebat, 75200 Melaka", hours: "10 AM-3 PM, daily (closed when sold out)", image: ph(1) },
  { dish: "Nyonya Laksa", description: "Creamy, spicy coconut noodle soup with prawns and fish cake.", place: "Jonker 88 (RM10, Nyonya)", address: "88, Jalan Hang Jebat, 75200 Melaka", hours: "11 AM-10 PM, daily", image: ph(2) },
  { dish: "Cendol", description: "Shaved ice with pandan jelly, gula melaka, and coconut milk.", place: "Jonker 88 (RM5; same spot, quick dessert)", address: "88, Jalan Hang Jebat, 75200 Melaka", hours: "11 AM-10 PM, daily", image: ph(3) },
  { dish: "Asam Pedas", description: "Sour-spicy fish curry with rice, often with stingray.", place: "Asam Pedas Claypot (RM15; nearby, authentic)", address: "86, Jalan Laksamana 5, Taman Kota Laksamana, 75200 Melaka", hours: "5 PM-2 AM, daily (closed Tuesdays)", image: ph(4) },
  { dish: "Kuih Nyonya", description: "Colorful Peranakan sweets like onde-onde or kuih lapis.", place: "Baba Charlie Nyonya Cake (RM2-5; takeaway stall)", address: "72, Jalan Tengkera Pantai 2C, 75200 Melaka", hours: "9 AM-5 PM, daily", image: ph(5) },
  { dish: "Satay", description: "Grilled chicken or beef skewers with peanut sauce.", place: "Jonker Walk Night Market (RM1-2/stick; halal stalls)", address: "Jalan Hang Jebat, 75200 Melaka (night market, Fri-Sun)", hours: "6 PM-12 AM, Fri-Sun", image: ph(6) },
  { dish: "Mee Goreng", description: "Spicy stir-fried noodles with prawns or chicken.", place: "Medan Selera Jonker Walk (RM8; night market stall)", address: "Jalan Hang Jebat, 75200 Melaka (night market, Fri-Sun)", hours: "6 PM-12 AM, Fri-Sun", image: ph(7) },
  { dish: "Ikan Bakar", description: "Grilled fish with sambal belacan, served with air asam (tamarind dip).", place: "Warung Ikan Bakar Umbai (RM15-20; 5-min walk, seafood haven)", address: "10, Jalan Kampung Hulu, 75200 Melaka", hours: "5 PM-10 PM, daily", image: ph(8) },
  { dish: "Rojak Mamak", description: "Spicy fruit-vegetable salad with shrimp paste and peanuts.", place: "Jonker Walk Night Market (RM6; halal stall near Jalan Hang Lekir)", address: "Jalan Hang Jebat, near Jalan Hang Lekir, 75200 Melaka (night market, Fri-Sun)", hours: "6 PM-12 AM, Fri-Sun", image: ph(9) },
  { dish: "Otak-Otak", description: "Spicy fish paste grilled in banana leaves—Nyonya style.", place: "Ole Sayang (RM8 for 3; pork-free Nyonya eatery)", address: "198, Jalan Hang Jebat, 75200 Melaka", hours: "11 AM-9 PM, daily (closed Tuesdays)", image: ph(10) },
  { dish: "Nasi Lemak Ayam Berempah", description: "Coconut rice with spicy fried chicken and sambal.", place: "Restoran Hajjah Mona (RM10; traditional Malay)", address: "6, Jalan Hang Kasturi, 75200 Melaka", hours: "8 AM-8 PM, daily", image: ph(11) },
  { dish: "Popiah Basah", description: "Fresh spring rolls with turnip, shrimp, and chili sauce.", place: "Medan Selera Jonker Walk (RM5; halal stall)", address: "Jalan Hang Jebat, 75200 Melaka (night market, Fri-Sun)", hours: "6 PM-12 AM, Fri-Sun", image: ph(12) },
  { dish: "Sotong Kangkung", description: "Cuttlefish and water spinach with sweet-spicy peanut sauce.", place: "Restoran Nyonya Suan (RM12; cozy Nyonya spot)", address: "23, Jalan Hang Lekiu, 75200 Melaka", hours: "11:30 AM-9 PM, daily", image: ph(13) },
  { dish: "Prawn Fritters (Cucur Udang)", description: "Crispy prawn fritters with chili dip—crunchy snack.", place: "Jonker Walk Night Market (RM3-5; halal vendor near clock tower)", address: "Jalan Hang Jebat, near Stadthuys, 75200 Melaka (night market, Fri-Sun)", hours: "6 PM-12 AM, Fri-Sun", image: ph(14) },
  { dish: "Durian Cendol", description: "Classic cendol with a durian twist—seasonal treat.", place: "Bibik Neo Cendol (RM7; small stall, big flavor)", address: "115, Jalan Hang Jebat, 75200 Melaka", hours: "12 PM-6 PM, daily", image: ph(15) },
  { dish: "Nasi Kerabu", description: "Blue-tinted rice with herbs, salted egg, and spicy chicken.", place: "Warung Makan Melayu (RM10; authentic Malay stall)", address: "15, Jalan Hang Kasturi, 75200 Melaka", hours: "11 AM-8 PM, daily", image: ph(16) },
  { dish: "Ayam Percik", description: "Grilled chicken slathered in creamy, spicy coconut sauce.", place: "Restoran Seri Maujud (RM12; cozy, family-run)", address: "22, Jalan Tukang Besi, 75200 Melaka", hours: "12 PM-9 PM, daily (closed Fridays 12-2 PM)", image: ph(17) },
  { dish: "Laksa Johor", description: "Spaghetti-like noodles in tangy fish gravy—Melaka twist.", place: "Warung Laksa Asam (RM8; small stall, big flavor)", address: "5, Jalan Hang Lekir, 75200 Melaka", hours: "10 AM-6 PM, daily", image: ph(18) },
  { dish: "Kuih Lopes", description: "Sticky rice cake with gula melaka syrup and coconut.", place: "Jonker Walk Night Market (RM3; halal kuih stall)", address: "Jalan Hang Jebat, 75200 Melaka (night market, Fri-Sun)", hours: "6 PM-12 AM, Fri-Sun", image: ph(19) },
  { dish: "Sup Kambing", description: "Hearty mutton soup with spices, served with bread.", place: "Medan Makan Boon Leong (RM15; near Jonker)", address: "17, Jalan Hang Jebat, 75200 Melaka", hours: "5 PM-10 PM, daily", image: ph(20) },
  { dish: "Roti John", description: "Baguette with egg, chicken, and chili sauce—fusion snack.", place: "Jonker Walk Night Market (RM6; halal vendor near Jalan Hang Lekiu)", address: "Jalan Hang Jebat, near Jalan Hang Lekiu, 75200 Melaka (night market, Fri-Sun)", hours: "6 PM-12 AM, Fri-Sun", image: ph(21) },
  { dish: "Prawn Sambal Petai", description: "Spicy prawns with pungent petai beans, served with rice.", place: "Restoran Nyonya Lin (RM15; pork-free Nyonya)", address: "34, Jalan Tukang Emas, 75200 Melaka", hours: "11 AM-8 PM, daily", image: ph(22) },
  { dish: "Teh Tarik Madu", description: "Frothy pulled tea with a honey twist—perfect nightcap.", place: "Warung Minuman Pak Din (RM4; night market drink stall)", address: "Jalan Hang Jebat, 75200 Melaka (night market, Fri-Sun)", hours: "6 PM-12 AM, Fri-Sun", image: ph(23) },
  { dish: "Local Pandan Cake and Tarts", description: "heritage-style café tucked behind a Jonker Street shop, famous for its pandan pancakes and artisanal coffee.", place: "The Daily Fix (RM 17; Old style cafe with good pastries)", address: "55, Jalan Hang Jebat, 75200 Melaka ( 9 AM-6 PM, daily)", hours: "9 AM-6 PM, daily", image: ph(24) },
  { dish: "Croissants and Flower Tea", description: "fresh-baked croissants and fragrant flower teas brewed", place: "The Butter (RM 10; Various types of croissants and cromboloni)", address: "38, Jalan Tukang Emas, 75200 Melaka", hours: "9 AM-6 PM, daily", image: ph(25) }, 
  { dish: "French Inspired Pastries", description: "French-inspired viennoiseries (like pistachio cromboloni), buttery croissants, inventive pastries, and aromatic coffee in a minimalist, industrial-chic setting.", place: "French Brown (RM 12; fresh bake croissants and cromboloni)", address: "98, Jalan Hang Jebat, 75200 Melaka", hours: "9 AM-6 PM, daily", image: ph(26) }, 
  { dish: "Fresh Soya Bean", description: "Freshly made soya bean", place: "Tofu Street Fresh Soya Bean (RM 3; fresh made soya bean)", address: "45, Jalan Kampung Pantai, 75200 Melaka", hours: "11.30 AM-6 PM, daily", image: ph(28) }, 
  { dish: "Fresh Herbal Tea", description: "Freshly made herbal tea", place: "Street Stall Tea (RM 2; fresh made herbal tea)", address: "36, Jalan Kampung Pantai, 75200 Melaka", hours: "9 AM-3 PM, daily", image: ph(28) }, 
  { dish: "Cendol", description: "silky shaved coconut-ice cendol, rich gula Melaka syrup, and a wide variety of toppings like durian, mango, jackfruit, and longan.", place: "Cendol Kampung Hulu (RM 4; Cendol)", address: "26, Jalan Kampung Hulu, Kampung Hulu, 75200 Melaka", hours: "11 AM-11.30 PM, daily", image: ph(29) }, 
  { dish: "South Indian Cuisine", description: "Chettinad-style banana leaf meals, aromatic curries like mutton masala and fish fry, and affordable, generous portions in a casual, family-friendly setting.", place: "Restoran Saravanna - Chettinadu King (RM 8; Banana Leaf Rice)", address: "18, Jalan Bendahara, Kampung Bukit China, 75100 Melaka", hours: "7.30 AM-9.30 PM, daily", image: ph(30) }, 
];

const NON_HALAL = [
  { dish: "Nyonya Pork Dishes", description: "Pork rendang or babi pongteh (stewed pork with fermented beans).", place: "Nancy’s Kitchen (RM18; Peranakan classic)", address: "13, Jalan KL 3/8, Taman Kota Laksamana, Seksyen 3, 75200 Melaka", hours: "Mon, Wed-Thu: 11 AM-5 PM; Fri-Sun: 11 AM-9 PM (closed Tue)", image: ph(101) },
  { dish: "Chicken Rice Balls", description: "Hainanese-style with roasted pork add-ons.", place: "Hoe Kee Chicken Rice (RM10; non-halal version)", address: "468, Jalan Hang Jebat, 75200 Melaka", hours: "9 AM-4:30 PM daily (closed Thu)", image: ph(102) },
  { dish: "Satay Celup", description: "Skewers dipped in pork-based satay sauce—fondue style.", place: "Ban Lee Siang (RM20-30; group-friendly)", address: "45-E, Jalan Ong Kim Wee, 75300 Melaka", hours: "4 PM-12 AM daily", image: ph(103) },
  { dish: "Dim Sum", description: "Pork siu mai and char siew buns, morning-only.", place: "Low Yong Moh Restaurant (RM10-15; traditional)", address: "32, Jalan Tukang Emas, 75200 Melaka", hours: "5:30 AM-1 PM daily (closed Tue)", image: ph(104) },
  { dish: "Prawn Noodle", description: "Rich pork-shrimp broth with noodles.", place: "Hup Huat Hainanese Prawn Noodle (RM12; nearby)", address: "101, Jalan SP Taman Semabok Perdana, 75050 Melaka", hours: "7 AM-6 PM daily", image: ph(105) },
  { dish: "Chendul", description: "Non-halal version with pork fat in some recipes.", place: "Nyonya Makko (RM6; richer taste)", address: "123, Jalan Merdeka, Taman Melaka Raya, 75000 Melaka", hours: "11:30 AM-2:30 PM, 6-9:15 PM daily (closed Tue)", image: ph(106) },
  { dish: "Pork Satay", description: "Grilled pork skewers with richer, non-halal peanut sauce.", place: "Capitol Satay (RM1-2/stick; near Jonker)", address: "41, Lorong Bukit Cina, 75100 Melaka", hours: "5 PM-12 AM daily", image: ph(107) },
  { dish: "Hainanese Pork Chop", description: "Crispy pork cutlet with tangy sauce, served with rice.", place: "Jonker Street Hawker Centre (RM15; non-halal stall)", address: "Jalan Hang Jebat (behind Jonker Walk Stage), 75200 Melaka", hours: "6 PM-10 PM daily", image: ph(108) },
  { dish: "Nyonya Pai Tee", description: "Crispy cups with turnip and pork topping—Peranakan snack.", place: "Amy Heritage Nyonya Cuisine (RM10 for 4; traditional)", address: "75, Jalan Melaka Raya 24, Taman Melaka Raya, 75000 Melaka", hours: "11:30 AM-2:30 PM, 6-9:30 PM (closed Mon)", image: ph(109) },
  { dish: "Char Siew Rice", description: "Sticky, caramelized BBQ pork over rice.", place: "Restoran Famosa Chicken Rice (RM12; non-halal twist)", address: "28, Jalan Hang Kasturi, 75200 Melaka", hours: "9:30 AM-4 PM daily", image: ph(110) },
  { dish: "Siew Yoke", description: "Crispy roast pork with crackling skin, served with chili.", place: "Restoran Chan Meng Kee (RM15; Chinatown vibe)", address: "20, Jalan Tukang Emas, 75200 Melaka", hours: "8 AM-4 PM daily", image: ph(111) },
  { dish: "Pork Mee Sua", description: "Thin noodles in pork broth with minced pork.", place: "Kedai Makanan & Minuman Pak Putera (RM10; hole-in-the-wall)", address: "12, Jalan Hang Lekiu, 75200 Melaka", hours: "11 AM-6 PM daily", image: ph(112) },
  { dish: "Curry Debal", description: "Portuguese spicy pork curry with vinegar kick.", place: "Restoran de Costa’s (RM18; Portuguese Settlement, 10-min walk)", address: "Lot 8, Medan Selera Portuguese Settlement, 18 Jalan Daranjo, Ujong Pasir, 75050 Melaka", hours: "5 PM-11 PM (Wed-Mon, closed Tue)", image: ph(113) },
  { dish: "Lor Bak", description: "Fried pork rolls wrapped in tofu skin with dipping sauce.", place: "Jonker Street Hawker Centre (RM8; non-halal stall)", address: "Jalan Hang Jebat (behind Jonker Walk Stage), 75200 Melaka", hours: "6 PM-10 PM daily", image: ph(114) },
  { dish: "Pork Vindaloo", description: "Portuguese-Indian spicy pork curry with rice.", place: "Restoran de Lisbon (RM18; Portuguese Settlement, 10-min walk)", address: "12, Jalan Kubu, 75200 Melaka", hours: "1 PM-11 PM daily", image: ph(115) },
  { dish: "Hakka Yong Tau Foo", description: "Tofu and veggies stuffed with pork paste in broth.", place: "Restoran Yong Tau Foo Hakka (RM12; Chinatown spot)", address: "8, Jalan Kampung Pantai, 75200 Melaka", hours: "7 AM-2 PM daily", image: ph(116) },
  { dish: "Pork Knuckle", description: "Braised pork knuckle with soy sauce and rice.", place: "Restoran Lee (RM20; hearty, old-school)", address: "29, Jalan Hang Kasturi, 75200 Melaka", hours: "11 AM-5 PM daily", image: ph(117) },
  { dish: "Nyonya Chap Chye", description: "Mixed veggie stew with pork and shrimp paste.", place: "Restoran Peranakan Place (RM15; heritage shophouse)", address: "54, Jalan Hang Jebat, 75200 Melaka", hours: "11:30 AM-9 PM daily", image: ph(118) },
  { dish: "Pork Wanton Mee", description: "Springy noodles with pork dumplings and char siew.", place: "Kedai Makan Ho Jiak (RM10; no-frills)", address: "10, Jalan Tukang Besi, 75200 Melaka", hours: "8 AM-3 PM daily", image: ph(119) },
  { dish: "Sambal Stingray", description: "Grilled stingray with non-halal sambal (pork fat base).", place: "Jonker Street Hawker Centre (RM18; non-halal stall)", address: "Jalan Hang Jebat (behind Jonker Walk Stage), 75200 Melaka", hours: "6 PM-10 PM daily", image: ph(120) },
  { dish: "Pork Satay Burger", description: "Fusion pork patty with satay sauce in a bun.", place: "The Baboon House (RM15; quirky cafe)", address: "89, Jalan Tun Tan Cheng Lock, 75200 Melaka", hours: "Mon, Wed-Thu: 10 AM-5 PM; Fri-Sun: 10 AM-9 PM (closed Tue)", image: ph(121) },
  { dish: "Bak Chang", description: "Sticky rice dumplings with pork and chestnut.", place: "Jonker Walk Night Market (RM5; non-halal stall)", address: "Jalan Hang Jebat, 75200 Melaka (night market, Fri-Sun)", hours: "6 PM-12 AM, Fri-Sun", image: ph(122) },
  { dish: "Pork Meat Soup", description: "Yam rice paired with a lightly herbal pork meat soup.", place: "Restaurant Kok Keong (RM10; non-halal restaurant)", address: "11, Jalan Kampung Pantai, 75200 Melaka (night market, Fri-Sun)", hours: "6 PM-12 AM, Fri-Sun", image: ph(122) },
];

// ---------- i18n ----------
const STRINGS = {
  en: {
    title: "Melaka Food Guide",
    subtitle: "Your halal & non‑halal eats at a glance",
    halal: "Halal",
    nonhalal: "Non‑Halal",
    search: "Search dishes or places…",
    dish: "Dish",
    place: "Where to try",
    address: "Address",
    hours: "Opening hours",
    openMap: "Open in Maps",
    photoNote: "Photos are placeholders — replace with real shots later.",
    lang: "EN",
  },
  ms: {
    title: "Panduan Makanan Melaka",
    subtitle: "Pilihan makanan halal & tidak halal",
    halal: "Halal",
    nonhalal: "Tidak Halal",
    search: "Cari hidangan atau kedai…",
    dish: "Hidangan",
    place: "Tempat dicuba",
    address: "Alamat",
    hours: "Waktu operasi",
    openMap: "Buka dalam Maps",
    photoNote: "Gambar masih sementara — boleh diganti dengan foto sebenar.",
    lang: "BM",
  },
};

function useI18n(lang) {
  return STRINGS[lang];
}

// ---------- Utilities ----------
const toMapsUrl = (addr) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;

const normalize = (s) => s.toLowerCase();

// ---------- Components ----------
const Header = ({ lang, setLang }) => {
  const t = useI18n(lang);
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Utensils className="w-6 h-6" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
            <p className="text-sm text-black/60">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="hidden sm:inline-flex">{t.photoNote}</Badge>
          <Button onClick={() => setLang(lang === "en" ? "ms" : "en")} title="Language">
            <Languages className="w-4 h-4" /> {t.lang}
          </Button>
        </div>
      </div>
    </header>
  );
};

const Tabs = ({ lang, active, setActive }) => {
  const t = useI18n(lang);
  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <div className="grid grid-cols-2 gap-2 bg-black/5 p-1 rounded-2xl">
        <Button
          className={`w-full ${active === "halal" ? "bg-white" : "bg-transparent"}`}
          onClick={() => setActive("halal")}
        >
          {t.halal}
        </Button>
        <Button
          className={`w-full ${active === "nonhalal" ? "bg-white" : "bg-transparent"}`}
          onClick={() => setActive("nonhalal")}
        >
          {t.nonhalal}
        </Button>
      </div>
    </div>
  );
};

const SearchBar = ({ lang, query, setQuery }) => {
  const t = useI18n(lang);
  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

const ItemCard = ({ lang, item, index }) => {
  const t = useI18n(lang);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.02 }}
    >
      <Card className="hover:shadow-md transition">
        <div className="aspect-[3/2] bg-black/5 overflow-hidden">
          <img src={item.image} alt={item.place} className="w-full h-full object-cover" />
        </div>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold leading-tight">{item.dish}</h3>
              <p className="text-sm text-black/70 mt-1">{item.description}</p>
              <p className="mt-3 text-sm"><span className="font-medium">{t.place}:</span> {item.place}</p>
              <p className="text-sm flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" /> <span className="inline-block">{item.address}</span></p>
              <p className="text-sm flex items-center gap-1 mt-1"><Clock className="w-4 h-4" /> <span className="inline-block">{t.hours}: {item.hours}</span></p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <a href={toMapsUrl(item.address)} target="_blank" rel="noreferrer">
              <Button className="">{t.openMap} <ExternalLink className="w-4 h-4" /></Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Grid = ({ lang, items }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <ItemCard key={`${item.dish}-${i}`} item={item} lang={lang} index={i} />
        ))}
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="py-10 text-center text-xs text-black/60">
    <p className="flex items-center justify-center gap-1"><Info className="w-3 h-3" />Prices & hours are approximate; check on the day.</p>
  </footer>
);

function filterItems(items, query) {
  if (!query) return items;
  const q = normalize(query);
  return items.filter((x) =>
    [x.dish, x.description, x.place, x.address].some((f) => normalize(f).includes(q))
  );
}

export default function MelakaFoodGuide() {
  const [lang, setLang] = useState("en");
  const [active, setActive] = useState("halal");
  const [query, setQuery] = useState("");

  const list = active === "halal" ? HALAL : NON_HALAL;
  const filtered = useMemo(() => filterItems(list, query), [list, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50 text-stone-900">
      <Header lang={lang} setLang={setLang} />
      <main className="pt-2">
        <Tabs lang={lang} active={active} setActive={setActive} />
        <SearchBar lang={lang} query={query} setQuery={setQuery} />
        <Grid lang={lang} items={filtered} />
        <Footer />
      </main>
    </div>
  );
}
