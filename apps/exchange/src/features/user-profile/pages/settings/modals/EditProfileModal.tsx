import { Modal } from '@agce/ui'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      subtitle="Avatar and nickname will also be applied to your profile. Abusing them might lead to community penalties."
    >
      <form className="profile_form">
        <div className="user_img">
          <img src="/images/user.png" alt="user" />
          <label htmlFor="profileImageUpload" className="edit_user">
            <img src="/images/edit_icon.svg" alt="edit" />
          </label>
          <input
            type="file"
            id="profileImageUpload"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden-file-input"
          />
        </div>

        <div className="emailinput">
          <label>First Name</label>
          <div className="d-flex">
            <input
              type="text"
              placeholder="Enter first name"
              maxLength={50}
              defaultValue="Demo"
            />
          </div>
        </div>

        <div className="emailinput">
          <label>Last Name</label>
          <div className="d-flex">
            <input
              type="text"
              placeholder="Enter last name"
              maxLength={50}
              defaultValue="User"
            />
          </div>
        </div>

        <button type="button" className="submit" onClick={onClose}>
          Submit
        </button>
      </form>
    </Modal>
  )
}
