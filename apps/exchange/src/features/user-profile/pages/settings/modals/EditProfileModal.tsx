import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '@agce/ui'
import { authApi } from '../../../../../lib/auth-api.js'
import { formatApiError } from '../../../../../lib/errors.js'
import type { UpdateMePayload } from '@agce/types'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialFirstName?: string
  initialLastName?: string
  initialAvatarUrl?: string
  onSubmit?: (data: { firstName: string; lastName: string; avatarFile: File | null }) => void
}

const DEFAULT_AVATAR = '/images/user.png'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function EditProfileModal({
  isOpen,
  onClose,
  initialFirstName = '',
  initialLastName = '',
  initialAvatarUrl = DEFAULT_AVATAR,
  onSubmit,
}: EditProfileModalProps) {
  const queryClient = useQueryClient()
  const [firstName, setFirstName] = useState(initialFirstName)
  const [lastName, setLastName] = useState(initialLastName)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(initialAvatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setFirstName(initialFirstName)
    setLastName(initialLastName)
    setAvatarFile(null)
    setAvatarPreview(initialAvatarUrl)
  }, [isOpen, initialFirstName, initialLastName, initialAvatarUrl])

  useEffect(() => {
    if (!avatarFile) return
    const objectUrl = URL.createObjectURL(avatarFile)
    setAvatarPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [avatarFile])

  const mutation = useMutation({
    mutationFn: (payload: UpdateMePayload) => authApi.updateMe(payload),
    onSuccess: (_, payload) => {
      toast.success('Profile updated')
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      onSubmit?.({
        firstName: payload.firstName ?? '',
        lastName: payload.lastName ?? '',
        avatarFile,
      })
      onClose()
    },
    onError: (error) => toast.error(formatApiError(error, 'Could not update profile.')),
  })

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatarFile(file)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedFirst = firstName.trim()
    const trimmedLast = lastName.trim()

    const payload: UpdateMePayload = {
      firstName: trimmedFirst,
      lastName: trimmedLast,
    }

    if (avatarFile) {
      try {
        payload.profilePicture = await fileToDataUrl(avatarFile)
      } catch {
        toast.error('Could not read selected image.')
        return
      }
    }

    mutation.mutate(payload)
  }

  const isDirty =
    firstName.trim() !== initialFirstName.trim() ||
    lastName.trim() !== initialLastName.trim() ||
    avatarFile !== null
  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0
  const canSubmit = isValid && isDirty && !mutation.isPending

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      subtitle="Avatar and nickname will also be applied to your profile. Abusing them might lead to community penalties."
    >
      <form className="profile_form" onSubmit={handleSubmit}>
        <div
          className="user_img"
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            overflow: 'visible',
            alignSelf: 'center',
            backgroundColor: '#2E333B',
          }}
        >
          <img
            src={avatarPreview}
            alt="Profile avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
          <button
            type="button"
            className="edit_user"
            aria-label="Change avatar"
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#555353',
              border: '2px solid #181A20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <i className="ri-pencil-line" style={{ fontSize: 14, color: '#fff', lineHeight: 1 }} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            id="profileImageUpload"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden-file-input"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="emailinput">
          <label htmlFor="edit-profile-first-name">First Name</label>
          <div className="d-flex">
            <input
              id="edit-profile-first-name"
              type="text"
              placeholder="Enter first name"
              maxLength={50}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
        </div>

        <div className="emailinput">
          <label htmlFor="edit-profile-last-name">Last Name</label>
          <div className="d-flex">
            <input
              id="edit-profile-last-name"
              type="text"
              placeholder="Enter last name"
              maxLength={50}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
        </div>

        <button
          type="submit"
          className="submit"
          disabled={!canSubmit}
          style={{
            backgroundColor: canSubmit ? 'var(--color-primary, #D1AA67)' : '#FFFFFF40',
            color: canSubmit ? '#000' : '#FFFFFF80',
            fontWeight: 600,
            fontSize: 15,
            padding: '12px 24px',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s ease',
          }}
        >
          {mutation.isPending ? 'Saving…' : 'Submit'}
        </button>
      </form>
    </Modal>
  )
}
