import React from "react";

import { Inter } from "next/font/google";
import Link from "next/link";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const index = () => {
  return (
    <main className={`${inter.className} bg-schemes-light-surfaceContainer`}>
      <div className="flex flex-col gap-4 w-11/12 mx-auto bg-schemes-light-surfaceContainerLowest p-4 h-[94.5vh] rounded-3xl">
        <p>que es dShips</p>

        <p>
          En ciertos lugares del mundo para recibir un paquete de una compra es
          necesario dar datos para corroborar que uno es el dueño del paquete,
          imaginemos que compramos un televisor de 70 pulgadas, y para recibirlo
          necesito dar mi nombre completo, mi id o dni, sumado a la dirección de
          mi casa que es explícita, y un paquete que es demasiado evidente. Tal
          vez no quisiera dar tantos datos pero de igual manera corroborar que
          soy el dueño del paquete. Por esto surge dShips, un sistema con la
          idea de realizar mensajerias de paquetes sin revelar información
          innecesaria.
        </p>
      </div>
    </main>
  );
};

export default index;
