interface StatusPillProps {
  enabled: boolean
}

export function StatusPill({ enabled }: StatusPillProps) {
  return (
    <div className={`tf-sec-page__status${enabled ? ' is-on' : ''}`}>
      <div className="tf_checkfill">
        <i className="ri-check-fill"></i>
      </div>
      <span>{enabled ? 'Enabled' : 'Off'}</span>
    </div>
  )
}
