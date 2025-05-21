import { createContext } from "react";
import { AppContextType } from "./AppContextType";

export const AppContext = createContext<AppContextType>({
  currentRoute: "login",
  setCurrentRoute: () => null,
  finalJson: [],
  setFinalJson: () => null,
  initialJson: [],
  setInitialJson: () => null,
  uploadedDbq: null,
  setUploadedDbq: () => null,
});
