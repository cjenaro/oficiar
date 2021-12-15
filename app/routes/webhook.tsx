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

function getVcardValue(str: string) {
  return str.slice(str.indexOf(":") + 1);
}

export let action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  const id = Number(body.update_id);
  const content = JSON.stringify(body.message);
  const isContact = !!body?.message?.contact?.phone_number;

  if (isContact) {
    const contact = body?.message?.contact;
    const titleIndex = contact?.vcard.indexOf("TITLE:");
    const titleStart =
      titleIndex != -1 ? body?.message?.contact?.vcard.slice(titleIndex + 6) : "";
    const [title] = titleStart.split(/\n/);
    await db.trader.upsert({
      where: {
        number: contact.phone_number,
      },
      create: {
        number: contact.phone_number,
        name: contact.first_name + " " + contact.last_name,
        trade: title,
      },
      update: {},
    });
  }

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
