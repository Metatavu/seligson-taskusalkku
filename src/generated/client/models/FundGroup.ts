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

/**
 * Fund group enum
 * @export
 * @enum {string}
 */
export enum FundGroup {
    Passive = 'PASSIVE',
    Active = 'ACTIVE',
    Balanced = 'BALANCED',
    FixedIncome = 'FIXED_INCOME',
    Dimension = 'DIMENSION',
    Spiltan = 'SPILTAN'
}

export function FundGroupFromJSON(json: any): FundGroup {
    return FundGroupFromJSONTyped(json, false);
}

export function FundGroupFromJSONTyped(json: any, ignoreDiscriminator: boolean): FundGroup {
    return json as FundGroup;
}

export function FundGroupToJSON(value?: FundGroup | null): any {
    return value as any;
}

