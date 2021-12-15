import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
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
  const body = await request.json();
  const id = Number(body.update_id);
  const content = JSON.stringify(body.message);

  await db.telegramLog.upsert({
    where: { id },
    update: {
      content,
    },
    create: {
      id,
      content,
    },
  });
  return json(
    {},
    {
      status: 200,
    }
  );
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
