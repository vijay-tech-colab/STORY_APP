// New ChatSection component
function ChatSection() {
  // Dummy random chats data
  const chats = [
    {
      id: 1,
      user: "Amit",
      avatar: "https://i.pravatar.cc/50?img=1",
      lastMessage: "Hey! How's it going?",
      time: "2h ago",
    },
    {
      id: 2,
      user: "Sneha",
      avatar: "https://i.pravatar.cc/50?img=2",
      lastMessage: "Loved your story!",
      time: "45m ago",
    },
    {
      id: 3,
      user: "Raj",
      avatar: "https://i.pravatar.cc/50?img=3",
      lastMessage: "Let's catch up later.",
      time: "1d ago",
    },
    {
      id: 4,
      user: "Neha",
      avatar: "https://i.pravatar.cc/50?img=4",
      lastMessage: "Sent you the files.",
      time: "3d ago",
    },
    {
      id: 5,
      user: "Arjut",
      avatar: "https://i.pravatar.cc/50?img=1",
      lastMessage: "Hey! what's up Bro ?",
      time: "6h ago",
    }
    
  ];

  return (
    <div className="chat-section">
      <h2 className="chat-title">We can't chats</h2>
      <div className="chat-list">
        {chats.map(({ id, user, avatar, lastMessage, time }) => (
          <div className="chat-item" key={id}>
            <img src={avatar} alt={`${user} avatar`} className="chat-avatar" />
            <div className="chat-info">
              <div className="chat-user">{user}</div>
              <div className="chat-message">{lastMessage}</div>
            </div>
            <div className="chat-time">{time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatSection