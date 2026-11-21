// Ten Little Surprise Envelopes Data for Commander Estelle
// STRICT RULE: No direct friendship or love labels.
// Tone: Balanced combination of playful humour, warmth, subtle affection, and emotional meaning.

export const envelopesData = [
  {
    id: 1,
    number: "01",
    title: "The Little Beginning",
    category: "Day 01 • Origin Story",
    sealEmblem: "✦",
    sealColor: "#D4AF37", // Champagne Gold
    envelopeTone: "lavender",
    stampText: "FIRST PING • DAY 001",
    message: "Looking back, Day 1 gave absolutely zero warning of what was coming. It started like any completely ordinary exchange—two people casually chatting across screens with no script and no master plan. Neither of us planned for it to stretch across weeks, let alone a hundred days. But somewhere between the first few messages, an ordinary chat quietly turned into something I genuinely look forward to every single day.",
    subtext: "Proof that sometimes the best things in life start without an announcement.",
    icon: "Sparkles"
  },
  {
    id: 2,
    number: "02",
    title: "The Unexpected Smile",
    category: "Daily Hazard • Mood Lifter",
    sealEmblem: "☼",
    sealColor: "#E29578", // Warm Terracotta Rose
    envelopeTone: "blush",
    stampText: "SURPRISE DELIVERY",
    message: "You have this completely effortless, slightly unfair ability: you can drop a single ridiculous comment or an out-of-nowhere tangent right in the middle of a chaotic day, and suddenly the whole mood flips. It’s almost impossible to take a stressful day seriously when your notification lights up with something completely unhinged.",
    subtext: "Officially cited for causing sudden, unexplainable grins in quiet rooms.",
    icon: "Smile"
  },
  {
    id: 3,
    number: "03",
    title: "The Little Details",
    category: "Curated Observations",
    sealEmblem: "❦",
    sealColor: "#B58A38", // Antique Gold
    envelopeTone: "ivory",
    stampText: "RESERVED MEMORY",
    message: "It’s funny how a hundred days teach you the quiet things. The way you double down on an argument just for the drama, the sudden topics you bring up with zero transition, and the distinct rhythm in how you react. People usually remember the big milestones, but for me, it’s all these little quirks that make talking to you so easy, natural, and memorable.",
    subtext: "The small, random habits are always the ones that stick around the longest.",
    icon: "Bookmark"
  },
  {
    id: 4,
    number: "04",
    title: "The Chaos Award",
    category: "Classified Commendation",
    sealEmblem: "⚡",
    sealColor: "#845EC2", // Royal Purple
    envelopeTone: "plum",
    stampText: "TOP SECRET • LEVEL 4",
    message: "After thorough investigation spanning 100 consecutive days, headquarters has officially recognized your rare talent for turning a 2-minute straightforward question into a 45-minute theatrical expedition with zero regrets.",
    subtext: "A prestigious citation presented by unanimous decree.",
    icon: "Award",
    interactiveType: "award",
    awardData: {
      badge: "ORDER OF THE CHAOS COMMANDER",
      recipient: "COMMANDER ESTELLE",
      title: "First-Class Navigator of Unpredictable Conversations",
      citation: "Awarded for exceptional courage in introducing 5 unrelated topics simultaneously, defending ridiculous hypotheses with straight-faced conviction, and ensuring that no conversation ever stays boring for more than 4 seconds."
    }
  },
  {
    id: 5,
    number: "05",
    title: "A Small Pause",
    category: "Quiet Corner • Deep Breath",
    sealEmblem: "☕",
    sealColor: "#C98E73", // Warm Sand
    envelopeTone: "ivory",
    stampText: "SANCTUARY • CALM",
    message: "Some days are loud, hurried, and demand a lot from you. In the middle of all that noise, having this quiet little corner where there is zero pressure to perform, no expectations, and just effortless conversation—it’s genuinely comforting. Thank you for making these chats a place where taking a breath feels easy.",
    subtext: "A peaceful corner amidst busy routines and long days.",
    icon: "Coffee"
  },
  {
    id: 6,
    number: "06",
    title: "The What-If Envelope",
    category: "Classified Hypotheticals",
    sealEmblem: "◈",
    sealColor: "#4B6584", // Celestial Slate Indigo
    envelopeTone: "lavender",
    stampText: "EXPEDITION DISPATCH",
    message: "If our conversations have proven anything over these 100 days, it’s that logic rarely dictates where a topic heads next. Select our next inevitable directive:",
    subtext: "Make your choice wisely, Commander. Headquarters is monitoring.",
    icon: "Compass",
    interactiveType: "choices",
    choicesData: [
      {
        id: "penguins",
        label: "Protocol Penguin Knees",
        desc: "Debate whether penguins have secret knees at 2:00 AM",
        response: "Directive Logged! Research division confirms penguins do have knees, but our official 2:00 AM debate will question the anatomical evidence anyway. Scheduled for Day 101."
      },
      {
        id: "diplomatic",
        label: "Summit of Minor Inconveniences",
        desc: "Treat a minor daily inconvenience like a global diplomatic crisis",
        response: "Approved! Prepare the official press statement regarding the cold coffee emergency. Global leaders have been notified and negotiations are underway."
      },
      {
        id: "galaxy_run",
        label: "Intergalactic Snack Heist",
        desc: "Plan a midnight food expedition across the stars",
        response: "Navigation Locked! Hyperdrive calibrated. Packing warm tea and midnight treats. Estimated arrival: Whenever we finish laughing."
      }
    ]
  },
  {
    id: 7,
    number: "07",
    title: "The Unwritten Chapter",
    category: "Unplanned Horizons",
    sealEmblem: "✒",
    sealColor: "#D97D95", // Soft Blush Rose
    envelopeTone: "blush",
    stampText: "SPONTANEOUS DISPATCH",
    message: "The best things in life are never the ones you plan out on a calendar. We never scheduled these 100 days; we never drafted a roadmap or decided where this would go. It just happened naturally, one message at a time. And there is something very special about watching a connection grow entirely on its own rhythm, without anyone trying to force it.",
    subtext: "The most memorable chapters are always the ones written without an outline.",
    icon: "BookOpen"
  },
  {
    id: 8,
    number: "08",
    title: "A Little Challenge",
    category: "Commander Assessment",
    sealEmblem: "⚄",
    sealColor: "#8B6FA9", // Velvet Amethyst
    envelopeTone: "plum",
    stampText: "FIELD DIAGNOSTIC",
    message: "A quick three-part diagnostic to verify your Commander instincts after 100 days of active service in random conversation:",
    subtext: "Select your answers below to generate your official diagnostic profile.",
    icon: "HelpCircle",
    interactiveType: "challenge",
    challengeData: [
      {
        id: "energy",
        question: "1. Current operational energy level:",
        options: [
          { text: "Full Chaos & Caffeinated", trait: "Dynamic" },
          { text: "Running on Vibes & Luck", trait: "Spontaneous" },
          { text: "Mysteriously Calm", trait: "Unflappable" }
        ]
      },
      {
        id: "tangent",
        question: "2. When a chat tangent goes completely off course:",
        options: [
          { text: "Lean all the way in with 3 more theories", trait: "Adventurous" },
          { text: "Act like nothing happened & keep talking", trait: "Composed" },
          { text: "Drop a barrage of laughing emojis", trait: "Expressive" }
        ]
      },
      {
        id: "verdict",
        question: "3. Official verdict on surviving 100 days with me:",
        options: [
          { text: "Deserves a gold medal & lifetime trophy", trait: "Legendary" },
          { text: "Honestly a breeze—easiest 100 days ever", trait: "Effortless" },
          { text: "Ready for the next 100-day expedition", trait: "Unstoppable" }
        ]
      }
    ]
  },
  {
    id: 9,
    number: "09",
    title: "The Time Capsule",
    category: "The 100-Day Archive",
    sealEmblem: "⏳",
    sealColor: "#C59B27", // Burnished Gold
    envelopeTone: "champagne",
    stampText: "ARCHIVAL VAULT",
    message: "A curated collection of milestone moments from our 100-day journey. Tap each archival token to inspect what we've gathered along the way:",
    subtext: "Preserved securely in the Commander Estelle 100-Day Keepsake Vault.",
    icon: "Clock",
    interactiveType: "timecapsule",
    tokens: [
      {
        day: "Day 01",
        label: "The First Ping",
        summary: "The innocent, unsuspecting hello that had no idea it was starting a 100-day expedition."
      },
      {
        day: "Day 33",
        label: "Tangent Mastery",
        summary: "The official milestone where conversations stopped following conventional laws of topic transitions."
      },
      {
        day: "Day 67",
        label: "Quiet Understanding",
        summary: "The point where even a two-word message could convey an entire paragraph of shared humor."
      },
      {
        day: "Day 100",
        label: "The Unexpected Package",
        summary: "100 Little Stars, a golden pocket watch, ten secret envelopes, and many more memories in the making."
      }
    ]
  },
  {
    id: 10,
    number: "10",
    title: "To Be Continued",
    category: "Looking Forward",
    sealEmblem: "♚",
    sealColor: "#D4AF37", // Imperial Champagne Gold
    envelopeTone: "gold",
    stampText: "HORIZONS AHEAD",
    message: "100 days feels like a significant milestone, but in many ways, it only feels like the opening chapter. Every conversation with you has a way of leaving things a little brighter than they were before. So this isn’t a conclusion at all—just a celebration of how far we’ve come, and a quiet, genuine wish for many more laughs, late-night theories, and unexpected moments together.",
    subtext: "Here’s to everything we haven’t talked about yet.",
    icon: "Sparkles",
    interactiveType: "celebration",
    finalAnimationData: {
      quote: "Here’s to the conversations still unwritten, the adventures still unplanned, and every shared laugh still to come.",
      banner: "✦ TO BE CONTINUED ✦"
    }
  }
];
