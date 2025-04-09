import type { DevotionalView } from "@/types/devotional"

// Mock data for testing
export const mockDevotionals: DevotionalView[] = [
  {
    devotion_id: 1,
    title: "Beginning the Journey",
    opening_prayer: "Lord, as we begin this journey together, open our hearts to your wisdom and grace.",
    opening_prayer_source: "Book of Common Prayer",
    closing_prayer: "May the road rise up to meet you, may the wind be always at your back.",
    closing_prayer_source: "Traditional Irish Blessing",
    song_title: "Amazing Grace",
    psalm_reference: "Psalm 1:1-6",
    psalm_text:
      "Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers, but whose delight is in the law of the Lord, and who meditates on his law day and night.",
    scriptures: JSON.stringify({
      monday: "Genesis 1:1-5 - In the beginning God created the heavens and the earth.",
      tuesday: 'Exodus 3:14 - God said to Moses, "I AM WHO I AM."',
      wednesday: "Isaiah 40:31 - But those who hope in the LORD will renew their strength.",
      thursday: "Matthew 5:3-12 - Blessed are the poor in spirit, for theirs is the kingdom of heaven.",
      friday: "John 1:1-5 - In the beginning was the Word, and the Word was with God.",
      saturday: "Romans 8:38-39 - For I am convinced that neither death nor life...",
      sunday: 'Revelation 21:5 - He who was seated on the throne said, "I am making everything new!"',
    }),
    reading_for_reflection: JSON.stringify({
      monday: "As we begin our week, consider how God's creative work continues in your life today.",
      tuesday: "God's self-revelation as 'I AM' invites us to consider who God is in our lives.",
      wednesday: "Reflect on times when your strength has been renewed through hope.",
      thursday: "The Beatitudes offer a counter-cultural vision of blessing. Which one speaks to you today?",
      friday: "The Word became flesh and made his dwelling among us. How do you experience God's presence?",
      saturday: "Nothing can separate us from God's love. Rest in this assurance today.",
      sunday: "God is making all things new. Where do you see renewal in your life and community?",
    }),
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    devotion_id: 42,
    title: "Finding Peace in Troubled Times",
    opening_prayer:
      "God of peace, who has taught us that in returning and rest we shall be saved, in quietness and confidence shall be our strength.",
    opening_prayer_source: "Book of Common Prayer",
    closing_prayer: "O Lord, support us all the day long, until the shadows lengthen, and the evening comes.",
    closing_prayer_source: "Cardinal Newman",
    song_title: "It Is Well With My Soul",
    psalm_reference: "Psalm 46:1-11",
    psalm_text:
      "God is our refuge and strength, an ever-present help in trouble. Therefore we will not fear, though the earth give way and the mountains fall into the heart of the sea.",
    scriptures: JSON.stringify({
      monday:
        "Isaiah 26:3 - You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
      tuesday: "Matthew 11:28-30 - Come to me, all you who are weary and burdened, and I will give you rest.",
      wednesday: "John 14:27 - Peace I leave with you; my peace I give you. I do not give to you as the world gives.",
      thursday:
        "Philippians 4:6-7 - Do not be anxious about anything, but in every situation, by prayer and petition...",
      friday:
        "Colossians 3:15 - Let the peace of Christ rule in your hearts, since as members of one body you were called to peace.",
      saturday:
        "2 Thessalonians 3:16 - Now may the Lord of peace himself give you peace at all times and in every way.",
      sunday: "Hebrews 12:14 - Make every effort to live in peace with everyone and to be holy.",
    }),
    reading_for_reflection: JSON.stringify({
      monday: "Peace begins with a mind steadfastly focused on God. How might you keep your mind on God today?",
      tuesday: "Christ invites us to bring our burdens to him. What burdens do you need to surrender?",
      wednesday: "The peace Christ gives differs from worldly peace. How have you experienced this difference?",
      thursday:
        "Anxiety is replaced with peace when we bring everything to God in prayer. What anxieties do you need to bring to God?",
      friday:
        "When we allow Christ's peace to rule in our hearts, it affects our relationships with others. How can you be a peacemaker today?",
      saturday:
        "God's peace is available 'at all times and in every way.' Where do you most need God's peace right now?",
      sunday:
        "Making 'every effort to live in peace with everyone' requires intentionality. What practical steps can you take this week?",
    }),
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    devotion_id: 52,
    title: "Endings and New Beginnings",
    opening_prayer:
      "Eternal God, you call us to ventures of which we cannot see the ending, by paths as yet untrodden, through perils unknown.",
    opening_prayer_source: "Lutheran Book of Worship",
    closing_prayer:
      "May God bless you with discomfort at easy answers, half-truths, and superficial relationships, so that you may live deep within your heart.",
    closing_prayer_source: "Franciscan Blessing",
    song_title: "Great Is Thy Faithfulness",
    psalm_reference: "Psalm 121:1-8",
    psalm_text:
      "I lift up my eyes to the mountains—where does my help come from? My help comes from the LORD, the Maker of heaven and earth.",
    scriptures: JSON.stringify({
      monday: "Ecclesiastes 3:1-8 - There is a time for everything, and a season for every activity under the heavens.",
      tuesday: "Isaiah 43:18-19 - Forget the former things; do not dwell on the past. See, I am doing a new thing!",
      wednesday:
        "Lamentations 3:22-23 - Because of the LORD's great love we are not consumed, for his compassions never fail. They are new every morning.",
      thursday: "Matthew 28:19-20 - Therefore go and make disciples of all nations... And surely I am with you always.",
      friday:
        "2 Corinthians 5:17 - Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
      saturday:
        "Philippians 3:13-14 - Forgetting what is behind and straining toward what is ahead, I press on toward the goal.",
      sunday:
        "Revelation 21:1-5 - Then I saw a new heaven and a new earth, for the first heaven and the first earth had passed away.",
    }),
    reading_for_reflection: JSON.stringify({
      monday: "Life moves in seasons. What season are you in right now, and how is God present in it?",
      tuesday: "God is always doing new things. Where do you see God at work in new ways in your life?",
      wednesday: "God's mercies are new every morning. How have you experienced God's compassion recently?",
      thursday: "Christ promises to be with us always as we follow his commission. How does this promise sustain you?",
      friday:
        "In Christ, we become new creations. What old patterns need to be released, and what new life is emerging?",
      saturday: "Paul encourages us to press on toward the goal. What spiritual goals are you pursuing?",
      sunday:
        "The vision of a new heaven and earth reminds us that God's work of renewal is cosmic in scope. How does this expand your hope?",
    }),
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
]
