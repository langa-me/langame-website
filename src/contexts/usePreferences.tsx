import { doc } from "@firebase/firestore";
import { collection, DocumentData } from "firebase/firestore";
import * as React from "react";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";


type Preferences = DocumentData | undefined; // TODO
type ContextState = { preferences: Preferences };

const PreferencesContext =
  React.createContext<ContextState | undefined>(undefined);

interface PreferencesProviderProps {
  children: React.ReactNode;
}
const PreferencesProvider = (props: PreferencesProviderProps) => {
  const user = useUser();
  const firestore = useFirestore();
  const preferencesCollection = collection(firestore, "preferences");
  const preferenceDoc = doc(preferencesCollection, 
    // doc id random if not auth
    user.data?.uid || "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  );
  const prefObs = useFirestoreDocData(preferenceDoc, {
    idField: "id",
  });
  const value = {
    preferences: prefObs.data,
  };
  return (
    <PreferencesContext.Provider value={value}>
      {props.children}
    </PreferencesContext.Provider>
  );
};

/**
 * Hook to access the user context
 * @return{Preferences}
 */
function usePreferences(): Preferences {
  const context = React.useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error(
      "usePreferences must be used within a PreferencesContext"
    );
  }
  return context.preferences;
}

export { PreferencesProvider, usePreferences };
