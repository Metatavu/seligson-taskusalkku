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
 * Portfolio history value object
 * @export
 * @interface PortfolioHistoryValue
 */
export interface PortfolioHistoryValue {
    /**
     * History entry date
     * @type {Date}
     * @memberof PortfolioHistoryValue
     */
    date?: Date;
    /**
     * History entry value in euros
     * @type {string}
     * @memberof PortfolioHistoryValue
     */
    readonly value?: string;
}

export function PortfolioHistoryValueFromJSON(json: any): PortfolioHistoryValue {
    return PortfolioHistoryValueFromJSONTyped(json, false);
}

export function PortfolioHistoryValueFromJSONTyped(json: any, ignoreDiscriminator: boolean): PortfolioHistoryValue {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'date': !exists(json, 'date') ? undefined : (new Date(json['date'])),
        'value': !exists(json, 'value') ? undefined : json['value'],
    };
}

export function PortfolioHistoryValueToJSON(value?: PortfolioHistoryValue | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'date': value.date === undefined ? undefined : (value.date.toISOString().substr(0,10)),
    };
}

