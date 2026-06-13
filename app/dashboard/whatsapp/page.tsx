import { getWhatsappData } from '@/app/actions/whatsapp'
import { WhatsAppPageClient } from '@/components/dashboard/whatsapp-page'

export default async function WhatsAppPage() {
  const data = await getWhatsappData()

  return <WhatsAppPageClient initialData={data} />
}
