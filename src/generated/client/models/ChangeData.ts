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
 * Change data object
 * @export
 * @interface ChangeData
 */
export interface ChangeData {
    /**
     * 1 day change
     * @type {string}
     * @memberof ChangeData
     */
    change1d?: string;
    /**
     * 1 month change
     * @type {string}
     * @memberof ChangeData
     */
    change1m?: string;
    /**
     * 1 year change
     * @type {string}
     * @memberof ChangeData
     */
    change1y?: string;
    /**
     * 3 years change
     * @type {string}
     * @memberof ChangeData
     */
    change3y?: string;
    /**
     * 5 years change
     * @type {string}
     * @memberof ChangeData
     */
    change5y?: string;
    /**
     * 10 years change
     * @type {string}
     * @memberof ChangeData
     */
    change10y?: string;
    /**
     * 15 years change
     * @type {string}
     * @memberof ChangeData
     */
    change15y?: string;
    /**
     * 20 years change
     * @type {string}
     * @memberof ChangeData
     */
    change20y?: string;
}

export function ChangeDataFromJSON(json: any): ChangeData {
    return ChangeDataFromJSONTyped(json, false);
}

export function ChangeDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChangeData {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'change1d': !exists(json, 'change1d') ? undefined : json['change1d'],
        'change1m': !exists(json, 'change1m') ? undefined : json['change1m'],
        'change1y': !exists(json, 'change1y') ? undefined : json['change1y'],
        'change3y': !exists(json, 'change3y') ? undefined : json['change3y'],
        'change5y': !exists(json, 'change5y') ? undefined : json['change5y'],
        'change10y': !exists(json, 'change10y') ? undefined : json['change10y'],
        'change15y': !exists(json, 'change15y') ? undefined : json['change15y'],
        'change20y': !exists(json, 'change20y') ? undefined : json['change20y'],
    };
}

export function ChangeDataToJSON(value?: ChangeData | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'change1d': value.change1d,
        'change1m': value.change1m,
        'change1y': value.change1y,
        'change3y': value.change3y,
        'change5y': value.change5y,
        'change10y': value.change10y,
        'change15y': value.change15y,
        'change20y': value.change20y,
    };
}

