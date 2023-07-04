interface IAvatarProps {
  name?: string
  imgSrc?: string
  className?: string
}

export default function Avatar({ name, imgSrc, className }: IAvatarProps) {
  if (imgSrc) {
    return (
      <div
        className={className}
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <img src={imgSrc} alt={name} width='24' height='24' />
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: '#eaeaea',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: 600,
        color: '#333',
      }}
    >
      {name?.charAt(0)}
    </div>
  )
}
