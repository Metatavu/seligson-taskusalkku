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

import { exists, mapValues } from '../runtime';
/**
 * Portfolio statistics object
 * @export
 * @interface PortfolioSummary
 */
export interface PortfolioSummary {
    /**
     * Subscriptions in euros
     * @type {string}
     * @memberof PortfolioSummary
     */
    readonly subscriptions: string;
    /**
     * Redemptions in euros
     * @type {string}
     * @memberof PortfolioSummary
     */
    readonly redemptions: string;
}

export function PortfolioSummaryFromJSON(json: any): PortfolioSummary {
    return PortfolioSummaryFromJSONTyped(json, false);
}

export function PortfolioSummaryFromJSONTyped(json: any, ignoreDiscriminator: boolean): PortfolioSummary {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'subscriptions': json['subscriptions'],
        'redemptions': json['redemptions'],
    };
}

export function PortfolioSummaryToJSON(value?: PortfolioSummary | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
    };
}


