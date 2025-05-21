import { useState } from "react";
import { AppContext } from "./AppContext";
import { TFinalJson } from "@features/builder/Builder.types";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentRoute, setCurrentRoute] = useState<string>("login");
  const [finalJson, setFinalJson] = useState<TFinalJson[]>([]);
  const [initialJson, setInitialJson] = useState<TFinalJson[]>([]);
  const [uploadedDbq, setUploadedDbq] = useState<string | null>(null);

  return (
    <AppContext
      value={{
        currentRoute,
        setCurrentRoute,
        finalJson,
        setFinalJson,
        initialJson,
        setInitialJson,
        uploadedDbq,
        setUploadedDbq,
      }}
    >
      {children}
    </AppContext>
  );
};
