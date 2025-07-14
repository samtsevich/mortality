import { Action, ActionPanel, Form, List, LocalStorage, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { calculateAge } from "./age";

export default function Command() {
  const [dob, setDob] = useState<Date | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedDob = await LocalStorage.getItem<string>("dob");
      if (storedDob) {
        const date = new Date(storedDob);
        setDob(date);
        setAge(calculateAge(date));
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (dob) {
      const interval = setInterval(() => {
        setAge(calculateAge(dob));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [dob]);

  if (loading) {
    return <List isLoading={true} />;
  }

  if (!dob) {
    return <SetDobForm setDob={setDob} />;
  }

  return (
    <List>
      <List.Item
        title="Your Age"
        subtitle={age || ""}
        actions={
          <ActionPanel>
            <Action.Push title="Set Date of Birth" target={<SetDobForm setDob={setDob} />} />
          </ActionPanel>
        }
      />
    </List>
  );
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
