import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
  useLoaderData,
} from "remix";
import { db } from "~/db";
import stylesUrl from "../styles/webhook.css";

export let meta: MetaFunction = () => {
  return {
    title: "Oficiar | Webhook",
    description: "Logs del webhook.",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = async () => {
  return db.telegramLog.findMany();
};

export let action: ActionFunction = async ({ request }) => {
  const json = await request.json();
  const id = Number(json.update_id);

  await db.telegramLog.upsert({
    where: { id },
    update: {
      content: JSON.stringify(json.message),
    },
    create: {
      id,
      content: JSON.stringify(json.message),
    },
  });
  return redirect("/");
};

export default function Hook() {
  const data = useLoaderData();
  return (
    <div className="container">
      {data?.length ? (
        <ul>
          {data.map((item: { id: number; content: string }) => (
            <li key={item.id}>
              <pre>{JSON.stringify(JSON.parse(item.content), null, 2)}</pre>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
