import React from "react";

/**
 * Component properties
 */
interface Props {
  providers: React.FC[];
}

/**
 * Api provider component
 *
 * @param props component properties
 */
const ApiProvider: React.FC<Props> = ({ providers, children }) => {
  if (!providers.length) {
    return <>{ children }</>;
  }

  const Provider = providers[0];

  return (
    <Provider>
      <ApiProvider providers={ providers.slice(1) }>
        { children }
      </ApiProvider>
    </Provider>
  );
};

export default ApiProvider;