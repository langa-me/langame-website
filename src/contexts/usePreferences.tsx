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
  const preferenceDoc = doc(user.data?.uid ? preferencesCollection : collection(firestore, "usages") ,
    // doc id random if not auth
    user.data?.uid || "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  );
  const {data: pref, status} = useFirestoreDocData(preferenceDoc, {
    idField: "id",
  });
  const value = {
    preferences: status === "success" && user.data?.uid ? pref : undefined,
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
