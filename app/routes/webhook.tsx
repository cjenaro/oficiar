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
  const file_id = body?.message?.document?.file_id;
  const fileName = body?.message?.document?.file_name;

  const getFileUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT}/getFile?file_id=${file_id}`;

  const fileResponse = await fetch(getFileUrl).then((blob) => blob.json());
  const filePath = fileResponse?.result?.file_path;

  if (!!fileResponse?.ok && !!filePath) {
    const blob = await fetch(
      `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT}/${filePath}`
    ).then((res) => res.blob());
    const buffer = await blob.text();

    const parts = buffer.split(/\n/);
    const [, , , , name, title, role, tel] = parts;
    await db.trader.upsert({
      where: {
        number: getVcardValue(tel),
      },
      create: {
        number: getVcardValue(tel),
        name: getVcardValue(name),
        trade: getVcardValue(title) || getVcardValue(role),
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
