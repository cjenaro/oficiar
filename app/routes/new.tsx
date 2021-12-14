import { db } from "~/db";
import { MetaFunction, LinksFunction, ActionFunction, redirect } from "remix";

import stylesUrl from "../styles/new.css";

export let meta: MetaFunction = () => {
  return {
    title: "Nuevo contacto | Oficiar",
    description: "Agregar un nuevo contacto.",
  };
};

export let action: ActionFunction = async ({ request }) => {
  const body = Object.fromEntries(new URLSearchParams(await request.text()));
  await db.trader.create({
    data: {
      ...body,
      rating: Number.isNaN(Number(body.rating)) ? 0 : Number(body.rating),
    },
  });
  return redirect("/");
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function NewContact() {
  return (
    <div className="container">
      <h2>Nuevo contacto</h2>
      <form method="post">
        <label htmlFor="name">
          Nombre:
          <input type="text" id="name" name="name" />
        </label>
        <label htmlFor="rating">
          Puntaje:
          <input
            type="range"
            min="0"
            max="10"
            id="rating"
            name="rating"
            step="1"
          />
        </label>
        <label htmlFor="description">
          Notas:
          <textarea id="description" name="description"></textarea>
        </label>
        <label htmlFor="number">
          Número de teléfono:
          <input type="tel" id="number" name="number" />
        </label>
        <label htmlFor="trade">
          Ocupación:
          <input type="text" id="trade" name="trade" />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
