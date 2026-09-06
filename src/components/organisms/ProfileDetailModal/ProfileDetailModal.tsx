import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Tabs from '@radix-ui/react-tabs'
import { Avatar } from '@/components/atoms/Avatar'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Text } from '@/components/atoms/Text'
import { FormField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
import { useToast } from '@/components/molecules/Toast'
import { api } from '@/lib/apiClient'
import { env } from '@/lib/env'
import { bloodGroups } from '@/content/bloodGroups'
import { editMemberSchema } from '@/validators/memberSchemas'
import type { EditMemberFormValues } from '@/validators/memberSchemas'
import type { Member } from '@/types/member'

export interface ProfileDetailModalProps {
  member: Member
  open: boolean
  onOpenChange: (open: boolean) => void
  canManage: boolean
  onUpdated: (updated: Member) => void
  onDeleted: (uniqueId: string) => void
}

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

function toEditFormValues(member: Member): EditMemberFormValues {
  return {
    Name: member.Name,
    Mobile: member.Mobile,
    RELATIONSHIP: member.RELATIONSHIP,
    DOB: member.DOB?.slice(0, 10) ?? '',
    Illam: member.Illam ?? '',
    Area: member.Area ?? '',
    PROFESSION: member.PROFESSION ?? '',
    EDUCATION: member.EDUCATION ?? '',
    Address: member.Address ?? '',
    AMMATH: member.AMMATH ?? '',
    GRAMAM: member.GRAMAM ?? '',
    VEDAM: member.VEDAM ?? '',
    GOTHRAM: member.GOTHRAM ?? '',
    BloodGroup: member.BloodGroup ?? '',
  }
}

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? fallback
  }
  return fallback
}

const tabTriggerClass =
  'rounded-pill px-3 py-1.5 font-body text-sm font-medium text-charcoal-600 transition-colors duration-150 hover:text-maroon-700 data-[state=active]:bg-maroon-700 data-[state=active]:text-cream-50'

