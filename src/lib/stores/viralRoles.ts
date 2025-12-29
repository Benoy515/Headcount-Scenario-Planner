import {
  Code2,
  Briefcase,
  Palette,
  ClipboardList,
  BarChart3,
  Megaphone,
} from "lucide-svelte";

export interface ViralRole {
  type: string;
  label: string;
  emoji: string;
  salary: number;
  description: string;
  color: string;
  icon: any;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

export const VIRAL_ROLES: ViralRole[] = [
  // Engineers
  {
    type: "10x-engineer",
    label: "Overpay a 10x Engineer",
    emoji: "🦸‍♂️",
    salary: 500000,
    description: "Probably a 3x",
    color: "bg-purple-500",
    icon: Code2,
    rarity: "legendary",
  },
  {
    type: "ex-faang",
    label: "Ex-FAANG Engineer (They'll Tell Everyone)",
    emoji: "💼",
    salary: 350000,
    description: "Mentions Google in every meeting",
    color: "bg-blue-500",
    icon: Code2,
    rarity: "rare",
  },
  {
    type: "bootcamp-grad",
    label: "Bootcamp Grad Who Outworks Everyone",
    emoji: "💻",
    salary: 110000,
    description: "Hungry and ready to prove it",
    color: "bg-green-500",
    icon: Code2,
    rarity: "common",
  },
  {
    type: "prompt-engineer",
    label: "Prompt Engineer (ChatGPT Whisperer)",
    emoji: "🪄",
    salary: 250000,
    description: "Can write a mean system prompt",
    color: "bg-cyan-500",
    icon: Code2,
    rarity: "epic",
  },
  {
    type: "ex-quant",
    label: "Ex-Quant Engineer",
    emoji: "💹",
    salary: 550000,
    description: "Ex-Citadel, obsessed with TC",
    color: "bg-emerald-600",
    icon: Code2,
    rarity: "epic",
  },

  // Product/Design
  {
    type: "pm-acronyms",
    label: "PM Who Uses Too Many Acronyms",
    emoji: "📊",
    salary: 200000,
    description: "OKRs, KPIs, and synergy",
    color: "bg-orange-500",
    icon: ClipboardList,
    rarity: "common",
  },
  {
    type: "designer-actually",
    label: "Designer Who Says 'Um, Actually' A Lot",
    emoji: "🎨",
    salary: 180000,
    description: "Kerning expert",
    color: "bg-pink-500",
    icon: Palette,
    rarity: "common",
  },
  {
    type: "steal-pm",
    label: "Steal Competitor's PM",
    emoji: "🕵️",
    salary: 280000,
    description: "Knows all the secrets",
    color: "bg-indigo-500",
    icon: ClipboardList,
    rarity: "epic",
  },

  // Sales/Marketing
  {
    type: "sales-bro",
    label: "Sales Bro Who Crushes It",
    emoji: "💪",
    salary: 150000,
    description: "Always closing",
    color: "bg-green-400",
    icon: Briefcase,
    rarity: "common",
  },
  {
    type: "influencer",
    label: "Influencer With 2k Followers",
    emoji: "📱",
    salary: 120000,
    description: "Huge on LinkedIn",
    color: "bg-pink-400",
    icon: Megaphone,
    rarity: "common",
  },
  {
    type: "grok-social-media",
    label: "Grok as Social Media Manager",
    emoji: "🤖",
    salary: 50000,
    description: "Never says controversial things",
    color: "bg-gray-500",
    icon: Megaphone,
    rarity: "rare",
  },

  // Data
  // Special/Legendary
  {
    type: "kevin-durant",
    label: "Sign Kevin Durant as Advisor",
    emoji: "🏀",
    salary: 1000000,
    description: "He'll tweet about you once",
    color: "bg-yellow-500",
    icon: Briefcase,
    rarity: "legendary",
  },
  {
    type: "cto-roommate",
    label: "Your College Roommate as CTO",
    emoji: "🎓",
    salary: 180000,
    description: "You trust them, right?",
    color: "bg-blue-400",
    icon: Code2,
    rarity: "common",
  },
  {
    type: "stanford-dropout",
    label: "Stanford Dropout (Probably Genius)",
    emoji: "🧠",
    salary: 90000,
    description: "The next Zuck... or Elizabeth Holmes",
    color: "bg-red-500",
    icon: Code2,
    rarity: "epic",
  },
  {
    type: "chief-vibe",
    label: "Chief Vibe Officer",
    emoji: "✨",
    salary: 80000,
    description: "Vibes only",
    color: "bg-purple-400",
    icon: Briefcase,
    rarity: "rare",
  },
  {
    type: "web3-expert",
    label: "Web3 Expert (Down Bad)",
    emoji: "🪙",
    salary: 95000,
    description: "Still believes in the tech",
    color: "bg-orange-400",
    icon: Code2,
    rarity: "common",
  },
  {
    type: "sam-altman-cousin",
    label: "Hire Sam Altman's Cousin",
    emoji: "👨‍💼",
    salary: 300000,
    description: "Connections matter",
    color: "bg-indigo-400",
    icon: Briefcase,
    rarity: "legendary",
  },
];

// Map professional roles to viral roles for easy swapping
export const ROLE_TYPE_MAP: Record<string, string> = {
  engineer: "ex-faang",
  sales: "sales-bro",
  designer: "designer-actually",
  product: "pm-acronyms",
  data: "data-scientist",
  marketing: "growth-hacker",
};

// Get viral role by type
export function getViralRole(type: string): ViralRole | undefined {
  return VIRAL_ROLES.find((role) => role.type === type);
}

// Get random viral role
export function getRandomViralRole(): ViralRole {
  return VIRAL_ROLES[Math.floor(Math.random() * VIRAL_ROLES.length)];
}

// Get viral roles by rarity
export function getViralRolesByRarity(
  rarity: "common" | "rare" | "epic" | "legendary",
): ViralRole[] {
  return VIRAL_ROLES.filter((role) => role.rarity === rarity);
}
