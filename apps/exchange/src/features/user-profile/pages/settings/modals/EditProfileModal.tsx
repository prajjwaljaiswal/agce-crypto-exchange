import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Modal } from '@agce/ui'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialFirstName?: string
  initialLastName?: string
  initialAvatarUrl?: string
  onSubmit?: (data: { firstName: string; lastName: string; avatarFile: File | null }) => void
}

const DEFAULT_AVATAR = '/images/user.png'

export function EditProfileModal({
  isOpen,
  onClose,
  initialFirstName = 'Demo',
  initialLastName = 'User',
  initialAvatarUrl = DEFAULT_AVATAR,
  onSubmit,
}: EditProfileModalProps) {
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatarFile(file)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit?.({ firstName: firstName.trim(), lastName: lastName.trim(), avatarFile })
    onClose()
  }

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0

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
              objectFit: 'none',
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
            />
          </div>
        </div>

        <button
          type="submit"
          className="submit"
          disabled={!isValid}
          style={{
            backgroundColor: isValid ? 'var(--color-primary, #D1AA67)' : '#FFFFFF40',
            color: isValid ? '#000' : '#FFFFFF80',
            fontWeight: 600,
            fontSize: 15,
            padding: '12px 24px',
            cursor: isValid ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s ease',
          }}
        >
          Submit
        </button>
      </form>
    </Modal>
  )
}
