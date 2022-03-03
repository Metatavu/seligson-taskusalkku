/* tslint:disable */
/* eslint-disable */
/**
 * Taskusalkku API-spec
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    Meeting,
    MeetingFromJSON,
    MeetingToJSON,
    MeetingTime,
    MeetingTimeFromJSON,
    MeetingTimeToJSON,
} from '../models';

export interface CreateMeetingRequest {
    meeting: Meeting;
}

export interface ListMeetingTimesRequest {
    startDate?: Date;
    endDate?: Date;
}

/**
 * 
 */
export class MeetingsApi extends runtime.BaseAPI {

    /**
     * Creates a new meeting.
     * Create a meeting.
     */
    async createMeetingRaw(requestParameters: CreateMeetingRequest): Promise<runtime.ApiResponse<Meeting>> {
        if (requestParameters.meeting === null || requestParameters.meeting === undefined) {
            throw new runtime.RequiredError('meeting','Required parameter requestParameters.meeting was null or undefined when calling createMeeting.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/meetings`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: MeetingToJSON(requestParameters.meeting),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => MeetingFromJSON(jsonValue));
    }

    /**
     * Creates a new meeting.
     * Create a meeting.
     */
    async createMeeting(requestParameters: CreateMeetingRequest): Promise<Meeting> {
        const response = await this.createMeetingRaw(requestParameters);
        return await response.value();
    }

    /**
     * Returns list of meeting times
     * Lists meeting times
     */
    async listMeetingTimesRaw(requestParameters: ListMeetingTimesRequest): Promise<runtime.ApiResponse<Array<MeetingTime>>> {
        const queryParameters: any = {};

        if (requestParameters.startDate !== undefined) {
            queryParameters['startDate'] = (requestParameters.startDate as any).toISOString().substr(0,10);
        }

        if (requestParameters.endDate !== undefined) {
            queryParameters['endDate'] = (requestParameters.endDate as any).toISOString().substr(0,10);
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/meetingTimes`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(MeetingTimeFromJSON));
    }

    /**
     * Returns list of meeting times
     * Lists meeting times
     */
    async listMeetingTimes(requestParameters: ListMeetingTimesRequest): Promise<Array<MeetingTime>> {
        const response = await this.listMeetingTimesRaw(requestParameters);
        return await response.value();
    }

}
