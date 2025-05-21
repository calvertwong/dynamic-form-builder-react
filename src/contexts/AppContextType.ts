import { TFinalJson } from "@features/builder/Builder.types";

export type AppContextType = {
  currentRoute: string;
  setCurrentRoute: React.Dispatch<React.SetStateAction<string>>;
  finalJson: TFinalJson[];
  setFinalJson: React.Dispatch<React.SetStateAction<TFinalJson[]>>;
  initialJson: TFinalJson[];
  setInitialJson: React.Dispatch<React.SetStateAction<TFinalJson[]>>;
  uploadedDbq: string | null;
  setUploadedDbq: React.Dispatch<React.SetStateAction<string | null>>;
};
