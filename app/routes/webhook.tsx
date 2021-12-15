import { ActionFunction, redirect } from "remix";
import { db } from "~/db";

export let action: ActionFunction = async ({ request }) => {
  db.telegramLog.create({
    data: {
      content: await request.text(),
    },
  });
  return redirect("/");
};

export default function Hook() {
  return <></>;
}
