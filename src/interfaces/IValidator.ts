interface IValidator {
  "operator_address": string,
  "consensus_pubkey": {
    "type_url": string,
    "value": string
  },
  "jailed": boolean,
  "status": string,
  "tokens": string,
  "delegator_shares": string,
  "description": {
    "moniker": string,
    "identity": string,
    "website": string,
    "security_contact": string,
    "details": string
  },
  "unbonding_height": string,
  "unbonding_time": string,
  "commission": {
    "commission_rates": {
      "rate": string,
      "max_rate": string,
      "max_change_rate": string
    },
    "update_time": string
  },
  "min_self_delegation": string,
  "rank"?: number,
  "voting_power"?: string,
  "avatar"?: string
}

export default IValidator;