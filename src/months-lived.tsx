import {
  Action,
  ActionPanel,
  Detail,
  Form,
  List,
  LocalStorage,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { calculateMortality } from "./utils";

function generateMonthVisualization(
  yearsLived: number,
  lifespanYears: number,
): string {
  const totalMonthsLived = yearsLived * 12;
  const fullMonths = Math.floor(totalMonthsLived);
  const partialMonth = totalMonthsLived - fullMonths;

  const lifespanMonths = lifespanYears * 12;
  const monthsPerRow = 12; // One year per row
  const totalRows = Math.ceil(lifespanMonths / monthsPerRow);

  let visualization = "";

  for (let row = 0; row < totalRows; row++) {
    const startMonth = row * monthsPerRow;
    const endMonth = Math.min(
      startMonth + monthsPerRow - 1,
      lifespanMonths - 1,
    );

    // Add squares for this row (12 months)
    for (let month = startMonth; month <= endMonth; month++) {
      if (month < fullMonths) {
        visualization += "🟦"; // Complete month
      } else if (month === fullMonths) {
        // Current month in progress
        if (partialMonth >= 0.75) {
          visualization += "🟪"; // Almost complete (75%+)
        } else if (partialMonth >= 0.5) {
          visualization += "🟩"; // More than half complete (50%+)
        } else if (partialMonth >= 0.25) {
          visualization += "🟨"; // Quarter complete (25%+)
        } else if (partialMonth > 0) {
          visualization += "🟧"; // Just started
        } else {
          visualization += "⬜"; // Exactly on month start
        }
      } else {
        visualization += "⬜"; // Future month
      }
    }

    // Add newline after each row
    if (row < totalRows - 1) {
      visualization += "\n\n";
    }
  }

  return visualization;
}

function SetDobForm({ setDob }: { setDob: (date: Date) => void }) {
  async function handleSubmit(values: { dob: Date }) {
    await LocalStorage.setItem("dob", values.dob.toISOString());
    setDob(values.dob);
    await showToast({
      style: Toast.Style.Success,
      title: "Date of birth saved",
    });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.DatePicker id="dob" title="Date of Birth" />
    </Form>
  );
}

function LifespanSettingsForm({
  currentLifespan,
  setLifespan,
}: {
  currentLifespan: number;
  setLifespan: (lifespan: number) => void;
}) {
  async function handleSubmit(values: { lifespan: string }) {
    const newLifespan = parseInt(values.lifespan);
    if (newLifespan >= 50 && newLifespan <= 120) {
      await LocalStorage.setItem("lifespan", newLifespan.toString());
      setLifespan(newLifespan);
      await showToast({
        style: Toast.Style.Success,
        title: `Life expectancy set to ${newLifespan} years`,
      });
    } else {
      await showToast({
        style: Toast.Style.Failure,
        title: "Please enter a value between 50 and 120 years",
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="lifespan"
        title="Life Expectancy (years)"
        placeholder="79"
        defaultValue={currentLifespan.toString()}
      />
      <Form.Description text="Common life expectancies: Japan (84), Switzerland (83), Australia (82), Canada (82), UK (81), USA (78), Global average (73)" />
    </Form>
  );
}

export default function Command() {
  const [dob, setDob] = useState<Date | null>(null);
  const [mortality, setMortality] = useState<string>("0.000000");
  const [lifespan, setLifespan] = useState<number>(79);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedDob = await LocalStorage.getItem<string>("dob");
      const storedLifespan = await LocalStorage.getItem<string>("lifespan");

      if (storedDob) {
        const date = new Date(storedDob);
        setDob(date);
        setMortality(calculateMortality(date));
      }

      if (storedLifespan) {
        setLifespan(parseInt(storedLifespan));
      }

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (dob) {
      const updateMortality = () => {
        setMortality(calculateMortality(dob));
      };

      updateMortality();
      const interval = setInterval(updateMortality, 100); // Update every 100ms for smooth display
      return () => clearInterval(interval);
    }
  }, [dob]);

  if (loading) {
    return <Detail markdown="# Loading..." />;
  }

  if (!dob) {
    return <SetDobForm setDob={setDob} />;
  }

  const yearsAsNumber = parseFloat(mortality.replace(/,/g, ""));
  const monthVisualization = generateMonthVisualization(
    yearsAsNumber,
    lifespan,
  );

  const totalMonthsLived = Math.floor(yearsAsNumber * 12);
  const lifespanMonths = lifespan * 12;
  const monthsRemaining = lifespanMonths - totalMonthsLived;

  const markdown = `
# Months Lived

## ${(yearsAsNumber * 12).toFixed(3)} months

*Time lived since birth, updating in real-time*

**Months lived:** ${totalMonthsLived} / ${lifespanMonths} (${((totalMonthsLived / lifespanMonths) * 100).toFixed(1)}%)
**Months remaining:** ${monthsRemaining > 0 ? monthsRemaining : 0}
**Life expectancy:** ${lifespan} years (${lifespanMonths} months)

### Visual Representation

${monthVisualization}

**Legend:**
- 🟦 Complete month lived (100%)
- 🟪 75%+ of current month completed  
- 🟩 50%+ of current month completed
- 🟨 25%+ of current month completed
- 🟧 Current month just started
- ⬜ Future months

---

**Born:** ${dob?.toLocaleDateString("en-GB") || "Not set"}  
**Current Time:** ${new Date().toLocaleString("en-GB")}  
**Months Completed:** ${totalMonthsLived}  
**Current Month Progress:** ${((totalMonthsLived % 1) * 100).toFixed(1)}%

This counter shows the precise amount of time you have been alive, 
calculated down to nanoseconds and updated continuously.
  `;

  // Generate compact progress bar for list view
  const progressPercentage = Math.round(
    (totalMonthsLived / lifespanMonths) * 100,
  );
  const totalSquares = 10;
  const filledSquares = Math.round((progressPercentage / 100) * totalSquares);
  const emptySquares = totalSquares - filledSquares;

  const compactProgress = "■".repeat(filledSquares) + "□".repeat(emptySquares);

  return (
    <List>
      <List.Item
        title="Months Lived"
        subtitle={`${compactProgress} ${progressPercentage}%`}
        accessories={[
          {
            text: `${totalMonthsLived}/${lifespanMonths} months`,
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
                      <Action
                        title="Refresh"
                        onAction={() =>
                          dob && setMortality(calculateMortality(dob))
                        }
                      />
                      <Action.Push
                        title="Set Life Expectancy"
                        target={
                          <LifespanSettingsForm
                            currentLifespan={lifespan}
                            setLifespan={setLifespan}
                          />
                        }
                      />
                      <Action.Push
                        title="Set Date of Birth"
                        target={<SetDobForm setDob={setDob} />}
                      />
                    </ActionPanel>
                  }
                />
              }
            />
            <Action
              title="Refresh"
              onAction={() => dob && setMortality(calculateMortality(dob))}
            />
            <Action.Push
              title="Set Life Expectancy"
              target={
                <LifespanSettingsForm
                  currentLifespan={lifespan}
                  setLifespan={setLifespan}
                />
              }
            />
            <Action.Push
              title="Set Date of Birth"
              target={<SetDobForm setDob={setDob} />}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
