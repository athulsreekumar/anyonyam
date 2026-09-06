import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Tabs from '@radix-ui/react-tabs'
import { Search as SearchIcon } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Text } from '@/components/atoms/Text'
import { FormField } from '@/components/molecules/FormField'
import { DirectoryResultCard } from '@/components/molecules/DirectoryResultCard'
import { useToast } from '@/components/molecules/Toast'
import { api } from '@/lib/apiClient'
import { professionSearchSchema } from '@/validators/directorySchemas'
import type { ProfessionSearchFormValues } from '@/validators/directorySchemas'
import { bloodGroups } from '@/content/bloodGroups'
import type { BloodDonorResult, ProfessionResult } from '@/types/directory'

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? fallback
  }
  return fallback
}

const tabTriggerClass =
  'rounded-pill px-4 py-2 font-body text-sm font-medium text-charcoal-600 transition-colors duration-150 hover:text-maroon-700 data-[state=active]:bg-maroon-700 data-[state=active]:text-cream-50'

export function DirectorySearch() {
  const { showToast } = useToast()
  const [professionResults, setProfessionResults] = useState<ProfessionResult[] | null>(null)
  const [professionLoading, setProfessionLoading] = useState(false)
  const [bloodGroup, setBloodGroup] = useState('')
  const [donorResults, setDonorResults] = useState<BloodDonorResult[] | null>(null)
  const [donorLoading, setDonorLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionSearchFormValues>({ resolver: zodResolver(professionSearchSchema), defaultValues: { query: '' } })

  async function onSearchProfession(values: ProfessionSearchFormValues) {
    setProfessionLoading(true)
    try {
      const { data } = await api.get<ProfessionResult[]>('/directory/profession', { params: { query: values.query } })
      setProfessionResults(data)
    } catch (err) {
      showToast(errorMessage(err, 'Search failed. Please try again.'), 'error')
    } finally {
      setProfessionLoading(false)
    }
  }

  async function onSelectBloodGroup(group: string) {
    setBloodGroup(group)
    if (!group) {
      setDonorResults(null)
      return
    }
    setDonorLoading(true)
    try {
      const { data } = await api.get<BloodDonorResult[]>('/directory/blood-donors', { params: { group } })
      setDonorResults(data)
    } catch (err) {
      showToast(errorMessage(err, 'Search failed. Please try again.'), 'error')
    } finally {
      setDonorLoading(false)
    }
  }

  async function requestContact(targetUniqueId: string, context: string) {
    try {
      await api.post('/contact-requests', { targetUniqueId, context })
      showToast('Request sent.', 'success')
    } catch (err) {
      showToast(errorMessage(err, 'Failed to send the request.'), 'error')
      throw err
    }
  }

  return (
    <Tabs.Root defaultValue="profession">
      <Tabs.List aria-label="Directory search type" className="flex gap-2">
        <Tabs.Trigger value="profession" className={tabTriggerClass}>
          Profession
        </Tabs.Trigger>
        <Tabs.Trigger value="blood-donors" className={tabTriggerClass}>
          Blood Donors
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="profession" className="mt-6">
        <form onSubmit={handleSubmit(onSearchProfession)} className="flex items-start gap-3" noValidate>
          <FormField label="Profession" error={errors.query?.message} className="flex-1">
            <Input placeholder="e.g. Doctor, Lawyer, Electrician" {...register('query')} />
          </FormField>
          <Button type="submit" loading={professionLoading} className="mt-6">
            <SearchIcon aria-hidden className="h-4 w-4" />
            Search
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          {professionResults?.length === 0 && <Text tone="muted">No members found for that profession.</Text>}
          {professionResults?.map((r) => (
            <DirectoryResultCard
              key={r.UNIQUEID}
              name={r.Name}
              matchedLabel="Profession"
              matchedValue={r.PROFESSION}
              onRequestContact={() => requestContact(r.UNIQUEID, `Found via Profession search: ${r.PROFESSION}`)}
            />
          ))}
        </div>
      </Tabs.Content>

      <Tabs.Content value="blood-donors" className="mt-6">
        <FormField label="Blood group">
          <select
            value={bloodGroup}
            onChange={(e) => onSelectBloodGroup(e.target.value)}
            className="h-11 w-full max-w-xs rounded-md border border-charcoal-600/25 bg-cream-50 px-3.5 font-body text-charcoal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500"
          >
            <option value="">Select a blood group</option>
            {bloodGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </FormField>

        <div className="mt-6 flex flex-col gap-3">
          {donorLoading && <Text tone="muted">Searching…</Text>}
          {!donorLoading && donorResults?.length === 0 && (
            <Text tone="muted">No donors found for that blood group.</Text>
          )}
          {!donorLoading &&
            donorResults?.map((r) => (
              <DirectoryResultCard
                key={r.UNIQUEID}
                name={r.Name}
                matchedLabel="Blood Group"
                matchedValue={r.BloodGroup}
                onRequestContact={() => requestContact(r.UNIQUEID, `Found via Blood Donor search: ${r.BloodGroup}`)}
              />
            ))}
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}
