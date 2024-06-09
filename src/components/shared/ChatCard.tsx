import { Models } from "appwrite";

type UserCardProps = {
  user: Models.Document;
  onClick?: () => void;
};

const ChatCard = ({ user, onClick }: UserCardProps) => {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <div className="flex flex-1 gap-5 items-center ">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14"
        />

        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
      </div>
    </div>
  );
};

export default ChatCard;
