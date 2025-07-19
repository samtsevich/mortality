import { Action, ActionPanel, Detail, List, LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";

function calculateGlobalDemographics(userAge: number) {
  // Simplified global age distribution based on UN World Population data
  // These are approximate percentages for global population by age groups
  const ageDistribution = [
    { range: "0-4", percentage: 8.7 },
    { range: "5-9", percentage: 8.8 },
    { range: "10-14", percentage: 8.6 },
    { range: "15-19", percentage: 8.2 },
    { range: "20-24", percentage: 7.9 },
    { range: "25-29", percentage: 7.8 },
    { range: "30-34", percentage: 7.4 },
    { range: "35-39", percentage: 6.9 },
    { range: "40-44", percentage: 6.4 },
    { range: "45-49", percentage: 6.0 },
    { range: "50-54", percentage: 5.4 },
    { range: "55-59", percentage: 4.7 },
    { range: "60-64", percentage: 4.0 },
    { range: "65-69", percentage: 3.2 },
    { range: "70-74", percentage: 2.4 },
    { range: "75-79", percentage: 1.7 },
    { range: "80+", percentage: 1.9 },
  ];

  let youngerPercentage = 0;
  let olderPercentage = 0;
  let sameAgePercentage = 0;

  for (const group of ageDistribution) {
    const [minAge, maxAge] = group.range.includes("+")
      ? [80, 100]
      : group.range.split("-").map(Number);

    if (maxAge < userAge) {
      youngerPercentage += group.percentage;
    } else if (minAge > userAge) {
      olderPercentage += group.percentage;
    } else {
      // User falls within this age group
      sameAgePercentage = group.percentage;
      // Split the group proportionally
      const groupSize = maxAge - minAge + 1;
      const userPositionInGroup = userAge - minAge;
      const youngerInGroup =
        (userPositionInGroup / groupSize) * group.percentage;
      const olderInGroup =
        ((groupSize - userPositionInGroup - 1) / groupSize) * group.percentage;

      youngerPercentage += youngerInGroup;
      olderPercentage += olderInGroup;
    }
  }

  return {
    younger: Math.round(youngerPercentage * 10) / 10,
    older: Math.round(olderPercentage * 10) / 10,
    sameAge: Math.round(sameAgePercentage * 10) / 10,
  };
}

function generateAgeBar(youngerPercent: number, olderPercent: number): string {
  const totalBars = 20;
  const youngerBars = Math.round((youngerPercent / 100) * totalBars);
  const olderBars = Math.round((olderPercent / 100) * totalBars);
  const userBar = 1;
  const remainingBars = totalBars - youngerBars - olderBars - userBar;

  let bar = "";

  // Younger people (blue)
  for (let i = 0; i < youngerBars; i++) {
    bar += "🟦";
  }

  // User (red)
  bar += "🟥";

  // Older people (gray)
  for (let i = 0; i < olderBars; i++) {
    bar += "⬜";
  }

  // Fill remaining with empty if needed
  for (let i = 0; i < remainingBars; i++) {
    bar += "⬛";
  }

  return bar;
}

export default function Command() {
  const [dob, setDob] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedDob = await LocalStorage.getItem<string>("dob");
      if (storedDob) {
        const date = new Date(storedDob);
        setDob(date);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Detail markdown="# Loading..." />;
  }

  if (!dob) {
    return (
      <Detail markdown="# Error\n\nPlease set your date of birth in the main Mortality command first." />
    );
  }

  const userAge = Math.floor(
    (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  );
  const demographics = calculateGlobalDemographics(userAge);
  const ageBar = generateAgeBar(demographics.younger, demographics.older);

  // Calculate absolute numbers (approximate global population: 8 billion)
  const globalPopulation = 8000000000;
  const youngerPeople = Math.round(
    (demographics.younger / 100) * globalPopulation,
  );
  const olderPeople = Math.round((demographics.older / 100) * globalPopulation);
  const sameAgePeople = Math.round(
    (demographics.sameAge / 100) * globalPopulation,
  );

  const markdown = `
# Global Age Demographics

## You are ${userAge} years old

### Where you stand globally:

${ageBar}

**🟦 Younger than you:** ${demographics.younger}% (≈${(youngerPeople / 1000000000).toFixed(1)}B people)
**🟥 Your age:** You are here
**⬜ Older than you:** ${demographics.older}% (≈${(olderPeople / 1000000000).toFixed(1)}B people)

---

### Detailed Statistics:

**People younger than you:** ${youngerPeople.toLocaleString()}
**People your age (±1 year):** ${sameAgePeople.toLocaleString()}  
**People older than you:** ${olderPeople.toLocaleString()}

**You are older than ${demographics.younger}% of the world's population**
**You are younger than ${demographics.older}% of the world's population**

---

### Age Perspective:

${
  userAge < 25
    ? "🌱 You're in the younger quarter of the global population"
    : userAge < 35
      ? "🌿 You're in the prime working age demographic"
      : userAge < 50
        ? "🌳 You're in the experienced adult demographic"
        : userAge < 65
          ? "🍂 You're approaching or in the senior demographic"
          : "🏛️ You're in the elder demographic - a repository of wisdom"
}

*Data based on UN World Population statistics (approximate)*
  `;

  // Generate compact age position bar for list view
  const totalSquares = 10;
  const youngerSquares = Math.round(
    (demographics.younger / 100) * totalSquares,
  );
  const olderSquares = Math.round((demographics.older / 100) * totalSquares);
  const userSquare = 1;
  const remainingSquares = Math.max(
    0,
    totalSquares - youngerSquares - olderSquares - userSquare,
  );

  const compactProgress =
    "■".repeat(youngerSquares) +
    "●" +
    "□".repeat(olderSquares) +
    "·".repeat(remainingSquares);

  return (
    <List>
      <List.Item
        title="Global Age Demographics"
        subtitle={`${compactProgress} Age ${userAge}`}
        accessories={[
          {
            text: `${demographics.younger}% younger`,
          },
        ]}
        actions={
          <ActionPanel>
            <Action.Push
              title="View Details"
              target={
                <Detail
                  markdown={markdown}
                  actions={
                    <ActionPanel>
                      <Action title="Refresh" onAction={() => {}} />
                    </ActionPanel>
                  }
                />
              }
            />
            <Action title="Refresh" onAction={() => {}} />
          </ActionPanel>
        }
      />
    </List>
  );
}
