"use client";

import { NextPage } from "next";
import { Header } from "@/containers";
import { Translate } from "@/containers";
import { SetupDialog } from "@/components";
import { HfTextProvider } from "@/providers/text/HfTextProvider";

const HfPage: NextPage = () => {
  return (
    <>
      <Header />
      <HfTextProvider>
        <Translate />
      </HfTextProvider>
      <SetupDialog />
    </>
  );
};

export default HfPage;


