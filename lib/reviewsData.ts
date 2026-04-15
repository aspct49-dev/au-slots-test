export type Volatility = "LOW" | "MEDIUM" | "HIGH" | "VERY HIGH";
export type Tag = "HOT" | "NEW" | "STREAMER FAV" | "CLASSIC";

export interface SlotReview {
  id: string;
  gameName: string;
  provider: string;
  providerColor: string;
  imageUrl?: string;
  gradientFallback: string;
  rtp: number;
  volatility: Volatility;
  releaseDate: string;
  maxWin: string;
  minBet: string;
  maxBet: string;
  streamerRating: number;
  userRating: number;
  userRatingCount: number;
  tags: Tag[];
  about: string;
  bettingAndFeatures: string;
  gameplayFeatures: string[];
  streamerTake: string;
  finalVerdict: string;
  gamingTips: string[];
}

export const reviews: SlotReview[] = [
  {
    id: "1",
    gameName: "Gates of Olympus 1000",
    provider: "Pragmatic Play",
    providerColor: "#60a5fa",
    imageUrl: "/images/gates-of-olympus-1000.png",
    gradientFallback: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #1d4ed8 100%)",
    rtp: 96.5,
    volatility: "VERY HIGH",
    releaseDate: "2023-08",
    maxWin: "5,000x",
    minBet: "$0.20",
    maxBet: "$100",
    streamerRating: 9.5,
    userRating: 9.2,
    userRatingCount: 1842,
    tags: ["HOT", "STREAMER FAV"],
    about:
      "Gates of Olympus 1000 is the turbocharged sequel to the iconic Gates of Olympus, featuring a new reel structure with explosive multiplier potential. Zeus rains down multipliers on a 6x5 tumbling grid, removing winning clusters and creating cascading chains of wins. The 1000 series upgrade brings an enhanced multiplier collection system during free spins — each Zeus drop adds to a global multiplier that never resets, making every tumble potentially game-changing.",
    bettingAndFeatures:
      "The slot uses a 6x5 tumbling grid with Cluster Pays mechanic (8+ matching symbols). Bets range from $0.20 to $100 per spin. The Buy Feature (available in supported regions) lets you purchase free spins directly for 100x your bet. During the base game, Zeus randomly appears to scatter multipliers across symbols. In free spins, those multipliers accumulate without resetting — the hallmark mechanic that separates this from the original.",
    gameplayFeatures: [
      "Cluster Pays on a 6x5 grid — 8+ matching symbols trigger a win",
      "Tumbling reels remove winning symbols and allow chain wins",
      "Zeus multiplier drops during base game (2x, 3x, 5x)",
      "Free Spins: global multiplier accumulates and never resets",
      "Buy Feature: instant access to free spins at 100x bet",
      "Maximum win potential: 5,000x your stake",
    ],
    streamerTake:
      "Gates of Olympus 1000 is my go-to slot for bonus hunts. There's nothing quite like watching that multiplier climb during free spins — I've had sessions where it hit 300x and every cluster just exploded. The 1000 upgrade makes it feel like a completely different beast from the original. When it hits, it absolutely HITS.",
    finalVerdict:
      "An essential slot for any high-volatility enthusiast. Gates of Olympus 1000 refines an already-legendary formula with a higher ceiling, better multiplier mechanics, and the same heart-pounding tension that made the original great. It's volatile, it's beautiful, and it's capable of delivering exceptional wins. Highly recommended.",
    gamingTips: [
      "Trigger free spins for the best multiplier accumulation",
      "The buy feature is worth it in regions where it's available",
      "Set a session budget — this slot can drain bankrolls quickly between hits",
      "Play for entertainment; the 5,000x ceiling is rare but spectacular",
    ],
  },
  {
    id: "2",
    gameName: "Sweet Bonanza 1000",
    provider: "Pragmatic Play",
    providerColor: "#fbbf24",
    imageUrl: "/images/sweet-bonanza-1000.png",
    gradientFallback: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #d97706 100%)",
    rtp: 96.48,
    volatility: "VERY HIGH",
    releaseDate: "2023-10",
    maxWin: "5,000x",
    minBet: "$0.20",
    maxBet: "$100",
    streamerRating: 9.0,
    userRating: 8.8,
    userRatingCount: 2103,
    tags: ["HOT", "STREAMER FAV"],
    about:
      "Sweet Bonanza 1000 takes the beloved candy-themed slot and cranks everything up to the extreme. Built on the same tumbling, cluster-pays foundation as the original, the 1000 version introduces a supercharged multiplier system that can stack to absurd levels during free spins. The vibrant, sugary visuals are instantly recognisable, and the gameplay loop — spin, tumble, collect multipliers — is as addictive as ever.",
    bettingAndFeatures:
      "Bets run from $0.20 to $100 on the 6x5 grid. Scatter symbols trigger free spins, and bomb symbols add random multipliers during the feature. The 1000 upgrade dramatically increases the multiplier ceiling, meaning a single free spins session can escalate into mega territory. A Buy Feature allows direct access to the bonus round at 100x bet.",
    gameplayFeatures: [
      "6x5 grid with Cluster Pays — 8+ symbols trigger a win",
      "Tumbling mechanic fires after each winning cluster",
      "Bomb multipliers appear randomly during free spins",
      "Multipliers stack and combine during tumbles",
      "Buy Feature available for instant bonus access at 100x bet",
      "Max win: 5,000x stake",
    ],
    streamerTake:
      "Sweet Bonanza 1000 is the slot I keep coming back to. The original was already a community favourite, but the 1000 version pushes that excitement to another level. I've had some insane bonus rounds where multipliers stacked to 200x+ and every tumble just kept delivering. The colourful visuals make it a great watch on stream — chat goes crazy when bombs start flying.",
    finalVerdict:
      "Sweet Bonanza 1000 is a worthy successor to one of the most popular slots ever made. The enhanced multiplier mechanics add a new dimension of excitement, and the potential ceiling makes every bonus round feel like it could be the one. A must-play for Pragmatic fans.",
    gamingTips: [
      "Lollipop symbols are the highest value — watch for them clustering",
      "Bomb multipliers can combine for huge results during free spins",
      "Buy Feature is available in many regions and provides instant action",
      "Play at a stake you're comfortable spinning 50+ times",
    ],
  },
  {
    id: "3",
    gameName: "Starlight Princess 1000",
    provider: "Pragmatic Play",
    providerColor: "#c084fc",
    imageUrl: "/images/starlight-princess-1000.png",
    gradientFallback: "linear-gradient(135deg, #c084fc 0%, #a855f7 40%, #7c3aed 100%)",
    rtp: 96.5,
    volatility: "VERY HIGH",
    releaseDate: "2023-09",
    maxWin: "5,000x",
    minBet: "$0.20",
    maxBet: "$125",
    streamerRating: 9.2,
    userRating: 9.0,
    userRatingCount: 1674,
    tags: ["HOT"],
    about:
      "Starlight Princess 1000 brings the anime-inspired fantasy world of its predecessor into the 1000-series era. The glittering princess returns on a 6x5 grid with tumbling reels and a completely reworked multiplier system. The aesthetic is breathtaking — soft purples, golds, and sparkles fill every spin — while the mechanics deliver the high-volatility punch that fans have come to expect.",
    bettingAndFeatures:
      "Stakes range from $0.20 to $125. The slot uses the same tumbling cluster mechanic as the Pragmatic 1000 series siblings. Free spins feature a persistent global multiplier that grows with each cascade. The princess herself appears to bestow multiplier bonuses during the feature. Buy Feature is available at 100x the bet in supported regions.",
    gameplayFeatures: [
      "6x5 tumbling grid with Cluster Pays",
      "Global multiplier accumulates throughout free spins — never resets",
      "Princess multiplier drop mechanic during free spins",
      "Scatter symbols trigger the free spin bonus",
      "Buy Feature at 100x bet in supported regions",
      "Max win: 5,000x stake",
    ],
    streamerTake:
      "Starlight Princess 1000 has the best visuals in the entire Pragmatic 1000 lineup. The animations during free spins — when the multiplier keeps climbing and the princess is throwing stars everywhere — are genuinely mesmerising. It's a slot that delivers both visually and mechanically. One of my most-played slots on stream.",
    finalVerdict:
      "A visual masterpiece with serious multiplier potential. Starlight Princess 1000 combines stunning anime aesthetics with one of the most satisfying multiplier engines in the 1000 series. Highly recommended for both the experience and the win potential.",
    gamingTips: [
      "Watch for the princess multiplier trigger early in free spins — it sets the tone",
      "The global multiplier never resets, so longer free spins sessions are best",
      "Try the demo first to understand how the multiplier engine works",
      "Set loss limits — very high volatility means dry spells between bonus hits",
    ],
  },
  {
    id: "4",
    gameName: "Sugar Rush 1000",
    provider: "Pragmatic Play",
    providerColor: "#f472b6",
    imageUrl: "/images/sugar-rush-1000.jpg",
    gradientFallback: "linear-gradient(135deg, #f472b6 0%, #ec4899 40%, #db2777 100%)",
    rtp: 96.5,
    volatility: "VERY HIGH",
    releaseDate: "2024-01",
    maxWin: "5,000x",
    minBet: "$0.20",
    maxBet: "$100",
    streamerRating: 8.5,
    userRating: 8.3,
    userRatingCount: 987,
    tags: ["NEW"],
    about:
      "Sugar Rush 1000 transforms the fan-favourite candy-themed slot into a 1000-series powerhouse. Playing on a larger 7x7 grid with cluster pays, it feels both familiar and completely fresh, with a new persistent multiplier system capable of delivering spectacular results. The colourful confectionary world returns with upgraded mechanics and a jaw-dropping win ceiling.",
    bettingAndFeatures:
      "Bets start at $0.20, with a maximum of $100 per spin on the 7x7 grid. Matching 5+ same-colour candies triggers a win, and tumbling mechanics allow chain wins. During free spins, multiplier symbols are added to the grid and persist — accumulating over tumbles. The Buy Feature is available at 100x stake for direct bonus access.",
    gameplayFeatures: [
      "7x7 grid — larger than other 1000-series Pragmatic slots",
      "Cluster Pays with 5+ matching symbols",
      "Tumbling reels create chain wins",
      "Persistent multiplier symbols stay on the grid during free spins",
      "Buy Feature at 100x bet in supported regions",
      "Max win: 5,000x stake",
    ],
    streamerTake:
      "Sugar Rush 1000 surprised me — it feels more dynamic than the original thanks to the bigger grid. When multipliers start stacking and staying on the grid during free spins, the potential to chain into something massive is real. It's the newest addition to my regular rotation and I think it's underrated compared to its 1000-series siblings.",
    finalVerdict:
      "Sugar Rush 1000 is a fresh and exciting entry in Pragmatic's 1000 series. The 7x7 grid adds variety, and the persistent multiplier mechanic keeps free spins unpredictable. Worth playing for fans of the original and newcomers alike.",
    gamingTips: [
      "The larger 7x7 grid means more candies and more chain potential",
      "Persistent multiplier symbols that stay through tumbles are the key mechanic",
      "A single big multiplier chain can produce massive results",
      "Play with patience — the variance is very high",
    ],
  },
  {
    id: "5",
    gameName: "Chaos Crew 3",
    provider: "Hacksaw Gaming",
    providerColor: "#a78bfa",
    imageUrl: "/images/chaos_crew_3.jpg",
    gradientFallback: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #4c1d95 100%)",
    rtp: 96.0,
    volatility: "VERY HIGH",
    releaseDate: "2023-07",
    maxWin: "10,000x",
    minBet: "$0.10",
    maxBet: "$100",
    streamerRating: 9.3,
    userRating: 9.1,
    userRatingCount: 1456,
    tags: ["HOT", "STREAMER FAV"],
    about:
      "Chaos Crew 3 is the latest instalment in Hacksaw Gaming's chaotic, comic-book-inspired series. The anarchic crew of misfit characters is back with a 5-reel setup packed with explosive mechanics. Wild multipliers, free spins, and a no-holds-barred bonus system make this one of the most volatile — and rewarding — slots in Hacksaw's catalogue. If you've played the previous entries, expect everything you loved and more.",
    bettingAndFeatures:
      "Bets range from $0.10 to $100. The slot features expanding wilds with multipliers, re-spins, and free spins triggered by scatter landings. During free spins, wild multiplier values increase with each qualifying spin. The Bonus Buy is available at 65x the stake, offering direct access to the free spins feature.",
    gameplayFeatures: [
      "5x3 grid with 20 fixed paylines",
      "Wild multipliers (2x–5x) that expand across reels",
      "Free spins with escalating wild multiplier values",
      "Sticky wilds during re-spins",
      "Bonus Buy at 65x stake",
      "Max win: 10,000x — one of the highest in Hacksaw's lineup",
    ],
    streamerTake:
      "Chaos Crew 3 is peak Hacksaw energy. The wild mechanics in free spins can create absolutely wild sequences — I've seen 500x+ from a single spin when multiplied wilds line up perfectly. It's chaotic in the best way. Always a crowd pleaser when I pull the buy feature on stream — chat absolutely erupts.",
    finalVerdict:
      "Chaos Crew 3 delivers everything you want from a Hacksaw title: chaos, colour, and serious win potential. The escalating multiplier wilds make free spins genuinely thrilling, and the 10,000x ceiling means the sky is the limit on a hot session.",
    gamingTips: [
      "Multiple overlapping wild multipliers is where the magic happens",
      "The escalating multiplier during free spins rewards longer sessions",
      "Consider the bonus buy if your session is short on time",
      "True high-variance — expect big swings in both directions",
    ],
  },
  {
    id: "6",
    gameName: "Wanted Dead or Wild",
    provider: "Hacksaw Gaming",
    providerColor: "#fb923c",
    imageUrl: "/images/wanted-dead-or-wild.jpg",
    gradientFallback: "linear-gradient(135deg, #fb923c 0%, #f97316 40%, #c2410c 100%)",
    rtp: 96.38,
    volatility: "VERY HIGH",
    releaseDate: "2022-04",
    maxWin: "12,500x",
    minBet: "$0.10",
    maxBet: "$100",
    streamerRating: 9.6,
    userRating: 9.4,
    userRatingCount: 2891,
    tags: ["STREAMER FAV"],
    about:
      "Wanted Dead or Wild is one of Hacksaw Gaming's crown jewels — a Wild West-themed slot that consistently delivers some of the most memorable moments in streaming history. Set in a dusty frontier town, the outlaw cast brings personality to every spin. Its free spins mechanic with sticky expanding wilds has produced legendary wins, making it a perennial favourite on stream.",
    bettingAndFeatures:
      "Stakes run from $0.10 to $100 on a 5x3 grid with 20 paylines. The slot's most powerful feature is the free spins round, where sticky expanding wilds can cover entire reels and persist throughout the feature. A direct Buy Feature costs 85x the bet. The combination of solid RTP, extreme variance, and a 12,500x ceiling makes this a standout.",
    gameplayFeatures: [
      "5x3 grid with 20 fixed paylines",
      "Sticky expanding wilds that hold their position in free spins",
      "Free spins triggered by 3+ scatter symbols",
      "Wild multipliers active during the feature",
      "Bonus Buy at 85x stake",
      "Max win: 12,500x — one of the highest in the Hacksaw lineup",
    ],
    streamerTake:
      "Wanted Dead or Wild is THE slot for big bonus hunt results. I've had more memorable hits on this game than almost anything else. When the free spins kick in and the sticky wilds start stacking reels, the whole chat goes insane. There's no feeling quite like watching full-reel wilds multiply — absolute cinema.",
    finalVerdict:
      "Wanted Dead or Wild is a masterpiece of slot design. It's volatile, cinematic, and rewards patience with some of the most spectacular wins in online slot history. A permanent fixture in our Points Shop for good reason — this is AUSlots royalty.",
    gamingTips: [
      "Sticky wilds covering 3+ reels simultaneously is the dream trigger",
      "Free spins on higher bets compound wild multipliers dramatically",
      "The bonus buy is efficient — 85x provides great value for serious sessions",
      "Pure high-variance hunt slot; set realistic expectations and enjoy the ride",
    ],
  },
  {
    id: "7",
    gameName: "RIP City",
    provider: "Hacksaw Gaming",
    providerColor: "#34d399",
    imageUrl: "/images/rip-city.png",
    gradientFallback: "linear-gradient(135deg, #34d399 0%, #10b981 40%, #065f46 100%)",
    rtp: 96.0,
    volatility: "VERY HIGH",
    releaseDate: "2023-05",
    maxWin: "10,000x",
    minBet: "$0.10",
    maxBet: "$100",
    streamerRating: 8.8,
    userRating: 8.5,
    userRatingCount: 1123,
    tags: ["HOT"],
    about:
      "RIP City is Hacksaw Gaming's graveyard-themed slot with a dark, gothic aesthetic that stands out in a crowded market. The slot blends eerie visuals with hard-hitting mechanics, including a unique afterlife bonus mechanic that can deliver multiplied free spins. Perfect for players who want edge and atmosphere alongside their high variance experience.",
    bettingAndFeatures:
      "Bets start at $0.10, with a $100 maximum on the 5x3 grid. RIP City features a cascading win mechanic and a multi-level bonus that collects souls throughout the base game for enhanced free spins multipliers. Bonus Buy is available, providing direct access to the free spins feature.",
    gameplayFeatures: [
      "5x3 grid with cascading symbols",
      "Soul collection mechanic builds up in the base game",
      "Multi-level free spins with enhanced multipliers per tier",
      "Wild symbols active throughout all modes",
      "Bonus Buy for direct feature access",
      "Max win: 10,000x",
    ],
    streamerTake:
      "RIP City is dark, moody, and dangerous — perfect for a late-night bonus hunt stream. The soul collection mechanic adds an extra layer of anticipation, and when you trigger the higher-tier free spins, the multipliers can get genuinely scary. It's a slot with real personality that rewards patience.",
    finalVerdict:
      "RIP City is a standout Hacksaw title for players who want their slots with a side of atmosphere. The mechanics are solid, the aesthetic is refreshing, and the win potential sits firmly in top-tier territory. Great for streamers and players who enjoy a different vibe.",
    gamingTips: [
      "Prioritise collecting souls in the base game to enhance free spins",
      "Higher-tier free spins deliver meaningfully better multipliers — aim for them",
      "The gothic theme pairs best with high stakes for maximum atmosphere",
      "Don't rush through base game spins — soul collection is crucial",
    ],
  },
  {
    id: "8",
    gameName: "Crazy Ex Girlfriend",
    provider: "Nolimit City",
    providerColor: "#ff6b6b",
    imageUrl: "/images/crazy_ex_girlfriend.webp",
    gradientFallback: "linear-gradient(135deg, #ff6b6b 0%, #c0392b 50%, #8b0000 100%)",
    rtp: 96.0,
    volatility: "VERY HIGH",
    releaseDate: "2023-12",
    maxWin: "40,000x",
    minBet: "$0.20",
    maxBet: "$100",
    streamerRating: 9.4,
    userRating: 9.2,
    userRatingCount: 1789,
    tags: ["HOT"],
    about:
      "Crazy Ex Girlfriend from Nolimit City is a darkly comic slot that perfectly captures the studio's signature flair for storytelling and mechanical innovation. The high-energy love-gone-wrong narrative plays out across 5 reels with Nolimit's trademark xWays and xNudge mechanics, delivering the kind of explosive variance that has made the developer legendary in the streaming community.",
    bettingAndFeatures:
      "Stakes range from $0.20 to $100. Nolimit City's xWays mechanic allows reel symbols to expand and multiply the number of ways to win, while xNudge wilds with multipliers inch into full view and stack their values. Free spins are triggered by scatter appearances, and the xBomb mechanic can clear reels and add multipliers simultaneously.",
    gameplayFeatures: [
      "5-reel layout with Nolimit City's xWays expanding symbols",
      "xNudge wilds with stacking multiplier values",
      "xBomb symbols clear reels and simultaneously add multipliers",
      "Free spins with enhanced xWays and xNudge triggers",
      "Bonus Buy available in supported regions",
      "Maximum win: 40,000x stake — one of the highest in the industry",
    ],
    streamerTake:
      "Crazy Ex Girlfriend has that unmistakable Nolimit City energy — a bit unhinged, totally entertaining, and capable of absolutely wild results. The 40,000x ceiling is no joke. I've had free spins on this slot where xBombs and xNudge wilds combined and just went completely ballistic. Brilliant concept, brilliant execution.",
    finalVerdict:
      "Nolimit City has done it again. Crazy Ex Girlfriend combines their best mechanics with a hilarious theme and a ceiling that most slots can't touch. If you're chasing a life-changing hit, this is the kind of slot you build your bonus hunt around.",
    gamingTips: [
      "Understand the xNudge wild mechanic — stacking multipliers is the key",
      "xBombs combined with wild multipliers can create exponential results",
      "The 40,000x ceiling is rare but achievable — bankroll accordingly",
      "Nolimit City games generally have shorter bonus frequencies; expect dry spells",
    ],
  },
  {
    id: "9",
    gameName: "Le Bandit",
    provider: "Nolimit City",
    providerColor: "#fde68a",
    imageUrl: "/images/le-bandit.jpg",
    gradientFallback: "linear-gradient(135deg, #fde68a 0%, #f59e0b 40%, #92400e 100%)",
    rtp: 96.05,
    volatility: "VERY HIGH",
    releaseDate: "2021-04",
    maxWin: "46,000x",
    minBet: "$0.20",
    maxBet: "$100",
    streamerRating: 9.0,
    userRating: 8.7,
    userRatingCount: 2234,
    tags: ["CLASSIC"],
    about:
      "Le Bandit is a Nolimit City classic — a Wild West-themed heist slot that introduced many players to the studio's signature volatile style. With a charming outlaw protagonist and mechanics built around their trademark xWays system, Le Bandit blends narrative charm with mechanics that can produce extraordinary, rare results. It remains one of the most loved Nolimit titles in the community.",
    bettingAndFeatures:
      "Bets run from $0.20 to $100. Le Bandit uses a 5-reel setup with Nolimit's xWays symbols, which randomly expand to show 2–4 symbols per reel position, multiplying ways to win. The train heist mechanic activates bonus rounds with increasing complexity, and xNudge wilds deliver multiplied payouts during key moments.",
    gameplayFeatures: [
      "5-reel layout with xWays expanding symbols (2–4 per reel position)",
      "Train heist narrative-driven bonus mechanics",
      "xNudge wilds with stacking multiplier values",
      "Multiple bonus levels with escalating rewards",
      "Bonus Buy available in many regions",
      "Max win: 46,000x stake",
    ],
    streamerTake:
      "Le Bandit is a Nolimit City classic I keep coming back to. It doesn't have the flashiest modern presentation, but when xWays start multiplying alongside a nudge wild — it's electric. Some of my most memorable stream moments have come from Le Bandit bonus rounds that just went absolutely haywire.",
    finalVerdict:
      "A Nolimit City classic that holds up perfectly. Le Bandit's xWays mechanics and outlaw charm make it one of the most rewatchable slots in the genre. The win ceiling is staggering, and the bonus mechanics deliver genuine excitement every time they trigger.",
    gamingTips: [
      "xWays expanding to 4 symbols simultaneously is a massive ways-to-win multiplier",
      "Stack xNudge wilds to compound the multiplier effect",
      "The deeper bonus levels deliver the biggest rewards — aim for them",
      "Patience is essential; the high variance demands longer sessions",
    ],
  },
  {
    id: "10",
    gameName: "Zeus vs Hades",
    provider: "Pragmatic Play",
    providerColor: "#facc15",
    imageUrl: "/images/zeus-vs-hades.png",
    gradientFallback: "linear-gradient(135deg, #facc15 0%, #eab308 40%, #854d0e 100%)",
    rtp: 96.5,
    volatility: "VERY HIGH",
    releaseDate: "2023-06",
    maxWin: "5,000x",
    minBet: "$0.20",
    maxBet: "$125",
    streamerRating: 8.7,
    userRating: 8.5,
    userRatingCount: 1345,
    tags: ["HOT"],
    about:
      "Zeus vs Hades: Gods of War from Pragmatic Play pits the rulers of Olympus and the Underworld against each other in a 5x3 showdown. The clash-of-the-gods theme is brought to life with stunning cinematic visuals and a mechanics suite that combines oversized Power symbols, collapsing reels, and a unique dual-deity free spins battle mechanic.",
    bettingAndFeatures:
      "Stakes run from $0.20 to $125. The slot features Power symbols that land as large 2x2, 3x3, or 4x4 blocks covering multiple positions and paying big. Collapsing reels trigger chain wins, and the free spins bonus puts Zeus and Hades in direct competition — the winning deity determines the multiplier level applied to all wins during the feature.",
    gameplayFeatures: [
      "5x3 grid with oversized Power symbols (2x2 to 4x4)",
      "Collapsing reels create chain wins",
      "Dual-deity free spins: Zeus vs Hades multiplier battle",
      "Winning deity enhances multiplier strength for the entire session",
      "Power multipliers active throughout free spins",
      "Max win: 5,000x stake",
    ],
    streamerTake:
      "Zeus vs Hades is a proper spectacle. The oversized Power symbols crashing onto the reels look incredible on stream, and when free spins trigger and the god battle begins, chat always gets invested in who wins. The mechanics feel like a natural evolution of Pragmatic's power-symbol formula and it delivers big regularly.",
    finalVerdict:
      "Zeus vs Hades: Gods of War is Pragmatic Play at their cinematic best. The Power symbol mechanics and deity battle feature feel genuinely innovative. Strong visuals, solid mechanics, and a reliable hit frequency make this one of Pragmatic's strongest titles of 2023.",
    gamingTips: [
      "Oversized Power symbols covering 3x3+ are the biggest single-spin triggers",
      "Chain wins from collapsing reels can compound rapidly",
      "Track which deity wins in free spins — Zeus tends to deliver higher multipliers",
      "Works well at both lower and higher bet levels due to the Power symbol mechanic",
    ],
  },
];

export const providers = [...new Set(reviews.map((r) => r.provider))];
export const volatilities: Volatility[] = ["LOW", "MEDIUM", "HIGH", "VERY HIGH"];
