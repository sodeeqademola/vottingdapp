import React from "react";

import { Button } from "@nextui-org/react";
import { Connector } from "../Utils/Connector";

export default function Home() {
  const connection = Connector();
  const getConnection = async () => {
    console.log(connection);
  };

  return (
    <div className="grid place-content-center h-screen">
      <Button className="text-3xl font-extrabold">
        Kenny Dont torch my Blockchain ooo 😂😁😎
      </Button>
    </div>
  );
}