export function ProfileDetailModal({ member, open, onOpenChange, canManage, onUpdated, onDeleted }: ProfileDetailModalProps) {
  const { showToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imageVersion, setImageVersion] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: toEditFormValues(member),
  })

  useEffect(() => {
    reset(toEditFormValues(member))
    setIsEditing(false)
  }, [member, reset])

  async function onSubmit(values: EditMemberFormValues) {
    // Only the fields that actually changed - resending every registered
    // field (react-hook-form always hands back the whole form) meant every
    // save silently rewrote untouched columns like DOB with whatever the
    // input currently held, which compounded a since-fixed backend
    // timezone bug into a slow, one-day-at-a-time DOB corruption.
    const original = toEditFormValues(member)
    const changed: Record<string, string> = {}
    Object.entries(values).forEach(([key, value]) => {
      const field = key as keyof EditMemberFormValues
      if (value && value !== original[field]) changed[key] = value
    })

    if (Object.keys(changed).length === 0) {
      setIsEditing(false)
      return
    }

    setSaving(true)
    try {
      await api.put('/member', { UNIQUEID: member.UNIQUEID, ...changed })
      showToast('Profile updated successfully!', 'success')
      setIsEditing(false)
      onUpdated({ ...member, ...values })
    } catch (err) {
      showToast(errorMessage(err, 'Failed to update profile.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await api.delete('/member', { params: { UNIQUEID: member.UNIQUEID } })
      showToast('Member deleted.', 'success')
      setConfirmDeleteOpen(false)
      onDeleted(member.UNIQUEID)
    } catch (err) {
      showToast(errorMessage(err, 'Failed to delete member.'), 'error')
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && file.size > MAX_IMAGE_BYTES) {
      setImageError('File is too large. Maximum size is 2 MB.')
      setImageFile(null)
      return
    }
    setImageFile(file ?? null)
    setImageError('')
  }

  async function onImageSubmit(e: FormEvent) {
    e.preventDefault()
    if (!imageFile) {
      showToast('Please select an image to upload.', 'warning')
      return
    }
    const form = new FormData()
    form.append('image', imageFile)
    setUploading(true)
    try {
      await api.post('/upload', form, {
        params: { UNIQUEID: member.UNIQUEID },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      showToast('Photo updated successfully.', 'success')
      setImageFile(null)
      setImageVersion((v) => v + 1)
    } catch (err) {
      showToast(errorMessage(err, 'Failed to upload image.'), 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange} title={member.Name} className="max-w-2xl">
        <div className="flex flex-col items-center gap-3">
          <Avatar
            src={`${env.apiBaseUrl}/image/${member.UNIQUEID}?v=${imageVersion}`}
            alt={member.Name}
            size="lg"
          />
          {canManage && (
            <form onSubmit={onImageSubmit} className="flex items-center gap-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-label="Upload photo"
                onChange={onFileChange}
                className="font-body text-sm"
              />
              <Button type="submit" size="sm" loading={uploading}>
                Upload
              </Button>
            </form>
          )}
          {imageError && (
            <Text size="sm" role="alert" className="text-error">
              {imageError}
            </Text>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6" noValidate>
          <Tabs.Root defaultValue="personal">
            <Tabs.List aria-label="Profile sections" className="flex gap-2 border-b border-charcoal-600/10 pb-3">
              <Tabs.Trigger value="personal" className={tabTriggerClass}>
                Personal Info
              </Tabs.Trigger>
              <Tabs.Trigger value="address" className={tabTriggerClass}>
                Address
              </Tabs.Trigger>
              <Tabs.Trigger value="additional" className={tabTriggerClass}>
                Additional Info
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="personal" className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="Name" error={errors.Name?.message}>
                <Input {...register('Name')} readOnly={!isEditing} />
              </FormField>
              <FormField label="Member No">
                <Input value={member.MemberNo} readOnly disabled />
              </FormField>
              <FormField label="Mobile" error={errors.Mobile?.message}>
                <Input {...register('Mobile')} readOnly={!isEditing} />
              </FormField>
              <FormField label="Date of Birth" error={errors.DOB?.message}>
                <Input type="date" {...register('DOB')} readOnly={!isEditing} />
              </FormField>
              <FormField label="Profession" error={errors.PROFESSION?.message}>
                <Input {...register('PROFESSION')} readOnly={!isEditing} />
              </FormField>
              <FormField label="Education" error={errors.EDUCATION?.message}>
                <Input {...register('EDUCATION')} readOnly={!isEditing} />
              </FormField>
            </Tabs.Content>

            <Tabs.Content value="address" className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="Illam" error={errors.Illam?.message}>
                <Input {...register('Illam')} readOnly={!isEditing} />
              </FormField>
              <FormField label="Area" error={errors.Area?.message}>
                <Input {...register('Area')} readOnly={!isEditing} />
              </FormField>
              <FormField label="Address" error={errors.Address?.message} className="sm:col-span-2">
                <Input {...register('Address')} readOnly={!isEditing} />
              </FormField>
            </Tabs.Content>

            <Tabs.Content value="additional" className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="Relationship" error={errors.RELATIONSHIP?.message}>
                <Input {...register('RELATIONSHIP')} readOnly={!isEditing} />
              </FormField>
              <FormField label="Blood Group" error={errors.BloodGroup?.message}>
                <select
                  {...register('BloodGroup')}
                  disabled={!isEditing}
                  className="h-11 w-full rounded-md border border-charcoal-600/25 bg-cream-50 px-3.5 font-body text-charcoal-900 transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Not set</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Ammath" error={errors.AMMATH?.message}>
                <Input {...register('AMMATH')} readOnly={!isEditing} />
              </FormField>
              <FormField label="Gramam" error={errors.GRAMAM?.message}>
                <Input {...register('GRAMAM')} readOnly={!isEditing} />
              </FormField>
              <FormField label="Vedam" error={errors.VEDAM?.message}>
                <Input {...register('VEDAM')} readOnly={!isEditing} />
              </FormField>
              <FormField label="Gothram" error={errors.GOTHRAM?.message}>
                <Input {...register('GOTHRAM')} readOnly={!isEditing} />
              </FormField>
            </Tabs.Content>
          </Tabs.Root>

          {canManage && (
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                intent="ghost"
                onClick={() => {
                  if (isEditing) reset(toEditFormValues(member))
                  setIsEditing((v) => !v)
                }}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              {isEditing && (
                <Button type="submit" loading={saving}>
                  Save Changes
                </Button>
              )}
              <Button type="button" intent="danger" onClick={() => setConfirmDeleteOpen(true)}>
                Delete
              </Button>
            </div>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete this member?"
        description={`This will permanently remove ${member.Name} from the family record. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  )
}
