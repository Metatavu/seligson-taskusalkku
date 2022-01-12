/* eslint-disable object-shorthand */
import * as React from "react";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAnonymousAuth, selectAuth } from "../../features/auth/auth-slice";
import { CreateMeetingRequest, ListMeetingTimesRequest, Meeting, MeetingTime, MeetingType } from "../../generated/client";
import { MeetingsApiContextType } from "../../types";

const initialMeeting: Meeting = { contact: { firstName: "", lastName: "" }, type: MeetingType.Meeting, language: "fi", participantCount: 0, time: new Date() };

/**
 * Portfolios api context initialization
 */
export const MeetingsApiContext = React.createContext<MeetingsApiContextType>({
  createMeeting: async () => (initialMeeting),
  listMeetingTimes: async () => []
});

/**
 * Portfolios API provider component
 *
 * @param props component properties
 */
const MeetingsApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectAuth);
  const anonymousAuth = useAppSelector(selectAnonymousAuth);

  /**
   * Lists portfolios with given request parameters
   *
   * @param params given request parameters
   * @returns list of portfolios or promise reject
   */
  const createMeeting = async (params: CreateMeetingRequest): Promise<Meeting> => {
    try {
      if (!anonymousAuth) {
        throw new Error("No access token");
      }

      return await Api.getMeetingsApi(auth || anonymousAuth).createMeeting(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Lists portfolios with given request parameters
   *
   * @param params given request parameters
   * @returns list of portfolios or promise reject
   */
  const listMeetingTimes = async (params: ListMeetingTimesRequest): Promise<MeetingTime[]> => {
    try {
      if (!anonymousAuth) {
        throw new Error("No access token");
      }

      return await Api.getMeetingsApi(auth || anonymousAuth).listMeetingTimes(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <MeetingsApiContext.Provider
      value={{
        createMeeting,
        listMeetingTimes
      }}
    >
      { children }
    </MeetingsApiContext.Provider>
  );
};

export default MeetingsApiProvider;