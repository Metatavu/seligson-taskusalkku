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
import {
    TransactionType,
    TransactionTypeFromJSON,
    TransactionTypeFromJSONTyped,
    TransactionTypeToJSON,
} from './';

/**
 * Portfolio transaction object
 * @export
 * @interface PortfolioTransaction
 */
export interface PortfolioTransaction {
    /**
     * Portfolio transaction ID in UUID format
     * @type {string}
     * @memberof PortfolioTransaction
     */
    readonly id?: string;
    /**
     * Security ID
     * @type {string}
     * @memberof PortfolioTransaction
     */
    readonly securityId?: string;
    /**
     * Target security ID. Only available when transaction type is security
     * @type {string}
     * @memberof PortfolioTransaction
     */
    readonly targetSecurityId?: string;
    /**
     * 
     * @type {TransactionType}
     * @memberof PortfolioTransaction
     */
    transactionType: TransactionType;
    /**
     * Date of fund value
     * @type {Date}
     * @memberof PortfolioTransaction
     */
    readonly valueDate: Date;
    /**
     * Fund value in euros
     * @type {string}
     * @memberof PortfolioTransaction
     */
    readonly value: string;
    /**
     * Total share amount
     * @type {string}
     * @memberof PortfolioTransaction
     */
    readonly shareAmount: string;
    /**
     * Market value in euros
     * @type {string}
     * @memberof PortfolioTransaction
     */
    readonly marketValue: string;
    /**
     * Total value in euros
     * @type {string}
     * @memberof PortfolioTransaction
     */
    readonly totalValue: string;
    /**
     * Date when transaction is completed
     * @type {Date}
     * @memberof PortfolioTransaction
     */
    readonly paymentDate?: Date;
    /**
     * Provision price in euros
     * @type {string}
     * @memberof PortfolioTransaction
     */
    readonly provision: string;
}

export function PortfolioTransactionFromJSON(json: any): PortfolioTransaction {
    return PortfolioTransactionFromJSONTyped(json, false);
}

export function PortfolioTransactionFromJSONTyped(json: any, ignoreDiscriminator: boolean): PortfolioTransaction {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'securityId': !exists(json, 'securityId') ? undefined : json['securityId'],
        'targetSecurityId': !exists(json, 'targetSecurityId') ? undefined : json['targetSecurityId'],
        'transactionType': TransactionTypeFromJSON(json['transactionType']),
        'valueDate': (new Date(json['valueDate'])),
        'value': json['value'],
        'shareAmount': json['shareAmount'],
        'marketValue': json['marketValue'],
        'totalValue': json['totalValue'],
        'paymentDate': !exists(json, 'paymentDate') ? undefined : (new Date(json['paymentDate'])),
        'provision': json['provision'],
    };
}

export function PortfolioTransactionToJSON(value?: PortfolioTransaction | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'transactionType': TransactionTypeToJSON(value.transactionType),
    };
}


