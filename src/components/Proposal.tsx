// Типизация
import IProposalProps from "../interfaces/IProposalProps";

// Мой код
import { tweakProposalType, tweakProposalStatus, tweakProposalPeriod } from "../utils/formatting";



function Proposal(props: IProposalProps) {

  const currentProposal = props.proposal;

  return (
    <div className="proposal">
      <h3 className="proposal__title">#{currentProposal.proposal_id} {currentProposal.content.title}</h3>
      <p className="proposal__data"><span>Type: </span>{tweakProposalType(currentProposal.content['@type'])}</p>
      <p className="proposal__data"><span>Status: </span>{tweakProposalStatus(currentProposal.status)}</p>
      <p className="proposal__data"><span>Voting Start: </span>{tweakProposalPeriod(currentProposal.voting_start_time)}</p>
      <p className="proposal__data"><span>Voting End: </span>{tweakProposalPeriod(currentProposal.voting_end_time)}</p>
      <p className="proposal__description">{currentProposal.content.description}</p>
    </div>
  )
}

export default Proposal;