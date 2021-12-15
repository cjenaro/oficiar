import { ActionFunction, redirect } from "remix";
import { db } from "~/db";

export let action: ActionFunction = async ({ request }) => {
  const body = Object.fromEntries(new URLSearchParams(await request.text()));
  const id = Number(body.update_id);

  await db.telegramLog.upsert({
    where: { id },
    update: {},
    create: {
      id,
      content: JSON.stringify(body.message),
    },
  });
  return redirect("/");
};

export default function Hook() {
  return <></>;
}
