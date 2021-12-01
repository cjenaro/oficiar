import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { Link } from "react-router-dom";

import stylesUrl from "../styles/index.css";
import { prisma } from "~/db";
import { Trader } from "@prisma/client";

export let meta: MetaFunction = () => {
  return {
    title: "Oficiar",
    description: "Lista de contactos con puntajes.",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = async () => {
  const traders = prisma.trader.findMany();
  return traders
};

function Contact({ name, rating, description, number, trade }: Trader) {
  return (
    <div className="contact">
      <h4>{name}</h4>
      <p className="rating">
        {rating}{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </p>
      <p className="description">{description}</p>
      <a className="number" href={`tel:${number}`}>{number}</a>
      <p className="trade">{trade}</p>
    </div>
  );
}

export default function Index() {
  let data = useLoaderData<Trader[]>();

  return (
    <div className="container">
      <Link to="/new" className="add">
        Agregar contacto
      </Link>
      <h2>Contactos:</h2>
      <div className="list">
        {data.map((contact) => (
          <Contact {...contact} key={contact.id} />
        ))}
      </div>
    </div>
  );
}
