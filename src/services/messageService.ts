export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface Message {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface InboxItem {
  listingId: string;
  listingTitle: string;
  messages: {
    id: string;
    content: string;
    senderName: string;
    createdAt: string;
  }[];
}

const MOCK_PROFILE: Profile = {
  id: "mock-user-123",
  full_name: "Mock User",
  phone: "11999999999",
  avatar_url: null,
};

const MOCK_INBOX_ITEMS: InboxItem[] = [
  {
    listingId: "mock-listing-1",
    listingTitle: "Mock Apartment",
    messages: [
      {
        id: "msg-1",
        content: "Hello, is this still available?",
        senderName: "Mock Buyer 1",
        createdAt: new Date().toISOString()
      }
    ]
  }
];

export const messageService = {
  async fetchSellerProfile(userId: string): Promise<Profile | null> {
    console.log(`Mock fetchSellerProfile called for ${userId}`);
    return { ...MOCK_PROFILE, id: userId };
  },

  async updateProfile(userId: string, data: Partial<Profile>): Promise<void> {
    console.log(`Mock updateProfile called for ${userId} with`, data);
    return Promise.resolve();
  },

  async sendMessage(listingId: string, receiverId: string, content: string): Promise<void> {
    console.log(`Mock sendMessage called: listing ${listingId}, receiver ${receiverId}, content: ${content}`);
    return Promise.resolve();
  },

  async fetchInbox(userId: string): Promise<InboxItem[]> {
    console.log(`Mock fetchInbox called for ${userId}`);
    return MOCK_INBOX_ITEMS;
  },
};
