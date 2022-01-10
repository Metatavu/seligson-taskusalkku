/* eslint-disable object-shorthand */
import React from "react";
import Config from "../../app/config";
import { PublicationDetails, PublicationType, PublicationsApiContextType, Publication } from "../../types";

const initialPublicationDetails: PublicationDetails = {
  id: 0,
  author: [],
  content: "",
  date: "",
  title: "",
  type: PublicationType.POST
};

/**
 * Publications API context initialization
 */
export const PublicationsApiContext = React.createContext<PublicationsApiContextType>({
  listPublications: async () => [],
  findPublicationDetails: async () => initialPublicationDetails
});

/**
 * Publications API provider component
 *
 * @param props component properties
 */
const PublicationsApiProvider: React.FC = ({ children }) => {
  /**
   * Lists publications with given request parameters
   *
   * @returns promise of list of publications
   */
  const listPublications = async (): Promise<Publication[]> => {
    const response = await fetch(`${Config.getStatic().blogApiUrl}?bloglist&limit=all`);
    return await response.json() as Publication[];
  };

  /**
   * Finds publication details with given ID
   *
   * @param id publication ID
   * @returns promise of publication details
   */
  const findPublicationDetails = async (id: number): Promise<PublicationDetails | undefined> => {
    const response = await fetch(`${Config.getStatic().blogApiUrl}?post&id=${id}`);

    const responseBody = (await response.text()).trim();

    if (!responseBody.startsWith("{") && !responseBody.startsWith("[")) {
      return undefined;
    }

    const responseJson = JSON.parse(responseBody);

    return Array.isArray(responseJson) ? responseJson[0] : responseJson;
  };

  /**
   * Component render
   */
  return (
    <PublicationsApiContext.Provider value={{ listPublications, findPublicationDetails }}>
      { children }
    </PublicationsApiContext.Provider>
  );
};

export default PublicationsApiProvider;