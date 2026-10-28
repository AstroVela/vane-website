import type {AgentUseCase} from '../../content/useCases'
import SolutionPreview from './SolutionPreview'
import MeetingExperience from './MeetingExperience'
import SupportExperience from './SupportExperience'
import EquipmentExperience from './EquipmentExperience'
import PersonalExperience from './PersonalExperience'
import MarketingExperience from './MarketingExperience'
import CommerceExperience from './CommerceExperience'
import '../../solutionPages.css'

export default function CaseExperience({scenario, compact = false}: {scenario: AgentUseCase; compact?: boolean}) {
  if (compact) return <SolutionPreview scenario={scenario} compact />
  switch (scenario.id) {
    case 'meeting-intelligence': return <MeetingExperience />
    case 'customer-support': return <SupportExperience />
    case 'equipment-diagnosis': return <EquipmentExperience />
    case 'personal-work': return <PersonalExperience />
    case 'marketing-campaigns': return <MarketingExperience />
    case 'commerce-sales': return <CommerceExperience />
  }
}
