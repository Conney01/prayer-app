import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const situationMap: Record<string, string[]> = {
  "daily-prayers": [
    "Prayer When Waking Up",
    "Morning Prayer",
    "Prayer of Gratitude in the Morning",
    "Prayer Before Breakfast",
    "Prayer Before Lunch",
    "Prayer Before Dinner",
    "Evening Prayer",
    "Prayer Before Going to Bed",
    "Prayer for Peaceful Sleep",
    "Prayer for a New Day",
    "Prayer to End the Day",
    "Prayer of Thanksgiving",
    "Prayer for God's Presence Throughout the Day",
  ],
  "forgiveness-repentance": [
    "Prayer for Forgiveness",
    "Prayer of Repentance",
    "Prayer for Forgiveness of Sins",
    "Prayer of Genuine Repentance",
    "Prayer for a Repentant Heart",
    "Prayer for a Fresh Start",
    "Prayer for God's Mercy",
    "Prayer for Forgiving Yourself",
    "Prayer for Reconciliation",
    "Prayer After Hurting Someone",
    "Prayer When You Have Wronged Someone",
    "Prayer Before Asking Someone for Forgiveness",
    "Prayer for Healing a Broken Relationship",
    "Prayer for Restoring a Friendship",
    "Prayer for Family Reconciliation",
    "Prayer for Reconciliation in a Relationship",
    "Prayer for Peace After Conflict",
    "Prayer for the Grace to Forgive Others",
    "Prayer When Someone Has Hurt You",
    "Prayer to Let Go of Resentment",
    "Prayer for Freedom from Bitterness",
    "Prayer for Restoring Trust",
  ],
  "difficult-emotions": [
    "Prayer for Sadness",
    "Prayer for Loneliness",
    "Prayer When Feeling Overwhelmed",
    "Prayer When Feeling Lost",
    "Prayer in Hopelessness",
    "Prayer Against Discouragement",
    "Prayer in Anger",
    "Prayer When Experiencing Fear",
    "Prayer When Carrying Guilt",
    "Prayer in Shame",
    "Prayer When Experiencing Rejection",
    "Prayer After Betrayal",
    "Prayer in Disappointment",
    "Prayer During Confusion",
    "Prayer When Not Knowing What to Do",
    "Prayer for a Heavy Heart",
    "Prayer for Emotional Strength",
    "Prayer for Inner Peace",
    "Prayer for Comfort",
    "Prayer for Hope",
  ],
  "anxiety-worry-stress": [
    "Prayer for Anxiety",
    "Prayer When Worried",
    "Prayer When Overthinking",
    "Prayer for Peace of Mind",
    "Prayer for Stress",
    "Prayer Before a Difficult Situation",
    "Prayer When Afraid of the Future",
    "Prayer When Facing Uncertainty",
    "Prayer for Calmness",
    "Prayer When You Feel Overwhelmed",
    "Prayer for Strength During Difficult Times",
    "Prayer When You Can't Stop Worrying",
    "Prayer for Trust",
    "Prayer When Waiting for an Answer",
  ],
  "school-studies-exams": [
    "Prayer Before Studying",
    "Prayer Before an Exam",
    "Prayer During Exams",
    "Prayer After an Exam",
    "Prayer for Concentration",
    "Prayer for Wisdom",
    "Prayer for Understanding",
    "Prayer for Memory",
    "Prayer for Academic Success",
    "Prayer When Struggling With School",
    "Prayer When Feeling Overwhelmed by School",
    "Prayer Before a Presentation",
    "Prayer Before an Important Assignment",
    "Prayer for Motivation to Study",
    "Prayer for Students",
    "Prayer for Teachers",
    "Prayer for Graduation",
    "Prayer When Waiting for Exam Results",
  ],
  "work-career-business": [
    "Prayer Before Going to Work",
    "Prayer for a New Job",
    "Prayer for Finding Employment",
    "Prayer Before an Interview",
    "Prayer for Career Guidance",
    "Prayer for Success at Work",
    "Prayer for Wisdom at Work",
    "Prayer for Good Relationships With Coworkers",
    "Prayer for a Difficult Workplace",
    "Prayer When Starting a Business",
    "Prayer for Business Success",
    "Prayer for Good Decisions",
    "Prayer for Financial Wisdom",
    "Prayer When Facing Unemployment",
    "Prayer for a Promotion",
    "Prayer Before an Important Meeting",
  ],
  "financial-difficulties": [
    "Prayer for Financial Provision",
    "Prayer During Financial Hardship",
    "Prayer When You Have Debts",
    "Prayer for Financial Wisdom",
    "Prayer for Responsible Spending",
    "Prayer When You Are Struggling to Make Ends Meet",
    "Prayer for a Job",
    "Prayer for Business Provision",
    "Prayer for Contentment",
    "Prayer Against Fear About Money",
    "Prayer of Gratitude for What You Have",
  ],
  "family": [
    "Prayer for Your Family",
    "Prayer for Parents",
    "Prayer for Children",
    "Prayer for Siblings",
    "Prayer for Family Unity",
    "Prayer for Family Peace",
    "Prayer for Family Protection",
    "Prayer for a Struggling Family Member",
    "Prayer for Family Reconciliation",
    "Prayer for a New Family",
    "Prayer for Wisdom as a Parent",
    "Prayer for Grandparents",
    "Prayer for a Loved One",
    "Prayer When Your Family Is Going Through a Difficult Time",
  ],
  "love-relationships": [
    "Prayer for Your Relationship",
    "Prayer for a Healthy Relationship",
    "Prayer for Your Partner",
    "Prayer for Someone You Love",
    "Prayer for Wisdom in Love",
    "Prayer Before Entering a Relationship",
    "Prayer for a Relationship Facing Difficulties",
    "Prayer for Healing After a Breakup",
    "Prayer for Reconciliation",
    "Prayer for Patience in Relationships",
    "Prayer for Trust",
    "Prayer for Communication",
    "Prayer for Commitment",
    "Prayer for Guidance About a Relationship",
  ],
  "health-healing": [
    "Prayer for Healing",
    "Prayer for Someone Who Is Sick",
    "Prayer Before a Medical Procedure",
    "Prayer for Strength During Illness",
    "Prayer for Someone in Hospital",
    "Prayer for a Family Member Who Is Sick",
    "Prayer for Recovery",
    "Prayer for Comfort During Illness",
    "Prayer for Medical Professionals",
    "Prayer for Strength During a Long Recovery",
    "Prayer of Gratitude for Improved Health",
  ],
  "protection-safety": [
    "Prayer for Protection",
    "Prayer Before Leaving Home",
    "Prayer While Traveling",
    "Prayer for Safe Travel",
    "Prayer for Your Family's Protection",
    "Prayer Before a Journey",
    "Prayer for Protection at Night",
    "Prayer for Protection at Work",
    "Prayer for Protection at School",
    "Prayer for Peace in Your Home",
    "Prayer During Difficult Circumstances",
  ],
  "guidance-decisions": [
    "Prayer for Guidance",
    "Prayer Before Making a Decision",
    "Prayer for Wisdom",
    "Prayer When You Don't Know Which Path to Take",
    "Prayer for Direction",
    "Prayer When Facing a Difficult Choice",
    "Prayer for Patience While Waiting",
    "Prayer for Clarity",
    "Prayer Before Starting Something New",
    "Prayer When Facing Change",
    "Prayer for Courage to Make the Right Decision",
  ],
  "difficult-times-hardships": [
    "Prayer During Difficult Times",
    "Prayer When Everything Feels Difficult",
    "Prayer During a Crisis",
    "Prayer for Strength",
    "Prayer When You Feel Like Giving Up",
    "Prayer During a Major Life Change",
    "Prayer During a Family Crisis",
    "Prayer During Financial Hardship",
    "Prayer During Uncertainty",
    "Prayer for Hope During Hard Times",
    "Prayer for Courage",
    "Prayer for Endurance",
  ],
  "gratitude-thanksgiving": [
    "Prayer of Thanksgiving",
    "Prayer for Being Grateful",
    "Prayer for Blessings Received",
    "Prayer of Gratitude for Family",
    "Prayer of Gratitude for Friends",
    "Prayer of Gratitude for Another Day",
    "Prayer of Gratitude After Difficult Times",
    "Prayer of Thanksgiving After Receiving Good News",
    "Prayer When Things Are Going Well",
    "Prayer of Gratitude Before a Meal",
  ],
  "special-occasions": [
    "Birthday Prayer",
    "Prayer Before a Birthday Celebration",
    "Graduation Prayer",
    "Wedding Prayer",
    "Prayer Before a Wedding",
    "Anniversary Prayer",
    "New Home Prayer",
    "New Job Prayer",
    "New School/University Prayer",
    "Prayer Before Starting a New Chapter",
    "Prayer for Someone Starting a New Journey",
    "Prayer for a New Year",
    "Prayer for a New Month",
    "Prayer for a New Week",
  ],
  "spiritual-growth": [
    "Prayer to Grow Closer to God",
    "Prayer for Stronger Faith",
    "Prayer for a Deeper Prayer Life",
    "Prayer for Spiritual Strength",
    "Prayer for Wisdom",
    "Prayer for Humility",
    "Prayer for Patience",
    "Prayer for Discipline",
    "Prayer for Courage",
    "Prayer for Self-Control",
    "Prayer for a Pure Heart",
    "Prayer for a Grateful Heart",
    "Prayer for God's Guidance",
    "Prayer for Consistency in Prayer",
  ],
};

async function main() {
  console.log("Seeding all situations for 16 categories...");

  for (const [categorySlug, situations] of Object.entries(situationMap)) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      console.warn(`Category ${categorySlug} not found. Skipping.`);
      continue;
    }

    for (const sitName of situations) {
      const sitSlug = slugify(sitName);

      await prisma.situation.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: sitSlug } },
        update: { name: sitName, categoryId: category.id },
        create: {
          name: sitName,
          slug: sitSlug,
          categoryId: category.id,
        },
      });
    }
  }

  console.log("✓ All situations seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });