import * as SC from './Avatar.styled'

type AvatarProps = {
  name?: string
  imgSrc?: string
  className?: string
}

export default function Avatar({ name, imgSrc, className }: AvatarProps) {
  if (imgSrc) {
    return (
      <SC.ImageAvatar className={className}>
        <img src={imgSrc} alt={name} width='24' height='24' />
      </SC.ImageAvatar>
    )
  }

  return <SC.DefaultAvatar className={className}>{name?.charAt(0)}</SC.DefaultAvatar>
}
