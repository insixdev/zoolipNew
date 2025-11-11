import React, { createContext, useContext, useState } from "react";

type InstitutionRequestContextType = {
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
};

const InstitutionRequestContext = createContext<
  InstitutionRequestContextType | undefined
>(undefined);

export function InstitutionRequestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  return (
    <InstitutionRequestContext.Provider value={{ submitted, setSubmitted }}>
      {children}
    </InstitutionRequestContext.Provider>
  );
}

export function useInstitutionRequest() {
  const ctx = useContext(InstitutionRequestContext);
  if (!ctx)
    throw new Error(
      "useInstitutionRequest must be used within InstitutionRequestProvider"
    );
  return ctx;
}

export default InstitutionRequestContext;
