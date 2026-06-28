import { User } from 'lucide-react';
import Avatar from 'boring-avatars';

type Props = {
  size: number;
  username: string | undefined | null;
};

export default function UserAvatar({ size, username }: Props) {
  if (username) {
    return (
      <Avatar
        size={size}
        name={username}
        variant="beam"
        colors={['#0A0310', '#49007E', '#FF005B', '#FF7D10', '#FFB238']}
      />
    );
  }
  return <User size={size} />;
}
