interface IProposal {
  "proposal_id": string,
  "content": {
      "@type": string,
      "title": string,
      "description": string,
      "plan": {
          "name": string,
          "time": string,
          "height": string,
          "info": string,
          "upgraded_client_state": any
      }
  },
  "status": string,
  "final_tally_result": {
      "yes": string,
      "abstain": string,
      "no": string,
      "no_with_veto": string
  },
  "submit_time": string,
  "deposit_end_time": string,
  "total_deposit": [
      {
          "denom": string,
          "amount": string
      }
  ],
  "voting_start_time": string,
  "voting_end_time": string
}

export default IProposal;