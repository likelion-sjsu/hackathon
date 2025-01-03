export const questions = {
  food: [
    {
      title: "Preferred Cuisine",
      key: "cuisine",
      options: [
        {
          index: 0,
          display: "🇺🇸 American",
          value: "American",
        },
        {
          index: 1,
          display: "🇨🇳 Chinese",
          value: "Chinese",
        },
        {
          index: 2,
          display: "🇻🇳 Vietnamese",
          value: "Vietnamese",
        },
        {
          index: 3,
          display: "🇲🇽 Mexican",
          value: "Mexican",
        },
        {
          index: 4,
          display: "🇰🇷 Korean",
          value: "Korean",
        },
        {
          index: 5,
          display: "🇯🇵 Japanese",
          value: "Japanese",
        },
        {
          index: 6,
          display: "🇮🇳 Indian",
          value: "Indian",
        },
        {
          index: 7,
          display: "🇹🇭 Thai",
          value: "Thai",
        },
        {
          index: 8,
          display: "🇬🇷 Greek",
          value: "Greek",
        },
        {
          index: 9,
          display: "🇮🇹 Italian",
          value: "Italian",
        },
        {
          index: 10,
          display: "🚫 No Preference",
          value: "",
        },
      ],
    },
    {
      title: "What Are You Craving?",
      key: "type",
      options: [
        {
          index: 0,
          display: "🍚 Rice",
          value: "rice",
        },
        {
          index: 1,
          display: "🍖 Meat",
          value: "meat",
        },
        {
          index: 2,
          display: "🥗 Salad",
          value: "salad",
        },
        {
          index: 3,
          display: "🍞 Bakery",
          value: "bread",
        },
        {
          index: 4,
          display: "🍜 Noodles",
          value: "noodle",
        },
        {
          index: 5,
          display: "🍔 Fast Foods",
          value: "fast food",
        },
        {
          index: 6,
          display: "🦐 Seafood",
          value: "seafood",
        },
        {
          index: 7,
          display: "🍨 Dessert",
          value: "dessert",
        },
        {
          index: 8,
          display: "🚫 No Preference",
          value: "",
        },
      ],
    },
    {
      title: "Select Price Range",
      key: "price",
      options: [
        {
          index: 0,
          display: "0 - 10",
          value: "$0-$10",
        },
        {
          index: 1,
          display: "10 - 25",
          value: "$10-$25",
        },
        {
          index: 2,
          display: "25 - 50",
          value: "$25-$50",
        },
        {
          index: 3,
          display: "50 - 100",
          value: "$50-$100",
        },
        {
          index: 4,
          display: "100+",
          value: "$100 and up",
        },
        {
          index: 5,
          display: "🚫 No Preference",
          value: "whatever",
        },
      ],
    },
    {
      title: "Select Spicy Level",
      key: "spiciness",
      options: [
        {
          index: 0,
          display: "😌 Not Spicy",
          value: "no spicy",
        },
        {
          index: 1,
          display: "😅 Mild Spicy",
          value: "mild spicy",
        },
        {
          index: 2,
          display: "😤 Medium Spicy",
          value: "moderately spicy",
        },
        {
          index: 3,
          display: "🥵 Very Spicy",
          value: "very spicy",
        },
        {
          index: 4,
          display: "🤯 Extremely Spicy",
          value: "extremely spicy",
        },
        {
          index: 5,
          display: "🚫 No Preference",
          value: "whatever",
        },
      ],
    },
    {
      title: "Warm or Cold",
      key: "temperature",
      options: [
        {
          icon: "🍲",
          index: 0,
          display: "Warm",
          value: "warm",
        },
        {
          icon: "🍨",
          index: 1,
          display: "Cold",
          value: "cold",
        },
        {
          index: 2,
          display: "🚫 No Preference",
          value: "",
        },
      ],
    },
  ],
  hangout: [
    {
      title: "Select Hangout Time",
      key: "time",
      options: [
        {
          index: 0,
          display: "🌅 Morning",
          value: "morning",
        },
        {
          index: 1,
          display: "🏞️ Afternoon",
          value: "afternoon",
        },
        {
          index: 2,
          display: "🏙️ Evening",
          value: "evening",
        },
        {
          index: 3,
          display: "🌃 Late-Night",
          value: "late-night",
        },
        {
          index: 4,
          display: "🚫 No Preference",
          value: "whatever",
        },
      ],
    },
    {
      title: "Select Group Size",
      key: "size",
      options: [
        {
          index: 0,
          display: "👫 2-3 Friends",
          value: "2-3",
        },
        {
          index: 1,
          display: "👨‍👩‍👦 Small group (4-6)",
          value: "4-6",
        },
        {
          index: 2,
          display: "👨‍👩‍👦👨‍👩‍👦‍👦 Medium Group (7-10)",
          value: "7-10",
        },
        {
          index: 3,
          display: "👨‍👩‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦 Large Group (10+)",
          value: "10 and up",
        },
        {
          index: 4,
          display: "🚫 No Preference",
          value: "whatever",
        },
      ],
    },
    {
      title: "Indoor or Outdoor?",
      key: "place",
      options: [
        {
          icon: "🏠",
          index: 0,
          display: "Indoor",
          value: "Indoor",
        },
        {
          icon: "🪂",
          index: 1,
          display: "Outdoor",
          value: "outdoor",
        },
        {
          index: 2,
          display: "🚫 No Preference",
          value: "whatever",
        },
      ],
    },
    {
      title: "Select Vibe",
      key: "mood",
      options: [
        {
          index: 0,
          display: "Homey",
          value: "homey",
        },
        {
          index: 1,
          display: "Adventurous",
          value: "adventurous",
        },
        {
          index: 2,
          display: "Cozy",
          value: "cozy",
        },
        {
          index: 3,
          display: "Sports",
          value: "sports",
        },
        {
          index: 4,
          display: "Instagram",
          value: "instagram",
        },
        {
          index: 5,
          display: "Artistic",
          value: "artistic",
        },
        {
          index: 6,
          display: "Unique",
          value: "unique",
        },
        {
          index: 7,
          display: "🚫 No Preference",
          value: "whatever",
        },
      ],
    },
  ],
};
