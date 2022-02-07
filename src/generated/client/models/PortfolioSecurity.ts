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
 * Portfolio fund object
 * @export
 * @interface PortfolioSecurity
 */
export interface PortfolioSecurity {
    /**
     * security ID. Can be used to search security details.
     * @type {string}
     * @memberof PortfolioSecurity
     */
    readonly id: string;
    /**
     * Amount of funds
     * @type {string}
     * @memberof PortfolioSecurity
     */
    readonly amount: string;
    /**
     * Purchase value in euros
     * @type {string}
     * @memberof PortfolioSecurity
     */
    readonly purchaseValue: string;
    /**
     * Total value in euros
     * @type {string}
     * @memberof PortfolioSecurity
     */
    readonly totalValue: string;
}

export function PortfolioSecurityFromJSON(json: any): PortfolioSecurity {
    return PortfolioSecurityFromJSONTyped(json, false);
}

export function PortfolioSecurityFromJSONTyped(json: any, ignoreDiscriminator: boolean): PortfolioSecurity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'amount': json['amount'],
        'purchaseValue': json['purchaseValue'],
        'totalValue': json['totalValue'],
    };
}

export function PortfolioSecurityToJSON(value?: PortfolioSecurity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
    };
}

